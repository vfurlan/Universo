var converter = require('converter');

//imposto le dimensioni del menu
var dimMonitor=Ti.Platform.displayCaps.dpi;
var dimMenu=dimMonitor*0.7;
var dimHalfMenu=dimMonitor*0.35;
var minDimMenu=dimMonitor*0.1;

//animazione per spostare il menu verso destra
var animateRight = Ti.UI.createAnimation({
	left : dimMenu,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

//animazione per chiudere il menu
var animateReset = Ti.UI.createAnimation({
	left : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

//animazione per spostare il menu verso sinistra
var animateLeft = Ti.UI.createAnimation({
	left : -dimMenu,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

//imposto variabili per la gestione del menu
var touchStartX = 0;
var touchRightStarted = false;
var touchLeftStarted = false;
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
	if ($.movableview.left >= dimHalfMenu && touchRightStarted) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	}
	else if ($.movableview.left <= -dimHalfMenu && touchLeftStarted) {
		direction = "left";
		$.movableview.animate(animateLeft);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
	});
	touchRightStarted = false;
	touchLeftStarted = false;
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
		
			if (newLeft > 5 && !touchLeftStarted && !touchRightStarted) {
				touchRightStarted = true;
				Ti.App.fireEvent("sliderToggled", {
					hasSlided : false,
					direction : "right"
				});
			}
			else if (newLeft < -5 && !touchRightStarted && !touchLeftStarted) {
				touchLeftStarted = true;
				Ti.App.fireEvent("sliderToggled", {
					hasSlided : false,
					direction : "left"
				});
			}
		}
	}
	
});

//gestisce l'apertura e chiusura del menu alla pressione del tasto di sinistra 'Menu'
$.leftButton.addEventListener('touchend', function(e) {
	if (!touchRightStarted && !touchLeftStarted) {
		if(buttonPressed==false){
			buttonPressed = true;
			$.toggleLeftSlider();
		}
		else{
			if(direction=="right"){
				buttonPressed = false;
				$.toggleRightSlider();
			}
			else {
				$.toggleLeftSlider();
				$.toggleLeftSlider();
			}
		}
	}
});

//gestisce l'apertura verso destra e la chiusura del menu
exports.toggleLeftSlider = function() {
	if (!hasSlided) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
	});
};

//gestisce l'apertura verso sinistra e la chiusura del menu
exports.toggleRightSlider = function() {
	if (!hasSlided) {
		direction = "left";
		$.movableview.animate(animateLeft);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
    });
};

//gestisce la rotazione del telefono
exports.handleRotation = function() {
	$.movableview.width = $.navview.width = $.contentview.width = Ti.Platform.displayCaps.platformWidth;
	$.movableview.height = $.navview.height = $.contentview.height = Ti.Platform.displayCaps.platformHeight;
};

// Visualizza la vista selezionata nel menu di sinistra
$.leftTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.toggleLeftSlider();
	buttonPressed=false;
});

// Visualizza la vista selezionata nel menu di sinistra
Ti.App.addEventListener('changeView', function selectRow(e) {
	rowSelect(e);
});

//imposta quale menu viene visualizzato e quale nascosto sotto
Ti.App.addEventListener("sliderToggled", function(e) {
	if (e.direction == "right") {
		$.leftMenu.zIndex = 2;
		$.rightMenu.zIndex = 1;
	} else if (e.direction == "left") {
		$.leftMenu.zIndex = 1;
		$.rightMenu.zIndex = 2;
	}
});

//apre e sostituisce la vista corrente con quella selezionata dal menu
function rowSelect(e) {
	if (currentView.id != e.row.customView) {
		$.contentview.remove(currentView);
		currentView = Alloy.createController(e.row.className,e.row.value).getView();
		$.contentview.add(currentView);
	}
}


















//creazione del menu
var leftData = [];
var rightData = [];

var titles=["Home Page","Programma","Edizioni Precedenti","Contatti","Dove siamo"];
var classNames=["home_page","programma","edizioni_precedenti","contatti","dove_siamo"];

for(var i=0; i<titles.length; i++){
	var row = Titanium.UI.createTableViewRow({height:"50",width:"100%",backgroundColor:"#3D4654",leftImage:"/bookmark-128.png",left:"5%"});
	row.title=titles[i];
	row.className=classNames[i];
	leftData.push(row);
}

// Pass data to widget leftTableView and rightTableView
$.leftTableView.data = leftData;
/*$.rightTableView.data = rightData;*/

//apertura della vista 'nome_page' e impostazione come vista corrente
var currentView = Alloy.createController("home_page").getView();
$.contentview.add(currentView);











//connessione al db remoto e salvataggio in quello locale
var db = require('db');
db.saveDB();




//apertura  dell'applicazione
if (Ti.Platform.osname === 'iphone')
	$.index.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.index.open();
