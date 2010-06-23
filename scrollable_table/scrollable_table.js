steal.plugins('jquery/controller','phui/filler','phui/scrollbar_width').then(function($){
	
//needs to work from a table, but also if there is no table ...
//	

$.Controller.extend("Phui.ScrollableTable",{
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
		// we need to keep this guy the right size
		this.cache.scrollBody.css('overflow','auto');
		
		
		this.cache.thead = this.cache.table.children('thead').remove();
		this.cache.headTable = this.cache.thead.wrap('<table/>').parent();
		this.cache.head = $("<div class='header'></div>").css("visibility","hidden").prependTo(this.element).append(this.cache.headTable);
		this.cache.head.css("overflow","hidden")
		this.cache.footer = $("<div class='footer'/>").appendTo(this.element);
		
		// add representations of the header cells to the bottom of the table
		var spacer = this.cache.thead.children(0).clone()
			.addClass('spacing')
			.appendTo(this.cache.tbody)
		// wrap contents with a spacing
		spacer.children("th, td").each(function () { 
			var td = $(this);
			td.html("<div class='spacer'>"+td.html()+"</div>")
		})
		//now set spacing, and make minimal height
		spacer.children("th, td").each(function () {
			var $td = $(this),
				$spacer = $td.children().eq(0),
				width = $spacer.outerWidth(), 
				height = $spacer.outerHeight();
			$td.css({ padding: 0, margin: 0 })
			
			$spacer.outerWidth(width + 2).css({
				"float": "none",
				"visibility": "hidden"
			}).html("").height(1)
		})
		
		
		
		// fill up the parent
		this.element.phui_filler();
		
		//make the scroll body fill up all other space
		this.cache.scrollBody.phui_filler({ parent: this.element })
		//this.element.parent().triggerHandler('resize')
		
		//make a quick resize
		this.element.parent().triggerHandler("resize");
		//then redraw the titles
		
		setTimeout(this.callback('sizeTitle'), 1);
		
		this.bind(this.cache.scrollBody, "scroll", "bodyScroll")
	},
	resize: function () {
		clearTimeout(this._windowTimeout)
		clearTimeout(this._sizeTitleTimeout)
		this.cache.scrollBody.height(0)
		if ( this.titleSized ) {
			this._windowTimeout = setTimeout(this.callback('windowresize'), 1)
			this._sizeTitleTimeout = setTimeout(this.callback('sizeTitle'), 3)
			
		} else {
			this._windowTimeout = this._windowTimeout = setTimeout(this.callback('windowresize'), 1)
		}
	},
	windowresize : function(){
		var body = this.cache.body,
			header = this.cache.head,
			hideHead = header.is(':visible');
		body.hide();
		if (hideHead) {
			header.hide();
		}
		var footer = this.cache.footer.width(),
			scrollbarWidth = Phui.scrollbarWidth,
			table = this.cache.table.width(footer  > scrollbarWidth ? footer - scrollbarWidth : scrollbarWidth);
		

		body.children().eq(0).width(footer > scrollbarWidth ? footer : scrollbarWidth);
		header.width(footer > scrollbarWidth ? footer : scrollbarWidth);
		body.show();
		if (hideHead) {
			header.show();
		}
		if (table.height() < body.height()) {
			table.width(footer > 0 ? footer : scrollbarWidth)
		}
	},
	sizeTitle: function () {

		var body = this.cache.body,
			firstWidths = this.cache.tbody.find("tr:first").children().map(function () { return $(this).outerWidth() }),
			header = this.cache.head,
			title = this.cache.head.find("th, td"); //in case they use tds

		for (var i = 0; i < title.length -1 ; i++) {
			 title.eq(i).outerWidth(firstWidths[i]);
		}
		header.find("table").width(this.cache.table.width() + Phui.scrollbarWidth) 
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