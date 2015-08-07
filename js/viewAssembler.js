
var templates = {
    videosViewTemplate:"views/videosViewTemplate.html",
    defaultViewTemplate:"views/defaultViewTemplate.html",
    quizesViewTemplate:"views/quizesViewTemplate.html",
    watchViewTemplate:"views/watchViewTemplate.html",
    loaded: 0,
    requested: 0
};

var ___templatesLoadedCallback;

function loadTemplates(callback) {
    ___templatesLoadedCallback = callback;
    
    //load Mousetache HTML templates
    for (var key in templates) {
        (function() {
             var _key = key.toString();
             if ( _key != "loaded" && _key != "requested" ){
                 templates.requested ++;
                 
                 var templateLoaded = function( template ){
                    onTemplateLoaded( template, _key );
                 }
                 
                 $.get( templates[ _key ], templateLoaded, "html" );
             }
         })();
    }
}


function onTemplateLoaded(template, key) {
    
    //alert( key + ": " + template);
    templates[ key ] = template;
    templates.loaded ++;
    
    if ( templates.loaded == templates.requested ) {
        ___templatesLoadedCallback();
    }
}



function isTablet() {
    var _w = $(window).width();
    var _h = $(window).height();
    return (Math.min(_w,_h) >= 600);
}

function ViewAssembler() {
    this.touchSupported = 'ontouchstart' in window;
    this.CLICK_EVENT = this.touchSupported ? 'touchend' : 'click';
    return this;
}

ViewAssembler.prototype.watchView = function(videoItem) {
    var el = $( templates.watchViewTemplate );
    el.find("iframe").on('load',function(){
        $(this).height($(this).width()*0.75);
    });
    //el.find("#quiz").on( this.CLICK_EVENT, onQuizesViewClick );
    //el.find("#video").on( this.CLICK_EVENT, onVideosViewClick );
    //var temp = el.find("#video");
    return el;
}

ViewAssembler.prototype.defaultView = function() {
    var el = $( templates.defaultViewTemplate );
    el.find("#quiz").on( this.CLICK_EVENT, onQuizesViewClick );
    el.find("#video").on( this.CLICK_EVENT, onVideosViewClick );
    var temp = el.find("#video");
    return el;
}

ViewAssembler.prototype.videosView = function(videosList) {
    var el = $( templates.videosViewTemplate );
    var $videosBeginning = el.find("#videosBeginning");

//    videosCount = window.localStorage.getItem('videosCount');
    if (! videosList.length){
 //       videosCount = '0';
        $videosBeginning.append("<a id=" + "None" + " class='videoItem' href='##'>" + "List is Empty" + "</a><div></div>");
    }
    for(i = 0; i<videosList.length; i++) {
        if(videosList[i]['pubDate'] && videosList[i]['videoTitle']) {
            $videosBeginning.append(
                $("<a class='videoItem' href='##'></a>").
                    attr("id", ("" + videosList[i]['pubDate'])).
                    html(videosList[i]['videoTitle']).on(this.CLICK_EVENT, function(){
                        onVideoSelect(videosList[i]);
                    })
            ).append($("<div></div>"));
        }
    }
    //el.find("#refreshButton").on( this.CLICK_EVENT, refreshVideosList );
    //el.find(".videoItem").on( this.CLICK_EVENT, onQuizesViewClick );
    //el.find("#addVideoButton").on( this.CLICK_EVENT, onAddVideoClick );
    return el;
}

ViewAssembler.prototype.quizesView = function () {
    var el = $( templates.quizesViewTemplate );
    var $state = el.find( "#Choice" );
    
    var states = ["Excellent","Good","Normal","Bad", "terrible"];
    for ( var i in states ) {
        $state.append($("<option></option>").text(states[i])); 
    }
    
    //el.find( "#submitButton" ).on( this.CLICK_EVENT, onSearchButtonClick );
    return el;
}
