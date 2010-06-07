steal.plugins('phui/combobox')
    .then(function($){

    Phui.Combobox.extend("Phui.Combobox.Wrapper",{
    },
    {
        focusInputAndShowDropdown : function(el) {
            this._super(el);
            this.find(".phui_combobox_ajax").trigger("comboboxFocusInput", this);
        }
    });


    $.Controller.extend("Phui.Combobox.Ajax", {
        defaults : {
            loadOnDemand : true,
            loadingMessage: "Loading ..."
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
                input.phui_combobox_wrapper(options);
                this._super(input[0], options);
            }
        },
        comboboxFocusInput : function(el, ev, combobox) {
            if (this.options.loadOnDemand && !this.notFirstFocus) {
                combobox.dropdown.html("<center><h3>" + this.options.loadingMessage + "</h3></center>");
                this.loadDataFromServer(combobox);
                this.notFirstFocus = true;
            }
        },
        loadDataFromServer : function(combobox, params, isAutocompleteData) {
             if(this.options.loadOnDemand) 
                 params = "loadOnDemand";
             
             $.ajax({
                url: this.options.url,
                type: 'get',
                dataType: 'json',
                data: params,
                success: this.callback('showData', combobox, isAutocompleteData),
                error: this.callback('loadDataFromServerError'),
                fixture: "-items"
            })                
        },
        showData : function(combobox, isAutocompleteData, data) {
            data = data.data ? data.data : data;
            combobox.loadData(data);
            this.dataAlreadyLoaded = true;
        },
        loadDataFromServerError : function() {
            alert("There was an errror getting data from the server.");
        }
    });
    
});