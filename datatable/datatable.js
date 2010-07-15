steal.plugins('jquery/controller','jquery/view/ejs').then(function($){
	
	jQuery.fn.sort = function() {  
        return this.pushStack( [].sort.apply( this, arguments ), []);  
    };  
	
	/**
	 * Basic datatable widget.
	 */
	$.Controller.extend('Phui.Datatable',
	{
		defaults : {
			content: '//phui/datatable/table.ejs'
		},
		listensTo : []
	},
	{
		/**
		 * Setup
		 */
		init : function(){
			this.draw(this.data);
		},
		
		draw : function(data){
			this.element.html(this.view(this.options.content, this.options));
			this.find('tbody tr:even').css('background-color','#E7E7E7');			
		},
		
		'th click' : function(el, ev){
			var self = this, 
			    field = el.attr('field'),			
			    tbody = this.find('tbody'),
				order;
			
			if(el.hasClass('ascending')){
				el.removeClass('ascending').find('.ui-icon').removeClass('ui-icon-arrow-1-n');
				el.addClass('descending').find('.ui-icon').addClass('ui-icon-arrow-1-s');
				order = 'descending';
			}else{
				el.removeClass('descending').find('.ui-icon').removeClass('ui-icon-arrow-1-s');
				el.addClass('ascending').find('.ui-icon').addClass('ui-icon-arrow-1-n');
				order = 'ascending';
			}	
				
		    tbody.find('tr').sort(this.callback('sort', field, order)).appendTo(tbody);
			
			this.find('tbody tr:even').css('background-color','#E7E7E7');
			this.find('tbody tr:odd').css('background-color','#FFFFFF');					
		},
		
	    /**
	     * Guesses at the type of an object.  This is useful when you want to know more than just typeof.
	     * @param {Object} object the object you want to test.
	     * @return {String} one of string, object, date, array, boolean, number, function
	     */
	   	guessType : function(object){
		    if(typeof object != 'string'){
		        if(object == null) return typeof object;
		        if( object.constructor == Date ) return 'date';
		        if(object.constructor == Array) return 'array';
		        return typeof object;
		    }
			if(object == "") return 'string';
		    //check if true or false
		    if(object == 'true' || object == 'false') return 'boolean';
		    if(!isNaN(object)) return 'number'
		    return typeof object;
		},		
		
		getValue : function(tr, field){
			return $(tr).find('td[field="'+field+'"]').html();
		},
		
		sort : function(field, order, a, b){
			var a = this.getValue(a, field);
			var b = this.getValue(b, field);
				
			if (this.guessType(a) === 'date' && this.guessType(b) === 'date') {
			    if(order === 'ascending') return new Date(a) > new Date(b) ? 1 : -1;
				return new Date(a) < new Date(b) ? 1 : -1;
			}
				
            if (this.guessType(a) === 'number' && this.guessType(b) === 'number') {
				if(order === 'ascending') return parseFloat(a) > parseFloat(b) ? 1 : -1;
				return parseFloat(a) < parseFloat(b) ? 1 : -1;
			}
				
			if(order === 'ascending') return a > b ? 1 : -1;
			return a < b ? 1 : -1;
		},
		
		".search_box input keypress" : function(el, ev){
            //if(ev.keyCode == 13 || ev.keyCode == 10){
                this.search(el.val());
            //}
        },
		
		search : function(text){
			this.find('tbody tr').each(function(i, tr){
				var match = false;
			    $(tr).find('td').each(function(j, td){
					if($.String.include($(td).html(), text)) match = true;
				});
				match ? $(tr).show() : $(tr).hide()
			});
			
			this.find('tbody tr:even').css('background-color','#E7E7E7');
			this.find('tbody tr:odd').css('background-color','#FFFFFF');					
		},
		
		'th mouseover' : function(el, ev){
			el.addClass("ui-state-hover");
			el.css("cursor","pointer");
		},
		
		'th mouseout' : function(el, ev){
			el.removeClass("ui-state-hover");
			el.css("cursor","");			
		},
		
		'tbody tr mouseover' : function(el, ev){
			el.addClass("ui-state-hover");
			el.css("cursor","pointer");
		},
		
		'tbody tr mouseout' : function(el, ev){
			el.removeClass("ui-state-hover");
			el.css("cursor","");			
		}				
    
	});
	


});
