steal.plugins('phui/combobox')
    .then(function ($)
    {


        $.Controller.extend("Phui.Combobox.Ajax", {
            defaults: {
                loadingMessage: "Loading ...",
                process: function (data)
                {
                    return data.data ? data.data : data;
                }
            }
        },
    {
        setup: function (el, options)
        {
            if (el.nodeName == "INPUT")
            {
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
                input.phui_combobox(options);
                this._super(input[0], options);
            }
        },
        "show:dropdown": function (el, ev, combobox, callback)
        {
            if ( !this.notFirstFocus )
            {
                combobox.dropdown().html("<center><h3>" + this.options.loadingMessage + "</h3></center>");
                this.loadDataFromServer( combobox, callback );
                this.notFirstFocus = true;
            }
        },
        loadDataFromServer: function (combobox, callback, params, isAutocompleteData)
        {
            $.ajax({
                url: this.options.url,
                type: 'post',
                //dataType: 'json',
                //data: params || "loadOnDemand",
                data: this.options.data,
                contentType: "application/json; charset=utf-8",
                success: this.callback('showData', combobox, isAutocompleteData, callback),
                error: this.callback('loadDataFromServerError'),
                fixture: "-items"
            })
        },
        showData: function (combobox, isAutocompleteData, callback, data)
        {
            data = data.d;
            combobox.loadData(this.options.process(data));
            combobox.dropdown().controller().draw( combobox.modelList );
            this.dataAlreadyLoaded = true;
			if( callback ) {
				callback( combobox.modelList );
			}
        },
        loadDataFromServerError: function (response)
        {
            alert(response.responseText);
        }
    });

    });