/*
 * Funzione che scarica da internet l'immagine indicata e la salva in memoria
 * 
 * */
exports.saveImage = function(dir,fileName,img){
	var xhr = Titanium.Network.createHTTPClient({
		onload: function() {
			//crea un handler per la gestione del file
			file = Ti.Filesystem.getFile(dir,fileName);
			//scrive il contenuto nel file
			file.write(this.responseData);
			img.image=dir+"/"+fileName;
		},
		timeout: 10000
	});
	xhr.open('GET','http://web.fe.infn.it/u/gambetti/venerdi/img/'+fileName);
	xhr.send();
};