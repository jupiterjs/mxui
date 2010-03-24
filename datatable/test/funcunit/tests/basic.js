module("datatable test")

test("Sortable Test", function(){
    S.open("datatable.html");
	
	S(".phui_datatable").exists();	
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "First row id is 89197.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Second row id is 95746.")
	})
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "Third row id is 2042231.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Fourth row id is 101784.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fifth row id is 89197.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Sixth row id is 2010471.")
	})
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Seventh row id is 2022259.")
	})	

    // Sort descending by id
	S("thead tr:eq(1) th:eq(1)").click();
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "First row id is 2042231.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Second row id is 2022259.")
	})							
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Third row id is 2010471.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fourth row id is 89197.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Fifth row id is 101784.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Sixth row id is 95746.")
	})
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "Seventh row id is 89197.")
	})

    // Sort ascending by id
	S("thead tr:eq(1) th:eq(1)").click();
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "First row id is 89197.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Second row id is 95746.")
	})
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Third row id is 101784.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fourth row id is 89197.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Fifth row id is 2010471.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Sixth row id is 2022259.")
	})							
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "Seventh row id is 2042231.")
	})
	
    // Sort descending by status
	S("thead tr:eq(1) th:eq(3)").click();
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "First row id is 89197.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Second row id is 95746.")
	})
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Third row id is 101784.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fourth row id is 89197.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Fifth row id is 2010471.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Sixth row id is 2022259.")
	})							
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "Seventh row id is 2042231.")
	})
	
    // Sort ascending by status
	S("thead tr:eq(1) th:eq(3)").click();
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "First row id is 2022259.")
	})							
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "Second row id is 2042231.")
	})	
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "Third row id is 89197.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Fourth row id is 95746.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Fifth row id is 101784.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Sixth row id is 89197.")
	})
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Seventh row id is 2010471.")
	})
	
    // Sort descending by funding date
	S("thead tr:eq(1) th:eq(5)").click();
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "First row id is 2042231.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Second row id is 2022259.")
	})							
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Third row id is 2010471.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fourth row id is 89197.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Fifth row id is 101784.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Sixth row id is 95746.")
	})
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "Seventh row id is 89197.")
	})
	
    // Sort ascending by funding date
	S("thead tr:eq(1) th:eq(5)").click();	
	
	S("tbody tr:eq(0) td:eq(1)").text(function(text){
		ok(text.indexOf("89197") != -1, "First row id is 89197.")
	})
	S("tbody tr:eq(1) td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Second row id is 95746.")
	})
	S("tbody tr:eq(2) td:eq(1)").text(function(text){
		ok(text.indexOf("101784") != -1, "Third row id is 101784.")
	})
	S("tbody tr:eq(3) td:eq(1)").text(function(text){
		ok(text.indexOf("114982") != -1, "Fourth row id is 89197.")
	})
	S("tbody tr:eq(4) td:eq(1)").text(function(text){
		ok(text.indexOf("2010471") != -1, "Fifth row id is 2010471.")
	})
	S("tbody tr:eq(5) td:eq(1)").text(function(text){
		ok(text.indexOf("2022259") != -1, "Sixth row id is 2022259.")
	})							
	S("tbody tr:eq(6) td:eq(1)").text(function(text){
		ok(text.indexOf("2042231") != -1, "Seventh row id is 2042231.")
	})

})


test("Filterable Test", function(){
    S.open("datatable.html");
	
	S(".phui_datatable").exists();	
	
	S(".phui_datatable .search_box input").type('957');
	S("tbody tr:visible td:eq(1)").text(function(text){
		ok(text.indexOf("95746") != -1, "Only row with id 95746 is visible.")
	})			
	
	S(".phui_datatable .search_box input").val('');	
	S(".phui_datatable .search_box input").type('default');
	S("tbody tr:visible td:eq(3)").text(function(text){
		ok(text.indexOf("in_default") != -1, "Only rows with status in_default are visible.")
	})			
	
	S(".phui_datatable .search_box input").val('');	
	S(".phui_datatable .search_box input").type('06-15');
	S("tbody tr:eq(0) td:eq(6)").text(function(text){
		ok(text.indexOf("06-15") != -1, "Only rows with date 06-15 are visible.")
	})			
	S("tbody tr:eq(1) td:eq(5)").text(function(text){
		ok(text.indexOf("06-15") != -1, "Only rows with date 06-15 are visible.")
	})				
	S("tbody tr:eq(3):visible").missing();
})