steal.plugins('jquery/controller',
              'jquery/view/ejs',
			  'phui/positionable',
			  'phui/key_validator')
			  .controllers('dropdown')
			  .then(function(){

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            maxHeight: "300px"
        }
    }, {
        /*
         * 1) this.number = this.Class.counter;
         * 2) this.Class.counter++;
         * 2) wrap input with combobox icons (right down arrow)
         * 3) this.options.model.findAll(this.options.params || {}, this.callback("found")
         */
        init: function(){
            this.lookupStructure = {};
            this.element.html( this.view("//phui/combobox/views/init.ejs") );
            this.options.model.findAll(this.options.params || {}, this.callback("found"));
        },
        
        /*
         * 1) Create dropdown (div) element
         * 2) Render dropdown (use options.render and <%= instance %>)
         * 3) Set position: absolute, position near input (this.element)
         * 4) Set maxHeight
         * 4) Hide dropdown
         * 5) Create lookup table
         */
        found: function(instances){
            this.dropdown = $("<div></div>");
            document.body.appendChild( this.dropdown[0] );
			this.dropdown.phui_combobox_dropdown( this.element, this.options );
			this.dropdown.trigger("draw", instances);			
			this.dropdown.trigger("hide");
            this.buildLookupStructure(instances);
        },
		
		drawDropdown : function(instances) {
			this.dropdown.trigger("draw", instances);			
		},		
        
        /*
         * iterate through instances, use text first char as key and instance as value
         * for the lookup structure
         */
        buildLookupStructure: function(instances){
            for (var i = 0; i < instances.length; i++) {
                var firstChar = instances[i].text.substr(0, 1);
                if (!this.lookupStructure[firstChar]) 
                    this.lookupStructure[firstChar] = [];
                this.lookupStructure[firstChar].push(instances[i]);
            }
        },
        
        /*
         * 1) Lookup the lookup table
         * 2) this.val(<looked up text>)
         */
        lookup: function(query){
            var results = [];
            var firstChar = query.substr(0, 1);
            
            for (var k in this.lookupStructure) {
                if (k == firstChar) {
                    for (var j = 0; j < this.lookupStructure[k].length; j++) {
                        results.push(this.lookupStructure[k][j])
                    }
                }
            }
            
            for (var i = 0; i < results.length; i++) {
                if (results[i].text.indexOf(query) == -1) 
                    results.splice(i)
            }
            
            return results;
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
            
            var instances = this.lookup(newVal);
			this.dropdown.trigger("draw", instances);
			this.dropdown.trigger("show");
        },
        
        /*
         * dropdown.val(text) if(text)
         * else return dropdown.val()
         */
        val: function(text){
        
        },
        
        ".toggle click": function(el, ev){
            this.find("input").trigger("focus");
			this.dropdown.is(":visible") ? this.dropdown.trigger("hide") : this.dropdown.trigger("show");
        },
        
        "input focusout": function(el, ev){
            //$(".phui_combobox_dropdown").hide();            
        },
        
        destroy: function(){
            this.lookupStructure = null;
			this.dropdown.remove();
			this.dropdown = null;
        }
        
        
        
        
    });
    
    
});
