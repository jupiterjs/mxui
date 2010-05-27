$.Controller.extend("Phui.Combobox.DropdownController", {
	init : function(el, combobox, options) {
		this.combobox = combobox;
		this.options = options;
		this.hasFocus = false;
	},
	style : function() {
        this.element.css("width", this.combobox.css("width"));
        if (this.options.maxHeight) {
			this.element.css({
				"height": this.options.maxHeight,
				"overflow": "auto"
			});
		}		
		this.find("li").css("width", this.element.width() - 2);
	},
	draw : function(modelList, showNested) {
		// draw the dropdown
		var html = this._draw(modelList, showNested);
		this.element.html(html);
		
		// apply custom style to item and
	    // hookup the models to the elements
		for(var i=0;i<modelList.length;i++) {
			var item = modelList[i];
		    
			var el = this.find("." + item.identity());
			el.find(".text").css(this.options.textStyle);
			
			if (el[0]) {
				item.hookup(el[0]);
			}			
		}
		
		// add up/down key navigation
		this.element.children("ul").phui_selectable({
            selectedClassName: "selected",
            activatedClassName: "activated"			
		});
		
		this.style();				
	},
	_draw : function(list, showNested) {
		var html = [],
		    nextLevel;
		for (var i = list.length-1; i >= 0; i--) {
			var item = list[i], nextItem = list[i-1];
			nextLevel = nextItem ? nextItem.level : null;
			if (item.level < nextLevel) {
				html.push("<ul>");
				html.push( this._drawItemHtml(item) );
				html.push( this.openLI(item) );
			}
			if (item.level > nextLevel) {
				html.push( this._closeLI() );										
				html.push("</ul>");
				html.push( this._closeLI() );
				html.push( this._drawItemHtml(item) );
				html.push( this._openLI(item) );		
			}
			if (item.level == nextLevel) {
				html.push( this._closeLI() );							
				html.push( this._drawItemHtml(item) );
				html.push( this._openLI(item) );
			}

            // close tags when we are at the end of the list			
			if( nextLevel == null) {
				for(var j=0;j<item.level;j++) {
    				html.push("</ul>");								
	    			html.push( this._closeLI() );	
				}						
				html.push( this._closeLI() );
				html.push( this._drawItemHtml(item) );
				html.push( this._openLI(item) );				
			}
		}
	
		return "<ul>" + html.reverse().join(" ") + "</ul>";
	},
	_openLI : function(item) {
			var html = [];
			html.push("<li class='item " + item.identity());
			item.enabled ? html.push("' >") : html.push(this.options.disabledClassName + "' >");
			return html.join(" ");					
	},
	_closeLI : function() {
			var html = [];		
			html.push("</li>");		
			return html.join(" ");		
	},
	_drawItemHtml : function(item) {
			var html = []; 
			html.push("<span style='float:left;margin-left:" + item.level*20 + "px'>&nbsp;</span>");
			html.push( this.options.render["itemText"](item) );		
			return html.join(" ");		
	},
	/*_drawLI : function(item) {
			var rowTemplate = [];
			rowTemplate.push("<li class='item " + item.identity());
			item.enabled ? rowTemplate.push("' >") : rowTemplate.push(this.options.disabledClassName + "' >"); 
			rowTemplate.push("<span style='float:left;margin-left:" + item.level*20 + "px'>&nbsp;</span>");
			rowTemplate.push( this.options.render["itemText"](item) );
			rowTemplate.push("</li>");		
			return rowTemplate.join(" ");
	},*/
	keyup : function(el, ev) {
		var key = $.keyname(ev);
				
		// close dropdown on escape
		if (key == "escape") {
			this.hide();				
		}		
	},
	val: function(item) {
		var el = this.find("li.combobox_models_item_" + item.value + ":first");
		/*this.find("li").removeClass( this.options.selectedClassName );
		el.addClass( this.options.selectedClassName );*/		
		//el.trigger("activate");
	},
	"li activate" : function(el, ev) {
		if (!el.hasClass(this.options.disabledClassName)) {
			var item = el.model();
			if (item) {
				// set combobox new value
				this.combobox.controller().val(item.value);
				
				// highlight activated item
				/*this.find("li").removeClass(this.options.activatedClassName);
				el.addClass(this.options.activatedClassName);*/
				
				// then hide dropdown			
				this.element.hide();
				
				// trick to make dropdown close when combobox looses focus			
				this.hasFocus = false;
			}
		}
	},
	
	mouseenter : function(el, ev) {
        // trick to make dropdown close when combobox looses focus			
		this.hasFocus = true;		
	},	
	mouseleave : function(el, ev) {
        // trick to make dropdown close when combobox looses focus			
		this.hasFocus = false;
								
		this.combobox.find("input:visible").focus();
		
		// .focus() does not trigger focus on input in IE so we must
		// trigger focusout on this.element explicitely.
		if($.browser.msie) this.element.trigger("focusout");		
	},
	focusin : function(el, ev) {
        // trick to make dropdown close when combobox looses focus				
		this.hasFocus = true;
	},
	focusout : function(el, ev) {
        // trick to make dropdown close when combobox looses focus				
		this.hasFocus = false;
	},		
	hide : function() {
		this.element.slideUp("fast");
	},
	show : function() {
		this.element.slideDown("fast");	
		
		// position the dropdown bellow the combobox input
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);		
		
		this.style();			
					
		this.combobox.trigger("open");		
	}
})
