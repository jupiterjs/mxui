steal.plugins('jquery/controller', 'phui/keycode')
     .then(function(){
	 	$.Controller.extend('Phui.Selectable',{
			init: function(){
				this.element.find('li').each(function(){
					$(this).attr('tabindex', 0)
					var i;
				})
			},
			"li mouseenter": function(el, ev){
				el.trigger("select")
			},
			"li click": function(el, ev){
				el.trigger("activate")
			},
			"li focusin": function(el, ev){
				el.addClass('selected')
			},
			"li activate": function(el, ev){
				var activated = this.element.find('.activated')
				if(activated.length)
					activated.trigger('deactivate');
				el.addClass('activated')
			},
			"li deactivate": function(el, ev){
				el.removeClass('activated')
			},
			"li select": function(el, ev){
				var selected = this.element.find('.selected')
				if(selected.length)
					selected.trigger('deselect');
				el[0].focus();
			},
			"li deselect": function(el, ev){
				el.removeClass('selected')
			},
			"li keydown": function(el, ev){
				var key = $.keyname(ev)
				if(key == "down")
					this.focusNext(el);
				if(key == "up")
					this.focusPrev(el);
				if(key == "enter")
					el.trigger("activate")
			},
			focusNext: function(el){
				var last = this.element.find('li:last'), 
					first = this.element.find('li:first')
				if(el[0] == last[0])
					return first.trigger("select");
				el.next("li").trigger("select")
			},
			focusPrev: function(el){
				var last = this.element.find('li:last'), 
					first = this.element.find('li:first')
				if(el[0] == first[0])
					return last.trigger("select");
				el.prev("li").trigger("select")
			}
		})
	 })
