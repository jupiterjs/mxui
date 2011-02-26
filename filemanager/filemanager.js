steal.plugins(
	'jquery/controller',
	'jquery/controller/subscribe',
	'jquery/view/ejs',
	'jquery/controller/view',
	'jquery/model',	
	'jquery/dom/fixture', 
	'mxui/grid2',
	'mxui/list',
	'mxui/tree')
	.then(function(){
		$.Controller("Mxui.Filemanager", {
			defaults: {
				model: null,
				fileColumns: null
			}
		},{
			init: function(){
				this.element.html(this.view())
				this.options.model.findAll(this.options.params, this.callback('renderLists'))
			},
			renderLists: function(items){
				this.element.find('.folders').mxui_list({
					items: items.folders(),
					show: '//mxui/filemanager/views/folders',
					callback: this.callback('showFolders')
				})
				this.element.find('.files').mxui_list({
					items: items.files(),
					show: '//mxui/filemanager/views/files',
					callback: this.callback('showFiles'),
					nodeType: "tr"
				})
				
			},
			showFolders: function(items){
				this.element.find('.folders').mxui_tree()
			},
			showFiles: function(el, ev, list){
				this.element.find('.files').mxui_grid2({
					columns: this.options.fileColumns
				}).mxui_filler();
			},
			'.folders select': function(el, ev){
				var li = $(ev.target),
					folder = li.model();
				if(li.children().length <= 1){
					$(el).controller(Mxui.Tree).styleUL(
						$("<ul><li><a>Item1</a></li><li><a>Item2</a></li></ul>")
					).appendTo(ev.target)
				}
			}
		})
	})
	.views();