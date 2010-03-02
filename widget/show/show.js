steal.plugins('phui/widget').then(function($){
    
    Phui.Widget.extend("Phui.Widget.Show",{
        defaults : {
            CLASS_NAMES : "entry",
            VALUE_CLASS_NAMES : "value",
            LABEL_CLASS_NAMES : "label",    
            DESCRIPTION_CLASS_NAMES : "description"
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
