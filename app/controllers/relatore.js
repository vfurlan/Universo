var args = arguments[0] || {};

var parser = require('parser');

function showPdf(file){
	if (Ti.Platform.osname === 'android'){
		Ti.Android.currentActivity.startActivity(Ti.Android.createIntent({
			action:Ti.Android.ACTION_VIEW,
			type:'application/pdf',
			data:file.getNativePath()}));
	}
	else{
		docViewer = Ti.UI.iOS.createDocumentViewer({url:file.getNativePath()});
		docViewer.show();
	}
}


var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where id = '+args });

if(utenti.length>0){
	var model=utenti.at(0);
	var data=parser.getData(model.get("relatore"));
	var title="";
	for(var i=0;i<data.length;i++){
		if(title === ""){
			title=data[i].nome+" "+data[i].cognome;
		}
		else{
			title=title+" &\n"+data[i].nome+" "+data[i].cognome;
		}
	}
	$.titleLabel.text=title;
	$.textLabel.text="Abstract:\n"+model.get("titolo_abstract")+"\nGiorno:\n"+model.get("orario");
	
	
	
	var progressBarCount=new Array();
	var button=new Array();
	for(var i=0;i<data.length;i++){
		progressBarCount[i]=0;
		button[i]=Titanium.UI.createButton();
		button[i].setTitleid(i);
		this.addClass(button[i],"pdfButton");
		$.pdfButtonView.add(button[i]);
	}
	
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
			
			file = Ti.Filesystem.getFile(dir,fileName);
			if(file.exists()){
				showPdf(file);
			}
			else{
				if(progressBarCount[e.source.getTitleid()]<1){
					progressBarCount[e.source.getTitleid()]=1;
					$.pdfView.add(progressBar);
					var xhr = Titanium.Network.createHTTPClient({
						onload: function() {
							progressBar.message="Download complete!";
							
							file = Ti.Filesystem.getFile(dir,fileName);
							file.write(this.responseData); // write to the file
							
							showPdf(file);
						},
						timeout: 10000
					});
					xhr.open('GET','http://www.fe.infn.it/venerdi/VENERDIHOME_file/pdf'+model.get("anno")+'/'+fileName);
					xhr.send();
					xhr.ondatastream = function(e) {
						progressBar.value = e.progress ;
						Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
					};
				}
			}
			
			
			
			
			
		});
	}
	
	

	

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

