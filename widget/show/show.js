steal.plugins('phui/widget').then(function($){
    
    Phui.Widget.extend("Phui.Widget.Show",{
        defaults : {
            CLASS_NAMES : "value"
        }
    },{
        init : function(el, options){
            this.options = options;
            this.element.addClass(this.Class.OPTIONS.CLASS_NAMES);
        },
        value : function(){
            return this.options.value;
        }         
    })
    
})
