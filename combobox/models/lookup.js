$.Model.extend("Lookup",
{
},
{
	build : function(instances, depth) {
        this._lookup = {};
		this.maxLookupDepth = depth;
		this._buildLookup(instances);
	},
    _buildLookup : function(instances) {
        for(var i=0;i<instances.length;i++) {
            var item = instances[i];
            var depth = Math.min( item.text.length, this.maxLookupDepth );
            for(var j=1;j<=depth;j++) {
                var text = item.text.substr(0,j);
                if(!this._lookup[text]) this._lookup[text] = [];
                this._lookup[text].push(item);
            }   
            if(item.children.length) this._buildLookup(item.children);
        }
    },	
	query : function(text) {
		var results = this._lookup[text] ? this._lookup[text] : []; 
		return results;		
	},
	destroy : function() {
		this._lookup = null;
	}
})
