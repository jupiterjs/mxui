$.Controller.extend("Phui.Combobox.DropdownController", {
	listensTo : ["show", "hide", "draw"]
}, 
{
	init : function(el, combobox, options) {
		this.combobox = combobox;
		this.options = options;
	},
	draw : function(items) {		
		this.element.html("");
		this._draw(items);
		        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);		
		
        this.element.css("width", this.combobox.css("width"));
        this.element.css("height", this.options.maxHeight);
	},
	_draw : function(items) {
	    for(var i=0;i<items.length;i++) {
	        var item = items[i];

	        this.element.append("//phui/combobox/views/dropdown/row.ejs", {
	            item: item,
	            options: this.options
	        });

	        if(item.children.length) {
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
			this.combobox.find("input").val(item.text);
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
	}
})
