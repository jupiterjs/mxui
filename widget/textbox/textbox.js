steal.plugins('phui/widget').then(function($){
    
    
    Phui.Widget.extend("Phui.Widget.Textbox",
    {
        defaults : {
            class_names : ""
        },
        listensTo: ["select"]
    },
    {
        setup : function(el, options){
            this._super(el, options);
            if(this.options.name){
                this.element.children('input').attr('name', this.options.name);
            }                 
        },
        init : function(el, options){
            this.element.addClass(this.options.class_names);
        },
        keypress : function(el, ev){
            if(this.options.allow && ev.charCode && ! this.options.allow.test(String.fromCharCode(ev.charCode)))
                ev.preventDefault()
        },
        value : function(){
            return this.element.children('input').val();
        },
        select : function(el, ev,focus){
			if(focus)
				this.element.children('input')[0].focus();
        },
        mouseenter : function(el, ev){
            el.css('cursor','pointer');
        },
        mouseleave : function(el, ev){
            el.css('cursor','');            
        }                
    })
    
    
})