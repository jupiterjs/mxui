steal.plugins('jquery/controller',
              'jquery/model',
			  'jquery/view/ejs',
			  'phui/positionable',
			  'phui/key_validator')
		.models('lookup')
		.controllers('dropdown')
		.then(function(){

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            maxHeight: "300px"
        }
    },
	{
		
        init: function(){
            this.element.html( this.view("//phui/combobox/views/init.ejs") );
            this.options.model.findAll(this.options.params || {}, this.callback("found"));
        },
        found: function(instances){
            this.dropdown = $("<div></div>");
            document.body.appendChild( this.dropdown[0] );
			this.dropdown.phui_combobox_dropdown( this.element, this.options );
			
			//TODO: fix synchronization draw/hide
			this.dropdown.trigger("draw", instances);			
			
			this.lookup = new Lookup({});
			this.lookup.build(instances, this.options.maxLookupDepth);
        },
		drawDropdown : function(instances) {
			this.dropdown.trigger("draw", instances);			
		},		
        "input keypress": function(el, ev){
            var key = $.keyname(ev)
            /*if(key.length > 1){ //it is a special, non printable character
             return;
             }*/
            var current = el.val(), before = current.substr(0, el.selectionStart()), end = current.substr(el.selectionEnd()), newVal = before + key + end;
            
            if (key === "backspace") 
                newVal = before.substr(0, before.length - 2);
            
            if ($.trim(newVal) === "") {
                this.options.model.findAll(this.options.params || {}, this.callback("drawDropdown"));
				//TODO: fix synchronization draw/hide
				this.dropdown.trigger("show");
                return;
            }
            
            var instances = this.lookup.query(newVal);
			this.dropdown.trigger("draw", instances);
			this.dropdown.trigger("show");
        },
		/*
		 * In chrome(2.0.172) when we click on the scrollbar, the input field will loose focus. And now if you click outside,
		 * then the dropdown won't close(as the input has already lost focus when you clicked on the srollbar)
         * In Firefox(3.5), IE(8), opera(9.64), safari() when we click on the scrollbar the input field will not loose focus.
         * Hence when you click outside (after clicking on the srollbar) the dropdown will close. This is the expected behaviour.
         * So In chrome once the scrollbar is clicked, and then if I click outside the dropdown won't close.
         * http://stackoverflow.com/questions/1345473/google-chrome-focus-issue-with-the-scrollbar 
		 */
		focusin : function(el, ev) {
			this.hasFocus = true;
		},
	    focusout : function(el, ev) {
			if (!$.browser.mozilla) {
				this.hasFocus = false;
				var keepFocus = this.dropdown.controller().keepFocus;
				if (!keepFocus) {
					this.dropdown.trigger("hide");
				}
				else {
					this.dropdown.controller().keepFocus = false;
					this.element.focus();
				}
			} else {
				this.dropdown.trigger("hide");				
			}
	    },			
        val: function(text){
			if(!text)
                return this.find("input").val();
		    this.find("input").val(text);
        },
        ".toggle click": function(el, ev){
            this.find("input").trigger("focus");
			this.dropdown.is(":visible") ? this.dropdown.trigger("hide") : this.dropdown.trigger("show");
        },
        destroy: function(){
			this.dropdown.remove();
			this.dropdown = null;
        }
        
    });
    
    
});
