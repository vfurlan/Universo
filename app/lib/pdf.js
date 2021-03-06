/*
 * Funzione che apre il pdf passato
 * 
 * */
exports.showPdf = function(file){
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
};


/*
 * Funzione che scarica da internet il pdf indicato e lo salva in memoria
 * 
 * */
exports.savePdf = function(dir,fileName,year,progressBar){
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			//aggiorna il testo della progress bar
			progressBar.message="Download completato!";
			//crea un handler per la gestione del file
			file = Ti.Filesystem.getFile(dir,fileName);
			//scrive il contenuto nel file
			file.write(this.responseData);
		},
		timeout: 10000
	});
	xhr.open('GET','http://www.fe.infn.it/venerdi/VENERDIHOME_file/pdf'+year+'/'+fileName);
	xhr.send();
	xhr.ondatastream = function(e) {
		//aggiorna il valore della progress bar
		progressBar.value = e.progress ;
		Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
	};
	xhr.onerror = function(e) {
		progressBar.message="Download non completato!";
		alert("PDF al momento non disponibile.");
	};
};


/*
 * Funzione che scarica da internet il pdf indicato, lo salva in memoria ed infine lo apre
 * 
 * */
exports.saveAndShowPdf = function(dir,fileName,year,progressBar){
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			//aggiorna il testo della progress bar
			progressBar.message="Download completato!";
			//crea un handler per la gestione del file
			file = Ti.Filesystem.getFile(dir,fileName);
			//scrive il contenuto nel file
			file.write(this.responseData);
			//visualizzo il file
			exports.showPdf(file);
		},
		timeout: 10000
	});
	xhr.open('GET','http://www.fe.infn.it/venerdi/VENERDIHOME_file/pdf'+year+'/'+fileName);
	xhr.send();
	xhr.ondatastream = function(e) {
		//aggiorna il valore della progress bar
		progressBar.value = e.progress ;
		Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
	};
	xhr.onerror = function(e) {
		progressBar.message="Download non completato!";
		alert("PDF al momento non disponibile.");
	};
};
