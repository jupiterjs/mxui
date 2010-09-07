steal.plugins('jquery/controller',
			  'jquery/lang/json',
			  'phui/positionable', 
			  'phui/selectable', 
			  'phui/scrollbar_width')
	 .controllers('dropdown')
	 .then(function() {


	$.Controller.extend("Phui.Combobox", {
		defaults: {
			classNames: "phui_combobox_wrapper",
			render: {
				"itemTemplate": function( item ) {
					return "<span class='text'>" + item.text + "</span>";
				}
			},
			maxHeight: null,
			filterEnabled: true,
			displayHTML: false,
			selectedClassName: "selected",
			activatedClassName: "activated",
			disabledClassName: "disabled",
			width: null,
			emptyItemsText: "No items in the combobox",
			watermarkText: "Click for options",
			storeSerializedItem: true,
			nonSerializedAttrs: ["id", "activated", "children", "level", "parentId", "forceHidden"]
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
					div = $("<div><div class='toggle'>&nbsp;</div>" + "<div class='viewbox' tabindex='0' style='display:none'/>" + 
							"<div class='container'></div>" + "<input type='hidden' /></div>"),
					container = div.find('.container');
				this.oldElement = el.replaceWith(div).removeAttr("name"); 
	
				//probably should not be removing the id
				div.attr("id", this.oldElement.attr("id"));
				this.oldElement.removeAttr("id");
				container.append(this.oldElement);
				var hidden = div.find("input[type=hidden]")
	            hidden.attr("name", name + "$hf");
	            hidden.attr("id", id + "$hf");
				this._super(div, options);
	
				if ( this.options.displayHTML ) {
					this.oldElement.hide();
					this.find(".viewbox").show();
				}
			},
		init: function() {
			this.element.addClass( this.options.classNames );
			if ( this.options.width ) {
				this.element.width(this.options.width);
			}
			this.currentItem = {
				"value": null
			};
			this.loadData(this.options.items);
			this.resetWatermark();
			//has the value been set already, if it has, we'll throw changes
			this.valueSet = true;
		},
		resetWatermark: function() {
			if (!this.val() ) {
				this.find("input[type='text']").val(this.options.watermarkText);
			}
		},
		clearWatermark: function() {
			var input = this.find("input[type='text']");
			if ( input.val() == this.options.watermarkText ) {
				input.val("");
			}
		},
		dropdown: function() {
			if (!this._dropdown ) {
				this._dropdown = $("<div/>").phui_combobox_dropdown(this.element, this.options).hide();
				document.body.appendChild(this._dropdown[0]);

				// position the dropdown bellow the combobox input
				this._dropdown.phui_positionable({
					my: 'left top',
					at: 'left bottom',
					collision: 'none none'
	            }).css("opacity", 0).show().trigger("move", this.element).hide().css("opacity", 1);
				this._dropdown.controller().style();

				//if there are items, load
				if ( this.options.items ) {
					this.dropdown().controller().draw(this.modelList);
				}
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
		".viewbox click": function( el, ev ) {
			this._toggleComboboxView(el);
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
		"input keyup": function( el, ev ) {
			var key = $.keyname(ev);

			// close dropdown on escape
			if ( key == "escape" ) {
				this.dropdown().controller().hide();
				return false;
			}

			// if down key is clicked, navigate to first item
			if ( key == "down" ) {
				this.dropdown().controller().hasFocus = true;
				var first = this.dropdown().children("ul").controller().getFirst();
				$(first).trigger("select");
				return;
			}

			// if up key is clicked, navigate to last item            
			if ( key == "up" ) {
				this.dropdown().controller().hasFocus = true;
				var last = this.dropdown().children("ul").controller().getLast();
				$(last).trigger("select");
				return;
			}

			this.autocomplete(el.val());
		},
		autocomplete: function( val ) {
			// does autocomplete if it's enabled
			if ( this.options.filterEnabled ) {
				// and if item has a text attribute
				if ( this.modelList && this.modelList[0] && this.modelList[0].text ) {
					var isAutocompleteData = true;
					var matches = $.grep(this.modelList, function( item ) {
						return item.text.indexOf(val) > -1;
					});
					if (!val || $.trim(val) === "" ) {
						isAutocompleteData = false;
					}
					this.dropdown().controller().draw(matches, isAutocompleteData);
					if (!this.dropdown().is(":visible") ) {
						this.dropdown().controller().show();
					}
				}
			}
		},
		"input focusin": function( el, ev ) {
			this.focusInputAndShowDropdown(el);
		},
		"input click": function( el, ev ) {
			this.focusInputAndShowDropdown(el);
		},
		focusInputAndShowDropdown: function( el ) {
			if ( el[0].tagName.toUpperCase() == "INPUT" && el.is(":visible") ) {
				// select all text
				el[0].focus();
				setTimeout(function() {
					el[0].select();
				});
				if (!this.dropdown().is(":visible") && this.dropdown().controller().canOpen ) {
					this.dropdown().controller().show();
					el.trigger("show:dropdown", this);
				}
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
			if ( this.closeDropdownOnBlurTimeout ) {
				clearTimeout(this.closeDropdownOnBlurTimeout);
			}
		},
		focusout: function( el, ev ) {
			if ( this.dropdown().is(":hidden") ) {
				return;
			}
			// trick to make dropdown close when combobox looses focus
			var self = this;
			this.closeDropdownOnBlurTimeout = setTimeout(function() {
				if ( self.dropdown().controller().hasFocus ) {
					self.element.trigger("focusin");
				} else {
					if ( self.currentItem.item ) {
						// update viewbox with current item html
						self._setViewboxHtmlAndShow(self.options.render.itemTemplate(self.currentItem.item));
					}
					self.dropdown().controller().hide();
				}
			}, 250);
		},
		mouseleave: function( el, ev ) {
			if ( this.dropdown().is(":visible") ) {
				this.find("input[type='text']").focus();
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
	     * Internet Explorer interprets two fast clicks in a row as one single-click, 
	     * followed by one double-click, while the other browsers interpret it as 
	     * two single-clicks and a double-click.
	     */
		".toggle dblclick": function( el ) {
			if ( $.browser.msie ) {
				this.dropdown().is(":visible") ? this.dropdown().controller().hide() : this.dropdown().controller().show();
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
				this.oldElement[0].value = item.text;

				if ( this.options.displayHTML ) {
					this._setViewboxHtmlAndShow(html);
				}

             	// bind values to the hidden input
             	if (this.options.storeSerializedItem) {
                 	// (clone current item so we can remove fields  
                 	// that are not relevant for the postback)
                 	var clone = $.extend({}, this.currentItem.item);
                 	for (var field in clone) {
                     	if ($.inArray(field, this.options.nonSerializedAttrs) > -1) {
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

				if ( this.valueSet ) {
					this.element.trigger("change", this.currentItem.value);
				}
			}
		},
		/**
		 * @param {String} value the new combobox value
		 * Simulates the user clicking on an item.
		 */
		select: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				item.forceHidden = false;
				// delegate item selection on dropdown				
				this.dropdown().controller().select(item);
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
			if (item) {
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
	 	 * @param {String} value value of the item that will be made visible.
		 * Show an item.
		 */				
		showItem: function( value ) {
			var item = this.modelListMatches("value", value)[0];
			if ( item ) {
				// delegate show/hide items on dropdown_controller				
				this.dropdown().controller().showItem( item );
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
				if ( this.currentItem.item && 
						item.value === this.currentItem.item.value ) {
					this.clearSelection();
				}
				// delegate show/hide items on dropdown_controller					
				this.dropdown().controller().hideItem( item );
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