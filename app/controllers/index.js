
function pixelsToDp(pixels){
    if ( Ti.Platform.displayCaps.dpi > 160 )
        return (pixels / (Ti.Platform.displayCaps.dpi / 160));
    else 
        return pixels;
}

function dpToPixels(dp){
    if ( Ti.Platform.displayCaps.dpi > 160 )
          return (dp * (Ti.Platform.displayCaps.dpi / 160));
    else 
        return dp;
}

var dimMenu=Ti.Platform.displayCaps.dpi*0.7;
var dimHalfMenu=dimMenu/2;
var minDimMenu=Ti.Platform.displayCaps.dpi*0.1;

var animateRight = Ti.UI.createAnimation({
	left : dimMenu,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

var animateReset = Ti.UI.createAnimation({
	left : 0,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

var animateLeft = Ti.UI.createAnimation({
	left : -dimMenu,
	curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
	duration : 300
});

var touchStartX = 0;
var touchRightStarted = false;
var touchLeftStarted = false;
var buttonPressed = false;
var hasSlided = false;
var direction = "reset";

$.movableview.addEventListener('touchstart', function(e) {
	if (Ti.Platform.osname === 'android'){
		touchStartX = pixelsToDp(e.x);
	}
	else{
		touchStartX = e.x;
	}
});

$.movableview.addEventListener('touchend', function(e) {
	if (buttonPressed) {
		buttonPressed = false;
		return;
	}
	if ($.movableview.left >= dimHalfMenu && touchRightStarted) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	}
	else if ($.movableview.left <= -dimHalfMenu && touchLeftStarted) {
		direction = "left";
		$.movableview.animate(animateLeft);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
	});
	touchRightStarted = false;
	touchLeftStarted = false;
});

$.movableview.addEventListener('touchmove', function(e) {
	var coords = $.movableview.convertPointToView({
		x : e.x,
		y : e.y
	}, $.containerview);
	var newLeft;
	if (Ti.Platform.osname === 'android'){
		newLeft = pixelsToDp(coords.x) - touchStartX;
	}
	else{
		newLeft = coords.x - touchStartX;
	}
	if(touchStartX<minDimMenu){
		if ((newLeft <= dimMenu && newLeft > 0) || 
			(newLeft < 0 && newLeft >= -dimMenu)) {
			$.movableview.left = newLeft;
		
			if (newLeft > 0 && !touchLeftStarted && !touchRightStarted) {
				touchRightStarted = true;
				Ti.App.fireEvent("sliderToggled", {
					hasSlided : false,
					direction : "right"
				});
			}
			else if (newLeft < 0 && !touchRightStarted && !touchLeftStarted) {
				touchLeftStarted = true;
				Ti.App.fireEvent("sliderToggled", {
					hasSlided : false,
					direction : "left"
				});
			}
		}
	}
	
});

/*
$.movableview.addEventListener('touchmove', function(e) {
	var coords = $.movableview.convertPointToView({
		x : e.x,
		y : e.y
	}, $.containerview);
	var newLeft = coords.x - touchStartX;
	if(touchStartX<50){
		if ((touchRightStarted && newLeft <= dimMenu && newLeft >= 0) || 
			(touchLeftStarted && newLeft <= 0 && newLeft >= -dimMenu)) {
			$.movableview.left = newLeft;
		}
		else {
			// Sometimes newLeft goes beyond its bounds so the view gets stuck.
			// This is a hack to fix that.
			if ((touchRightStarted && newLeft < 0) || (touchLeftStarted && newLeft > 0)) {
				$.movableview.left = 0;
			}
			else if (touchRightStarted && newLeft > dimMenu) {
				$.movableview.left = dimMenu;
			}
			else if (touchLeftStarted && newLeft < -dimMenu) {
				$.movableview.left = -dimMenu;
			}
		}
		if (newLeft > 5 && !touchLeftStarted && !touchRightStarted) {
			touchRightStarted = true;
			Ti.App.fireEvent("sliderToggled", {
				hasSlided : false,
				direction : "right"
			});
		}
		else if (newLeft < -5 && !touchRightStarted && !touchLeftStarted) {
			touchLeftStarted = true;
			Ti.App.fireEvent("sliderToggled", {
				hasSlided : false,
				direction : "left"
			});
		}
	}
	
});*/

$.leftButton.addEventListener('touchend', function(e) {
	if (!touchRightStarted && !touchLeftStarted) {
		if(buttonPressed==false){
			buttonPressed = true;
			$.toggleLeftSlider();
		}
		else{
			if(direction=="right"){
				buttonPressed = false;
				$.toggleRightSlider();
			}
			else {
				$.toggleLeftSlider();
				$.toggleLeftSlider();
			}
		}
	}
});

$.rightButton.addEventListener('touchend', function(e) {
	if (!touchRightStarted && !touchLeftStarted) {
		if(buttonPressed==false){
			buttonPressed = true;
			$.toggleRightSlider();
		}
		else{
			if(direction=="left"){
				buttonPressed = false;
				$.toggleLeftSlider();
			}
			else {
				$.toggleRightSlider();
				$.toggleRightSlider();
			}
		}
	}
});

exports.toggleLeftSlider = function() {
	if (!hasSlided) {
		direction = "right";
		$.movableview.animate(animateRight);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
	});
};

exports.toggleRightSlider = function() {
	if (!hasSlided) {
		direction = "left";
		$.movableview.animate(animateLeft);
		hasSlided = true;
	} else {
		direction = "reset";
		$.movableview.animate(animateReset);
		hasSlided = false;
	}
	Ti.App.fireEvent("sliderToggled", {
		hasSlided : hasSlided,
		direction : direction
    });
};

exports.handleRotation = function() {
/*
  	Add the orientation handler in the controller that loads this widget. Like this:
	Ti.Gesture.addEventListener('orientationchange', function() {
		$.handleRotation();
	});
*/
	$.movableview.width = $.navview.width = $.contentview.width = Ti.Platform.displayCaps.platformWidth;
	$.movableview.height = $.navview.height = $.contentview.height = Ti.Platform.displayCaps.platformHeight;
};




























var leftData = [];
var rightData = [];

var row = Titanium.UI.createTableViewRow({height:"50",width:"100%",backgroundColor:"#3D4654",leftImage:"/bookmark-128.png",left:"5%"});
row.title="Home Page";
row.className="home_page";

var row2 = Titanium.UI.createTableViewRow({height:"50",width:"100%",backgroundColor:"#3D4654",leftImage:"/bookmark-128.png",left:"5%"});
row2.title="Contatti";
row2.className="contatti";

var row3 = Titanium.UI.createTableViewRow({height:"50",width:"100%",backgroundColor:"#3D4654",leftImage:"/bookmark-128.png",left:"5%"});
row3.title="Dove siamo";
row3.className="dove_siamo";

leftData.push(row);
leftData.push(row2);
leftData.push(row3);

// Pass data to widget leftTableView and rightTableView
$.leftTableView.data = leftData;
$.rightTableView.data = rightData;

function rowSelect(e) {
	if (currentView.id != e.row.customView) {
		$.contentview.remove(currentView);
		currentView = Alloy.createController(e.row.className).getView();
		$.contentview.add(currentView);
	}
}

var currentView = Alloy.createController("home_page").getView();
$.contentview.add(currentView);

// Swap views on menu item click
$.leftTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.toggleLeftSlider();
	buttonPressed=false;
});
$.rightTableView.addEventListener('click', function selectRow(e) {
	rowSelect(e);
	$.toggleRightSlider();
	buttonPressed=false;
});



Ti.App.addEventListener("sliderToggled", function(e) {
	if (e.direction == "right") {
		$.leftMenu.zIndex = 2;
		$.rightMenu.zIndex = 1;
	} else if (e.direction == "left") {
		$.leftMenu.zIndex = 1;
		$.rightMenu.zIndex = 2;
	}
});

if (Ti.Platform.osname === 'iphone')
	$.index.open({
		transition : Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
	});
else
	$.index.open();
