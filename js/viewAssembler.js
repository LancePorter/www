
var templates = {
    videosViewTemplate : "views/videosViewTemplate.html",
    defaultViewTemplate : "views/defaultViewTemplate.html",
    quizesViewTemplate : "views/quizesViewTemplate.html",
    watchViewTemplate : "views/watchViewTemplate.html",
    createQuizView : "views/createQuizViewTemplate.html",
    questionCheckBoxView : "views/questionCheckBoxViewTemplate.html",
    questionRadioButtonView : "views/questionRadioButtonViewTemplate.html",
    checkboxChoiceView: "views/checkboxChoiceViewTemplate.html",
    radioButtonChoiceView: "views/radioButtonChoiceViewTemplate.html",
    questionTextView: "views/questionTextViewTemplate.html",
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
    return ($(window).width() >= 600);
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

ViewAssembler.prototype.createQuizView = function() {
    var el = $( templates.createQuizView );
    el.find("#quizDescription").show(function(){
        $('#quizDescription').elastic();
    });
    el.find("#addQuestionButton").on(this.CLICK_EVENT, function() {
        onAddQuestionButtonClick($('#newQuestionType').val());
    });
    return el;
}

ViewAssembler.prototype.newQuestion = function( questionType ) {

    if (questionType == 'checkbox'){
        var el = $( templates.questionCheckBoxView );
        el.find(".addNewChoiceDiv").on(this.CLICK_EVENT, function() {
            $(this).before($(templates.checkboxChoiceView));
            viewNavigator.resetScroller();
        });
    } else if (questionType == 'radioButton'){
        var el = $( templates.questionRadioButtonView );
        el.find(".addNewChoiceDiv").on(this.CLICK_EVENT, function() {
            $(this).before($(templates.radioButtonChoiceView));
            viewNavigator.resetScroller();
        });
    } else if (questionType == 'text'){
        var el = $( templates.questionTextView );
    } else {
        var el = null;
    }
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
        $videosBeginning.append(
            $("<a class='videoItem' href='##'></a>").
                attr("id", "None").
                html("List is empty").on(this.CLICK_EVENT, function(){
                    onVideoSelect(null);
                })
        ).append($("<div></div>"));
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
    el.find("#addQuizButton").on(this.CLICK_EVENT, onAddQuizButton);
    var states = ["Excellent","Good","Normal","Bad", "terrible"];
    for ( var i in states ) {
        $state.append($("<option></option>").text(states[i])); 
    }
    
    //el.find( "#submitButton" ).on( this.CLICK_EVENT, onSearchButtonClick );
    return el;
}
