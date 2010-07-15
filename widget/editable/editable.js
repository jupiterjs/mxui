steal.plugins('phui/widget/textbox','phui/widget/show','jquery/dom/compare','jquery/event/default','jquery/event/select').then(function($){
        

    Phui.Widget.extend("Phui.Widget.Editable",
    {
        defaults : {
            show_type : Phui.Widget.Show,
            edit_type : Phui.Widget.Textbox
        },
        listensTo : ['selectin','default.selectout','selectout']
    },
    {
        setup : function(el, options){
            this._super(el, options);
            if(this.options.group){
                this.element.addClass(this.options.group);
                jQuery.data(el, 'group', this.options.group);
            }                    
        },
        init : function(el, options){
            this.mode = 'SHOW'
            this.element.attr('tabindex','0').css("outline","none")
            //this.options= options;
        },
		/**
		 * 
		 */
		selectin : function(el, ev){
			//console.log("select..", ev.target, ev.target == this.element[0], this.mode == 'SHOW')
			 //cancels all selects above me
			if(ev.target == this.element[0] && this.mode == 'SHOW'){
                this.mode = 'EDIT';
				if(ev.byFocus) //we have focus
					this.ignoreDeselect = true;
				
				this.element.removeAttr("tabindex");
				
				this.options.value = this.value();
                this.element.html(this.Class.OPTIONS.edit_type.view(this.options)).hookupView();
                $(this.element.children()[0] ).trigger("select", ev.byFocus);
            }else{
				ev.stopPropagation();
			}
		},
		"selectout" : function(el, ev){
			//if I am already deselected, stop this event
			if(this.mode == 'SHOW'){
				ev.preventDefault();
				ev.stopPropagation();
			}else if(this.ignoreDeselect){
				this.ignoreDeselect = false;
				ev.stopPropagation();
				ev.preventDefault();
				return;
			}else{
				var i =1;
			}
		},
		"default.selectout" : function(){
			this.options.value = this.value();
            if(this.mode == 'EDIT'){
                //$(this.element.children()[0] ).trigger("deselect");                    
                this.mode = 'SHOW';
                var el = this.element, ST = this.Class.OPTIONS.show_type, options = this.options;
                
                setTimeout(function(){
                    el.html(ST.view(options)).hookupView()
                },10)

                this.mode = 'SHOW';
                this.element.attr('tabindex','0');
            }
		},
        value : function(){
            return this.element.children().controller().value()
        }
    });

})
