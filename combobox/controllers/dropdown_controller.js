$.Controller.extend("Phui.Combobox.DropdownController", {
}, 
{
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
	},
	draw : function(items, showNested) {		
		this.element.html("");
		this._draw(items, showNested);
		        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);		
	},
	_draw : function(items, showNested) {
	    for(var i=0;i<items.length;i++) {
	        var item = items[i];

	        this.element.append("//phui/combobox/views/dropdown/row", {
	            item: item,
	            options: this.options
	        });

	        if(item.children.length && showNested) {
	            for(var j=0;j<item.children.length;j++) {
	                this._draw(item.children, showNested);
	            }
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
		
		this.combobox.find("input").focus();
		this.find("li").removeClass(this.options.hoverClassName);					
	},
	select: function(item) {
		var el = this.find("li.item_" + item.value + ":first");
		this.find("li").removeClass( this.options.selectedClassName );
		el.addClass( this.options.selectedClassName );		
	},
	"li click" : function(el, ev) {
		var item = el.model();
        if (item) {
			this.combobox.controller().val(item.value);
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
