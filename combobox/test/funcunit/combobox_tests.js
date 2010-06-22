module("combobox test", { 
	setup: function(){
        S.open("combobox.html");
	}
})

test("Test clicking combobox view in text mode and verify tghe dropdown opens.", function() {
	S("#expirationBehavior .phui_combobox_select").exists();
	// check if the visible input gets the correct value
    S("#expirationBehavior input[type=text]").val(function(val){
        ok(/archive/.test(val), "Item #1 (archive) is selected by default.");	
	});
	// check if the hidden input gets the correct value
    S("#expirationBehavior input[type=hidden]").val(function(val) {
        ok(/0/.test(val), "Hidden input has the correct value.");
	});		
	
	// checks if dropdown is now visible	
	S("#expirationBehavior .phui_combobox_select").click();
    S(".phui_combobox_dropdown").css("display", function(display){
        ok(/block/.test(display), "Dropdown is visible.");	
	});		
});

test("Test clicking item 2 and checck it was selected.", function() {
	S(".phui_combobox_dropdown .combobox_models_item_2").exists();
	S(".phui_combobox_dropdown .combobox_models_item_2").click();
	// check delete (item #2) was selected
    S("#expirationBehavior input[type=text]").val(function(val){
        ok(/delete/.test(val), "Item #2 was selected.");	
	});		
});

test("Test that change event isn't triggered when combobox is loaded.", function() {
	S("#expirationBehavior .phui_combobox_select").exists();
	// check if the visible input gets the correct value
    S("#log3").val(function(val){
        ok( val === "", "Change event was not triggered when combobox was loaded as expected.");	
	});	
});

test("Test that change event is triggered when the combobox value is changed.", function() {
	S("#combobox_demo").exists();
	// check if the visible input gets the correct value
    S("#combobox_demo input[type=text]").val(function(val){
        ok(/hola/.test(val), "Item #1 (hola) is selected by default.");	
	});
	// check if the hidden input gets the correct value
    S("#combobox_demo input[type=hidden]").val(function(val) {
        ok(/1/.test(val), "Hidden input has the correct value.");
	});		
	
	// checks if dropdown is now visible	
	S("#combobox_demo input[type=text]").click();
	S(".phui_combobox_dropdown").exists();	
    S(".phui_combobox_dropdown:eq(1)").css("display", function(display){
        ok(/block/.test(display), "Dropdown is visible.");	
	});			
		
	S(".phui_combobox_dropdown:eq(1) .combobox_models_item_3").exists();
	S(".phui_combobox_dropdown:eq(1) .combobox_models_item_3").click();
	// check delete (item #3) was selected
    S("#combobox_demo input[type=text]").val(function(val){
        ok(/kansas/.test(val), "Item #3 (nuevo) was selected.");	
	});				
    S("#log3").text(function(text){
        ok( text === "6", "Change event was triggered as expected.");	
	});		
});



