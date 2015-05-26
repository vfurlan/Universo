var args = arguments[0] || {};

var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where anno = 2015' });
alert(utenti.length);

var buttons = new Array();
for (var i = 0; i < utenti.length; i++) {
	buttons[i] = Titanium.UI.createButton({title: utenti.at(i).relatore});
	buttons[i].addEventListener('click', function(e) {
       alert(e.source.title);
    });
    this.addClass(buttons[i],"button");

	$.programmaContent.add(buttons[i]);
}



