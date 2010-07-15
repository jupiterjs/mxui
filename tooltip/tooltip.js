steal.plugins('jquery/controller',
			  'jquery/view/ejs',
			  'phui/positionable')
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
						collision: 'none none'
					});
				
			},
			
			defaults: {
				html: "<h1>Hello World</h1>",
				width: "auto",
				height: "auto",
				pading: "5px",
				backgroundColor: "#AFEEEE",
				border: "1px solid #555555",
				opacity: 1,
				renderCallback: null
			}
		},
		{
			mouseenter: function(el, ev) {
				if (this.options.renderCallback) {
					this.options.renderCallback(this.element, this.callback('_openTooltip'));
				}
				else {
					this._openTooltip(this.options.html);
				}
			},
			"open:tooltip": function(el, ev, html) {
				this._openTooltip(html);		
			},
			_openTooltip: function(html){
				this.Class.tooltipEl.html(html).css({
					border: this.options.border,
					backgroundColor: this.options.backgroundColor,
					padding: this.options.padding,
					width: this.options.width,
					height: this.options.height,
					opacity: this.options.opacity
				}).trigger("move", this.element).fadeIn("fast");
			},
			mouseleave: function(el, ev) {
				this.Class.tooltipEl.fadeOut("fast");
			}
		});
		
	 });
