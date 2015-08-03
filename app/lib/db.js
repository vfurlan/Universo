var utenti = Alloy.Collections.instance("utente");
utenti.fetch();
var home = Alloy.Collections.instance("mission");
home.fetch();

var url= "http://valente666.altervista.com/web_service.php";

exports.clearDB = function() {
	while(utenti.length) { 
	    utenti.at(0).destroy(); 
	}
	while(home.length) { 
	    home.at(0).destroy(); 
	}
};

exports.saveDB = function() {
	var client = Ti.Network.createHTTPClient({
	     // function called when the response data is available
	     onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);
			
			exports.clearDB();
			
			myData = JSON.parse(this.responseText);
			for(var i=0; i<myData.utenti.length;i++){
				// Crea un modello di tipo 'utente'
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
			for(var i=0; i<myData.home.length;i++){
				// Crea un modello di tipo 'home'
				var model = Alloy.createModel('mission', {
					anno: myData.home[i].anno,
				    testo: myData.home[i].testo
				});
			
				// aggiungi un modello alla collezione
				home.add(model);
			
				// salva il modello
				model.save();
			}
			//alert("database caricato!");
	     },
	     // function called when an error occurs, including a timeout
	     onerror : function(e) {
	         Ti.API.debug(e.error);
	     },
	     timeout : 5000  // in milliseconds
	 });
	
	// Prepare the connection.
	client.open("GET", url);
	// Send the request.
	client.send();
};
