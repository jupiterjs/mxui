steal.plugins("mxui/filemanager")
	.then(function(){
		
		$.Controller("Mxui.Toolbar", {
			defaults: {
				model: null,
				fileColumns: null
			}
		},{
			init: function(){
				this.element.html('//mxui/filemanager/toolbar/views/init', {})
				this.find('.fm').mxui_filemanager(this.options)
			},
			'.create_folder click': function(){
				var newItem = new this.options.model({
					name: "newFolder",
					status: "working",
					type: "folder",
					id: 123333
				})
				this.find(".folders").trigger("newFolder", newItem)
			},
			'.upload_file click': function(){
				var newItem = new this.options.model({
					name: "Brian",
					status: "working",
					type: "file",
					id: 123234
				})
				this.find(".files").trigger("newFile", newItem)
			}
		});
	})
