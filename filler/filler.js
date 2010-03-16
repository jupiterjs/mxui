steal.plugins('jquery/controller','jquery/dom/dimensions').then(function($){
	var cushin = function(el){
		if(el === document) return 0;
		var start = 0;
		var get = {
			paddingBottom : true,
			borderBottomWidth : true,
			marginBottom : true,
			paddingTop: true,
			borderTopWidth : true,
			marginTop : true
		}
		$.curStyles(el, get)
		$.each(get, function(name, value){
			start += parseFloat(value, 10) || 0
		})
		return start;
	}
	var siblings = function(el){
		if(el === document) return 0;
		var total = 0;
		$(el).siblings().each(function(){
			var $jq = $(this)
			if(this.nodeName.toLowerCase() != 'script' && 
			   $jq.is(":visible") && 
			   $jq.css("position") != "absolute"){
				total += $jq.outerHeight(true)
			}
		})
		return total;
	}

	
	$.Controller.extend("Phui.Filler",
	{
		listensTo : ["show"]
	},
	{
		init : function(el, options){
			this.parent = this.options.parent ? $(this.options.parent) : this.element.parent()
			if(this.parent[0] === document.body || this.parent[0] === document.documentElement)
				this.parent = $(window)
			//listen on parent's resize
			this.bind(this.parent, 'resize', 'parentResize');
			var parent = this.parent;
			setTimeout(function(){
				parent.triggerHandler("resize");
			},13)
			
		},
		parentResize : function(el, ev){
			//only if target was me
			if( this.element.is(":visible")){
				ev.stopPropagation();
				var height, width;
				if(this.options.all){
					this.element.css({width: 0, height: 0})
					height =  $(document).height() 
					width = $(document).width()
					this.element.css({
						width: width+"px", 
						height: height+"px"
					}).triggerHandler('resize');
					return;
				}
				//if it is the document, documentElement, window, or body
				//we have to shrink ourselves to not affect the layout
				var nakedParent = this.parent[0], shrink = false, oldOverflow;
				if(nakedParent === document ||
				   nakedParent === document.documentElement ||
				   nakedParent === window ||
				   nakedParent === document.body){
				   	shrink = true;
				}
				if(shrink){
					oldOverflow = jQuery.curCSS(this.element[0], "overflow")
					this.element.css({width: 0, height: 0, overflow: "auto"})
				}
				//now lets figure out how much space there is above us
				var spaceUsed = 0, currentParent;
				//if we are a direct child of our parent
				//now we have to go through our parents, summing up what is under us
				//and under each parent until we get to our parent
				currentParent = this.element[0].parentNode
				spaceUsed += siblings(this.element[0])
				while(currentParent && currentParent != nakedParent ){
					spaceUsed += cushin(currentParent);
					spaceUsed += siblings(currentParent)
					currentParent = currentParent.parentNode;
				}
				
				//now set the height
				

				this.element.outerHeight(this.parent.height() - spaceUsed)
				if(this.options.width)
					this.element.outerWidth(width)
				else if(shrink){
					this.element.css({width: "", overflow: oldOverflow})
				}
				
				this.element.triggerHandler('resize');
				
			}
			
		},
		show : function(el, ev){
			//resize after show ... needs a shown
			var element = this.parent;
			setTimeout(function(){
				element.trigger("resize");
			},13)
			//this.element.trigger("resize");
		},
		destroy : function(){
			this.parent.unbind('resize', this.parent_resize)
			this.parent = null;
		}
	})
})
