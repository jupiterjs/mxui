steal.plugins(
	'jquery/controller',
	'jquery/controller/subscribe',
	'jquery/view/ejs',
	'jquery/controller/view',
	'jquery/model',	
	'jquery/dom/fixture', 
	'mxui/grid2',
	'mxui/list')
	.then(function(){
		$.Controller("Mxui.Filemanager", {
			defaults: {
				model: null,
				fileColumns: null
			}
		},{
			init: function(){
				this.element.html(this.view())
				this.element.find('.folders').mxui_list({
					model: this.options.model,
					show: '//mxui/filemanager/views/folders',
					callback: this.callback('showFolders')
				})
				
			},
			showFolders: function(items){
//				this.element.find('.folders').mxui_treegrid()
				this.element.find('.files').mxui_list({
					items: items.files(),
					show: '//mxui/filemanager/views/files',
					callback: this.callback('showFiles'),
					nodeType: "tr"
				})
			},
			showFiles: function(el, ev, list){
				this.element.find('.files').mxui_grid2({
					columns: this.options.fileColumns
				}).mxui_filler();
			}
		})
	})
	.views();