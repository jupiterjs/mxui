steal.plugins('mxui/layout/fill',
	'mxui/util/scrollbar_width',
	'jquery/controller').then(function(){
	
//makes a table fill out it's parent

$.Controller('Mxui.Layout.TableFill',{
	setup : function(el, options){
		//remove the header and put in another table
		el = $(el);
		if(el[0].nodeName.toLowerCase() == 'table'){
			this.$ = {
				table: el
			}
			this._super(this.$.table.wrap("<div></div>").parent(), 
					options)
		} else {
			this.$ = {
				table: el.find('table:first')
			}
			this._super(el, options);
		}
		
	},
	init : function(){
		// add a filler ...
		var options = {};
		if(this.options.parent){
			options.parent = this.options.parent;
		}
		this.element.mxui_layout_fill(options).css('overflow','auto');
		this.bind(this.$.table,"resize",'tableResize');

		
		
	},
	tableResize : function(table, ev){
		//let the table flow naturally
		table.css("width","");
		
		// is it scrolling vertically
		if(this.element[0].offsetHeight < this.element[0].scrollHeight){
			table.outerWidth(this.element.width() - Mxui.scrollbarWidth)
		} else {
			table.outerWidth(this.element.width() )
		}
	}
})
	
})
