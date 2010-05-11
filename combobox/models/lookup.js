$.Model.extend("Lookup",
{
},
{
	build : function(instances) {
        this._lookup = {};
        for (var i = 0; i < instances.length; i++) {
            var firstChar = instances[i].text.substr(0, 1);
            if (!this._lookup[firstChar]) 
                this._lookup[firstChar] = [];
            this._lookup[firstChar].push(instances[i]);
        }		
	},
	
	query : function(text) {
        var results = [];
        var firstChar = text.substr(0, 1);
        
        for (var k in this._lookup) {
            if (k == firstChar) {
                for (var j = 0; j < this._lookup[k].length; j++) {
                    results.push(this._lookup[k][j])
                }
            }
        }
        
        for (var i = 0; i < results.length; i++) {
            if (results[i].text.indexOf(text) == -1) 
                results.splice(i)
        }
        return results;		
	},
	
	destroy : function() {
		this._lookup = null;
	}
})
