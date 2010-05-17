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
		
		this.element.html("");
		this._drawInstances(instances);
		
        this.element.css("width", this.combobox.css("width"));
        this.element.css("height", this.options.maxHeight);
        
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
			collision: 'none none'
        }).trigger("move", this.combobox);		
		
		this.element.trigger("hide");		
	},
	
	_drawInstances : function(instances) {
	    for(var i=0;i<instances.length;i++) {
	        var item = instances[i];

	        this.element.append("//phui/combobox/views/dropdown/row.ejs", {
	            item: item,
	            options: this.options
	        });

	        if(item.children.length) {
	            for(var j=0;j<item.children.length;j++) {
	                this._drawInstances(item.children);
	            }
	        }
	       
	    }
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
