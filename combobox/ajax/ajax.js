steal.plugins('phui/combobox')
    .then("//phui/combobox/models/item")
    .then(function($){

    Phui.Combobox.extend("Phui.Combobox.Autosuggest",{
    },
    {
        autocomplete : function(val) {
            this.find(".phui_combobox_ajax").trigger("autocomplete", [val, this]);
        }
    });


    $.Controller.extend("Phui.Combobox.Ajax", {
        listensTo : ["autocomplete"]
    },
    {
        setup : function(el, options) {
            if (el.nodeName == "INPUT") {
                var el = $(el);
                var id = el.attr("id"),
                    className = el.attr("class"),
                    name = el.attr("name");
                
                var input = $("<input type='text' />")
                    .attr("id", id)
                    .attr("name", name)
                    .attr("className", className);
                
                el.after(input);
                el.remove();
                input.phui_combobox_autosuggest(options);
                this._super(input[0], options);
            }
        },
        autocomplete : function(el, ev, val, combobox) {
             $.ajax({
                url: this.options.url,
                type: 'get',
                dataType: 'json',
                data: {"val": val},
                success: this.callback('showData', combobox),
                //error: error,
                fixture: "-items"
            })    
        }, 
        showData : function(combobox, matches) {
            matches = matches.data ? matches.data : matches;
            combobox.loadData(matches);
        }        
    });
    
});