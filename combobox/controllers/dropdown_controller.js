$.Controller.extend("Phui.Combobox.DropdownController", {
	listensTo : ["show", "hide", "draw"]
}, 
{
	init : function(el, combobox, options) {
		this.combobox = combobox;
		this.options = options;
	},
	style : function() {
        this.element.css("width", this.combobox.css("width"));
        if (this.options.maxHeight) {
			this.element.css({
				"height": this.options.maxHeight,
				"overflow": "auto"
			});
		}
	},
	draw : function(items, isQuery) {		
		this.element.html("");
		this._draw(items, isQuery);
		        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);
		
		//this.style();		
	},
	_draw : function(items, isQuery) {
	    for(var i=0;i<items.length;i++) {
	        var item = items[i];

	        this.element.append("//phui/combobox/views/dropdown/row.ejs", {
	            item: item,
	            options: this.options
	        });

	        if(item.children.length && !isQuery) {
	            for(var j=0;j<item.children.length;j++) {
	                this._draw(item.children);
	            }
	        }
	       
	    }
	},
	mousedown : function(el, ev) {
		this.keepFocus = this.combobox.controller().hasFocus;
	},	
	mouseleave : function(el, ev) {
		this.combobox.find("input").focus();
		this.find("li").removeClass(this.options.hoverClassName);					
	},
	"li click" : function(el, ev) {
		var item = el.model();
        if (item) {
			this.combobox.controller().val(item.value);
			this.find("li").removeClass( this.options.selectedClassName );
			el.addClass( this.options.selectedClassName );
			this.element.hide();
		}
	},
	"li mouseenter" : function(el, ev) {
		el.addClass(this.options.hoverClassName);	
	},
	"li mouseleave" : function(el, ev) {
		el.removeClass(this.options.hoverClassName);				
	},
	hide : function() {
		this.element.slideUp("fast");
	},
	show : function() {
		this.element.slideDown("fast");
		this.style();		
		this.combobox.trigger("open");		
	}
})
