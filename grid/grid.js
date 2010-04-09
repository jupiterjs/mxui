steal.plugins('jquery/controller','jquery/view/ejs','jquery/event/drag','phui/paginator/page',"jquery/dom/dimensions").then(function($){
	$.Controller.extend("Phui.Grid",{
		defaults:{
			columns: null,
			limit: null,
			offset: null,
			types: [],
			order: [],
			group: [],
			model: null,
			display: {},
			paginatorType : Phui.Paginator.Page
		},
		listensTo : ["paginate"]
		
	},{
		init : function(){
			//make the request ....
			//this.options.model.findAll(this.params(), this.callback('found'));
			this.element.addClass("grid")
			this.element.$html(this.view("//phui/grid/views/init.ejs"));
			this.element.find('.innerBody').phui_filler({parent: this.element})
			this.findAll();
			//draw basic....
			this.widths = {};
			
			this.bind(this.element.children('.body').children().eq(0),"scroll","bodyScroll")
			this.delegate(this.element.find('.header tr'),"th","mousemove","th_mousemove");
			this.paginator().mixin(this.options.paginatorType);
			this.element.parent().trigger('resize');
		},
		windowresize : function(){
			var body = this.element.children('.body'),
					header = this.element.children(".header");
			body.hide();
			header.hide();
			var footer = this.element.children(".footer").width();
			body.find('table').width(footer - 20);
			body.children().eq(0).width(footer);
			header.width(footer);
			body.show();
			header.show();
		},
		paginate : function(el, ev, data){
			if(typeof data.offset == "number" && this.options.offset != data.offset){
				data.offset = Math.min(data.offset, Math.floor(this.options.count / this.options.limit)* this.options.limit)
				
				this.options.offset = data.offset;
				//update paginators
				this.findAll();
			}
		},
		".pagenumber keypress" : function(el, ev){
			if(ev.charCode && !/\d/.test(String.fromCharCode(ev.charCode))){
				ev.preventDefault()
			}
		},
		"form.pageinput submit" : function(el, ev){
			ev.preventDefault();
			var page = parseInt(el.find('input').val(),10) - 1,
				offset = page*this.options.limit;
			
			this.element.trigger("paginate", {
				offset: offset
			})
		},
		findAll : function(){
			this.element.children('.body').find("table").html("<tbody><tr><td>Loading ...<td></tr></tbody>")

			this.options.model.findAll(this.params(), this.callback('found'));
		},
		paginator : function(){
			return this.element.children('.footer').find(".gridpages")
		},
		found : function(items){
			if(!this.options.columns){
				var columns = (this.options.columns = {})
				$.each(this.options.model.attributes,function(name,type){
					if(name != "id")
						columns[name] = $.String.capitalize(name)
				})
			}
			this.options.count = items.count;
			
			
			var body = this.element.children('.body')
			
			//draw column with set widths
			body.find("table").prepend(this.view('//phui/grid/views/columns.ejs', {
				columns: this.options.columns,
				widths: this.widths
			}))
			var tbody = body.find("tbody").$html(this.view('//phui/grid/views/body.ejs', {
				options: this.options,
				items: items
			}))
			
			tbody.find("tr.spacing").children("th").each(function(){
				var $td = $(this), 
					$spacer = $td.children().eq(0),
					width = $spacer.outerWidth(), height = $spacer.outerHeight();
				$td.css({padding: 0, margin: 0})
				$spacer.outerWidth(width+2).css("float","none").html("").height(1)
			})
			var mainPaginator = this.paginator().controller()
			mainPaginator.update(this.params());
			var foot = this.element.children('.footer')
			foot.find('input').val(mainPaginator.currentPage+1)
			foot.find('.pagelisting').html("<label>Page "+(mainPaginator.currentPage+1)+" of "+mainPaginator.totalPages+" ("+this.options.count+" records)</label>")
			this.element.trigger("updated", {params: this.params(), items: items})
			
			//do columns ...
			this.element.children('.header').find("tr").html(this.view('//phui/grid/views/header.ejs'));
			tbody.trigger("resize")
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
			return $.extend({},this.options.params,{
				order: this.options.order,
				offset: this.options.offset,
				limit: this.options.limit,
				group: this.options.group,
				count: this.options.count
			})
		},
		resize : function(){
			this.find("div.innerBody").height(0)
			if (this.titleSized) {
				setTimeout(this.callback('sizeTitle'), 1)
			} else {
				setTimeout(this.callback('windowresize'), 1)
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
			

			
		},
		"th dragmove" : function(el, ev, drag){
			ev.preventDefault();
			var width =  ev.vector().minus(el.offsetv()).left();
			
			if(width > el.find(":first").outerWidth())
				$("#column-resizer").width(width)
		},
		"th dragend" : function(el, ev, drag){
			ev.preventDefault();
			var width =  ev.vector().minus(el.offsetv()).left(),
				attr = el[0].className.match(/([^ ]+)-column-header/)[1],
				cg;
			if(width > el.find(":first").outerWidth())
				cg = this.element.find("colgroup:eq("+el.index()+")").outerWidth( width )
			else{
				cg = this.element.find("colgroup:eq("+el.index()+")").outerWidth( el.find(":first").outerWidth() )
			}
			this.widths[attr] = cg.width();
			setTimeout(this.callback('sizeTitle'),1)
			$("#column-resizer").remove();
		},
		th_mousemove : function(el, ev){
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
