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
				this.options.model.findAll({
					parentId: null
				})
			},
			renderFiles: function(items){
				// remove old grid
				this.element.children(":eq(1)").remove()
				// add container for a newo ne
				this.element.append(this.view('renderFiles'))
				// render files list and grid
				this.find('.files')
					.mxui_list({
						items: items,
						show: '//mxui/filemanager/views/files',
						nodeType: "tr"
					})
					.mxui_grid2({
						columns: this.options.fileColumns
					});
				
			},
			renderFolderList: function(el, items){
				el.mxui_list({
					items: items,
					show: '//mxui/filemanager/views/folders'
				})
			},
			'.folders select': function(el, ev){
				var li = $(ev.target),
					folder = li.model();
				$('.activeFolder').removeClass('activeFolder')
				li.addClass('activeFolder')
				// if there's already content, do nothing
				if(li.find('ul').length){
					return this.renderFiles(this.options.model.files(folder.id))
				}
				// do another request using this parentId
				this.options.model.findAll({
					parentId: folder.id
				})
			},
			"{model} add" : function(list, ev, items){
				items = new list.Class(items);
				this.renderFiles(items.files())
				// folders
				var parentId = items[0].parentId;
				// if no parentId, this is the first pass
				if(!parentId){
					this.renderFolderList(this.element.find('.folders'), items.folders())
					this.element.find('.folders').mxui_tree()
					this.folderTree = this.find('.folders').controller(Mxui.Tree);
				} else {
					var foldersList = $("<ul></ul>")
					// otherwise render a new list, put it in the tree
					this.renderFolderList(foldersList, items.folders())
					this.folderTree
						.styleUL(foldersList)
						.appendTo(this.find('.activeFolder'))
				}
			}
		})
	})
	.views();