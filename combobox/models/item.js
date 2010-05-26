$.Model.extend("Combobox.Models.Item",
{
	url: '/item',
    findAll : function(params, success, error){
        $.ajax({
            url: this.url,
            type: 'get',
            dataType: 'json',
            data: params,
            success: this.callback(['wrapMany',success]),
			error: error,
            fixture: "-items"
        })
    }, 
	wrapMany : function(instances) {
         var level = 0, result = [];
		 this._flatten(instances.data, null, level, result);
		 return this._super(result);
	},
	_flatten : function(instances, parent, level, result) {
		for(var i=0;i<instances.length;i++) {
			var instance = instances[i];
			if(instance.children.length) this._flatten(instance.children, instance, level + 1, result);
			instance.level =  level;
			instance.parentId = parent ? parent.value : -1;
			instance.children = null;
			result.push(instance);
		}		
	}
},
{
})
