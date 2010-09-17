steal.plugins('phui/fittable').then(function () {

    /**
    * Dropdown has the following responsibilities:
    * - drawing a list of items
    * - positioning itself (will mostly be handled by Alex's fit plugin)
    * - creating a selectable (it has it's own api)
    * 
    */
    $.Controller.extend("Phui.Combobox.DropdownController", {}, {
        init: function (el, options) {

            this.isFirstPass = true;

            var comboboxId = this.options.parentElement.attr('id');
            if (comboboxId) {
                this.element.attr('id', comboboxId + "_dropdown");
            }
            //add ul
            this.element.css("position", "absolute")
        },
        destroy: function () {
            this.list = null;
            this._super();
        },
        style: function () {
            this.element.css({
                'opacity': 1, // used because IE7 doesn't show the updated contents of the combobox without it
                'width': this.options.parentElement.width()
            });

            if (this.options.maxHeight) {
                var h = this.element.height(),
					maxh = this.options.maxHeight;
                this.element.css({
                    "height": h > maxh ? maxh : h,
                    "overflow": "auto"
                });
            }

            if (this.isFirstPass) {
                // apply custom style to item
                var self = this;
                this.find(".item").each(function (i, el) {
                    el = $(el);
                    var item = this._getModel(el);
                    el.removeClass(self.options.activatedClassName);
                    if (item.attr("activated")) {
                        el.addClass(self.options.activatedClassName);
                    }
                });
            }
        },
        draw: function (modelList, val) {
            // if this is the first time we are drawing
            // make the content			
            if (this.isFirstPass) {

                var html = modelList.length ?
					this.getHTML(modelList) :
					"<li><span class='item'>No items in the combobox</span></li>";

                // if starts with <li> wrap under <ul>
                // so selectable as something to attach to
                if (html.indexOf("<li") === 0) {
                    html = "<ul>" + html + "</ul>";
                }
                this.list = this.element.html(html)
					.children("ul")
					.phui_combobox_selectable({
					    selectedClassName: "selected"
					})
					.phui_combobox_selectable("cache");



            }

            
            var modelHash = {};
			if (modelList.length) {
				// fill hash for quick lookup of the instance
				for (var i = 0; i < modelList.length; i++) {
					var inst = modelList[i];
					modelHash[inst.identity ? inst.identity() : "dropdown_" + inst.id] = inst;
				}
				
				// hide the elements that do not match the item list
				var itemEls = this.list.find(".item"), first = false;
				
				//select the first one
				for (var j = 0; j < itemEls.length; j++) {
				
					var el = $(itemEls[j]), identity = el[0].className.match(/(dropdown_\d*)/)[0], item = identity && modelHash[identity];
					
					if (!item || item.forceHidden) {
					
						el.hide()
						
					}
					else {
						// if we have an autosuggest, pick the first one
						if (!first && val) {
							this.list.controller().selected(el, false);
							first = true
						}
						el.find('.item-content').html(this.options.render.itemTemplate(item, val));
						el.show();
					}
				}
			}

            //saves the model hash
            this.modelHash = modelHash;
            this.isFirstPass = false;

            // this is here because ie7 renders an incorrect height
            // not sure why this works, probably because it forces a reflow
            this.element.height()

            this.style();

        },

        // gets an element from an item .... what
        _getEl: function (item) {
            // id = 0 can be a valid value
            if (!item || item.id === undefined) return $([])
            return this.find(".dropdown_" + item.id);
        },
        /**
        * returns the html for a list
        */
        getHTML: function (list) {
            if (!list.length) {
                return [];
            }
            var level = 0,
				html = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item.level > level) {
                    html.push("<ul>");
                }
                html.push("<li>", this.drawItemHtml(item), "</li>");
                if (item.level < level) {
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
        drawItemHtml: function (item) {
            return [
				"<span class='item ",
				item.identity ?
					item.identity() :
					"dropdown_" + item.id,

				item.enabled ?
					" selectable " :
					" " + this.options.disabledClassName,
				"' >",
				"<span style='float:left;margin-left:",
				item.level * 20,
				"px'>&nbsp;</span><span class='item-content'>",
				this.options.render.itemTemplate(item),
				"</span></span>"
			].join("");
        },
        // gets an instance from the model hash
        _getModel: function (el) {

            return el && el.length &&
					this.modelHash[el[0].className.match(/(dropdown_\d*)/)[0]];
        },
        /**
        * On activate (clicking or pressing enter) set our parent's val.
        */
        ".selectable click": function (el, ev) {
            this.selectElement(el);
        },
        selectElement: function (el) {
            var item = this._getModel(el);
            if (item) {
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
        mousedown: function (el, ev) {
            ev.preventDefault();
            var el = this.options.parentElement.find("input[type=text]")[0];
            setTimeout(function () {
                el.focus();
            }, 1);
        },
        windowresize: function (el, ev) {
            // only adjust dimensions if its visible
            // (we don't want all hidden dropdowns on the page to suddenly open on resize)
            if (this.element.is(":visible")) {
                this.style();
                this.element.fit({
                    within: 300,
                    of: this.options.parentElement,
                    maxHeight: this.options.maxHeight,
                    keep: true
                });
            }
        },

        /************************************
        *		 Dropdown Public API		*
        ************************************/
        // when item is selected through the api simulate click  
        // to let phui/selectable manage element's activation  
        selectItem: function (item) {
            this.selectElement(this._getEl(item));
        },
        showItem: function (item) {
            this._getEl(item).show();
        },
        hideItem: function (item) {
            this._getEl(item).hide();
        },
        clearSelection: function (currentItem) {
            // TODO: this cleanup should probably be a feature of phui/selectable
            this._getEl(currentItem).removeClass(this.options.activatedClassName);
        },
        enable: function (item) {
            //var el = this.getElementFor(item);
            var el = this._getEl(item);
            el.removeClass(this.options.disabledClassName);
        },
        disable: function (item) {
            //var el = this.getElementFor(item);
            var el = this._getEl(item);
            el.addClass(this.options.disabledClassName);
        },
        hide: function () {
            this.options.parentElement.controller().resetWatermark();
            if (this.element.data().fitAbove) {
                var offTop = this.options.parentElement.offset().top;
                this.element.animate({
                    top: offTop,
                    height: 1
                }, "fast", this.callback("_hidden"));
                this.element.hide(this.callback("_hidden"));
            } else {
                this.element.slideUp("fast");
            }

        },

        _hidden: function () {
            this.element.hide();
        },

        /**
        * Show will always show the selected element so make sure you have
        * it set before you call this.
        * @param {Function} callback
        */
        show: function (callback) {

            // knows WAY too much

            this.element.fit({
                within: 300,
                of: this.options.parentElement,
                maxHeight: this.options.maxHeight,
                keep: true
            });

            if (this.element.data().fitAbove) {
                this._slideUp(this.element, this.callback("_shown", callback));
            } else {
                this.element.hide().slideDown("fast", this.callback("_shown", callback));
            }
        },
        _slideUp: function (el, callback) {
            el.css("opacity", 0).show();

            var time = 0,
                duration = 0.1,
				off = el.offset(),
                offTop = off.top,
				offLeft = off.left,
                height = el.height(),
                offInc = 1,
                heightInc = 1;

            el.offset({ top: offTop + el.outerHeight(), left: offLeft });
            el.height(1);
            el.css("opacity", 1);

            var initOff = el.offset().top,
                initHeight = 1;

            var step = function () {
                //  simple linear tweening - no easing, no acceleration
                //nextOff = -offInc * time / duration + initOff;
                //nextHeight = heightInc * time / duration + initHeight;
                // exponential easing in - accelerating from zero velocity
                nextOff = -offInc * Math.pow(2, 10 * (time / duration - 1)) + initOff;
                nextHeight = heightInc * Math.pow(2, 10 * (time / duration - 1)) + initHeight;
                time += 1;

                if (nextOff >= offTop && nextHeight <= height) {
                    el.offset({ top: nextOff, left: offLeft });
                    el.height(nextHeight);
                    setTimeout(step, 10);
                } else {
                    el.offset({ top: offTop, left: offLeft });
                    el.height(height);
                    callback();
                }
            }
            setTimeout(step, 10);
        },
        _shown: function (callback) {
            var self = this;
            setTimeout(function () {
                self.style();
                self.element.children("ul").controller().showSelected();
                callback && callback()
            }, 1);
            this.options.parentElement.trigger("open");
        }
    });

});