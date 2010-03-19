steal.plugins('jquery/controller','jquery/view/ejs','jquery/event/default').then(function(){
	$.Controller.extend("Phui.Paginator",{
		defaults : {
			buttonClass: "toolbar_button",
			rangeClass: "toolbar_range",
			activeClass: "active",
			limit: 0,
			offset: 0,
			count: 0
		},
		listensTo: ["default.paginate"]
	}, {
		init : function(){
			//check if we have prev and next ...
			this.setOffsetLimit()
		},
		update : function(options){
			this._super(options)
			this.setOffsetLimit()
		},
		setOffsetLimit : function(){
			this.options.prevActive = this.options.offset > 0
			this.options.nextActive = this.options.offset+this.options.limit < this.options.count
			this.element.html(this.view("init"))
		},
		".next_record.active click" : function(el, ev){
			
			//move to the next set ...
			var to = {
				offset: this.options.offset+ this.options.limit,
				count: this.options.count,
				limit: this.options.limit
			}
			this.element.trigger("paginate", to)
		},
		".previous_record.active click" : function(el, ev){
			
			//move to the next set ...
			var to = {
				offset: Math.max( this.options.offset- this.options.limit, 0),
				count: this.options.count,
				limit: this.options.limit
			}
			this.element.trigger("paginate", to)
		},
		".first_record.active click" : function(){
			var to = {
				offset: 0,
				count: this.options.count,
				limit: this.options.limit
			}
			this.element.trigger("paginate", to)
		},
		".last_record.active click" : function(){
			var to = {
				offset: this.options.count-this.options.limit,
				count: this.options.count,
				limit: this.options.limit
			}
			this.element.trigger("paginate", to)
		},
		"default.paginate" : function(el, ev, data){
			this.update(data)
		}
	})
})