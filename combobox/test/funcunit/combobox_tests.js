module("combobox test", { 
	setup: function(){
        S.open("//phui/combobox/combobox.html");
	}
})


test("Test change is only called once.", function() {
	S("#expirationBehavior .phui_combobox_select").click();
	S(".phui_combobox_dropdown .dropdown_2").visible();
	S(".phui_combobox_dropdown .dropdown_2").click();
	
	S("#populateItems").click(function(){
		equals("1", S('.change_count').text())
	});
});

test("Test clicking combobox view in text mode and verify the dropdown opens.", function() {
	S("#expirationBehavior .phui_combobox_select").exists(function(){
		var val = S("#expirationBehavior input[type=text]").val();
		ok(/archive/.test(val), "Item #1 (archive) is selected by default.");	
		var hiddenVal = S("#expirationBehavior input[type=hidden]").val();
		ok(/0/.test(hiddenVal), "Hidden input has the correct value.");
	});

	
	
	// checks if dropdown is now visible	
	S("#expirationBehavior .phui_combobox_select").click( function(){
		var display = S(".phui_combobox_dropdown").css("display");
		ok(/block/.test(display), "Dropdown is visible.");	
	});
	
});

test("Test clicking item 2 and check it was selected.", function() {
	S(".phui_combobox .phui_combobox_select").click();
	
	S(".phui_combobox_dropdown .dropdown_2").visible();
	
	S(".phui_combobox_dropdown .dropdown_2").click(function(){
		// check delete (item #2) was selected
		ok(/delete/.test(S("#expirationBehavior input[type=text]").val()), "Item #2 was selected.");	
	});
			
});

test("Test that change event isn't triggered when combobox is loaded.", function() {
	S("#expirationBehavior .phui_combobox_select").exists(function(){
		// check if the visible input gets the correct value
		ok( S("#log3").val() === "", "Change event was not triggered when combobox was loaded as expected.");	
	});
	

});

test("Test that change event is triggered when the combobox value is changed.", function() {
	S("#combobox_demo").exists(function(){
		 ok(/hola/.test(S("#combobox_demo input[type=text]").val()), 
		 	"Item #1 (hola) is selected by default.");	
		 
		 ok(/1/.test(S("#combobox_demo input[type=hidden]").val()), 
		 	"Hidden input has the correct value.");
	});
	
	
	// checks if dropdown is now visible	
	S("#combobox_demo input[type=text]").click();
	S(".phui_combobox_dropdown").visible();	
	
		
	S(".phui_combobox_dropdown .dropdown_3").exists();
	S(".phui_combobox_dropdown .dropdown_3").click(function(){
		ok(/kansas/.test(S("#combobox_demo input[type=text]").val()), "Item #3 (nuevo) was selected.");	
		 ok( S("#log3").text() === "6", "Change event was triggered as expected.");	
	});
	
});

/* Combobox API Test Cases */
test("Testing populateItems.", function() {
	S("#ajax_demo").exists();
	S("#populateItems").exists();
	S("#populateItems").click();
	S("#ajax_demo_output").exists( function() {
		ok(/dir0,/.test(S("#ajax_demo_output").text()), "populateItems successfully called.");
	} );
});