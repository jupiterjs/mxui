steal.apps('phui/toolbar').then(function(){
	
	var J = Jupiter;
	$.Controller.extend("Jupiter.Shiftable",{listensTo: ["shift"]},
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
	
	$.Controller.extend("Jupiter.FadeInable",{listensTo: ["show","hide"]}, {
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
        TYPES: [J.Positionable, Jupiter.Shiftable, J.FadeInable, Jupiter.Highlight],
		CLASS_NAMES: "menu"
    }).extend("ClickMenu",{listensTo: ["shifted","hide"]},{
		"li deselect" : function(el, ev){
			ev.preventDefault();
			ev.preventDefault();
			this.hideOld();
			
			$(el).addClass("selected").removeClass("deslected").trigger("shift")
		},
		calculateSubmenuPosition : function(el, ev){
			var off = this.element.offset();
			off.left += 40;
			off.height += this.element.outerHeight()
			return off;
		},
		"li shifted" : function(el){
			el.trigger("select");
			el.siblings().removeClass("selected").addClass("deslected")
		},
		hide : function(){
			this.element.find("li").removeClass("selected").removeClass("deslected")
		}
	})
	//({MENU_TYPE: ClickMenu})
	J.Toolbar({MENU_TYPE: ClickMenu, CHILD_CLASS_NAMES: "menu"}).extend("Jupiter.Navigation",{listensTo: ["shifted"]},{
		init : function(){
			this._super.apply(this, arguments)
			this.element.mixin(Jupiter.Shiftable, Jupiter.Highlight)
            this.element.children("ul").css("position","relative")
		},
		"li deselect" : function(el, ev){
			//$(el).siblings()
			ev.preventDefault();
			this.hideOld();
			$(el).removeClass("deslected").addClass("selected").trigger("shift");
		},
		calculateSubmenuPosition : function(el, ev){
	   		var off = this.element.offset();
			off.left += 20;
			off.top += (35)
			return off;
	   },
	   "li shifted" : function(el, ev){
			el.trigger("select");
			el.siblings().removeClass("selected").addClass("deslected");
			el.addClass("selected").removeClass("deslected");
	   }
	})
	
});