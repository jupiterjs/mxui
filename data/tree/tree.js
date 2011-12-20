steal( 'jquery/controller',
	   'jquery/view/ejs',
	   'jquery/lang/observe/delegate',
	   'jquery/controller/view',
	   'jquery/view/ejs',
	   'mxui/data' )
	.then( './views/init.ejs', function($){

/**
 * @class Mxui.Data.Tree
 * @parent Mxui
 * API
 *     
 *     // create
 *     $('#tree').mxui_data_tree({model: Item});
 *     
 *     // activate - highlights a single item
 *     $('#tree').mxui_data_tree('activate',itemId)
 * 
 *     // expand - opens the content for a single item (pass in nothing for root)
 *     $('#tree').mxui_data_tree('expand',itemId)
 *     
 *     // collapse - closes the content for a single item
 *     $('#tree').mxui_data_tree('collapse',itemId)
 *     
 *     // move - moves one item to another folder
 *     $('#tree').mxui_data_tree('move', itemId, folderId);
 *     
 *     // toggle, rename, inline-create?
 *     
 * State ...
 * 
 *     {activated : id,
 *      expanded : {id: true},
 *      selected: {id : true},
 *      renaming: id }
 */
$.Controller('Mxui.Data.Tree',
/** @Static */
{
	defaults : {
		initialParams: {}, // default parameters to populate the initial tree
		parentId: 'parentId' // property on the model that identifies its parent
	}
},
/** @Prototype */
{
	init : function(){
		
	},
	modelId: function(model){
		return model[ model.Class.id ];
	},
	// typically want to know the difference ...
	"{state} expanded.* set" : function(state, ev, newVal){
		// check item is present in the dom
		var parentId = ev.lastAttr || null;
		
		if(newVal) {
			this.expand(parentId)
		} else {
			this.collapse(parentId)
		}
	},
	"{state} expanded.* remove" : function(state, ev){
		var parentId = ev.lastAttr || null;
		this.collapse(parentId);
	},
	"{state} activated set" : function(state, ev, newVal){
		this.activate(newVal);
	},
	activate : function(parentId){
		// inactiate previous
		this.find('.ui-state-active').removeClass('ui-state-active');
		this.elFor(parentId).closest('.name-wrapper').addClass('ui-state-active')
	},
	expand : function(parentId){
		var container = this.containerFor(parentId);
		this.toggleFor(parentId)
			.removeClass('ui-icon-carat-1-e')
			.addClass('ui-icon-carat-1-s')
		
		this.iconFor(parentId)
			.removeClass('ui-icon-folder-collapsed')
			.addClass('ui-icon-folder-open')
		if( container.children().length ) {
			// make sure to show it 
			container.show();
		} else {
			var params = $.extend({}, this.options.initialParams);
			if(parentId) {
				params[this.options.parentId] = parentId;
			}
			this.options.model.findAll(params, 
				this.proxy( function(items){
					var container = this.containerFor(parentId);
					container.html(this.view(this.options.view,items)).show();
					this.element.trigger('leafExpanded', container);
				})
			);
		}
	},
	collapse : function(parentId) {
		var container = this.containerFor(parentId)
		container.hide();
		this.toggleFor(parentId)
			.addClass('ui-icon-carat-1-e')
			.removeClass('ui-icon-carat-1-s');
		this.iconFor(parentId)
		   		.addClass('ui-icon-folder-collapsed')
				.removeClass('ui-icon-folder-open')
		this.element.trigger('leafCollapsed', container)
	},
	/**
	 * Finds the name element
	 * @param {Object} parentId
	 */
	elFor : function(parentId){
		var params = {};
		params[this.options.model.id] = parentId;
		return new this.options.model(params).elements(this.element);
	},
	/**
	 * Finds the toggle element
	 * @param {Object} parentId
	 */
	toggleFor : function(parentId){
		return this.elFor(parentId).parent().find('.ui-toggle')
	},
	/**
	 * Finds the toggle element
	 * @param {Object} parentId
	 */
	iconFor : function(parentId){
		return this.elFor(parentId).parent().find('.ui-item-icon')
	},
	/**
	 * Finds the sub-file container element
	 * @param {Object} parentId
	 */
	containerFor : function(parentId){
		return parentId === null ? this.element : this.elFor(parentId).parent().next();
	},
	checkVisible : function(id, cb){
		cb.call(this);
	},
	".ui-icon-carat-1-e click" : function(el){
		this.options.state.attr('expanded.'+this.modelId(el.nextAll('.' + this.options.model._shortName).model()),true)
	},
	".ui-icon-carat-1-s click" : function(el){
		this.options.state.removeAttr('expanded.'+this.modelId(el.nextAll('.' + this.options.model._shortName).model()))
	}
})


/**
 * Used to create lists 
 */
$.Controller('Mxui.Data.Tree.List',{
	
})



});