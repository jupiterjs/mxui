steal.plugins('jquery/controller',
			  'jquery/view/ejs').then(function(){
  	
	$.Controller.extend("Phui.Widget",{
		show : function(params){
			var folder = this.getFolder(), self = this;
			return {
				toString : function(dataViewId){
					return ["<div data-view-id='",dataViewId,"'>",$.View("//"+folder+"/show.ejs",params), "</div>"].join('')
				},
				hookup : function(el){
					return new self(el, params);
				}
			}
		},
		edit : function(params){
			var folder = this.getFolder(), self = this;
			return {
				toString : function(dataViewId){
					return ["<div data-view-id='",dataViewId,"'>",$.View("//"+folder+"/edit.ejs",params), "</div>"].join('')
				},
				hookup : function(el){
					return new self(el, params);
				}
			}
		}
	},{
		
		
	})
	
	
	EJS.Helpers.prototype.hookup = function(){
		return "data-view-id='"+this._data.dataViewId+"'"
	}
				
})