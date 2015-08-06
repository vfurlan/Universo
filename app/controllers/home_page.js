var args = arguments[0] || {};

//caricamento del modulo del parser per il testo
var parser = require('parser');

//estrazione dell'anno corrente
var date = new Date();
var currentYear = date.getFullYear();

//estrazione del testo per la home
var home = Alloy.Collections.instance("mission");
home.fetch({query: 'select * from mission where anno = '+currentYear });

$.titleLabel.text='Mission';
if(home.length>0){
	//stampa il testo della home
	var model=home.at(0);
	$.textLabel.text=parser.replaceTag(model.get("testo"));
}
else{
	//nessun dato presente, stampa un testo di default per non lasciare la home vuota
	$.textLabel.text="Tornano anche quest'anno, I Venerdi dell'Universo, una serie di seminari sull'Astronomia e la Fisica. \n\n"+
		"Questi incontri sono organizzati dal Dipartimento di Fisica e Scienze della Terra dell'Universita' degli studi di Ferrara, dall'Istituto Nazionale di Fisica Nuclearee in collaborazione con il gruppo Astrofili Ferraresi \"Columbia\" e la Coop. Sociale Camelot. \n\n"+
		"L'intezione degli organizzatori e' quella di avvicinare, giovani e non, alla scienza astronomica e alle leggi che governano il cosmo. Viene ripresa ed ampliata un'iniziativa che ebbe grande seguito dalla fine degli anni '80 fino alla meta' degli anni '90 con la speranza che per molti giovani non sia solo una curiosita' momentanea ma anche un occasione di spunto per i loro studi professionali o amatoriali.";
}


