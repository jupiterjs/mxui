steal.plugins('jquery/controller', 'jquery/view/ejs', 'phui/positionable',
              'phui/key_validator').then(function(){
    
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
            this.lookupStructure = {};
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
            dropdown.addClass("phui_combobox_dropdown");
            
            this.drawDropdown(dropdown, instances);

            dropdown.hide();
            
			var $input = this.find("input");
            dropdown.delegate("li", "click", function(ev) {
                $input.val( $(this).model().text );
            })
            
            dropdown.delegate("li", "mouseenter", function(ev) {
                $(this).css("color","white");
                $(this).css("background-color","blue");
            })
            
            dropdown.delegate("li", "mouseleave", function(ev) {
                $(this).css("color","");
                $(this).css("background-color","");
            })
            
            this.buildLookupStructure(instances);
        },
        
        drawDropdown : function(dropdown, instances) {
            dropdown.html( this.view("//phui/combobox/views/dropdown", {
                instances: instances,
                options: this.options
            }));
            
            dropdown.css("width", this.element.css("width"));
            
            // set maxHeight
            dropdown.css("height", this.options.maxHeight);

            dropdown.phui_positionable({
                my: 'left top',
                at: 'left bottom'
            }).trigger("move", this.element);
			
			dropdown.show();
                        
        },
        
        /*
         * iterate through instances, use text first char as key and instance as value
         * for the lookup structure
         */
        buildLookupStructure : function(instances) {
            for(var i=0;i<instances.length;i++) {
                var firstChar = instances[i].text.substr(0,1);
                if(!this.lookupStructure[firstChar]) this.lookupStructure[firstChar] = [];
                this.lookupStructure[firstChar].push(instances[i]);
            }
        },
        
        /*
         * 1) Lookup the lookup table
         * 2) this.val(<looked up text>)
         */
        lookup : function(query) {
            var results = [];
            var firstChar = query.substr(0,1);
            
            for(var k in this.lookupStructure) {
                if(k == firstChar) {
					for(var j=0;j<this.lookupStructure[k].length;j++) {
						results.push(this.lookupStructure[k][j])
					}
				}
            }
            
            for(var i=0;i<results.length;i++) {
                if(results[i].text.indexOf(query) == -1) results.splice(i)
            }
            
            return results;
        },
        
        "input keypress" : function(el, ev) {
            var key = $.keyname(ev)
            /*if(key.length > 1){ //it is a special, non printable character
                return;
            }*/
            
            var current = el.val(),
                before = current.substr(0,el.selectionStart()),
                end = current.substr(el.selectionEnd()),
                newVal = before+key+end;    
            
			if(key === "backspace") newVal = before.substr(0, before.length-2);
			
			if ($.trim(newVal) === "") {
				this.options.model.findAll(this.options.params || {}, this.callback("drawDropdown", $(".phui_combobox_dropdown") )) ;
				return;
			}
			
            var instances = this.lookup(newVal);    
            this.drawDropdown( $(".phui_combobox_dropdown"), instances );    
            
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
            this.lookupStructure = null;
            $(".phui_combobox_dropdown li").undelegate();
        }
        
        
        

    });
    
    
});
