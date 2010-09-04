steal.plugins('phui/combobox').then(function(){

    $.Controller.extend("Phui.Combobox.Select", {
    },
	{
        setup: function(el, options){
			if(el.nodeName == "SELECT"){
				el = $(el);
				var id = el.attr("id"), 
					className = el.attr("class"),
					name = el.attr("name");
					
				var input = $("<input type='text' />")
							.attr("id", id)
							.attr("name", name)
							.attr("className", className)
							
				var items = [], option, $option;
				el.find("option").each(function(){
					$option = $(this);
					option = {
						value: $option.attr("value"),
						text: $option.html()
					}
					if($option.attr("selected"))
						option.selected = true;
					items.push(option)
				})
				el.after(input);
				el.remove();
				input.phui_combobox(
					 $.extend( options, { items: items } )               
				 );

		    	this._super(input[0], options);	
			}
		}
	});

});