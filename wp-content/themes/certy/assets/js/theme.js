/**
 * Certy Options
 */

var navStiky = false;
if(certy_vars_from_WP.enable_sticky == 1) { navStiky = true; }


var certy = {
    vars: {
        // Set theme rtl mode
        rtl: false,

        // Set theme primary color
        themeColor: certy_vars_from_WP.themeColor,

        // Set middle screen size, must have the same value as in the _variables.scss
        screenMd: '992px'
    },

    nav: {
        height: 'auto', // use 'auto' or some fixed value, for example 480px
        arrow: false, // activate arrow to scroll down menu items,
        sticky: {
            top: "-1px", // sticky position from top
            active: navStiky // activate sticky property on window scroll
        },
        tooltip: {
            active: true
        }
    },

    sideBox: {
        sticky: {
            top: "20px", // sticky position from top
            active: false // activate sticky property on window scroll
        }
    },

    progress: {
        animation: true, // animate on window scroll
        textColor: 'inherit', // set text color
        trailColor: 'rgba(0,0,0,0.07)' // set trail color
    }
};
/*
 * jQuery One Page Nav Plugin
 * http://github.com/davist11/jQuery-One-Page-Nav
 *
 * Copyright (c) 2010 Trevor Davis (http://trevordavis.net)
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://jquery.org/license
 *
 * @version 3.0.0
 *
 * Example usage:
 * $('#nav').onePageNav({
 *   currentClass: 'current',
 *   changeHash: false,
 *   scrollSpeed: 750
 * });
 */

;(function($, window, document, undefined){

    // our plugin constructor
    var OnePageNav = function(elem, options){
        this.elem = elem;
        this.$elem = $(elem);
        this.options = options;
        this.metadata = this.$elem.data('plugin-options');
        this.$win = $(window);
        this.sections = {};
        this.didScroll = false;
        this.$doc = $(document);
        this.docHeight = this.$doc.height();
    };

    // the plugin prototype
    OnePageNav.prototype = {
        defaults: {
            navItems: 'a',
            currentClass: 'current',
            changeHash: false,
            easing: 'swing',
            filter: '',
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            begin: false,
            end: false,
            scrollChange: false
        },

        init: function() {
            // Introduce defaults that can be extended either
            // globally or using an object literal.
            this.config = $.extend({}, this.defaults, this.options, this.metadata);

            this.$nav = this.$elem.find(this.config.navItems);

            //Filter any links out of the nav
            if(this.config.filter !== '') {
                this.$nav = this.$nav.filter(this.config.filter);
            }

            //Handle clicks on the nav
            this.$nav.on('click.onePageNav', $.proxy(this.handleClick, this));

            //Get the section positions
            this.getPositions();

            //Handle scroll changes
            this.bindInterval();

            //Update the positions on resize too
            this.$win.on('resize.onePageNav', $.proxy(this.getPositions, this));

            return this;
        },

        adjustNav: function(self, $parent) {
            self.$elem.find('.' + self.config.currentClass).removeClass(self.config.currentClass);
            $parent.addClass(self.config.currentClass);
        },

        bindInterval: function() {
            var self = this;
            var docHeight;

            self.$win.on('scroll.onePageNav', function() {
                self.didScroll = true;
            });

            self.t = setInterval(function() {
                docHeight = self.$doc.height();

                //If it was scrolled
                if(self.didScroll) {
                    self.didScroll = false;
                    self.scrollChange();
                }

                //If the document height changes
                if(docHeight !== self.docHeight) {
                    self.docHeight = docHeight;
                    self.getPositions();
                }
            }, 250);
        },

        getHash: function($link) {
            return $link.attr('href').split('#')[1];
        },

        getPositions: function() {
            var self = this;
            var linkHref;
            var topPos;
            var $target;

            self.$nav.each(function() {
                linkHref = self.getHash($(this));
                $target = $('#' + linkHref);

                if($target.length) {
                    topPos = $target.offset().top;
                    self.sections[linkHref] = Math.round(topPos);
                }
            });
        },

        getSection: function(windowPos) {
            var returnValue = null;
            var windowHeight = Math.round(this.$win.height() * this.config.scrollThreshold);

            for(var section in this.sections) {
                if((this.sections[section] - windowHeight) < windowPos) {
                    returnValue = section;
                }
            }

            return returnValue;
        },

        handleClick: function(e) {
            var self = this;
            var $link = $(e.currentTarget);
            var $parent = $link.parent();
            var newLoc = '#' + self.getHash($link);

            if(!$parent.hasClass(self.config.currentClass)) {
                //Start callback
                if(self.config.begin) {
                    self.config.begin();
                }

                //Change the highlighted nav item
                self.adjustNav(self, $parent);

                //Removing the auto-adjust on scroll
                self.unbindInterval();

                //Scroll to the correct position
                self.scrollTo(newLoc, function() {
                    //Do we need to change the hash?
                    if(self.config.changeHash) {
                        window.location.hash = newLoc;
                    }

                    //Add the auto-adjust on scroll back in
                    self.bindInterval();

                    //End callback
                    if(self.config.end) {
                        self.config.end();
                    }
                });
            }

            e.preventDefault();
        },

        scrollChange: function() {
            var windowTop = this.$win.scrollTop();
            var position = this.getSection(windowTop);
            var $parent;

            //If the position is set
            if(position !== null) {
                $parent = this.$elem.find('a[href$="#' + position + '"]').parent();

                //If it's not already the current section
                if(!$parent.hasClass(this.config.currentClass)) {
                    //Change the highlighted nav item
                    this.adjustNav(this, $parent);

                    //If there is a scrollChange callback
                    if(this.config.scrollChange) {
                        this.config.scrollChange($parent);
                    }
                }
            }
        },

        scrollTo: function(target, callback) {
            var offset = $(target).offset().top;
            if( $(target).closest('.crt-paper-layers').hasClass('crt-animate') ){
                offset = offset - 145;
            } else {
                offset = offset - 45;
            }

            $('html, body').animate({
                scrollTop: offset
            }, this.config.scrollSpeed, this.config.easing, callback);
        },

        unbindInterval: function() {
            clearInterval(this.t);
            this.$win.unbind('scroll.onePageNav');
        }
    };

    OnePageNav.defaults = OnePageNav.prototype.defaults;

    $.fn.onePageNav = function(options) {
        return this.each(function() {
            new OnePageNav(this, options).init();
        });
    };

})( jQuery, window , document );
/**
 * Certy Functions
 */

/* Init Global Variables */
certy.initGlobalVars = function(){
    // get document <html>
    this.vars.html = jQuery('html');

    // get document <body>
    this.vars.body = jQuery('body');

    // get document #footer
    this.vars.footer = jQuery('#crt-footer');

    // get window Width
    this.vars.windowW = jQuery(window).width();

    // get window height
    this.vars.windowH = jQuery(window).height();

    // get window scroll top
    this.vars.windowScrollTop = jQuery(window).scrollTop();

    // detect device type
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this.vars.mobile = true;
        this.vars.html.addClass('mobile');
    } else {
        this.vars.mobile = false;
        this.vars.html.addClass('desktop');
    }
};

/* Lock Window Scroll */
certy.lockScroll = function(){
    var initWidth = certy.vars.html.outerWidth();
    var initHeight = certy.vars.body.outerHeight();

    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];

    certy.vars.html.data('scroll-position', scrollPosition);
    certy.vars.html.data('previous-overflow', certy.vars.html.css('overflow'));
    certy.vars.html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    var marginR = certy.vars.body.outerWidth() - initWidth;
    var marginB = certy.vars.body.outerHeight() - initHeight;
    certy.vars.body.css({'margin-right': marginR, 'margin-bottom': marginB});
    certy.vars.html.addClass('lock-scroll');
};

/* Unlock Window Scroll */
certy.unlockScroll = function(){
    certy.vars.html.css('overflow', certy.vars.html.data('previous-overflow'));
    var scrollPosition = certy.vars.html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    certy.vars.body.css({'margin-right': 0, 'margin-bottom': 0});
    certy.vars.html.removeClass('lock-scroll');
};

/* Detect Device Type */
function ace_detect_device_type() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        ace.mobile = true;
        ace.html.addClass('crt-mobile');
    } else {
        ace.mobile = false;
        ace.html.addClass('crt-desktop');
    }
}

/* Certy Overlay */
function ace_append_overlay() {
    ace.body.append(ace.overlay.obj);

    // Make the element fully transparent
    ace.overlay.obj[0].style.opacity = 0;

    // Make sure the initial state is applied
    window.getComputedStyle(ace.overlay.obj[0]).opacity;

    // Fade it in
    ace.overlay.obj[0].style.opacity = 1;
}

function ace_remove_overlay() {
    // Fade it out
    ace.overlay.obj[0].style.opacity = 0;

    // Remove overlay
    ace.overlay.obj.remove();
}

/* Certy Lock Scroll */
function ace_lock_scroll() {
    var initWidth = ace.html.outerWidth();
    var initHeight = ace.body.outerHeight();

    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    ];

    ace.html.data('scroll-position', scrollPosition);
    ace.html.data('previous-overflow', ace.html.css('overflow'));
    ace.html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    var marginR = ace.body.outerWidth() - initWidth;
    var marginB = ace.body.outerHeight() - initHeight;
    ace.body.css({'margin-right': marginR, 'margin-bottom': marginB});
    ace.html.addClass('crt-lock-scroll');
}

/* Certy Unlock Scroll */
function ace_unlock_scroll() {
    ace.html.css('overflow', ace.html.data('previous-overflow'));
    var scrollPosition = ace.html.data('scroll-position');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);

    ace.body.css({'margin-right': 0, 'margin-bottom': 0});
    ace.html.removeClass('crt-lock-scroll');
}

/* Certy Close Sidebar */
function ace_open_sidebar() {
    ace.html.addClass('crt-sidebar-opened');
    ace_append_overlay();
    ace_lock_scroll();
}

function ace_close_sidebar() {
    ace.html.removeClass('crt-sidebar-opened');
    ace_remove_overlay();
    ace_unlock_scroll();
}

/* Certy Progress Circle */
function ace_progress_chart(element, text, value, duration) {
    // We have undefined text when user didntn fill text field from admin
    if (typeof text === "undefined") { text = ""; }

    var circle = new ProgressBar.Circle(element, {
        color: certy.vars.themeColor,
        strokeWidth: 5,
        trailWidth: 0,
        text: {
            value: text,
            className: 'progress-text',
            style: {
                top: '50%',
                left: '50%',
                color: certy.progress.textColor,
                position: 'absolute',
                margin: 0,
                padding: 0,
                transform: {
                    prefix: true,
                    value: 'translate(-50%, -50%)'
                }
            },
            autoStyleContainer: true,
            alignToBottom: true
        },
        svgStyle: {
            display: 'block',
            width: '100%'
        },
        duration: duration,
        easing: 'easeOut'
    });

    circle.animate(value); // Number from 0.0 to 1.0
}

/* Certy Progress Line */
function ace_progress_line(element, text, value, duration) {
    // We have undefined text when user didntn fill text field from admin
    if (typeof text === "undefined") { text = ""; }
    
    var line = new ProgressBar.Line(element, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: duration,
        color: certy.vars.themeColor,
        trailColor: certy.progress.trailColor,
        trailWidth: 4,
        svgStyle: {
            width: '100%',
            height: '100%'
        },
        text: {
            value: text,
            className: 'progress-text',
            style: {
                top: '-25px',
                right: '0',
                color: certy.progress.textColor,
                position: 'absolute',
                margin: 0,
                padding: 0,
                transform: {
                    prefix: true,
                    value: 'translate(0, 0)'
                }
            },
            autoStyleContainer: true
        }
    });

    line.animate(value);  // Number from 0.0 to 1.0
}

/* Certy Element In Viewport */
function ace_is_elem_in_viewport(el, vpart) {
    var rect = el[0].getBoundingClientRect();

    return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top + vpart <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function ace_is_elems_in_viewport(elems, vpart) {
    for (var i = 0; i < elems.length; i++) {
        var item = jQuery(elems[i]);

        if (item.hasClass('crt-animate') && ace_is_elem_in_viewport(item, vpart)) {
            item.removeClass('crt-animate').addClass('crt-animated');

            // Animate Circle Chart
            if(item.hasClass('progress-chart')){
                var chart = item.find('.progress-bar');
                ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1000);
            }

            // Animate Line Chart
            if(item.hasClass('progress-line')){
                var line = item.find('.progress-bar');
                ace_progress_line(line[0], line.data('text'), line.data('value'), 1000);
            }
        }
    }
}

function ace_appear_elems(elems, vpart) {
    ace_is_elems_in_viewport(elems, vpart);

    jQuery(window).scroll(function () {
        ace_is_elems_in_viewport(elems, vpart);
    });

    jQuery(window).resize(function () {
        ace_is_elems_in_viewport(elems, vpart);
    });
}

/* Certy Google Map */
function initialiseGoogleMap(mapStyles) {
    var latlng;
    var lat = 44.5403;
    var lng = -78.5463;
    var map = jQuery('#map');
    var mapCanvas = map.get(0);
    var map_styles = jQuery.parseJSON(mapStyles);

    if (map.data("latitude")) lat = map.data("latitude");
    if (map.data("longitude")) lng = map.data("longitude");

    latlng = new google.maps.LatLng(lat, lng);

    // Map Options
    var mapOptions = {
        zoom: 14,
        center: latlng,
        scrollwheel: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: map_styles
    };

    // Create the Map
    map = new google.maps.Map(mapCanvas, mapOptions);

    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: {
            path: 'M125 410 c-56 -72 -111 -176 -120 -224 -7 -36 11 -83 49 -124 76 -85 223 -67 270 31 28 60 29 88 6 150 -19 51 -122 205 -148 221 -6 3 -32 -21 -57 -54z m110 -175 c35 -34 33 -78 -4 -116 -35 -35 -71 -37 -105 -7 -40 35 -43 78 -11 116 34 41 84 44 120 7z',
            fillColor: certy_vars_from_WP.themeColor,
            fillOpacity: 1,
            scale: 0.1,
            strokeColor: certy_vars_from_WP.themeColor,
            strokeWeight: 1,
            anchor: new google.maps.Point(185, 500)
        },
        title: 'Hello World!'
    });

    /*var marker = new Marker({
     map: map,
     position: latlng,
     icon: {
     path: SQUARE_PIN,
     fillColor: '',
     fillOpacity: 0,
     strokeColor: '',
     strokeWeight: 0
     },
     map_icon_label: '<span class="map-icon map-icon-postal-code"></span>'
     });*/

    // Keep Marker in Center
    google.maps.event.addDomListener(window, 'resize', function () {
        map.setCenter(latlng);
    });
}
/**
 * Certy Navigation
 */

// Navigation With Scroll and Arrow
certy.nav.initScroll = function( el ){
    // Set Nav Height
    // certy.nav.scroll = el;

    el.height(el.height()).animate({height: certy.nav.height}, 700, function(){

        // Mouse Scroll
        el.mCustomScrollbar({
            axis: "y",
            scrollbarPosition: "outside"
        });
    });

    // Arrow Scroll
    if (certy.nav.arrow){
        jQuery("#crt-nav-tools").removeClass('hidden');

        jQuery("#crt-nav-arrow").on("click", function () {
            el.mCustomScrollbar('scrollTo', '-='+certy.nav.height);
        });
    }
};

// Sticky Navigation
certy.nav.exists = false;
certy.nav.makeSticky = function(){

    // check sticky option, device type and screen size
    if ( this.sticky.active && !certy.vars.mobile && Modernizr.mq('(min-width: ' + certy.vars.screenMd + ')') ) {

        // check if nav nodes exists
        if ( this.exists ){

            // check if window scroll pass element
            if ( certy.vars.windowScrollTop > this.wrap.offset().top ) {
                this.el.css({
                    'top': this.sticky.top,
                    'left': this.wrap.offset().left,
                    'width': this.wrap.width(),
                    'bottom': 'auto',
                    'position': 'fixed'
                });
            } else {
                this.el.css({
                    'top': '0',
                    'left': 'auto',
                    'width': 'auto',
                    'bottom': 'auto',
                    'position': 'relative'
                });
            }
        } else {
            this.el = jQuery('#crt-nav-inner');
            this.wrap = jQuery('#crt-nav-wrap');

            if ( this.el.length > 0 && this.wrap.length > 0 ) {
                this.exists = true;
            }
        }
    }
};

// Navigation Tooltips
certy.nav.tooltip.el = '';
certy.nav.tooltip.timer = 0;

certy.nav.tooltip.show = function(current){
    certy.nav.tooltip.timer = setTimeout(function () {

        certy.nav.tooltip.el = jQuery('<div class="crt-tooltip"></div>');

        // Init vars
        var top = current.offset().top;
        var left = current.offset().left;
        var right = left + current.outerWidth();
        var width = current.outerWidth();
        var height = 4;

        // Append tooltip
        certy.vars.body.append( certy.nav.tooltip.el );

        // Set tooltip text
        certy.nav.tooltip.el.text( current.data('tooltip') );

        // Positioning tooltip
        if (right + certy.nav.tooltip.el.outerWidth() < certy.vars.windowW) {
            certy.nav.tooltip.el.addClass('arrow-left').css({"left": right + "px", "top": (top + height) + "px"});
        } else {
            certy.nav.tooltip.el.addClass('arrow-right text-right').css({
                "left": (left - certy.nav.tooltip.el.outerWidth() - 10) + "px",
                "top": (top + height) + "px"
            });
        }

        // Show Tooltip
        certy.nav.tooltip.el.fadeIn(150);

    }, 150);
};

