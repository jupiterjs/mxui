steal.plugins('jquery').then(function($){
	
	
	$(function(){
		
		var div = $('<div><div style="width:100%;height:200px"></div></div>').css({
			position: "absolute",
			top: "-100px",
			left: "-100px",
			visibility: "hidden",
			width: "100px",
			height: "100px",
			overflow: "hidden"
		}).appendTo(document.body);
		var inner = div[0].childNodes[0],
			w1 = inner.offsetWidth;
			
		div.css("overflow","scroll");
		
		var w2 = inner.offsetWidth;
		div.remove();
		(window.Phui || (window.Phui = {}) ).scrollbarSize = w1 - w2;
	})
})
