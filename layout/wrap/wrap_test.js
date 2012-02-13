steal('funcunit/qunit').then('mxui/layout/wrap',function(){

module("mxui/layout/wrap");

function addStyle(str){
	var el = $('<style>').attr('type', 'text/css');
	if(el[0].styleSheet) {
		el[0].styleSheet.cssText = str;//IE
	} else {
		el.text(str);
	}
	el.appendTo($('head'));
}

test("margin moves", function(){
	addStyle('.wrap {margin: 20px}');
	
	$('#qunit-test-area').html("<textarea class='wrap'>Here is my textarea</textarea>"+
			"<input class='wrap' type='text'/>"+
			"<select  class='wrap'><option>1</option></select>"+
			"<button type='button'  class='wrap'>try me</button>"+
			"<img src='../../../jmvc/images/phui.png'  class='wrap'/>");
	
	
	$('#qunit-test-area').find('.wrap').mxui_layout_wrap().each(function(){
		equals($(this).css("marginLeft"), '20px', "margins are moved");
		equals($(this).children(':first').css("marginLeft"), '0px', "margins are moved")
	})
})

})

