steal.plugins('jquery/controller','phui/keycode').then(function(){
	//get the start selection / cursor
	$.fn.selectionStart = function(){
		var el = this[0];
		if (el.createTextRange) {
				var r = document.selection.createRange().duplicate()
				r.moveEnd('character', el.value.length)
				if (r.text == '') return el.value.length
				return el.value.lastIndexOf(r.text)
		} else return el.selectionStart 
	}
	$.fn.selectionEnd = function(){
		var el = this[0];
		if (el.createTextRange) {
			var r = document.selection.createRange().duplicate()
			r.moveStart('character', -el.value.length)
			return r.text.length 
		} else return el.selectionEnd 
	}
	
	/**
	 * Only allows what matches the regexp.
	 */
	$.Controller.extend("Phui.KeyValidator",{
		defaults : function(){
			//can be a regexp or a function
			test : /.*/
		}
	},{	
		"keypress" : function(el, ev){
			var key = $.keyname(ev)
			if(key.length > 1){ //it is a special, non printable character
				return;
			}
			
			// allow copy/paste			
			if (ev.ctrlKey && 
					(key.toLowerCase() == "v" ||
					 key.toLowerCase() == "c" ||
					 key.toLowerCase() == "x" ||
					 key.toLowerCase() == "a")) return;			
						
			var current = this.element.val(),
				before = current.substr(0,this.element.selectionStart()),
				end = current.substr(this.element.selectionEnd()),
				newVal = before+key+end 

			if(!( (typeof this.options.test) == 'object' ? this.options.test.test(newVal) :  this.options.test(newVal))){
				ev.preventDefault();
			}
		}
	})
})

