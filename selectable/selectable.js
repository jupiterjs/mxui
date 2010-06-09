steal.plugins('jquery/controller', 'phui/keycode')
     .then(function(){
         $.Controller.extend('Phui.Selectable',{
            defaults : {
                selectableClassName: "selectable",
                selectedClassName : "selected",
                activatedClassName : "activated"
            }
        },
        {
            init: function() {
                this.selectableEls = this.find( "*[tabindex=0]" );
            },
            ".{selectableClassName} mouseenter": function(el, ev){
                el.trigger("select")
            },
            ".{selectableClassName} click": function(el, ev){
                el.trigger("activate");
            },
            ".{selectableClassName} focusin": function(el, ev){
                el.addClass( this.options.selectedClassName );
            },
            ".{selectableClassName} activate": function(el, ev){
                var activated = this.element.find( "."+this.options.activatedClassName );
                if(activated.length)
                    activated.trigger('deactivate');
                el.addClass( this.options.activatedClassName );
            },
            ".{selectableClassName} deactivate": function(el, ev){
                el.removeClass( this.options.activatedClassName );
            },
            ".{selectableClassName} select": function(el, ev){
                var selected = this.element.find( "."+this.options.selectedClassName );
                if (selected.length) {
                    selected.trigger('deselect');
                }
                if ($.browser.msie) {
                    el.trigger("focusin");
                }
                el.focus();
            },
            ".{selectableClassName} deselect": function(el, ev){
                el.removeClass( this.options.selectedClassName );
            },
            ".{selectableClassName} keydown": function(el, ev){
                var key = $.keyname(ev)
                if(key == "down")
                    this.focusNext(el);
                if(key == "up")
                    this.focusPrev(el);
                if(key == "enter")
                    el.trigger("activate")
                
                // this is a trick to fix issue with 
                // key navigation in large overflowed lists
                if(!$.browser.mozilla) ev.preventDefault();
            },
            focusNext: function(el){
                var els = this.selectableEls.filter(":visible");
                var first = els.eq(0),
                    last = els.eq(-1);
                
                if (el[0] == last[0]) {
                    return first.trigger("select");
                }
                    
                var nextEl;
                for(var i=0;i<els.length;i++) {
                    if(el[0] == els[i]) {
                        nextEl =  els[i + 1];
                        break;
                    }
                }
                $(nextEl).trigger("select");
            },
            focusPrev: function(el){
                var els = this.selectableEls.filter(":visible");
                var first = els.eq(0),
                    last = els.eq(-1);
                
                if (el[0] == first[0]) {
                    return last.trigger("select");
                }

                var prevEl;
                for(var i=0;i<els.length;i++) {
                    if(el[0] == els[i]) {
                        prevEl = els[i - 1];
                        break;
                    }
                }
                $(prevEl).trigger("select");                    
            },
            getFirst: function() {
                return this.selectableEls.filter(":visible").get(0);
            },
            getLast: function() { 
                return this.selectableEls.filter(":visible").get(-1);
            }
        })
     })
