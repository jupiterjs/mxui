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
	/*wrapMany : function(instances) {
         var level = 0, result = [];
		 instances = instances.data ? instances.data : instances; 
		 this._flatten(instances, null, level, result);
		 return this._super(result);
	},*/
	/*flatten : function(instances, parent, level, result) {
		for(var i=0;i<instances.length;i++) {
			var instance = instances[i];
			if(instance.children && instance.children.length)
			   this.flatten(instance.children, instance, level + 1, result);
			instance.level =  level;
			instance.parentId = parent ? parent.value : -1;
			instance.children = null;
			result.push(instance);
		}		
	}*/
},
{
})
