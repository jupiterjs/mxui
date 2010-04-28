steal.plugins('phui/grid','phui/paginator/page').then(function($){
	$.Controller.extend("Phui.Grid.Paginated",
	{
		defaults : {
			paginatorType : Phui.Paginator.Page,
			paginatorOptions : {},
			gridType :  Phui.Grid,
			gridOptions :{},
			pageListingText : function(params){
				var data = Phui.Paginator.pageData(params.params)
				return "<label>page " + (data.page + 1) + " of " + data.totalPages + " (" + params.params.count + " records)</label>"
			}
		},
		listensTo : ["updated"]
	},
	{
		init : function(){
			new this.options.gridType(this.element[0],this.options.gridOptions);
			this.element.find(".footer").replaceWith("//phui/grid/paginated/views/footer",{});
			new this.options.paginatorType(this.element.find(".gridpages")[0],this.options.paginatorOptions);
		},
		updated : function(el, ev, params){
			this.element.children(".footer").find(".pagelisting").html(
				this.options.pageListingText(params)
			)
			//update paginator
			this.element.find(".gridpages").controller().update(params.params)
		},
		".pagenumber keypress": function (el, ev)
        {
            if (ev.charCode && !/\d/.test(String.fromCharCode(ev.charCode)))
            {
                ev.preventDefault()
            }
        },
        "form.pageinput submit": function (el, ev)
        {
            ev.preventDefault();
            var page = parseInt(el.find('input').val(), 10) - 1,
				offset = page * this.options.gridOptions.limit;

            this.element.trigger("paginate", {
                offset: offset
            })
        }
	})
})
