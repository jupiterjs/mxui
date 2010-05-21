steal.plugins('jquery/controller',
              'jquery/model',
			  'jquery/view/ejs', 
			  'phui/positionable')
	 .models('lookup','item')
	 .controllers('dropdown').then(function(){
	 	

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            //textTemplate: "//phui/combobox/views/default_text_template.ejs",
			textTemplate: "//phui/combobox/views/demo.ejs",
            textStyle: "color:blue;font-style:italic;",
			autocompleteEnabled: true,
            loadOnDemand: false,
            showNested: false,
            maxHeight: null,
            hoverClassName: "hover",
            selectedClassName: "selected",
			disabledClassName: "disabled"					
        }
    }, {
    
        init: function(){
			this.currentValue = "-1";
			
			// draw input box
            this.element.html(this.view("//phui/combobox/views/init.ejs"));
            
            // create dropdown and append it to body
            this.dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options ).hide();
            document.body.appendChild(this.dropdown[0]);	
			this.dropdown.controller().style();		
			//this.dropdown.controller().hide();
     
            // pre-populate with items case they exist
            if (this.options.items) {
				// create model instances from items
				var instances = [];
				for(var i=0;i<this.options.items.length;i++) {
					var item = this.options.items[i];
                    if( typeof item === "string" ) {
						item = {"text": item};
						item["id"] = i + 1;
						item["value"] = i + 1;
						item["enabled"] = true;
						item["depth"] = 0;
						item["children"] = [];
					}
					instances.push( new Combobox.Models.Item(item) );
				} 
			
				this.lookup = new Lookup({});
				//this.lookup.build( this.options.items, this.options.showNested, this.options.autocompleteEnabled );
				this.lookup.build( instances, this.options.showNested, this.options.autocompleteEnabled );
                //this.dropdown.controller().draw( this.options.items, this.options.showNested );
				this.dropdown.controller().draw( instances, this.options.showNested );				
            }
        },
        found: function(items){
			this.lookup = new Lookup({});
			this.lookup.build( items, this.options.showNested, this.options.autocompleteEnabled );

            this.dropdown.controller().draw(items, this.options.showNested);
            this.dropdown.controller().show();			

            this.itemsAlreadyLoaded = true;
        },
        drawDropdown: function(items){
            this.dropdown.controller().draw(items, this.options.showNested);
        },
        "input keyup": function(el, ev){
			if (this.options.autocompleteEnabled) {
				var showNested = false;
				var newVal = el.val();
				if ($.trim(newVal) === "") {
					newVal = "*";
					showNested = this.options.showNested;
				}
				var items = this.lookup.query(newVal);
				this.dropdown.controller().draw(items, showNested);
				this.dropdown.controller().show();
			}
        },
        /*
		 * Bug: input looses focus on scroll bar click in IE, Chrome and Safari
		 * Fix inspired in:
		 * http://stackoverflow.com/questions/2284541/form-input-loses-focus-on-scroll-bar-click-in-ie
         */
        focusin: function(el, ev){
            // trick to make dropdown close when combobox looses focus			
            if(this.closeDropdownOnBlurTimeout) 
			    clearTimeout(this.closeDropdownOnBlurTimeout);
			
            // load items on demand
            if (this.options.loadOnDemand && !this.itemsAlreadyLoaded) {
				this.options.model.findAll(this.options.params || {}, this.callback("found"));
												
            } 
        },
        focusout: function(el, ev){
            // trick to make dropdown close when combobox looses focus				
			var self = this;
			if (this.dropdown.controller().hasFocus) {
				this.closeDropdownOnBlurTimeout = setTimeout(function(){
					self.element.trigger("focusin");
				}, 1);
			} else {
				this.dropdown.controller().hide();				
			}
        },
        val: function(value){
            if(!value) 
			    return this.currentValue;
			var item = this.lookup.getByValue(value);
			if (item && item.enabled) {
				this.currentValue = item.value;
				this.find("input").val(item.text);
				
				// after selecting draw all items and mark item as selected
				// (in case we came from an autocomplete lookup)
		        var items = this.lookup.query("*");	
		        this.dropdown.controller().draw( items, this.options.showNested );				
				this.dropdown.controller().select(item);
				
                this.element.trigger("change", this.currentValue);				
			}
         },
		query : function(text) {
		 	var items = this.lookup.query(text);
			return $.map(items, function(item){
				return item.value;
			})
		 },
		enable : function(value) {
		    var item = this.lookup.getByValue(value);
		    item.attr("enabled", true);
		    var items = this.lookup.query("*");	
		    this.dropdown.controller().draw( items, this.options.showNested );
		},
		disable : function(value) {
	        var item = this.lookup.getByValue(value);
	        item.attr("enabled", false);
		    var items = this.lookup.query("*");	
		    this.dropdown.controller().draw( items, this.options.showNested );
		},		 
        ".toggle click": function(el, ev){
            this.find("input").trigger("focus");
            this.dropdown.is(":visible") ? this.dropdown.controller().hide() : this.dropdown.controller().show();
        },
        destroy: function(){
            this.dropdown.remove();
            this.dropdown = null;
            this.lookup._lookup = null;
            this.lookup = null;
            this._super();
        }
        
    });
    
    
});
