module("phui/grid/groupable test",{ 
	setup: function(){
        S.open("//phui/groupablegrid.html");
		S(".resource_1").exists();
	}
})

test("Groupable Test", function(){
    
    S('th.users_count-column-header span').dragTo("#dragToGroupText")
	
	
	S('.groupDrag').exists()
	S('.groupDrag').text(function(val){
		ok(/Users\_count/.test(val), "Group dragged ok")
	})
	S('.group-col:first').exists()
	S('.group-col:first').text(function(val){
		ok(/Users\_count\:\d/.test(val), "Group header ok")
	})
	
	S('.groupDrag .remove').click();
	
	S('.groupDrag').missing(function(){
		ok(true, "Removed group")
	})
	S('.group-col:first').missing(function(){
		ok(true, "Removed group columns")
	})
})