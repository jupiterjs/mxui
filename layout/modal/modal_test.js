steal('funcunit').then(function(){
	
module("mxui/layout/modal",{ 
	setup: function(){
        S.open("//mxui/layout/modal/modal.html");
	}
})

test("Modal initialization works", function(){
	stop();
	S('#show').click(function(){
		start();
		ok(S('#modal').hasClass('mxui_layout_modal'), "Controller is initialized");
		equals(S('#modal').css('position'), 'fixed', 'Position is set to fixed');
	});
})

test("Stacking of modals works", function(){
	stop();
	S('#show').click(function(){
		equals(S('#modal').css('z-index'), "10000", 'Z-index of first modal is 10000')
		S('#show-stacked').click(function(){
			equals(S('.mxui_layout_modal').length, 6, 'Six modals stacked');
			S('#show').click(function(){
				start();
				equals(S('#modal').css('z-index'), "10011", 'After reordering Z-index of first modal is 10011')
			})
		})
	})
})

test("Pressing [escape] should close modals in correct order", function(){
	stop();
	S('#show').click(function(){
		S('#show-stacked').click(function(){
			S('#show').click(function(){
				S("body").type('[escape]', function(){
					start();
					equals(S('#modal').css('display'), 'none', 'Modals are closed in correct order')
				})
			})
		})
	})
})

});