steal.plugins('mxui/layout/table_scroll',
	'mxui/data',
	'jquery/controller/view',
	'jquery/view/ejs',
	'mxui/data/order',
	'mxui/util/selectable').then(function($){
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
		
		this.$ = {};
		
		this.$.scrollableController = this.element.children(":first").controller(Mxui.Layout.TableScroll);
		this.$.tbody = this.find('.body tbody').mxui_util_selectable();
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
     * Listen for updates and replace the text of the list
     * @param {Object} called
     * @param {Object} item
     */
    "{model._shortName}.updated subscribe" : function(called, item){
        var el = item.elements(this.element).html(this.options.row, item);
        if(this.options.updated){
            this.options.updated(this.element, el, item)
        }
    },
    "{model._shortName}.created subscribe" : function(called, item){
        var newEl = $($.View(this.options.row,{
            items : [item],
            options: this.options
        })).hide()
        if(this.options.insert){
            this.options.insert(this.element, newEl, item)
        }else{
            this.insert(newEl).show()
			//newEl.appendTo(this.element).slideDown();
        }
    },
    "{model._shortName}.destroyed subscribe" : function(called, item){
        var el = item.elements(this.element)
        if(this.options.remove){
            this.options.remove(this.element,el, item)
        }else{
            el.slideUp( function(){
                el.remove();
            })
        }
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
			this.find('.body tbody').prepend(newEls)
		}
		return newEls;
	},
	// remove all content from the grid
	clear: function(){
		return this.$.tbody.html("");
	}

});

})
