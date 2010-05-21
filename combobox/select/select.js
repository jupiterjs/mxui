steal.plugins('phui/combobox').then(function(){

    $.Controller.extend("Phui.Combobox.Select", {
    },
	{
        init: function(){
			if(this.element[0].nodeName == "SELECT"){
				var id = this.element.attr("id"), 
					className = this.element.attr("class"),
					name = this.element.attr("name");
					
				var input = $("<input type='text' />")
							.attr("id", id)
							.attr("name", name)
							.attr("className", className)
							
				var options = [], option, $option;
				this.element.find("option").each(function(){
					$option = $(this);
					option = {
						value: $option.attr("value"),
						text: $option.html()
					}
					if($option.attr("selected"))
						option.selected = true;
					options.push(option)
				})
				this.element.after(input);
				this.element.remove();
				input.phui_combobox(options);
			}
		}
	});

});