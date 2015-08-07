//caricamento modulo per la conversione della risoluzione da pixels a dpi
var converter = require('converter');


/************************************************************************
 * 																		*
 * Gestione DB															*
 *  																	*
 ************************************************************************/

//connessione al db remoto e salvataggio in quello locale
var db = require('db');
db.saveDB();


/************************************************************************
 * 																		*
 * Dimensioni del menu 													*
 *  																	*
 ************************************************************************/

//imposto le dimensioni del menu
var dimMonitor,dimMenu;
if (Ti.Platform.osname === 'android'){
	dimMonitor = converter.pixelsToDp(Ti.Platform.displayCaps.platformWidth);
}
else{
	dimMonitor=Ti.Platform.displayCaps.platformWidth;
}
if (dimMonitor > 350) {
	dimMenu=250;
}
else{
	dimMenu=dimMonitor*0.7;
}
var dimHalfMenu=dimMenu*0.5;
var minDimMenu=dimMonitor*0.1;


/************************************************************************
 * 																		*
 * Creazione del menu													*
 *  																	*
 ************************************************************************/

//creazione del menu
var leftData = [];

var titles=["Home Page","Programma","Edizioni Precedenti","Contatti","Dove siamo"];
var classNames=["home_page","programma","edizioni_precedenti","contatti","dove_siamo"];

for(var i=0; i<titles.length; i++){
	var row = Titanium.UI.createTableViewRow({height:"50",width:"100%",backgroundColor:"#3D4654",left:"5%"});
	if (dimMonitor <= 160){
		row.leftImage="/bookmark-32.png";
	}
	else if (dimMonitor <= 320){
		row.leftImage="/bookmark-64.png";
	}
	else {
		row.leftImage="/bookmark-128.png";
	}
	row.title=titles[i];
	row.className=classNames[i];
	leftData.push(row);
}

//passo i dati del menu al widget leftTableView
$.leftTableView.data = leftData;

//apertura della vista 'nome_page' e impostazione come vista corrente
var currentView = Alloy.createController("home_page").getView();
var nameCurrentView = "home_page";
$.contentview.add(currentView);


/************************************************************************
 * 																		*
 * Gestione del menu e della visualizzazione delle viste				*
 *  																	*
 ************************************************************************/

//animazione per spostare il menu verso destra
var animateRight = Ti.UI.createAnimation({
	left : dimMenu,
	//curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 200
});

//animazione per chiudere il menu
var animateReset = Ti.UI.createAnimation({
	left : 0,
	//curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 200
});

//imposto variabili per la gestione del menu
var touchStartX = 0;
var touchSlideStarted = false;
var buttonPressed = false;
var hasSlided = false;
var direction = "reset";

//rileva la posizione del dito quando si tocca lo schermo
$.movableview.addEventListener('touchstart', function(e) {
	if (Ti.Platform.osname === 'android'){
		touchStartX = converter.pixelsToDp(e.x);
	}
	else{
		touchStartX = e.x;
	}
});

//gestice lo slide del menu quando il dito viene alzato dallo schermo
$.movableview.addEventListener('touchend', function(e) {
	if (buttonPressed) {
		buttonPressed = false;
		return;
	}
	if ($.movableview.left >= dimHalfMenu && touchSlideStarted) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	}
	else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	touchSlideStarted = false;
});

//gestice lo slide del menu mentre il dito non viene alzato dallo schermo
$.movableview.addEventListener('touchmove', function(e) {
	var coords = $.movableview.convertPointToView({
		x : e.x,
		y : e.y
	}, $.containerview);
	var newLeft;
	if (Ti.Platform.osname === 'android'){
		newLeft = converter.pixelsToDp(coords.x) - touchStartX;
	}
	else{
		newLeft = coords.x - touchStartX;
	}
	if(touchStartX<minDimMenu){
		if ((newLeft <= dimMenu && newLeft > 0) || 
			(newLeft < 0 && newLeft >= -dimMenu)) {
			$.movableview.left = newLeft;
			
			if (newLeft > 5 && !touchSlideStarted) {
				touchSlideStarted = true;
			}
		}
	}
	
});

//gestisce l'apertura e chiusura del menu alla pressione del tasto di sinistra 'Menu'
$.leftButton.addEventListener('touchend', function(e) {
	if (!touchSlideStarted) {
		if(buttonPressed==false){
			buttonPressed = true;
			$.toggleSlider();
		}
		else{
			if(direction=="right"){
				buttonPressed = false;
				$.toggleSlider();
			}
		}
	}
});

//gestisce l'apertura verso destra e la chiusura del menu
exports.toggleSlider = function() {
	if (!hasSlided) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
};

//gestisce la rotazione del telefono
exports.handleRotation = function() {
	$.movableview.width = $.navview.width = $.contentview.width = Ti.Platform.displayCaps.platformWidth;
	$.movableview.height = $.navview.height = $.contentview.height = Ti.Platform.displayCaps.platformHeight;
};

// Visualizza la vista selezionata nel menu di sinistra
$.leftTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.toggleSlider();
	buttonPressed=false;
});

// Visualizza la vista selezionata nel menu di sinistra
Ti.App.addEventListener('changeView', function selectRow(e) {
	rowSelect(e);
});

//apre e sostituisce la vista corrente con quella selezionata dal menu
function rowSelect(e) {
	if (currentView.id != e.row.customView) {
		$.contentview.remove(currentView);
		currentView = Alloy.createController(e.row.className,e.row.value).getView();
		nameCurrentView = e.row.className;
		$.contentview.add(currentView);
	}
}

//indica quale vista da sostituire alla pressione del tasto (o bottone) back
function comeBack() {
	var className;
	switch(nameCurrentView){
		case "programma":
			className = "home_page";
			break;
		case "edizioni_precedenti":
			className = "home_page";
			break;
		case "contatti":
			className = "home_page";
			break;
		case "dove_siamo":
			className = "home_page";
			break;
		case "evento":
			className = "programma";
			break;
		case "relatori":
			className = "edizioni_precedenti";
			break;
		default:
			if (Ti.Platform.osname === 'android')
				$.win.close();
			else
				//apple non permette di chiudere le app e quindi si imposta
				//un className particolare invece di chiudere l'app
				className = "apple";
	}
	
	//spara un'evento indicando la vista da caricare
	if (className != 'apple'){
		Ti.App.fireEvent("changeView", {
			row : {
				customView: "",
				className: className,
				value: ""
			}
		});
	}
}

//chiama la funzione comeBack alla pressione del tasto back
$.win.addEventListener('androidback', function(e) {
	comeBack();
});

//chiama la funzione comeBack alla pressione del bottone back
$.rightButton.addEventListener('click', function(e) {
	comeBack();
});



/************************************************************************
 * 																		*
 * Apertura applicazione												*
 *  																	*
 ************************************************************************/

//apertura  dell'applicazione
if (Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad')
	$.win.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.win.open();
