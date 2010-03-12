steal.plugins('jquery/controller','jquery/view/ejs','jquery/event/default').then(function($){
	
	/**
	 * A Sortable, Filterable Datatable.
	 */
	$.Controller.extend('Phui.Datatable',
	{
		defaults : {
		},
		listensTo : []
	},
	{
		/**
		 * Setup
		 */
		init : function(){
			data = {
				'fields' : this.options.fields,
				'rows' : this.options.rows
			}
			this.element.html(this.view('//phui/datatable/table.ejs', data));
		}
	});

});
