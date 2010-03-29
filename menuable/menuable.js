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
		listensTo : ["default.deactivate","default.activate"]
	},
	{
		"{child_selector} default.activate" : function(el, ev){
			if(el.hasClass(this.options.active))
				return;
			if(this.activating)
				return;
			this.activating = true;
			var options = this.options, oldActive = this.find("."+options.active+":first"), self= this; ;
			var doThis = function(){
				self.ifThereIsAn({
					old: oldActive,
					trigger: "deactivate:before",
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
		ifThereIsAn : function(options){
			if(options.old.length && (
				options.triggerDefault ? 
					//there is something listening ...
					$.event.find(options.old[0], [options.triggerDefault, "default."+options.triggerDefault]).length > 0 : 
					true
				) ){ //and the old can respond to triggerDefault?
				options.old.one(options.andWaitFor, function(){
					options.on.trigger(options.beforeTriggering)
				})[options.trigger ? "trigger" : "triggerDefault"](options.trigger || options.triggerDefault)
			}else{
				options.on.trigger(options.beforeTriggering)
			}
		},
		//deselects old if there is one, and calls selected
		"{child_selector} default.select" : function(el, ev){
			if(this.selecting)
				return;
			this.selecting = true;
			this.ifThereIsAn({
				old: this.find("."+this.options.select+":first"),
				trigger: "deselect",
				andWaitFor: "deselect:after",
				beforeTriggering: "select:before",
				on: el
			})
		},
		//check if deselect is ok?
		//start loading stuff?
		"{child_selector} default.deselect" : function(el, ev ){ //preventDefault pauses, 
			el.trigger("deselect:after")
		},
		//do stuff on deselect
		"{child_selector} default.deselect:after" : function(el){
			el.removeClass(this.options.select)
		},
		"{child_selector} default.select:before" : function(el, ev ){
			el.trigger("select:after")
		},
		"{child_selector} default.select:after" : function(el){
			el.addClass(this.options.select)
			this.selecting = false;
		},
		"{child_selector} default.deactivate:before" : function(deactiveMenu, ev){
			this.ifThereIsAn({
				old: this.sub(deactiveMenu),
				triggerDefault: "deactivate",
				andWaitFor: "deactivate:after",
				beforeTriggering: "deactivate:after",
				on: deactiveMenu
			})
		},
		"{child_selector} default.deactivate:after" : function(el){
			el.removeClass(this.options.active)
		},
		"{child_selector} default.activate:before" : function(newActive, ev){
			this.ifThereIsAn({
				old: this.sub(newActive),
				triggerDefault: "activate",
				andWaitFor: "activate:after",
				beforeTriggering: "activate:after",
				on: newActive
			})
		},
		"{child_selector} default.activate:after" : function(el){
			el.addClass(this.options.active)
			this.activating = false;
			this.element.trigger("change")
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
		/**
		 * Checks if we are the target for the hide, and hides any active submenus.
		 * This could check that those submenu hides are ok, but doesnt .... yet.
		 */
		"default.deactivate" : function(el, ev){
			 if(ev.target == this.element[0]){
				//find and remove active
				this.ifThereIsAn({
					old: this.element.find("."+this.options.active),
					triggerDefault: "deactivate:before",
					andWaitFor: "deactivate:after",
					beforeTriggering: "deactivate:after",
					on: el
				})
			 }
			
		},
		/**
		 * By default, shows the child element.
		 */
		"default.activate" : function(el, ev){
		   if(ev.target == this.element[0]){
				this.element.show();
				this.element.triggerDefault("activate:after")
		   }
			
		}
   });
	
})