certy.nav.tooltip.hide = function(){
    clearTimeout(certy.nav.tooltip.timer);
    if (certy.nav.tooltip.el.length > 0) {
        certy.nav.tooltip.el.fadeOut(150, function () {
            certy.nav.tooltip.el.remove();
        });
    }
};
/**
 * Certy Side Box
 */
certy.sideBox.exists = false;
certy.sideBox.makeSticky = function(){

    // check sticky option, device type and screen size
    if ( this.sticky.active && !certy.vars.mobile && Modernizr.mq('(min-width: ' + certy.vars.screenMd + ')') ) {

        // check if nav nodes exists
        if ( this.exists ){

            // check if window scroll pass element
            if ( certy.vars.windowScrollTop > this.wrap.offset().top ) {
                this.el.css({
                    'top': this.sticky.top,
                    'left': this.wrap.offset().left,
                    'width': this.wrap.width(),
                    'bottom': 'auto',
                    'position': 'fixed'
                });
            } else {
                this.el.css({
                    'top': '0',
                    'left': 'auto',
                    'width': 'auto',
                    'bottom': 'auto',
                    'position': 'relative'
                });
            }
        } else {
            this.el = jQuery('#crt-side-box');
            this.wrap = jQuery('#crt-side-box-wrap');

            if ( this.el.length > 0 && this.wrap.length > 0 ) {
                this.exists = true;
            }
        }
    }
};
/**
 * Certy Slider
 */

// Slider
certy.slider = function(slider){
    for (var i = 0; i < slider.length; i++) {

       if( jQuery(slider[i]).data("init") != "none" ){
           jQuery(slider[i]).slick();
       }
    }
};

// Carousel
certy.carousel = function(carousel){
    for (var i = 0; i < carousel.length; i++) {
        if( jQuery(carousel[i]).data("init") !== "none" ){
            jQuery(carousel[i]).slick({
                "dots" : true
            });
        }
    }
};


/**
 * Certy Portfolio
 */

certy.portfolio = {
    popupSlider: '',
    popupCarousel: '',
    currentEmbed: false,
    currentEmbedType: false,

    initGrid: function(el){
        // isotope initialization
        var grid = el.isotope({
            isOriginLeft: !certy.vars.rtl,
            itemSelector: '.pf-grid-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.pf-grid-sizer'
            }
        });

        // layout isotope after each image loads
        grid.imagesLoaded().progress( function() {
            grid.isotope('layout');
        });

        // isotope filter
        var filter = el.closest('.pf-wrap').find('.pf-filter');
        if (filter.length > 0) {
            var filter_btn = filter.find('button');
            var filter_btn_first = jQuery('.pf-filter button:first-child');

            filter_btn_first.addClass('active');

            filter_btn.on('click', function () {
                filter_btn.removeClass('active');
                jQuery(this).addClass('active');

                var filterValue = jQuery(this).attr('data-filter');
                grid.isotope({ filter: filterValue });
            });
        }
    },

    openPopup: function(el){
        // add opened class on html
        certy.vars.html.addClass('crt-pf-popup-opened');

        // append portfolio popup
        this.popup_wrapper = jQuery('<div id="pf-popup-wrap">'+
			'<button id="pf-popup-close"><i class="crt-icon crt-icon-close"></i></button>'+
            '<div class="pf-popup-inner">'+
            '<div class="pf-popup-middle">'+
            '<div class="pf-popup-container">'+
            '<button id="pf-popup-close"><i class="rsicon rsicon-close"></i></button>'+
            '<div id="pf-popup-content" class="pf-popup-content"></div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>');

        certy.vars.body.append( this.popup_wrapper );

        // add portfolio popup content
        this.popup_content = jQuery('#pf-popup-content');
        this.popup_content.append( el.clone() );

        // popup slider
        this.popupSlider = jQuery('#pf-popup-content .pf-popup-media');

        // popup slider: on init
        this.popupSlider.on('init', function(event, slick) {
            certy.portfolio.loadEmbed(0);

            // Make Portfolio Popup Visible
            jQuery(window).trigger('resize');
        });

        // popup slider: before change
        this.popupSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {

            // Stop current slide iframe/video play
            if( certy.portfolio.currentEmbed && certy.portfolio.currentEmbedType ){
                switch (certy.portfolio.currentEmbedType) {
                    case "iframe":

                        var iframe = certy.portfolio.currentEmbed.find('iframe');
                        iframe.attr('src', iframe.attr('src'));

                        break;

                    case "video":
                        var video = certy.portfolio.currentEmbed.find('video');
                        video[0].pause();

                        break;
                }
            }

            // Load next slide embed
            certy.portfolio.loadEmbed(nextSlide);
        });

        // popup slider: initialize
        this.popupSlider.slick({
            speed: 500,
            dots: false,
            arrow: true,
            infinite: false,
            slidesToShow: 1,
            adaptiveHeight: true
        });

        // popup carousel
        this.popupCarousel = jQuery('#pf-popup-content .pf-rel-carousel');

        // popup carousel: initialize
        this.popupCarousel.slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            lazyLoad: 'ondemand'
        });

        // make portfolio popup visible
        this.popup_wrapper.addClass('pf-opened');

        // lock window scroll
        certy.lockScroll();
    },

    closePopup: function(el) {
        // remove opened class from html
        certy.vars.html.removeClass('cr-portfolio-opened');

        // make portfolio popup invisible
        this.popup_wrapper.removeClass('pf-opened');

        setTimeout(function(){
            certy.portfolio.popup_wrapper.remove();
            certy.unlockScroll();
        }, 500);
    },

    loadEmbed: function (slideIndex) {
        var currentEmbed = jQuery('#pf-popup-content .pf-popup-slide[data-slick-index="' + slideIndex + '"]').find('.pf-popup-embed');
        var currentEmbedType = jQuery.trim(currentEmbed.data('type'));
        var curentEmbedUrl = jQuery.trim(currentEmbed.data('url'));

        certy.portfolio.currentEmbed = currentEmbed;
        certy.portfolio.currentEmbedType = currentEmbedType;

        // Check if 'currentEmbed' still not loaded then do actions
        if (!currentEmbed.hasClass('pf-embed-loaded')) {

            // Check if 'currentEmbed' url and type are provided
            if (typeof currentEmbedType !== typeof undefined && currentEmbedType !== false && currentEmbedType !== "" && typeof curentEmbedUrl !== typeof undefined && curentEmbedUrl !== false && curentEmbedUrl !== "") {

                // Set embed dimensions if provided
                var embedW = jQuery.trim(currentEmbed.data('width'));
                var embedH = jQuery.trim(currentEmbed.data('height'));
                if (typeof embedW !== typeof undefined && embedW !== false && embedW !== "" && typeof embedH !== typeof undefined && embedH !== false && embedH !== "") {
                    currentEmbed.css({'padding-top': (embedH/embedW*100)+'%'});
                }

                // Load appropriate embed
                switch (currentEmbedType) {
                    case "image":
                        // Add embed type class
                        currentEmbed.addClass('pf-embed-image');

                        // Append embed
                        var img = jQuery('<img/>',{
                            src: curentEmbedUrl,
                            style: 'display:none'
                        }).load(function(){
                            jQuery(this).fadeIn(500);
                            currentEmbed.addClass('pf-embed-loaded');
                        }).error(function(){
                            currentEmbed.addClass('pf-embed-error');
                        });

                        currentEmbed.empty().append(img);

                        break;

                    case "iframe":
                        // Add embed type class
                        currentEmbed.addClass('pf-embed-iframe');

                        // Append Embed
                        var iframe = jQuery('<iframe/>', {
                            src: curentEmbedUrl,
                            style: 'display:none',
                            allowfullscreen: ''
                        }).load(function(){
                            jQuery(this).fadeIn(500);
                            currentEmbed.addClass('pf-embed-loaded');
                        }).error(function(){
                            currentEmbed.addClass('pf-embed-error');
                        });

                        currentEmbed.empty().append(iframe);

                        break;

                    case "video":
                        // Add embed type class
                        currentEmbed.addClass('pf-embed-video');

                        // Append Embed
                        var videoOptions = this.parseOptions(curentEmbedUrl);
                        var video = '<video ';
                        if(videoOptions.poster) video += 'poster="'+videoOptions.poster+'" ';
                        video += 'controls="controls" preload="yes">';
                        if(videoOptions.mp4) video += '<source type="video/mp4" src="'+videoOptions.mp4+'"/>';
                        if(videoOptions.webm) video += '<source type="video/webm" src="'+videoOptions.webm+'"/>';
                        if(videoOptions.ogv) video += '<source type="video/ogg" src="'+videoOptions.ogv+'"/>';
                        video += 'Your browser does not support the video tag.</video>';

                        currentEmbed.empty().append( jQuery(video) );

                        break;
                }
            }
        }
    },

    parseOptions: function (str) {
        var obj = {};
        var delimiterIndex;
        var option;
        var prop;
        var val;
        var arr;
        var len;
        var i;

        // Remove spaces around delimiters and split
        arr = str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',').split(',');

        // Parse a string
        for (i = 0, len = arr.length; i < len; i++) {
            option = arr[i];

            // Ignore urls and a string without colon delimiters
            if (
                option.search(/^(http|https|ftp):\/\//) !== -1 ||
                option.search(':') === -1
            ) {
                break;
            }

            delimiterIndex = option.indexOf(':');
            prop = option.substring(0, delimiterIndex);
            val = option.substring(delimiterIndex + 1);

            // If val is an empty string, make it undefined
            if (!val) {
                val = undefined;
            }

            // Convert a string value if it is like a boolean
            if (typeof val === 'string') {
                val = val === 'true' || (val === 'false' ? false : val);
            }

            // Convert a string value if it is like a number
            if (typeof val === 'string') {
                val = !isNaN(val) ? +val : val;
            }

            obj[prop] = val;
        }

        // If nothing is parsed
        if (prop == null && val == null) {
            return str;
        }

        return obj;
    }
};

(function ($) {
    "use strict";

    $(function () { // start: document ready

        /**
         *  Set Global Vars
         */
        certy.initGlobalVars();

        /**
         *  Navigation
         */
        if (certy.vars.body.hasClass('crt-nav-on')) { // Check If Nav Exists
            // Scrolled Navigation ( large screens )
            if ( Modernizr.mq('(min-width: '+certy.vars.screenMd+')') && certy.nav.height !== 'auto' ) {
                certy.nav.initScroll( $('#crt-nav-scroll') );
            }

            // Sticky Navigation
            certy.nav.makeSticky();

            // Navigation Tooltips
            if(certy.nav.tooltip.active){
                $('#crt-nav a').hover(function () {
                    certy.nav.tooltip.show( $(this) );
                },function () {
                    certy.nav.tooltip.hide();
                });
            };

            // Anchor Navigation
            $('#crt-nav').onePageNav({
                changeHash: true,
                scrollThreshold: 0.5,
                filter: ':not(.external)'
            });
        }

        /**
         *  Fixed Side Box
         */
        certy.sideBox.makeSticky();

        /** Portfolio */
        var pf_grid = $('.pf-grid');

        // check if grid exists than do action
        if (pf_grid.length > 0) {

            // init portfolio grid
            for (var i = 0; i < pf_grid.length; i++) {
                certy.portfolio.initGrid( $(pf_grid[i]) );
            }

            // open portfolio popup
            $(document).on('click', '.pf-project', function() {
                var id = $(this).attr('href');

                certy.portfolio.openPopup( $(id) );

                return false;
            });

            $(document).on('click', '.pf-rel-href', function() {
                var href = $(this).attr('href');

                // if contain anchor, open project popup
                if( href.indexOf("#") != -1 ) {
                    // close already opened popup
                    certy.portfolio.closePopup();

                    // open new one after timeout
                    setTimeout(function(){
                        certy.portfolio.openPopup( $(href) );
                    }, 500);

                    return false;
                }
            });
			
			$(document).on('click', '#pf-popup-close', function() {				
                certy.portfolio.closePopup();
			});

            // close portfolio popup
            $(document).on('touchstart click', '.crt-pf-popup-opened #pf-popup-wrap', function (e) {
                var container = $('#pf-popup-content');

                // if the target of the click isn't the container... nor a descendant of the container
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    certy.portfolio.closePopup();
                }
            });
        }

        /** Components */
        // init sliders
        certy.slider( $(".cr-slider") );

        // init carousel
        certy.carousel( $(".cr-carousel") );
		
		/** Window Scroll Top Button */
        var $btnScrollTop = $('#crt-btn-up');
		
		if($btnScrollTop.length > 0) {
            if ($(window).scrollTop() > 100) {
                $btnScrollTop.show(0);
            } else {
                $btnScrollTop.hide(0);
            }

			$(window).scroll(function () {
				if ($(this).scrollTop() > 100) {
					$btnScrollTop.show(0);
				} else {
					$btnScrollTop.hide(0);
				}
			});

			$btnScrollTop.on('click', function () {
				$('html, body').animate({scrollTop: 0}, 800);
				return false;
			});
		}
    }); // end: document ready



    $(window).on('resize', function () { // start: window resize

        // Re Init Vars
        certy.vars.windowW = $(window).width();
        certy.vars.windowH = $(window).height();
        certy.vars.windowScrollTop = $(window).scrollTop();

        // Sticky Navigation
        certy.nav.makeSticky();

        // Sticky Side Box
        certy.sideBox.makeSticky();

    }); // end: window resize



    $(window).on('scroll', function () { // start: window scroll

        // Re Init Vars
        certy.vars.windowScrollTop = $(window).scrollTop();

        // Sticky Navigation
        certy.nav.makeSticky();

        // Sticky Side Box
        certy.sideBox.makeSticky();

        // Remove Tooltip
        if(certy.nav.tooltip.el.length > 0){
            certy.nav.tooltip.el.remove();
        }

    }); // end: window scroll



    $(window).on('load', function () { // start: window load

    }); // end: window load

})(jQuery);
// Theme Variables
var ace = {
    html: '',
    body: '',
    mobile: '',

    sidebar: {
        obj: '',
        btn: ''
    },

    nav: {
        obj: '',
        tooltip: jQuery('<div class="crt-tooltip"></div>')
    },

    overlay: {
        obj: jQuery('<div id="crt-overlay"></div>')
    },

    progress: {
        lines: '',
        charts: '',
        bullets: ''
    }
};

