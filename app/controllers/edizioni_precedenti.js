var args = arguments[0] || {};

//estrazione dell'anno corrente
var date = new Date();
var currentYear = date.getFullYear();

//estrazione dei relatori dell'anno selezionato'
var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select distinct anno from utente where anno < '+currentYear });

if(utenti.length>0){
	var buttons = new Array();
	for (var i = 0; i < utenti.length; i++) {
		var year = utenti.at(i).get("anno");
		buttons[i] = Titanium.UI.createButton({title: year, titleid: year});
		//alla pressione del bottone creato, spara un evento di changeView
		//con l'anno dell'evento selezionato
		buttons[i].addEventListener('click', function(e) {
			Ti.App.fireEvent("changeView", {
				row : {
					customView: "",
					className: "relatori",
					value: e.source.titleid
				}
			});
	    });
	    this.addClass(buttons[i],"button");
		$.buttonsView.add(buttons[i]);
	}
}
else{
	//non ci sono edizioni precedenti nel database
	var textLabel = Titanium.UI.createLabel();
	this.addClass(textLabel,"textContainer");
	textLabel.text = "Nessuna edizione precedente!";
	textLabel.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
	$.buttonsView.add(textLabel);
}

