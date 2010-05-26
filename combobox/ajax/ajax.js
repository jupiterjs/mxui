steal.plugins('phui/combobox')
    .then("//phui/combobox/models/item")
    .then(function($){

    $.Controller.extend("Phui.Combobox.Ajax", {
        defaults: {
			autocompleteEnabled: false,
            loadOnDemand: false
        }				
    },
	{
        init: function(){
	
		},
		focusin : function(el, ev) {
            // load items on demand
            if (this.options.loadOnDemand && !this.itemsAlreadyLoaded) {
				Combobox.Models.Item.url = this.options.url;
                Combobox.Models.Item.findAll(this.options.params || {}, this.callback("found"));												
            } 			
		},
		found : function(el, ev) {
			// this is where we store the loaded data in the controller			
			this.modelList = new $.Model.List(items);			
		}
	});
	
});