steal.plugins('phui/combobox')
    .then(function($){

    Phui.Combobox.extend("Phui.Combobox.Wrapper",{
    },
    {
        focusInputAndShowDropdown : function(el) {
            this._super(el);
            this.find(".phui_combobox_ajax").trigger("comboboxFocusInput", this);
        },
        autocomplete : function(val) {
            if (this.options.loadOnDemand) {
                this._super(val);
            }
            else {
                this.find(".phui_combobox_ajax").trigger("autocomplete", [this, val]);
            }
        }
    });


    $.Controller.extend("Phui.Combobox.Ajax", {
        defaults : {
            loadOnDemand : true
        },
        listensTo : ["comboboxFocusInput", "autocomplete"]
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
			if (this.options.loadOnDemand && !this.dataAlreadyLoaded && !this.notFirstFocus) {
				this.loadDataFromServer(combobox);
				this.notFirstFocus = true;
			}			
        },
        autocomplete : function(el, ev, combobox, val) {
            if (this.options.autocompleteEnabled && !this.timeout) {
                this.loadDataFromServer(combobox, val);
                this.timeout = true;
                var self = this;
                setTimeout(function(){
                    self.timeout = false;
                }, 100);
            }
        },
        loadDataFromServer : function(combobox, params) {
             $.ajax({
                url: this.options.url,
                type: 'get',
                dataType: 'json',
                data: params || 'findAll',
                success: this.callback('showData', combobox),
                error: this.callback('loadDataFromServerError'),
                fixture: "-items"
            })                
        },
        showData : function(combobox, data) {
            data = data.data ? data.data : data;
            combobox.loadData(data);
            this.dataAlreadyLoaded = true;
        },
        loadDataFromServerError : function() {
            alert("There was an errror getting data from the server.");
        }
    });
    
});