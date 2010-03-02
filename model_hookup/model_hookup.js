steal.plugins('jquery/controller')
     .then(function(){
         $.Controller.extend("Phui.ModelHookup",{
            listensTo : ['changed']
        },
        {
            init : function(){
                this.model = this.options.model;
            },
            change : function(el, ev){
                var name = $(ev.target).attr('name');
                var value = $(ev.target).val();
                if(name && value) this.model.attr(name, value);
            }
        })
        
     })