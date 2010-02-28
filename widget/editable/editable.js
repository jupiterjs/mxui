steal.plugins('phui/widget/textbox','phui/widget/show','jquery/dom/compare').then(function($){
		

	Phui.Widget.extend("Phui.Widget.Editable",
	{
		defaults : {
			SHOW_TYPE : Phui.Widget.Show,
			EDIT_TYPE : Phui.Widget.Textbox
		}
	},
	{
		init : function(el, options){
			this.mode = 'SHOW'
			this.element.attr('tabindex','0').css("outline","none")
			this.options= options;
		},
		click : function(){
			
		},
		focus : function(el, ev){
			if(ev.target == this.element[0]){
				this.options.value = this.value();
				//this.element[0].tabindex = null //.attr('tabindex','')
				this.element.removeAttr("tabindex");
				
				if(this.mode == 'SHOW'){
					this.ignoreNextBlur = true;
					this.element.html(this.Class.EDIT_TYPE.view(this.options)).hookupView()
					$(this.element.children()[0] ).trigger("select")
					this.mode = 'EDIT';
					
				}else{
					//this.element.html(this.Class.SHOW_TYPE.view(this.options)).hookupView()
					//this.mode = 'SHOW'
				}
			}
			
		},
		blur : function(el, ev){
			if(this.ignoreNextBlur){
				this.ignoreNextBlur = false;
				return;
			}
			if(true ){
				
				this.options.value = this.value();

				if(this.mode == 'SHOW'){
					
				}else{

					var el = this.element, ST = this.Class.SHOW_TYPE, options = this.options;
					
					setTimeout(function(){
						el.html(ST.view(options)).hookupView()
					},10)

					this.mode = 'SHOW'
					this.element.attr('tabindex','0')
				}
			}
		},
		value : function(){
			return this.element.children().controller().value()
		}
	});

})
