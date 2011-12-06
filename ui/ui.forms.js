(function($){
	$.fn.classFocus=function(focusClass){
		$(this).focusin(function(){
			$(this).addClass(focusClass);
		})
		.focusout(function(){
			$(this).removeClass(focusClass);
		});
		return $(this);
	}
	$.fn.classHover=function(hoverClass){
		$(this).hover(function(){
			$(this).addClass(hoverClass);
		},function(){
			$(this).removeClass(hoverClass);
		});
		return $(this);
	}
	$.fn.liveHover=function(element, hoverClass){
		$(this).delegate(element, 'mouseover mouseout', function(e){
			if (e.type == 'mouseover') $(this).addClass(hoverClass);
			else $(this).removeClass(hoverClass);
			e.stopPropagation();
		});
		return $(this);
	}
	$.event.special.mousewheel={
		setup:function(d,namespaces){
			if(this.addEventListener){
				this.addEventListener('DOMMouseScroll',$.event.special.mousewheel.handler,false);
				this.addEventListener('mousewheel',$.event.special.mousewheel.handler,false);
				return;
			}
			if(this.attachEvent){
				this.onmousewheel=$.event.special.mousewheel.handler;
				return;
			}
		},
		terndown:function(namespaces){
			if(this.removeEventListener){
				this.removeEventListener('DOMMouseScroll',$.event.special.mousewheel.handler,false);
				this.removeEventListener('mousewheel',$.event.special.mousewheel.handler,false);
				return;
			}
			if(this.detachEvent){
				this.onmousewheel=null;
				return;
			}
		},
		handler:function(e){
			var event=e||window.event;
			var delta=deltaX=deltaY=0;
			var args=[].slice.call(arguments,1);
			e=$.event.fix(event);
			e.type='mousewheel';
			e.returnValue=false;
			if(e.preventDefault) e.preventDefault();
			if(event.wheelDelta) 	 delta=event.wheelDelta/120;
			if(event.detail)		 delta=-event.detail/3;
			deltaY=delta;
			if(event.axis && event.axis===event.HORIZONTAL_AXIS ) {
				deltaY=0;
				deltaX=-1*delta;
			}
			if(event.wheelDeltaY) deltaY=event.wheelDeltaY/120;
			if(event.wheelDeltaX) deltaX=-1*event.wheelDeltaX/120;
			args.unshift(e,delta,deltaX,deltaY);
			return $.event.handle.apply(this,args);
		}
	};
	$.fn.mousewheel=function(fun){
		return (fun && typeof fun=='function')?this.bind('mousewheel',fun):this.trigger('mousewheel');
	}
})($);
if(typeof ui=='undefined'){
	var ui={};
}
Class({
	parent:tools.eventDispatcher,
	implements:[tools.browser],
	pack:ui,
	name:'Forms',
	constructor:function(element){
		this.Super();
		this.element=element;
		this.elementJquery=$(this.element);
		this.disableStatus=this.elementJquery.find('input').prop('disabled');
		this.id=this.elementJquery.attr('id');
	},
	public:{
		id:''
	},
	protected:{
		element:false,
		elementJquery:false,
		disableStatus:false
	}
});
Class({
	implements:[tools.browser],
	pack:ui,
	final:true,
	name:'FormsList',
	constructor:function(selector,form){
		this.arguments=[];
		if(arguments.length>2) this.arguments=[].slice.call(arguments,2);
		this.selector=selector;
		this.form=form;
		this.elementJquery=$(this.selector);
		this.length=this.elementJquery.length;
	},
	public:{
		selector:'',
		form:'none',
		length:0,
		all:function(property,value){
			if(arguments.length==2){
				for(var i=0;i<this.length;i++){
					if(typeof property=='string'){
						if (typeof value == 'object' && typeof this.item(i)[property]=='function'){
							this.item(i)[property].apply(this.item(i), value);
						}
						else{
							this.item(i)[property]=value;
						}
					}
				}
			}
			else{
				var bool=true;
				for(var i=0;i<this.length;i++){
					if(typeof property=='string'){
						if(typeof (validate=this.item(i)[property])=='function'){
							bool=bool&&this.item(i)[property]();
						}
						else{
							bool=bool&&validate;
						}
					}
				}
				return bool;
			}
		},
		init:function(){
			if(ui[this.form]){
				this.elementJquery.each(this.build);
			}
		},
		item:function(index){
			return this.elementJquery[index].znc;
		},
		itemById:function(id){
			var item=false;
			this.elementJquery.each(function(index,_item){
				if(_item.id==id){
					item=_item.znc;
				}
			});
			return item;
		},
		range:function(range,options){
			if(typeof range=='object' && typeof options=='object'){
				for(key in range){
					for(options_key in options){
						if(typeof range[key]=='number' && this.elementJquery[range[key]].znc){
							this.elementJquery[range[key]].znc[options_key]=options[options_key];
						}
					}
				}
			}
		},
		n:function(){
			return (!!this.elementJquery[this.curr+1] && !!this.elementJquery[this.curr+1].znc && ++this.curr);
		},
		p:function(){
			return (!!this.elementJquery[this.curr-1] && !!this.elementJquery[this.curr-1].znc && --this.curr>-1);
		},
		current:function(){
			return this.elementJquery[this.curr].znc;
		},
		reset:function(){
			this.curr=0;
		}
	},
	private:{
		arguments:[],
		elementJquery:false,
		build:function(index,element){
			var $$=$(element);
			element.znc=ui[this.form].apply(null,[element].concat(this.arguments));
		},
		curr:0
	}
});
Class({
	parent:ui.Forms,
	pack:ui,
	name:'CheckBox',
	constructor:function(element){
		this.Super(element);
		this.checked=this.elementJquery.find('input').prop('checked');
		this.disableStatus=this.elementJquery.find('input').prop('disabled');
		if(this.id){
			$('label[for='+this.id+']').click(this.click);
		}
		if(this.disableStatus){
			this.elementJquery.css({
				opacity:.7
			});
		}
		this.check();
		this.elementJquery.click(this.click);
	},
	get:{
		value:function(){
			return this.checked;
		},
		disable:function(){
			return this.disableStatus;
		}
	},
	set:{
		value:function(key,value){
			this.checked=!!value;
			this.elementJquery.find('input').attr('checked',this.checked);
			this.check();
		},
		disable:function(key,value){
			this.disableStatus=value;
			if(value){
				this.elementJquery.css({
					opacity:.7
				});
			}
			else{
				this.elementJquery.css({
					opacity:1
				});
			}
		}
	},
	private:{
		checked:true,
		click:function(){
			if(!this.disableStatus){
				this.checked=!this.checked;
				this.elementJquery.find('input').attr('checked',this.checked);
				this.check();
			}
		},
		check:function(){
			if(this.checked){
				this.elementJquery.removeClass('znc-checkbox_off');
				this.elementJquery.addClass('znc-checkbox_on');
				if(this.IE6){
					this.elementJquery.unbind('mouseenter mouseleave');
					this.elementJquery.classHover('znc-checkbox_on_hover');
				}
			}
			else{
				this.elementJquery.removeClass('znc-checkbox_on');
				this.elementJquery.addClass('znc-checkbox_off');
				if(this.IE6){
					this.elementJquery.unbind('mouseleave mouseenter');
					this.elementJquery.classHover('znc-checkbox_off_hover');
				}
			}
		}
	}
});
Class({
	parent:ui.Forms,
	pack:ui,
	name:'Text',
	constructor:function(element){
		this.Super(element);
		this.element=element;
		this.elementJquery=$(this.element);
		this.type=this.elementJquery.attr('type');
		this.defaultTextStatus=!!this.defaultTextCell;
		if(this.type=='password'){
			hideInput=this.hideInput=$('<input type="text" class="'+this.elementJquery[0].className+'"/>');
			this.hideInput.hide().val('');
			this.elementJquery.after(this.hideInput);
			$('label[for='+this.id+']').click(function(){ hideInput.focus(); });
		}
	},
	public:{
		regexp:[],
		alertMesg:[],
		alertClass:'',
		defaultMesgKey:0,
		defaultTextStatus:false,
		clear:function(){
			this.elementJquery.val('');
			this.valueCell='';
			return true;
		},
		alert:function(){
			this[this.type=='password'?'hideInput':'elementJquery'].addClass(this.alertClass);
			return true;
		}
	},
	get:{
		defaultText:function(){
			return this.defaultTextCell;
		},
		disable:function(){
			return this.disableStatus;
		},
		value:function(){
			if(!this.elementJquery) return;
			return this.elementJquery.val();
		},
		validate:function(){
			if(this.elementJquery && !this.elementJquery.hasClass(this.alertClass)){
				for(var i=0;i<this.regexp.length;i++){
					if(!this.elementJquery.val().match(this.regexp[i])){
						this.valueCell=this.elementJquery.val();
						this.elementJquery.removeClass(this.focusClassCell);
						this.elementJquery.addClass(this.alertClass);
						if(this.type=='password'){
							this.elementJquery.hide();
							this.hideInput.show();
							this.hideInput.addClass(this.alertClass);
						}
						if(this.alertMesg[i]){
							this[this.type=='password'?'hideInput':'elementJquery'].val(this.alertMesg[i]);
						}
						this[this.type=='password'?'hideInput':'elementJquery'].bind('focus keydown',this.removeMesg);
						this.validateCell=false;
						return false;
					}
					this.validateCell=true;
				}
			}
			return this.validateCell;
		},
		focusClass:function(){
			return this.focusClassCell;
		}
	},
	set:{
		defaultText:function(key,value){
			if(value){
				this.defaultTextCell=value;
				this.defaultTextStatus=true;
				this.valueCell='';
				this[this.type=='password'?'hideInput':'elementJquery'].removeClass(this.alertClass);
				this[this.type=='password'?'hideInput':'elementJquery'].bind('focus keydown',this.removeMesg);
				if(this.type=='password'){
					this.elementJquery.hide();
					this.hideInput.show();
				}
				this[this.type=='password'?'hideInput':'elementJquery'].val(value);
			}
		},
		disable:function(key,value){
			this.disableStatus=value;
			if(value){
				this.elementJquery.prop('disabled',true);
				if(this.hideInput){
					this.hideInput.prop('disabled',true);
					this.hideInput.css({
						opacity:.7
					});
				}
				this.elementJquery.css({
					opacity:.7
				});
			}
			else{
				this.elementJquery.prop('disabled',false);
				if(this.hideInput){
					this.hideInput.prop('disabled',false);
					this.hideInput.css({
						opacity:1
					});
				}
				this.elementJquery.css({
					opacity:1
				});
			}
		},
		value:function(key,value){
			this.valueCell=value;
			this.elementJquery.val(value);
		},
		validate:function(key,value){
			if(!value){
				this.elementJquery.removeClass(this.focusClassCell);
				this.valueCell=this.elementJquery.val();
				if(this.type=='password'){
					this.elementJquery.hide();
					this.hideInput.show();
					this.hideInput.addClass(this.alertClass);
				}
				else{
					this.elementJquery.addClass(this.alertClass);
				}
				if(this.alertMesg[this.defaultMesgKey]){
					this[this.type=='password'?'hideInput':'elementJquery'].val(this.alertMesg[this.defaultMesgKey]);
				}
			}
		},
		focusClass:function(key,value){
			this.elementJquery.classFocus(value);
			this.focusClassCell=value;
		},
		text:function(key,value){
			if(value){
				if(this.type=='password'){
					this.elementJquery.hide();
					this.hideInput.show();
				}
				this[this.type=='password'?'hideInput':'elementJquery'].bind('focus keydown',this.removeMesg).val(value);
			}
		}
	},
	private:{
		element:false,
		elementJquery:false,
		focusClassCell:'',
		type:'text',
		validateCell:true,
		defaultTextCell:'',
		valueCell:'',
		hideInput:false,
		removeMesg:function(){
			this.elementJquery.removeClass(this.alertClass);
			this.elementJquery.addClass(this.focusClassCell);
			this[this.type=='password'?'hideInput':'elementJquery'].unbind('focus keydown',this.removeMesg);
			if(this.type=='password'){
				this.elementJquery.show();
				this.hideInput.hide();
				this.hideInput.addClass(this.focusClassCell);
				this.elementJquery.focus();
			}
			this.elementJquery.val(this.valueCell);
			this.defaultTextStatus=false;
		}
	}
});
Class({
	parent:ui.Text,
	pack:ui,
	name:'SpinBox',
	constructor:function(element){
		this.Super(element);
		this.regexp=[];
		this.alertMesg=[];
		this.element=element;
		this.elementJquery=$(this.element);
		this.spanUpJquery = this.elementJquery.find('span.znc-spinbox-up');
		this.spanDownJquery = this.elementJquery.find('span.znc-spinbox-down');
		this.inputJquery=this.elementJquery.find('input');
		if (this.IE6){
			this.spanUpJquery.classHover('znc-spinbox-up_hover');
			this.spanDownJquery.classHover('znc-spinbox-down_hover');
		}
		this.elementJquery.keydown(this.keyDown);
		this.elementJquery.keyup(this.keyUp);
		this.inputJquery.blur(this.blur);
		this.spanUpJquery.click(this.stepUp);
		this.spanDownJquery.click(this.stepDown);
		this.inputJquery.val(this.valueNumCell+''+this.suffixCell);
		this.inputJquery.mousewheel(this.wheel);
	},
	public : {
		cycle : false,
		regexp : [],
		stepUp : function(isShift){
			if(typeof isShift=='object'){
				isShift=isShift.shiftKey;
			}
			var testVal = this.valueNumCell + (!isShift ? this.stepCell : this.stepCell * 10);
			if (this.cycle && testVal > this.maxCell){
				this.valueNumCell = this.minCell;
			}
			else{
				this.valueNumCell += (!isShift) ? this.stepCell : this.stepCell * 10;
			}
			this.updateVal();
			this.checkValues();
		},
		stepDown : function(isShift){
			if(typeof isShift=='object'){
				isShift=isShift.shiftKey;
			}
			var testVal = this.valueNumCell - (!isShift ? this.stepCell : this.stepCell * 10);
			if (this.cycle && testVal < this.minCell){
				this.valueNumCell = this.minCell;
			}
			else{
				this.valueNumCell -= (!isShift) ? this.stepCell : this.stepCell * 10;
			}
			this.updateVal();
			this.checkValues();
		}
	},
	private : {
		minCell : -Math.pow (2,53),
		maxCell : Math.pow (2,53),
		suffixCell : '',
		stepCell: 1,
		element:false,
		elementJquery:false,
		validateCell:false,
		valueCell : '',
		valueNumCell : 0,
		hasUp : true,
		hasDown : true,
		blur:function(){
			this.updateVal();
			this.checkValues();
		},
		keyDown: function(e){
			switch (e.which){
				case 38:
					/// up arrow
					this.stepUp(e.shiftKey);
					break;
				case 40:
					/// down arrow
					this.stepDown(e.shiftKey);
					break;
				default:
					break;
			}
		},
		keyUp : function(e){
			switch (e.which){
				case 38:
					this.checkValues();
					break;
				case 40:
					this.checkValues();
					break;
				default:
					this.valueCell = this.inputJquery.val();
					this.updateValNum();
					break;
			}
		},
		wheel:function(e,delta){
			this[delta>0?'stepUp':'stepDown'](e);
		},
		toNumber : function(val){
			if(typeof val=='string'){
				val = val.s_replace([',', '[а-яa-z\s]'], ['.', ''] );
			}
			return parseFloat(val);
		},
		updateVal : function(){
			this.inputJquery.val(this.valueNumCell+''+this.suffixCell);
		},
		updateValNum : function(){
			var value=this.toNumber(this.valueCell);
			if(!isNaN(value)){
				this.valueNumCell = value;
			}
		},
		checkValues : function(){
			this.hasUp = this.hasDown = true;
			if (this.valueNumCell > this.maxCell){
				this.valueNumCell = this.maxCell;
			}
			if (this.valueNumCell < this.minCell){
				this.valueNumCell = this.minCell;
			}
			if (!this.cycle){
				if (this.valueNumCell >= this.maxCell){
					this.spanUpJquery.addClass('disabled').css('opacity', .5);
					this.hasUp = false;
				}
				if (this.valueNumCell <= this.minCell){
					this.spanDownJquery.addClass('disabled').css('opacity', .5);
					this.hasDown = false;
				}
			}
			if (this.hasUp && this.spanUpJquery.hasClass('disabled')){
				this.spanUpJquery.removeClass('disabled').css('opacity', 1);
			}
			if (this.hasDown && this.spanDownJquery.hasClass('disabled')){
				this.spanDownJquery.removeClass('disabled').css('opacity', 1);
			}
			this.updateVal();
		}
	},
	get : {
		min : function(){
			return this.minCell;
		},
		max : function(){
			return this.maxCell;
		},
		value : function(){
			return this.valueNumCell;
		},
		suffix : function(){
			return this.suffixCell;
		},
		step : function(){
			return this.stepCell;
		},
		validate : function(){
			for (var i=0; i < this.regexp.length; ++i){
				if(!String(this.valueNumCell).match(this.regexp[i])){
					this.validateCell=false;
					return false;
				}
				else{
					this.validateCell=true;
				}
			}
			return this.validateCell;
		}
	},
	set : {
		min : function(key, val){
			this.minCell = Number(val);
			this.valueNumCell=(this.valueNumCell<this.minCell)?this.minCell:this.valueNumCell;
			this.checkValues();
		},
		max : function(key, val){
			this.maxCell = Number(val);
			this.valueNumCell=(this.valueNumCell>this.maxCell)?this.maxCell:this.valueNumCell;
			this.checkValues();
		},
		step : function(key, val){
			this.stepCell = Number(val);
		},
		value : function(key, val){
			this.valueNumCell=this.toNumber(val);
			this.checkValues();
		},
		suffix : function(key, val){
			this.suffixCell = val;
			this.checkValues();
		},
		validate : function(key, val){
			this.validateCell = val;
		}
	}
});
Class({
	parent:ui.Text,
	pack:ui,
	name:'Select',
	constructor:function(element,autocomlete,validOnly,maximum){
		this.Super(element);
		var list=[];
		this.what=[];
		if(validOnly!==undefined) this.validOnly=validOnly;
		if(autocomlete!==undefined) this.autocomlete=autocomlete;
		if(typeof maximum=='number') this.maximum=maximum;
		this.inputJquery=this.elementJquery.find('input');
		this.selectDivJquery=this.elementJquery.find('div.'+this.zncSelectInput);
		this.outputJquery=this.elementJquery.find('div.'+this.holderClass);
		this.arrowJquery=this.elementJquery.find('div.'+this.arrowClass);
		this.currentElement=(this.elementJquery.find('li.'+this.currentClass).length==0)?this.elementJquery.find('li:first'):this.elementJquery.find('li.'+this.currentClass);
		this.inputJquery.val(this.currentElement.text());
		this.inputJquery.focus(this.focus);
		if(this.model){
			this.arrowJquery.classHover(this.arrowHoverClass);
			this.elementJquery.find('li').width(this.elementJquery.width()).classHover(this.hoverClass);
			this.arrowJquery.classHover(this.hoverClass);
		}
		this.elementJquery.find('li').each(function(index,element){ list.push($(element).text()); });
		this.list=list;
		if(!this.autocomlete && this.inputJquery.length>0){
			this.selectDivJquery=$('<div class="znc-select_input" style="width:'+this.inputJquery.width()+'px;">'+this.inputJquery.val()+'</div>');
			this.inputJquery.replaceWith(this.selectDivJquery);
		}
		else if(this.autocomlete && this.selectDivJquery.length>0){
			this.inputJquery=$('<input type="text" value="'+this.selectDivJquery.text()+'"/>');
			this.selectDivJquery.replaceWith(this.inputJquery);
		}
		this.elementJquery.click(function(e){ e.stopPropagation(); });
		/// NOTICE inputJquery
		if(this.inputJquery && this.inputJquery.length>0){
			this.inputJquery.focus(this.openBox);
			this.value=this.inputJquery.val();
		}
		/// NOTICE selectDivJquery
		if(this.selectDivJquery && this.selectDivJquery.length>0){
			this.selectDivJquery.click(this.openBox);
		}
		/// NOTICE arrowJquery
		if(this.arrowJquery && this.arrowJquery.length>0){
			this.arrowJquery.click(this.openBox);
		}
		this.currentElement.unbind('mouseleave mouseenter');
		this.currentElement.addClass(this.hoverClass);
		this.elementJquery.find('li').click(this.select);
		this.elementJquery.keydown(this.keyDown);
		this.elementJquery.keyup(this.keyUp);
		this.elementJquery.mousewheel(this.changeListItem);
	},
	public : {
		validOnly:true,
		caseSensitive:false,
		currentElement:false,
		maximum:100,
		focusValid:false,
		AllEnterState:{NONE:1,CURRENT:2,HOVER:4}
	},
	set:{
		value:function(key,value){
			this.value=value;
			this.inputJquery.val(value);
		},
		autocomlete:function(key,value){
			if(this.autocomlete!=value && value){
				if(this.inputJquery.length==0){
					this.inputJquery=$('<input type="text" value="'+this.currentElement.text()+'"/>');
				}
				this.selectDivJquery.replaceWith(this.inputJquery);
				this.inputJquery.unbind('focus keydown keyup');
				this.inputJquery.focus(this.openBox);
				this.inputJquery.keyup(this.keyUp);
			}
			else if(this.autocomlete!=value){
				this.elementJquery.removeClass(this.alertClass);
				if(this.selectDivJquery.length==0){
					this.selectDivJquery=$('<div class="znc-select_input">'+this.currentElement.text()+'</div>').css({
						width:this[this.model?'inputJquery':'elementJquery'].width(),
						height:this.inputJquery.height()
					});
				}
				this.inputJquery.replaceWith(this.selectDivJquery);
				this.selectDivJquery.unbind('click');
				this.selectDivJquery.click(this.openBox);
			}
			this.autocomlete=value;
		},
		list:function(key,value){
			if(/*!this.validOnly && */typeof value=='object' && value.length>0){
				var output=this.outputJquery;
				this.list=value;
				this.outputJquery.find('ul').html('');
				value.forEach(function(element,index){
					this.outputJquery.find('ul').append(
						'<li '+((index==0&&this.validOnly)?'class="'+this.currentClass+'"':'')+'>'+element+'</li>'
					);
				},this);
				this.outputJquery.find('li').click(this.select);
				this.currentElement=this.outputJquery.find('li').eq(0);
				if(this.model){
					this.elementJquery.find('li')
						.width(this.inputJquery.width())
						.classHover(this.hoverClass);
				}
				this.currentElement.addClass(this.currentClass);
				this.currentElement.unbind('mouseenter mouseleave');
				this.currentElement.addClass(this.classHover);
				this.inputJquery.trigger('keyup',[true]);
				return;
			}
			if(value.length==0){
				this.list=value;
				this.outputJquery.find('ul').html('');
				this.inputJquery.trigger('keyup',[true]);
			}
		},
		validate:function(key,value){
			if(!value && this.validate!=value){
				this.elementJquery.removeClass(this.focusClass);
				this.elementJquery.addClass(this.alertClass);
				this.validate=value;
				if(this.alertMesg[this.defaultMesgKey]){
					this.inputJquery.val(this.alertMesg[this.defaultMesgKey]);
				}
			}
		},
		focusClass:function(key,value){
			var element=this.elementJquery;
			this.inputJquery.unbind('focusin focusout').bind({
				focusin:function(){ element.addClass(value); },
				focusout:function(){ element.removeClass(value); }
			});
			this.focusClass=value;
		},
		disable:function(key,value){
			this.disableStatus=value;
			if(value){
				this.inputJquery.prop('disabled',true);
				this.elementJquery.css('opacity',.8);
			}
			else{
				this.inputJquery.prop('disabled',false);
				this.elementJquery.css('opacity',1);
			}
		}
	},
	get:{
		value:function(){
			if(this.inputJquery) return this.value;
		},
		autocomlete:function(){
			return this.autocomlete;
		},
		list:function(){
			return this.list;
		},
		validate:function(){
			if(this.inputJquery && !this.elementJquery.hasClass(this.alertClass)){
				try{
					this.regexp.forEach(function(element,i){
						if(!this.inputJquery.val().match(element)){
							this.value=this.inputJquery.val();
							if(this.focusClassCell) this.elementJquery.removeClass(this.focusClassCell);
							this.elementJquery.addClass(this.alertClass);
							if(this.alertMesg[i]){
								this.inputJquery.val(this.alertMesg[i]);
							}
							this.elementJquery.bind('focus keydown',this.removeMesg);
							this.validate=false;
							throw {};
						}
						this.validate=true;
					},this);
				}
				catch(err){
					this.validate=false;
				}
				return this.validate;
			}
		},
		focusClass:function(){
			return this.focusClass;
		},
		disable:function(){
			return this.disableStatus;
		}
	},
	protected:{
		eventList:['keypress','select','enter']
	},
	private : {
		currentClass:'znc-select_current',
		holderClass:'znc-select_results_holder',
		hoverClass:'znc-select_hover',
		arrowClass:'znc-select_arrow',
		arrowHoverClass:'znc-select_arrow_hover',
		zncSelectInput:'znc-select_input',
		focusClass:'',
		inputJquery:false,
		outputJquery:false,
		arrowJquery:false,
		selectDivJquery:false,
		state:false,
		autocomlete:false,
		model:'~!!(this.currentIEId&(this.IEMask^this.IE9Id))~',
		list:[],
		what:[],
		value:'',
		validate:true,
		enterState:'~this.AllEnterState.HOVER~',
		openBox:function(e){
			if(this.disableStatus || this.list.length==0) return;
			if(!this.validate){
				this.inputJquery.val(this.value);
				this.elementJquery.removeClass(this.alertClass);
				this.validate=true;
			}
			if(!this.state || e.type=='focus'){
				this.outputJquery.css({
					width:this.elementJquery[this.model?'outerWidth':'width'](),
					top:this.elementJquery.height(),
					left:-1,
					display:'block'
				});
				$('body').unbind('click',this.bodyClose);
				$('body').click(this.bodyClose);
				if(this.focusValid) this.inputJquery.trigger('keyup',[true]);
				this.state=true;
			}
			else{
				this.outputJquery.hide();
				this.state=false;
				this.elementJquery.find('li').show();
				this.elementJquery.find('li').each(function(index,element){ $(element).text($(element).text()); });
				if(this.validOnly){
					var text=this.currentElement.text();
					this.value=text;
					this.inputJquery.val(text);
					this.dispatch("select",[text]);
				}
			}
		},
		bodyClose:function(e){
			if(this.state){
				this.outputJquery.hide();
				this.state=!this.state;
				$('body').unbind('click',this.bodyClose);
				this.elementJquery.find('li').show();
				this.elementJquery.find('li').each(function(index,element){ $(element).text($(element).text()); });
				if(this.validOnly){
					var text=this.currentElement.text();
					this.inputJquery.val(text);
					this.dispatch("select",[text]);
				}
			}
		},
		select:function(e,nothide){
			if(!e) return;
			var $$=$(e.currentTarget);
			var text=$$.text();
			this.currentElement.classHover(this.hoverClass).removeClass(this.hoverClass);
			$$.unbind('mouseleave mouseenter').addClass(this.hoverClass);
			this.currentElement=$$;
			this[this.autocomlete?'inputJquery':'selectDivJquery'][this.autocomlete?'val':'text']($$.text());
			if(!nothide){
				this.outputJquery.hide();
				this.state=false;
			}
			this.value=text;
			this.dispatch("select",[text]);
		},
		keyDown:function(e){
			switch (e.which){
				/// up arrow
				case 38: this.changeListItem(null,1);
				break;
				//down arrow
				case 40: this.changeListItem(null,-1);
				break;
			}
		},
		keyUp:function(e,dispatch){
			if(e.which==13){
				if(this.enterState&this.AllEnterState.NONE){
					this.outputJquery.hide();
					this.dispatch('enter',[this.inputJquery.val()]);
					return;
				}
				if(this.enterState&this.AllEnterState.CURRENT){
					this.outputJquery.hide();
					this.currentElement.click();
					this.dispatch('enter',[this.inputJquery.val()]);
					return;
				}
				if(this.enterState&this.AllEnterState.HOVER){
					this.outputJquery.hide();
					try{
						[].forEach.call(this.elementJquery.find('li'),function(element,index){
							var $$=$(element);
							if($$.hasClass(this.hoverClass) && !$$.hasClass(this.currentClass)){
								$$.click();
								throw {};
							}
						},this);
					} catch(err){}
					this.dispatch('enter',[this.inputJquery.val()]);
					return;
				}
			}
			if($.inArray(e.which,[38,40])>-1) return;
			if(this.list.length==0) this.outputJquery.hide();
			this.enterState=this.validOnly?this.AllEnterState.CURRENT:this.AllEnterState.NONE;
			if(this.list.length>0){
				this.outputJquery.css({
					width:this.inputJquery.outerWidth(),
					top:this.elementJquery.height(),
					left:-1,
					display:'block'
				});
				this.state=true;
			}
			var li=this.elementJquery.find('li');
			this.what=[];
			li.show();
			$(this.list).each(this.every);
			this.list.forEach(function(element,index){
				this.outputJquery[this.what.length==0||this.list.length==0?'hide':'show']();
				this.state=!(this.what.length==0||this.list.length==0);
				if($.inArray(index,this.what)==-1) li.eq(index).hide();
				else{
					var regexp=new RegExp().compile.call(new RegExp(),'('+this.inputJquery.val().escape()+')',!this.caseSensitive?'i':null);
					var text=li.eq(index).text();
					var replace=text.match(regexp)[0];
					li.eq(index).html(text.replace(replace,"<b style='background:#eee;'>"+replace+"</b>"));
				}
			},this);
			if(!dispatch) this.dispatch('keypress',[this.inputJquery.val()]);
		},
		changeListItem:function(e,delta){
			this.enterState=this.AllEnterState.HOVER;
			var current=(this.currentElement?this.currentElement:this.elementJquery.find('li').eq(0));
			if([].filter.call(current[delta>0?'prevAll':'nextAll'](),function(element,index){ return $(element).css('display')!='none'; }).length>0){
				try{
					[].forEach.call(
						current[delta>0?'prevAll':'nextAll'](),
						function(element,index){
							var $$=$(element);
							if($$.css('display')!='none'){
								$$.trigger('click',[true]);
								throw {};
							}
						},
						this
					);
				} catch(err){}
			}
			else if(current.css('display')!='none'){
				current.trigger('click',[true]);
			}
		},
		every:function(index,element){
			if(index>this.maximum) return false;
			else{
				var regexp=new RegExp().compile.call(new RegExp(),this.inputJquery.val().escape(),!this.caseSensitive?'i':null);
				if(String(element).match(regexp)){
					this.what.push(index);
				}
			}
		}
	}
});
Class({
	pack:ui,
	final:true,
	parent:ui.Forms,
	name:'Tabs',
	constructor:function(element){
		this.Super(element);
		this.build();
		this.urlWorker.bind('hash',this.hash);
	},
	public:{
		currentClass:'tab',
		activeClass:'active_tab',
		callback:false,
		collection:false,
		pushState:false,
		active:function(){
			if(!this.elementJquery.hasClass(this.activeClass)){
				if(this.collection){
					this.collection.reset();
					do{
						this.collection.current().disactive();
					}
					while(this.collection.n());
				}
				var a=this.elementJquery.find('a');
				var text=a.text();
				var href=a.attr('href');
				this.elementJquery.find('> div:first-child').after('<span>'+text+'</span><input type="hidden" value="'+href+'"/>');
				a.remove();
				this.elementJquery.addClass(this.activeClass);
			}
		},
		disactive:function(){
			if(this.elementJquery.hasClass(this.activeClass)){
				var text=this.elementJquery.find('span').text();
				var href=this.elementJquery.find('input').val();
				this.elementJquery.find('> div:first-child').after('<a href="'+href+'">'+text+'</a>');
				this.elementJquery.find('input').remove();
				this.elementJquery.find('span').remove();
				this.elementJquery.removeClass(this.activeClass);
			}
		}
	},
	private:{
		urlWorker:new tools.Url(),
		aliasCell:'',
		hash:function(){
			var hash=location.hash.substr(1);
			if(hash.indexOf(';')!=-1){
				hash=hash.substr(0,hash.indexOf(';'));
			}
			if(this.aliasCell && this.aliasCell==hash){
				this.elementJquery.click();
			}
		},
		build:function(){
			var index=this.elementJquery.index('div.'+this.currentClass);
			var zIndex=28-index;
			this.elementJquery.css('z-index',zIndex);
			this.elementJquery.delegate('a','click',function(e){
				e.preventDefault();
			});
			this.elementJquery.click(this.click);
			if((this.IE6||this.IE7)&&index>0){
				this.elementJquery.css({zoom:1});
			}
		},
		click:function(){
			if(!this.elementJquery.hasClass(this.activeClass)){
				var href=this.elementJquery.find('a').attr('href');
				this.active();
				if(typeof this.callback=='function'){
					this.callback();
				}
				if(this.pushState){
					history.pushState(
						{time:new Date(),old:location.href},
						'',
						href.replace('#','/')
					);
					$(window).trigger('pushstate',{time:new Date().getTime(),old:location.href});
				}
				else {
					href.go();
				}
			}
		}
	},
	get:{
		alias:function(){
			return this.aliasCell;
		}
	},
	set:{
		alias:function(key,value){
			this.aliasCell=value;
			var hash=location.hash;
			if(hash.match(new RegExp('^#'+this.aliasCell))){
				this.elementJquery.click();
			}
		}
	}
});
Class({
	parent:ui.Forms,
	pack:ui,
	name:'Button',
	constructor:function(element){
		this.Super(element);
		this.toggleText=[];
		this.elementJquery.click(this.click);
		this.cssClass=this.elementJquery.attr('class');
		if(this.elementJquery.find('input[name="state"]').length>0){
			this.toggleState=parseInt(this.elementJquery.find('input[name="state"]').val())||0;
		}
	},
	public:{
		cssClass:'',
		toggleClass:'',
		toggleState:0,
		aloneClass:function(collection,classes){
			if(typeof collection=='object' && typeof classes=='object'){
				var id=this.elementJquery.attr('id');
				collection.reset();
				do{
					if(collection.current().id!=id){
						for(var i=0;i<classes.length;i++){
							collection.current().removeClass(classes[i]);
						}
					}
				}
				while(collection.n());
			}
		},
		removeClass:function(Class){
			this.elementJquery.removeClass(Class);
			this.elementJquery.find("> *").removeClass(Class);
		}
	},
	get:{
		toggle:function(){
			return this.toggleCell;
		},
		toggleText:function(){
			return this.toggleTextCell;
		}
	},
	set:{
		toggle:function(key,value){
			this.toggleCell=value;
		},
		toggleText:function(key,value){
			if(typeof value=='object'){
				this.toggleTextCell=value;
				this.elementJquery.find('span').text(this.toggleTextCell[this.toggleState]);
			}
		}
	},
	private:{
		toggleCell:false,
		toggleTextCell:[],
		click:function(){
			if(this.toggleCell){
				if(this.toggleState){
					if(this.toggleClass && this.cssClass){
						this.elementJquery.removeClass(this.toggleClass);
						this.elementJquery.addClass(this.cssClass);
					}
					this.toggleState=0;
					if(this.toggleTextCell[this.toggleState]){
						this.elementJquery.find('span').text(this.toggleTextCell[this.toggleState]);
					}
				}
				else{
					if(this.toggleClass && this.cssClass){
						this.elementJquery.removeClass(this.cssClass);
						this.elementJquery.addClass(this.toggleClass);
					}
					this.toggleState++;
					if(this.toggleTextCell[this.toggleState]){
						this.elementJquery.find('span').text(this.toggleTextCell[this.toggleState]);
					}
				}
			}
		}
	}
});