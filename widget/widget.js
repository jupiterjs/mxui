steal.plugins('jquery/controller',
			  'jquery/view/ejs').then(function($){
  	
	
	
	
	$.Controller.extend("Phui.Widget",{
		view : function(options){
			var folder = this.getFolder(), self = this;
			var id = $.View.hookup(function(el){
				return new self(el, options);
			})
			return ["<div data-view-id='",id,"'>",
						$.View("//"+folder+"/view.ejs",{
							Class: self,
							options: options
						}), "</div>"].join('')
		}
	},{
	})
	
	
	$.View.EJS.Helpers.prototype.hookup = function(){
		return "data-view-id='"+this._data.dataViewId+"'"
	}

})