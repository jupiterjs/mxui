steal.plugins('jquery/controller', 'phui/keycode')
     .then(function(){
	 	$.Controller.extend('Phui.Selectable',{
			defaults : {
				selectableClassName: "selectable",
				selectedClassName : "selected",
				activatedClassName : "activated"
			}
		},
		{
			init: function(){
				var self = this;
				var firstPass = true;
				this.element.find('.' + this.options.selectableClassName).each(function(i, el){
					$(this).attr('tabindex', i)
					if(firstPass) {
						self.firstTabIndex = i;
						firstPass = false;
					}
					self.lastTabIndex = i;
					var i;
				})
			},
			".{selectableClassName} mouseenter": function(el, ev){
				el.trigger("select")
			},
			".{selectableClassName} click": function(el, ev){
				el.trigger("activate")
			},
			".{selectableClassName} focusin": function(el, ev){
				//if(this.focusinOnSelect) clearTimeout(this.focusinOnSelect);
				el.addClass( this.options.selectedClassName )
			},
			".{selectableClassName} activate": function(el, ev){
				var activated = this.element.find( '.' + this.options.activatedClassName );
				if(activated.length)
					activated.trigger('deactivate');
				el.addClass( this.options.activatedClassName );
			},
			".{selectableClassName} deactivate": function(el, ev){
				el.removeClass( this.options.activatedClassName );
			},
			".{selectableClassName} select": function(el, ev){
				var selected = this.element.find( '.' + this.options.selectedClassName );
				if (selected.length) {
					selected.trigger('deselect');
				}
				if ($.browser.msie) {
					el.trigger("focusin");
				}
				el.focus();			
			},
			".{selectableClassName} deselect": function(el, ev){
				el.removeClass( this.options.selectedClassName );
			},
			".{selectableClassName} keydown": function(el, ev){
				var key = $.keyname(ev)
				if(key == "down")
					this.focusNext(el);
				if(key == "up")
					this.focusPrev(el);
				if(key == "enter")
					el.trigger("activate")
			},
			focusNext: function(el){
				var last = this.element.find('.' + this.options.selectableClassName +
				               '[tabindex=' + this.lastTabIndex + ']'), 
					first = this.element.find('.' + this.options.selectableClassName +
					           '[tabindex=' + this.firstTabIndex + ']')
				if(el[0] == last[0])
					return first.trigger("select");
				
				var nextTabIndex = parseInt( el.attr("tabindex") ) + 1;
				var nextEl = this.element.find('.' + this.options.selectableClassName +
					           '[tabindex=' + nextTabIndex + ']')					
				nextEl.trigger("select")
			},
			focusPrev: function(el){
				var last = this.element.find('.' + this.options.selectableClassName +
				               '[tabindex=' + this.lastTabIndex + ']'), 
					first = this.element.find('.' + this.options.selectableClassName +
					           '[tabindex=' + this.firstTabIndex + ']')
				if(el[0] == first[0])
					return last.trigger("select");
					
				var prevTabIndex = parseInt( el.attr("tabindex") ) - 1;
				var prevEl = this.element.find('.' + this.options.selectableClassName +
					           '[tabindex=' + prevTabIndex + ']')					
				prevEl.trigger("select")					
			}
		})
	 })
