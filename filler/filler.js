steal.plugins('jquery/controller','jquery/dom/dimensions').then(function($){
	
	logg = function(text){
		$(".archer_ui_grid").prepend("<p>"+text+"</p>")
	}
	
	//lets test what makes an element include the margin in something
	$(function(){
		var affects = {
			width: "30px",
			border: "solid 1px white",
			padding: "1px",
			margin: "1px"
		}
		var container = $('<div><div style="height: 18px; margin: 4px"></div></div>').appendTo(document.body),
			baseHeight =  container[0].scrollHeight;
		for(var part in affects){
			container[0].style[part] = affects[part];
			if(container[0].scrollHeight > baseHeight){
				affects[part] = true;
			}else{
				affects[part] = false;
			}
			container[0].style[part] = ""; //set it back to normal for other tests
		}
		container.remove();
		container = null;
		
		
		
		jQuery.support.containerSizeAdjustments = affects;
		
	})
	

	/**
	 * Determines which child margins a parent should include.
	 */
	$.curStyles.adjustForMargins  = function(parent){
		//see if there is a value set on the parent
		//if(parent == document || parent == document.body || parent == document.documentElement) 
			return {first: true, last: true};
		
		/*var get = {
			paddingBottom : true,
			borderBottomWidth : true,
			paddingTop: true,
			borderTopWidth : true
		}
		$.curStyles(parent, get);
		var ret = {first: false, last: false}
		//if any have a value and containerSizeAdjustments is true ...
		var ads = jQuery.support.containerSizeAdjustments
		if( (ads.padding && parseInt(get.paddingBottom) ) || 
			(ads.border && parseInt(get.borderBottomWidth) )){
			ret.last = true;
		}
		if( (ads.padding && parseInt(get.paddingTop) ) ||
		    (ads.border && parseInt(get.borderTopWidth))){
			ret.first = true;
		}
		if(ads.width && ( parseInt(parent.style.width) )){
			ret.first = ret.last = true;
		}*/
		
		return ret;
	}
	var matches = /script/
	/**
	 * Gets the space used by siblings of the 'adjustingChild'
	 * @param {Object} adjustingChild
	 * @param {Object} force
	 */
	$.curStyles.getSpaceUsed = function(adjustingChild, force, cachedParent){
		//if we are the documentElement, there should be no siblings.
		if(adjustingChild == document.documentElement){
			return 0;
		}
		
		var parent = cachedParent || adjustingChild.parentNode,
			adjust = $.curStyles.adjustForMargins(parent),
			children = $(parent).children().filter(function(){
				if(matches.test(this.nodeName.toLowerCase()))
					return false;
				var get = {"position": true, "display": true};
				$.curStyles(this, get);
				return get.position !== "absolute" && 
					   get.display !== "none" && !jQuery.expr.filters.hidden(this)
			}),
			spaceUsed = 0,
			child,
			get,
			mySpaceUsed,
			i=0;

		
		for(i =0; i < children.length; i++){
			child = children[i];
			get = {
				//paddingBottom : true,
				borderBottomWidth : true,
				//paddingTop: true,
				borderTopWidth : true
			};
			mySpaceUsed = 0;
			
			if(i!=0 ||  adjust.first || force ){ 
				get.marginTop = true //get top margin
			}
			if(i!=children.length-1 || adjust.last || force){
				get.marginBottom = true //get bottom margin
			}
			if(child == adjustingChild && ! force){
				get.paddingBottom = true;
				get.paddingTop = true;
			}
			$.curStyles(child, get)
			if(child != adjustingChild || force){
				mySpaceUsed+= $(child).innerHeight();
			}
			
			$.each(get, function(name, value){
				if(value == "auto"){
					child.style[name] = "0px"
				}
				mySpaceUsed += parseFloat(value, 10) || 0;
				
			})
			
			//logg(mySpaceUsed+" "+child.nodeName+"."+child.className)
			spaceUsed += mySpaceUsed;
		}
		return spaceUsed;
	}
	count = 3;
	
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
			var parent = this.parent, el = this.element;
			var func = function(){
					//logg("triggering ..")
					setTimeout(function(){
						if(jQuery.support.containerSizeAdjustments.width){
							var c= el.children();
							if(c.length){
								var height = $.curStyles.getSpaceUsed(c[0], true);
							}
							el.height(height);
							el = null;
						}
						parent.triggerHandler("resize");
					},13)
				}
				
			
			if($.isReady){
				func();
			}else{
				$(func)
			}
		},
		parentResize : function(el, ev){
			//only if target was me
			//return;
			if(ev.originalEvent && this.parent[0] != window){
				return;
			}

			if( !jQuery.expr.filters.hidden(this.element[0])){
				//logg(">STARTING .. "+this.parent[0].nodeName+"."+this.parent[0].className)
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
				//calculate the space used by everything else in the parentElement.
				var spaceUsed = 0;
				//first check if we are caching that height
				if(this.options.cache && (this.cachedSpaceUsed !== undefined)){
					spaceUsed = this.cachedSpaceUsed;
				}else{
					//actualy calculate it
					var nakedParent = this.parent[0], shrink = false, oldOverflow;
					if(nakedParent === document ||
					   nakedParent === document.documentElement ||
					   nakedParent === window ||
					   nakedParent === document.body){
					   	shrink = true;
					}
					if(shrink){
						oldOverflow = jQuery.curCSS(this.element[0], "overflow", true)
						this.element.css({width: 0, height: 0, overflow: "hidden"})
					}
					//now lets figure out how much space there is around us
					var current = this.element[0],
						currentParent = current.parentNode;
					
					//get the space around the first element
					spaceUsed  += $.curStyles.getSpaceUsed(current, null, currentParent);
					//walk up the document until you reach the parent
					//console.log("immediate", current, spaceUsed)
					while(currentParent && (currentParent != nakedParent) && (currentParent !== document) ){
						current = currentParent;
						currentParent = currentParent.parentNode;
						spaceUsed += $.curStyles.getSpaceUsed(current, null, currentParent);
						//console.log("parent", current, spaceUsed)
					}
					this.cachedSpaceUsed = spaceUsed;
				}
				//console.log("spaceUsed", this.element[0], spaceUsed)
				//now set the height
				//logg("SETTING "+(this.parent.height() - spaceUsed)+" "+this.element[0].nodeName+"."+this.element[0].className+"; parent = "+this.parent.height())
				
				this.element.height(this.parent.height() - spaceUsed, true)
				
				if(this.options.width)
					this.element.outerWidth(width)
				else if(shrink){
					this.element.css({width: "", overflow: oldOverflow == "visible" && jQuery.support.containerSizeAdjustments.width ? "hidden"  : oldOverflow})
				}
				//console.log(new Date() - start)
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
