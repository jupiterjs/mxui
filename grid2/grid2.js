steal.plugins('mxui/scrollable_table','mxui/resizer', 
	'jquery/controller/view',
	'jquery/view/ejs').then(function($){
	/**
	 * A simple grid.  A Table element is an input to this controller.
	 * A grid accepts a list of columns and titles like this:
	 *  @codestart
	 *  columns: {
	 *  	id: "ID",
	 *      title: "Title",
	 *      collection: "Collection",
	 *      mediaType: "Media Type"
	 *  }
	 *  @codeend
	 *  
	 *  Scrollable is added to each grid, which makes 
	 *  the header stay in place, while the body scrolls.
	 *  
	 *  Resizer is also added to each grid, which makes 
	 *  the columns resizeable by dragging.
	 */
	
	$.Controller.extend("Mxui.Grid2",{
		defaults: {
			columns: {}
		}
	},
	{
		setup: function(el, options){
			$(el).wrap("<div></div>")
			
			this._super($(el).parent()[0], options)
			//wrap table with a div (which will contain the scrollable table)
		},
		init : function(){
			//create the scrollable table
			var head = this.view('head', {columns: this.options.columns})
			this.element.find('table').prepend(head)
			
			this.element.children('table').mxui_scrollable_table()
			this.scrollable = this.element.children(":first").controller(Mxui.ScrollableTable);
			
			this.scrollable.cache.thead.mxui_resizer({selector: "th"});
			this.element.addClass("grid");
			this.setFixedAndColumns()
		},
		"th resize:end" : function(el, ev, outerwidth){
			var index = el.parent().find("th").index(el);
			this.scrollable.cache.table.find('col:eq('+index+')').width(outerwidth)
		},
		setFixedAndColumns : function(){
			var tbody = this.scrollable.cache.tbody,
				table = this.scrollable.cache.table,
				tr = tbody.children(":first"),
				children = tr.children(),
				fragment = document.createDocumentFragment();
			for(var i =0; i< children.length-1; i++){
				fragment.appendChild( $("<col/>").width(children.eq(i).outerWidth())[0]  )
			}
			table.prepend(fragment)
			table.css("tableLayout","fixed")
		}
	})
})
