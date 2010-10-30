steal.plugins('mxui/widget').then(function($){
	
	
	Mxui.Widget.extend("Mxui.Widget.Textarea",
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