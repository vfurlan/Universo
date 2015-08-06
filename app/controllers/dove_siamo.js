var args = arguments[0] || {};

//aggiunta della annotazione con i dati della sede alla mappa
var annotation = Alloy.Globals.Map.createAnnotation({
    title : "Piazza del Municipio",
    subtitle : "Piazza del Municipio, 44121 Ferrara",
    latitude : Alloy.Globals.latitude,
    longitude : Alloy.Globals.longitude,
    url : "http://web.fe.infn.it/u/gambetti/venerdi/index.php"
});
$.mapView.addAnnotation(annotation);

//stampa dei recepiti della sede
var recapiti= "I Venerdi Dell'Universo\n"+
"Sala Estense,\n"+
"Piazzetta Municipale,\n"+
"Ferrara, 44121, Italy\n"+
"Telefono/fax: 123 456-7890\n"+
"E-mail: universo at unife.it";
$.textRecapitiLabel.text=recapiti;
