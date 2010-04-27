steal.plugins('phui/grid').then(function($){

	var Grid = Phui.Grid.extend({
		"th a draginit" : function(el, ev, drag){
			drag.ghost(document.body);
		},
		"th a dragend" : function(el, ev){
			ev.preventDefault();
		}
	});
	$.Controller.extend("Phui.Grid.Groupable",{
		init : function(){
			this.element.html("//phui/grid/groupable/views/init.ejs",{})
			new Grid(this.element.children(".gridarea")[0], this.options)
		}
	})

})