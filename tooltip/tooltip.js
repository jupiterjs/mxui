steal.plugins('jquery/controller',
			  'jquery/view/ejs',
			  'phui/positionable')
     .resources()
     .models()
     .controllers()
     .views()
	 .then( function($){
	 	
		$.Controller.extend("Phui.Tooltip",
		{
			defaults: {
				html: "<h1>Hello World</h1>",
				width: 120,
				height: 60,
				backgroundColor: "#AFEEEE",
				border: "1px solid #555555",
				opacity: 0.5
			}
		},
		{
			init: function() {
				this.tooltipEl = $("<div class='tooltip'></div>");
				this.tooltipEl.appendTo( $(document.body) );
				this.tooltipEl.css({border: this.options.border,
									backgroundColor: this.options.backgroundColor,
									width: this.options.width,
									height: this.options.height,
									opacity: this.options.opacity});
				this.tooltipEl.html(this.options.html);
				this.tooltipEl.phui_positionable( {
					my: 'left top',
					at: 'left bottom',
					offset: '0 2',
					collision: 'none none',
				} );
				this.tooltipEl.hide();
			},
			mouseenter: function(el, ev) {
				this.tooltipEl.trigger("move", this.element);
				this.tooltipEl.fadeIn("fast");
			},
			mouseleave: function(el, ev) {
				this.tooltipEl.fadeOut("fast");
			}
		});
		
	 });
