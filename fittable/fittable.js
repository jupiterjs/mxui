steal.plugins('jquery/dom/dimensions').then(function ($) {

    $.fn.scrollableParent2 = function () {
        var el = this[0], parent = el;
        while ((parent = parent.parentNode) && parent != document.body) {
            var $p = $(parent);
            if (parent.scrollHeight > parent.offsetHeight &&
                   $p.height() > 0 &&
                   $.inArray( $p.css("overflow"), ["hidden","visible"]  ) === -1) {
                return $p;
            }
        }
    }

    var fit = function (dropdown, combobox, within, maxHeight, keep) {
        dropdown.css({
            "opacity": 0,
            "height": "",
            "top": "0px",
            "left": "0px"
        });
        dropdown.show();

        var scrollableParent = combobox.scrollableParent2(),
				spaceAvailableAbove,
				spaceAvailableBelow,
				belowPosition,
				fitAbove = false,

				comboOff = combobox.offset(),
				comboHeight = combobox.outerHeight(),

				dropHeight = dropdown.outerHeight();

        if (maxHeight) {
            dropHeight = dropHeight > maxHeight ? maxHeight : dropHeight;
            dropdown.height(dropHeight);
        }

        if (scrollableParent) {
            if (keep) {
                dropdown[0].parentNode.removeChild(dropdown[0]);
                scrollableParent.append(dropdown);
            }

            var scrollStyles = scrollableParent.curStyles(
					"borderTopWidth",
					"paddingTop",
					"paddingBottom"
					)

            var borderNormalizer = {
                "thin": 1,
                "medium": 2,
                "thick": 4
            },
            borderTopWidth = parseInt(scrollStyles.borderTopWidth);
            borderTopWidth = isNaN(borderTopWidth) ?
                 borderNormalizer[scrollStyles.borderTopWidth] : borderTopWidth;

            var scrollableOff = scrollableParent.offset(),
					scrollTop = scrollableOff.top + borderTopWidth; // + 
            //parseInt(scrollStyles.paddingTop);

            scrollBottom = scrollTop + scrollableParent.height() + parseInt(scrollStyles.paddingTop) +
						parseInt(scrollStyles.paddingBottom);

            spaceAvailableAbove = comboOff.top - scrollTop;
            spaceAvailableBelow = scrollBottom - (comboOff.top + comboHeight);
        } else {
            if (keep) {
                dropdown[0].parentNode.removeChild(dropdown[0]);
                document.body.appendChild(dropdown[0]);
            }

            spaceAvailableAbove = comboOff.top - $(window).scrollTop();
            spaceAvailableBelow = $(window).scrollTop() + $(window).height() - (comboOff.top + comboHeight);
        }
        belowPosition = { top: comboOff.top + comboHeight, left: comboOff.left }

        // If the element can be positioned without scrolling below target, draw it
        if (spaceAvailableBelow >= dropHeight) {
            dropdown.offset({
                top: belowPosition.top,
                left: belowPosition.left
            });
        } else if (spaceAvailableBelow >= within) {
            // If the element can be positioned with scrolling greater than min height, draw it
            dropdown.outerHeight(spaceAvailableBelow);
            dropdown.css({
                overflow: "auto"
            });
            dropdown.offset({
                top: belowPosition.top ,
                left: belowPosition.left
            });
        } else if (spaceAvailableAbove > spaceAvailableBelow) {
            // If the space above is greater than the space below, draw it above
            if (spaceAvailableAbove >= dropHeight) {
                dropdown.offset({
                    top: (comboOff.top - dropHeight),
                    left: comboOff.left
                });
            } else {
                //we have to shrink it
                dropdown.outerHeight(spaceAvailableAbove);
                dropdown.css({
                    overflow: "auto"
                });
                dropdown.offset({
                    top: (comboOff.top - spaceAvailableAbove),
                    left: comboOff.left
                });
            }
            fitAbove = true;
        } else if (true) {
            //  If the space above is less than the space below, draw it to fit in the space remaining
            dropdown.outerHeight(spaceAvailableBelow);
            dropdown.css({
                overflow: "auto"
            });
            dropdown.offset({
                top: belowPosition.top,
                left: belowPosition.left
            });
        }
        dropdown.css("opacity", 1);

        return fitAbove;
    }

    $.fn.fit = function (options) {
        // check if we have all necessary data before doing the work
        var of = options.of,
				within = options.within,
				maxHeight = options.maxHeight,
                keep = options.keep;

        if (!of || !within) {
            return;
        }

        // make element absolute positioned	

        var fitAbove = fit(this, of, within, maxHeight, keep);

        $.data(this[0], 'fitAbove', fitAbove);

        return this;
    };

});