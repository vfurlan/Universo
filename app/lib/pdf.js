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
exports.savePdf = function(dir,fileName,progressBar){
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			progressBar.message="Download complete!";
			
			file = Ti.Filesystem.getFile(dir,fileName);
			file.write(this.responseData); // write to the file
		},
		timeout: 10000
	});
	xhr.open('GET','http://www.fe.infn.it/venerdi/VENERDIHOME_file/pdf'+model.get("anno")+'/'+fileName);
	xhr.send();
	xhr.ondatastream = function(e) {
		progressBar.value = e.progress ;
		Ti.API.info('ONDATASTREAM - PROGRESS: ' + e.progress);
	};
};


/*
 * Funzione che scarica da internet il pdf indicato, lo salva in memoria ed infine lo apre
 * 
 * */
exports.saveAndShowPdf = function(dir,fileName,progressBar){
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
};
