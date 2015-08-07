

var viewAssembler = new ViewAssembler();
var videosList = [];
var addVideoUrl = 'http://127.0.0.1:8000/set/video/new';
var getVideoUrl = 'http://127.0.0.1:8000/get/video/latest/count=100';
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
            view: viewAssembler.videosView(videosList),
//            showCallback: refreshVideosList
           };
    window.viewNavigator.pushView( view );
    event.stopPropagation();

    return false;
}
function onVideoSelect(videoItem){
    var view = { title: "Watch Video",
        backLabel: (isTablet() ? "Back" : " "),
        view: viewAssembler.watchView(videoItem)
    };
    window.viewNavigator.pushView( view );
    return false;
}

function refreshVideosList() {
    var opts = {
        lines: 1 // The number of lines to draw
        , length: 9 // The length of each line
        , width: 6 // The line thickness
        , radius: 12 // The radius of the inner circle
        , scale: 0.75 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#57B7E7' // #rgb or #rrggbb or array of colors
        , opacity: 0.1 // Opacity of the lines
        , rotate: 180 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1.1 // Rounds per second
        , trail: 150 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '15px' // Top position relative to parent
        , left: '25px' // Left position relative to parent
        , shadow: false // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    };
    var target = document.getElementById('refreshButton');
    target.style.backgroundImage = "url('')";
    var spinner = new Spinner(opts).spin(target);
    $.get(getVideoUrl, updateVideosView);
    return false;
}



function updateVideosView( data, status ) {
    videosList = data;
    var $view = viewAssembler.videosView(videosList);
    setTimeout(function () {
        $('#videosView').replaceWith($view);
        viewNavigator.resetScroller();
    } , 600 );
}

function onAddVideoClick() {
    $.ajax({
            type: 'POST',
            data: {
                videoTitle: $('input.text[name="videoTitle"]').val(),
                videoUrl: $('input.text[name="videoUrl"]').val()
            },
            url: addVideoUrl,
            success: refreshVideosList,
            error: function () {
                console.log(data);
                alert('There was an error adding your video');
            }
        }
    );
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