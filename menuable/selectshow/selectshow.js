steal.plugins('phui/menuable', 'jquery/event/hover').then(function(){
	Phui.Menuable.extend("Phui.Menuable.SelectShow",
	{
		">{child_selector} default.activate" : function(el, ev){
			if(el.hasClass(this.options.active))
				return;
			if(this.activating)
				return;
			this.activating = true;
			var options = this.options, oldActive = this.find("."+options.active+":first"), self= this;
			var doThis = function(){
				self.ifThereIs({
					a: oldActive,
					trigger: "deactivate",
					andWaitFor: "deactivate:after",
					beforeTriggering: "activate:before",
					on: el
				})
			}
			if(el.hasClass(this.options.select))
				doThis();
			else
				el.one('select:after',doThis).trigger("select");
		},
		">{child_selector} default.deactivate" : function(el, ev ){
			el.trigger("deactivate:before")
		},
		// select shows the submenus
		">{child_selector} default.select" : function(el, ev ){
			if(this.selecting)
				return;
			this.selecting = true;
			var self = this;
			this.ifThereIs({
				a: this.find("."+this.options.select+":first"),
				trigger: "deselect",
				andWaitFor: "deselect:after",
				beforeTriggering: function(){
					if (el.hasClass(self.options.select)) 
						return el.trigger("select:before")
					self.ifThereIs({
						a: self.sub(el),
						trigger: "show",
						withData: el,
						andWaitFor: "show:after",
						ifNothingResponds : function(el){ el.show() },
						beforeTriggering: "select:before",
						on: el
					})
				}
			})
		},
		// deselect hides the submenus
		">{child_selector} default.deselect": function(el, ev){
			this.ifThereIs({
				a: this.sub(el),
				trigger: "hide",
				andWaitFor: "hide:after",
				ifNothingResponds : function(el){ el.hide() },
				beforeTriggering: "deselect:after",
				on: el
			})
		},
		">default.hide" : function(el, ev){
			if(this.selecting)
				return;
			this._super(el, ev);
		}
	});
	
})
