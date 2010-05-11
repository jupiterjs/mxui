$.Controller.extend("Phui.Combobox.DropdownController", {
	listensTo : ["show", "hide", "draw"]
}, 
{
	init : function(el, combobox, options) {
		this.combobox = combobox;
		this.options = options;
	},
	
	draw : function() {
		//TODO: simplify this code
		var args = $.makeArray(arguments);
		args.shift();
		args.shift();
		var instances  = args;
		
        this.element.html("//phui/combobox/views/dropdown/init.ejs", {
            instances: instances,
            options: this.options
        });
		
        this.element.css("width", this.combobox.css("width"));
        this.element.css("height", this.options.maxHeight);
        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom'
        }).trigger("move", this.combobox);		
	},
	
	"li click" : function(el, ev) {
        this.combobox.find("input").val( el.model().text );
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
	
	hide : function(el, ev) {
		this.element.slideUp("fast");
	},
	
	show : function(el, ev) {
		this.element.slideDown("fast");		
	}
})
