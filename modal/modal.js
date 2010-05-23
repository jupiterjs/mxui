steal.plugins('jquery/controller','phui/positionable').then(function($){
      Phui.Positionable({
        my : 'center center',
        at : 'center center',
        of : window
     }).extend("Phui.Modal",{
         defaults: { zIndex: 9900,
                    content: "//phui/modal/basic.ejs",
					shadow_class_names: "ui-widget-shadow",
                    types : [],
					title: '',
					message: ''
        },
		listensTo : ['show','hide']
        
     },{
	 	setup : function(el){
			//check if we already have a modal ..
			var modal = $.data(el,"modal")
			if(modal) modal.destroy();
			$.data(el,"modal", this)
			this._super.apply(this, arguments)
		},
		init: function(){
	 		//this.element.html(this.options.content, this.options).css("position", "absolute");
	 		this.element.addClass(this.options.class_names);
	 		this.element.mixin.apply(this.element, this.options.types);
	 	},
	 	show: function(){
	 		this.element.html(this.options.content, this.options).css("position", "absolute");
			this.blocker = $("<div class='block'/>")
			  .appendTo(document.body)
			  .addClass(this.options.shadow_class_names)
			  .phui_block({
	 			zIndex: this.options.zIndex - 1
	 		});
	 		this.element.css("zIndex", this.options.zIndex);
	 		this.blocker.trigger("show");
	 		this.element.show();
	 		this._super.apply(this, arguments);
	 	},
	 	hide: function(){
	 		this.blocker.remove();
			this.element.hide();
	 		//this._super.apply(this, arguments);
	 	},
	 	".close click": function(el, ev){
	 		this.element.trigger("hide")
	 	},
		destroy : function(){
			$.removeData(this.element[0],"modal")
			this._super.apply(this, arguments)
		}
	 });
	 
	 Phui.Modal.extend('Phui.Modal.Buttons',{ 	
		defaults : {
			content: "//phui/modal/buttons.ejs",
			buttons : {
				yes : "Yes",
				no :  "No",
				cancel : "Cancel"
			}
		}
	 },
     {
	 	init: function(){
	 		this.yes = this.options.yes;
	 		this.no = this.options.no;
	 		this._super.apply(this, arguments);
	 	},
		"button click" : function(el, ev){
			var buttonName = el[0].className.match(/(?:^|\s)([^\s]+)-button(?:$|\s)/)[1],
				description = this.options.buttons[buttonName],
				res
			if(typeof description == "function")
				res = description.call(this.element, buttonName)
			else if(typeof description.callback == "function")
				res = description.callback.call(this.element, buttonName)
				
			if(this.element.triggerDefault("modal."+buttonName) === false)
				res = false;
			
			if(res !== false)
				this.element.trigger("hide")
		}
	 });	 
	
	
})
