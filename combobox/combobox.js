steal.plugins('jquery/controller',
              'jquery/model/list',
			  'phui/positionable',
			  'phui/selectable')
	 .models('lookup','item')
	 .controllers('dropdown').then(function(){
	 	
		
    $.Controller.extend("Phui.Combobox", {
        defaults: {
			render: {
				"itemText" : function(item) {
				    var html = [];
					html.push("<span class='text'>" + item.text + "</span>");
					return html;
				}
			},
            textStyle: "color:blue;font-style:italic;",
            showNested: false,
            maxHeight: null,
            selectedClassName: "selected",
            activatedClassName: "activated",
			disabledClassName: "disabled"
        }
    }, {
		setup : function(el, options) {
    		var div = $('<div/>');
    		this.oldElement = $(el).replaceWith(div);
			div.attr("id", this.oldElement.attr("id"));
			div.html(this.oldElement);
		    this._super(div, options);	
		},
        init: function(){
			this.currentValue = "-1";
			this.hasFocus = false;
			
			// draw input box
			var arrowHtml = "<div class='toggle'>&nbsp;</div>";
			this.element.append(arrowHtml);		
			this.element.css({height:"", width:""});	
            
			// append hidden input to help with form data submit
			this.oldElementName = this.oldElement.attr("name")
			this.oldElement.removeAttr("name");
			$("<input/>").attr("name", this.oldElementName)
			    		 .appendTo(this.element)
						 .hide();
			
            // create dropdown and append it to body
            this.dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options ).hide();
            document.body.appendChild(this.dropdown[0]);	
			this.dropdown.controller().style();		
     
            // pre-populate with items case they exist
            if (this.options.items) {
				// create model instances from items
				var selectedItem, instances = [];
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
					
					// add reasonable default attributes
					if( typeof item === "object") {
						if(!item.id) item.id = item.value;
						if(!item.enabled) item.enabled = true;
						if(!item.depth) item.depth = 0;
						if(!item.children) item.children = [];						
					}
					
					// pick inital combobox value
					if(item.selected) selectedItem = item;
					
					// wrap input data item within a combobox.models.item instance so we 
					// can leverage model helper functions in the code later 
					instances.push(item);
				} 
				
				// this is where we store the loaded data in the controller
				instances =  Combobox.Models.Item.wrapMany(instances);
				this.modelList = new $.Model.List(instances);
				
				// render the dropdown and set an initial value for combobox
				this.dropdown.controller().draw( this.modelList, this.options.showNested );				
				this.val( selectedItem.value );
            }
        },
        "input keyup": function(el, ev){
			var key = $.keyname(ev)
			
			// close dropdown on escape
			if (key == "escape") {
				this.dropdown.controller().hide();				
			}
			
			// if down key is clicked, navigate to first item
			if (key == "down") {
				this.dropdown.controller().hasFocus = true;
				this.dropdown.find("li:first").trigger("select");
				return;
			}
			
			// if up key is clicked, navigate to last item			
			if (key == "up") {
				this.dropdown.controller().hasFocus = true;
				this.dropdown.find("li:last").trigger("select");
				return;
			}
			
			// autosuggest
		    var matches = this.modelList.grep(function(item){
				return item.text.indexOf( el.val() ) > -1;
			});
			this.dropdown.controller().draw( matches, this.options.showNested );			
        },
		"input focusin": function(el, ev){
			// select all text
		    //el[0].focus();
		    el[0].select();
            if(!this.dropdown.is(":visible"))
				this.dropdown.controller().show();
		},
        /*
         * Trick to make dropdown close when combobox looses focus
		 * Bug: input looses focus on scroll bar click in IE, Chrome and Safari
		 * Fix inspired in:
		 * http://stackoverflow.com/questions/2284541/form-input-loses-focus-on-scroll-bar-click-in-ie
         */
        focusin: function(el, ev){
            // trick to make dropdown close when combobox looses focus			
            if(this.closeDropdownOnBlurTimeout) 
			    clearTimeout(this.closeDropdownOnBlurTimeout);
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
		mouseleave : function(el, ev) {
			if (this.dropdown.is(":visible")) {
				this.find("input:visible").focus();
				
				// .focus() does not trigger focus on input in IE so we must
				// trigger focusout on this.dropdown explicitely.
				if($.browser.msie) this.dropdown.trigger("focusout");
			}		
		},		
        val: function(value){
            if(!value && value != 0) 
			    return this.currentValue;
				
			var item = this.modelList.match("value", value)[0];
			if (item && item.enabled) {
				this.currentValue = item.value;
				this.find("input:visible").val(item.text);
				
				// after selecting draw all items and mark item as selected
				// (in case we came from an autocomplete lookup)	
		        this.dropdown.controller().draw( this.modelList, this.options.showNested );				
				this.dropdown.controller().val(item);
				
				// bind values to the hidden input
				this.find("input[name='" + this.oldElementName + "']").val(this.currentValue);
				
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
            this.find("input:visible").trigger("focus");
			
			// .focus() does not trigger focus on input in IE so we must
			// show/hide dropdown explicitely.
			if ($.browser.msie) {
				this.dropdown.is(":visible") ? 
				    this.dropdown.controller().hide() : this.dropdown.controller().show();				
			}			
        },
        destroy: function(){
            this.dropdown.remove();
            this.dropdown = null;
			this.modelList = null;
			this.oldElementName = null;			
   			var me = this.element; //save a reference
   			this._super()  //unbind everything
   			me.replaceWith(this.oldElement); //replace with old
   			this.oldElement = null;  //make sure we can't touch old			
        }
        
    });
    
    
});
