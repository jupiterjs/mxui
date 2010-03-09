steal.plugins('phui/widget').then(function($){
    
    
    Phui.Widget.extend("Phui.Widget.Dropdown",
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
                this.element.children('select').attr('name', this.options.name);
            }                 
        },
        init : function(el, options){
            this.element.children('select').html( this.view('//phui/widget/dropdown/options.ejs') );
            this.element.addClass(this.options.class_names);
        },
        value : function(){
            return this.element.children('select').val();
        },
        select : function(el, ev,focus){
			if(focus)
				this.element.children('select').focus();
        },
        mouseenter : function(el, ev){
            el.css('cursor','pointer');
        },
        mouseleave : function(el, ev){
            el.css('cursor','');            
        }                
    })
    
    
})