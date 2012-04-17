steal('mxui/layout/table_scroll',
	'mxui/data',
	'jquery/controller/view',
	'jquery/view/ejs',
	'mxui/data/order',
	'mxui/nav/selectable')
	.then('./views/th.ejs','./views/init.ejs','./views/list.ejs')
	.then(function($){
/**
 * @class Mxui.Data.Grid
 * @parent Mxui
 * 
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
 * @constructor
 * 
 * @param {Object} columns A object of columnName -> columnTitle pairs. Ex:
 * 
 *     columns : { title : "Title", date : "Date" }
 * 
 */

$.Controller.extend("Mxui.Data.Grid",{
	defaults: {
		columns: {},
		params: new Mxui.Data,
    initTemplate: '//mxui/data/grid/views/init.ejs',
    listTemplate: '//mxui/data/grid/views/list.ejs',
    titleTemplate: '//mxui/data/grid/views/th.ejs',
		rowTemplate : null,
		model : null,
		noItems : "No Items",
		// if true, can sort by multiple columns at a time
		multiSort: true,
		// if true, there are three states (asc, desc, no sort)
		canUnsort: true,
		// set to false for infinite scroll
		offsetEmpties: true,
		// set to false to turn off the filler
		filler: true,
		
		// immediately uses the  model to request items for the grid
		loadImmediate: true,
		selectable : true,

    // default crud manipulations

    refresh: function(tbody, elt, newElt){
      elt.replaceWith(newElt)
      tbody.resize()
    },
    append: function(tbody, newElt){
      tbody.prepend(newElt)
      tbody.resize()
    },
    remove: function(tbody, elt){
      elt.remove()
      tbody.resize()
    }

	},
	listensTo : ["select","deselect"]
},
{
	setup : function(el, options){
		// check params has attrs
		if(options && options.params && typeof options.params.attrs != 'function'){
			options.params = new Mxui.Data(options.params)
		}
		this._super.apply(this, arguments);
	},
	init : function(){
		//create the scrollable table
		var count = 0;
		for(var name in this.options.columns){
			count++;
		}
		this.element.append( this.view(this.options.initTemplate,{titleTemplate: this.options.titleTemplate, columns: this.options.columns, count: count}) )
		
		this.element.children('table').mxui_layout_table_scroll({
			filler: this.options.filler
		});
		this.$ = this.element.children(":first").controller(Mxui.Layout.TableScroll).elements()
		
		
		this.$.thead.mxui_data_order({
			params: this.options.params,
			multiSort: this.options.multiSort, 
			canUnsort: this.options.canUnsort
		})
		
		this.options.selectable && this.$.tbody.mxui_nav_selectable();
		//this.scrollable.cache.thead.mxui_layout_resizer({selector: "th"});
		this.element.addClass("grid");
		if (this.options.filler) {
			this.element.mxui_layout_fill();
		}
		//this.setFixedAndColumns()
		
		// add jQuery UI stuff ...
		this.element.find(".header table").attr('cellSpacing', '0').attr('cellPadding', '0');
		
		var ths = this.$.thead.find('th').addClass("ui-helper-reset ui-state-default");
		
		ths.eq(0).addClass('ui-corner-left')
		ths.eq(-1).addClass('ui-corner-right')

		
		if(this.options.loadImmediate){
			this.options.model.findAll(this.options.params.attrs(), this.callback('list', true))
		}
		
	},
	/**
	 * 
	 * @param {Object} clear if this is true, clear the grid and create a new one, else insert
	 * @param {Object} items
	 */
	list : function(clear, items){
		this.curentParams = this.options.params.attrs();
		
		this.options.params.attr('updating', false);
		
		var trs = $(this.view(this.options.listTemplate,{
			rowTemplate : this.options.rowTemplate,
			items: items
		}));
		
		if(clear){
			this.empty();
		}

		this.append(trs);
		// update the items
		this.options.params.attr('count',items.count)
	},
	"{params} updated.attr" : function(params, ev, attr, val){
		if(attr !== 'count' && attr !== 'updating'){
			//want to throttle for rapid updates
			params.attr('updating', true)
			clearTimeout(this.newRequestTimer)
			this.newRequestTimer = setTimeout(this.callback('newRequest', attr, val), 100)
		}
	},
	newRequest : function(attr, val){
		var clear = true;
		if(!this.options.offsetEmpties && attr == "offset"){ // if offset changes and we have offsetEmpties false
			clear = false;
		} 
	  this.makeRequest(clear)
	},
  makeRequest: function(clear){
    this.options.model.findAll(this.options.params.attrs(), this.callback('list', clear))
  },
  _getRows: function(viewTemplateOption, items){
    items = ( $.isArray(items) || items instanceof $.Model.List ) ? items : [items]
    return $(this.view(this.options.listTemplate,{
      rowTemplate : this.options[viewTemplateOption],
      items: items
    }, { columns: this.options.columns, renderer: this.options.renderer } ));
  },

    /**
     * Listen for updates and replace the text of the list
     * @param {Object} called
     * @param {Object} item
     */
    "{model} updated" : function(model, ev, item){
        var el = item.elements(this.element)
        if (el.length > 0){
          var newElt= this._getRows('rowTemplate', item)
          this.options.refresh(this.$.tbody, el, newElt)
        }
    },
    "{model} created" : function(model, ev, item){
        var newEl = this._getRows('rowTemplate', item)
        this.options.append(this.$.tbody, newEl)
    },
    "{model} destroyed" : function(model, ev, item){
        var el = item.elements(this.element)
        this.options.remove(this.$.tbody, el)
    },
	/**
	 * Insert rows into the table
	 * @param {Object} row insert after this row
	 * @param {Object} newEls new elements to insert (they should be trs)
	 */
	append: function( row, newEls ) {
		if( !newEls ) {
			newEls = row;
			row = undefined;
		}
		this.element.children(":first").mxui_layout_table_scroll("append",  newEls, row)
	},
	/**
	 * Remove all children from the table
	 */
	empty: function(){
		this.element.children(".mxui_layout_table_scroll").mxui_layout_table_scroll("empty")
	},

	"select" : function(el, ev){
		ev.preventDefault();
	},
	"deselect" : function(el, ev){
		ev.preventDefault();
	}

});

})
