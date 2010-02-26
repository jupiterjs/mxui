steal.plugins('phui/widget').then(function($){
	
	
	Phui.Widget.extend("Phui.Widget.Textbox",
	{
		
	},
	{
		init : function(el, options){
			this.options = options;
		},
		keypress : function(el, ev){
			if(this.options.allow && ! this.options.allow.test(String.fromCharCode(ev.charCode)))
				ev.preventDefault()
		}
	})
	
	
})