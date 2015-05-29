var args = arguments[0] || {};

function replaceTag(str){
	str = str.replace(/\|/g, "\n");
	str = str.replace(/&/g, " ");
	str = str.replace(/_/g, " ");
	str = str.replace(/<br>/g, "\n");
	str = str.replace(/<p>/g, "");
	str = str.replace(/<\/p>/g, "");
	return str;
}


function getData(str){
	var relatori=[];
	var utenti=str.split(/\|/g);
	for(var i=0; i< utenti.length;i++){
		var ut=utenti[i].split(/&/g);
		var nome=ut[0];
		nome=nome.replace(/_/g, " ");
		var cognome=ut[1];
		cognome=cognome.replace(/_/g, " ");
		var utente={
			"nome":nome,
			"cognome":cognome
		};
		relatori.push(utente);
	}
	return relatori;
}

function getStringNoSpace(str){
	str=str.replace(/ /g, "");
	return str;
}


var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where id = '+args });

if(utenti.length>0){
	var model=utenti.at(0);
	var data=getData(model.get("relatore"));
	for(var i=0;i<data.length;i++){
		var title=Titanium.UI.createLabel();
		var image=Titanium.UI.createImageView();
		this.addClass(title,"titleLabel");
		this.addClass(image,"imageView");
		title.text=data[i].nome+" "+data[i].cognome;
		image.image="http://web.fe.infn.it/u/gambetti/venerdi/img/"+getStringNoSpace(data[i].cognome)+".jpg";
		$.fotoView.add(title);
		$.fotoView.add(image);
	}
	$.textLabel.text=replaceTag(model.get("cv"));
	this.addClass($.textLabel,"textContainer");
}
else{
	$.textLabel.text="Dati non disponibili!";
}

