$.Controller.extend("Phui.Combobox.DropdownController", 
{
},
{
    init : function(el, combobox, options) {
        this.combobox = combobox;
        this.options = options;
        this.hasFocus = false;  
    },
    style : function() {
        this.element.css("width", this.combobox.css("width"));
        if (this.options.maxHeight) {
            this.element.css({
                "height": this.options.maxHeight,
                "overflow": "auto"
            });
        }        
        
        // apply custom style to item and
        var self = this;
        this.find(".item").each(function(i, el){
            el = $(el);
            if(el.model().enabled)
                el.find(".text").css(self.options.textStyle);
            
            if (el.model().attr("activated")) {
                el.addClass(self.options.activatedClassName);
            } else {
                el.removeClass(self.options.activatedClassName);
            }                                           
        })            
    },
    draw : function(modelList, showNested, isAutocompleteData) {
        // draw the dropdown
        var html = "";
        if (isAutocompleteData) {
            html = this._makeHtmlForAutocompleteData(modelList);
        }
        else {
            var listToDraw = $.extend(true, {}, modelList);
            html = this._makeEl(listToDraw, 0);
            listToDraw = null;
        }
        
        // if starts with <li> wrap under <ul>
        // so selectable as something to attach to
        if( html.indexOf("<li") === 0 ) {
            html = "<ul>" + html + "</ul>";
        }
        this.element.html(html);
        
        // hookup the models to the elements
        for(var i=0;i<modelList.length;i++) {
            var item = modelList[i];
            
            var el = this.find("." + item.identity());
            if (el[0]) {
                item.hookup(el[0]);
            }            
        }
        
        // add up/down key navigation
        this.element.children("ul").phui_selectable({
            selectedClassName: "selected",
            activatedClassName: "activated"            
        });
        
        this.style();                
    },
    _makeHtmlForAutocompleteData : function(list) {
        var html = [];
        // we assume autocomplete data is a linear list
        // with no nesting information
        for(var i=0;i<list.length;i++) {
            html.push("<li>" + this._drawItemHtml(list[i], true) + "</li>")
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
            return "<li>"+this._drawItemHtml(item)+
                   "</li>" + endStr
        }
        if(nextLevel == currentLevel) {
             return "<li>"+this._drawItemHtml(item)+"</li>"+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)
        }
        if(nextLevel > currentLevel){
            return "<li>"+this._drawItemHtml(item)+"<ul>"+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)
        }
        if(nextLevel < currentLevel){
            var diff = currentLevel - nextLevel
            var endStr = ""
            for(var i=0; i<diff; i++){
                endStr += "</ul></li>"
            }
            return "<li>"+this._drawItemHtml(item)+"</li>"+endStr+
                this._makeEl(list.splice(1, list.length-1), nextLevel, initialLevel)

        }
    },       
    _drawItemHtml : function(item, isAutocompleteData) {
            var html = [];
            html.push("<span class='item " + item.identity()); 
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
                this.combobox.controller().val(item.value);
                
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
        this.combobox.find("input[type=text]").focus();                        
    }, 
    hide : function() {
        this.element.slideUp("fast");
        
        // trick to make dropdown close when combobox looses focus  
        this.hasFocus = false;        
    },
    show : function() {
        this.element.slideDown("fast");    
        
        // trick to make dropdown close when combobox looses focus  
        this.hasFocus = true;        
        
        // position the dropdown bellow the combobox input
        this.element.phui_positionable({
            my: 'left top',
            at: 'left bottom',
            collision: 'none none'
        }).trigger("move", this.combobox);        
        
        this.style();         
                    
        this.combobox.trigger("open");        
    }
})
