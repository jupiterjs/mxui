steal.plugins('phui/widget/textbox','phui/widget/show','jquery/dom/compare').then(function($){
        

    Phui.Widget.extend("Phui.Widget.Editable",
    {
        defaults : {
            show_type : Phui.Widget.Show,
            edit_type : Phui.Widget.Textbox
        },
        listenTo : ['focus','select','deselect']
    },
    {
        setup : function(el, options){
            this._super(el, options);
            if(this.options.group){
                this.element.addClass(this.options.group);
                this.element.data('group', this.options.group);
            }                    
        },
        init : function(el, options){
            this.mode = 'SHOW'
            this.element.attr('tabindex','0').css("outline","none");
        },
        click : function(){
            
        },
        focus : function(el, ev){
            if(ev.target == this.element[0]){
                this.options.value = this.value();
                //this.element[0].tabindex = null //.attr('tabindex','')
                this.element.removeAttr("tabindex");
                
                if(this.mode == 'SHOW'){
                    this.ignoreNextBlur = true;
                    this.element.html(this.options.edit_type.view(this.options)).hookupView();
                    $(this.element.children()[0] ).trigger("select");
                    this.mode = 'EDIT';
                    
                }else{
                    //this.element.html(this.options.show_type.view(this.options)).hookupView()
                    //this.mode = 'SHOW'
                }
            }
        },
        blur : function(el, ev){
            /*if(this.ignoreNextBlur){
                this.ignoreNextBlur = false;
                return;
            }*/
            if(true ){
                this.options.value = this.value();
                if(this.mode == 'SHOW'){
                    
                }else{

                    $(this.element.children()[0] ).trigger("deselect");                    
                    
                    var el = this.element, ST = this.options.show_type, options = this.options;
                    
                    setTimeout(function(){
                        el.html(ST.view(options)).hookupView()
                    },10)

                    this.mode = 'SHOW';
                    this.element.attr('tabindex','0');
                }
            }
        },
        value : function(){
            return this.element.children().controller().value()
        },
        select : function(el, ev){
            ev.stopPropagation();
            this.element.addClass('selected');            
            this.element.trigger('selected');
        },
        deselect : function(el, ev){
            ev.stopPropagation();
            this.element.removeClass('selected');            
            this.element.trigger('deselected');
        }
    });

})
