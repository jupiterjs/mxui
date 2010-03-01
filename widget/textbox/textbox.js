steal.plugins('phui/widget').then(function($){
    
    
    Phui.Widget.extend("Phui.Widget.Textbox",
    {
        defaults : {
            INPUT_class_names : "",
            LABEL_class_names : "label",    
            DESCRIPTION_class_names : "description"
        },
        listensTo: ["select"]
    },
    {
        init : function(el, options){
            this.options = options;
        },
        keypress : function(el, ev){
            if(this.options.allow && ev.charCode && ! this.options.allow.test(String.fromCharCode(ev.charCode)))
                ev.preventDefault()
        },
        value : function(){
            return this.element.children('input').val();
        },
        select : function(){
            this.element.children('input')[0].focus()
        }
    })
    
    
})