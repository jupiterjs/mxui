module("phui/block test",{ 
	setup: function(){
        S.open("//phui/block/block.html");
		S("#blocker").exists();
	}
})

test("Block Test", function(){
    
	S('#text').exists();
	S('#text').text(function(val){
		ok(/Click the Show Text button./.test(val), "Initial text for phui/block test is correct.")
	});
	
	S('button[name=showText]').exists();	
	S('button[name=showText]').click();
	S('#text').text(function(val){
		ok(/You were able to click the button!/.test(val), "Text for phui/block test after Show Text button clicked is correct.")
	});
	
	S('button[name=reset]').exists();	
	S('button[name=reset]').click();
	S('#text').text(function(val){
		ok(/Click the Show Text button./.test(val), "Text for phui/block test after Reset button clicked is correct.")
	});	
	
	S('#block').exists();	
	S('#block').click();	
	
	S('button[name=showText]').exists();	
	S('button[name=showText]').click();
	S('#text').text(function(val){
		ok(/Click the Show Text button./.test(val), "Text for phui/block test after Show Text button clicked and page is blocked is correct.")
	});	
})