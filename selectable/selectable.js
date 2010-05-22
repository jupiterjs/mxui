steal.plugins('jquery/controller', 'phui/keycode')
     .then(function(){
	 	$.Controller.extend('Phui.Selectable',{
			init: function(){
				this.element.find('li').each(function(){
					$(this).attr('tabindex', 0)
				})
			},
			"li focusin": function(el, ev){
				el.trigger('select');
			},
			"li select": function(el, ev){
				var selected = this.element.find('.selected')
				if(selected.length)
					selected.trigger('deselect');
				el.addClass('selected')
			},
			"li deselect": function(el, ev){
				el.removeClass('selected')
			},
			"li keydown": function(el, ev){
				var key = $.keyname(ev)
				if(key == "down"){
					this.focusNext(el);
				}
				if(key == "up"){
					this.focusPrev(el);
				}
			},
			focusNext: function(el){
				var els = this.element.find('li')
				if(el[0] == els[els.length - 1])
					return els[0].focus();
				el.next("li")[0].focus()
			},
			focusPrev: function(el){
				var els = this.element.find('li')
				if(el[0] == els[0])
					return els[els.length - 1].focus();
				el.prev("li")[0].focus()
			}
		})
	 })
