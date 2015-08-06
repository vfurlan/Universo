var args = arguments[0] || {};

var parser = require('parser');

var date = new Date();
var currentYear = date.getFullYear();

var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where anno = '+currentYear });

if(utenti.length>0){
	var buttons = new Array();
	for (var i = 0; i < utenti.length; i++) {
		var relatore = utenti.at(i).get("relatore");
		var id = utenti.at(i).get("id");
		relatore = parser.replaceTag(relatore);
		buttons[i] = Titanium.UI.createButton({title: relatore, titleid:id});
		buttons[i].addEventListener('click', function(e) {
			Ti.App.fireEvent("changeView", {
				row : {
					customView: "",
					className: "evento",
					value: e.source.titleid
				}
			});
	    });
	    this.addClass(buttons[i],"button");
	
		$.buttonsView.add(buttons[i]);
	}
}
else{
	var textLabel = Titanium.UI.createLabel();
	this.addClass(textLabel,"textContainer");
	textLabel.text = "Nessun evento disponibile!";
	textLabel.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
	$.buttonsView.add(textLabel);
}

