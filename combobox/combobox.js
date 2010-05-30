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
            showNested: false,
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
            this.element.find("input").wrap("<div class='container' />")
            this.currentValue = "-1";
            this.hasFocus = false;
            
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
            // flatten input data structure (which may be nested)
            var flattenEls = this.flattenEls(items, 0);
            
            // create model instances from items
            var selectedItem, instances = [];
            for (var i = 0; i < flattenEls.length; i++) {
                var item = flattenEls[i];
                
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
                    // _flattenEls adds level
                    //if(item.level === undefined) item.level = 0;
                    if (item.children === undefined) 
                        item.children = [];
                }
                
                // pick inital combobox value
                if (item.selected) 
                    selectedItem = item;
                
                // wrap input data item within a combobox.models.item instance so we 
                // can leverage model helper functions in the code later 
                instances.push(item);
            }

            // this is where we store the loaded data in the controller
            instances = Combobox.Models.Item.wrapMany(instances);
            this.modelList = new $.Model.List(instances);
            
            // render the dropdown and set an initial value for combobox
            this.dropdown.controller().draw(this.modelList, this.options.showNested);
            if (selectedItem) 
                this.val(selectedItem.value);
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
        "input keyup": function(el, ev){
            var key = $.keyname(ev)
            
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
			// does autocomplete if it's enabled and item has a text attribute
            if (this.options.filterEnabled && this.modelList[0].text) {
                var matches = this.modelList.grep(function(item){
                    return item.text.indexOf(val) > -1;
                });
                this.dropdown.controller().draw(new $.Model.List(matches), this.options.showNested);
                this.dropdown.controller().show();
            }            
        },
        "input focusin": function(el, ev){
            this.focusInputAndShowDropdown(el);
        },
        "input click" : function(el, ev) {
            this.focusInputAndShowDropdown(el);    
        },
        focusInputAndShowDropdown : function(el) {
            // select all text
            el[0].focus();
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
                this.find("input[type=text]").focus();
            }
        },        
        val: function(value){
            if(!value && value != 0) 
                return this.currentValue;
                
            var item = this.modelList.match("value", value)[0];
            if (item && item.enabled) {
                this.currentValue = item.value;
                this.find("input[type=text]").val(item.text);
                
                // higlight the activated item
                this.modelList.each(function(i, item){
                    item.attr("activated", false)
                })
                item.attr("activated", true);                    
                                     
                this.dropdown.controller().draw( this.modelList, this.options.showNested );                
                
                // bind values to the hidden input
                this.find("input[name='" + this.oldElementName + "']").val(this.currentValue);            
                
                this.element.trigger("change", this.currentValue);                
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
                this.dropdown.controller().draw(this.modelList, this.options.showNested);
            }
        },
        disable : function(value) {
            var item = this.modelList.match("value", value)[0];
            if (item) {
                item.attr("enabled", false);
                item.attr("activated", false);                
                this.dropdown.controller().draw(this.modelList, this.options.showNested);
            }
        },         
        ".toggle click": function(el, ev){
			this.dropdown.is(":visible") ? this.dropdown.controller().hide() :
			                                   this.dropdown.controller().show();  
            this.focusInputAndShowDropdown( this.find("input[type=text]") );
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
