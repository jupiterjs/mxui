steal.plugins('jquery/controller')
     .then(function(){
         $.Controller.extend("Phui.GroupEditable",{
            listensTo : ['selected']
        },
        {
            selected : function(el, ev){
                var group = $(ev.target).data('group');
                if(group != this.currentGroup){
                    this.currentGroup = group;            
                    this.deselectAllEditables();
                    this.selectGroup(group);
                }
            },
            selectGroup : function(group){
                this.find('.'+group).each(function(i,el){
                    $(el).trigger('focus');
                });
            },
            deselectAllEditables : function(group){
                this.find('.phui_widget_editable').each(function(i,el){
                    $(el).trigger('blur');
                });            
            }
        })
        
     })