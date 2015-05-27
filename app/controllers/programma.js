var args = arguments[0] || {};

var data = new Date();
var anno = data.getFullYear();

var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where anno = '+anno });

if(utenti.length>0){
	var buttons = new Array();
	for (var i = 0; i < utenti.length; i++) {
		var relatore = utenti.at(i).get("relatore");
		relatore = relatore.replace("|", "\n");
		relatore = relatore.replace("&", " ");
		relatore = relatore.replace("_", " ");
		buttons[i] = Titanium.UI.createButton({title: relatore});
		buttons[i].addEventListener('click', function(e) {
	       alert(e.source.title);
	    });
	    this.addClass(buttons[i],"button");
	
		$.programmaContent.add(buttons[i]);
	}
}
else{
	$.textLabel.text="Nessun evento disponibile!";
}

