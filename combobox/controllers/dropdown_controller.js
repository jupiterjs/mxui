steal.then(function() {

	/**
	 * Dropdown has the following responsibilities:
	 * - drawing a list of items
	 * - positioning itself (will mostly be handled by Alex's fit plugin)
	 * - creating a selectable (it has it's own api)
	 * 
	 */
	$.Controller.extend("Phui.Combobox.DropdownController", {}, {
		init: function( el, options ) {
			
			this.isFirstPass = true;
			
			var comboboxId = this.options.parentElement.attr('id');
			if ( comboboxId ) {
				this.element.attr('id', comboboxId + "_dropdown");
			}
			//add ul
			
		},
		destroy : function(){
			this.list = null;
			this._super();
		},
		style: function() {
			
			this.element.css({
				'opacity': 1, // used because IE7 doesn't show the updated contents of the combobox without it
				'width': this.options.parentElement.width()
			});
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
				var ul = this.element.children("ul");
				ul.width(this.element[0].clientWidth);
			}
		},
		draw: function( modelList, val ) {
			// if this is the first time we are drawing
			// make the content
			if ( this.isFirstPass ) {
				
				var html = modelList.length ?
					this.getHTML(modelList) :
					"<li><span class='item'>No items in the combobox</span></li>";
	
				// if starts with <li> wrap under <ul>
				// so selectable as something to attach to
				if ( html.indexOf("<li") === 0 ) {
					html = "<ul>" + html + "</ul>";
				}
				this.list = this.element.html(html)
					.children("ul")
					.phui_combobox_selectable({
						selectedClassName: "selected"
					})
					.phui_combobox_selectable("cache");
				

				
			}
			// fill hash for quick lookup of the instance
			var modelHash = {};
			for ( var i = 0; i < modelList.length; i++ ) {
				var inst = modelList[i];
				modelHash[inst.identity ? inst.identity() : "dropdown_" + inst.id] = inst;
			}

			// hide the elements that do not match the item list
			var itemEls = this.list.find(".item"),
				first = false;
			
			//select the first one

			for ( var j = 0; j < itemEls.length; j++ ) {
				
				var el = $(itemEls[j]),
					identity = el[0].className.match(/(dropdown_\d*)/)[0],
					item = identity && modelHash[identity];
				
				if(!item || item.forceHidden){
					
					el.hide()
				
				}else{
					// if we have an autosuggest, pick the first one
					if(!first && val){
						this.list.controller().selected(el, false);
						first = true
					}
					el.find('.item-content')
						.html( this.options.render.itemTemplate(item, val) );
					el.show();
				}
			}
			
			//saves the model hash
			this.modelHash = modelHash;
			this.isFirstPass = false;

			this.style();
		},
		
		// gets an element from an item .... what
		_getEl: function( item ) {
			return this.find(".dropdown_" + item.id);
		},
		/**
		 * returns the html for a list
		 */
		getHTML: function( list) {
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
		/**
		 * returns the content for a single item
		 * @param {String} item
		 */
		drawItemHtml: function( item ) {
			return [
				"<span class='item ", 
				item.identity ? 
					item.identity() : 
					"dropdown_" + item.id, 
				 
				item.enabled ? 
					" selectable " : 
					" "+this.options.disabledClassName, 
				"' >",
				"<span style='float:left;margin-left:", 
				item.level * 20, 
				"px'>&nbsp;</span><span class='item-content'>", 
				this.options.render.itemTemplate(item),
				"</span></span>"
			].join("");
		},
		// gets an instance from the model hash
		_getModel: function( el ) {
			
			return el && el.length && 
					this.modelHash[el[0].className.match(/(dropdown_\d*)/)[0]];
		},
		/**
		 * On activate (clicking or pressing enter) set our parent's val.
		 */
		".selectable click": function( el, ev ) {
			this.selectElement(el);
		},
		selectElement : function(el){
			var item = this._getModel(el);
			if ( item ) {
				// set combobox new value
				this.options.parentElement.controller().val(item.value, el.html());

				// then hide dropdown            
				this.element.hide();
			}
		},
		/**
		 * Prevent focusing on this element, send focus back to the input element
		 * @param {Object} el
		 * @param {Object} ev
		 */
		mousedown : function(el, ev){
			ev.preventDefault();
			console.log('down');
			var el = this.options.parentElement.find("input[type=text]")[0];
			setTimeout(function(){
				el.focus();
			}, 1);
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


		/************************************
		 *		 Dropdown Public API		*
		 ************************************/
		// when item is selected through the api simulate click  
		// to let phui/selectable manage element's activation  
		selectItem: function( item ) {
			this._getEl(item).trigger("activate");
		},
		showItem: function( item ) {
			this._getEl(item).show();
		},
		hideItem: function( item ) {
			this._getEl(item).hide();
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
			this.options.parentElement.controller().resetWatermark();
			this.element.slideUp("fast");

		},
		/**
		 * Show will always show the selected element so make sure you have
		 * it set before you call this.
		 * @param {Function} callback
		 */
		show: function(callback) {
			
			// knows WAY too much

			
			this.element.css("opacity", 0)
				.show().scrollTop(0) //scroll to the top to prevent a flash
				.trigger("move", this.options.parentElement)
				.hide()
				.css("opacity", 1)
				.slideDown("fast", this.callback("_shown", callback));
		},
		_shown: function(callback) {
			var self = this;
			setTimeout(function() {
				
				self.style();
				self.element.children("ul").controller().showSelected();
				callback && callback()
			}, 1);
			this.options.parentElement.trigger("open");
		}
	});

});