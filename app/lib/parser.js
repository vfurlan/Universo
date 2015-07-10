/*
 * Funzione che converte i tag html in caratteri interpretabili da javascript
 * 
 * */
exports.replaceTag = function(str){
	str = str.replace(/\|/g, "\n");
	str = str.replace(/&/g, " ");
	str = str.replace(/_/g, " ");
	str = str.replace(/<br>/g, "\n");
	str = str.replace(/<p>/g, "");
	str = str.replace(/<\/p>/g, "");
	return str;
};

/*
 * Funzione che restituisce un array contenente tutti gli utenti contenuti nella stringa:
 * ogni utente conterrà il proprio nome e cognome
 * 
 * */
exports.getData = function(str){
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
};

/*
 * Funzione che restituisce una stringa senza spazi
 * 
 * */
exports.getStringNoSpace = function(str){
	str=str.replace(/ /g, "");
	return str;
};
