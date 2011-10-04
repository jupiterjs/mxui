steal('jquery/dom/fixture', 'jquery/model',function(){

$.Model('Item');

var folderIds = [],
	rand = $.fixture.rand,
	getPath = function(items, parentId){
		var path = parentId == null ? [] : [parentId],
			next
		while(next = items[parentId]){
			if(next.parentId != null){
				path.unshift(next.parentId)
			}
			parentId = next.parentId
		}
		return {
			path: path.join('/'),
			accountId: path.length ? path[0]  : null
		}
	};



$.fixture.make('item',500, function(i, items){
	var parentId = i < 5 ? null : rand(folderIds, 1)[0],
		type = i < 5 ? 'folder' : rand(['file','folder'],1)[0];
	if(type === 'folder'){
		folderIds.push(i)
	}
	var data = getPath(items, parentId)
	return {
		name: parentId === null ? "Account "+i : type+" "+i,
		parentId : parentId,
		type: type,
		path : data.path,
		accountId: data.accountId
	}
})
	
})
