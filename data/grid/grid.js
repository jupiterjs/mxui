steal.plugins('mxui/layout/table_scroll',
	'mxui/data',
	'jquery/controller/view',
	'jquery/view/ejs',
	'mxui/data/order').then(function($){
	/**
	 * A simple data grid that is paginate-able and sortable.
	 * 
	 * ## Use
	 * 
	 * Add the grid to a div (or other element) like:
	 * 
	 *     $('#grid').mxui_data_grid({
	 *     
	 *       model : Recipe,		   // a model to use to make requests
	 *       
	 *       params : new Mxui.Data,   // a model to use for pagination 
	 *                                 // and sorting values
	 *       
	 *       row : "//path/to/row.ejs" // a template to render a row with
	 *       
	 *       columns : {               // column titles
	 *         title : "Title",
	 *         date : "Date"
	 *       }
	 *     })
	 *   
	 * The grid will automatically 'fill'
	 * its parent element's height.
	 * 
	 * 
	 */
	
	$.Controller.extend("Mxui.Data.Grid",{
		defaults: {
			columns: {},
			params: new Mxui.Data,
			row : null,
			model : null
		}
	},
	{
		init : function(){
			//create the scrollable table
			var count = 0;
			for(var name in this.options.columns){
				count++;
			}
			this.element.append( this.view({columns: this.options.columns, count: count}) )
			this.element.children('table').mxui_layout_table_scroll();
			
			this.find('thead').mxui_data_order({params: this.options.params})
			this.scrollable = this.element.children(":first").controller(Mxui.Layout.TableScroll);
			
			//this.scrollable.cache.thead.mxui_layout_resizer({selector: "th"});
			this.element.addClass("grid").mxui_layout_fill();
			//this.setFixedAndColumns()
			
			
			this.options.model.findAll(this.options.params.attrs(), this.callback('list'))
		},
		list : function(items){
			this.curentParams = this.options.params.attrs();
			
			var tbody = this.clear();
			tbody.html(this.view('list',{
				row : this.options.row,
				items: items
			})).trigger('resize');
			// draw in items
			this.options.params.attr('count',items.count)
		},
		"{params} updated.attr" : function(params, ev, attr, val){
			if(attr !== 'count'){
				//want to throttle for rapid updates
				clearTimeout(this.newRequestTimer,100)
				this.newRequestTimer = setTimeout(this.callback('newRequest'))
			}
		},
		newRequest : function(){
			this.options.model.findAll(this.options.params.attrs(), this.callback('list'))
		},
		/**
		 * Insert rows into the table
		 * @param {Object} row insert after this row
		 * @param {Object} newEls new elements to insert (they should be trs)
		 */
		insert: function( row, newEls ) {
			if(!newEls) {
				newEls = row;
				row = null;
			}
			if (row && row.length) {
				row.after(newEls);
			}
			else {
				this.find('.body tbody').append(newEls)
			}
		},
		// remove all content from the grid
		clear: function(){
			return this.find('.body tbody').html("");
		},
		
		// creates cols so this can be resized ...
		setFixedAndColumns : function(){
			/*var tbody = this.scrollable.cache.tbody,
				table = this.scrollable.cache.table,
				tr = tbody.children(":first"),
				children = tr.children(),
				fragment = document.createDocumentFragment();
			for(var i =0; i< children.length-1; i++){
				fragment.appendChild( $("<col/>").width(children.eq(i).outerWidth())[0]  )
			}
			table.prepend(fragment)
			table.css("tableLayout","fixed")*/
		}
	})
})
