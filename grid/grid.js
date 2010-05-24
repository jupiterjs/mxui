steal.plugins('jquery/controller', 
			  'jquery/view/ejs', 
			  'jquery/event/drag', 
			  //'phui/paginator/page', 
			  "jquery/dom/dimensions",
			  "phui/filler").then(function ($)
{
    $.Controller.extend("Phui.Grid", {
        defaults: {
            columns: null,
            limit: null,
            offset: null,
            types: [],
            order: [],
            group: [],
            model: null,
			hoverClass: "hover", 
            display: {},
            //paginatorType: Phui.Paginator.Page,
			renderer : function(inst, options, i){
				return $.View("//phui/grid/views/row",{ item: inst, options: options, i: i })
			}
        },
        listensTo: ["paginate"]

    }, {
        init: function ()
        {
            //make the request ....
            //this.options.model.findAll(this.params(), this.callback('found'));
            this.element.addClass("grid")
            this.element.html("//phui/grid/views/init",this);
            this.element.find('.innerBody').phui_filler({ parent: this.element })
            this.findAll();
            //draw basic....
            this.widths = {};

            this.bind(this.element.children('.body').children().eq(0), "scroll", "bodyScroll")
            this.delegate(this.element.find('.header tr'), "th", "mousemove", "th_mousemove");
            //this.paginator().mixin(this.options.paginatorType);
            this.element.parent().trigger('resize');
        },
        windowresize: function ()
        {
            var body = this.element.children('.body'),
                    header = this.element.children(".header");
            body.hide();
            header.hide();
            var footer = this.element.children(".footer").width();
            var table = body.find('table').width(footer > 0 ? footer - 20 : 20);
            body.children().eq(0).width(footer > 20 ? footer  : 20);
            header.width(footer > 20 ? footer : 20);
            body.show();
            header.show();
			if(table.height() < body.height()){
				table.width(footer > 0 ? footer  : 20)
			}
        },
		/**
		 * Listens for page events
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} data
		 */
        paginate: function (el, ev, data)
        {
            if (typeof data.offset == "number" && this.options.offset != data.offset)
            {
                data.offset = Math.min(data.offset, Math.floor(this.options.count / this.options.limit) * this.options.limit)

                this.options.offset = data.offset;
                //update paginators
                this.findAll();
            }
        },
        ".pagenumber keypress": function (el, ev)
        {
            if (ev.charCode && !/\d/.test(String.fromCharCode(ev.charCode)))
            {
                ev.preventDefault()
            }
        },
        ".pageinput form submit": function (el, ev)
        {
            ev.preventDefault();
            var page = parseInt(el.find('input').val(), 10) - 1,
				offset = page * this.options.limit;

            this.element.trigger("paginate", {
                offset: offset
            })
        },
        findAll: function ()
        {
            this.element.trigger("updating")
			this.element.children('.body').find("table").html("<tbody><tr><td>Loading ...<td></tr></tbody>")
            this.options.model.findAll(this.params(), this.callback('found'));
        },
        /*paginator: function ()
        {
            return this.element.children('.footer').find(".gridpages")
        },*/
        found: function (items)
        {
            if (!this.options.columns)
            {
                var columns = (this.options.columns = {})
                $.each(this.options.model.attributes, function (name, type)
                {
                    if (name != "id")
                        columns[name] = $.String.capitalize(name)
                })
            }
            this.options.count = items.count;


            var body = this.element.children('.body')

            //draw column with set widths
            body.find("table").prepend('//phui/grid/views/columns', {
                columns: this.options.columns,
                widths: this.widths, 
                group: this.group
            })
            var tbody = body.find("tbody").html('//phui/grid/views/body', {
                options: this.options,
                items: items
            })

            tbody.find("tr.spacing").children("th").each(function ()
            {
                var $td = $(this),
					$spacer = $td.children().eq(0),
					width = $spacer.outerWidth(), height = $spacer.outerHeight();
                $td.css({ padding: 0, margin: 0 })
                $spacer.outerWidth(width + 2).css("float", "none").html("").height(1)
            })
            //var mainPaginator = this.paginator().controller()
            //mainPaginator.update(this.params());
            //var foot = this.element.children('.footer')
            //foot.find('input').val(mainPaginator.currentPage + 1)
            //foot.find('.pagelisting').html("<label>" + $T("page") + " " + (mainPaginator.currentPage + 1) + " " + $T("of") + " " + mainPaginator.totalPages + " (" + this.options.count + " records)</label>")
            this.element.trigger("updated", { params: this.params(), items: items })

            //do columns ...
            this.element.children('.header').find("tr").html('//phui/grid/views/header',this);
            tbody.trigger("resize")
            setTimeout(this.callback('sizeTitle'), 1)
        },
        sizeTitle: function ()
        {
            var body = this.element.children('.body'),
				first = body.find("tbody").find("tr:first").children(),
				header = this.element.children('.header'),
				title = this.element.children('.header').find("th");


            for (var i = 0; i < title.length; i++)
            {
                if (i < title.length - 1)
                {
                    title.eq(i).outerWidth(first.eq(i).outerWidth());
                }

            }
            header.find("table").width(body.find("table").width() + 40) //extra padding for scrollbar

            this.titleSized = true;
        },
        params: function ()
        {
            return $.extend({}, this.options.params, {
                order: this.options.order,
                offset: this.options.offset,
                limit: this.options.limit,
                group: this.options.group,
                count: this.options.count
            })
        },
        resize: function ()
        {
            this.find("div.innerBody").height(0)
            if (this.titleSized)
            {
                setTimeout(this.callback('sizeTitle'), 1)
            } else
            {
                setTimeout(this.callback('windowresize'), 1)
            }
        },
        bodyScroll: function (el, ev)
        {
            this.element.children(":first").scrollLeft(el.scrollLeft())
        },
        "th mouseenter": function (el)
        {
            el.addClass("hover")
        },
        "th mouseleave": function (el)
        {
            el.removeClass("hover")
        },
	     "th click": function (el, ev) {
	
	          var attr = el[0].className.match(/([^ ]+)-column-header/)[1];
	          var sort = el.hasClass("sort-asc") ? "desc" : "asc"
	          //see if we might already have something with this
	          var i = 0;
	          while (i < this.options.order.length) {
	              if (this.options.order[i].indexOf(attr + " ") == 0) {
	                  this.options.order.splice(i, 1)
	              } else {
	                  i++;
	              }
	          }
	          if (!el.hasClass("sort-desc")) { // otherwise reset this column's search
	              this.options.order.unshift(attr + " " + sort)
	          }
	          this.findAll();
	     },
        "th dragdown": function (el, ev, drag)
        {
            if (this.isMouseOnRight(el, ev, 2))
            {
                var resize = $("<div id='column-resizer'/>").appendTo(document.body).addClass("column-resizer");
                var offset = el.offset();

                resize.height(this.element.children(".body").outerHeight() + el.outerHeight()).outerWidth(el.outerWidth());
                resize.css(offset)
                ev.preventDefault();
				//prevent others from dragging
            } else
            {
                drag.cancel();
            }
        },
        "th dragmove": function (el, ev, drag)
        {
			ev.preventDefault();
            var width = ev.vector().minus(el.offsetv()).left();

            if (width > el.find("span:first").outerWidth())
                $("#column-resizer").width(width)
        },
        "th dragend": function (el, ev, drag)
        {
            ev.preventDefault();
            var width = ev.vector().minus(el.offsetv()).left(),
				attr = el[0].className.match(/([^ ]+)-column-header/)[1],
				cg;
            if (width > el.find("span:first").outerWidth())
                cg = this.element.find("colgroup:eq(" + el.index() + ")").outerWidth(width)
            else
            {
                cg = this.element.find("colgroup:eq(" + el.index() + ")").outerWidth(el.find("span:first").outerWidth())
            }
            this.widths[attr] = cg.width();
            setTimeout(this.callback('sizeTitle'), 1)
            $("#column-resizer").remove();
        },
        th_mousemove: function (el, ev)
        {
            if (this.isMouseOnRight(el, ev))
            {
                el.css("cursor", "e-resize")
            } else
            {
                el.css("cursor", "")
            }
        },
        isMouseOnRight: function (el, ev, extra)
        {
            return el.offset().left + el.outerWidth() - 8 - (extra || 0) < ev.vector().left()
        },
        sortedClass: function (attr)
        {
            var i = 0;
            for (var i = 0; i < this.options.order.length; i++)
            {
                if (this.options.order[i].indexOf(attr + " ") == 0)
                {
                    return "sort-" + this.options.order[i].split(" ")[1]
                }
            }
            return "";
        },
        replace: function(el, message){
            var html = this._renderMessages([message]);
            el.replaceWith(html.join(''));
            this.element.trigger('resize');
        },
        insert: function (el, messages)
        {
            var html = this._renderMessages(messages);
            el.after(html.join(''));
            this.element.trigger('resize');
        },
        _renderMessages: function (items) {
            var html = [], i, item;
            var options = $.extend(true, {}, this.options, {
                renderPartial: true
            })
            for(i =0; i < items.length; i++){
	            item = items[i]
	            html.push(this.options.renderer(item, options, i, items))
            }
            return html;
        },
		update : function(options){
			$.extend(this.options, options)
			this.findAll();
		},
        "tr mouseenter": function(el, ev){
            el.addClass(this.options.hoverClass);
        },
        "tr mouseleave": function (el, ev) {
            el.removeClass(this.options.hoverClass);
        }
    })

})
.views("//phui/grid/views/body.ejs",
       "//phui/grid/views/columns.ejs",
       "//phui/grid/views/header.ejs",
       "//phui/grid/views/init.ejs",
       "//phui/grid/views/row.ejs"
       )
