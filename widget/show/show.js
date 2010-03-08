steal.plugins('phui/widget').then(function($){
    
    Phui.Widget.extend("Phui.Widget.Show",{
        defaults : {
            class_names : ""
        }
    },{
        init : function(el, options){
            this.element.addClass(this.options.class_names);
        },
        value : function(){
            return this.options.value;
        }         
    })
    
})
