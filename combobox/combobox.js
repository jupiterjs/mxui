steal.plugins('jquery/controller',
              'phui/positionable',
              'phui/selectable',
			  'phui/scrollbar_width')
     .controllers('dropdown').then(function(){
         
        
    $.Controller.extend("Phui.Combobox", {
        defaults: {
            render: {
                "itemTemplate" : function(item) {
                    return "<span class='text'>" +  item.text + "</span>";
                }
            },
            maxHeight: null,
            filterEnabled : true,
			displayHTML : false,
            selectedClassName: "selected",
            activatedClassName: "activated",
            disabledClassName: "disabled"
        }
    }, {
		/**
		 * Setup re-arranges this input's html
		 * @param {Object} el
		 * @param {Object} options
		 */
        setup : function(el, options) {
            var el = $(el),
				name = el.attr("name"),
				div = $("<div><div class='toggle'>&nbsp;</div>"+
				"<div class='viewbox' tabindex='0' style='display:none'/>"+
				"<div class='container'></div>"+
				"<input type='hidden' name='"+name+"'/></div>"),
				container = div.find('.container');
            this.oldElement = el.replaceWith(div).removeAttr("name");
			
			
			//probably should not be removing the id
            div.attr("id", this.oldElement.attr("id"));
            this.oldElement.removeAttr("id");
            container.append(this.oldElement);
            this._super(div, options);    
			
			if (this.options.displayHTML) {
				this.oldElement.hide();
				this.find(".viewbox").show();
			}
        },
        init: function(){

            this.currentItem = { "value": -1 };
            
			//convert options to something reusable, and set current if available
			var selected = this.makeModelList(this.options.items);
			if(selected){
				this.val(selected.value)
			}
			//has the value been set already, if it has, we'll throw changes
			this.valueSet = true;
        },
		dropdown : function(){
			if(!this._dropdown){
				this._dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options ).hide();
	            document.body.appendChild(this._dropdown[0]);  
				
	 			// position the dropdown bellow the combobox input
				this._dropdown.phui_positionable({
					my: 'left top',
					at: 'left bottom',
					collision: 'none none'
				}).trigger("move", this.element);			 
	            this._dropdown.controller().style();
				
				//if there are items, load
				if (this.options.items) {
					this.dropdown().controller().draw( this.modelList );	
				} 
			}
			
			return this._dropdown
		},
		/**
		 * Makes modelList and returns the selectedItem
		 * @param {Object} items
		 */
		makeModelList : function(items){
			if(!items){
				return;
			}
			//first flatten
			var data = this.flattenEls(items, 0),
				selectedItem,
				instances = [],
				item;
			for (var i = 0; i < data.length; i++) {
				item = data[i];
				
				item = $.extend(
					{id: i + 1, 
						enabled: true, 
						children: [], 
						level: 0 }, 
					typeof item == 'string' ? {text: item} : item )
				
				// pick inital combobox value
				if (item.selected) {
					selectedItem = item;
				}
				instances.push(item);
            }
			this.modelList =  instances ;
			return selectedItem;
		},
		/**
		 * Flattens a list of nested object
		 * @param {Object} list
		 * @param {Object} currentLevel
		 * @param {Object} items
		 */
        flattenEls : function( list, currentLevel, items ){
           items = items || [];
           currentLevel = currentLevel || 0;
           if ( !list || !list.length ) {
               return;
           }
           var item = list.shift(),
           children = item.children;

           item.level = currentLevel;
           items.push( item );

           this.flattenEls( children, currentLevel + 1, items );
           this.flattenEls( list, currentLevel, items );
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
                this.dropdown().controller().hide();   
                return false;             
            }
            
            // if down key is clicked, navigate to first item
            if (key == "down") {
                this.dropdown().controller().hasFocus = true;
                var first = this.dropdown()
                                .children("ul")
                                .controller()
                                .getFirst();
                $(first).trigger("select");
                return;
            }
            
            // if up key is clicked, navigate to last item            
            if (key == "up") {
                this.dropdown().controller().hasFocus = true;
                var last = this.dropdown()
                               .children("ul")
                               .controller()
                               .getLast();
                $(last).trigger("select");
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
                    var matches = $.grep( this.modelList,function(item){
                        return item.text.indexOf(val) > -1;
                    });
                    if(!val || $.trim(val) == "") isAutocompleteData = false;
                    this.dropdown().controller().draw(matches, isAutocompleteData);
                    if ( !this.dropdown().is(":visible") ) {
						this.dropdown().controller().show();
					}
                }
            }            
        },
        "input focusin": function( el, ev  ) {				
            this.focusInputAndShowDropdown( el );		
        },
		"input click": function(el, ev) {
            this.focusInputAndShowDropdown( el );			
		},
        focusInputAndShowDropdown : function( el ) {
            if ( el[0].tagName.toUpperCase() == "INPUT" 
			         && el.is( ":visible" ) ) {
                // select all text
                el[0].focus();
                setTimeout(function(){
                    el[0].select();
                });
                if ( !this.dropdown().is( ":visible" ) 
				        && this.dropdown().controller().canOpen ) {
                    this.dropdown().controller().show();
                    el.trigger( "show:dropdown", this );
                }
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
        focusout: function(el, ev) {
            // trick to make dropdown close when combobox looses focus
            var self = this;
            this.closeDropdownOnBlurTimeout = setTimeout(function(){
                if ( self.dropdown().controller().hasFocus ) {				
                    self.element.trigger( "focusin" );					
                } else {
                    if ( self.currentItem.item ) {
                        // update viewbox with current item html
						self._setViewboxHtmlAndShow( self.options.render.itemTemplate(self.currentItem.item) );
                    }			
                    self.dropdown().controller().hide();  
                }    
            }, 250);
        },
        mouseleave : function(el, ev) {
            if (this.dropdown().is( ":visible" ) ) {
                this.find( "input[type='text']" ).focus();
            }
        },
		modelListMatches : function(attr, value){
			return $.grep(this.modelList, function(item){
				return item[attr] == value;
			})	
		},
        val: function( value ){
            if(value === undefined) {
				return this.currentItem.value;
			}  
            var item = this.modelListMatches("value", value)[0];
            if (item) {

                var html = this.options.render.itemTemplate(item);
				this.currentItem.item && (this.currentItem.item.activated = false)
                this.currentItem = {
                    "value": item.value,
                    "item": item,
                    "html": html
                };
				item.activated = true;
                this.oldElement[0].value = item.text;
				
				if ( this.options.displayHTML ) {
				    this._setViewboxHtmlAndShow( html );
				}
                
				
                // bind values to the hidden input
                this.find("input[type=hidden]")[0].value =(this.currentItem.value);				
				
				if (this.valueSet) {
					this.element.trigger("change", this.currentItem.value);
				}                           
                //if we have a dropdown ... update it
				if(this._dropdown){
					this.dropdown().controller().draw( this.modelList);
				}                  
                                
            }
         },
		 _setViewboxHtmlAndShow: function( html ) {
			
		    if (this.options.displayHTML) {
				this.find("input[type=text]").hide(),
				this.find( ".viewbox" ).show().html( html||"" );
			} 		 	
		 },
		 
         query : function( text ) {
            var matches = $.grep(this.modelList, function( item ){
                return item.text.indexOf( text ) > -1;
            } );
            var results = [];
            for(var i=0;i<matches.length;i++) {
                results.push( matches[i].value );
            }
            return results;
         },
        enable : function(value) {
            var item = this.modelListMatches("value", value)[0];
            if (item) {
                item.enabled=  true;
                this.dropdown().controller().enable( item );
            }
        },
        disable : function(value) {
            var item = this.modelListMatches("value", value)[0];
            if (item) {
                item.enabled= false;
                item.activated= false;                
                this.dropdown().controller().disable( item );
            }
        },         
        ".toggle click": function(el, ev) {
			if( this.dropdown().is( ":visible" ) ) {
				this.dropdown().controller().hide();
			}  else {			
	            this.focusInputAndShowDropdown( this.find( "input[type=text]" ) );
			}
            
			var viewbox = this.find( ".viewbox" );
            if ( viewbox.is( ":visible" ) ) {
                this._toggleComboboxView( viewbox );
            }
        },
        /*
         * Internet Explorer interprets two fast clicks in a row as one single-click, 
         * followed by one double-click, while the other browsers interpret it as 
         * two single-clicks and a double-click.
         */
        ".toggle dblclick": function(el){
            if ($.browser.msie) {
                this.dropdown().is(":visible") ? this.dropdown().controller().hide() :
                                                   this.dropdown().controller().show(); 
                this.focusInputAndShowDropdown( this.find("input[type=text]") );
            }
           },            
        destroy: function(){
            this.dropdown().remove();
            this._dropdown = null;
            this.modelList = null;
            this.oldElementName = null;            
               var me = this.element; //save a reference
               this._super()  //unbind everything
               me.replaceWith(this.oldElement); //replace with old
               this.oldElement = null;  //make sure we can't touch old            
        }
        
    });
    
    
});
