var args = arguments[0] || {};
/*
var content='<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d707.3217534201033!2d11.618724!3d44.836088!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477e4e6c83303f17%3A0xd74f5c2162608553!2sPiazza+del+Municipio%2C+44121+Ferrara+FE%2C+Italia!5e0!3m2!1sit!2sit!4v1436549995655" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>';

var mappa = Ti.UI.createWebView({html: content});
this.addClass(mappa,"mapView");
$.mapView.add(mappa);


*/
/*
//Add in the module
var MapModule = require('ti.map');
var win = Ti.UI.createWindow({backgroundColor: 'white'});
var map1 = MapModule.createView({
    userLocation: true,
    mapType: MapModule.NORMAL_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    top: 0,
    left: 0,
    width: '50%'
});
$.mapView.add(map1);

*/

var annotation = Alloy.Globals.Map.createAnnotation({
    title : "Piazza del Municipio",
    subtitle : "Piazza del Municipio, 44121 Ferrara",
    latitude : Alloy.Globals.latitude,
    longitude : Alloy.Globals.longitude,
    url : "http://web.fe.infn.it/u/gambetti/venerdi/index.php"
});
$.mapView.addAnnotation(annotation);



var recapiti= "I Venerdi Dell'Universo\n"+
"Sala Estense,\n"+
"Piazzetta Municipale,\n"+
"Ferrara, 44121, Italy\n"+
"Telefono/fax: 123 456-7890\n"+
"E-mail: universo at unife.it";
$.textRecapitiLabel.text=recapiti;
