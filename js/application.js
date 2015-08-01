

var viewAssembler = new ViewAssembler();

$(document).ready( function(){
    loadTemplates( setupDefaultView );
} );

function setupDefaultView() { 
    
    var bodyView = viewAssembler.defaultView(); 
    
    //Setup the default view
    var defaultView = { title: "Welcome!", 
    view:  bodyView
    };
    
    //Setup the ViewNavigator
    window.viewNavigator = new ViewNavigator( 'body' );	
    window.viewNavigator.pushView( defaultView );
    
}


function onVideosViewClick( event ) {
    var view = { title: "Videos",
             backLabel: (isTablet() ? "Back" : " "),
             view: viewAssembler.videosView()
           };
    window.viewNavigator.pushView( view );
    event.stopPropagation();
    return false;
}

function onQuizesViewClick( event ) {
    var view = { title: "Quiz",
             backLabel: (isTablet() ? "Back" : " "),
             view: viewAssembler.quizesView(),
           };
    window.viewNavigator.pushView( view );
    event.stopPropagation();
    return false;
}

			
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
   document.addEventListener("backbutton", onBackKey, false);
}

function onBackKey( event ) {
    if ( window.viewNavigator.history.length > 1 ){
        event.preventDefault();
        window.viewNavigator.popView();
        return false;
    }
    navigator.app.exitApp();
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);