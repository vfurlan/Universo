var args = arguments[0] || {};

//caricamento dei moduli necessari
var parser = require('parser');
var pdf = require('pdf');

//estraggo dal db i dati dell'utente indicato
var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where id = '+args });

if(utenti.length>0){
	var model=utenti.at(0);
	var data=parser.getData(model.get("relatore"));
	//stampa nome, cognome, foto e titolo dell'abstract del/i relatore/i selezionato/i
	for(var i=0;i<data.length;i++){
		var title=Titanium.UI.createLabel();
		var image=Titanium.UI.createImageView();
		var titolo_abstract=Titanium.UI.createLabel();
		this.addClass(title,"titleLabel");
		this.addClass(image,"imageView");
		this.addClass(titolo_abstract,"titoloAbstractLabel");
		title.text=data[i].nome+" "+data[i].cognome;
		image.image="http://web.fe.infn.it/u/gambetti/venerdi/img/"+parser.getStringNoSpace(data[i].cognome)+".jpg";
		titolo_abstract.text=model.get("titolo_abstract");
		$.fotoView.add(title);
		$.fotoView.add(image);
		$.fotoView.add(titolo_abstract);
	}
	//stampa CV, abstarct e orario dell'evento
	$.textCvLabel.text=parser.replaceTag(model.get("cv"));
	$.textAbstractLabel.text=parser.replaceTag(model.get("abstract"));
	$.textDataLabel.text=model.get("orario");
	
	//inizializzazione dei contatori delle progress bar e dei bottoni per i pdf
	var progressBarCount=new Array();
	var button=new Array();
	for(var i=0;i<data.length;i++){
		progressBarCount[i]=0;
		button[i]=Titanium.UI.createButton();
		button[i].setTitleid(i);
		this.addClass(button[i],"pdfButton");
		$.pdfButtonView.add(button[i]);
	}
	
	//gestione dei pdf
	for(var i=0;i<data.length;i++){
		button[i].addEventListener('click',function(e){
			//inizializzazione della progress bar relativa al download del pdf
			var progressBar = Titanium.UI.createProgressBar({
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
			
			//inizializzazione del percorso assoluto e nome del file pdf
			var dir;
			if (Ti.Platform.osname === 'android')
				dir=Ti.Filesystem.externalStorageDirectory;
			else
				dir=Ti.Filesystem.applicationDataDirectory;
			var fileName=data[e.source.getTitleid()].cognome+'.pdf';
			
			//controllo se esiste il file indicato:
			//-se esiste semplicemente lo apro
			//-se non esiste lo scarico, lo salvo in memoria e lo apro
			file = Ti.Filesystem.getFile(dir,fileName);
			if(file.exists()){
				pdf.showPdf(file);
			}
			else{
				if(progressBarCount[e.source.getTitleid()]<1){
					progressBarCount[e.source.getTitleid()]=1;
					$.pdfView.add(progressBar);
					pdf.saveAndShowPdf(dir,fileName,model.get("anno"),progressBar);
				}
			}
		});
	}	
	
	//se e' presente una connessione ad internet incorpora un player di youtube con il video dell'evento
	if(!Titanium.Network.networkType == Titanium.Network.NETWORK_NONE){
		var content = "<div align='center'><iframe src='"+model.get("youtube")+"' frameborder='0' allowfullscreen></iframe></div>";
		var webView = Ti.UI.createWebView({
		    //url: 'https://www.youtube.com/watch?v=JwowlWH0ZRk&autohide=0&autoplay=0&controls=2&enablejsapi=1&showinfo=0',
		    html: content,
		    enableZoomControls: false,
		    scalesPageToFit: false,
		    scrollsToTop: false,
		    showScrollbars: false,
		    width: "100%"
		});
		$.videoView.add(webView);
	}
}
else{
	//dati non disponibili
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

