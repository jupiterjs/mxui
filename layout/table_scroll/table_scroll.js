steal.plugins('jquery/controller','mxui/layout/fill','mxui/util/scrollbar_width').then(function($){
	
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
		this.cache.scrollBody.css('overflow','auto');
		
		
		this.cache.thead = this.cache.table.children('thead').remove();
		this.cache.headTable = this.cache.thead.wrap('<table/>').parent();
		this.cache.head = $("<div class='header'></div>").css("visibility","hidden").prependTo(this.element).append(this.cache.headTable);
		this.cache.head.css("overflow","hidden")
		this.cache.footer = $("<div class='footer'/>").appendTo(this.element);
		
		// add representations of the header cells to the bottom of the table
		
		this.addSpacer();
		
		
		// fill up the parent
		this.element.mxui_layout_fill();
		
		//make the scroll body fill up all other space
		this.cache.scrollBody.mxui_layout_fill({ parent: this.element })
		//this.element.parent().triggerHandler('resize')
		
		//make a quick resize
		this.element.parent().triggerHandler("resize");
		//then redraw the titles
		console.log("init ...")
		setTimeout(this.callback('sizeTitle'), 1);
		
		this.bind(this.cache.scrollBody, "scroll", "bodyScroll")
	},
	addSpacer : function(){
		//check last element ...
		console.log('space ... ', this.cache.tbody.children(':last').hasClass('spacing'))
		if(this.cache.tbody.children(':last').hasClass('spacing')){
			return;
		}
		console.log('space')
		
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
	resize: function () {
		clearTimeout(this._windowTimeout)
		clearTimeout(this._sizeTitleTimeout)
		this.cache.scrollBody.height(0);
		this.addSpacer();
		
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
			scrollbarWidth = Mxui.scrollbarWidth,
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