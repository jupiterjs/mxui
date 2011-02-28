steal.plugins(
	'jquery/controller',
	'jquery/controller/subscribe',
	'jquery/view/ejs',
	'jquery/controller/view',
	'jquery/model',	
	'jquery/dom/fixture', 
	'mxui/grid2',
	'mxui/list',
	'mxui/tree',
	'mxui/selectable')
	.then(function(){
		$.Controller("Mxui.Filemanager", {
			defaults: {
				model: null,
				fileColumns: null
			}
		},{
			init: function(){
				this.list = window[this.options.model.fullName]["List"];
				this.element.html(this.view())
				this.options.model.findAll({
					parentId: null
				}, this.callback('setupFM'));
			},
			setupFM: function(items){
				var list = new this.list(items);
				// render folder list, then tree
				this._renderFolderList(this.element.find('.folders'), list.folders())
				this.element.find('.folders').mxui_tree()
				var foldersEl = this.find('.folders')
				this.folderTree = foldersEl.controller(Mxui.Tree);
				foldersEl.data("list", list);
				
				// render files list, then grid
				var trs = this._renderFiles(list.files())
					
				this.find('.files').append(trs).mxui_grid2({
					columns: this.options.fileColumns
				})
				.mxui_selectable({
					selectableClassName: "item"
				});
                this.filesGrid = this.element.children(":eq(1)").controller(Mxui.Grid2);
			},
			'.folders select': function(el, ev){
				var li = $(ev.target),
					folder = li.model();
				// if there's already content, do nothing
				var nestedUl = li.find('ul');
				if(nestedUl.length){
					var newList = nestedUl.data("list");
					return this.renderFiles(newList.files());
				}
				// do another request using this parentId
				this.options.model.findAll({
					parentId: folder.id
				}, this.callback('addEntries'))
			},
			addEntries:function(items){
				var list = new this.list(items);
				var trs = this._renderFiles(items.files())
				this.filesGrid.clear();
				this.filesGrid.insert(trs)
				var foldersList = $("<ul></ul>")
				foldersList.data("list", list);
				// otherwise render a new list, put it in the tree
				this._renderFolderList(foldersList, items.folders())
				this.folderTree
					.styleUL(foldersList)
					.appendTo(this.find('.folders .selected'))
			},
			_renderFolderList: function(el, items){
				el.mxui_list({
					items: items,
					show: '//mxui/filemanager/views/folders'
				})
			},
			_renderFiles: function(list){
				var filesList = $("<div />")
				filesList.mxui_list({
					items: list,
					show: '//mxui/filemanager/views/files',
					nodeType: "tr"
				})
				filesList.find("tr").each(function(){
					$(this).attr("tabindex", "0")
				})
				return filesList.children();
			}
		})
	})
	.views();