module("grid test")

test("Groupable Test", function(){
    S.open("groupablegrid.html");
    S('th.users_count-column-header span').exists()
    S('th.users_count-column-header span').dragTo("#dragToGroupText")
	S('.groupDrag').exists()
	S('.groupDrag').text(function(val){
		ok(/Users\_count/.test(val), "Group dragged ok")
	})
	S('.group-col:first').exists()
	S('.group-col:first').text(function(val){
		ok(/Users\_count\:\d/.test(val), "Group header ok")
	})
	S('.groupDrag .remove').click()
	S('.groupDrag').missing(function(){
		ok(true, "Removed group")
	})
	S('.group-col:first').missing(function(){
		ok(true, "Removed group columns")
	})
})

test("Sortable Test", function(){
    S.open("groupablegrid.html");
})