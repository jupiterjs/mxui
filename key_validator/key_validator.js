steal.plugins('jquery/controller').then(function(){
	$.Controller.extend("Phui.KeyValidator",{
		defaults : function(){
			regExp : /.*/
		}
	},{
		"keypress" : function(el, ev){
			console.log(ev.charCode+" "+ev.keyCode)
			return;
			var code = ev.keyCode ? ev.keyCode : ev.charCode,
				navigationKeyCodes = [8,46,37,39];
				
			
			// if it's backspace, delete don't validate
			if(ev.keyCode == 8 || ev.keyCode == 46 && !ev.charCode && String.fromCharCode(46) != '.') {
				this.element.trigger("change"); 
			    return true;
			}
			// if it's left/right don't validate also
			if(ev.keyCode == 37 || ev.keyCode == 39 ) {
				return true;
			}
				
			
			// if it's a number or dot try to validate the next value
			if(code >= 48 && code <= 57 || String.fromCharCode(code) == '.')
			    nextValue = el.val() + String.fromCharCode(code); 
            if(!this.isNumeric(nextValue)) ev.preventDefault();
			this.element.trigger("change");
		},
		"keyup" : function(el, ev){
			console.log(ev.charCode+" "+ev.keyCode)
		}
	})
})

