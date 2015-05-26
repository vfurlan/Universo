//converti i pixels in dpi
function pixelsToDp(pixels){
    if ( Ti.Platform.displayCaps.dpi > 160 )
        return (pixels / (Ti.Platform.displayCaps.dpi / 160));
    else 
        return pixels;
}

//converte i dpi in pixels
function dpToPixels(dp){
    if ( Ti.Platform.displayCaps.dpi > 160 )
          return (dp * (Ti.Platform.displayCaps.dpi / 160));
    else 
        return dp;
}

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
		touchStartX = pixelsToDp(e.x);
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
		newLeft = pixelsToDp(coords.x) - touchStartX;
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

//gestisce l'apertura e chiusura del menu alla pressione del tasto di destra 'Menu2'
$.rightButton.addEventListener('touchend', function(e) {
	if (!touchRightStarted && !touchLeftStarted) {
		if(buttonPressed==false){
			buttonPressed = true;
			$.toggleRightSlider();
		}
		else{
			if(direction=="left"){
				buttonPressed = false;
				$.toggleLeftSlider();
			}
			else {
				$.toggleRightSlider();
				$.toggleRightSlider();
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
$.rightTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.toggleRightSlider();
	buttonPressed=false;
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
		currentView = Alloy.createController(e.row.className).getView();
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
$.rightTableView.data = rightData;

//apertura della vista 'nome_page' e impostazione come vista corrente
var currentView = Alloy.createController("home_page").getView();
$.contentview.add(currentView);


















var utenti = Alloy.Collections.instance("utente");
utenti.fetch();

var url= "http://valente666.altervista.com/web_service.php";

function cancellaDB() {
	while(utenti.length) { 
	    utenti.at(0).destroy(); 
	}
}

var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
		Ti.API.info("Received text: " + this.responseText);
		
		cancellaDB();
		
		myData = JSON.parse(this.responseText);
		for(var i=0; i<myData.utenti.length;i++){
			// Crea un modello di tipo 'book'
			var model = Alloy.createModel('utente', {
				anno: myData.utenti[i].anno,
			    relatore: myData.utenti[i].relatore,
			    cv: myData.utenti[i].cv,
			    abstract: myData.utenti[i].abstract,
			    serata: myData.utenti[i].serata,
			    titolo_abstract: myData.utenti[i].titolo_abstract,
			    orario: myData.utenti[i].orario,
			    video: myData.utenti[i].video,
			    pdf: myData.utenti[i].pdf,
			    youtube: myData.utenti[i].youtube
			});
		
			// aggiungi un modello alla collezione
			utenti.add(model);
		
			// salva il modello
			model.save();
		}
		alert("database caricato!");
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
         alert('error');
     },
     timeout : 5000  // in milliseconds
 });

// Prepare the connection.
client.open("GET", url);
// Send the request.
client.send();

//test
//var utente = utenti.at(0);
//alert(utente.get("anno"));







//apertura  dell'applicazione
if (Ti.Platform.osname === 'iphone')
	$.index.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.index.open();
