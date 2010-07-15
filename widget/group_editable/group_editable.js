steal.plugins('jquery/controller')
     .then(function(){
         $.Controller.extend("Phui.GroupEditable",{
            listensTo : ['selectin','selectout']
        },
        {
            /**
             * 
             * @param {Object} el
             * @param {Object} ev
             * @param {Object} from
             */
			selectin : function(el, ev){
				
				//if we are new group select everyone else
				var group =       $(ev.target).data('group'),
				    blurGroup =   ev.relatedTarget && $(ev.relatedTarget).data('group')
				if(group && ( group != blurGroup) ){
					this.find('.'+group).each(function(i,brother){
	                    if(ev.target != brother){
							var event = jQuery.Event( 'selectin' );
							event.stopPropagation();
							jQuery.event.trigger( event, null, brother );
						}
	                });
				}
				
            },
			/**
			 * Prevents things in the current group from being deselected
			 */
			selectout : function(el, ev){
				 var group = $(ev.target).data('group'),
				 	focusGroup =   ev.relatedTarget && $(ev.relatedTarget).data('group')
				 if(group && (group == focusGroup)  ){
				 	ev.preventDefault();
				 }else
				 {
				 	//remove others
					this.find('.'+group).each(function(i,brother){
						if(brother != ev.target){
							var event = jQuery.Event( 'selectout' );
							event.stopPropagation();
							jQuery.event.trigger( event, null, brother );
							
						}
							
	                });
				 }

			}
        })
        
     })