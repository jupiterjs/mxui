steal.apps('jquery','jquery/controller').then(function(){
    $.Controller.extend("Jupiter.Positionable",
    {
        listensTo : ["show","hide"]
    },
    {
       init : function(element){
           this.element.hide().css("position","absolute");
           this.element[0].parentNode.removeChild(this.element[0])
           document.body.appendChild(this.element[0]);
		   
       },
       show : function(el, ev, position){
		   
		   this.element.css({
		   		left: position.left +"px",
				top: position.top +"px"
		   });
           //clicks elsewhere should hide
		   
       }
   })
});