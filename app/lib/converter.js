/*
 * Funzione che converte i pixels in dpi
 * 
 * */
exports.pixelsToDp = function(pixels){
	if ( Ti.Platform.displayCaps.dpi > 160 )
        return (pixels / (Ti.Platform.displayCaps.dpi / 160));
    else 
        return pixels;
}; 

/*
 * Funzione che converte i dpi in pixels
 * 
 * */
exports.dpToPixels = function(dp){
	if ( Ti.Platform.displayCaps.dpi > 160 )
          return (dp * (Ti.Platform.displayCaps.dpi / 160));
    else 
        return dp;
}; 
