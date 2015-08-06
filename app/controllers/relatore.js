var args = arguments[0] || {};

//caricamento del modulo del parser per il testo
var parser = require('parser');

//caricamento del modulo per la gestione dei pdf
var pdf = require('pdf');

//estrae i relatori con l'id selezionato
var utenti = Alloy.Collections.instance("utente");
utenti.fetch({query: 'select * from utente where id = '+args });

if(utenti.length>0){
	//stampa nome, cognome del relatori e  titolo abstract e orario dell'evento
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
}
else{
	//dati non disponibili
	$.titleLabel.text="Relatore";
	$.textLabel.text="Dati non disponibili!";
}

