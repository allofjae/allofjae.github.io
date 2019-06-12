//This is just to add/remove menu-open class on body using plain javascript (practice purpose). Jquery code to replace this is: 

// $('.hamburger-menu, .link').click(function () {
// 	$('body').hasClass('menu-open') ? ($('body').removeClass('menu-open')) : ($('body').addClass('menu-open'));
// });

//However, don't forget to include jQuery for it to work.
var slide = false;

function toggleMenu() {
  var body = document.body;
  body.className.match(/(?:^|\s)menu-open(?!\S)/) ? body.className = body.className.replace( /(?:^|\s)menu-open(?!\S)/g , '' ) : body.className += "menu-open";
}

window.onload = function() {
  var hamburger = document.getElementsByClassName('hamburger-menu')[0];
  var menuLinks = document.getElementsByClassName('link');
  
  hamburger.addEventListener( 'click' , toggleMenu );
  
  for(var i = 0; i < menuLinks.length; ++i) {
      var menuLink = menuLinks[i];
      menuLink.addEventListener( 'click' , toggleMenu );
  }
}

player
document.getElementById("play").onclick = function() { 
  document.getElementById('demo').play();
}

document.getElementById("pause").onclick = function() { 
  document.getElementById('demo').pause();
}



// jquery 연결
function loadJQuery() {
  var oScript = document.createElement("script");
  oScript.type = "text/javascript";
  oScript.charset = "utf-8";		  
  oScript.src = "http://code.jquery.com/jquery-1.6.2.min.js";	
  document.getElementsByTagName("head")[0].appendChild(oScript);
}

