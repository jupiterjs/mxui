steal.then(function() {


	$.Controller.extend("Phui.Combobox.DropdownController", {}, {
		init: function( el, combobox, options ) {
			this.combobox = combobox;
			this.options = options;
			this.hasFocus = false;
			this.canOpen = true;
			this.isFirstPass = true;
			var comboboxId = combobox.attr('id');
			if ( comboboxId ) {
				this.element.attr('id', comboboxId + "_dropdown");
			}
		},
		style: function() {
			this.element.css("width", this.combobox.width());
			if ( this.options.maxHeight ) {
				var h = this.element.height(),
					maxh = this.options.maxHeight;
				this.element.css({
					"height": h > maxh ? maxh : h,
					"overflow": "auto"
				});
			}

			if ( this.isFirstPass ) {
				// apply custom style to item
				var self = this;
				this.find(".item").each(function( i, el ) {
					el = $(el);
					var item = this._getModel(el);
					el.removeClass(self.options.activatedClassName);
					if ( item.attr("activated") ) {
						el.addClass(self.options.activatedClassName);
					}
				});
			}

			// adjust dropdown height so it can fit in the page
			// even if the window is small
			//this.adjustHeightToFitWindow();     
			this.fixOverflowBugInIE7();
		},
/* Most browsers when overflowing an element put the vertical overflow
	 * scroll bar on the outside of the element
	 * IE6 and IE7 put it on the inside causing horizontal overflow if the
	 * contained elements have 100% width as is the case with the <ul> element
	 * contained in the dropdown <div>
	 * to fix this we simply set the <ul> element to the container width
	 * without scrollbar - this.element[0].clientWidth.
	 */
		fixOverflowBugInIE7: function() {
			// TODO: use feature detection instead of browser detection
			if ( $.browser.msie && navigator.appVersion.indexOf('MSIE 7.') != -1 ) {
				var ul = this.find("ul.phui_selectable");
				ul.width(this.element[0].clientWidth);
			}
		},
		draw: function( modelList, isAutocompleteData ) {

			if ( this.isFirstPass ) {
				var html;
				if (!modelList.length ) {
					html = "<li>No items in the combobox</li>";
				} else {
					html = this._makeEl(modelList.slice(0), 0);
				}

				// if starts with <li> wrap under <ul>
				// so selectable as something to attach to
				if ( html.indexOf("<li") === 0 ) {
					html = "<ul>" + html + "</ul>";
				}
				// position the dropdown bellow the combobox input
				this.element.trigger("move", this.combobox);

				this.element.html(html);

				// add up/down key navigation
				this.element.children("ul").phui_selectable({
					selectedClassName: "selected",
					activatedClassName: "activated"
				});			
			}

			var modelHash = {};
			for ( var i = 0; i < modelList.length; i++ ) {
				var inst = modelList[i];
				modelHash[inst.identity ? inst.identity() : "dropdown_" + inst.id] = inst;
			}

			// hides the elements that do not match the item list
			var itemEls = this.find(".item");
			for ( var j = 0; j < itemEls.length; j++ ) {
				var el = $(itemEls[j]),
					identity = el[0].className.match(/(dropdown_\d*)/)[0],
					item = identity && modelHash[identity];
				
				!item || item.forceHidden ?	el.hide() : el.show();
			}
			
			this.modelHash = modelHash;
			this.isFirstPass = false;

			this.style();
		},
		_getModel: function( el ) {
			return this.modelHash[el[0].className.match(/(dropdown_\d*)/)[0]];
		},
		_getEl: function( item ) {
			return this.find(".dropdown_" + item.id);
		},
		_makeHtmlForAutocompleteData: function( list ) {
			var html = [];
			// we assume autocomplete data is a linear list
			// with no nesting information
			for ( var i = 0; i < list.length; i++ ) {
				var item = list[i];
				html.push("<li>" + this.drawItemHtml(item, true) + "</li>");
			}
			return html.join(" ");
		},
		/**
		 * returns the html for a list
		 * @param {Object} list
		 * @param {Object} currentLevel
		 * @param {Object} initialLevel
		 */
		_makeEl: function( list, currentLevel, initialLevel ) {
			if (!list.length ) {
				return [];
			}
			var level = 0,
				html = [];
			for ( var i = 0; i < list.length; i++ ) {
				var item = list[i];
				if ( item.level > level ) {
					html.push("<ul>");
				}
				html.push("<li>", this.drawItemHtml(item), "</li>");
				if ( item.level < level ) {
					html.push("</ul>");
				}
				level = item.level;
			}
			return html.join("");
		},
		drawItemHtml: function( item, isAutocompleteData ) {
			return ["<span tabindex='0' class='item ", item.identity ? item.identity() : "dropdown_" + item.id, " selectable ", item.enabled ? "" : this.options.disabledClassName, "' >",

			isAutocompleteData ? "" : "<span style='float:left;margin-left:", item.level * 20, "px'>&nbsp;</span>", this.options.render.itemTemplate(item),

			"</span>"].join("");
		},
		keyup: function( el, ev ) {
			var key = $.keyname(ev);

			// close dropdown on escape
			if ( key == "escape" ) {
				this.hide();
			}
		},
		".selectable activate": function( el, ev ) {
			if (!el.hasClass(this.options.disabledClassName) ) {
				var item = this._getModel(el);
				if ( item ) {
					// set combobox new value
					this.combobox.controller().val(item.value, el.html());

					// then hide dropdown            
					this.element.hide();

					// trick to make dropdown close when combobox looses focus            
					this.hasFocus = false;
				}
			} else {
				el.removeClass(this.options.activatedClassName);
			}
		},
		mouseenter: function( el, ev ) {
			// trick to make dropdown close when combobox looses focus            
			this.hasFocus = true;
		},
		"li mouseleave": function( el, ev ) {
			// we don't want mouseleave events on elements
			// inside dropdown to make dropdown.hasFocus = false
			ev.stopPropagation();
		},
		mouseleave: function( el, ev ) {
			// trick to make dropdown close when combobox looses focus  
			this.hasFocus = false;
			this.canOpen = false;
			//this.combobox.find("input[type=text]").focus();
			this.canOpen = true;
		},
		windowresize: function( el, ev ) {
			this.style();
		},
		adjustHeightToFitWindow: function() {
			var newHeight = 0,
				defaultMaxHeight = this.options.maxHeight || 0,
				curHeight = this.element.height(),
				// resizing the dropdown to make it fit inside the window
				maxHeight = $(window).height() - 4 * $("body").offset().top;
			if ( defaultMaxHeight && maxHeight > defaultMaxHeight ) {
				maxHeight = defaultMaxHeight;
			}
			if ( maxHeight && curHeight > maxHeight ) {
				this.element.css({
					"height": newHeight,
					"overflow-y": "auto"
				});
			}
		},
		/*getElementFor: function( instance ) {
			return this.find("." + instance.identity ? instance.identity() : "dropdown_" + instance.id);
		},*/
		
		/************************************
		 *		 Dropdown Public API		*
		 ************************************/	
		// when item is selected through the api simulate click  
		// to let phui/selectable manage element's activation  
		select: function( item ) {
			this._getEl( item ).trigger("activate");
		},
		showItem: function( item ) {
			this._getEl( item ).show();
		},
		hideItem: function( item ) {
			this._getEl( item ).hide();
		},						
		clearSelection: function( currentItem ) {
			// TODO: this cleanup should probably be a feature of phui/selectable
			this._getEl(currentItem).removeClass(this.options.activatedClassName);
		},		 	
		enable: function( item ) {
			//var el = this.getElementFor(item);
			var el = this._getEl(item);
			el.removeClass(this.options.disabledClassName);
		},
		disable: function( item ) {
			//var el = this.getElementFor(item);
			var el = this._getEl(item);
			el.addClass(this.options.disabledClassName);
		},
		hide: function() {
			this.combobox.controller().resetWatermark();
			this.element.slideUp("fast");

			// trick to make dropdown close when combobox looses focus  
			this.hasFocus = false;
		},
		show: function() {
			this.combobox.controller().clearWatermark();
			this.element.css("opacity", 0).show().scrollTop(0).trigger("move", this.combobox).hide().css("opacity", 1).slideDown("fast", this.callback("_shown"));
		},
		_shown: function() {
			var self = this;
			setTimeout(function() {
				self.style();
			}, 1);
			this.combobox.trigger("open");
		}
	});

});