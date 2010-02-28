steal.plugins('phui/widget').then(function($){
	
	
	Phui.Widget.extend("Phui.Widget.Textarea",
	{
		listensTo: ["select"]
	},
	{
		init : function(el, options){
			this.options = options;
		},
		value : function(){
			return this.element.children('textarea').val();
		},
		select : function(){
			this.element.children('textarea')[0].focus()
		}
	})
	
	
})