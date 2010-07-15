steal.plugins('jquery/controller','jquery/event/default','jquery/event/livehack', 'jquery/dom/closest').then(function($){
	
	
	/**
	 * A general Menu System.
	 * 1. Listens for 'click' on 'li' elements (configurable)
	 * 2. Triggers "deselect" on that li.
	 * 3. By Default on "deselect" 
	 * 			triggers "hide" on the old submenu.  
	 * 				If hide is prevented -> stops.
	 * 			removes selected styling on old li
	 * 			triggers "select" on that li
	 * 4. By Default on "select"
	 * 			triggers "show" on the new submenu
	 * 			adds selected styling on li
	 * 
	 * The menu also listens to the following by default:
	 * "hide" -> hides the menu
	 * "show" -> shows the menu
	 */
	$.Controller.extend('Phui.Menuable',
	{
		defaults : {
			/**
			 * A list of other types we want to mixin to each menu
			 */
			types : [],
			/**
			 * The active className
			 */
			active : "active",
			/**
			 * The selected className
			 */
			select : "selected",
			child_selector : "li"
		},
		listensTo : ["hide","show", "hide:before", 
			"hide:after", "show:before", "show:after"]
	},
	{
		ifThereIs : function(options){
			var trigger = function(){
				if(typeof options.beforeTriggering == "string"){
					options.on.trigger(options.beforeTriggering)
				}
					
				else if(options.beforeTriggering)
					options.beforeTriggering()
			}
			if(options.a.length ){ //and the old can respond to triggerDefault?
				options.a.bind(options.andWaitFor, function(ev){
					if(this == ev.target){
						$(this).unbind(options.andWaitFor, arguments.callee)
						trigger()
					}
					
				})
				if(! options.a.triggerHandled(options.trigger, options.withData) ){
					options.ifNothingResponds && options.ifNothingResponds(options.a)
					trigger()
				}
			}else{
				trigger()
			}
		},
		/**
		 * Returns the sub-menu from this item
		 */
		sub : function(el){
			return el.children().eq(1);
		},
		/**
		 * Returns where a sub-menu element should be positioned from.
		 */
		calculateSubmenuPosition : function(el, ev){
			return el;
		},
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
					beforeTriggering: function(){
						self.ifThereIs({
							a: self.sub(el),
							trigger: "show",
							withData: self.calculateSubmenuPosition(el, ev),
							andWaitFor: "show:after",
							ifNothingResponds : function(el){ 
								el.show() 
							},
							beforeTriggering: "activate:before",
							on: el
						})
					}
				})
			}
			if(el.hasClass(this.options.select))
				doThis();
			else
				el.one('select:after',doThis).trigger("select");
			
		},
		">{child_selector} default.activate:before" : function(el, ev){
			el.trigger("activate:after")
		},
		">{child_selector} default.activate:after" : function(el, ev){
			el.addClass(this.options.active)
			this.activating = false;
			this.element.trigger("change")
		},
		">{child_selector} default.deactivate" : function(el, ev ){
			this.ifThereIs({
				a: this.sub(el),
				trigger: "hide",
				andWaitFor: "hide:after",
				// TODO trigger hide:before if nothing responds to that, do el.hide(), then remove the empty hide in navigation
				ifNothingResponds : function(el){ 
					el.hide() 
				},
				beforeTriggering: "deactivate:before",
				on: el
			})
		},
		">{child_selector} default.deactivate:before" : function(el, ev){
			el.trigger("deactivate:after")
		},
		">{child_selector} default.deactivate:after" : function(el, ev){
			el.removeClass(this.options.active)
		},
		//deselects old if there is one, and calls selected
		">{child_selector} default.select" : function(el, ev){
			if(this.selecting)
				return;
			this.selecting = true;
			this.ifThereIs({
				a: this.find("."+this.options.select+":first"),
				trigger: "deselect",
				andWaitFor: "deselect:after",
				beforeTriggering: "select:before",
				on: el
			})
		},
		">{child_selector} default.select:before" : function(el, ev ){
			el.trigger("select:after")
		},
		">{child_selector} default.select:after" : function(el, ev){
			el.addClass(this.options.select)
			this.selecting = false;
		},
		">{child_selector} default.deselect" : function(el, ev ){
			el.trigger("deselect:before")
		},
		">{child_selector} default.deselect:before" : function(el, ev){
			el.trigger("deselect:after")
		},
		//do stuff on deselect
		">{child_selector} default.deselect:after" : function(el, ev){
			el.removeClass(this.options.select)
		},
		/** 
		 * Checks if we are the target for the hide, and hides any active submenus.
		 * This could check that those submenu hides are ok, but doesnt .... yet.
		 */
		">default.hide" : function(el, ev){
			var self = this;
			this.ifThereIs({
				a: this.element.find("."+this.options.active),
				trigger: "deactivate",
				andWaitFor: "deactivate:after",
				beforeTriggering: function(){
					self.ifThereIs({
						a: self.element.find("."+self.options.select),
						trigger: "deselect",
						andWaitFor: "deselect:after",
						// if something listened to hide, assume it will call hide:before
						beforeTriggering: "hide:before",
						on: el
					})
				}
			})
		},
		">default.hide:before": function(el, ev){
			el.triggerDefaults("hide:after")
		},
		">default.show": function(el, ev){
			el.trigger("show:before")
		},
		">default.show:before": function(el, ev){
			el.triggerDefaults("show:after")
		}
   });
	
})
