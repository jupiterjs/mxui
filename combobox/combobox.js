steal.plugins('jquery/controller',
              'jquery/model',
			  'jquery/view/ejs', 
			  'phui/positionable')
	 .models('lookup','item')
	 .controllers('dropdown').then(function(){
	 	

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            maxHeight: "300px",
			autocompleteEnabled: true,
            loadOnDemand: true,
            showNested: true			
        }
    }, {
    
        init: function(){
			this.currentValue = "-1";
			
			// draw input box
            this.element.html(this.view("//phui/combobox/views/init.ejs"));
            
            // create dropdown and append it to body
            this.dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options );
            document.body.appendChild(this.dropdown[0]);	
			this.dropdown.controller().style();		
			this.dropdown.controller().hide();
     
            // pre-populate with items case they exist
            if (this.options.items) {
				// create model instances from items
				var instances = [];
				for(var i=0;i<this.options.items.length;i++) {
					var item = this.options.items[i];
                    if( typeof(item) == "string" ) {
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
         * In chrome(2.0.172) when we click on the scrollbar, the input field will loose focus. And now if you click outside,
         * then the dropdown won't close(as the input has already lost focus when you clicked on the srollbar)
         * In Firefox(3.5), IE(8), opera(9.64), safari() when we click on the scrollbar the input field will not loose focus.
         * Hence when you click outside (after clicking on the srollbar) the dropdown will close. This is the expected behaviour.
         * So In chrome once the scrollbar is clicked, and then if I click outside the dropdown won't close.
         * http://stackoverflow.com/questions/1345473/google-chrome-focus-issue-with-the-scrollbar
         */
        focusin: function(el, ev){
            // trick to make dropdown close when combobox looses focus			
            this.hasFocus = true;
			
            // load items on demand
            if (this.options.loadOnDemand && !this.itemsAlreadyLoaded) {
				this.options.model.findAll(this.options.params || {}, this.callback("found"));
												
            } 
        },
        focusout: function(el, ev){
            this.hasFocus = false;
            var keepFocus = this.dropdown.controller().keepFocus;		
			if (!$.browser.mozilla) {
                if (!keepFocus) {
                    this.dropdown.controller().hide();
                }
                else {
                    this.dropdown.controller().keepFocus = false;
                    this.element.focus();
                }
            }
            else {
                if (!keepFocus) 
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
