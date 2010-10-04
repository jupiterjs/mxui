steal.plugins('jquery/controller', 'jquery/lang/json', 'phui/scrollbar_width', 'phui/keycode')
	.controllers('dropdown','selectable').then(function() {

	/**
	 * 
	 * @param {Object} item
	 */
	$.Controller.extend("Phui.Combobox", {
		defaults: {
			classNames: "phui_combobox_wrapper",
			render: {
				"itemTemplate": function( item , val) {
					if(!val){
						return "<span class='text'>" + item.text + "</span>";
					}else{
						/*
						 * We have to make sure autocomplete hightlight
						 * is case insensitive.
						 */
						var lcVal = val.toLowerCase(),
							lcText = item.text.toLowerCase(),
							pos = lcText.indexOf(lcVal),
							start = lcText.substr(0, pos),
							end = lcText.substr(pos+lcVal.length);
						return "<span class='text'>" +
							start + "<span class='item-match'>"+
							item.text.substr(pos, val.length)+
							"</span>"+end+
							"</span>";
					}
				}
			},
			/*maxHeight: 320,*/
			filterEnabled: true,
			/**
			 * Values to select aren't text but html.  This changes from an input to a 
			 * 'viewbox' element.
			 */
			displayHTML: false,
			selectedClassName: "selected",
			activatedClassName: "activated",
			disabledClassName: "disabled",
			width: null,
			
            /**
			 * Text that displays when no items are in a combo box's drop down.
			 */
			emptyItemsText: "No items available.",
			
			/**
			 * Text that appears if nothing is selected.
			 */
			watermarkText: "Click for options",

			/**
			 * Allows a "No Selection" item to be added to the collection.
			 */
			showNoSelectionOption: false,
            
			/**
			 * When 'showNoSelectionOption' is enabled, you need to give the item a name.
			 */
            noSelectionMsg: "No Selection",
			
			storeSerializedItem: true,
			nonSerializedAttrs: ["id", "activated", "children", "level", "parentId", "forceHidden", "__type"],
			overrideDropdown: false,
			noItemsMsg: "No items available"
		}
	}, {
		/**
		 * Setup re-arranges this input's html
		 * @param {Object} el
		 * @param {Object} options
		 */
		setup: function( el, options ) {
			el = $(el);
			var name = el.attr("name"),
				id = el.attr("id"),
				div = $("<div><div class='toggle'>&nbsp;</div>" + "<div class='viewbox' tabindex='0' style='display:none'/>" + "<div class='container'></div>" + "<input type='hidden' /></div>"),
				container = div.find('.container');
			this.oldElement = el.replaceWith(div).removeAttr("name");

			//probably should not be removing the id
			div.attr("id", this.oldElement.attr("id"));
			this.oldElement.removeAttr("id");
			container.append(this.oldElement);
			var hidden = div.find("input[type=hidden]")
			hidden.attr("name", name);
			hidden.attr("id", id + "_hf");
			this._super(div, options);

			if ( this.options.displayHTML ) {
				//this.oldElement.width("0");  WHY WAS THIS HERE
				this.oldElement.hide();
				this.find(".viewbox").show();
			}
		},
		init: function() {
			this.element.addClass(this.options.classNames);
			if ( this.options.width ) {
				this.element.width(this.options.width);
			}
			// force default max height
			/*if (!this.options.maxHeight ) {
				this.options.maxHeight = this.Class.defaults.maxHeight;
			}*/
			this.currentItem = {
				"value": null
			};
			this.loadData(this.options.items);
			this.resetWatermark();
			//has the value been set already, if it has, we'll throw changes
			this.valueSet = true;
		},
		/**
		 * Set the watermark if there's no text
		 */
		resetWatermark: function() {
			// zero is a valid value
			if (this.val() === null || this.val() === "") {
				this.find("input[type='text']").val(this.options.watermarkText);
			}
		},
		/**
		 * Only remove the text if it's the watermarkText
		 */
		clearWatermark: function() {
			var input = this.find("input[type='text']");
			if ( input.val() == this.options.watermarkText ) {
				input.val("");
			}
		},
		
		/**
		 * Creates and cache's a dropdown controller
		 */
		dropdown: function() {
			if (!this._dropdown ) {
				this._dropdown = $("<div/>").phui_combobox_dropdown($.extend({parentElement : this.element}, this.options)).hide();
				this.element.after(this._dropdown[0]);

				//if there are items, load
				if ( this.options.items ) {
					this.dropdown().controller().draw(this.modelList);
				}
				this.dropdown().hide();
			}

			return this._dropdown;
		},
		loadData: function( items ) {
			if (!items ) {
				return;
			}
			//convert options to something reusable, and set current if available
			var selected = this.makeModelList(items);
			if ( selected ) {
				this.val(selected.value);
			}
		},
		cleanData: function() {
			this.modeList = [];
		},
		/**
		 * Makes modelList and returns the selectedItem
		 * @param {Object} items
		 */
		makeModelList: function( items ) {
			if (!items || items.length === 0 ) {
				this.modelList = [];
				return this.modelList;
			}
			//first flatten
			var data = this.flattenEls(items.slice(0), 0),
				selectedItem, instances = [],
				item;
				
            this.createNoSelectionItem(instances);
							
			for ( var i = 0; i < data.length; i++ ) {
				item = data[i];
				//item.value = parseInt(item.value, 10); CANT DO THIS, VALUES ARENT ALWAYS INTS
				item = $.extend({
					id: i + 1,
					enabled: true,
					children: [],
					level: 0
				}, typeof item == 'string' ? {
					text: item
				} : item);

				// pick inital combobox value
				if ( item.selected ) {
					selectedItem = item;
				}
				instances.push(item);
			}
			this.modelList = instances;
			return selectedItem;
		},
        /**
         * Adds the "No Selection" entry to the model list
         * @param {Array} model list
        */
        createNoSelectionItem:function(list)
        {
            var noSelectionText = this.options.noSelectionMsg;
            var noSelectionEnabled = this.options.showNoSelectionOption;

            var item = {
				id: 0,
				enabled: true,
				children: [],
				level: 0,
                value: null,
                text: noSelectionText,
                forceHidden: !noSelectionEnabled
			};

            //add the item as the first always
            if(!list || list.length > 0)
            {
                var newList = [];
                newList.push(item);

                $.each(list, function(item)
                {
                    newList.push(item);
                });

                list = newList;
            }
            else
            {
                list.push(item);
            }
        },		
		/**
		 * Flattens a list of nested object
		 * @param {Object} list
		 * @param {Object} currentLevel
		 * @param {Object} items
		 */
		flattenEls: function( list, currentLevel, items ) {
			items = items || [];
			currentLevel = currentLevel || 0;
			if (!list || !list.length ) {
				return;
			}
			var item = list.shift(),
				children = item.children;

			item.level = currentLevel;
			items.push(item);

			this.flattenEls(children, currentLevel + 1, items);
			this.flattenEls(list, currentLevel, items);
			return items;
		},
		".viewbox focusin": function( el, ev ) {
			this._toggleComboboxView(el);
		},
		_toggleComboboxView: function( el ) {
			el.hide();
			var input = this.find("input[type='text']");
			input.show();
			input[0].focus();
			input[0].select();
		},
		showDropdown : function(callback){
			this.clearWatermark()
			this.dropdown().controller().show(callback);
		},
		showDropdownIfHidden : function(callback){
			if (!this.dropdown().is(":visible") ) {
				this.showDropdown(callback);
				//this.dropdown().children("ul").controller().showSelected();
			}else{
				callback && callback();
			}
		},
		"input keyup": function( el, ev ) {
			var key = $.keyname(ev),
				selectable = this.dropdown().children("ul").controller();
			
			switch($.keyname(ev)){
				
				case "escape" : 
					// close dropdown 
					this.dropdown().controller().hide();
					return false;
				
				case  "down" : 
					// select the first element
					this.showDropdownIfHidden(function(){
						selectable.selectNext();
					});
					
					return;
				
				case "up" : 
					this.showDropdownIfHidden(function(){
						selectable.selectPrev();
					});
					
					return;
				case "enter" : 
					//get the selected element
					if(this.dropdown().is(":visible")){
						var selected = this.dropdown().children("ul").controller().selected();
						this.dropdown().controller().selectElement(selected);
					}else{
						this.showDropdown()
					}
					
					//this.find('input:visible')[0].select();
					return;
				default :
					if(this.options.filterEnabled){
						this.autocomplete(el.val());
					}
					
				
			}
		},
		/**
		 * removes messages
		 * @param {Object} val
		 */
		autocomplete: function( val ) {
			// do nothing if we don't have text based list
			if (!this.modelList || !this.modelList[0] || !this.modelList[0].text) {
				return;
			}
			
			var isAutocompleteData = true,
				
			noItemsMsg = this.dropdown().find('.noItemsMsg'), 
                matches = this.modelList;
				
            //skip if the value is null or empty string
            if(val && val != "")
            {
			    // list of matches to val & no "No Selection"
			    matches = $.grep(this.modelList, function(item) 
                {
					/*
					 * 1. searches should be case insensitive.
					 * 2. searches should start with the first letter, 
					 * not look for anything in the string
					 * so typing B should only bring up something that starts with B.
					 */
					var re = new RegExp( '^' + val, 'i' );
					return re.test(item.text) && item.value;
			    });
            }
			
			this.dropdown().controller().draw(matches, val);
			
			this.showDropdownIfHidden();
			
			if (!matches.length ) {
				if (!noItemsMsg.length ) {
					this.dropdown().append("<div class='noItemsMsg'>" + this.options.noItemsMsg + "</div>");
				}
			} else {
				if ( noItemsMsg.length ) {
					noItemsMsg.remove();
				}
			}
			
			
		},
		// this is necessary because we want to be able
		// to open the dropdown by clicking the input
		// after an item was selected which means
		// input has focus and dropdown is hidden
		// input focusin doesn't work in this case 
		"input click": function( el, ev ) {
			this.focusInputAndShowDropdown(el);
		},
		"input focusin": function( el, ev ) {
			this.focusInputAndShowDropdown(el);
		},

		focusInputAndShowDropdown: function( el ) {

			// select all text
			if(el.is(":visible")){ // IE won't let you focus an invisible input
				el[0].focus();
			}
			if (!this.dropdown().is(":visible") ) {
				
				if ( this.options.overrideDropdown ) {
					el.trigger("show:dropdown", this);
				} else {
					//activate current item
					if(this.currentItem){
						var current = this.dropdown().controller()._getEl(this.currentItem.item);
						if(current.length){
							this.dropdown().controller().list.controller().selected(current, false);
						}
					}
					this.showDropdown();
				}
				setTimeout(function() {
					el[0].select();
				});
			}
			
		},
		
		modelListMatches: function( attr, value ) {
			return $.grep(this.modelList, function( item ) {
				return item[attr] == value;
			});
		},
		_setViewboxHtmlAndShow: function( html ) {

			if ( this.options.displayHTML ) {
				this.find("input[type=text]").hide();
				this.find(".viewbox").show().html(html || "");

			}
		},
		".toggle click": function( el, ev ) {
			if ( this.dropdown().is(":visible") ) {
				this.dropdown().controller().hide();
			} else {
				this.focusInputAndShowDropdown(this.find("input[type=text]"));
			}

			var viewbox = this.find(".viewbox");
			if ( viewbox.is(":visible") ) {
				this._toggleComboboxView(viewbox);
			}
		},
		/*
         * Trick to make dropdown close when combobox looses focus
         * Bug: input looses focus on scroll bar click in IE, Chrome and Safari
         * Fix inspired in:
         * http://stackoverflow.com/questions/2284541/form-input-loses-focus-on-scroll-bar-click-in-ie
         */
		focusin: function( el, ev ) {
			// trick to make dropdown close when combobox looses focus            
			clearTimeout(this.closeDropdownOnBlurTimeout);
		},
		/**
		 * If someone clicks somewhere else, lets close ourselves
		 * @param {Object} el
		 * @param {Object} ev
		 */
		focusout: function( el, ev ) {
			if ( this.dropdown().is(":hidden") ) {
				return;
			}
			// trick to make dropdown close when combobox looses focus
			this.closeDropdownOnBlurTimeout = setTimeout(this.callback('blurred'), 100);
		},
		blurred : function(){
			//set current item as content / value
			if ( this.currentItem.item ) {
				// update viewbox with current item html
				this._setViewboxHtmlAndShow(this.options.render.itemTemplate(this.currentItem.item));
			}
			this.dropdown().controller().hide();
		},
		/*
	     * Internet Explorer interprets two fast clicks in a row as one single-click, 
	     * followed by one double-click, while the other browsers interpret it as 
	     * two single-clicks and a double-click.
	     * And, IE has a very long time that it will count 2 clicks as a dblclick.
	     * Taken together, the user might click the toggle twice and not really be dblclicking.
	     */
		".toggle dblclick": function( el ) {
			if ( $.browser.msie ) {
				if(this.dropdown().is(":visible")){
					this.dropdown().controller().hide()
				}else{
					this.showDropdown()
				}
				this.focusInputAndShowDropdown(this.find("input[type=text]"));
			}
		},
		destroy: function() {
			this.dropdown().remove();
			this._dropdown = null;
			this.modelList = null;
			this.oldElementName = null;
			var me = this.element; //save a reference
			this._super(); //unbind everything
			me.replaceWith(this.oldElement); //replace with old
			this.oldElement = null; //make sure we can't touch old            
		},


		/********************************
		 *		Combobox Public API		*
		 ********************************/
		// returns the text value of the currently selected item
		textVal: function() {
			return this.find("input[type=text]").val();
		},
		/**
		 * @param {String} value the new combobox value
		 * @return {Object} if no input parameter returns the current item value
		 * Sets combobox value. This does not simulate a user click, which means
		 * the selected item won't get highlighted on the dropdown.
		 * For that use 'select'
		 */
		val: function( value ) {
			if ( value === undefined ) {
				return this.currentItem.value;
			}

			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				var html = this.options.render.itemTemplate(item);
				if ( this.currentItem.item ) {
					this.currentItem.item.activated = false;
				}
				this.currentItem = {
					"value": item.value,
					"item": item,
					"html": html
				};
				item.activated = true;
                
				// value can ve null (No Select item) and in that
				// case input box must be empty
				if(item.value) {
				    this.oldElement[0].value = item.text;
                } else {
				    this.oldElement[0].value = "";
                }

				if ( this.options.displayHTML ) {
					this._setViewboxHtmlAndShow(html);
				}

				// bind values to the hidden input
				if ( this.options.storeSerializedItem ) {
					// (clone current item so we can remove fields  
					// that are not relevant for the postback)
					var clone = $.extend({}, this.currentItem.item);
					for ( var field in clone ) {
						if ( $.inArray(field, this.options.nonSerializedAttrs) > -1 ) {
							delete clone[field];
						}
					}
					this.find("input[type=hidden]")[0].value = $.toJSON(clone);
				} else { // just store the value
					this.find("input[type=hidden]")[0].value = this.currentItem.value;
				}

				//if we have a dropdown ... update it
				if ( this._dropdown ) {
					this.dropdown().controller().draw(this.modelList);
				}

	            if (this.valueSet) {
					this.element.trigger("change", this.currentItem.value);
				}
			}
		},
		// prevent IE's default change event
		'input change': function(el, ev){
			ev.stopImmediatePropagation();
		},
		/**
		 * @param {String} value the new combobox value
		 * Simulates the user clicking on an item.
		 */
		selectItem: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				item.forceHidden = false;
				// delegate item selection on dropdown				
				this.dropdown().controller().selectItem(item);
			}
		},
		/**
		 * Clears combobox current selection.
		 */
		clearSelection: function() {
			if ( this.currentItem.item ) {
				this.find("input[type='text']").val("");
				// let dropdown handle element style cleaning
				this.dropdown().controller().clearSelection(this.currentItem.item);
				// delete current element references
				this.currentItem = {
					"value": null,
					"item": null,
					"html": null
				};
			}
		},
		/**
		 * @param {String} value value of the item to be returned.
		 * @return {Object} returns the item with the value passed as a parameter.	
		 * Returns the item with the value passed as a parameter.
		 */
		getItem: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				return item;
			}
			return null;
		},
		/**
		 * @return {Array} returns the list of items loaded into combobox	
		 * Returns the list of items loaded into combobox.
		 */
		getItems: function() {
			return this.modelList || [];
		},
		/**
		 * @param {Function} callback to be triggered after items are loaded into combobox	
		 * Forces the ajax combobox to fetch data from the server. 
		 * This method should probably be under phui/combobox/ajax.
		 */
		populateItems: function( callback ) {
			this.find("input[type='text']").trigger("show:dropdown", [this, callback]);
		},
		/**
		 * @param {String} text query string to serve as filter for autocomplete.
		 * @return {Array} returns the list of filtered items. 	
		 * API to return filtered data from combobox's autocomplete. 
		 */
		query: function( text ) {
			var matches = $.grep(this.modelList, function( item ) {
				return item.text.indexOf(text) > -1;
			});
			var results = [];
			for ( var i = 0; i < matches.length; i++ ) {
				results.push(matches[i].value);
			}
			return results;
		},
         /**
		 * @param {String} value = value of the item to set.
		 * Shows/Hides "No Selection" option in the drop down list.
		 */
         enableNoSelection: function(value)
         {
            this.options.showNoSelectionOption = value;

            //AJAX scenario might not have the list yet so we wouldn't need to add or remove it then
            if(this.modelList && this.modelList.length > 0)
            {
                if(value)
                {
                    this.showItem(null);
                }
                else
                {
                    this.hideItem(null);
                }
            }
         },		
		/**
		 * @param {String} value value of the item that will be made visible.
		 * Show an item.
		 */
		showItem: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				// delegate show/hide items on dropdown_controller				
				this.dropdown().controller().showItem(item);
				item.forceHidden = false;
			}
		},
		/**
		 * @param {String} value value of the item that will be hidden.
		 * Hides an item.
		 */
		hideItem: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				if ( this.currentItem.item && item.value === this.currentItem.item.value ) {
					this.clearSelection();
				}
				// delegate show/hide items on dropdown_controller					
				this.dropdown().controller().hideItem(item);
				item.forceHidden = true;
			}
		},
		enable: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				item.enabled = true;
				this.dropdown().controller().enable(item);
			}
		},
		disable: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				item.enabled = false;
				item.activated = false;
				this.dropdown().controller().disable(item);
			}
		}
	});


});