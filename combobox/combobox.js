steal.plugins('jquery/controller',
              'jquery/model',
			  'jquery/view/ejs', 
			  'phui/positionable')
	 .models('lookup')
	 .controllers('dropdown').then(function(){

    $.Controller.extend("Phui.Combobox", {
        defaults: {
            maxHeight: "300px"
        }
    }, {
    
        init: function(){
			// draw input box
            this.element.html(this.view("//phui/combobox/views/init.ejs"));
            
            // create dropdown and append it to body
            this.dropdown = $("<div/>").phui_combobox_dropdown( this.element, this.options );
            document.body.appendChild(this.dropdown[0]);			
			this.dropdown.controller().hide();
     
            // pre-populate with items case they exist
            if (this.options.items) {
                this.lookup = new Lookup({});
                this.lookup.build(this.options.items);
                this.dropdown.controller().draw(this.options.items);
            }
						
			//this.options.model.findAll(this.options.params || {}, this.callback("found"));
        },
        found: function(items/*instances*/){
            /*this.dropdown = $("<div/>").phui_combobox_dropdown(this.element, this.options);
            document.body.appendChild(this.dropdown[0]);
            
            this.dropdown.controller().draw(instances);
            this.dropdown.controller().hide();			
            
            this.lookup = new Lookup({});
            this.lookup.build(instances, this.options.maxLookupDepth);*/

            this.lookup = new Lookup({});
            this.lookup.build(items);

            this.dropdown.controller().draw(items);
            this.dropdown.controller().show();			

            this.itemsAlreadyLoaded = true;
        },
        drawDropdown: function(instances){
            this.dropdown.controller().draw(instances);
        },
        "input keyup": function(el, ev){				
			var newVal = el.val();
            if ($.trim(newVal) === "") newVal = "*"; 
            var items = this.lookup.query(newVal);			
            this.dropdown.controller().draw(items);
            this.dropdown.controller().show();
        },
        /*
         * In chrome(2.0.172) when we click on the scrollbar, the input field will loose focus. And now if you click outside,
         * then the dropdown won't close(as the input has already lost focus when you clicked on the srollbar)
         * In Firefox(3.5), IE(8), opera(9.64), safari() when we click on the scrollbar the input field will not loose focus.
         * Hence when you click outside (after clicking on the srollbar) the dropdown will close. This is the expected behaviour.
         * So In chrome once the scrollbar is clicked, and then if I click outside the dropdown won't close.
         * http://stackoverflow.com/questions/1345473/google-chrome-focus-issue-with-the-scrollbar
         */
        focusin: function(el, ev){
            // trick to make dropdown close when combobox looses focus			
            this.hasFocus = true;
			
            // load items on demand
            if (this.options.loadOnDemand && !this.itemsAlreadyLoaded) {
				this.options.model.findAll(this.options.params || {}, this.callback("found"));								
            } 
        },
        focusout: function(el, ev){
            if (!$.browser.mozilla) {
                this.hasFocus = false;
                var keepFocus = this.dropdown.controller().keepFocus;
                if (!keepFocus) {
                    this.dropdown.controller().hide();
                }
                else {
                    this.dropdown.controller().keepFocus = false;
                    this.element.focus();
                }
            }
            else {
                this.dropdown.controller().hide();
            }
        },
        val: function(text){
            if(!text)
            return this.find("input").val();
            this.find("input").val(text);
         },
        /*val: function(identity){
            if (!identity) 
                return this.currentValue;
            
            var el = this.dropdown.find(identity);
            this.currentValue = el.model();
            this.find("input").val(this.currentValue.text);
        },*/
        ".toggle click": function(el, ev){
            this.find("input").trigger("focus");
            this.dropdown.is(":visible") ? this.dropdown.controller().hide() : this.dropdown.controller().show();
        },
        destroy: function(){
            this.dropdown.remove();
            this.dropdown = null;
            this.lookup._lookup = null;
            this.lookup = null;
        }
        
    });
    
    
});
