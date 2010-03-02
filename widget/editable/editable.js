steal.plugins('phui/widget/textbox','phui/widget/show','jquery/dom/compare').then(function($){
		

	Phui.Widget.extend("Phui.Widget.Editable",
	{
		defaults : {
			SHOW_TYPE : Phui.Widget.Show,
			EDIT_TYPE : Phui.Widget.Textbox
		},
		listenTo : ['focus']
	},
	{
        setup : function(el, options){
            this._super(el, options);
            if(this.options.group){
                this.element.addClass(this.options.group);
                this.element.data('group', this.options.group);
            }                    
        },
		init : function(el, options){
			this.mode = 'SHOW'
			this.element.attr('tabindex','0').css("outline","none")
			this.options= options;
		},
		click : function(){
			
		},
		focus : function(el, ev){
			if(ev.target == this.element[0]){
                this.drawEditView(true);
			}
			
		},
		drawEditView : function(triggerSelect){
			this.options.value = this.value();
			//this.element[0].tabindex = null //.attr('tabindex','')
			this.element.removeAttr("tabindex");
			
			if(this.mode == 'SHOW'){
				this.ignoreNextBlur = true;
				this.element.html(this.Class.OPTIONS.EDIT_TYPE.view(this.options)).hookupView()
				if(triggerSelect) $(this.element.children()[0] ).trigger("select")
				this.mode = 'EDIT';
				
			}else{
				//this.element.html(this.Class.OPTIONS.SHOW_TYPE.view(this.options)).hookupView()
				//this.mode = 'SHOW'
			}		
		},
		blur : function(el, ev){
			if(this.ignoreNextBlur){
				this.ignoreNextBlur = false;
				return;
			}
			if(true ){				
				this.drawShowView();
			}
		},
		drawShowView : function(){
			this.options.value = this.value();
			if(this.mode == 'SHOW'){
				
			}else{

				var el = this.element, ST = this.Class.OPTIONS.SHOW_TYPE, options = this.options;
				
				setTimeout(function(){
					el.html(ST.view(options)).hookupView()
				},10)

				this.mode = 'SHOW'
				this.element.attr('tabindex','0')
			}
		},
		value : function(){
			return this.element.children().controller().value()
		}
	});

})
