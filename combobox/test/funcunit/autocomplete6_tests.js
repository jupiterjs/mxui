module("combobox4 test", { 
	setup: function(){
        S.open("//phui/combobox/autocomplete6.html");
	}
})

/*
 * 6. Combobox autocomplete tests:
 *  
 *  6a Tests that if item with lowercase text is searched by keying the first character capitalized, the item shows up in the filtered list.
 *  6b Tests that if item is searched by keying an item's character other than first, the item does not show on the filtered list.
 *  6c Tests that if the item's text is more than one word, and if the second word's first character is typed, the item shows on the filtered list.
 */

/*
 *  6a Tests that if item with lowercase text is searched by keying the first character capitalized, 
 *  the item shows up in the filtered list.  
 */
test("6a Tests that if item with lowercase text is searched by keying the first character capitalized, the item shows up in the filtered list.", function() {
	
	S("#combobox6a").exists();
	
	S("#combobox6a").visible();
		
	S("#combobox6a").find("input[type=text]").type("Item3");
	
	S("#combobox6a_dropdown").visible();
	
	// make sure dropdown's item3 is visible
	S("#combobox6a_dropdown:contains('item3 text3')").visible();		
	S("#combobox6a_dropdown:contains('No items available')").invisible();
	
});

/*
 *  6b Tests that if item is searched by keying an item's character other than first, 
 *  the item does not show on the filtered list.   
 */
test("6b Tests that if item is searched by keying an item's character other than first, the item does not show on the filtered list.", function() {
	
	S("#combobox6a").exists();
	
	S("#combobox6a").visible();
		
	S("#combobox6a").find("input[type=text]").type("tem0");
	
	S("#combobox6a_dropdown").visible();
	
	// make sure dropdown's "No items available" is visible
	S("#combobox6a_dropdown:contains('No items available')").visible();

	
});

/*
 *  6c Tests that if the item's text is more than one word, 
 *  and if the second word's first character is typed, 
 *  the item shows on the filtered list.    
 */
test("6c Tests that if the item's text is more than one word, and if the second word's first character is typed, the item shows on the filtered list.", function() {
	
	S("#combobox6a").exists();
	
	S("#combobox6a").visible();
		
	S("#combobox6a").find("input[type=text]").type("Text3");
	
	S("#combobox6a_dropdown").visible();
	
	// make sure dropdown's "No items available" is visible
	S("#combobox6a_dropdown:contains('item3 text3')").visible();
	S("#combobox6a_dropdown:contains('No items available')").invisible();

	
});
