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
				this.element.children(":eq(1)").remove()
				this.element.append(this.view('renderFiles'))
				this.find('.files')
					.mxui_list({
						items: items.files(),
						show: '//mxui/filemanager/views/files',
						nodeType: "tr"
					})
					.mxui_grid2({
						columns: this.options.fileColumns
					});
				
			},
			'.folders select': function(el, ev){
				var li = $(ev.target),
					folder = li.model();
				$('.activeFolder').removeClass('activeFolder')
				li.addClass('activeFolder')
				// if there's already content, do nothing
				if(li.find('ul').length){
					return;
				}
				// do another request using this parentId
				this.options.model.findAll({
					parentId: folder.id
				})
			},
			//adds existing and created to the list
			"{model} add" : function(list, ev, items){
				items = new list.Class(items);
				// folders
				var parentId = items[0].parentId;
				// check if the new item's parentId is null, if so add it to the main el
				if(parentId == null){
					this.element.find('.folders').mxui_list({
						items: items.folders(),
						show: '//mxui/filemanager/views/folders'
					})
					this.element.find('.folders').mxui_tree()
				} else {
					var foldersList = $("<ul></ul>")
					// otherwise render a new list, put it in the tree
					foldersList.mxui_list({
						items: items.folders(),
						show: '//mxui/filemanager/views/folders'
					})
					this.find('.folders').controller(Mxui.Tree)
						.styleUL(foldersList)
						.appendTo(this.find('.activeFolder')[0])
				}
				this.renderFiles(items)
			}
		})
	})
	.views();