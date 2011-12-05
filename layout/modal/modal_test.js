steal('funcunit').then(function(){
	
module("mxui/layout/modal",{ 
	setup: function(){
        S.open("//mxui/layout/modal/modal.html");
	}
})

test("Modal initialization works", function(){
	S('#show').click();
	S('#modal').hasClass('mxui_layout_modal', true, "Controller is initialized");
	S('#modal').css('position', 'fixed', 'Position is set to fixed');
})

test("Stacking of modals works", function(){
	S('#show').click();
	S('#modal').css('z-index', "10000", 'Z-index of first modal is 10000');
	S('#show-stacked').click();
	S('.mxui_layout_modal').size(6, 'Six modals stacked');
	S('#show').click();
	S('#modal').css('z-index', "10011", 'After reordering Z-index of first modal is 10011');
})

test("Pressing [escape] should close modals in correct order", function(){
	S('#show').click();
	S('#show-stacked').click();
	S('#show').click();
	S("body").type('[escape]');
	S('#modal').css('display', 'none', 'Modals are closed in correct order')
})

});