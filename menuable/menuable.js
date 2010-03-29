steal.plugins('jquery/controller','jquery/event/default','jquery/event/livehack').then(function($){
	
	
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
		listensTo : ["default.hide","default.show"]
	},
	{
		ifThereIs : function(options){
			if(options.a.length && (
				options.triggerDefault ? 
					//there is something listening ...
					$.event.find(options.a[0], [options.triggerDefault, "default."+options.triggerDefault]).length > 0 : 
					true
				) ){ //and the old can respond to triggerDefault?
				options.a.one(options.andWaitFor, function(){
					options.on[options.beforeTriggering ? "trigger" : "triggerDefault"](options.beforeTriggering || options.beforeTriggeringDefault)
				})[options.trigger ? "trigger" : "triggerDefault"](options.trigger || options.triggerDefault, options.withData)
			}else{
				options.on[options.beforeTriggering ? "trigger" : "triggerDefault"](options.beforeTriggering || options.beforeTriggeringDefault)
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
		"{child_selector} default.activate" : function(el, ev){
			if(el.hasClass(this.options.active))
				return;
			if(this.activating)
				return;
			this.activating = true;
			var options = this.options, oldActive = this.find("."+options.active+":first"), self= this; ;
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
		"{child_selector} default.activate:before" : function(newActive, ev){
			this.ifThereIs({
				a: this.sub(newActive),
				triggerDefault: "show",
				withData: newActive,
				andWaitFor: "show:after",
				beforeTriggering: "activate:after",
				on: newActive
			})
		},
		"{child_selector} default.activate:after" : function(el){
			el.addClass(this.options.active)
			this.activating = false;
			this.element.trigger("change")
		},
		//deselects old if there is one, and calls selected
		"{child_selector} default.select" : function(el, ev){
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
		"{child_selector} default.select:before" : function(el, ev ){
			el.trigger("select:after")
		},
		"{child_selector} default.select:after" : function(el){
			el.addClass(this.options.select)
			this.selecting = false;
		},
		"{child_selector} default.deselect" : function(el, ev ){ //preventDefault pauses, 
			el.trigger("deselect:before")
		},
		"{child_selector} default.deselect:before" : function(el){
			el.trigger("deselect:after")
		},
		//do stuff on deselect
		"{child_selector} default.deselect:after" : function(el){
			el.removeClass(this.options.select)
		},
		"{child_selector} default.deactivate" : function(el, ev ){ 
			el.trigger("deactivate:before")
		},
		"{child_selector} default.deactivate:before" : function(deactiveMenu, ev){
			this.ifThereIs({
				a: this.sub(deactiveMenu),
				triggerDefault: "hide",
				andWaitFor: "hide:after",
				beforeTriggering: "deactivate:after",
				on: deactiveMenu
			})
		},
		"{child_selector} default.deactivate:after" : function(el){
			el.removeClass(this.options.active)
		},
		/**
		 * Checks if we are the target for the hide, and hides any active submenus.
		 * This could check that those submenu hides are ok, but doesnt .... yet.
		 */
		"default.hide" : function(el, ev){
			 if(ev.target == this.element[0]){
				//find and remove active
				console.log("hiding ",this.element.find("."+this.options.active))
				this.ifThereIs({
					a: this.element.find("."+this.options.active),
					trigger: "deactivate",
					andWaitFor: "deactivate:after",
					beforeTriggeringDefault: "hide:before",
					on: el
				})
			 }
			
		},
		"default.hide:before" : function(el){
			if (ev.target == this.element[0]) {
				el.triggerDefault("hide:after")
			}
		}
   });
	
})
