var args = arguments[0] || {};

//estre l'anno corrente
var years = Alloy.Collections.instance("utente");
years.fetch({query: 'select * from utente where anno = '+args });

if(years.length>0){
	//crea una view relatore per ogni relatore dell'anno selezionato
	for(var i=0;i<years.length;i++){
		var model=years.at(i);
		var id=model.get("id");
		var relatorView = Alloy.createController("relatore",id).getView();
		$.relatoriContent.add(relatorView);
		//refresh della query che viene sostituita da quella del controller "relatore"
		years.fetch({query: 'select * from utente where anno = '+args });
	}
}
else{
	//dati non disponibili
	var title=Titanium.UI.createLabel();
	var text=Titanium.UI.createLabel();
	this.addClass(title,"titleLabel");
	this.addClass(text,"textContainer");
	title.text="Relatore";
	text.text="Dati non disponibili!";
	$.relatoriContent.add(title);
	$.relatoriContent.add(titolo_abstract);
}

