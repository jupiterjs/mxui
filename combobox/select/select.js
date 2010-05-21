steal.plugins('phui/combobox').then(function(){

    $.Controller.extend("Phui.Combobox.Select", {
    },
	{
        init: function(){
			this.combobox = $("<div/>").phui_combobox( {items: this.options.options} );
			this.element.after(this.combobox);
			this.element.val( this.combobox.controller().val() );
			this.element.hide();
			
			this.bind(this.combobox , "change", "selected");
		},
		
		"selected" : function(el, ev, value) {
			this.element.val(value);
		}
	});

});