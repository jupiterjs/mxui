steal.plugins('phui/widget').then(function($){
	
	Phui.Widget.extend("Phui.Widget.Show",{
		value : function(){
			return this.options.value;
		}
	})
	
})
