steal.plugins('jquery/controller', 'phui/keycode')
     .then(function(){
         $.Controller.extend('Phui.Selectable',{
            defaults : {
                selectableClassName: "selectable",
                selectedClassName : "selected",
                activatedClassName : "activated",
				multiActivate: true,
				cache : false
            }
        },
        {
            init: function() {
                
				this.lastSelected = null;
            },
            ".{selectableClassName} mouseenter": function(el, ev){
                this.selecting(el, false);
            },
			selecting : function(el, autoFocus){
				var oldSelected = 
					this._selected && this._selected.hasClass(this.options.selectedClassName) ?
					this._selected :
					(this._selected = this.element.find("."+this.options.selectedClassName) )
				
				if(!el){
					return oldSelected;
				}else{
					el = $(el)
					oldSelected.trigger("deselect");
					this._selected = el.addClass( this.options.selectedClassName );
					
					if(autoFocus !== false){
						this.showSelected(el)
					}
					
					
					
					el.trigger("select");
				}
			},
			showSelected : function(el){
				el[0].focus()
			},
			activating : function(el, ev){
				if(!this.options.multiActivate || (!ev.shiftKey && !ev.ctrlKey)){
					this.element
						.find("." + this.options.activatedClassName)
						.trigger('deactivate');
					el.trigger("activate");
				}else if(ev.ctrlKey){
					if(el.hasClass(this.options.activatedClassName)){
						el.trigger("deactivate");
					}else{
						el.trigger("activate");
					}
				}else if(ev.shiftKey){
					
					var selectable = this.element.find("." + this.options.selectableClassName),
						found = false,
						lastSelected= this.lastSelected;
						
					if(lastSelected.length && lastSelected[0] != el[0]){
						for(var i =0; i < selectable.length;i++){
							var select = selectable[i];
							if( select ===  lastSelected[0] || select == el[0] ){
								if(!found){
									found = true;
								}else{
									break;
								}
							}else{
								
								if(found){
									var $select = $(select);
									if(!$select.hasClass(this.options.activatedClassName)){
										$(select).trigger("activate");
									}
								}
							}
						}
					}
					el.trigger("activate");
					
				}
				
			},
            ".{selectableClassName} click": function(el, ev){
				this.activating(el, ev);
				
            },
            ".{selectableClassName} focusin": function(el, ev){
                this.selecting(el, false);
            },
            ".{selectableClassName} activate": function(el, ev, keys){
                // if event is synthetic (not IE native activate event)
				el.addClass(this.options.activatedClassName);
				this.lastSelected = el;
				
            },
            ".{selectableClassName} deactivate": function(el, ev){
                // if event is synthetic (not IE native deactivate event)
                if (!ev.originalEvent) {
					el.removeClass(this.options.activatedClassName);
				}
            },
            ".{selectableClassName} select": function(el, ev){
               
				var selected = this.element.find( "."+this.options.selectedClassName );
                if (selected.length) {
                    selected.trigger('deselect');
                }
                el.addClass( this.options.selectedClassName );
            },
            ".{selectableClassName} deselect": function(el, ev){
                el.removeClass( this.options.selectedClassName );
            },
            ".{selectableClassName} keydown": function(el, ev){
                var key = $.keyname(ev)
                if(key == "down"){
					this.selectNext(el);
					ev.preventDefault()
				}else if(key == "up") {
					this.selectPrev(el);
					ev.preventDefault()
				}else  if(key == "enter") {
					this.activating(el, ev);
				}
            },
			cache : function(){
				this._cache = this.element.find("."+this.options.selectableClassName);
			},
			selectable : function(){
				return this._cache ?
						this._cache.filter(":visible") :
						this.element.find("."+this.options.selectableClassName+":visible")
			},
			
            /**
			 * Selects the next element
			 * if an element is provided, select the first after the element
			 * if an element is not provided, selects after the current.  If
			 * there is no current, selects the first.
			 * @param {Object} el
			 */
		    selectNext: function(el){
		        var els = this.selectable(),
					first = els.eq(0),
		            last = els.eq(-1);
		        el = el && el.length ? el : this.selected();
				
		        if (!el.length || el[0] == last[0]) {
		            return this.selected(first);
		        }
		            
		        var nextEl;
		        for(var i=0;i<els.length;i++) {
		            if(el[0] == els[i]) {
		                nextEl =  els[i + 1];
		                break;
		            }
		        }
				this.selecting(nextEl || first, true);
				return nextEl;
		    },
		    selectPrev: function(el){
		        var els = this.selectable(),
					first = els.eq(0),
		            last = els.eq(-1);
		        el = el && el.length ? el : this.selected();
				
		        if (!el.length && el[0] == last[0]) {
		            return this.selected(last);
		        }
		
		        var prevEl;
		        for(var i=0;i<els.length;i++) {
		            if(el[0] == els[i]) {
		                prevEl = els[i - 1];
		                break;
		            }
		        }
				this.selecting(prevEl || last, true); 
				return prevEl;                 
		    }
        })
     })
