steal.plugins('jquery/controller','jquery/view/ejs','jquery/event/drag').then(function($){
	$.Controller.extend("Phui.Grid",{
		defaults:{
			columns: null,
			limit: null,
			offset: null,
			types: [],
			order: [],
			group: [],
			model: null,
			display: {}
		}
		
	},{
		init : function(){
			//make the request ....
			//this.options.model.findAll(this.params(), this.callback('found'));
			this.findAll();
			//draw basic....
			this.element.$html(this.view());
			this.bind(this.element.children('.body'),"scroll","bodyScroll")
			this.delegate(this.element.find('.header tr'),"th","mousemove","th_mousemove")
		},
		findAll : function(){
			this.element.children('.body').find("table").html("<tbody><tr><td>Loading ...<td></tr></tbody>")
			this.options.model.findAll(this.params(), this.callback('found'));
		},
		found : function(items){
			if(!this.options.columns){
				var columns = (this.options.columns = {})
				$.each(this.options.model.attributes,function(name,type){
					if(name != "id")
						columns[name] = $.String.capitalize(name)
				})
			}
			//do columns ...
			this.element.children('.header').find("tr").html(this.view('header'));
			
			var body = this.element.children('.body')
			body.find("table").prepend(this.view('columns', this.options.columns))
			var tbody = body.find("tbody").html(this.view('body', {
				options: this.options,
				items: items
			}))
			tbody.find("tr.spacing").children("td").each(function(){
				var $td = $(this), 
					$spacer = $td.children().eq(0),
					width = $spacer.outerWidth(), height = $spacer.outerHeight();
				//console.log($td.text(),width)
				$td.css({padding: 0, margin: 0})
				$spacer.outerWidth(width+2).css("float","none").html("").height(1)
			})
			setTimeout(this.callback('sizeTitle'),1)
		},
		sizeTitle : function(){
			var body = this.element.children('.body'),
				first = body.find("tbody").find("tr:first").children(),
				header = this.element.children('.header'),
				title = this.element.children('.header').find("th");
				
				
			for(var i=0; i < title.length; i++){
				if(i < title.length - 1){
					
					title.eq(i).outerWidth(   first.eq(i).outerWidth() );
				}
					
			}
			header.find("table").width( body.find("table").width()+40) //extra padding for scrollbar
			
			this.titleSized = true;
		},
		params : function(){
			return {
				order: this.options.order,
				offset: this.options.ofset,
				limit: this.options.limit,
				group: this.options.group
			}
		},
		resize : function(){
			if(this.titleSized){
				setTimeout(this.callback('sizeTitle'),1)
			}
		},
		bodyScroll : function(el, ev){
			this.element.children(":first").scrollLeft(el.scrollLeft())
		},
		"th mouseenter" : function(el){
			el.addClass("hover")
		},
		"th mouseleave" : function(el){
			el.removeClass("hover")
		},
		"th click" : function(el, ev){
			var attr = el[0].className.match(/([^ ]+)-column-header/)[1];
			var sort = el.hasClass("sort-asc") ? "desc" : "asc"
			//see if we might already have something with this
			var i =0;
			while(i < this.options.order.length){
				if(this.options.order[i].indexOf(attr+" ") == 0){
					this.options.order.splice(i, 1)
				}else{
					i++;
				}
			}
			this.options.order.unshift(attr+" "+sort)
			console.log(this.options.order)
			this.findAll();
		},
		"th draginit" : function(el, ev, drag){
			
			if(this.isMouseOnRight(el, ev,2)){
				var resize = $("<div id='column-resizer'/>").appendTo(document.body).addClass("column-resizer");
				var offset = el.offset();
				
				resize.height( this.element.children(".body").outerHeight()+el.outerHeight() ).outerWidth(el.outerWidth());
				resize.css(offset)
				ev.preventDefault();
				
			}else{
				//enable resizing ...
				
				drag.cancel();
			}
			
			//somehow we need to tranfer this drag to something else ....
			//console.log(this.element.children(".body"))
			
		},
		"th dragmove" : function(el, ev, drag){
			ev.preventDefault();
			var width =  ev.vector().minus(el.offsetv()).left();
			
			if(width > el.find(":first").outerWidth())
				$("#column-resizer").width(width)
			//console.log(width)
		},
		"th dragend" : function(el, ev, drag){
			ev.preventDefault();
			var width =  ev.vector().minus(el.offsetv()).left();
			
			if(width > el.find(":first").outerWidth())
				this.element.find("colgroup:eq("+el.index()+")").outerWidth( width )
			else{
				this.element.find("colgroup:eq("+el.index()+")").outerWidth( el.find(":first").outerWidth() )
			}
			setTimeout(this.callback('sizeTitle'),1)
			$("#column-resizer").remove();
		},
		th_mousemove : function(el, ev){
			//console.log( el.offset().left + el.outerWidth()-6 , ev.vector().left()  )
			if(this.isMouseOnRight(el, ev)){
				el.css("cursor","e-resize")
			}else{
				el.css("cursor","")
			}
		},
		isMouseOnRight : function(el, ev, extra){
			return el.offset().left + el.outerWidth()-8 - (extra || 0) < ev.vector().left()
		},
		sortedClass : function(attr){
			var i =0;
			for(var i=0; i < this.options.order.length; i++){
				if(this.options.order[i].indexOf(attr+" ") == 0){
					return "sort-"+this.options.order[i].split(" ")[1]
				}
			}
			return "";
		}
	})
	
})
