steal.plugins('mxui/layout/table_fill').then(function($){
	
//needs to work from a table, but also if there is no table ...
//	

$.Controller.extend("Mxui.Layout.TableScroll",{
	setup : function(el, options){
		//remove the header and put in another table
		
		this.cache = {
			table: $(el)
		}
		this.cache.scrollBody = this.cache.table.wrap("<div><div  class='body'><div class='scrollBody'></div></div></div>").parent()
		this.cache.body = this.cache.scrollBody.parent();

		this._super(this.cache.body.parent()[0], options)
		//wrap table with a scrollable div
		
		
	},
	init : function(){
		// body acts as a buffer for the scroll bar
		this.cache.body.css("width","100%");
		this.cache.tbody = this.cache.table.children('tbody')
		if(!this.cache.tbody.length){
			this.cache.tbody = $('<tbody/>')
			this.cache.table.append(this.cache.tbody)
		}
		// we need to keep this guy the right size
		//this.cache.scrollBody.css('overflow','auto');
		
		
		this.cache.thead = this.cache.table.children('thead').remove();
		this.cache.headTable = this.cache.thead.wrap('<table/>').parent();
		this.cache.head = $("<div class='header'></div>").css("visibility","hidden").prependTo(this.element).append(this.cache.headTable);
		this.cache.head.css("overflow","hidden")
		this.cache.footer = $("<div class='footer'/>").appendTo(this.element);
		
		// add representations of the header cells to the bottom of the table
		this.addSpacer();
		
		
		// fill up the parent
		//this.element.mxui_layout_fill();
		this.sizeTitle();
		//make the scroll body fill up all other space
		this.cache.scrollBody
			.mxui_layout_table_fill({ parent: this.element.parent() })
		this.bind(this.cache.scrollBody,"resize", "bodyResized")
		//this.element.parent().triggerHandler('resize')
		
		//make a quick resize
		//then redraw the titles

		
		this.bind(this.cache.scrollBody, "scroll", "bodyScroll")
	},
	addSpacer : function(){
		//check last element ...
		
		if(this.cache.tbody.children(':last').hasClass('spacing')){
			return;
		}
		
		var spacer = this.cache.thead.children(0).clone()
			.addClass('spacing');
			
		// wrap contents with a spacing
		spacer.children("th, td").each(function () { 
			var td = $(this);
			td.html("<div style='float:left'>"+td.html()+"</div>")
		});
		
		spacer.appendTo(this.cache.tbody);
		
		//now set spacing, and make minimal height
		spacer.children("th, td").each(function () {
			var $td = $(this),
				$spacer = $td.children(':first'),
				width = $spacer.outerWidth(), 
				height = $spacer.outerHeight();
			$td.css({ padding: 0, margin: 0 })
			
			$spacer.outerWidth(width + 2).css({
				"float": "none",
				"visibility": "hidden"
			}).html("").height(1)
		})
	},
	bodyResized : function(){
		this.sizeTitle();
	},
	sizeTitle: function () {

		var body = this.cache.body,
			firstWidths = this.cache.tbody.find("tr:first")
				.children()
				.map(function () { return $(this).outerWidth() }),
			header = this.cache.head,
			title = this.cache.head.find("th, td"); //in case they use tds

		for (var i = 0; i < title.length -1 ; i++) {
			 title.eq(i).outerWidth(firstWidths[i]);
		}
		var padding = 0;
		if (this.cache.table.height() >= body.height()) {
			padding = Mxui.scrollbarWidth
		}
		header.find("table").width(this.cache.table.width() + padding) 
		this.cache.head.css('visibility','visible')
		this.titleSized = true;
	},
	bodyScroll: function (el, ev) {
		this.cache.head.scrollLeft(el.scrollLeft())
	},
	destroy : function(){
		delete this.cache;
		this._super();
	}
})
	
	
})