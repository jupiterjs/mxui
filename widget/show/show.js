steal.plugins('mxui/widget').then(function($){
    
    Mxui.Widget.extend("Mxui.Widget.Show",{
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
