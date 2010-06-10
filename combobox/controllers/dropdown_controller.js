$.Controller.extend("Phui.Combobox.DropdownController", 
{
},
{
    init : function(el, combobox, options) {
        this.combobox = combobox;
        this.options = options;
        this.hasFocus = false;  
        this.canOpen = true;
        this.isFirstPass = true;        
    },
    style : function() {
        this.element.css("width", this.combobox.css("width"));
        if (this.options.maxHeight) {
            this.element.css({
                "height": this.options.maxHeight,
                "overflow": "auto"
            });
        }        
        
        // apply custom style to item
        var self = this;
        this.find(".item").each(function(i, el){
            el = $(el);
            var item = el.model();
            el.removeClass(self.options.activatedClassName);
            if (item.attr("activated")) {
                el.addClass(self.options.activatedClassName);
            }
        });
        
        // ajdust dropdown height so it can fit in the page
        // even if the window is small
        this.adjustHeightToFitWindow();     
        
        this.fixOverflowBugInIE7();
    },
    fixOverflowBugInIE7 : function() {
        // trick for handling IE7 overflow bug
        var ul = this.find( "ul.phui_selectable" ); 
        if (this.element.width() > this.element[0].clientWidth) {
            var ulWidth = this.element.innerWidth() - 18; // scrollbar width;
        } else {
			var ulWidth = this.element.innerWidth();		
		}
		ul.width( ulWidth );
    },
    /*scrollbarWidth :  function() { 
        var outerDiv = $('<div/>');
        var innerDiv = $('<div/>');
        outerDiv.html(innerDiv);    
        // Append our div, do our calculation and then remove it 
        $('body').append(outerDiv); 
        outerDiv.css({
            'width':'50px',
            'height':'50px',
            'overflow': 'hidden',
            'position': 'absolute',
            'top': '-200px'
        });
        innerDiv.css({
            'height':'100px'
        });            
        var w1 = $('div', innerDiv).innerWidth(); 
        outerDiv.css('overflow-y', 'scroll'); 
        var w2 = $('div', innerDiv).innerWidth(); 
        $(innerDiv).remove(); 
        return (w1 - w2); 
    },*/
    draw : function(modelList, isAutocompleteData) {
        
        if(this.isFirstPass) {
            var listToDraw = $.extend(true, {}, modelList);
            var html = this._makeEl(listToDraw, 0);
            listToDraw = null;

            // if starts with <li> wrap under <ul>
            // so selectable as something to attach to
            if (html.indexOf("<li") === 0) {
                html = "<ul>" + html + "</ul>";
            }
            this.element.html(html);
            
            // position the dropdown bellow the combobox input
            this.element.phui_positionable({
                my: 'left top',
                at: 'left bottom',
                collision: 'none none'
            }).trigger("move", this.combobox);
			
	        // add up/down key navigation
	        this.element.children("ul").phui_selectable({
	            selectedClassName: "selected",
	            activatedClassName: "activated"
	        });   			
        }
        
         var modelHash = {};
        for(var i=0;i<modelList.length;i++) {
            var inst = modelList[i];
            modelHash[ inst.identity() ] = inst;
        }
        
        // hides the elements that do not match the item list
        var itemEls = this.find(".item");
        for (var i = 0; i < itemEls.length; i++) {
            var el = $(itemEls[i]);
            el.show();
            var identity = el[0].className.match(/(combobox_models_item_\d*)/)[0];
            if (identity) {
                if( !modelHash[identity] ) el.hide();
            }
            
            if (this.isFirstPass) {
                var item = modelHash[identity];
                if (item) 
                    item.hookup(el[0]);
            }
        }
        
        this.isFirstPass = false;

        this.style();
    },
    _makeHtmlForAutocompleteData : function(list) {
        var html = [];
        // we assume autocomplete data is a linear list
        // with no nesting information
        for(var i=0;i<list.length;i++) {
            var item = list[i];
            html.push("<li>" + this.drawItemHtml(item, true) + "</li>")
        }
        return html.join(" ");
    },
    _makeEl : function(list, currentLevel, initialLevel){
        if(!list.length) return "";
        currentLevel = currentLevel >-1 ? currentLevel: -1;
        initialLevel = initialLevel ? initialLevel : currentLevel;
        var nextLevel = list[1] ? list[1].level : 99999999;
        var item = list[0];
        if(nextLevel == 99999999) {
            var diff = currentLevel - initialLevel
            var endStr = ""
            for(var i=0; i<diff; i++){
                endStr += "</ul></li>"
            }
            return "<li>"+this.drawItemHtml(item)+
                   "</li>" + endStr
        }
        if(nextLevel == currentLevel) {
             return "<li>"+this.drawItemHtml(item)+"</li>"+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)
        }
        if(nextLevel > currentLevel){
            return "<li>"+this.drawItemHtml(item)+"<ul>"+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)
        }
        if(nextLevel < currentLevel){
            var diff = currentLevel - nextLevel
            var endStr = ""
            for(var i=0; i<diff; i++){
                endStr += "</ul></li>"
            }
            return "<li>"+this.drawItemHtml(item)+"</li>"+endStr+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)

        }
    },       
    drawItemHtml : function(item, isAutocompleteData) {
            var html = [];
            html.push("<span tabindex='0' class='item " + item.identity()); 
            html.push(" selectable ");
            item.enabled ? html.push("' >") : html.push(this.options.disabledClassName + "' >");             
            if(!isAutocompleteData) 
                html.push("<span style='float:left;margin-left:" + item.level*20 + "px'>&nbsp;</span>");
            html.push( this.options.render["itemTemplate"](item) ); 
            html.push("</span>");       
            return html.join(" ");        
    },
    keyup : function(el, ev) {
        var key = $.keyname(ev);
                
        // close dropdown on escape
        if (key == "escape") {
            this.hide();     
        }        
    },
    ".selectable activate" : function(el, ev) {
        if (!el.hasClass(this.options.disabledClassName)) {
            var item = el.model();
            if (item) {
                // set combobox new value
                this.combobox.controller().val(item.value, el.html());
                
                // then hide dropdown            
                this.element.hide();
                
                // trick to make dropdown close when combobox looses focus            
                this.hasFocus = false;
            }
        } else {
            el.removeClass( this.options.activatedClassName );
        }
    },
    mouseenter : function(el, ev) {
        // trick to make dropdown close when combobox looses focus            
        this.hasFocus = true;
    },    
    "li mouseleave" : function(el, ev) {
        // we don't want mouseleave events on elements
        // inside dropdown to make dropdown.hasFocus = false
        ev.stopPropagation();
    },
    mouseleave : function(el, ev) {
        // trick to make dropdown close when combobox looses focus  
        this.hasFocus = false;
        this.canOpen = false
		this.combobox.find( "input[type=text]" ).focus();  
        this.canOpen = true;
    }, 
    windowresize : function(el, ev) {
        // ajdust dropdown height so it can fit in the page
        // even if the window is small        
		this.style();
    },
    adjustHeightToFitWindow : function() {
        if ( this.element.is(":visible") ) {
            // if maxHeight was not defined in options 
            // make it the same size as that with which 
            // dropdown is rendered
            var defaultMaxHeight = this.options.maxHeight; 
            if (defaultMaxHeight == null) {
                var maxHeight = 0;
                this.find(".selectable").each(function(i, el){
                    maxHeight += $(el).outerHeight();
                })
                defaultMaxHeight = maxHeight + "px"; 
            }  

            // resizing the dropdown to make it fit inside the window
            var newHeight = $(window).height() - 4 * $("body").offset().top;
            defaultMaxHeight = parseInt(defaultMaxHeight.substr(0, defaultMaxHeight.indexOf("px")));
            if (newHeight > defaultMaxHeight) 
                newHeight = defaultMaxHeight;
            this.element.css({
                "height": newHeight + "px",
                "overflow": "auto"
            });
        }
    },
    getElementFor : function(instance) {
        return this.find("." + instance.identity());
    },
    enable : function(item) {
        var el = this.getElementFor(item);
        el.removeClass( this.options.disabledClassName );
    },
    disable : function(item) {
        var el = this.getElementFor(item);
        el.addClass( this.options.disabledClassName );
    },    
    hide : function() {
        this.element.slideUp("fast");
        
        // trick to make dropdown close when combobox looses focus  
        this.hasFocus = false;        
    },
    show : function() {
		this.element.trigger("move", this.combobox);		
        this.element.slideDown("fast", this.callback("shown"));   
    },
    shown : function() {
		this.style();                     
        this.combobox.trigger("open");        
    }
})
