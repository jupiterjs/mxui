$.Model.extend("Lookup",
{
},
{
	build : function(items, showNested, autocompleteEnabled) {
        this._lookup = {};
		this.items = items;
		this._buildLookup(items, showNested, autocompleteEnabled);
	},
    _buildLookup : function(items, showNested, autocompleteEnabled) {
        for(var i=0;i<items.length;i++) {
            var item = items[i];
			if (autocompleteEnabled) {
				var depth = item.text.length;
				for (var j = 1; j <= depth; j++) {
					var text = item.text.substr(0, j);
					if (!this._lookup[text]) 
						this._lookup[text] = [];
					this._lookup[text].push(item);
				}
			}
			
			// also keeps item indexed by value for use in combobox.controller().val()
			this._lookup["item_"+item.value] = item;
			
            if( item.children.length && showNested ) this._buildLookup(item.children, showNested, autocompleteEnabled);
        }
    },	
	query : function(text) {
		if(text == "*") return this.items;
		var results = this._lookup[text] ? this._lookup[text] : []; 
		return results;		
	},
	getByValue : function(value) {
		return this._lookup["item_"+value] ? this._lookup["item_"+value] : null;  
	}
})
