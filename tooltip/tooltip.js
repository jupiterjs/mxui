steal.plugins('jquery/controller',
			  'jquery/view/ejs',
			  'phui/positionable',
			  'jquery/event/hover')
	 .then( function($){
	 	
		$.Controller.extend("Phui.Tooltip",
		{
			init : function(){
				this._super()
				//make tooltip element for everyone
				this.tooltipEl = $("<div class='tooltip'></div>")
					.css("zIndex",9998)
					.hide()
					.appendTo( $(document.body) )
					.phui_positionable( {
						my: 'left top',
						at: 'left bottom',
						offset: '10 10',
						collision: 'flip flip'
					});
				
				var self = this;
				this.tooltipEl.bind( "mouseenter", function(ev) {
					self.mouseOverTooltip = true;			
				} );
				
				this.tooltipEl.bind( "mouseleave", function(ev) {
					self.mouseOverTooltip = false;
				} );														
			},
			
			defaults: {
				//html: "<h1>Hello World</h1>",
				width: "auto",
				height: "auto",
				padding: "10px",
				backgroundColor: "#FFFFFF",
				border: "2px solid #000000",
				opacity: 1,
				renderCallback: null,
				keep: false
			}
		},
		{
			init: function(el) {
				var el = el, 
					that = this;
				
				this.tooltipActive = false;
					
				$(document.body).click( function(ev){
					if (that.tooltipActive == true) {
						if (ev.target != that.Class.tooltipEl[0] &&
						ev.target != el) {
							that.Class.tooltipEl.fadeOut("fast");
							that.tooltipActive = false;
						}
					}
				});					
			},			
			hoverenter: function(el, ev) {
				if (this.options.renderCallback) {
					this.options.renderCallback(this.element,ev, this.callback('_openTooltip'));
				}
				else if (this.options.html) {
					this._openTooltip(this.options.html, ev);
				}
			},
			"open:tooltip": function(el, ev, html) {
				this._openTooltip(html);		
			},
			_openTooltip: function(html, location){
				this.Class.tooltipEl.html(html).css({
					border: this.options.border,
					backgroundColor: this.options.backgroundColor,
					padding: this.options.padding,
					width: this.options.width,
					height: this.options.height,
					opacity: this.options.opacity
				}).trigger("move", location || this.element).fadeIn("fast");
				
				this.tooltipActive = true;
			},
			hoverleave: function(el, ev) {
				var self = this;
				setTimeout( function(){
					if ( !self.Class.mouseOverTooltip || !self.options.keep ) {
						self.Class.tooltipEl.fadeOut("fast");
						self.tooltipActive = false;
					}
				}, 100 );
			}
		});
		
	 });
