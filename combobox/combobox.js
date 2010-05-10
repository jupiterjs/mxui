steal.plugins('jquery/controller', 'jquery/view/ejs', 'phui/positionable').then(function(){
    
    $.Controller.extend("Phui.Combobox",{
        defaults : {
            maxHeight : "300px"
        }
    },
    {
        /*
         * 1) this.number = this.Class.counter;
         * 2) this.Class.counter++;
         * 2) wrap input with combobox icons (right down arrow)
         * 3) this.options.model.findAll(this.options.params || {}, this.callback("found")
         */
        init : function() {
            this.element.html( this.view("//phui/combobox/views/init.ejs"));
            this.options.model.findAll(this.options.params || {}, this.callback("found"));
        },
        
        /*
         * 1) Create dropdown (div) element
         * 2) Render dropdown (use options.render and <%= instance %>)
         * 3) Set position: absolute, position near input (this.element)
         * 4) Set maxHeight
         * 4) Hide dropdown
         * 5) Create lookup table
         */
        found : function(instances) {
            var dropdown = $("<div></div>");
		    document.body.appendChild(dropdown[0]);
            dropdown.html( this.view("//phui/combobox/views/dropdown", {
                instances: instances,
				options: this.options
            }));
            dropdown.addClass("phui_combobox_dropdown");
			dropdown.css("width", this.element.css("width"));
			dropdown.css("height", this.options.maxHeight);

			dropdown.phui_positionable({
				my: 'left top',
				at: 'left bottom'
			}).trigger("move", this.element);
			
			dropdown.hide();
			
			dropdown.delegate("li", "click", function(ev) {
				alert($(this).model().value)
			})
			
			dropdown.delegate("li", "mouseenter", function(ev) {
				$(this).css("color","white");
				$(this).css("background-color","blue");
			})
			
			dropdown.delegate("li", "mouseleave", function(ev) {
				$(this).css("color","");
				$(this).css("background-color","");
			})						
        },
        
        /*
         * 1) Lookup the lookup table
         * 2) this.val(<looked up text>)
         */
        lookup : function(query) {
            
        },
        
        /*
         * dropdown.val(text) if(text)
         * else return dropdown.val()
         */
        val : function(text) {
            
        },
        
        ".value click" : function(el, ev) {
            this.val(el.model().text);
        },
        
        ".toggle click" : function(el, ev) {
			this.find("input").trigger("focus");			
            $(".phui_combobox_dropdown").slideToggle("fast");
        },
        
        "input focusout": function(el, ev){
            //$(".phui_combobox_dropdown").hide();            
        },		
        
        destroy : function() {
            this.number = null;
            this.rawElement = null;
			$(".phui_combobox_dropdown li").undelegate();
        }
        
        
        

    });
});
