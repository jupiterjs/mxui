steal.plugins('jquery/controller', 'jquery/view/ejs','jquery/event/mousewheel', 'phui/key_validator','phui/spinner').then(function(){
    
    $.Controller.extend("Phui.NumericInput",{
        defaults : {
			test : /^[-+]?[0-9]*\.?([0-9]+)?$/,
			increment : 1,
			decimalPlaces : 3,
			allowNegatives : true,
			value: 0
		}
    },
    {
		init : function() {
			
			this.element.phui_key_validator({test: this.options.test})
			this.spinner = $('<div/>').phui_spinner();
			this.element.after(this.spinner)
			
			this.bind(this.spinner , "increment","increment")
			this.bind(this.spinner , "decrement","decrement")
			this._renderResult(this.options.value)
        },
		"keypress" : function(el, ev) {
			var name =  $.keyname(ev)
			if( name== "up"  ){
				this.increment(el, ev);
			}else if(name== "down"){
				this.decrement(el, ev);
			}
		},
		"mousewheel": function(el, ev, delta){
			if(delta<0)
				this.decrement(el, ev);
			if(delta>0)
				this.increment(el, ev);
		},
		
		"increment" : function(el, ev) {
			ev.stopPropagation();
			var value = parseFloat(this.element.val()) + parseFloat(this.options.increment)
			this._renderResult(value)
		},
		
		"decrement" : function(el, ev) {
			ev.stopPropagation();
			var value = parseFloat(this.element.val()) - parseFloat(this.options.increment);
			this._renderResult(value)
		},
		_renderResult: function(val) {
			var scale = Math.pow(10, this.options.decimalPlaces);
			var result=Math.round(val*scale)/scale;
			
			
			
			if(result < 0 && !this.options.allowNegatives) {
				this.spinner.phui_spinner("downEnabled",false);
			} else  {
				this.element.val(result.toString());
				this.spinner.phui_spinner("downEnabled",true);
			}
		},
		destroy : function(){
			this.spinner.remove();
			this._super();
		}
        
    });
     
})
