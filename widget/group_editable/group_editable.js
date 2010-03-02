steal.plugins('jquery/controller')
     .then(function(){
         $.Controller.extend("Phui.GroupEditable",{
            listensTo : ['select']
        },
        {
            select : function(el, ev){
                var group = $(ev.target).parents('.phui_widget_editable').data('group');
                
                if(group != this.currentGroup){
                    this.find('.'+this.currentGroup).each(function(i, editableEl){
                        $(editableEl).controller().drawShowView();
                    });
                }
                
                this.find('.'+group).each(function(i, editableEl){
                        $(editableEl).controller().drawEditView(false);
                    });
                
                this.currentGroup = group;
            }
        })
        
     })