(function ($) {
    "use strict";
	
	$(function () { // start: document ready

		/**
		 * Certy Init Main Vars
		 */
		ace.html = $('html');
		ace.body = $('body');

		/**
		 * Certy Detect Device Type
		 */
		ace_detect_device_type();

		/**
		 * Certy Mobile Navigation
		 */
		$('#crt-main-nav-sm .menu-item-has-children > a').on('click touchstart', function(){
			if( $(this).hasClass('hover') ){
				return true;
			} else {
				$(this).addClass('hover');
				$(this).next().slideDown(500);
				return false;
			}
		});

		/**
		 * Certy Sidebar
		 */
		ace.sidebar.obj = $('#crt-sidebar');
		ace.sidebar.btn = $('#crt-sidebar-btn');

		// Open Sidebar
		ace.sidebar.btn.on('touchstart click', function () {
			ace_open_sidebar();
		});

		// Close Sidebar Through Overlay
		$(document).on('touchstart click', '.crt-sidebar-opened #crt-overlay', function (e) {
			var container = ace.sidebar.obj;
			// if the target of the click isn't the container... nor a descendant of the container
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				ace_close_sidebar();
			}
		});

		// Close Sidebar Using Button
		$('#crt-sidebar-close').on('click', function () {
			ace_close_sidebar();
		});

		// Sidebar Custom Scroll
		$("#crt-sidebar-inner").mCustomScrollbar({
			axis: "y",
			theme: "minimal-dark",
			autoHideScrollbar: true,
			scrollButtons: { enable: true }
		});

		/**
		 * Certy Circle & Line Charts
		 */
		if(!certy.progress.animation || ace.mobile) {
			// Circle Chart
			ace.progress.charts = $('.progress-chart .progress-bar');
			for (var i = 0; i < ace.progress.charts.length; i++) {
				var chart = $(ace.progress.charts[i]);

				ace_progress_chart(chart[0], chart.data('text'), chart.data('value'), 1);
			}

			// Line Chart
			ace.progress.lines = $('.progress-line .progress-bar');
			for (var i = 0; i < ace.progress.lines.length; i++) {
				var line = $(ace.progress.lines[i]);

				ace_progress_line(line[0], line.data('text'), line.data('value'), 1);
			}
		}

		/**
		 * Certy Animate Elements
		 */
		if(certy.progress.animation && !ace.mobile) {
			ace_appear_elems($('.crt-animate'), 0);
		}

		/**
		 * Code Highlight
		 */
		$('pre').each(function (i, block) {
			hljs.highlightBlock(block);
		});

		/**
		 * Certy Alerts
		 */
		$('.alert .close').on('click', function () {
			var alert = $(this).parent();

			alert.fadeOut(500, function () {
				alert.remove();
			});
		});

		/**
		 * Certy Slider
		 */
		$('.slider').slick({
			dots: true
		});

		/**
		 * Certy Google Map Initialisation
		 */
		if ($('#map').length > 0) {
			initialiseGoogleMap( certy_vars_from_WP.mapStyles );
		}

		/**
		 *  Tabs
		 */
		var tabActive = $('.tabs-menu>li.active');
		if( tabActive.length > 0 ){
			for (var i = 0; i < tabActive.length; i++) {
				var tab_id = $(tabActive[i]).children().attr('href');

				$(tab_id).addClass('active').show();
			}
		}

		$('.tabs-menu a').on('click', function(e){
			var tab = $(this);
			var tab_id = tab.attr('href');
			var tab_wrap = tab.closest('.tabs');
			var tab_content = tab_wrap.find('.tab-content');

			tab.parent().addClass("active");
			tab.parent().siblings().removeClass('active');
			tab_content.not(tab_id).removeClass('active').hide();
			$(tab_id).addClass('active').fadeIn(500);

			e.preventDefault();
		});

		/**
		 * ToggleBox
		 */
		var toggleboxActive = $('.togglebox>li.active');
		if( toggleboxActive.length > 0 ){
			toggleboxActive.find('.togglebox-content').show();
		}

		$('.togglebox-header').on('click', function(){
			var toggle_head = $(this);

			toggle_head.next('.togglebox-content').slideToggle(300);
			toggle_head.parent().toggleClass('active');
		});


		/**
		 * Accordeon
		 */
		var accordeonActive = $('.accordion>li.active');
		if( accordeonActive.length > 0 ){
			accordeonActive.find('.accordion-content').show();
		}

		$('.accordion-header').on('click', function(){
			var acc_head = $(this);
			var acc_section = acc_head.parent();
			var acc_content = acc_head.next();
			var acc_all_contents = acc_head.closest('.accordion').find('.accordion-content');

			if(acc_section.hasClass('active')){
				acc_section.removeClass('active');
				acc_content.slideUp();
			}else{
				acc_section.siblings().removeClass('active');
				acc_section.addClass('active');
				acc_all_contents.slideUp(300);
				acc_content.slideDown(300);
			}
		});

		/**
		 * Comments Open/Close
		 */
		$('.comment-replys-link').on('click', function(){
			$(this).closest('.comment').toggleClass('show-replies');

			return false;
		});

		/**
		 * Portfolio Popup
		 */
		var pf_popup = {};
		pf_popup.wrapper = null;
		pf_popup.content = null;
		pf_popup.slider = null;

		pf_popup.open = function ( el ){
			// Append Portfolio Popup
			this.wrapper = $('<div id="pf-popup-wrap" class="pf-popup-wrap">'+
			'<div class="pf-popup-inner">'+
			'<div class="pf-popup-middle">'+
			'<div class="pf-popup-container">'+
			'<button id="pf-popup-close"><i class="rsicon rsicon-close"></i></button>'+
			'<div id="pf-popup-content" class="pf-popup-content"></div>'+
			'</div>'+
			'</div>'+
			'</div>');

			ace.body.append(this.wrapper);

			// Add Portfolio Popup Items
			this.content = $('#pf-popup-content');
			this.content.append( el.clone() );

			// Make Portfolio Popup Visible
			pf_popup.wrapper.addClass('opened');
			ace_lock_scroll();
		};

		pf_popup.close = function(){
			this.wrapper.removeClass('opened');
			setTimeout(function(){
				pf_popup.wrapper.remove();
				ace_unlock_scroll();
			}, 500);
		};

		// Open Portfolio Popup
		$(document).on('click', '.pf-btn-view', function() {
			var id = $(this).attr('href');
			pf_popup.open( $(id) );

			ace.html.addClass('crt-portfolio-opened');

			return false;
		});

		// Close Portfolio Popup
		$(document).on('touchstart click', '.crt-portfolio-opened #pf-popup-wrap', function (e) {
			var container = $('#pf-popup-content');

			// if the target of the click isn't the container... nor a descendant of the container
			if (!container.is(e.target) && container.has(e.target).length === 0) {
				pf_popup.close();
				ace.html.removeClass('crt-portfolio-opened');
			}
		});

		/**
		 * Show Code <pre>
		 */
		$('.toggle-link').on('click', function(){
			var id = $(this).attr('href');

			if($(this).hasClass('opened')){
				$(id).slideUp(500);
				$(this).removeClass('opened');
			} else {
				$(id).slideDown(500);
				$(this).addClass('opened');
			}

			return false;
		});

		/**
		 * Share Button
		 */
		$('.share-btn').on( "mouseenter", function(){
			$(this).parent().addClass('hovered');
		});

		$('.share-box').on( "mouseleave", function(){
			var share_box = $(this);

			if(share_box.hasClass('hovered')){
				share_box.addClass('closing');
				setTimeout(function() {
					share_box.removeClass('hovered');
					share_box.removeClass('closing');
				},300);
			}
		});

	}); // end: document ready
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9wdGlvbnMuanMiLCJvbmUtcGFnZS1uYXYuanMiLCJfZnVuY3Rpb25zLmpzIiwiX25hdi5qcyIsIl9zaWRlLWJveC5qcyIsIl9zbGlkZXIuanMiLCJfcG9ydGZvbGlvLmpzIiwibWFpbi5qcyIsInRoZW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNVJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidGhlbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ2VydHkgT3B0aW9uc1xyXG4gKi9cclxuXHJcbnZhciBuYXZTdGlreSA9IGZhbHNlO1xyXG5pZihjZXJ0eV92YXJzX2Zyb21fV1AuZW5hYmxlX3N0aWNreSA9PSAxKSB7IG5hdlN0aWt5ID0gdHJ1ZTsgfVxyXG5cclxuXHJcbnZhciBjZXJ0eSA9IHtcclxuICAgIHZhcnM6IHtcclxuICAgICAgICAvLyBTZXQgdGhlbWUgcnRsIG1vZGVcclxuICAgICAgICBydGw6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyBTZXQgdGhlbWUgcHJpbWFyeSBjb2xvclxyXG4gICAgICAgIHRoZW1lQ29sb3I6IGNlcnR5X3ZhcnNfZnJvbV9XUC50aGVtZUNvbG9yLFxyXG5cclxuICAgICAgICAvLyBTZXQgbWlkZGxlIHNjcmVlbiBzaXplLCBtdXN0IGhhdmUgdGhlIHNhbWUgdmFsdWUgYXMgaW4gdGhlIF92YXJpYWJsZXMuc2Nzc1xyXG4gICAgICAgIHNjcmVlbk1kOiAnOTkycHgnXHJcbiAgICB9LFxyXG5cclxuICAgIG5hdjoge1xyXG4gICAgICAgIGhlaWdodDogJ2F1dG8nLCAvLyB1c2UgJ2F1dG8nIG9yIHNvbWUgZml4ZWQgdmFsdWUsIGZvciBleGFtcGxlIDQ4MHB4XHJcbiAgICAgICAgYXJyb3c6IGZhbHNlLCAvLyBhY3RpdmF0ZSBhcnJvdyB0byBzY3JvbGwgZG93biBtZW51IGl0ZW1zLFxyXG4gICAgICAgIHN0aWNreToge1xyXG4gICAgICAgICAgICB0b3A6IFwiLTFweFwiLCAvLyBzdGlja3kgcG9zaXRpb24gZnJvbSB0b3BcclxuICAgICAgICAgICAgYWN0aXZlOiBuYXZTdGlreSAvLyBhY3RpdmF0ZSBzdGlja3kgcHJvcGVydHkgb24gd2luZG93IHNjcm9sbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG9vbHRpcDoge1xyXG4gICAgICAgICAgICBhY3RpdmU6IHRydWVcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNpZGVCb3g6IHtcclxuICAgICAgICBzdGlja3k6IHtcclxuICAgICAgICAgICAgdG9wOiBcIjIwcHhcIiwgLy8gc3RpY2t5IHBvc2l0aW9uIGZyb20gdG9wXHJcbiAgICAgICAgICAgIGFjdGl2ZTogZmFsc2UgLy8gYWN0aXZhdGUgc3RpY2t5IHByb3BlcnR5IG9uIHdpbmRvdyBzY3JvbGxcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHByb2dyZXNzOiB7XHJcbiAgICAgICAgYW5pbWF0aW9uOiB0cnVlLCAvLyBhbmltYXRlIG9uIHdpbmRvdyBzY3JvbGxcclxuICAgICAgICB0ZXh0Q29sb3I6ICdpbmhlcml0JywgLy8gc2V0IHRleHQgY29sb3JcclxuICAgICAgICB0cmFpbENvbG9yOiAncmdiYSgwLDAsMCwwLjA3KScgLy8gc2V0IHRyYWlsIGNvbG9yXHJcbiAgICB9XHJcbn07IiwiLypcclxuICogalF1ZXJ5IE9uZSBQYWdlIE5hdiBQbHVnaW5cclxuICogaHR0cDovL2dpdGh1Yi5jb20vZGF2aXN0MTEvalF1ZXJ5LU9uZS1QYWdlLU5hdlxyXG4gKlxyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTAgVHJldm9yIERhdmlzIChodHRwOi8vdHJldm9yZGF2aXMubmV0KVxyXG4gKiBEdWFsIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgYW5kIEdQTCBsaWNlbnNlcy5cclxuICogVXNlcyB0aGUgc2FtZSBsaWNlbnNlIGFzIGpRdWVyeSwgc2VlOlxyXG4gKiBodHRwOi8vanF1ZXJ5Lm9yZy9saWNlbnNlXHJcbiAqXHJcbiAqIEB2ZXJzaW9uIDMuMC4wXHJcbiAqXHJcbiAqIEV4YW1wbGUgdXNhZ2U6XHJcbiAqICQoJyNuYXYnKS5vbmVQYWdlTmF2KHtcclxuICogICBjdXJyZW50Q2xhc3M6ICdjdXJyZW50JyxcclxuICogICBjaGFuZ2VIYXNoOiBmYWxzZSxcclxuICogICBzY3JvbGxTcGVlZDogNzUwXHJcbiAqIH0pO1xyXG4gKi9cclxuXHJcbjsoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKXtcclxuXHJcbiAgICAvLyBvdXIgcGx1Z2luIGNvbnN0cnVjdG9yXHJcbiAgICB2YXIgT25lUGFnZU5hdiA9IGZ1bmN0aW9uKGVsZW0sIG9wdGlvbnMpe1xyXG4gICAgICAgIHRoaXMuZWxlbSA9IGVsZW07XHJcbiAgICAgICAgdGhpcy4kZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB0aGlzLm1ldGFkYXRhID0gdGhpcy4kZWxlbS5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG4gICAgICAgIHRoaXMuJHdpbiA9ICQod2luZG93KTtcclxuICAgICAgICB0aGlzLnNlY3Rpb25zID0ge307XHJcbiAgICAgICAgdGhpcy5kaWRTY3JvbGwgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLiRkb2MgPSAkKGRvY3VtZW50KTtcclxuICAgICAgICB0aGlzLmRvY0hlaWdodCA9IHRoaXMuJGRvYy5oZWlnaHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8gdGhlIHBsdWdpbiBwcm90b3R5cGVcclxuICAgIE9uZVBhZ2VOYXYucHJvdG90eXBlID0ge1xyXG4gICAgICAgIGRlZmF1bHRzOiB7XHJcbiAgICAgICAgICAgIG5hdkl0ZW1zOiAnYScsXHJcbiAgICAgICAgICAgIGN1cnJlbnRDbGFzczogJ2N1cnJlbnQnLFxyXG4gICAgICAgICAgICBjaGFuZ2VIYXNoOiBmYWxzZSxcclxuICAgICAgICAgICAgZWFzaW5nOiAnc3dpbmcnLFxyXG4gICAgICAgICAgICBmaWx0ZXI6ICcnLFxyXG4gICAgICAgICAgICBzY3JvbGxTcGVlZDogNzUwLFxyXG4gICAgICAgICAgICBzY3JvbGxUaHJlc2hvbGQ6IDAuNSxcclxuICAgICAgICAgICAgYmVnaW46IGZhbHNlLFxyXG4gICAgICAgICAgICBlbmQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBzY3JvbGxDaGFuZ2U6IGZhbHNlXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIEludHJvZHVjZSBkZWZhdWx0cyB0aGF0IGNhbiBiZSBleHRlbmRlZCBlaXRoZXJcclxuICAgICAgICAgICAgLy8gZ2xvYmFsbHkgb3IgdXNpbmcgYW4gb2JqZWN0IGxpdGVyYWwuXHJcbiAgICAgICAgICAgIHRoaXMuY29uZmlnID0gJC5leHRlbmQoe30sIHRoaXMuZGVmYXVsdHMsIHRoaXMub3B0aW9ucywgdGhpcy5tZXRhZGF0YSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRuYXYgPSB0aGlzLiRlbGVtLmZpbmQodGhpcy5jb25maWcubmF2SXRlbXMpO1xyXG5cclxuICAgICAgICAgICAgLy9GaWx0ZXIgYW55IGxpbmtzIG91dCBvZiB0aGUgbmF2XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY29uZmlnLmZpbHRlciAhPT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5hdiA9IHRoaXMuJG5hdi5maWx0ZXIodGhpcy5jb25maWcuZmlsdGVyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9IYW5kbGUgY2xpY2tzIG9uIHRoZSBuYXZcclxuICAgICAgICAgICAgdGhpcy4kbmF2Lm9uKCdjbGljay5vbmVQYWdlTmF2JywgJC5wcm94eSh0aGlzLmhhbmRsZUNsaWNrLCB0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAvL0dldCB0aGUgc2VjdGlvbiBwb3NpdGlvbnNcclxuICAgICAgICAgICAgdGhpcy5nZXRQb3NpdGlvbnMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vSGFuZGxlIHNjcm9sbCBjaGFuZ2VzXHJcbiAgICAgICAgICAgIHRoaXMuYmluZEludGVydmFsKCk7XHJcblxyXG4gICAgICAgICAgICAvL1VwZGF0ZSB0aGUgcG9zaXRpb25zIG9uIHJlc2l6ZSB0b29cclxuICAgICAgICAgICAgdGhpcy4kd2luLm9uKCdyZXNpemUub25lUGFnZU5hdicsICQucHJveHkodGhpcy5nZXRQb3NpdGlvbnMsIHRoaXMpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGFkanVzdE5hdjogZnVuY3Rpb24oc2VsZiwgJHBhcmVudCkge1xyXG4gICAgICAgICAgICBzZWxmLiRlbGVtLmZpbmQoJy4nICsgc2VsZi5jb25maWcuY3VycmVudENsYXNzKS5yZW1vdmVDbGFzcyhzZWxmLmNvbmZpZy5jdXJyZW50Q2xhc3MpO1xyXG4gICAgICAgICAgICAkcGFyZW50LmFkZENsYXNzKHNlbGYuY29uZmlnLmN1cnJlbnRDbGFzcyk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYmluZEludGVydmFsOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgZG9jSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgc2VsZi4kd2luLm9uKCdzY3JvbGwub25lUGFnZU5hdicsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5kaWRTY3JvbGwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgZG9jSGVpZ2h0ID0gc2VsZi4kZG9jLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vSWYgaXQgd2FzIHNjcm9sbGVkXHJcbiAgICAgICAgICAgICAgICBpZihzZWxmLmRpZFNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGlkU2Nyb2xsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxDaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL0lmIHRoZSBkb2N1bWVudCBoZWlnaHQgY2hhbmdlc1xyXG4gICAgICAgICAgICAgICAgaWYoZG9jSGVpZ2h0ICE9PSBzZWxmLmRvY0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZG9jSGVpZ2h0ID0gZG9jSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZ2V0UG9zaXRpb25zKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0SGFzaDogZnVuY3Rpb24oJGxpbmspIHtcclxuICAgICAgICAgICAgcmV0dXJuICRsaW5rLmF0dHIoJ2hyZWYnKS5zcGxpdCgnIycpWzFdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGdldFBvc2l0aW9uczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGxpbmtIcmVmO1xyXG4gICAgICAgICAgICB2YXIgdG9wUG9zO1xyXG4gICAgICAgICAgICB2YXIgJHRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuJG5hdi5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgbGlua0hyZWYgPSBzZWxmLmdldEhhc2goJCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJCgnIycgKyBsaW5rSHJlZik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHRhcmdldC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b3BQb3MgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcDtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlY3Rpb25zW2xpbmtIcmVmXSA9IE1hdGgucm91bmQodG9wUG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgZ2V0U2VjdGlvbjogZnVuY3Rpb24od2luZG93UG9zKSB7XHJcbiAgICAgICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dIZWlnaHQgPSBNYXRoLnJvdW5kKHRoaXMuJHdpbi5oZWlnaHQoKSAqIHRoaXMuY29uZmlnLnNjcm9sbFRocmVzaG9sZCk7XHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIHNlY3Rpb24gaW4gdGhpcy5zZWN0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgaWYoKHRoaXMuc2VjdGlvbnNbc2VjdGlvbl0gLSB3aW5kb3dIZWlnaHQpIDwgd2luZG93UG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBzZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgJGxpbmsgPSAkKGUuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgIHZhciAkcGFyZW50ID0gJGxpbmsucGFyZW50KCk7XHJcbiAgICAgICAgICAgIHZhciBuZXdMb2MgPSAnIycgKyBzZWxmLmdldEhhc2goJGxpbmspO1xyXG5cclxuICAgICAgICAgICAgaWYoISRwYXJlbnQuaGFzQ2xhc3Moc2VsZi5jb25maWcuY3VycmVudENsYXNzKSkge1xyXG4gICAgICAgICAgICAgICAgLy9TdGFydCBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuYmVnaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5iZWdpbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vQ2hhbmdlIHRoZSBoaWdobGlnaHRlZCBuYXYgaXRlbVxyXG4gICAgICAgICAgICAgICAgc2VsZi5hZGp1c3ROYXYoc2VsZiwgJHBhcmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9SZW1vdmluZyB0aGUgYXV0by1hZGp1c3Qgb24gc2Nyb2xsXHJcbiAgICAgICAgICAgICAgICBzZWxmLnVuYmluZEludGVydmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9TY3JvbGwgdG8gdGhlIGNvcnJlY3QgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgIHNlbGYuc2Nyb2xsVG8obmV3TG9jLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0RvIHdlIG5lZWQgdG8gY2hhbmdlIHRoZSBoYXNoP1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuY29uZmlnLmNoYW5nZUhhc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBuZXdMb2M7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0FkZCB0aGUgYXV0by1hZGp1c3Qgb24gc2Nyb2xsIGJhY2sgaW5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmJpbmRJbnRlcnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0VuZCBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuY29uZmlnLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbmZpZy5lbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNjcm9sbENoYW5nZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciB3aW5kb3dUb3AgPSB0aGlzLiR3aW4uc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZ2V0U2VjdGlvbih3aW5kb3dUb3ApO1xyXG4gICAgICAgICAgICB2YXIgJHBhcmVudDtcclxuXHJcbiAgICAgICAgICAgIC8vSWYgdGhlIHBvc2l0aW9uIGlzIHNldFxyXG4gICAgICAgICAgICBpZihwb3NpdGlvbiAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudCA9IHRoaXMuJGVsZW0uZmluZCgnYVtocmVmJD1cIiMnICsgcG9zaXRpb24gKyAnXCJdJykucGFyZW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9JZiBpdCdzIG5vdCBhbHJlYWR5IHRoZSBjdXJyZW50IHNlY3Rpb25cclxuICAgICAgICAgICAgICAgIGlmKCEkcGFyZW50Lmhhc0NsYXNzKHRoaXMuY29uZmlnLmN1cnJlbnRDbGFzcykpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0NoYW5nZSB0aGUgaGlnaGxpZ2h0ZWQgbmF2IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkanVzdE5hdih0aGlzLCAkcGFyZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy9JZiB0aGVyZSBpcyBhIHNjcm9sbENoYW5nZSBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuY29uZmlnLnNjcm9sbENoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpZy5zY3JvbGxDaGFuZ2UoJHBhcmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2Nyb2xsVG86IGZ1bmN0aW9uKHRhcmdldCwgY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdmFyIG9mZnNldCA9ICQodGFyZ2V0KS5vZmZzZXQoKS50b3A7XHJcbiAgICAgICAgICAgIGlmKCAkKHRhcmdldCkuY2xvc2VzdCgnLmNydC1wYXBlci1sYXllcnMnKS5oYXNDbGFzcygnY3J0LWFuaW1hdGUnKSApe1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IC0gMTQ1O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gb2Zmc2V0IC0gNDU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogb2Zmc2V0XHJcbiAgICAgICAgICAgIH0sIHRoaXMuY29uZmlnLnNjcm9sbFNwZWVkLCB0aGlzLmNvbmZpZy5lYXNpbmcsIGNhbGxiYWNrKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB1bmJpbmRJbnRlcnZhbDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50KTtcclxuICAgICAgICAgICAgdGhpcy4kd2luLnVuYmluZCgnc2Nyb2xsLm9uZVBhZ2VOYXYnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIE9uZVBhZ2VOYXYuZGVmYXVsdHMgPSBPbmVQYWdlTmF2LnByb3RvdHlwZS5kZWZhdWx0cztcclxuXHJcbiAgICAkLmZuLm9uZVBhZ2VOYXYgPSBmdW5jdGlvbihvcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgbmV3IE9uZVBhZ2VOYXYodGhpcywgb3B0aW9ucykuaW5pdCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbn0pKCBqUXVlcnksIHdpbmRvdyAsIGRvY3VtZW50ICk7IiwiLyoqXHJcbiAqIENlcnR5IEZ1bmN0aW9uc1xyXG4gKi9cclxuXHJcbi8qIEluaXQgR2xvYmFsIFZhcmlhYmxlcyAqL1xyXG5jZXJ0eS5pbml0R2xvYmFsVmFycyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAvLyBnZXQgZG9jdW1lbnQgPGh0bWw+XHJcbiAgICB0aGlzLnZhcnMuaHRtbCA9IGpRdWVyeSgnaHRtbCcpO1xyXG5cclxuICAgIC8vIGdldCBkb2N1bWVudCA8Ym9keT5cclxuICAgIHRoaXMudmFycy5ib2R5ID0galF1ZXJ5KCdib2R5Jyk7XHJcblxyXG4gICAgLy8gZ2V0IGRvY3VtZW50ICNmb290ZXJcclxuICAgIHRoaXMudmFycy5mb290ZXIgPSBqUXVlcnkoJyNjcnQtZm9vdGVyJyk7XHJcblxyXG4gICAgLy8gZ2V0IHdpbmRvdyBXaWR0aFxyXG4gICAgdGhpcy52YXJzLndpbmRvd1cgPSBqUXVlcnkod2luZG93KS53aWR0aCgpO1xyXG5cclxuICAgIC8vIGdldCB3aW5kb3cgaGVpZ2h0XHJcbiAgICB0aGlzLnZhcnMud2luZG93SCA9IGpRdWVyeSh3aW5kb3cpLmhlaWdodCgpO1xyXG5cclxuICAgIC8vIGdldCB3aW5kb3cgc2Nyb2xsIHRvcFxyXG4gICAgdGhpcy52YXJzLndpbmRvd1Njcm9sbFRvcCA9IGpRdWVyeSh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgIC8vIGRldGVjdCBkZXZpY2UgdHlwZVxyXG4gICAgaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIHRoaXMudmFycy5tb2JpbGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMudmFycy5odG1sLmFkZENsYXNzKCdtb2JpbGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy52YXJzLm1vYmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFycy5odG1sLmFkZENsYXNzKCdkZXNrdG9wJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKiBMb2NrIFdpbmRvdyBTY3JvbGwgKi9cclxuY2VydHkubG9ja1Njcm9sbCA9IGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgaW5pdFdpZHRoID0gY2VydHkudmFycy5odG1sLm91dGVyV2lkdGgoKTtcclxuICAgIHZhciBpbml0SGVpZ2h0ID0gY2VydHkudmFycy5ib2R5Lm91dGVySGVpZ2h0KCk7XHJcblxyXG4gICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gW1xyXG4gICAgICAgIHNlbGYucGFnZVhPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0LFxyXG4gICAgICAgIHNlbGYucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCB8fCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcFxyXG4gICAgXTtcclxuXHJcbiAgICBjZXJ0eS52YXJzLmh0bWwuZGF0YSgnc2Nyb2xsLXBvc2l0aW9uJywgc2Nyb2xsUG9zaXRpb24pO1xyXG4gICAgY2VydHkudmFycy5odG1sLmRhdGEoJ3ByZXZpb3VzLW92ZXJmbG93JywgY2VydHkudmFycy5odG1sLmNzcygnb3ZlcmZsb3cnKSk7XHJcbiAgICBjZXJ0eS52YXJzLmh0bWwuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxQb3NpdGlvblswXSwgc2Nyb2xsUG9zaXRpb25bMV0pO1xyXG5cclxuICAgIHZhciBtYXJnaW5SID0gY2VydHkudmFycy5ib2R5Lm91dGVyV2lkdGgoKSAtIGluaXRXaWR0aDtcclxuICAgIHZhciBtYXJnaW5CID0gY2VydHkudmFycy5ib2R5Lm91dGVySGVpZ2h0KCkgLSBpbml0SGVpZ2h0O1xyXG4gICAgY2VydHkudmFycy5ib2R5LmNzcyh7J21hcmdpbi1yaWdodCc6IG1hcmdpblIsICdtYXJnaW4tYm90dG9tJzogbWFyZ2luQn0pO1xyXG4gICAgY2VydHkudmFycy5odG1sLmFkZENsYXNzKCdsb2NrLXNjcm9sbCcpO1xyXG59O1xyXG5cclxuLyogVW5sb2NrIFdpbmRvdyBTY3JvbGwgKi9cclxuY2VydHkudW5sb2NrU2Nyb2xsID0gZnVuY3Rpb24oKXtcclxuICAgIGNlcnR5LnZhcnMuaHRtbC5jc3MoJ292ZXJmbG93JywgY2VydHkudmFycy5odG1sLmRhdGEoJ3ByZXZpb3VzLW92ZXJmbG93JykpO1xyXG4gICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gY2VydHkudmFycy5odG1sLmRhdGEoJ3Njcm9sbC1wb3NpdGlvbicpO1xyXG4gICAgd2luZG93LnNjcm9sbFRvKHNjcm9sbFBvc2l0aW9uWzBdLCBzY3JvbGxQb3NpdGlvblsxXSk7XHJcblxyXG4gICAgY2VydHkudmFycy5ib2R5LmNzcyh7J21hcmdpbi1yaWdodCc6IDAsICdtYXJnaW4tYm90dG9tJzogMH0pO1xyXG4gICAgY2VydHkudmFycy5odG1sLnJlbW92ZUNsYXNzKCdsb2NrLXNjcm9sbCcpO1xyXG59O1xyXG5cclxuLyogRGV0ZWN0IERldmljZSBUeXBlICovXHJcbmZ1bmN0aW9uIGFjZV9kZXRlY3RfZGV2aWNlX3R5cGUoKSB7XHJcbiAgICBpZiAoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAgICAgYWNlLm1vYmlsZSA9IHRydWU7XHJcbiAgICAgICAgYWNlLmh0bWwuYWRkQ2xhc3MoJ2NydC1tb2JpbGUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYWNlLm1vYmlsZSA9IGZhbHNlO1xyXG4gICAgICAgIGFjZS5odG1sLmFkZENsYXNzKCdjcnQtZGVza3RvcCcpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKiBDZXJ0eSBPdmVybGF5ICovXHJcbmZ1bmN0aW9uIGFjZV9hcHBlbmRfb3ZlcmxheSgpIHtcclxuICAgIGFjZS5ib2R5LmFwcGVuZChhY2Uub3ZlcmxheS5vYmopO1xyXG5cclxuICAgIC8vIE1ha2UgdGhlIGVsZW1lbnQgZnVsbHkgdHJhbnNwYXJlbnRcclxuICAgIGFjZS5vdmVybGF5Lm9ialswXS5zdHlsZS5vcGFjaXR5ID0gMDtcclxuXHJcbiAgICAvLyBNYWtlIHN1cmUgdGhlIGluaXRpYWwgc3RhdGUgaXMgYXBwbGllZFxyXG4gICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUoYWNlLm92ZXJsYXkub2JqWzBdKS5vcGFjaXR5O1xyXG5cclxuICAgIC8vIEZhZGUgaXQgaW5cclxuICAgIGFjZS5vdmVybGF5Lm9ialswXS5zdHlsZS5vcGFjaXR5ID0gMTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWNlX3JlbW92ZV9vdmVybGF5KCkge1xyXG4gICAgLy8gRmFkZSBpdCBvdXRcclxuICAgIGFjZS5vdmVybGF5Lm9ialswXS5zdHlsZS5vcGFjaXR5ID0gMDtcclxuXHJcbiAgICAvLyBSZW1vdmUgb3ZlcmxheVxyXG4gICAgYWNlLm92ZXJsYXkub2JqLnJlbW92ZSgpO1xyXG59XHJcblxyXG4vKiBDZXJ0eSBMb2NrIFNjcm9sbCAqL1xyXG5mdW5jdGlvbiBhY2VfbG9ja19zY3JvbGwoKSB7XHJcbiAgICB2YXIgaW5pdFdpZHRoID0gYWNlLmh0bWwub3V0ZXJXaWR0aCgpO1xyXG4gICAgdmFyIGluaXRIZWlnaHQgPSBhY2UuYm9keS5vdXRlckhlaWdodCgpO1xyXG5cclxuICAgIHZhciBzY3JvbGxQb3NpdGlvbiA9IFtcclxuICAgICAgICBzZWxmLnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0IHx8IGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCxcclxuICAgICAgICBzZWxmLnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgfHwgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3BcclxuICAgIF07XHJcblxyXG4gICAgYWNlLmh0bWwuZGF0YSgnc2Nyb2xsLXBvc2l0aW9uJywgc2Nyb2xsUG9zaXRpb24pO1xyXG4gICAgYWNlLmh0bWwuZGF0YSgncHJldmlvdXMtb3ZlcmZsb3cnLCBhY2UuaHRtbC5jc3MoJ292ZXJmbG93JykpO1xyXG4gICAgYWNlLmh0bWwuY3NzKCdvdmVyZmxvdycsICdoaWRkZW4nKTtcclxuICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxQb3NpdGlvblswXSwgc2Nyb2xsUG9zaXRpb25bMV0pO1xyXG5cclxuICAgIHZhciBtYXJnaW5SID0gYWNlLmJvZHkub3V0ZXJXaWR0aCgpIC0gaW5pdFdpZHRoO1xyXG4gICAgdmFyIG1hcmdpbkIgPSBhY2UuYm9keS5vdXRlckhlaWdodCgpIC0gaW5pdEhlaWdodDtcclxuICAgIGFjZS5ib2R5LmNzcyh7J21hcmdpbi1yaWdodCc6IG1hcmdpblIsICdtYXJnaW4tYm90dG9tJzogbWFyZ2luQn0pO1xyXG4gICAgYWNlLmh0bWwuYWRkQ2xhc3MoJ2NydC1sb2NrLXNjcm9sbCcpO1xyXG59XHJcblxyXG4vKiBDZXJ0eSBVbmxvY2sgU2Nyb2xsICovXHJcbmZ1bmN0aW9uIGFjZV91bmxvY2tfc2Nyb2xsKCkge1xyXG4gICAgYWNlLmh0bWwuY3NzKCdvdmVyZmxvdycsIGFjZS5odG1sLmRhdGEoJ3ByZXZpb3VzLW92ZXJmbG93JykpO1xyXG4gICAgdmFyIHNjcm9sbFBvc2l0aW9uID0gYWNlLmh0bWwuZGF0YSgnc2Nyb2xsLXBvc2l0aW9uJyk7XHJcbiAgICB3aW5kb3cuc2Nyb2xsVG8oc2Nyb2xsUG9zaXRpb25bMF0sIHNjcm9sbFBvc2l0aW9uWzFdKTtcclxuXHJcbiAgICBhY2UuYm9keS5jc3MoeydtYXJnaW4tcmlnaHQnOiAwLCAnbWFyZ2luLWJvdHRvbSc6IDB9KTtcclxuICAgIGFjZS5odG1sLnJlbW92ZUNsYXNzKCdjcnQtbG9jay1zY3JvbGwnKTtcclxufVxyXG5cclxuLyogQ2VydHkgQ2xvc2UgU2lkZWJhciAqL1xyXG5mdW5jdGlvbiBhY2Vfb3Blbl9zaWRlYmFyKCkge1xyXG4gICAgYWNlLmh0bWwuYWRkQ2xhc3MoJ2NydC1zaWRlYmFyLW9wZW5lZCcpO1xyXG4gICAgYWNlX2FwcGVuZF9vdmVybGF5KCk7XHJcbiAgICBhY2VfbG9ja19zY3JvbGwoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWNlX2Nsb3NlX3NpZGViYXIoKSB7XHJcbiAgICBhY2UuaHRtbC5yZW1vdmVDbGFzcygnY3J0LXNpZGViYXItb3BlbmVkJyk7XHJcbiAgICBhY2VfcmVtb3ZlX292ZXJsYXkoKTtcclxuICAgIGFjZV91bmxvY2tfc2Nyb2xsKCk7XHJcbn1cclxuXHJcbi8qIENlcnR5IFByb2dyZXNzIENpcmNsZSAqL1xyXG5mdW5jdGlvbiBhY2VfcHJvZ3Jlc3NfY2hhcnQoZWxlbWVudCwgdGV4dCwgdmFsdWUsIGR1cmF0aW9uKSB7XHJcbiAgICAvLyBXZSBoYXZlIHVuZGVmaW5lZCB0ZXh0IHdoZW4gdXNlciBkaWRudG4gZmlsbCB0ZXh0IGZpZWxkIGZyb20gYWRtaW5cclxuICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gXCJ1bmRlZmluZWRcIikgeyB0ZXh0ID0gXCJcIjsgfVxyXG5cclxuICAgIHZhciBjaXJjbGUgPSBuZXcgUHJvZ3Jlc3NCYXIuQ2lyY2xlKGVsZW1lbnQsIHtcclxuICAgICAgICBjb2xvcjogY2VydHkudmFycy50aGVtZUNvbG9yLFxyXG4gICAgICAgIHN0cm9rZVdpZHRoOiA1LFxyXG4gICAgICAgIHRyYWlsV2lkdGg6IDAsXHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGV4dCxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAncHJvZ3Jlc3MtdGV4dCcsXHJcbiAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICc1MCUnLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogJzUwJScsXHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY2VydHkucHJvZ3Jlc3MudGV4dENvbG9yLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAsXHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLFxyXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJlZml4OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiAndHJhbnNsYXRlKC01MCUsIC01MCUpJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhdXRvU3R5bGVDb250YWluZXI6IHRydWUsXHJcbiAgICAgICAgICAgIGFsaWduVG9Cb3R0b206IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN2Z1N0eWxlOiB7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXHJcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJSdcclxuICAgICAgICB9LFxyXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICBlYXNpbmc6ICdlYXNlT3V0J1xyXG4gICAgfSk7XHJcblxyXG4gICAgY2lyY2xlLmFuaW1hdGUodmFsdWUpOyAvLyBOdW1iZXIgZnJvbSAwLjAgdG8gMS4wXHJcbn1cclxuXHJcbi8qIENlcnR5IFByb2dyZXNzIExpbmUgKi9cclxuZnVuY3Rpb24gYWNlX3Byb2dyZXNzX2xpbmUoZWxlbWVudCwgdGV4dCwgdmFsdWUsIGR1cmF0aW9uKSB7XHJcbiAgICAvLyBXZSBoYXZlIHVuZGVmaW5lZCB0ZXh0IHdoZW4gdXNlciBkaWRudG4gZmlsbCB0ZXh0IGZpZWxkIGZyb20gYWRtaW5cclxuICAgIGlmICh0eXBlb2YgdGV4dCA9PT0gXCJ1bmRlZmluZWRcIikgeyB0ZXh0ID0gXCJcIjsgfVxyXG4gICAgXHJcbiAgICB2YXIgbGluZSA9IG5ldyBQcm9ncmVzc0Jhci5MaW5lKGVsZW1lbnQsIHtcclxuICAgICAgICBzdHJva2VXaWR0aDogNCxcclxuICAgICAgICBlYXNpbmc6ICdlYXNlSW5PdXQnLFxyXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgICBjb2xvcjogY2VydHkudmFycy50aGVtZUNvbG9yLFxyXG4gICAgICAgIHRyYWlsQ29sb3I6IGNlcnR5LnByb2dyZXNzLnRyYWlsQ29sb3IsXHJcbiAgICAgICAgdHJhaWxXaWR0aDogNCxcclxuICAgICAgICBzdmdTdHlsZToge1xyXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxyXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJ1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdGV4dDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogdGV4dCxcclxuICAgICAgICAgICAgY2xhc3NOYW1lOiAncHJvZ3Jlc3MtdGV4dCcsXHJcbiAgICAgICAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgICAgICAgICB0b3A6ICctMjVweCcsXHJcbiAgICAgICAgICAgICAgICByaWdodDogJzAnLFxyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNlcnR5LnByb2dyZXNzLnRleHRDb2xvcixcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMCxcclxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybToge1xyXG4gICAgICAgICAgICAgICAgICAgIHByZWZpeDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogJ3RyYW5zbGF0ZSgwLCAwKSdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYXV0b1N0eWxlQ29udGFpbmVyOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgbGluZS5hbmltYXRlKHZhbHVlKTsgIC8vIE51bWJlciBmcm9tIDAuMCB0byAxLjBcclxufVxyXG5cclxuLyogQ2VydHkgRWxlbWVudCBJbiBWaWV3cG9ydCAqL1xyXG5mdW5jdGlvbiBhY2VfaXNfZWxlbV9pbl92aWV3cG9ydChlbCwgdnBhcnQpIHtcclxuICAgIHZhciByZWN0ID0gZWxbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgIHJlY3QuYm90dG9tID49IDAgJiZcclxuICAgIHJlY3QucmlnaHQgPj0gMCAmJlxyXG4gICAgcmVjdC50b3AgKyB2cGFydCA8PSAod2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpICYmXHJcbiAgICByZWN0LmxlZnQgPD0gKHdpbmRvdy5pbm5lcldpZHRoIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aClcclxuICAgICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFjZV9pc19lbGVtc19pbl92aWV3cG9ydChlbGVtcywgdnBhcnQpIHtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgaXRlbSA9IGpRdWVyeShlbGVtc1tpXSk7XHJcblxyXG4gICAgICAgIGlmIChpdGVtLmhhc0NsYXNzKCdjcnQtYW5pbWF0ZScpICYmIGFjZV9pc19lbGVtX2luX3ZpZXdwb3J0KGl0ZW0sIHZwYXJ0KSkge1xyXG4gICAgICAgICAgICBpdGVtLnJlbW92ZUNsYXNzKCdjcnQtYW5pbWF0ZScpLmFkZENsYXNzKCdjcnQtYW5pbWF0ZWQnKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuaW1hdGUgQ2lyY2xlIENoYXJ0XHJcbiAgICAgICAgICAgIGlmKGl0ZW0uaGFzQ2xhc3MoJ3Byb2dyZXNzLWNoYXJ0Jykpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoYXJ0ID0gaXRlbS5maW5kKCcucHJvZ3Jlc3MtYmFyJyk7XHJcbiAgICAgICAgICAgICAgICBhY2VfcHJvZ3Jlc3NfY2hhcnQoY2hhcnRbMF0sIGNoYXJ0LmRhdGEoJ3RleHQnKSwgY2hhcnQuZGF0YSgndmFsdWUnKSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEFuaW1hdGUgTGluZSBDaGFydFxyXG4gICAgICAgICAgICBpZihpdGVtLmhhc0NsYXNzKCdwcm9ncmVzcy1saW5lJykpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpbmUgPSBpdGVtLmZpbmQoJy5wcm9ncmVzcy1iYXInKTtcclxuICAgICAgICAgICAgICAgIGFjZV9wcm9ncmVzc19saW5lKGxpbmVbMF0sIGxpbmUuZGF0YSgndGV4dCcpLCBsaW5lLmRhdGEoJ3ZhbHVlJyksIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBhY2VfYXBwZWFyX2VsZW1zKGVsZW1zLCB2cGFydCkge1xyXG4gICAgYWNlX2lzX2VsZW1zX2luX3ZpZXdwb3J0KGVsZW1zLCB2cGFydCk7XHJcblxyXG4gICAgalF1ZXJ5KHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBhY2VfaXNfZWxlbXNfaW5fdmlld3BvcnQoZWxlbXMsIHZwYXJ0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGpRdWVyeSh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYWNlX2lzX2VsZW1zX2luX3ZpZXdwb3J0KGVsZW1zLCB2cGFydCk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuLyogQ2VydHkgR29vZ2xlIE1hcCAqL1xyXG5mdW5jdGlvbiBpbml0aWFsaXNlR29vZ2xlTWFwKG1hcFN0eWxlcykge1xyXG4gICAgdmFyIGxhdGxuZztcclxuICAgIHZhciBsYXQgPSA0NC41NDAzO1xyXG4gICAgdmFyIGxuZyA9IC03OC41NDYzO1xyXG4gICAgdmFyIG1hcCA9IGpRdWVyeSgnI21hcCcpO1xyXG4gICAgdmFyIG1hcENhbnZhcyA9IG1hcC5nZXQoMCk7XHJcbiAgICB2YXIgbWFwX3N0eWxlcyA9IGpRdWVyeS5wYXJzZUpTT04obWFwU3R5bGVzKTtcclxuXHJcbiAgICBpZiAobWFwLmRhdGEoXCJsYXRpdHVkZVwiKSkgbGF0ID0gbWFwLmRhdGEoXCJsYXRpdHVkZVwiKTtcclxuICAgIGlmIChtYXAuZGF0YShcImxvbmdpdHVkZVwiKSkgbG5nID0gbWFwLmRhdGEoXCJsb25naXR1ZGVcIik7XHJcblxyXG4gICAgbGF0bG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcblxyXG4gICAgLy8gTWFwIE9wdGlvbnNcclxuICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgIHpvb206IDE0LFxyXG4gICAgICAgIGNlbnRlcjogbGF0bG5nLFxyXG4gICAgICAgIHNjcm9sbHdoZWVsOiB0cnVlLFxyXG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXHJcbiAgICAgICAgc3R5bGVzOiBtYXBfc3R5bGVzXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENyZWF0ZSB0aGUgTWFwXHJcbiAgICBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcENhbnZhcywgbWFwT3B0aW9ucyk7XHJcblxyXG4gICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgIG1hcDogbWFwLFxyXG4gICAgICAgIHBvc2l0aW9uOiBsYXRsbmcsXHJcbiAgICAgICAgaWNvbjoge1xyXG4gICAgICAgICAgICBwYXRoOiAnTTEyNSA0MTAgYy01NiAtNzIgLTExMSAtMTc2IC0xMjAgLTIyNCAtNyAtMzYgMTEgLTgzIDQ5IC0xMjQgNzYgLTg1IDIyMyAtNjcgMjcwIDMxIDI4IDYwIDI5IDg4IDYgMTUwIC0xOSA1MSAtMTIyIDIwNSAtMTQ4IDIyMSAtNiAzIC0zMiAtMjEgLTU3IC01NHogbTExMCAtMTc1IGMzNSAtMzQgMzMgLTc4IC00IC0xMTYgLTM1IC0zNSAtNzEgLTM3IC0xMDUgLTcgLTQwIDM1IC00MyA3OCAtMTEgMTE2IDM0IDQxIDg0IDQ0IDEyMCA3eicsXHJcbiAgICAgICAgICAgIGZpbGxDb2xvcjogY2VydHlfdmFyc19mcm9tX1dQLnRoZW1lQ29sb3IsXHJcbiAgICAgICAgICAgIGZpbGxPcGFjaXR5OiAxLFxyXG4gICAgICAgICAgICBzY2FsZTogMC4xLFxyXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogY2VydHlfdmFyc19mcm9tX1dQLnRoZW1lQ29sb3IsXHJcbiAgICAgICAgICAgIHN0cm9rZVdlaWdodDogMSxcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgZ29vZ2xlLm1hcHMuUG9pbnQoMTg1LCA1MDApXHJcbiAgICAgICAgfSxcclxuICAgICAgICB0aXRsZTogJ0hlbGxvIFdvcmxkISdcclxuICAgIH0pO1xyXG5cclxuICAgIC8qdmFyIG1hcmtlciA9IG5ldyBNYXJrZXIoe1xyXG4gICAgIG1hcDogbWFwLFxyXG4gICAgIHBvc2l0aW9uOiBsYXRsbmcsXHJcbiAgICAgaWNvbjoge1xyXG4gICAgIHBhdGg6IFNRVUFSRV9QSU4sXHJcbiAgICAgZmlsbENvbG9yOiAnJyxcclxuICAgICBmaWxsT3BhY2l0eTogMCxcclxuICAgICBzdHJva2VDb2xvcjogJycsXHJcbiAgICAgc3Ryb2tlV2VpZ2h0OiAwXHJcbiAgICAgfSxcclxuICAgICBtYXBfaWNvbl9sYWJlbDogJzxzcGFuIGNsYXNzPVwibWFwLWljb24gbWFwLWljb24tcG9zdGFsLWNvZGVcIj48L3NwYW4+J1xyXG4gICAgIH0pOyovXHJcblxyXG4gICAgLy8gS2VlcCBNYXJrZXIgaW4gQ2VudGVyXHJcbiAgICBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFwLnNldENlbnRlcihsYXRsbmcpO1xyXG4gICAgfSk7XHJcbn0iLCIvKipcclxuICogQ2VydHkgTmF2aWdhdGlvblxyXG4gKi9cclxuXHJcbi8vIE5hdmlnYXRpb24gV2l0aCBTY3JvbGwgYW5kIEFycm93XHJcbmNlcnR5Lm5hdi5pbml0U2Nyb2xsID0gZnVuY3Rpb24oIGVsICl7XHJcbiAgICAvLyBTZXQgTmF2IEhlaWdodFxyXG4gICAgLy8gY2VydHkubmF2LnNjcm9sbCA9IGVsO1xyXG5cclxuICAgIGVsLmhlaWdodChlbC5oZWlnaHQoKSkuYW5pbWF0ZSh7aGVpZ2h0OiBjZXJ0eS5uYXYuaGVpZ2h0fSwgNzAwLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAvLyBNb3VzZSBTY3JvbGxcclxuICAgICAgICBlbC5tQ3VzdG9tU2Nyb2xsYmFyKHtcclxuICAgICAgICAgICAgYXhpczogXCJ5XCIsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclBvc2l0aW9uOiBcIm91dHNpZGVcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXJyb3cgU2Nyb2xsXHJcbiAgICBpZiAoY2VydHkubmF2LmFycm93KXtcclxuICAgICAgICBqUXVlcnkoXCIjY3J0LW5hdi10b29sc1wiKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIGpRdWVyeShcIiNjcnQtbmF2LWFycm93XCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBlbC5tQ3VzdG9tU2Nyb2xsYmFyKCdzY3JvbGxUbycsICctPScrY2VydHkubmF2LmhlaWdodCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBTdGlja3kgTmF2aWdhdGlvblxyXG5jZXJ0eS5uYXYuZXhpc3RzID0gZmFsc2U7XHJcbmNlcnR5Lm5hdi5tYWtlU3RpY2t5ID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAvLyBjaGVjayBzdGlja3kgb3B0aW9uLCBkZXZpY2UgdHlwZSBhbmQgc2NyZWVuIHNpemVcclxuICAgIGlmICggdGhpcy5zdGlja3kuYWN0aXZlICYmICFjZXJ0eS52YXJzLm1vYmlsZSAmJiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBjZXJ0eS52YXJzLnNjcmVlbk1kICsgJyknKSApIHtcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgaWYgbmF2IG5vZGVzIGV4aXN0c1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdHMgKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdpbmRvdyBzY3JvbGwgcGFzcyBlbGVtZW50XHJcbiAgICAgICAgICAgIGlmICggY2VydHkudmFycy53aW5kb3dTY3JvbGxUb3AgPiB0aGlzLndyYXAub2Zmc2V0KCkudG9wICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiB0aGlzLnN0aWNreS50b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiB0aGlzLndyYXAub2Zmc2V0KCkubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB0aGlzLndyYXAud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAnYm90dG9tJzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdmaXhlZCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICdib3R0b20nOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVsID0galF1ZXJ5KCcjY3J0LW5hdi1pbm5lcicpO1xyXG4gICAgICAgICAgICB0aGlzLndyYXAgPSBqUXVlcnkoJyNjcnQtbmF2LXdyYXAnKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpcy5lbC5sZW5ndGggPiAwICYmIHRoaXMud3JhcC5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leGlzdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gTmF2aWdhdGlvbiBUb29sdGlwc1xyXG5jZXJ0eS5uYXYudG9vbHRpcC5lbCA9ICcnO1xyXG5jZXJ0eS5uYXYudG9vbHRpcC50aW1lciA9IDA7XHJcblxyXG5jZXJ0eS5uYXYudG9vbHRpcC5zaG93ID0gZnVuY3Rpb24oY3VycmVudCl7XHJcbiAgICBjZXJ0eS5uYXYudG9vbHRpcC50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICBjZXJ0eS5uYXYudG9vbHRpcC5lbCA9IGpRdWVyeSgnPGRpdiBjbGFzcz1cImNydC10b29sdGlwXCI+PC9kaXY+Jyk7XHJcblxyXG4gICAgICAgIC8vIEluaXQgdmFyc1xyXG4gICAgICAgIHZhciB0b3AgPSBjdXJyZW50Lm9mZnNldCgpLnRvcDtcclxuICAgICAgICB2YXIgbGVmdCA9IGN1cnJlbnQub2Zmc2V0KCkubGVmdDtcclxuICAgICAgICB2YXIgcmlnaHQgPSBsZWZ0ICsgY3VycmVudC5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgdmFyIHdpZHRoID0gY3VycmVudC5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgdmFyIGhlaWdodCA9IDQ7XHJcblxyXG4gICAgICAgIC8vIEFwcGVuZCB0b29sdGlwXHJcbiAgICAgICAgY2VydHkudmFycy5ib2R5LmFwcGVuZCggY2VydHkubmF2LnRvb2x0aXAuZWwgKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRvb2x0aXAgdGV4dFxyXG4gICAgICAgIGNlcnR5Lm5hdi50b29sdGlwLmVsLnRleHQoIGN1cnJlbnQuZGF0YSgndG9vbHRpcCcpICk7XHJcblxyXG4gICAgICAgIC8vIFBvc2l0aW9uaW5nIHRvb2x0aXBcclxuICAgICAgICBpZiAocmlnaHQgKyBjZXJ0eS5uYXYudG9vbHRpcC5lbC5vdXRlcldpZHRoKCkgPCBjZXJ0eS52YXJzLndpbmRvd1cpIHtcclxuICAgICAgICAgICAgY2VydHkubmF2LnRvb2x0aXAuZWwuYWRkQ2xhc3MoJ2Fycm93LWxlZnQnKS5jc3Moe1wibGVmdFwiOiByaWdodCArIFwicHhcIiwgXCJ0b3BcIjogKHRvcCArIGhlaWdodCkgKyBcInB4XCJ9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjZXJ0eS5uYXYudG9vbHRpcC5lbC5hZGRDbGFzcygnYXJyb3ctcmlnaHQgdGV4dC1yaWdodCcpLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcImxlZnRcIjogKGxlZnQgLSBjZXJ0eS5uYXYudG9vbHRpcC5lbC5vdXRlcldpZHRoKCkgLSAxMCkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBcInRvcFwiOiAodG9wICsgaGVpZ2h0KSArIFwicHhcIlxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNob3cgVG9vbHRpcFxyXG4gICAgICAgIGNlcnR5Lm5hdi50b29sdGlwLmVsLmZhZGVJbigxNTApO1xyXG5cclxuICAgIH0sIDE1MCk7XHJcbn07XHJcblxyXG5jZXJ0eS5uYXYudG9vbHRpcC5oaWRlID0gZnVuY3Rpb24oKXtcclxuICAgIGNsZWFyVGltZW91dChjZXJ0eS5uYXYudG9vbHRpcC50aW1lcik7XHJcbiAgICBpZiAoY2VydHkubmF2LnRvb2x0aXAuZWwubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNlcnR5Lm5hdi50b29sdGlwLmVsLmZhZGVPdXQoMTUwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGNlcnR5Lm5hdi50b29sdGlwLmVsLnJlbW92ZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59OyIsIi8qKlxyXG4gKiBDZXJ0eSBTaWRlIEJveFxyXG4gKi9cclxuY2VydHkuc2lkZUJveC5leGlzdHMgPSBmYWxzZTtcclxuY2VydHkuc2lkZUJveC5tYWtlU3RpY2t5ID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICAvLyBjaGVjayBzdGlja3kgb3B0aW9uLCBkZXZpY2UgdHlwZSBhbmQgc2NyZWVuIHNpemVcclxuICAgIGlmICggdGhpcy5zdGlja3kuYWN0aXZlICYmICFjZXJ0eS52YXJzLm1vYmlsZSAmJiBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcgKyBjZXJ0eS52YXJzLnNjcmVlbk1kICsgJyknKSApIHtcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgaWYgbmF2IG5vZGVzIGV4aXN0c1xyXG4gICAgICAgIGlmICggdGhpcy5leGlzdHMgKXtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIHdpbmRvdyBzY3JvbGwgcGFzcyBlbGVtZW50XHJcbiAgICAgICAgICAgIGlmICggY2VydHkudmFycy53aW5kb3dTY3JvbGxUb3AgPiB0aGlzLndyYXAub2Zmc2V0KCkudG9wICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiB0aGlzLnN0aWNreS50b3AsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiB0aGlzLndyYXAub2Zmc2V0KCkubGVmdCxcclxuICAgICAgICAgICAgICAgICAgICAnd2lkdGgnOiB0aGlzLndyYXAud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAnYm90dG9tJzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICdwb3NpdGlvbic6ICdmaXhlZCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICd0b3AnOiAnMCcsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xlZnQnOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJzogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgICAgICdib3R0b20nOiAnYXV0bycsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc2l0aW9uJzogJ3JlbGF0aXZlJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmVsID0galF1ZXJ5KCcjY3J0LXNpZGUtYm94Jyk7XHJcbiAgICAgICAgICAgIHRoaXMud3JhcCA9IGpRdWVyeSgnI2NydC1zaWRlLWJveC13cmFwJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHRoaXMuZWwubGVuZ3RoID4gMCAmJiB0aGlzLndyYXAubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufTsiLCIvKipcclxuICogQ2VydHkgU2xpZGVyXHJcbiAqL1xyXG5cclxuLy8gU2xpZGVyXHJcbmNlcnR5LnNsaWRlciA9IGZ1bmN0aW9uKHNsaWRlcil7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlci5sZW5ndGg7IGkrKykge1xyXG5cclxuICAgICAgIGlmKCBqUXVlcnkoc2xpZGVyW2ldKS5kYXRhKFwiaW5pdFwiKSAhPSBcIm5vbmVcIiApe1xyXG4gICAgICAgICAgIGpRdWVyeShzbGlkZXJbaV0pLnNsaWNrKCk7XHJcbiAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBDYXJvdXNlbFxyXG5jZXJ0eS5jYXJvdXNlbCA9IGZ1bmN0aW9uKGNhcm91c2VsKXtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2Fyb3VzZWwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiggalF1ZXJ5KGNhcm91c2VsW2ldKS5kYXRhKFwiaW5pdFwiKSAhPT0gXCJub25lXCIgKXtcclxuICAgICAgICAgICAgalF1ZXJ5KGNhcm91c2VsW2ldKS5zbGljayh7XHJcbiAgICAgICAgICAgICAgICBcImRvdHNcIiA6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuIiwiLyoqXHJcbiAqIENlcnR5IFBvcnRmb2xpb1xyXG4gKi9cclxuXHJcbmNlcnR5LnBvcnRmb2xpbyA9IHtcclxuICAgIHBvcHVwU2xpZGVyOiAnJyxcclxuICAgIHBvcHVwQ2Fyb3VzZWw6ICcnLFxyXG4gICAgY3VycmVudEVtYmVkOiBmYWxzZSxcclxuICAgIGN1cnJlbnRFbWJlZFR5cGU6IGZhbHNlLFxyXG5cclxuICAgIGluaXRHcmlkOiBmdW5jdGlvbihlbCl7XHJcbiAgICAgICAgLy8gaXNvdG9wZSBpbml0aWFsaXphdGlvblxyXG4gICAgICAgIHZhciBncmlkID0gZWwuaXNvdG9wZSh7XHJcbiAgICAgICAgICAgIGlzT3JpZ2luTGVmdDogIWNlcnR5LnZhcnMucnRsLFxyXG4gICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICcucGYtZ3JpZC1pdGVtJyxcclxuICAgICAgICAgICAgcGVyY2VudFBvc2l0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICBtYXNvbnJ5OiB7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5XaWR0aDogJy5wZi1ncmlkLXNpemVyJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGxheW91dCBpc290b3BlIGFmdGVyIGVhY2ggaW1hZ2UgbG9hZHNcclxuICAgICAgICBncmlkLmltYWdlc0xvYWRlZCgpLnByb2dyZXNzKCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZ3JpZC5pc290b3BlKCdsYXlvdXQnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gaXNvdG9wZSBmaWx0ZXJcclxuICAgICAgICB2YXIgZmlsdGVyID0gZWwuY2xvc2VzdCgnLnBmLXdyYXAnKS5maW5kKCcucGYtZmlsdGVyJyk7XHJcbiAgICAgICAgaWYgKGZpbHRlci5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJfYnRuID0gZmlsdGVyLmZpbmQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVyX2J0bl9maXJzdCA9IGpRdWVyeSgnLnBmLWZpbHRlciBidXR0b246Zmlyc3QtY2hpbGQnKTtcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcl9idG5fZmlyc3QuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cclxuICAgICAgICAgICAgZmlsdGVyX2J0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJfYnRuLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlclZhbHVlID0galF1ZXJ5KHRoaXMpLmF0dHIoJ2RhdGEtZmlsdGVyJyk7XHJcbiAgICAgICAgICAgICAgICBncmlkLmlzb3RvcGUoeyBmaWx0ZXI6IGZpbHRlclZhbHVlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9wZW5Qb3B1cDogZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgIC8vIGFkZCBvcGVuZWQgY2xhc3Mgb24gaHRtbFxyXG4gICAgICAgIGNlcnR5LnZhcnMuaHRtbC5hZGRDbGFzcygnY3J0LXBmLXBvcHVwLW9wZW5lZCcpO1xyXG5cclxuICAgICAgICAvLyBhcHBlbmQgcG9ydGZvbGlvIHBvcHVwXHJcbiAgICAgICAgdGhpcy5wb3B1cF93cmFwcGVyID0galF1ZXJ5KCc8ZGl2IGlkPVwicGYtcG9wdXAtd3JhcFwiPicrXHJcblx0XHRcdCc8YnV0dG9uIGlkPVwicGYtcG9wdXAtY2xvc2VcIj48aSBjbGFzcz1cImNydC1pY29uIGNydC1pY29uLWNsb3NlXCI+PC9pPjwvYnV0dG9uPicrXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGYtcG9wdXAtaW5uZXJcIj4nK1xyXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBmLXBvcHVwLW1pZGRsZVwiPicrXHJcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGYtcG9wdXAtY29udGFpbmVyXCI+JytcclxuICAgICAgICAgICAgJzxidXR0b24gaWQ9XCJwZi1wb3B1cC1jbG9zZVwiPjxpIGNsYXNzPVwicnNpY29uIHJzaWNvbi1jbG9zZVwiPjwvaT48L2J1dHRvbj4nK1xyXG4gICAgICAgICAgICAnPGRpdiBpZD1cInBmLXBvcHVwLWNvbnRlbnRcIiBjbGFzcz1cInBmLXBvcHVwLWNvbnRlbnRcIj48L2Rpdj4nK1xyXG4gICAgICAgICAgICAnPC9kaXY+JytcclxuICAgICAgICAgICAgJzwvZGl2PicrXHJcbiAgICAgICAgICAgICc8L2Rpdj4nK1xyXG4gICAgICAgICAgICAnPC9kaXY+Jyk7XHJcblxyXG4gICAgICAgIGNlcnR5LnZhcnMuYm9keS5hcHBlbmQoIHRoaXMucG9wdXBfd3JhcHBlciApO1xyXG5cclxuICAgICAgICAvLyBhZGQgcG9ydGZvbGlvIHBvcHVwIGNvbnRlbnRcclxuICAgICAgICB0aGlzLnBvcHVwX2NvbnRlbnQgPSBqUXVlcnkoJyNwZi1wb3B1cC1jb250ZW50Jyk7XHJcbiAgICAgICAgdGhpcy5wb3B1cF9jb250ZW50LmFwcGVuZCggZWwuY2xvbmUoKSApO1xyXG5cclxuICAgICAgICAvLyBwb3B1cCBzbGlkZXJcclxuICAgICAgICB0aGlzLnBvcHVwU2xpZGVyID0galF1ZXJ5KCcjcGYtcG9wdXAtY29udGVudCAucGYtcG9wdXAtbWVkaWEnKTtcclxuXHJcbiAgICAgICAgLy8gcG9wdXAgc2xpZGVyOiBvbiBpbml0XHJcbiAgICAgICAgdGhpcy5wb3B1cFNsaWRlci5vbignaW5pdCcsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaykge1xyXG4gICAgICAgICAgICBjZXJ0eS5wb3J0Zm9saW8ubG9hZEVtYmVkKDApO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSBQb3J0Zm9saW8gUG9wdXAgVmlzaWJsZVxyXG4gICAgICAgICAgICBqUXVlcnkod2luZG93KS50cmlnZ2VyKCdyZXNpemUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gcG9wdXAgc2xpZGVyOiBiZWZvcmUgY2hhbmdlXHJcbiAgICAgICAgdGhpcy5wb3B1cFNsaWRlci5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24gKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0b3AgY3VycmVudCBzbGlkZSBpZnJhbWUvdmlkZW8gcGxheVxyXG4gICAgICAgICAgICBpZiggY2VydHkucG9ydGZvbGlvLmN1cnJlbnRFbWJlZCAmJiBjZXJ0eS5wb3J0Zm9saW8uY3VycmVudEVtYmVkVHlwZSApe1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChjZXJ0eS5wb3J0Zm9saW8uY3VycmVudEVtYmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpZnJhbWVcIjpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZnJhbWUgPSBjZXJ0eS5wb3J0Zm9saW8uY3VycmVudEVtYmVkLmZpbmQoJ2lmcmFtZScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZnJhbWUuYXR0cignc3JjJywgaWZyYW1lLmF0dHIoJ3NyYycpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwidmlkZW9cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZpZGVvID0gY2VydHkucG9ydGZvbGlvLmN1cnJlbnRFbWJlZC5maW5kKCd2aWRlbycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aWRlb1swXS5wYXVzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIExvYWQgbmV4dCBzbGlkZSBlbWJlZFxyXG4gICAgICAgICAgICBjZXJ0eS5wb3J0Zm9saW8ubG9hZEVtYmVkKG5leHRTbGlkZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHBvcHVwIHNsaWRlcjogaW5pdGlhbGl6ZVxyXG4gICAgICAgIHRoaXMucG9wdXBTbGlkZXIuc2xpY2soe1xyXG4gICAgICAgICAgICBzcGVlZDogNTAwLFxyXG4gICAgICAgICAgICBkb3RzOiBmYWxzZSxcclxuICAgICAgICAgICAgYXJyb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAxLFxyXG4gICAgICAgICAgICBhZGFwdGl2ZUhlaWdodDogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBwb3B1cCBjYXJvdXNlbFxyXG4gICAgICAgIHRoaXMucG9wdXBDYXJvdXNlbCA9IGpRdWVyeSgnI3BmLXBvcHVwLWNvbnRlbnQgLnBmLXJlbC1jYXJvdXNlbCcpO1xyXG5cclxuICAgICAgICAvLyBwb3B1cCBjYXJvdXNlbDogaW5pdGlhbGl6ZVxyXG4gICAgICAgIHRoaXMucG9wdXBDYXJvdXNlbC5zbGljayh7XHJcbiAgICAgICAgICAgIGRvdHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBpbmZpbml0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgc2xpZGVzVG9TaG93OiAzLFxyXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMyxcclxuICAgICAgICAgICAgbGF6eUxvYWQ6ICdvbmRlbWFuZCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gbWFrZSBwb3J0Zm9saW8gcG9wdXAgdmlzaWJsZVxyXG4gICAgICAgIHRoaXMucG9wdXBfd3JhcHBlci5hZGRDbGFzcygncGYtb3BlbmVkJyk7XHJcblxyXG4gICAgICAgIC8vIGxvY2sgd2luZG93IHNjcm9sbFxyXG4gICAgICAgIGNlcnR5LmxvY2tTY3JvbGwoKTtcclxuICAgIH0sXHJcblxyXG4gICAgY2xvc2VQb3B1cDogZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAvLyByZW1vdmUgb3BlbmVkIGNsYXNzIGZyb20gaHRtbFxyXG4gICAgICAgIGNlcnR5LnZhcnMuaHRtbC5yZW1vdmVDbGFzcygnY3ItcG9ydGZvbGlvLW9wZW5lZCcpO1xyXG5cclxuICAgICAgICAvLyBtYWtlIHBvcnRmb2xpbyBwb3B1cCBpbnZpc2libGVcclxuICAgICAgICB0aGlzLnBvcHVwX3dyYXBwZXIucmVtb3ZlQ2xhc3MoJ3BmLW9wZW5lZCcpO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIGNlcnR5LnBvcnRmb2xpby5wb3B1cF93cmFwcGVyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICBjZXJ0eS51bmxvY2tTY3JvbGwoKTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfSxcclxuXHJcbiAgICBsb2FkRW1iZWQ6IGZ1bmN0aW9uIChzbGlkZUluZGV4KSB7XHJcbiAgICAgICAgdmFyIGN1cnJlbnRFbWJlZCA9IGpRdWVyeSgnI3BmLXBvcHVwLWNvbnRlbnQgLnBmLXBvcHVwLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInICsgc2xpZGVJbmRleCArICdcIl0nKS5maW5kKCcucGYtcG9wdXAtZW1iZWQnKTtcclxuICAgICAgICB2YXIgY3VycmVudEVtYmVkVHlwZSA9IGpRdWVyeS50cmltKGN1cnJlbnRFbWJlZC5kYXRhKCd0eXBlJykpO1xyXG4gICAgICAgIHZhciBjdXJlbnRFbWJlZFVybCA9IGpRdWVyeS50cmltKGN1cnJlbnRFbWJlZC5kYXRhKCd1cmwnKSk7XHJcblxyXG4gICAgICAgIGNlcnR5LnBvcnRmb2xpby5jdXJyZW50RW1iZWQgPSBjdXJyZW50RW1iZWQ7XHJcbiAgICAgICAgY2VydHkucG9ydGZvbGlvLmN1cnJlbnRFbWJlZFR5cGUgPSBjdXJyZW50RW1iZWRUeXBlO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiAnY3VycmVudEVtYmVkJyBzdGlsbCBub3QgbG9hZGVkIHRoZW4gZG8gYWN0aW9uc1xyXG4gICAgICAgIGlmICghY3VycmVudEVtYmVkLmhhc0NsYXNzKCdwZi1lbWJlZC1sb2FkZWQnKSkge1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgJ2N1cnJlbnRFbWJlZCcgdXJsIGFuZCB0eXBlIGFyZSBwcm92aWRlZFxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFbWJlZFR5cGUgIT09IHR5cGVvZiB1bmRlZmluZWQgJiYgY3VycmVudEVtYmVkVHlwZSAhPT0gZmFsc2UgJiYgY3VycmVudEVtYmVkVHlwZSAhPT0gXCJcIiAmJiB0eXBlb2YgY3VyZW50RW1iZWRVcmwgIT09IHR5cGVvZiB1bmRlZmluZWQgJiYgY3VyZW50RW1iZWRVcmwgIT09IGZhbHNlICYmIGN1cmVudEVtYmVkVXJsICE9PSBcIlwiKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2V0IGVtYmVkIGRpbWVuc2lvbnMgaWYgcHJvdmlkZWRcclxuICAgICAgICAgICAgICAgIHZhciBlbWJlZFcgPSBqUXVlcnkudHJpbShjdXJyZW50RW1iZWQuZGF0YSgnd2lkdGgnKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZW1iZWRIID0galF1ZXJ5LnRyaW0oY3VycmVudEVtYmVkLmRhdGEoJ2hlaWdodCcpKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW1iZWRXICE9PSB0eXBlb2YgdW5kZWZpbmVkICYmIGVtYmVkVyAhPT0gZmFsc2UgJiYgZW1iZWRXICE9PSBcIlwiICYmIHR5cGVvZiBlbWJlZEggIT09IHR5cGVvZiB1bmRlZmluZWQgJiYgZW1iZWRIICE9PSBmYWxzZSAmJiBlbWJlZEggIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW1iZWQuY3NzKHsncGFkZGluZy10b3AnOiAoZW1iZWRIL2VtYmVkVyoxMDApKyclJ30pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExvYWQgYXBwcm9wcmlhdGUgZW1iZWRcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAoY3VycmVudEVtYmVkVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbWFnZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZW1iZWQgdHlwZSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW1iZWQuYWRkQ2xhc3MoJ3BmLWVtYmVkLWltYWdlJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBcHBlbmQgZW1iZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGltZyA9IGpRdWVyeSgnPGltZy8+Jyx7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmM6IGN1cmVudEVtYmVkVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6ICdkaXNwbGF5Om5vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmxvYWQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5mYWRlSW4oNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbWJlZC5hZGRDbGFzcygncGYtZW1iZWQtbG9hZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW1iZWQuYWRkQ2xhc3MoJ3BmLWVtYmVkLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVtYmVkLmVtcHR5KCkuYXBwZW5kKGltZyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlmcmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGQgZW1iZWQgdHlwZSBjbGFzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW1iZWQuYWRkQ2xhc3MoJ3BmLWVtYmVkLWlmcmFtZScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXBwZW5kIEVtYmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZnJhbWUgPSBqUXVlcnkoJzxpZnJhbWUvPicsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYzogY3VyZW50RW1iZWRVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogJ2Rpc3BsYXk6bm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxvd2Z1bGxzY3JlZW46ICcnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmxvYWQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5mYWRlSW4oNTAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbWJlZC5hZGRDbGFzcygncGYtZW1iZWQtbG9hZGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50RW1iZWQuYWRkQ2xhc3MoJ3BmLWVtYmVkLWVycm9yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEVtYmVkLmVtcHR5KCkuYXBwZW5kKGlmcmFtZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInZpZGVvXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkZCBlbWJlZCB0eXBlIGNsYXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbWJlZC5hZGRDbGFzcygncGYtZW1iZWQtdmlkZW8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFwcGVuZCBFbWJlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlkZW9PcHRpb25zID0gdGhpcy5wYXJzZU9wdGlvbnMoY3VyZW50RW1iZWRVcmwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmlkZW8gPSAnPHZpZGVvICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZpZGVvT3B0aW9ucy5wb3N0ZXIpIHZpZGVvICs9ICdwb3N0ZXI9XCInK3ZpZGVvT3B0aW9ucy5wb3N0ZXIrJ1wiICc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvICs9ICdjb250cm9scz1cImNvbnRyb2xzXCIgcHJlbG9hZD1cInllc1wiPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHZpZGVvT3B0aW9ucy5tcDQpIHZpZGVvICs9ICc8c291cmNlIHR5cGU9XCJ2aWRlby9tcDRcIiBzcmM9XCInK3ZpZGVvT3B0aW9ucy5tcDQrJ1wiLz4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2aWRlb09wdGlvbnMud2VibSkgdmlkZW8gKz0gJzxzb3VyY2UgdHlwZT1cInZpZGVvL3dlYm1cIiBzcmM9XCInK3ZpZGVvT3B0aW9ucy53ZWJtKydcIi8+JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodmlkZW9PcHRpb25zLm9ndikgdmlkZW8gKz0gJzxzb3VyY2UgdHlwZT1cInZpZGVvL29nZ1wiIHNyYz1cIicrdmlkZW9PcHRpb25zLm9ndisnXCIvPic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpZGVvICs9ICdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgdmlkZW8gdGFnLjwvdmlkZW8+JztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRFbWJlZC5lbXB0eSgpLmFwcGVuZCggalF1ZXJ5KHZpZGVvKSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHBhcnNlT3B0aW9uczogZnVuY3Rpb24gKHN0cikge1xyXG4gICAgICAgIHZhciBvYmogPSB7fTtcclxuICAgICAgICB2YXIgZGVsaW1pdGVySW5kZXg7XHJcbiAgICAgICAgdmFyIG9wdGlvbjtcclxuICAgICAgICB2YXIgcHJvcDtcclxuICAgICAgICB2YXIgdmFsO1xyXG4gICAgICAgIHZhciBhcnI7XHJcbiAgICAgICAgdmFyIGxlbjtcclxuICAgICAgICB2YXIgaTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIHNwYWNlcyBhcm91bmQgZGVsaW1pdGVycyBhbmQgc3BsaXRcclxuICAgICAgICBhcnIgPSBzdHIucmVwbGFjZSgvXFxzKjpcXHMqL2csICc6JykucmVwbGFjZSgvXFxzKixcXHMqL2csICcsJykuc3BsaXQoJywnKTtcclxuXHJcbiAgICAgICAgLy8gUGFyc2UgYSBzdHJpbmdcclxuICAgICAgICBmb3IgKGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgb3B0aW9uID0gYXJyW2ldO1xyXG5cclxuICAgICAgICAgICAgLy8gSWdub3JlIHVybHMgYW5kIGEgc3RyaW5nIHdpdGhvdXQgY29sb24gZGVsaW1pdGVyc1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBvcHRpb24uc2VhcmNoKC9eKGh0dHB8aHR0cHN8ZnRwKTpcXC9cXC8vKSAhPT0gLTEgfHxcclxuICAgICAgICAgICAgICAgIG9wdGlvbi5zZWFyY2goJzonKSA9PT0gLTFcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsaW1pdGVySW5kZXggPSBvcHRpb24uaW5kZXhPZignOicpO1xyXG4gICAgICAgICAgICBwcm9wID0gb3B0aW9uLnN1YnN0cmluZygwLCBkZWxpbWl0ZXJJbmRleCk7XHJcbiAgICAgICAgICAgIHZhbCA9IG9wdGlvbi5zdWJzdHJpbmcoZGVsaW1pdGVySW5kZXggKyAxKTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHZhbCBpcyBhbiBlbXB0eSBzdHJpbmcsIG1ha2UgaXQgdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIGlmICghdmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgYSBzdHJpbmcgdmFsdWUgaWYgaXQgaXMgbGlrZSBhIGJvb2xlYW5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWwgPT09ICd0cnVlJyB8fCAodmFsID09PSAnZmFsc2UnID8gZmFsc2UgOiB2YWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IGEgc3RyaW5nIHZhbHVlIGlmIGl0IGlzIGxpa2UgYSBudW1iZXJcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSAhaXNOYU4odmFsKSA/ICt2YWwgOiB2YWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG9ialtwcm9wXSA9IHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIG5vdGhpbmcgaXMgcGFyc2VkXHJcbiAgICAgICAgaWYgKHByb3AgPT0gbnVsbCAmJiB2YWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gc3RyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxufTtcclxuIiwiKGZ1bmN0aW9uICgkKSB7XHJcbiAgICBcInVzZSBzdHJpY3RcIjtcclxuXHJcbiAgICAkKGZ1bmN0aW9uICgpIHsgLy8gc3RhcnQ6IGRvY3VtZW50IHJlYWR5XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICBTZXQgR2xvYmFsIFZhcnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBjZXJ0eS5pbml0R2xvYmFsVmFycygpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgTmF2aWdhdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChjZXJ0eS52YXJzLmJvZHkuaGFzQ2xhc3MoJ2NydC1uYXYtb24nKSkgeyAvLyBDaGVjayBJZiBOYXYgRXhpc3RzXHJcbiAgICAgICAgICAgIC8vIFNjcm9sbGVkIE5hdmlnYXRpb24gKCBsYXJnZSBzY3JlZW5zIClcclxuICAgICAgICAgICAgaWYgKCBNb2Rlcm5penIubXEoJyhtaW4td2lkdGg6ICcrY2VydHkudmFycy5zY3JlZW5NZCsnKScpICYmIGNlcnR5Lm5hdi5oZWlnaHQgIT09ICdhdXRvJyApIHtcclxuICAgICAgICAgICAgICAgIGNlcnR5Lm5hdi5pbml0U2Nyb2xsKCAkKCcjY3J0LW5hdi1zY3JvbGwnKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTdGlja3kgTmF2aWdhdGlvblxyXG4gICAgICAgICAgICBjZXJ0eS5uYXYubWFrZVN0aWNreSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTmF2aWdhdGlvbiBUb29sdGlwc1xyXG4gICAgICAgICAgICBpZihjZXJ0eS5uYXYudG9vbHRpcC5hY3RpdmUpe1xyXG4gICAgICAgICAgICAgICAgJCgnI2NydC1uYXYgYScpLmhvdmVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjZXJ0eS5uYXYudG9vbHRpcC5zaG93KCAkKHRoaXMpICk7XHJcbiAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjZXJ0eS5uYXYudG9vbHRpcC5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIEFuY2hvciBOYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgICQoJyNjcnQtbmF2Jykub25lUGFnZU5hdih7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VIYXNoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVGhyZXNob2xkOiAwLjUsXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXI6ICc6bm90KC5leHRlcm5hbCknXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogIEZpeGVkIFNpZGUgQm94XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2VydHkuc2lkZUJveC5tYWtlU3RpY2t5KCk7XHJcblxyXG4gICAgICAgIC8qKiBQb3J0Zm9saW8gKi9cclxuICAgICAgICB2YXIgcGZfZ3JpZCA9ICQoJy5wZi1ncmlkJyk7XHJcblxyXG4gICAgICAgIC8vIGNoZWNrIGlmIGdyaWQgZXhpc3RzIHRoYW4gZG8gYWN0aW9uXHJcbiAgICAgICAgaWYgKHBmX2dyaWQubGVuZ3RoID4gMCkge1xyXG5cclxuICAgICAgICAgICAgLy8gaW5pdCBwb3J0Zm9saW8gZ3JpZFxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBmX2dyaWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNlcnR5LnBvcnRmb2xpby5pbml0R3JpZCggJChwZl9ncmlkW2ldKSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBvcGVuIHBvcnRmb2xpbyBwb3B1cFxyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5vbignY2xpY2snLCAnLnBmLXByb2plY3QnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cignaHJlZicpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNlcnR5LnBvcnRmb2xpby5vcGVuUG9wdXAoICQoaWQpICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucGYtcmVsLWhyZWYnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHZhciBocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgY29udGFpbiBhbmNob3IsIG9wZW4gcHJvamVjdCBwb3B1cFxyXG4gICAgICAgICAgICAgICAgaWYoIGhyZWYuaW5kZXhPZihcIiNcIikgIT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgYWxyZWFkeSBvcGVuZWQgcG9wdXBcclxuICAgICAgICAgICAgICAgICAgICBjZXJ0eS5wb3J0Zm9saW8uY2xvc2VQb3B1cCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBvcGVuIG5ldyBvbmUgYWZ0ZXIgdGltZW91dFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2VydHkucG9ydGZvbGlvLm9wZW5Qb3B1cCggJChocmVmKSApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblx0XHRcdFxyXG5cdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCAnI3BmLXBvcHVwLWNsb3NlJywgZnVuY3Rpb24oKSB7XHRcdFx0XHRcclxuICAgICAgICAgICAgICAgIGNlcnR5LnBvcnRmb2xpby5jbG9zZVBvcHVwKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gY2xvc2UgcG9ydGZvbGlvIHBvcHVwXHJcbiAgICAgICAgICAgICQoZG9jdW1lbnQpLm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgJy5jcnQtcGYtcG9wdXAtb3BlbmVkICNwZi1wb3B1cC13cmFwJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb250YWluZXIgPSAkKCcjcGYtcG9wdXAtY29udGVudCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgb2YgdGhlIGNsaWNrIGlzbid0IHRoZSBjb250YWluZXIuLi4gbm9yIGEgZGVzY2VuZGFudCBvZiB0aGUgY29udGFpbmVyXHJcbiAgICAgICAgICAgICAgICBpZiAoIWNvbnRhaW5lci5pcyhlLnRhcmdldCkgJiYgY29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VydHkucG9ydGZvbGlvLmNsb3NlUG9wdXAoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiogQ29tcG9uZW50cyAqL1xyXG4gICAgICAgIC8vIGluaXQgc2xpZGVyc1xyXG4gICAgICAgIGNlcnR5LnNsaWRlciggJChcIi5jci1zbGlkZXJcIikgKTtcclxuXHJcbiAgICAgICAgLy8gaW5pdCBjYXJvdXNlbFxyXG4gICAgICAgIGNlcnR5LmNhcm91c2VsKCAkKFwiLmNyLWNhcm91c2VsXCIpICk7XHJcblx0XHRcclxuXHRcdC8qKiBXaW5kb3cgU2Nyb2xsIFRvcCBCdXR0b24gKi9cclxuICAgICAgICB2YXIgJGJ0blNjcm9sbFRvcCA9ICQoJyNjcnQtYnRuLXVwJyk7XHJcblx0XHRcclxuXHRcdGlmKCRidG5TY3JvbGxUb3AubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuU2Nyb2xsVG9wLnNob3coMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYnRuU2Nyb2xsVG9wLmhpZGUoMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGlmICgkKHRoaXMpLnNjcm9sbFRvcCgpID4gMTAwKSB7XHJcblx0XHRcdFx0XHQkYnRuU2Nyb2xsVG9wLnNob3coMCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdCRidG5TY3JvbGxUb3AuaGlkZSgwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0JGJ0blNjcm9sbFRvcC5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDgwMCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuICAgIH0pOyAvLyBlbmQ6IGRvY3VtZW50IHJlYWR5XHJcblxyXG5cclxuXHJcbiAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHsgLy8gc3RhcnQ6IHdpbmRvdyByZXNpemVcclxuXHJcbiAgICAgICAgLy8gUmUgSW5pdCBWYXJzXHJcbiAgICAgICAgY2VydHkudmFycy53aW5kb3dXID0gJCh3aW5kb3cpLndpZHRoKCk7XHJcbiAgICAgICAgY2VydHkudmFycy53aW5kb3dIID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgIGNlcnR5LnZhcnMud2luZG93U2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuICAgICAgICAvLyBTdGlja3kgTmF2aWdhdGlvblxyXG4gICAgICAgIGNlcnR5Lm5hdi5tYWtlU3RpY2t5KCk7XHJcblxyXG4gICAgICAgIC8vIFN0aWNreSBTaWRlIEJveFxyXG4gICAgICAgIGNlcnR5LnNpZGVCb3gubWFrZVN0aWNreSgpO1xyXG5cclxuICAgIH0pOyAvLyBlbmQ6IHdpbmRvdyByZXNpemVcclxuXHJcblxyXG5cclxuICAgICQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24gKCkgeyAvLyBzdGFydDogd2luZG93IHNjcm9sbFxyXG5cclxuICAgICAgICAvLyBSZSBJbml0IFZhcnNcclxuICAgICAgICBjZXJ0eS52YXJzLndpbmRvd1Njcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcbiAgICAgICAgLy8gU3RpY2t5IE5hdmlnYXRpb25cclxuICAgICAgICBjZXJ0eS5uYXYubWFrZVN0aWNreSgpO1xyXG5cclxuICAgICAgICAvLyBTdGlja3kgU2lkZSBCb3hcclxuICAgICAgICBjZXJ0eS5zaWRlQm94Lm1ha2VTdGlja3koKTtcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIFRvb2x0aXBcclxuICAgICAgICBpZihjZXJ0eS5uYXYudG9vbHRpcC5lbC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgY2VydHkubmF2LnRvb2x0aXAuZWwucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pOyAvLyBlbmQ6IHdpbmRvdyBzY3JvbGxcclxuXHJcblxyXG5cclxuICAgICQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uICgpIHsgLy8gc3RhcnQ6IHdpbmRvdyBsb2FkXHJcblxyXG4gICAgfSk7IC8vIGVuZDogd2luZG93IGxvYWRcclxuXHJcbn0pKGpRdWVyeSk7IiwiLy8gVGhlbWUgVmFyaWFibGVzXHJcbnZhciBhY2UgPSB7XHJcbiAgICBodG1sOiAnJyxcclxuICAgIGJvZHk6ICcnLFxyXG4gICAgbW9iaWxlOiAnJyxcclxuXHJcbiAgICBzaWRlYmFyOiB7XHJcbiAgICAgICAgb2JqOiAnJyxcclxuICAgICAgICBidG46ICcnXHJcbiAgICB9LFxyXG5cclxuICAgIG5hdjoge1xyXG4gICAgICAgIG9iajogJycsXHJcbiAgICAgICAgdG9vbHRpcDogalF1ZXJ5KCc8ZGl2IGNsYXNzPVwiY3J0LXRvb2x0aXBcIj48L2Rpdj4nKVxyXG4gICAgfSxcclxuXHJcbiAgICBvdmVybGF5OiB7XHJcbiAgICAgICAgb2JqOiBqUXVlcnkoJzxkaXYgaWQ9XCJjcnQtb3ZlcmxheVwiPjwvZGl2PicpXHJcbiAgICB9LFxyXG5cclxuICAgIHByb2dyZXNzOiB7XHJcbiAgICAgICAgbGluZXM6ICcnLFxyXG4gICAgICAgIGNoYXJ0czogJycsXHJcbiAgICAgICAgYnVsbGV0czogJydcclxuICAgIH1cclxufTtcclxuXHJcbihmdW5jdGlvbiAoJCkge1xyXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XHJcblx0XHJcblx0JChmdW5jdGlvbiAoKSB7IC8vIHN0YXJ0OiBkb2N1bWVudCByZWFkeVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2VydHkgSW5pdCBNYWluIFZhcnNcclxuXHRcdCAqL1xyXG5cdFx0YWNlLmh0bWwgPSAkKCdodG1sJyk7XHJcblx0XHRhY2UuYm9keSA9ICQoJ2JvZHknKTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIENlcnR5IERldGVjdCBEZXZpY2UgVHlwZVxyXG5cdFx0ICovXHJcblx0XHRhY2VfZGV0ZWN0X2RldmljZV90eXBlKCk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDZXJ0eSBNb2JpbGUgTmF2aWdhdGlvblxyXG5cdFx0ICovXHJcblx0XHQkKCcjY3J0LW1haW4tbmF2LXNtIC5tZW51LWl0ZW0taGFzLWNoaWxkcmVuID4gYScpLm9uKCdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoICQodGhpcykuaGFzQ2xhc3MoJ2hvdmVyJykgKXtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdob3ZlcicpO1xyXG5cdFx0XHRcdCQodGhpcykubmV4dCgpLnNsaWRlRG93big1MDApO1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDZXJ0eSBTaWRlYmFyXHJcblx0XHQgKi9cclxuXHRcdGFjZS5zaWRlYmFyLm9iaiA9ICQoJyNjcnQtc2lkZWJhcicpO1xyXG5cdFx0YWNlLnNpZGViYXIuYnRuID0gJCgnI2NydC1zaWRlYmFyLWJ0bicpO1xyXG5cclxuXHRcdC8vIE9wZW4gU2lkZWJhclxyXG5cdFx0YWNlLnNpZGViYXIuYnRuLm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRhY2Vfb3Blbl9zaWRlYmFyKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvLyBDbG9zZSBTaWRlYmFyIFRocm91Z2ggT3ZlcmxheVxyXG5cdFx0JChkb2N1bWVudCkub24oJ3RvdWNoc3RhcnQgY2xpY2snLCAnLmNydC1zaWRlYmFyLW9wZW5lZCAjY3J0LW92ZXJsYXknLCBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHR2YXIgY29udGFpbmVyID0gYWNlLnNpZGViYXIub2JqO1xyXG5cdFx0XHQvLyBpZiB0aGUgdGFyZ2V0IG9mIHRoZSBjbGljayBpc24ndCB0aGUgY29udGFpbmVyLi4uIG5vciBhIGRlc2NlbmRhbnQgb2YgdGhlIGNvbnRhaW5lclxyXG5cdFx0XHRpZiAoIWNvbnRhaW5lci5pcyhlLnRhcmdldCkgJiYgY29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0YWNlX2Nsb3NlX3NpZGViYXIoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gQ2xvc2UgU2lkZWJhciBVc2luZyBCdXR0b25cclxuXHRcdCQoJyNjcnQtc2lkZWJhci1jbG9zZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0YWNlX2Nsb3NlX3NpZGViYXIoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIFNpZGViYXIgQ3VzdG9tIFNjcm9sbFxyXG5cdFx0JChcIiNjcnQtc2lkZWJhci1pbm5lclwiKS5tQ3VzdG9tU2Nyb2xsYmFyKHtcclxuXHRcdFx0YXhpczogXCJ5XCIsXHJcblx0XHRcdHRoZW1lOiBcIm1pbmltYWwtZGFya1wiLFxyXG5cdFx0XHRhdXRvSGlkZVNjcm9sbGJhcjogdHJ1ZSxcclxuXHRcdFx0c2Nyb2xsQnV0dG9uczogeyBlbmFibGU6IHRydWUgfVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDZXJ0eSBDaXJjbGUgJiBMaW5lIENoYXJ0c1xyXG5cdFx0ICovXHJcblx0XHRpZighY2VydHkucHJvZ3Jlc3MuYW5pbWF0aW9uIHx8IGFjZS5tb2JpbGUpIHtcclxuXHRcdFx0Ly8gQ2lyY2xlIENoYXJ0XHJcblx0XHRcdGFjZS5wcm9ncmVzcy5jaGFydHMgPSAkKCcucHJvZ3Jlc3MtY2hhcnQgLnByb2dyZXNzLWJhcicpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFjZS5wcm9ncmVzcy5jaGFydHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgY2hhcnQgPSAkKGFjZS5wcm9ncmVzcy5jaGFydHNbaV0pO1xyXG5cclxuXHRcdFx0XHRhY2VfcHJvZ3Jlc3NfY2hhcnQoY2hhcnRbMF0sIGNoYXJ0LmRhdGEoJ3RleHQnKSwgY2hhcnQuZGF0YSgndmFsdWUnKSwgMSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIExpbmUgQ2hhcnRcclxuXHRcdFx0YWNlLnByb2dyZXNzLmxpbmVzID0gJCgnLnByb2dyZXNzLWxpbmUgLnByb2dyZXNzLWJhcicpO1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFjZS5wcm9ncmVzcy5saW5lcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRcdHZhciBsaW5lID0gJChhY2UucHJvZ3Jlc3MubGluZXNbaV0pO1xyXG5cclxuXHRcdFx0XHRhY2VfcHJvZ3Jlc3NfbGluZShsaW5lWzBdLCBsaW5lLmRhdGEoJ3RleHQnKSwgbGluZS5kYXRhKCd2YWx1ZScpLCAxKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2VydHkgQW5pbWF0ZSBFbGVtZW50c1xyXG5cdFx0ICovXHJcblx0XHRpZihjZXJ0eS5wcm9ncmVzcy5hbmltYXRpb24gJiYgIWFjZS5tb2JpbGUpIHtcclxuXHRcdFx0YWNlX2FwcGVhcl9lbGVtcygkKCcuY3J0LWFuaW1hdGUnKSwgMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBDb2RlIEhpZ2hsaWdodFxyXG5cdFx0ICovXHJcblx0XHQkKCdwcmUnKS5lYWNoKGZ1bmN0aW9uIChpLCBibG9jaykge1xyXG5cdFx0XHRobGpzLmhpZ2hsaWdodEJsb2NrKGJsb2NrKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2VydHkgQWxlcnRzXHJcblx0XHQgKi9cclxuXHRcdCQoJy5hbGVydCAuY2xvc2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdHZhciBhbGVydCA9ICQodGhpcykucGFyZW50KCk7XHJcblxyXG5cdFx0XHRhbGVydC5mYWRlT3V0KDUwMCwgZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdGFsZXJ0LnJlbW92ZSgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2VydHkgU2xpZGVyXHJcblx0XHQgKi9cclxuXHRcdCQoJy5zbGlkZXInKS5zbGljayh7XHJcblx0XHRcdGRvdHM6IHRydWVcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ2VydHkgR29vZ2xlIE1hcCBJbml0aWFsaXNhdGlvblxyXG5cdFx0ICovXHJcblx0XHRpZiAoJCgnI21hcCcpLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0aW5pdGlhbGlzZUdvb2dsZU1hcCggY2VydHlfdmFyc19mcm9tX1dQLm1hcFN0eWxlcyApO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogIFRhYnNcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHRhYkFjdGl2ZSA9ICQoJy50YWJzLW1lbnU+bGkuYWN0aXZlJyk7XHJcblx0XHRpZiggdGFiQWN0aXZlLmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB0YWJBY3RpdmUubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHR2YXIgdGFiX2lkID0gJCh0YWJBY3RpdmVbaV0pLmNoaWxkcmVuKCkuYXR0cignaHJlZicpO1xyXG5cclxuXHRcdFx0XHQkKHRhYl9pZCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLnNob3coKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdCQoJy50YWJzLW1lbnUgYScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgdGFiID0gJCh0aGlzKTtcclxuXHRcdFx0dmFyIHRhYl9pZCA9IHRhYi5hdHRyKCdocmVmJyk7XHJcblx0XHRcdHZhciB0YWJfd3JhcCA9IHRhYi5jbG9zZXN0KCcudGFicycpO1xyXG5cdFx0XHR2YXIgdGFiX2NvbnRlbnQgPSB0YWJfd3JhcC5maW5kKCcudGFiLWNvbnRlbnQnKTtcclxuXHJcblx0XHRcdHRhYi5wYXJlbnQoKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHRcdFx0dGFiLnBhcmVudCgpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG5cdFx0XHR0YWJfY29udGVudC5ub3QodGFiX2lkKS5yZW1vdmVDbGFzcygnYWN0aXZlJykuaGlkZSgpO1xyXG5cdFx0XHQkKHRhYl9pZCkuYWRkQ2xhc3MoJ2FjdGl2ZScpLmZhZGVJbig1MDApO1xyXG5cclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBUb2dnbGVCb3hcclxuXHRcdCAqL1xyXG5cdFx0dmFyIHRvZ2dsZWJveEFjdGl2ZSA9ICQoJy50b2dnbGVib3g+bGkuYWN0aXZlJyk7XHJcblx0XHRpZiggdG9nZ2xlYm94QWN0aXZlLmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0dG9nZ2xlYm94QWN0aXZlLmZpbmQoJy50b2dnbGVib3gtY29udGVudCcpLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCcudG9nZ2xlYm94LWhlYWRlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciB0b2dnbGVfaGVhZCA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHR0b2dnbGVfaGVhZC5uZXh0KCcudG9nZ2xlYm94LWNvbnRlbnQnKS5zbGlkZVRvZ2dsZSgzMDApO1xyXG5cdFx0XHR0b2dnbGVfaGVhZC5wYXJlbnQoKS50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBBY2NvcmRlb25cclxuXHRcdCAqL1xyXG5cdFx0dmFyIGFjY29yZGVvbkFjdGl2ZSA9ICQoJy5hY2NvcmRpb24+bGkuYWN0aXZlJyk7XHJcblx0XHRpZiggYWNjb3JkZW9uQWN0aXZlLmxlbmd0aCA+IDAgKXtcclxuXHRcdFx0YWNjb3JkZW9uQWN0aXZlLmZpbmQoJy5hY2NvcmRpb24tY29udGVudCcpLnNob3coKTtcclxuXHRcdH1cclxuXHJcblx0XHQkKCcuYWNjb3JkaW9uLWhlYWRlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBhY2NfaGVhZCA9ICQodGhpcyk7XHJcblx0XHRcdHZhciBhY2Nfc2VjdGlvbiA9IGFjY19oZWFkLnBhcmVudCgpO1xyXG5cdFx0XHR2YXIgYWNjX2NvbnRlbnQgPSBhY2NfaGVhZC5uZXh0KCk7XHJcblx0XHRcdHZhciBhY2NfYWxsX2NvbnRlbnRzID0gYWNjX2hlYWQuY2xvc2VzdCgnLmFjY29yZGlvbicpLmZpbmQoJy5hY2NvcmRpb24tY29udGVudCcpO1xyXG5cclxuXHRcdFx0aWYoYWNjX3NlY3Rpb24uaGFzQ2xhc3MoJ2FjdGl2ZScpKXtcclxuXHRcdFx0XHRhY2Nfc2VjdGlvbi5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0YWNjX2NvbnRlbnQuc2xpZGVVcCgpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRhY2Nfc2VjdGlvbi5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRhY2Nfc2VjdGlvbi5hZGRDbGFzcygnYWN0aXZlJyk7XHJcblx0XHRcdFx0YWNjX2FsbF9jb250ZW50cy5zbGlkZVVwKDMwMCk7XHJcblx0XHRcdFx0YWNjX2NvbnRlbnQuc2xpZGVEb3duKDMwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogQ29tbWVudHMgT3Blbi9DbG9zZVxyXG5cdFx0ICovXHJcblx0XHQkKCcuY29tbWVudC1yZXBseXMtbGluaycpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmNvbW1lbnQnKS50b2dnbGVDbGFzcygnc2hvdy1yZXBsaWVzJyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFBvcnRmb2xpbyBQb3B1cFxyXG5cdFx0ICovXHJcblx0XHR2YXIgcGZfcG9wdXAgPSB7fTtcclxuXHRcdHBmX3BvcHVwLndyYXBwZXIgPSBudWxsO1xyXG5cdFx0cGZfcG9wdXAuY29udGVudCA9IG51bGw7XHJcblx0XHRwZl9wb3B1cC5zbGlkZXIgPSBudWxsO1xyXG5cclxuXHRcdHBmX3BvcHVwLm9wZW4gPSBmdW5jdGlvbiAoIGVsICl7XHJcblx0XHRcdC8vIEFwcGVuZCBQb3J0Zm9saW8gUG9wdXBcclxuXHRcdFx0dGhpcy53cmFwcGVyID0gJCgnPGRpdiBpZD1cInBmLXBvcHVwLXdyYXBcIiBjbGFzcz1cInBmLXBvcHVwLXdyYXBcIj4nK1xyXG5cdFx0XHQnPGRpdiBjbGFzcz1cInBmLXBvcHVwLWlubmVyXCI+JytcclxuXHRcdFx0JzxkaXYgY2xhc3M9XCJwZi1wb3B1cC1taWRkbGVcIj4nK1xyXG5cdFx0XHQnPGRpdiBjbGFzcz1cInBmLXBvcHVwLWNvbnRhaW5lclwiPicrXHJcblx0XHRcdCc8YnV0dG9uIGlkPVwicGYtcG9wdXAtY2xvc2VcIj48aSBjbGFzcz1cInJzaWNvbiByc2ljb24tY2xvc2VcIj48L2k+PC9idXR0b24+JytcclxuXHRcdFx0JzxkaXYgaWQ9XCJwZi1wb3B1cC1jb250ZW50XCIgY2xhc3M9XCJwZi1wb3B1cC1jb250ZW50XCI+PC9kaXY+JytcclxuXHRcdFx0JzwvZGl2PicrXHJcblx0XHRcdCc8L2Rpdj4nK1xyXG5cdFx0XHQnPC9kaXY+Jyk7XHJcblxyXG5cdFx0XHRhY2UuYm9keS5hcHBlbmQodGhpcy53cmFwcGVyKTtcclxuXHJcblx0XHRcdC8vIEFkZCBQb3J0Zm9saW8gUG9wdXAgSXRlbXNcclxuXHRcdFx0dGhpcy5jb250ZW50ID0gJCgnI3BmLXBvcHVwLWNvbnRlbnQnKTtcclxuXHRcdFx0dGhpcy5jb250ZW50LmFwcGVuZCggZWwuY2xvbmUoKSApO1xyXG5cclxuXHRcdFx0Ly8gTWFrZSBQb3J0Zm9saW8gUG9wdXAgVmlzaWJsZVxyXG5cdFx0XHRwZl9wb3B1cC53cmFwcGVyLmFkZENsYXNzKCdvcGVuZWQnKTtcclxuXHRcdFx0YWNlX2xvY2tfc2Nyb2xsKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHBmX3BvcHVwLmNsb3NlID0gZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy53cmFwcGVyLnJlbW92ZUNsYXNzKCdvcGVuZWQnKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHBmX3BvcHVwLndyYXBwZXIucmVtb3ZlKCk7XHJcblx0XHRcdFx0YWNlX3VubG9ja19zY3JvbGwoKTtcclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gT3BlbiBQb3J0Zm9saW8gUG9wdXBcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsICcucGYtYnRuLXZpZXcnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdHBmX3BvcHVwLm9wZW4oICQoaWQpICk7XHJcblxyXG5cdFx0XHRhY2UuaHRtbC5hZGRDbGFzcygnY3J0LXBvcnRmb2xpby1vcGVuZWQnKTtcclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIENsb3NlIFBvcnRmb2xpbyBQb3B1cFxyXG5cdFx0JChkb2N1bWVudCkub24oJ3RvdWNoc3RhcnQgY2xpY2snLCAnLmNydC1wb3J0Zm9saW8tb3BlbmVkICNwZi1wb3B1cC13cmFwJywgZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0dmFyIGNvbnRhaW5lciA9ICQoJyNwZi1wb3B1cC1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHQvLyBpZiB0aGUgdGFyZ2V0IG9mIHRoZSBjbGljayBpc24ndCB0aGUgY29udGFpbmVyLi4uIG5vciBhIGRlc2NlbmRhbnQgb2YgdGhlIGNvbnRhaW5lclxyXG5cdFx0XHRpZiAoIWNvbnRhaW5lci5pcyhlLnRhcmdldCkgJiYgY29udGFpbmVyLmhhcyhlLnRhcmdldCkubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0cGZfcG9wdXAuY2xvc2UoKTtcclxuXHRcdFx0XHRhY2UuaHRtbC5yZW1vdmVDbGFzcygnY3J0LXBvcnRmb2xpby1vcGVuZWQnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0LyoqXHJcblx0XHQgKiBTaG93IENvZGUgPHByZT5cclxuXHRcdCAqL1xyXG5cdFx0JCgnLnRvZ2dsZS1saW5rJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblxyXG5cdFx0XHRpZigkKHRoaXMpLmhhc0NsYXNzKCdvcGVuZWQnKSl7XHJcblx0XHRcdFx0JChpZCkuc2xpZGVVcCg1MDApO1xyXG5cdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ29wZW5lZCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQoaWQpLnNsaWRlRG93big1MDApO1xyXG5cdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ29wZW5lZCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9KTtcclxuXHJcblx0XHQvKipcclxuXHRcdCAqIFNoYXJlIEJ1dHRvblxyXG5cdFx0ICovXHJcblx0XHQkKCcuc2hhcmUtYnRuJykub24oIFwibW91c2VlbnRlclwiLCBmdW5jdGlvbigpe1xyXG5cdFx0XHQkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdob3ZlcmVkJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcuc2hhcmUtYm94Jykub24oIFwibW91c2VsZWF2ZVwiLCBmdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgc2hhcmVfYm94ID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmKHNoYXJlX2JveC5oYXNDbGFzcygnaG92ZXJlZCcpKXtcclxuXHRcdFx0XHRzaGFyZV9ib3guYWRkQ2xhc3MoJ2Nsb3NpbmcnKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c2hhcmVfYm94LnJlbW92ZUNsYXNzKCdob3ZlcmVkJyk7XHJcblx0XHRcdFx0XHRzaGFyZV9ib3gucmVtb3ZlQ2xhc3MoJ2Nsb3NpbmcnKTtcclxuXHRcdFx0XHR9LDMwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9KTsgLy8gZW5kOiBkb2N1bWVudCByZWFkeVxyXG59KShqUXVlcnkpOyJdfQ==
