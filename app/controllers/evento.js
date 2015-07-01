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
		var titolo_abstract=Titanium.UI.createLabel();
		this.addClass(title,"titleLabel");
		this.addClass(image,"imageView");
		this.addClass(titolo_abstract,"titoloAbstractLabel");
		title.text=data[i].nome+" "+data[i].cognome;
		image.image="http://web.fe.infn.it/u/gambetti/venerdi/img/"+getStringNoSpace(data[i].cognome)+".jpg";
		titolo_abstract.text=model.get("titolo_abstract");
		$.fotoView.add(title);
		$.fotoView.add(image);
		$.fotoView.add(titolo_abstract);
	}
	$.textCvLabel.text=replaceTag(model.get("cv"));
	$.textAbstractLabel.text=replaceTag(model.get("abstract"));
	
	
	
	
	
	var ind = Titanium.UI.createProgressBar({
		top:10,
		width:250,
		height:'auto',
		min:0,
		max:1,
		value:0,
		color:'#fff',
		message: 'Downloading...',
		font: {fontSize:14, fontWeight:'bold'},
		style: Titanium.UI.iPhone.ProgressBarStyle
	});
	$.eventoContent.add(ind);
	
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			ind.message="Download complete!";
			Ti.API.info('PDF downloaded to applicationDataDirectory/Bresadola.pdf');
			
			var dir;
			if (Ti.Platform.osname === 'android')
				dir=Ti.Filesystem.externalStorageDirectory;
			else
				dir=Ti.Filesystem.applicationDataDirectory;
			file = Ti.Filesystem.getFile(dir,'Bresadola.pdf');
			file.write(this.responseData); // write to the file
			
			Ti.Android.currentActivity.startActivity(Ti.Android.createIntent({
				action:Ti.Android.ACTION_VIEW,
				type:'application/pdf',
				data:file.getNativePath()}));
			Ti.API.info(file.getNativePath());
		},
		timeout: 10000
	});
	xhr.open('GET','http://www.fe.infn.it/venerdi/VENERDIHOME_file/pdf2015/Bresadola.pdf');
	xhr.send();
	xhr.ondatastream = function(e) {
		ind.value = e.progress ;
		Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
	};
	
	
	
	
	/*
	var videoPlayer = Titanium.Media.createVideoPlayer({
	    top : 10,
	    autoplay : true,
	    backgroundColor : 'blue',
	    height : 300,
	    width : 300,
	    mediaControlStyle : Titanium.Media.VIDEO_CONTROL_DEFAULT,
	    scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
	});
	 
	videoPlayer.url = 'https://www.youtube.com/watch?v=JwowlWH0ZRk';
	$.eventoContent.add(videoPlayer);*/
	
	/*try {
		var videoPlayer = Ti.Platform.openURL('https://www.youtube.com/watch?v=JwowlWH0ZRk');
		$.eventoContent.add(videoPlayer);
		}
	catch(e){}*/
	
	var content = "<div align='center'><iframe width='270' height='220' src='http://www.youtube.com/embed/JwowlWH0ZRk' frameborder='0' allowfullscreen></iframe></div>";
	var video = Ti.UI.createWebView({html: content});
	this.addClass(video,"youtubeView");
	$.eventoContent.add(video);
	 
	//Ti.Platform.openURL('http://www.youtube.com/embed/US7xaxyFETI?rel=0'); // use this to play the video
	 
	

}
else{
	var title=Titanium.UI.createLabel();
	var titolo_abstract=Titanium.UI.createLabel();
	this.addClass(title,"titleLabel");
	this.addClass(titolo_abstract,"titoloAbstractLabel");
	title.text="Relatore";
	titolo_abstract.text=model.get("Dati non disponibili!");
	$.fotoView.add(title);
	$.fotoView.add(titolo_abstract);
	$.textCvLabel.text="Dati non disponibili!";
	$.textAbstractLabel.text="Dati non disponibili!";
}

