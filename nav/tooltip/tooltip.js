steal(
	'jquery/controller',
	'jquery/view/ejs',
	'mxui/layout/positionable',
	'steal/less'
).then(
	'./tooltip.less',
	function( $ ) {
		
	var	prefixes = ' -webkit- -moz- -o- -ms- -khtml-'.split(' '),
		supportsTransitions = (function() {
			var elem = $("<div />"),
				support = false;
			$.each(prefixes, function( i, prefix ) {
				var prop = prefix + "transition",
					value = "all 1s ease-in-out";
				elem.css( prop, value );
				if ( elem.css( prop ) == value ) {
					support = true;
					return false;
				}
			});
			return support;
		}());


	$.Controller("Mxui.Nav.Tooltip", {
		positions: {
			n : {
				my: "bottom",
				at: "top",
				arrowClass: "down",
				arrowMargin: "margin-left"
			},
			e : {
				my: "left",
				at: "right",
				arrowClass: "left",
				arrowMargin: "margin-top"
			},
			w : {
				my: "right",
				at: "left",
				arrowClass: "right",
				arrowMargin: "margin-top"
			},
			s : {
				my: "top",
				at: "bottom",
				arrowClass: "up",
				arrowMargin: "margin-left"
			}
		},
		defaults: {
			theme: "error",
			showEvent: "mouseenter",
			hideEvent: "mouseleave",
			showEffect: "show",
			hideEffect: "fadeOut",
			showTimeout: 200,
			hideTimeout: 500,
			showTimeoutId: null,
			hideTimeoutId: null,
			position: "n"
		}
	}, {

		init : function() {

			this.tooltip = $( $.View( "./views/tooltip.ejs", this.options ) );

			// save references to each compontent of the tooltip
			$.each( ["outer", "inner", "arrow"], this.proxy( function( i, className ) {
				this.tooltip[ className ] = this.tooltip.find( "." + className );
			}));

			// Append template to the offset parent
			this.element.offsetParent().append( this.tooltip );

			// Spacing for arrows and stuff is calculated off the margin,
			// perhaps should be changed to a setting
			this.space = parseInt( this.tooltip.outer.css("margin-left"), 10 );

			// Position tooltip
			this.determinePosition();
			this.setPosition();

			$.each( ["width", "height"], this.proxy( function( i, dim ) {
				this.tooltip[ dim ]( this.tooltip[ dim ]() );
			}));

			this.tooltip.css({
				display: this.options.showEvent ? "none" : "block",
				visibility: "visible"
			});


			// Set up transitions
			if ( supportsTransitions ) {
				setTimeout( this.proxy( function() {
					$.each(prefixes, this.proxy( function( i, prefix ) {
						this.tooltip.css( prefix + "transition", "top .5s ease-in-out, left .5s ease-in-out" );
					}));
				}), 0);
			}

			if ( this.options.showEvent == "mouseenter" ) {
				this.tooltip
					.bind("mouseenter", this.callback("show"))
					.bind("mouseleave", this.callback("hide"));
			}

		},
		determineCorners: function() {
			var threeSpaces = this.space * 2,
				fiveSpaces = this.space * 4;

			this.corners= {
				ne: {
					arrowCss: {
						left: threeSpaces
					},
					offset : [ -( fiveSpaces ), 0 ]
				},
				en: {
					arrowCss: {
						top : "initial",
						bottom: threeSpaces
					},
					offset : [ 0, ( fiveSpaces ) ]
				},
				es: {
					arrowCss: {
						bottom : "initial",
						top: threeSpaces
					},
					offset : [ 0, -( fiveSpaces ) ]
				},
				se: {
					arrowCss: {
						left: threeSpaces
					},
					offset : [ -( fiveSpaces ), 0 ]
				},
				sw: {
					arrowCss: {
						right: threeSpaces,
						left: "initial"
					},
					offset : [ ( fiveSpaces ), 0 ]
				},
				ws: {
					arrowCss: {
						bottom : "initial",
						top: threeSpaces
					},
					offset : [ 0, -( fiveSpaces ) ]
				},
				wn: {
					arrowCss: {
						top: "initial",
						bottom: threeSpaces
					},
					offset : [ 0, ( fiveSpaces ) ]
				},
				nw: {
					arrowCss: {
						right: threeSpaces,
						left: "initial"
					},
					offset : [ ( fiveSpaces ), 0 ]
				}
			}
		},

		determinePosition: function() {

			var parts = "my at".split(" "),
				positionArrays = {
					my : [],
					at : []
				},
				position = {};

			// ZOMG double each, thats like, O(n^2)
			$.each( parts, this.proxy( function( i, part ) {
				$.each( this.options.position.split(""), function( i, c ) {
					positionArrays[part].push( Mxui.Nav.Tooltip.positions[ c ][part] );
				});

				// Have to do this craziness because the jQuery UI position
				// plugin requires position to be in the format of
				// "horizontal vertical" :/
				position[part] = (/left|right/.test( positionArrays[part][0] ) ?
					positionArrays[part] : 
					positionArrays[part].reverse()
					).join(" ");
			} ));

			this.position = $.extend({},
				Mxui.Nav.Tooltip.positions[ this.options.position.charAt(0) ],
				position
			);

			this.tooltip
				.arrow
				.addClass( this.position.arrowClass )
				.css( "border-width", this.space )

			this.determineCorners();

			if ( positionArrays.my.length == 2 ) {
				this.tooltip.arrow.css( this.corners[ this.options.position ].arrowCss );
				$.extend( this.position, {
					offset : this.corners[ this.options.position ].offset.join(" ")
				});
			} else {
				this.tooltip.arrow.css( this.position.arrowMargin, "-" + this.space + "px");
			}

		},

		setPosition: function() {
			var isHidden = this.tooltip.css("display") == "none";

			if ( isHidden ) {
				this.tooltip.css({
					visibility: "hidden",
					display: "block"
				})

				this.tooltip.mxui_layout_positionable(
					$.extend({
						of : this.element,
						collision : "none"
					}, this.position )
				);

				this.tooltip.css({
					visibility: "visible",
					display: "none"
				})
			} else {
				this.tooltip.mxui_layout_positionable(
					$.extend({
						of : this.element,
						collision : "none",
						using: this.proxy( function( pos ) {
							this.tooltip.stop( true, false )[ supportsTransitions ? "css" : "animate" ]( pos );
						})
					}, this.position )
				);
			}
			this.tooltip.mxui_layout_positionable("move");
		},

		show : function() {
			clearTimeout( this.options.hideTimeoutId );
			this.tooltip.stop( true, true )[ this.options.showEffect ]();
		},

		hide : function() {
			this.options.hideTimeoutId = setTimeout(this.proxy( function() {
				this.tooltip[ this.options.hideEffect ]();
			}), this.options.hidetimeout );
		},

		"{showEvent}" : function() {
			this.show();
		},

		"{hideEvent}" : function() {
			this.hide();
		},

		"destroy" : function() {
			this.tooltip.remove();
			this._super();
		},

		"{window} resize" : (function() {
			var timeout;
			return function() {
				clearTimeout( timeout );
				setTimeout( this.proxy( this.callback("setPosition")), 100 );
			}
		}())
	});

});
