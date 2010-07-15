steal.plugins('jquery/controller',
			  'jquery/view/ejs',
			  'jquery/event/drag',
//'phui/paginator/page', 
			  "jquery/dom/dimensions",
			  "phui/filler",
			  "phui/scrollbar_width").then(function ($) {
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
		  renderer: function (inst, options, i, items) {
			  return $.View("//phui/grid/views/row", { item: inst, options: options, i: i, items: items })
		  },
		  noItems: "No Items Found."
	  },
	  listensTo: ["paginate"]

  }, {
	  init: function () {
		  //make the request ....
		  //this.options.model.findAll(this.params(), this.callback('found'));
		  this.element.addClass("grid")
		  this.element.html("//phui/grid/views/init", this);

		  //save references to important internals to avoid queries
		  this.cached = {
			  body: this.element.children('.body'),
			  header: this.element.children(".header"),
			  footer: this.element.children(".footer")
		  }
		  this.cached.innerBody = this.cached.body.find('div.innerBody');
		  this.cached.table = this.cached.body.find('table');
		  this.cached.tbody = this.cached.body.find('tbody');
		  this.cached.innerBody.phui_filler({ parent: this.element })
		  this.findAll();
		  //draw basic....
		  this.widths = {};

		  this.bind(this.cached.body.children().eq(0), "scroll", "bodyScroll")
		  this.delegate(this.cached.header.find('tr'), "th", "mousemove", "th_mousemove");

		  //


		  //this.paginator().mixin(this.options.paginatorType);
		  this.element.parent().trigger('resize');
	  },
	  windowresize: function () {
		  var body = this.cached.body,
				header = this.cached.header,
				hideHead = header.is(':visible');
		  body.hide();
		  if (hideHead) {
			  header.hide();
		  }
		  var footer = this.cached.footer.width(),
		  	  scrollbarWidth = Phui.scrollbarWidth;
		  var table = body.find('table').width(footer  > scrollbarWidth ? footer - scrollbarWidth : scrollbarWidth);
		  body.children().eq(0).width(footer > scrollbarWidth ? footer : scrollbarWidth);
		  header.width(footer > scrollbarWidth ? footer : scrollbarWidth);
		  body.show();
		  if (hideHead) {
			  header.show();
		  }
		  if (table.height() < body.height()) {
			  table.width(footer > 0 ? footer : scrollbarWidth)
		  }
	  },
	  /**
	  * Listens for page events
	  * @param {Object} el
	  * @param {Object} ev
	  * @param {Object} data
	  */
	  paginate: function (el, ev, data) {
		  if (typeof data.offset == "number" && this.options.offset != data.offset) {
			  data.offset = Math.min(data.offset, Math.floor(this.options.count / this.options.limit) * this.options.limit)

			  this.options.offset = data.offset;
			  //update paginators
			  this.findAll();
		  }
	  },
	  ".pagenumber keypress": function (el, ev) {
		  if (ev.charCode && !/\d/.test(String.fromCharCode(ev.charCode))) {
			  ev.preventDefault()
		  }
	  },
	  ".pageinput form submit": function (el, ev) {
		  ev.preventDefault();
		  var page = parseInt(el.find('input').val(), 10) - 1,
			  offset = page * this.options.limit;

		  this.element.trigger("paginate", {
			  offset: offset
		  })
	  },
	  findAll: function () {
		  this.element.trigger("updating")
		  this.cached.tbody.html("<tr><td>Loading ...<td></tr>")
		  this.options.model.findAll(this.params(), this.callback('found'));
	  },
	  /*paginator: function ()
	  {
	  return this.element.children('.footer').find(".gridpages")
	  },*/
	  found: function (items) {
		  this.options.count = items.count;
		  if (!items.length) {
			  this.cached.header.hide();
			  this.element.trigger("updated", { params: this.params(), items: items })
			  var ib = this.cached.innerBody;
			  this.cached.table.hide();
			  ib.append("<div class='noitems'>" + this.options.noItems + "</div>")
			  ib.trigger('resize');
			  return;
		  }


		  if (!this.options.columns) {
			  var columns = (this.options.columns = {})
			  $.each(this.options.model.attributes, function (name, type) {
				  if (name != "id")
					  columns[name] = $.String.capitalize(name)
			  })
		  }
		  var body = this.cached.innerBody,
			  table = this.cached.table,
			  tbody = this.cached.tbody;
		  table.children("col").remove();
		  //draw column with set widths
		  table.prepend('//phui/grid/views/columns', {
			  columns: this.options.columns,
			  widths: this.widths,
			  group: this.group
		  })
		  var tbody = tbody.html('//phui/grid/views/body', {
			  options: this.options,
			  items: items
		  })

		  tbody.find("tr.spacing").children("th").each(function () {
			  var $td = $(this),
			   $spacer = $td.children().eq(0),
			   width = $spacer.outerWidth(), height = $spacer.outerHeight();
			  $td.css({ padding: 0, margin: 0 })
			  $spacer.outerWidth(width + 2).css("float", "none").html("").height(1)
		  })

		  this.element.trigger("updated", { params: this.params(), items: items })

		  //do columns ...
		  this.cached.header.find("tr").html('//phui/grid/views/header', this);
		  tbody.trigger("resize")
		  setTimeout(this.callback('sizeTitle'), 1)
	  },
	  sizeTitle: function () {
		  var body = this.cached.body,
			firstWidths = this.cached.tbody.find("tr:first").children().map(function () { return $(this).outerWidth() }),
			header = this.cached.header,
			title = this.cached.header.find("th");


		  for (var i = 0; i < title.length -1 ; i++) {
				 title.eq(i).outerWidth(firstWidths[i]);
		  }
		  header.find("table").width(body.find("table").width() + 40) //extra padding for scrollbar

		  this.titleSized = true;
	  },
	  params: function () {
		  return $.extend({}, this.options.params, {
			  order: this.options.order,
			  offset: this.options.offset,
			  limit: this.options.limit,
			  group: this.options.group,
			  count: this.options.count
		  })
	  },
	  resize: function () {
		  this.cached.innerBody.height(0)
		  if (this.titleSized) {
			  setTimeout(this.callback('sizeTitle'), 1)
		  } else {
			  setTimeout(this.callback('windowresize'), 1)
		  }
	  },
	  bodyScroll: function (el, ev) {
		  this.element.children(":first").scrollLeft(el.scrollLeft())
	  },
	  "th mouseenter": function (el) {
		  el.addClass("hover")
	  },
	  "th mouseleave": function (el) {
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
	  "th dragdown": function (el, ev, drag) {
		  if (this.isMouseOnRight(el, ev, 2)) {
			  var resize = $("<div id='column-resizer'/>").appendTo(document.body).addClass("column-resizer");
			  var offset = el.offset();

			  resize.height(this.element.children(".body").outerHeight() + el.outerHeight()).outerWidth(el.outerWidth());
			  resize.css(offset)
			  ev.preventDefault();
			  //prevent others from dragging
		  } else {
			  drag.cancel();
		  }
	  },
	  "th dragmove": function (el, ev, drag) {
		  ev.preventDefault();
		  var width = ev.vector().minus(el.offsetv()).left();

		  if (width > el.find("span:first").outerWidth())
			  $("#column-resizer").width(width)
	  },
	  "th dragend": function (el, ev, drag) {
		  ev.preventDefault();
		  var width = ev.vector().minus(el.offsetv()).left(),
			attr = el[0].className.match(/([^ ]+)-column-header/)[1],
			cg;
		  if (width > el.find("span:first").outerWidth())
			  cg = this.element.find("col:eq(" + el.index() + ")").outerWidth(width)
		  else {
			  cg = this.element.find("col:eq(" + el.index() + ")").outerWidth(el.find("span:first").outerWidth())
		  }
		  this.widths[attr] = cg.width();
		  setTimeout(this.callback('sizeTitle'), 1)
		  $("#column-resizer").remove();
	  },
	  th_mousemove: function (el, ev) {
		  if (this.isMouseOnRight(el, ev)) {
			  el.css("cursor", "e-resize")
		  } else {
			  el.css("cursor", "")
		  }
	  },
	  isMouseOnRight: function (el, ev, extra) {
		  return el.offset().left + el.outerWidth() - 8 - (extra || 0) < ev.vector().left()
	  },
	  sortedClass: function (attr) {
		  var i = 0;
		  for (var i = 0; i < this.options.order.length; i++) {
			  if (this.options.order[i].indexOf(attr + " ") == 0) {
				  return "sort-" + this.options.order[i].split(" ")[1]
			  }
		  }
		  return "";
	  },
	  replace: function (el, message) {
		  var html = this._renderMessages([message]);
		  el.replaceWith(html.join(''));
		  this.element.trigger('resize');
	  },
	  insert: function (el, messages, fadeIn) {
		  var noitems = this.find('.noitems')
		  if (noitems.length) {
			  noitems.remove();
		  	  this.cached.header.find("tr").html('//phui/grid/views/header', this);
			  var tbl = this.find('.innerBody table').show();
			  return this.found(messages)
		  }
		  var html = this._renderMessages(messages),
			  els = $(html.join(''));
		  if (el.length)
			  el.after(els);
		  else {
			  (tbl ? tbl.children('tbody') : this.find('.innerBody tbody')).html(els)
		  }
		  els.hide().fadeIn();
		  this.windowresize();
		  this.element.trigger('resize');
	  },
	  _renderMessages: function (items) {
		  var html = [], i, item;
		  var options = $.extend(true, {}, this.options, {
			  renderPartial: true
		  })
		  for (i = 0; i < items.length; i++) {
			  item = items[i]
			  html.push(this.options.renderer(item, options, i, items))
		  }
		  return html;
	  },
	  update: function (options) {
		  $.extend(this.options, options)
		  this.findAll();
	  },
	  "tr mouseenter": function (el, ev) {
		  el.addClass(this.options.hoverClass);
	  },
	  "tr mouseleave": function (el, ev) {
		  el.removeClass(this.options.hoverClass);
	  },
	  destroy: function () {
		  delete this.cached
		  this._super()

	  }
  })

			  })
/*.views("//phui/grid/views/body.ejs",
	   "//phui/grid/views/columns.ejs",
	   "//phui/grid/views/header.ejs",
	   "//phui/grid/views/init.ejs",
	   "//phui/grid/views/row.ejs"
	   )*/
