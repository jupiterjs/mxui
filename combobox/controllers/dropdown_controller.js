$.Controller.extend("Phui.Combobox.DropdownController", {
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
        this.find("li").css("width", this.element.width() - 2);
    },
    draw : function(modelList, showNested) {
        // draw the dropdown
		var listToDraw = $.extend(true, {}, modelList); 
        var html = this._makeEl(listToDraw, 0);
		listToDraw = null;
		// if starts with <li> wrap under <ul>
		// so selectable as something to attach to
		if( html.indexOf("<li") === 0 ) {
			html = "<ul>" + html + "</ul>";
		}
        this.element.html(html);
        
        // apply custom style to item and
        // hookup the models to the elements
        for(var i=0;i<modelList.length;i++) {
            var item = modelList[i];
            
            var el = this.find("." + item.identity());
            el.find(".text").css(this.options.textStyle);
            
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
                this._makeEl(list.splice(1), nextLevel, initialLevel)
        }
        if(nextLevel > currentLevel){
            return "<li>"+this._drawItemHtml(item)+"<ul>"+
                this._makeEl(list.splice(1), nextLevel, initialLevel)
        }
        if(nextLevel < currentLevel){
            var diff = currentLevel - nextLevel
            var endStr = ""
            for(var i=0; i<diff; i++){
                endStr += "</ul></li>"
            }
            return "<li>"+this._drawItemHtml(item)+"</li>"+endStr+
                this._makeEl(list.splice(1), nextLevel, initialLevel)

        }
    },       
    /*_openLI : function(item) {
            var html = [];
            html.push("<li class='item " + item.identity());
            item.enabled ? html.push("' >") : html.push(this.options.disabledClassName + "' >");
            return html.join(" ");                    
    },*/
    _drawItemHtml : function(item) {
            var html = []; 
            html.push("<span style='float:left;margin-left:" + item.level*20 + "px'>&nbsp;</span>");
            html.push( this.options.render["itemText"](item) );        
            return html.join(" ");        
    },
    keyup : function(el, ev) {
        var key = $.keyname(ev);
                
        // close dropdown on escape
        if (key == "escape") {
            this.hide();                
        }        
    },
    val: function(item) {
        var el = this.find("li.combobox_models_item_" + item.value + ":first");
        /*this.find("li").removeClass( this.options.selectedClassName );
        el.addClass( this.options.selectedClassName );*/        
        //el.trigger("activate");
    },
    ".selectable activate" : function(el, ev) {
        if (!el.hasClass(this.options.disabledClassName)) {
            var item = el.model();
            if (item) {
                // set combobox new value
                this.combobox.controller().val(item.value);
                
                // highlight activated item
                /*this.find("li").removeClass(this.options.activatedClassName);
                el.addClass(this.options.activatedClassName);*/
                
                // then hide dropdown            
                this.element.hide();
                
                // trick to make dropdown close when combobox looses focus            
                this.hasFocus = false;
            }
        }
    },
    
    mouseenter : function(el, ev) {
        // trick to make dropdown close when combobox looses focus            
        this.hasFocus = true;        
    },    
    mouseleave : function(el, ev) {
        // trick to make dropdown close when combobox looses focus            
        this.hasFocus = false;
        this.combobox.find("input[type=text]").focus();    
    },    
    hide : function() {
        this.element.slideUp("fast");
    },
    show : function() {
        this.element.slideDown("fast");    
        
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