// 스크롤
(function($) {
  function getPropName(name) {
    var prefixs = ["Moz", "O", "ms", "Webkit"];
    var style = document.createElement("div").style;
    var prefixed = "";

    if (name in style) {
      return name;
    }
    name = name.charAt(0).toUpperCase() + name.substr(1);
    for (var i = 0; i < prefixs.length; i++) {
      prefixed = prefixs[i] + name;
      if (prefixed in style) {
        return prefix;
      }
    }
    return "";
  }

  var transitionEnds = {
    transition: "transitionend",
    WebkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    msTransition: "transitionend" //IE10+
  };

  var transition = getPropName("transition");
  var transitionend = transitionEnds[transition];
  function mnFullpage(fullpageEl, opts) {
    this.curIndex = 0;
    this.$fullpage = $(fullpageEl);
    this.$pages = null;
    this.$navList = null;
    this.transitonDelta = 0;
    this.canScroll = true;
    this.beforeAnimation = $.noop;
    this.afterAnimation = $.noop;
    this.forward = true;
    opts = $.extend({}, $.fn.mnFullpage.defaults, opts);
    $.extend(this, opts);
    this.initialize();
  }

  $.extend(mnFullpage.prototype, {
    initialize: function() {
      this.initElement();
      this.initEvents();
      this.layout();
    },

    initEvents: function() {
      this.mousewheelHandler = $.proxy(this.mousewheelHandler, this);
      this.windowResizeHandler = $.proxy(this.windowResizeHandler, this);
      this._pageScrollEnd = $.proxy(this._pageScrollEnd, this);
      this.keyboardEventHandler = $.proxy(this.keyboardEventHandler , this)
      this.$fullpage.on("mousewheel DOMMouseScroll", this.mousewheelHandler);
  
      if (this.showNav) {
        this.navItemClickHandler = $.proxy(this.navItemClickHandler, this);
        this.$fullpage.on(
          "click",
          this.selectors.navList + " li",
          this.navItemClickHandler
        );
      }
      if (transition) {
        this.$fullpage.on(
          "transitionend",
          this.selectors.pages,
          this._pageScrollEnd
        );
      }
      $(window).on("resize.fullpage."+ this.cid, this.windowResizeHandler);
      if(this.enableKeyboard){
        $(window).on("keyup.fullpage."+this.cid, this.keyboardEventHandler);        
      }
    },

    navItemClickHandler: function($e) {
      var index = $($e.target).index();
      this.canscroll = true;
      this.scrollToPage(index);
    },
    
    _pageScrollEnd: function() {
      var self = this ;
      this.canScroll = true;
      this.afterAnimation(this.curIndex, this.forward);
      if (this.showNav) {
        this.$navList
          .children()
          .removeClass(this.navActiveClass)
          .eq(this.curIndex)
          .addClass(this.navActiveClass);
      }
      //  if(this.autoPlay){
      //    this.loopTimer = setTimeout(function(){
      //      self.loopPlay();
      //    },2000);
      // }
    },
    
    loopPlay: function(){
      
      var index = this.curIndex + 1;
      index = (index == this.pageCount()) ? 0 : index;
      console.log(index)
      this.scrollToPage(index)
    },

    pageCount: function() {
      return this.$pages.children().length;
    },

    initElement: function() {
      var length = 0;
      this.cid = new Date().getTime();
      this.navActiveClass = this.selectors.navActive.substring(1);
      this.navListClass = this.selectors.navList.substring(1);
      this.$pages = $(this.selectors.pages , this.$fullpage);
      length = this.$pages.children().length;
      if (this.showNav) {
        this.$navList = $("<ul></ul>");
        this.$navList.addClass(this.navListClass);
        for (var i = 0; i < length; i++) {
          this.$navList.append("<li></li>");
        }
        this.$navList
          .children()
          .eq(this.curIndex)
          .addClass(this.navActiveClass);
      }
    
      this.$navList.appendTo(this.$fullpage);
      if (this.direction == "horizontal") {
        this.$fullpage.addClass("horizontal");
        this.$pages.css("width", this.pageCount() * 100 + "%");
        this.$pages.children().css("width", 100 / this.pageCount() + "%");
      }
      if(transition){
        this.$pages.css(transition , 'all ease-in-out .5s')
      }
    },

    pre: function() {
      this.scrollToPage(this.curIndex - 1);
    },

    next: function() {
      this.scrollToPage(this.curIndex + 1);
    },

    scrollToPage: function(index) {
      var self = this;

      if (
        index < 0 ||
        index >= this.$pages.children().length ||
        !this.canScroll
      ) {
        return;
      }
      clearTimeout(this.loopTimer);
      if (index > this.curIndex) {
        // this.forward = true;
      } else {
        // this.forward = false;
      }
      this.beforeAnimation(this.curIndex, this.forward);
      this.curIndex = index;
      this.canScroll = false;
      this.updatePosition();
    },

    updatePosition: function(isResize) {
      var self = this
      var delta = this.curPosition();
      if (transition) {
        var transform = this.direction == "horizontal"
          ? "translateX(" + delta +"px)"
          : "translateY(" + delta +"px)";
        this.$pages.css("transform", transform);
      } else {
        var pos = this.direction == "horizontal"
          ? {left: delta}
          : {top: delta};
         this.$pages.animate(pos , 20 ,  this._pageScrollEnd);       
      }
    },
    
    curPosition: function(){
      return (-1 * this.transitonDelta * this.curIndex) ;
    },

    layout: function() {
      if (this.direction == "horizontal") {
        this.transitonDelta = this.$fullpage.width();
      } else {
        this.transitonDelta = this.$fullpage.height();
      }
    },

    mousewheelHandler: function($e) {
      $e.preventDefault();
      var detail = $e.originalEvent.wheelDelta || -$e.originalEvent.detail;
      if(!this.canScroll){
        return
      }
      if (detail > 0) {
        this.pre();
      } else {
        this.next();
      }
    },

    windowResizeHandler: function($e) {
      var self = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(function() {
        self.layout();
        self.updatePosition();
      }, 100);
    }
  });

  $.fn.mnFullpage = function(opts) {
    this.each(function() {
      var $element = $(this);
      var fullpage = $element.data("mnFullpage-plugin");
      if (fullpage) {
      } else {
        fullpage = new mnFullpage($element, opts);
        $element.data("mnFullpage-plugin", fullpage);
      }
    });
  };

  $.fn.mnFullpage.defaults = {
    selectors: {
      mnFullpage: "",
      pages: ".mn-fullpage-pages",
      page: ".mn-fullpage-page",
      pageLeave: "page-out",
      pageIn: "page-in",
      navList: ".mn-nav-list",
      navActive: ".active"
    },
    direction: "horizontal",
    autoPlay: true,
    showNav: true,
    enableKeyboard: true
  };
})(jQuery);

$("#my-fullpage").mnFullpage();
