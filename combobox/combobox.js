steal.plugins('jquery/controller',
              'jquery/event/hover',
              'jquery/model/list',
              'phui/positionable',
              'phui/selectable')
     .models('item')
     .controllers('dropdown').then(function(){
         
        
    $.Controller.extend("Phui.Combobox", {
        defaults: {
            render: {
                "itemTemplate" : function(item) {
                    var html = [];
                    html.push("<span class='text'>" +  item.text + "</span>");
                    return html.join(" ");
                }
            },
            textStyle: {'color':'blue','font-style':'italic'},
            showNested: true,
            maxHeight: null,
            filterEnabled : true,
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
            this.element.find("input").wrap("<div class='container' />").hide();
            this.element.find(".container").append( $("<div class='viewbox' tabindex='0' />") );
            this.currentItem = { "value": -1 };
            
            // draw input box
            var arrowHtml = "<div class='toggle'>&nbsp;</div>";
            this.element.prepend(arrowHtml);        
            this.element.css({height:"", width:""});    
            
            // append hidden input to help with form data submit
            this.oldElementName = this.oldElement.attr("name")
            this.oldElement.removeAttr("name");
            $("<input type='hidden' />").attr("name", this.oldElementName)
                         .appendTo(this.element);
            
            // create dropdown and append it to body
            this.dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options ).hide();
            document.body.appendChild(this.dropdown[0]);    
            this.dropdown.controller().style();
            
            // pre-populate with items case they exist
            if (this.options.items) this.loadData(this.options.items);      
        },
        loadData : function(items) {
            var data = items;
            if (this.options.showNested) {
                // flatten input data structure (which may be nested)
                data = this.flattenEls(items, 0);
            }
            
            // create model instances from items
            var selectedItem, instances = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                
                if (typeof item === "string") {
                    item = {
                        "text": item
                    };
                    item["id"] = i;
                    item["value"] = i;
                    item["enabled"] = true;
                    item["level"] = 0;
                    item["children"] = [];
                }
                
                // add reasonable default attributes
                if (typeof item === "object") {
                    if (item.id === undefined) 
                        item.id = item.value;
                    if (item.enabled === undefined) 
                        item.enabled = true;
                    if (item.children === undefined) 
                        item.children = [];
                    if(!this.options.showNested)
                        item.level = 0;
                }
                
                // pick inital combobox value
                if (item.selected) 
                    selectedItem = item;
                
                instances.push(item);
            }

            // wrap input data item within a combobox.models.item instance so we 
            // can leverage model helper functions in the code later 
            instances = Combobox.Models.Item.wrapMany(instances);
            this.modelList = new $.Model.List(instances);
            
            // render the dropdown and set an initial value for combobox
            this.dropdown.controller().draw(this.modelList);
            this.dropdown.controller().style();
            if (selectedItem) {
                var instance = Combobox.Models.Item.wrap(selectedItem);
                var el = this.dropdown.controller().getElementFor(instance);
                this.val(selectedItem.value, el.html());
            }  
        },
        flattenEls : function(list, currentLevel, items){
            items = items || [];
            currentLevel = currentLevel || 0;
            if(!list.length) return items;
            var item = list[0];
            var children = item.children;
            delete item.children;
            item.level = currentLevel;
            items.push(item)
            if (children) {
                this.flattenEls(children, currentLevel + 1, items);
            }
            this.flattenEls(list.splice(1, list.length-1), currentLevel, items);
            return items;
        },
        ".viewbox click" : function(el, ev) {
            this._toggleComboboxView(el);
        },
        ".viewbox focusin" : function(el, ev) {
            this._toggleComboboxView(el);
        },
        _toggleComboboxView : function(el) {
            el.hide();
            var input = this.find("input[type='text']");
            input.show();
            input[0].focus();            
            input[0].select();
        },
        "input keyup": function(el, ev){
            var key = $.keyname(ev);
            
            // close dropdown on escape
            if (key == "escape") {
                this.dropdown.controller().hide();   
                return false;             
            }
            
            // if down key is clicked, navigate to first item
            if (key == "down") {
                this.dropdown.controller().hasFocus = true;
                var firstTabIndex = this.dropdown.find("ul:first").controller().firstTabIndex;
                this.dropdown.find(".selectable[tabindex=" + firstTabIndex + "]").trigger("select");
                return;
            }
            
            // if up key is clicked, navigate to last item            
            if (key == "up") {
                this.dropdown.controller().hasFocus = true;
                var lastTabIndex = this.dropdown.find("ul:first").controller().lastTabIndex;
                this.dropdown.find(".selectable[tabindex=" + lastTabIndex + "]").trigger("select");                
                return;
            }
            
            this.autocomplete( el.val() );
        },
        autocomplete : function(val) {
            // does autocomplete if it's enabled
            if (this.options.filterEnabled) {
                // and if item has a text attribute
                if (this.modelList[0] && this.modelList[0].text) {
                    var isAutocompleteData = true;
                    var matches = this.modelList.grep(function(item){
                        return item.text.indexOf(val) > -1;
                    });
                    if(!val || $.trim(val) == "") isAutocompleteData = false;
                    this.dropdown.controller().draw(new $.Model.List(matches), isAutocompleteData);
                    this.dropdown.controller().show();
                }
            }            
        },
        "input focusin": function(el, ev){
            this.focusInputAndShowDropdown(el);
        },
        "input click" : function(el, ev) {
            this.focusInputAndShowDropdown(el);    
        },
        focusInputAndShowDropdown : function(el) {
			if (el[0].tagName == "INPUT" && el.is(":visible")) {
				// select all text
				el[0].focus();
				el[0].select();
				if (!this.dropdown.is(":visible")) 
					this.dropdown.controller().show();
			}   
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
            this.closeDropdownOnBlurTimeout = setTimeout(function(){
                if (self.dropdown.controller().hasFocus) {
                    self.element.trigger("focusin");
                } else {
                    if (self.currentItem.item) {
						// update viewbox with current item html
                        var el = self.dropdown.controller().getElementFor(self.currentItem.item);
                        self.val(self.currentItem.value, el.html());
                    }
                    self.dropdown.controller().hide();  
                }    
            }, 250);
        },
        mouseleave : function(el, ev) {
            if (this.dropdown.is(":visible")) {
                this.find("input[type='text']").focus();
            }
        },        
        val: function(value, html){
            if(!value && value != 0) 
                return this.currentItem.value;
                
            var item = this.modelList.match("value", value)[0];
            if (item && item.enabled) {
				if (!html) {
					var el = this.dropdown.controller().getElementFor(item);
					html = el.html();
				}
                this.currentItem = {
                    "value": item.value,
                    "item": item,
                    "html": html
                };
                var input = this.find("input[type=text]");
                input.val(item.text);
                input.hide();
                var viewbox = this.find(".viewbox");
                viewbox.show();
				if (html) {
					viewbox.html(html);
				}
                
                // higlight the activated item
                this.modelList.each(function(i, item){
                    item.attr("activated", false)
                })
                item.attr("activated", true);                    
                                     
                this.dropdown.controller().draw( this.modelList);                
                
                // bind values to the hidden input
                this.find("input[name='" + this.oldElementName + "']").val(this.currentItem.value);            
                
                this.element.trigger("change", this.currentItem.value);                
            }
         },
        query : function(text) {
            var matches = this.modelList.grep(function(item){
                return item.text.indexOf(text) > -1;
            });
            var results = [];
            for(var i=0;i<matches.length;i++) {
                results.push(matches[i].value)
            }
            return results;
         },
        enable : function(value) {
            var item = this.modelList.match("value", value)[0];
            if (item) {
                item.attr("enabled", true);
                //this.dropdown.controller().draw(this.modelList);
                this.dropdown.controller().enable(item);
            }
        },
        disable : function(value) {
            var item = this.modelList.match("value", value)[0];
            if (item) {
                item.attr("enabled", false);
                item.attr("activated", false);                
                //this.dropdown.controller().draw(this.modelList);
				this.dropdown.controller().disable(item);
            }
        },         
        ".toggle click": function(el, ev){
            this.dropdown.is(":visible") ? this.dropdown.controller().hide() :
                                               this.dropdown.controller().show();  
            this.focusInputAndShowDropdown( this.find("input[type=text]") );
            var viewbox = this.find(".viewbox");
            if (viewbox.is(":visible")) {
				//viewbox.click();
				this._toggleComboboxView(viewbox);
			}
        },
        /*
         * Internet Explorer interprets two fast clicks in a row as one single-click, 
         * followed by one double-click, while the other browsers interpret it as 
         * two single-clicks and a double-click.
         */
        ".toggle dblclick": function(el){
            if ($.browser.msie) {
                this.dropdown.is(":visible") ? this.dropdown.controller().hide() :
                                                   this.dropdown.controller().show(); 
                this.focusInputAndShowDropdown( this.find("input[type=text]") );
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
