steal.apps('phui/menu','jquery/event/default').then(function(){
   Phui.Menu({
		child_selector : "ul>li"
	}).
    extend("Phui.Toolbar",
    {
       defaults : {
           menu_type: Phui.Menu,
           apply_types_to_top : false,
           select_event : "click",
           button_class_names : "button"
       }
   },
   {
       init : function(){
           var menuType = this.options.menu_type;
           //make it look pretty
           this.element.addClass(this.options.class_names)
               .children("ul").addClass(this.options.child_class_names)
               .children("li").addClass(this.options.button_class_names).each(function(){
                   //need to keep a reference to each menu
				   var el = $(this);
				   el.data("menu-element", el.find(">ul, >.ui-menu").mixin(menuType))
               })
       },
       calculateSubmenuPosition : function(el, ev){
	   		var offset = el.offset();
		    offset.top += el.outerHeight();
			return offset;
	   }
   })
   
   Phui.Toolbar({
       class_names: "ui-tabs ui-widget ui-widget-content ui-corner-all",
       menu_type: Phui.UI.Menu,
       child_class_names: "ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all ui-toolbar",
       button_class_names: "ui-state-default ui-corner-all"
   }).
   extend("Phui.UI.Toolbar",{})
   

});