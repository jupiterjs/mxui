steal.plugins(
'jquery/controller',
'jquery/event/default',
'jquery/event/drag',
'jquery/dom/dimensions').then(function($){

//Resizer resizes a bunch of elements by listening to drag/drop
//for performance reasons, this shouldn't be used on elements covering most of the dom.

$.Controller.extend("Phui.Resizer",
{
	
},
{
	"{selector} dragdown": function (el, ev, drag) {
		if (this.isMouseOnRight(el, ev, 2)) {
			var resize = $("<div id='phui_resizer' class='column-resizer'/>")
							.css("position","absolute")
							.appendTo(document.body)
							.css(el.offset())
			
			ev.preventDefault();
			el.trigger("resize:start")
			//prevent others from dragging
		} else {
			drag.cancel();
		}
	},
	//overwrite to size
	"{selector} default.resize:start" : function(el){
		$("#phui_resizer")
			.outerWidth(el.outerWidth())
			.height(el.outerHeight());
	},
	"{selector} dragmove": function (el, ev, drag) {
		ev.preventDefault();
		var width = ev.vector().minus(el.offsetv()).left();
		
		//we want to keep it from moving smaller than the text
		if (width > el.find("span.minWidth").outerWidth())
			$("#phui_resizer").width(width)
	},
	"{selector} dragend": function (el, ev, drag) {
		ev.preventDefault();
		el.trigger("resize:end")
		
		$("#phui_resizer").remove();
	},
	//make sure this is really fast
	"{selector} mousemove": function (el, ev) {
		if (this.isMouseOnRight(el, ev)) {
			el.css("cursor", "e-resize")
		} else {
			el.css("cursor", "")
		}
	},
	isMouseOnRight: function (el, ev, extra) {
		return el.offset().left + el.outerWidth() - 8 - (extra || 0) < ev.vector().left()
	}
})


})
