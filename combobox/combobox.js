steal.plugins('jquery/controller',
              'jquery/model',
			  'jquery/view/ejs',
			  'phui/positionable',
			  'phui/key_validator')
		.models('lookup')
		.controllers('dropdown')
		.then(function(){

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            maxHeight: "300px"
        }
    }, {
        /*
         */
        init: function(){
            this.lookupStructure = {};
            this.element.html( this.view("//phui/combobox/views/init.ejs") );
            this.options.model.findAll(this.options.params || {}, this.callback("found"));
        },
        
        /*
         */
        found: function(instances){
            this.dropdown = $("<div></div>");
            document.body.appendChild( this.dropdown[0] );
			this.dropdown.phui_combobox_dropdown( this.element, this.options );
			//TODO: fix synchronization draw/hide
			this.dropdown.trigger("draw", instances);			
			
            //this.buildLookupStructure(instances);
			this.lookup = new Lookup({});
			this.lookup.build(instances);
        },
		
		drawDropdown : function(instances) {
			this.dropdown.trigger("draw", instances);
			this.dropdown.trigger("show");			
		},		
        
        "input keypress": function(el, ev){
            var key = $.keyname(ev)
            /*if(key.length > 1){ //it is a special, non printable character
             return;
             }*/
            var current = el.val(), before = current.substr(0, el.selectionStart()), end = current.substr(el.selectionEnd()), newVal = before + key + end;
            
            if (key === "backspace") 
                newVal = before.substr(0, before.length - 2);
            
            if ($.trim(newVal) === "") {
                this.options.model.findAll(this.options.params || {}, this.callback("drawDropdown"));
                return;
            }
            
            var instances = this.lookup.query(newVal);
			this.dropdown.trigger("draw", instances);
			this.dropdown.trigger("show");
        },
        
        /*
         * dropdown.val(text) if(text)
         * else return dropdown.val()
         */
        val: function(text){
			if(!text)
                return this.find("input").val();
		    this.find("input").val(text);
        },
        
        ".toggle click": function(el, ev){
            this.find("input").trigger("focus");
			this.dropdown.is(":visible") ? this.dropdown.trigger("hide") : this.dropdown.trigger("show");
        },
        
        "input focusout": function(el, ev){
            //$(".phui_combobox_dropdown").hide();            
        },
        
        destroy: function(){
            //this.lookupStructure = null;
			this.dropdown.remove();
			this.dropdown = null;
        }
        
    });
    
    
});
