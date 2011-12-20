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

		setup : function( el, options ) {
			options = $.extend( this.constructor.defaults, options || {} );
			options.$ = {
				tooltip : $( $.View( "./views/tooltip.ejs", options ) )
			}
			$.each( ["outer", "inner", "arrow"], this.proxy( function( i, className ) {
				options.$[ className ] = options.$.tooltip.find( "." + className );
			}));
			this._super( el, options );
		},


		init : function() {


			// save references to each compontent of the tooltip

			// Append template to the offset parent
			this.element.offsetParent().append( this.options.$.tooltip );

			// Spacing for arrows and stuff is calculated off the margin,
			// perhaps should be changed to a setting
			this.space = parseInt( this.options.$.outer.css("margin-left"), 10 );

			// Position tooltip
			this.determinePosition();
			this.setPosition();

			$.each( ["width", "height"], this.proxy( function( i, dim ) {
				this.options.$.tooltip[ dim ]( this.options.$.tooltip[ dim ]() );
			}));

			this.options.$.tooltip.css({
				display: this.options.showEvent ? "none" : "block",
				visibility: "visible"
			});


			// Set up transitions
			if ( supportsTransitions ) {
				setTimeout( this.proxy( function() {
					$.each(prefixes, this.proxy( function( i, prefix ) {
						this.options.$.tooltip.css( prefix + "transition", "top .5s ease-in-out, left .5s ease-in-out" );
					}));
				}), 0);
			}
		},

		"{$.tooltip} mouseenter" : function() {
			if ( this.options.showEvent == "mouseenter" ) {
				this.show();
			}
		},

		"{$.tooltip} mouseleave" : function() {
			if ( this.options.showEvent == "mouseenter" ) {
				this.hide();
			}
		},

		determineCorners: function() {
			var arrowSpacing = this.space * 2,
				offsetSpacing = this.space * 4;

			this.corners= {
				ne: {
					arrowCss: {
						left: arrowSpacing
					},
					offset : [ -( offsetSpacing ), 0 ]
				},
				en: {
					arrowCss: {
						top : "initial",
						bottom: arrowSpacing
					},
					offset : [ 0, ( offsetSpacing ) ]
				},
				es: {
					arrowCss: {
						bottom : "initial",
						top: arrowSpacing
					},
					offset : [ 0, -( offsetSpacing ) ]
				},
				se: {
					arrowCss: {
						left: arrowSpacing
					},
					offset : [ -( offsetSpacing ), 0 ]
				},
				sw: {
					arrowCss: {
						right: arrowSpacing,
						left: "initial"
					},
					offset : [ ( offsetSpacing ), 0 ]
				},
				ws: {
					arrowCss: {
						bottom : "initial",
						top: arrowSpacing
					},
					offset : [ 0, -( offsetSpacing ) ]
				},
				wn: {
					arrowCss: {
						top: "initial",
						bottom: arrowSpacing
					},
					offset : [ 0, ( offsetSpacing ) ]
				},
				nw: {
					arrowCss: {
						right: arrowSpacing,
						left: "initial"
					},
					offset : [ ( offsetSpacing ), 0 ]
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

			this.options.$
				.arrow
				.addClass( this.position.arrowClass )
				.css( "border-width", this.space )

			this.determineCorners();

			if ( positionArrays.my.length == 2 ) {
				this.options.$.arrow.css( this.corners[ this.options.position ].arrowCss );
				$.extend( this.position, {
					offset : this.corners[ this.options.position ].offset.join(" ")
				});
			} else {
				this.options.$.arrow.css( this.position.arrowMargin, "-" + this.space + "px");
			}

		},

		setPosition: function() {
			var isHidden = this.options.$.tooltip.css("display") == "none";

			if ( isHidden ) {
				this.options.$.tooltip.css({
					visibility: "hidden",
					display: "block"
				})

				this.options.$.tooltip.mxui_layout_positionable(
					$.extend({
						of : this.element,
						collision : "none"
					}, this.position )
				);

				this.options.$.tooltip.css({
					visibility: "visible",
					display: "none"
				})
			} else {
				this.options.$.tooltip.mxui_layout_positionable(
					$.extend({
						of : this.element,
						collision : "none",
						using: this.proxy( function( pos ) {
							this.options.$.tooltip.stop( true, false )[ supportsTransitions ? "css" : "animate" ]( pos );
						})
					}, this.position )
				);
			}
			this.options.$.tooltip.mxui_layout_positionable("move");
		},

		show : function() {
			clearTimeout( this.options.hideTimeoutId );
			this.options.$.tooltip.stop( true, true )[ this.options.showEffect ]();
		},

		hide : function() {
			this.options.hideTimeoutId = setTimeout(this.proxy( function() {
				this.options.$.tooltip[ this.options.hideEffect ]();
			}), this.options.hidetimeout );
		},

		"{showEvent}" : function() {
			this.show();
		},

		"{hideEvent}" : function() {
			this.hide();
		},

		"destroy" : function() {
			this.options.$.tooltip.remove();
			delete this.options.$;
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
