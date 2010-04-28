steal.plugins('phui/grid')
     .resources()
     .models()
     .controllers()
     .views()
     .then(function($){

    Phui.Grid.extend("Phui.Grid.Tree",{
        defaults: {
            indentedColumn: null
        }
    },
    {
        init : function(){
			var self = this;
			var indentedColumn = this.options.indentedColumn;
			if(this.options.render && this.options.render[indentedColumn]){
				var oldRender = this.options.render[indentedColumn];
				this.options.render[indentedColumn] = function(instance){
					var content = [];
                    if (instance.hasChildren()) {
                        content.push('<span class="toggle ui-icon ui-icon-folder-collapsed" style="float: left; width: ');
                        content.push(instance.depth * 20);
                        content.push('px; display: block;height:12px;"></span>');
                    }
					content.push(oldRender.apply(this, arguments));
					return content.join("");
				}
			}
			
			new Phui.Grid(this.element[0], this.options)
		},
		
		".toggle click" : function(el, ev){
			var rowEl = el.closest("tr");
			var instance = rowEl.model();
			instance.Class.findAll({parentId: instance.id}, this.callback("childrenLoaded", rowEl));
		},
		
		childrenLoaded : function(rowEl, items){
			rowEl.after("//phui/grid/tree/views/rows.ejs", {
                options: this.options,
                items: items
            });
		}
    })
     
})

