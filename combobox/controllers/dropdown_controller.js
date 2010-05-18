$.Controller.extend("Phui.Combobox.DropdownController", {
	listensTo : ["show", "hide", "draw"]
}, 
{
	init : function(el, combobox, options) {
		this.combobox = combobox;
		this.options = options;
	},
	draw : function(instances) {		
		this.element.html("");
		this._draw(instances);
		        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);		
		
        this.element.css("width", this.combobox.css("width"));
        this.element.css("height", this.options.maxHeight);
	},
	_draw : function(instances) {
	    for(var i=0;i<instances.length;i++) {
	        var item = instances[i];

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
	},
	"li click" : function(el, ev) {
        this.combobox.find("input").val( el.model().text );
		//this.combobox.controller().val( el.model().identity() );
	    this.element.hide();		
	},
	"li mouseenter" : function(el, ev) {
        el.css("color", "white");
        el.css("background-color", "blue");		
	},
	"li mouseleave" : function(el, ev) {
        el.css("color", "");
        el.css("background-color", "");		
	},
	hide : function() {
		this.element.slideUp("fast");
	},
	show : function() {
		this.element.slideDown("fast");		
	}
})
