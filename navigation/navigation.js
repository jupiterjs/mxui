steal.apps('phui/toolbar').then(function(){
	
	var J = Phui;
	$.Controller.extend("Phui.Shiftable",{listensTo: ["shift"]},
	{
        "li shift" : function(el){
			//move this guy to the first ... shift everything else around
			var el = $(el);
			if (el.index() == 0) {
				return el.trigger("shifted");
			}
			var parent =  el.parent();
			//move each child to the left off, and then back on
			var left = el.position().left
			
			var paddingLeft = parseInt( parent.css("paddingLeft") ,10)
			var marginLeft = parent.height()  ? 0 :  parseInt( el.css("marginLeft") ,10)
			//move me and right of me left
			var rights = el.add(el.nextAll())
			rights.animate({
				left: -(left-paddingLeft-marginLeft)+"px"
			},"slow")
			var done = false;
			//move left of me like we just flew off screen
			var prev = el.prevAll().animate({
				left: -(1000)+"px",
				opacity: 0},
			 {
				complete : function(){
					//now switch positions and show
					
					rights.css({"left": 0})
					
					parent.append(prev)
					prev.css({"left": 0, opacity: 1}).show();
					
					if(!done){
						done = true;
						el.trigger("shifted")
					}
					
					
				}, duration: "slow"}
			)
			
			//move each child on the right, over
			
		}
	})
	
	$.Controller.extend("Phui.FadeInable",{listensTo: ["show","hide"]}, {
	   show : function(el, ev){
			ev.preventDefault();
			this.element.css("opacity",0.2).show().animate({opacity: 1.0},"slow")
	   },
       hide : function(el, ev){
		   var e = this.element;
		   ev.preventDefault();
		   this.element.animate({opacity: 0.2},"slow", function(){ e.hide()});
       }
	})
	
	
	J.Menu({
        types: [J.Positionable({my: "left top", at : "right top"}), Phui.Shiftable, J.FadeInable, Phui.Highlight],
		class_names: "menu",
		apply_types_to_top : true
    }).extend("ClickMenu",{listensTo: ["shifted","hide"]},{
		init : function(){
			this.element.hide();
			this._super.apply(this,arguments)
		},
		"li deselect" : function(el, ev){
			ev.preventDefault();
			ev.preventDefault();
			this.hideOld();
			
			$(el).addClass("selected").removeClass("deselected").trigger("shift")
		},
		calculateSubmenuPosition : function(el, ev){
			var off = this.element.offset();
			off.left += 40;
			off.height += this.element.outerHeight()
			return off;
		},
		"li shifted" : function(el){
			el.trigger("select");
			el.siblings().removeClass("selected").addClass("deselected")
		},
		hide : function(){
			this.element.find("li").removeClass("selected").removeClass("deselected")
		}
	})
	//({menu_type: ClickMenu})
	J.Toolbar({menu_type: ClickMenu, child_class_names: "menu"}).extend("Phui.Navigation",{listensTo: ["shifted"]},{
		init : function(){
			this._super.apply(this, arguments)
			this.element.mixin(Phui.Shiftable, Phui.Highlight)
            this.element.children("ul").css("position","relative")
		},
		"li deselect" : function(el, ev){
			//$(el).siblings()
			ev.preventDefault();
			this.hideOld();
			$(el).removeClass("deselected").addClass("selected").trigger("shift");
		},
		calculateSubmenuPosition : function(el, ev){
	   		var off = this.element.offset();
			off.left += 20;
			off.top += (35)
			return off;
	   },
	   "li shifted" : function(el, ev){
			el.trigger("select");
			el.siblings().removeClass("selected").addClass("deselected");
			el.addClass("selected").removeClass("deselected");
	   }
	})
	
});