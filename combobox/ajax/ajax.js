steal.plugins('phui/combobox')
    .then(function($){

    Phui.Combobox.extend("Phui.Combobox.Autosuggest",{
    },
    {
        focusInputAndShowDropdown : function(el) {
            this._super(el);
            this.find(".phui_combobox_ajax").trigger("comboboxFocusInput", this);
        }
    });


    $.Controller.extend("Phui.Combobox.Ajax", {
        defaults : {
            loadOnDemand : true
        },
        listensTo : ["comboboxFocusInput"]
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
        comboboxFocusInput : function(el, ev, combobox) {
            if( this.options.loadOnDemand && !this.dataAlreadyLoaded ) {
                this.loadDataFromServer(combobox);
            }
        },
        loadDataFromServer : function(combobox) {
             $.ajax({
                url: this.options.url,
                type: 'get',
                dataType: 'json',
                data: {},
                success: this.callback('showData', combobox),
                //error: error,
                fixture: "-items"
            })                
        },
        showData : function(combobox, data) {
            data = data.data ? data.data : data;
            combobox.loadData(data);
            this.dataAlreadyLoaded = true;
        }        
    });
    
});