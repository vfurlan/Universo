var args = arguments[0] || {};

var date = new Date();
var currentYear = date.getFullYear();

var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select distinct anno from utente where anno < '+currentYear });

if(utenti.length>0){
	var buttons = new Array();
	for (var i = 0; i < utenti.length; i++) {
		var year = utenti.at(i).get("anno");
		buttons[i] = Titanium.UI.createButton({title: year, titleid: year});
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
	var textLabel = Titanium.UI.createLabel();
	this.addClass(textLabel,"textContainer");
	textLabel.text = "Nessuna edizione precedente!";
	textLabel.textAlign = Ti.UI.TEXT_ALIGNMENT_CENTER;
	$.buttonsView.add(textLabel);
}

