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
        },
        loadAutocompleteData : function(data) {
            // create model instances from items
            var instances = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                
                if (typeof item === "string") {
                    item = {
                        "text": item
                    };
                    item["id"] = i;
                    item["value"] = i;
                    item["enabled"] = true;
                    item["level"] = 0;
                    item["children"] = [];
                }
                
                // add reasonable default attributes
                if (typeof item === "object") {
                    if (item.id === undefined) 
                        item.id = item.value;
                    if (item.enabled === undefined) 
                        item.enabled = true;
                    if (item.children === undefined) 
                        item.children = [];
                }
                instances.push(item);
            }
            
            // wrap input data item within a combobox.models.item instance so we 
            // can leverage model helper functions in the code later             
            instances = Combobox.Models.Item.wrapMany(instances);
            this.modelList = new $.Model.List(instances);            
            
            // render the dropdown and set an initial value for combobox
            this.dropdown.controller().draw( this.modelList, this.options.showNested, true );
        },
        val: function(value){
            if(!value && value != 0) 
                return this.currentValue;
                
            var item = this.modelList.match("value", value)[0];
            if (item && item.enabled) {
                this.currentValue = item.value;
                this.find("input[type=text]").val(item.text);
                
                // higlight the activated item
                this.modelList.each(function(i, item){
                    item.attr("activated", false)
                })
                item.attr("activated", true);                    
                                     
                this.dropdown.controller().draw( this.modelList, this.options.autocompleteEnabled );                
                
                // bind values to the hidden input
                this.find("input[name='" + this.oldElementName + "']").val(this.currentValue);            
                
                this.element.trigger("change", this.currentValue);                
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
            if (this.options.loadOnDemand && !this.notFirstFocus) {
                this.loadDataFromServer(combobox);
                this.notFirstFocus = true;
            }
        },
        autocomplete : function(el, ev, combobox, val) {
            if (this.options.autocompleteEnabled && !this.timeout) {
                this.loadDataFromServer(combobox, val, true);
                this.timeout = true;
                var self = this;
                setTimeout(function(){
                    self.timeout = false;
                }, 100);
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
            if (isAutocompleteData) {
                combobox.loadAutocompleteData(data);
            }
            else {
                combobox.loadData(data);
                this.dataAlreadyLoaded = true;
            }
        },
        loadDataFromServerError : function() {
            alert("There was an errror getting data from the server.");
        }
    });
    
});