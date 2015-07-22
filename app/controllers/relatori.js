var args = arguments[0] || {};

var years = Alloy.Collections.instance("utente");
years.fetch({query: 'select * from utente where anno = '+args });

if(years.length>0){
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
	var title=Titanium.UI.createLabel();
	var text=Titanium.UI.createLabel();
	this.addClass(title,"titleLabel");
	this.addClass(text,"textContainer");
	title.text="Relatore";
	text.text="Dati non disponibili!";
	$.relatoriContent.add(title);
	$.relatoriContent.add(titolo_abstract);
}

