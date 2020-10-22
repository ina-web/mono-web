
/**
 * Sticky header when scroll.
 */
jQuery(document).ready(function($) {
	var $window = $(window);
	var $document = $(document);

	var stickyHeaders = (function() {
		var $stickies;
		var lastScrollTop = 0;

		var setData = function(stickies, addWrap) {
			var top = 0;
			if (typeof addWrap === "undefined") {
				addWrap = true;
			}
			$stickies = stickies.each(function() {
				var $thisSticky = $(this);
				var p = $thisSticky.parent();
				if (!p.hasClass("followWrap")) {
					if (addWrap) {
						$thisSticky.wrap('<div class="followWrap" />');
					}
				}
			});
		};

		var load = function(stickies) {
			if (
				typeof stickies === "object" &&
				stickies instanceof jQuery &&
				stickies.length > 0
			) {
				setData(stickies);
				$window.scroll(function() {
					_whenScrolling();
				});	
			}
		};

		var _whenScrolling = function() {
			var top = 0;
			var scrollTop = $window.scrollTop();

			$stickies.each(function(i) {
				var $thisSticky = $(this),
					$stickyPosition = $thisSticky.parent().offset().top;
				if (scrollTop === 0) {
					$thisSticky.addClass("no-scroll");
				}
				if ($stickyPosition - top <= scrollTop) {
					if (scrollTop > 0) {
						$thisSticky.removeClass("no-scroll");
					}
					$thisSticky.addClass("header-fixed");
					$thisSticky.css("top", top);
				} else {
					$thisSticky
						.removeClass("header-fixed")
						.removeAttr("style")
						.addClass("no-scroll");
				}
			});
		};

		return {
			load: load
		};
	})();
	stickyHeaders.load($("#masthead.is-sticky"));
	// When Header Panel rendered by customizer
	$document.on("header_view_changed", function() {
		stickyHeaders.load($("#masthead.is-sticky"));
	});

	
	
	/*
	 * Nav Menu & element actions
	 *
	 * Smooth scroll for navigation and other elements
	 */
	var mobile_max_width = 1140; // Media max width for mobile
	var main_navigation = jQuery(".main-navigation .onepress-menu");
	var stite_header = $(".site-header");
    var header = document.getElementById("masthead");
    if ( header ) {
        var noSticky = header.classList.contains("no-sticky");
    }
	
	var setNavTop = function() {
		var offset = header.getBoundingClientRect();
		var top = offset.x + offset.height - 1;
		main_navigation.css({
			top: top
		});
	};

	/**
	 * Get mobile navigation height.
	 *
	 * @return number
	 */
	var getNavHeight = function(fitWindow) {
		if (typeof fitWindow === "undefined") {
			fitWindow = true;
		}
		if (fitWindow) {
			var offset = header.getBoundingClientRect();
			var h = $(window).height() - (offset.x + offset.height) + 1;
			return h;
		} else {
			main_navigation.css("height", "auto");
			var navOffset = main_navigation[0].getBoundingClientRect();
			main_navigation.css("height", 0);
			return navOffset.height;
		}
	};

	/**
	 * Initialise Menu Toggle
	 */
	$document.on("click", "#nav-toggle", function(event) {
		event.preventDefault();
		jQuery("#nav-toggle").toggleClass("nav-is-visible");
		main_navigation.stop();
		// Open menu mobile.
		if (!main_navigation.hasClass("onepress-menu-mobile")) {
			main_navigation.addClass("onepress-menu-mobile");
			var h = getNavHeight(!noSticky);
			if( isNaN( h ) ) { // when IE 11 & Edge return h is NaN.
				h = $(window).height(); 
			}
			main_navigation.animate(
				{
					height: h
				},
				300,
				function() {
					// Animation complete.
					if (noSticky) {
						main_navigation.css({
							"min-height": h,
							height: "auto"
						});
					}
				}
			);
		} else {
			main_navigation.css( { height: main_navigation.height(), 'min-height': 0, overflow: 'hidden' } );
			setTimeout( function(){
				main_navigation.animate(
					{
						height: 0
					},
					300,
					function() {
						main_navigation.removeAttr("style");
						main_navigation.removeClass("onepress-menu-mobile");
					}
				);
			}, 40 );
		}
	});

	

	// Trigger when site load
	setTimeout(function() {
		$(window).trigger("scroll");
	}, 500);

});
