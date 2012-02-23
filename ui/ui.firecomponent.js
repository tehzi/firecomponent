String.prototype.s_replace=function(arr1,arr2){
	var $$=this;
	if(typeof arr1=="object"){
		for(var i=0;i<arr1.length;i++){
			if(typeof arr1[i]!='undefined' && typeof arr2[i]!='undefined'){
				$$=$$.replace(new RegExp(arr1[i],"gi"),arr2[i]);
			}
		}
	}
	return $$;
}
String.prototype.escape = function() {
	return this.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
var ui={
	templates:{
		one_input:"<div class='line'><label for='%name%'>%label% </label><input type='text' name='%name%' id='%name%' class='text' value='%value%'/><div class='zerofont clear'></div></div>",
		textarea:"<div class='fortextarea'><label for='%name%'>%label% </label><div style='clear:both;margin:0px 0px 0px 8px;'><textarea name='%name%' id='%name%'>%textarea%</textarea></div></div>",
		checkbox:"<div class='line'><label for='%name%'>%label% </label><input type='checkbox' name='%name%' id='%name%' %checked% class='checkbox' value='%name%'/></div>",
		spin:'<div class="line"><label for="%name%">%label% </label><div class="znc-spinbox left"><span class="znc-spinbox-up"></span><span class="znc-spinbox-down"></span><input type="text" id="%name%" name="%name%"/></div><div class=\'zerofont clear\'></div></div>',
		bigButton:"<div id=\"%id%\" class=\"znc-button\">%image%%text%</div>",
		button:'<div class="znc-button_small" style="width:90%;margin:5px auto;float:none;">%button_text%</div>',
		commandbutton:'<li><div class="znc-button_small" id="%id%" style="display:inline-block;">%button_text%</div></li>',
		flash:tools.browser.IE?
			'<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0" width="%width%" height="%height%" id="%id%" >\
				<param name="movie" value="%src%">\
				<param name="quality" value="high"/>\
				<param name="bgcolor" value="#FFFFFF">\
				<param name="allowscriptaccess" value="always"/>\
				<param name="play" value="true"/>\
				<param name="loop" value="false"/>\
				<param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer">\
				<param name="wmode" value="opaque">\
			</object>':
			'<object data="%src%" width="%width%" height="%height%" type="application/x-shockwave-flash" id="%id%">\
				<param name="quality" value="high"/>\
				<param name="bgcolor" value="#FFFFFF">\
				<param name="allowscriptaccess" value="always"/>\
				<param name="play" value="true"/>\
				<param name="loop" value="false"/>\
				<param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer">\
				<param name="wmode" value="opaque">\
			</object>',
		calendar: {
			main : 
			'<div class="znc-calendar">'+ 
			'<a class="znc-calendar-buttonPrev"></a><a class="znc-calendar-buttonNext"></a>'+
			'<div class="znc-calendarsHolder"></div><div class="znc-calendar-divider zerofont"></div>'+
			'<div class="znc-calendar-output"><input type="text" class="znc-calendar-dateInput"/></div></div>',
			holder : '<div class="znc-calendar-holder"><div class="znc-calendar-header"><span class="monthName"></span> <span class="year"></span></div><div class="znc-calendar-daynames"></div><div class="znc-calendar-days"></div>',
			shadow : '<div class="znc-calendar-shadow_top zerofont"></div><div class="znc-calendar-shadow_right zerofont"></div><div class="znc-calendar-shadow_bottom zerofont"></div><div class="znc-calendar-shadow_left zerofont"></div><div class="znc-calendar-shadow_corner zerofont"></div>',
			day : '<div class="znc-calendar-day">'
		}
		
	},
	dialog_stack_close:[],
	dialog_stack_ok:[],
	dialog_stop_close:false
};
Class({
	name:"window_decorator",
	pack:ui,
	implements:[tools.browser],
	parent:tools.eventDispatcher,
	constructor:function(replace_object,id){
		this.Super();
		if(replace_object){
			for(var key in replace_object){
				this.html=this.html.replace(new RegExp("\\{"+key+"\\}","gi"),replace_object[key]);
			}
		}
		this.html=this.html.replace(/\{class\}/gi,this.cssClass);
		if(this.html){
			this.winJquery=$(this.html);
			this.winJquery.hide();
			this.winJquery.appendTo("body");
		}
// 		if(this.positionTop||this.positionLeft){
// 			this.positionMode=false;
// 		}
		if(id && typeof id=='string'){
			this.winJquery.attr('id',id);
		}
	},
	public:{
		drag:"",
		autoPosition:true,
		positionTop:false,
		positionLeft:false,
		shadow:true,
		cssClass:"standart_window",
		drag_box:"",
		winJquery:false,
		open:function(){
			if(this.winJquery){
				this.winJquery.removeAttr("style");
				if(this.autoPosition) this.positionTop=$(window).scrollTop()+Math.abs(Math.round(($(window).height()/2)-(this.winJquery.height()/2)));
				if(this.autoPosition) this.positionLeft=$(window).scrollLeft()+Math.abs(Math.round(($(window).width()/2)-(this.winJquery.width()/2)));
				this.winJquery.css({
					top:this.positionTop,
					left:this.positionLeft,
					zIndex:this.zIndex()+1
				});
				this.shadowMake();
				this.winJquery.show();
				this.dispatch("OPEN");
				this.winJquery.find("*.close").click(this.close);
				this.winJquery.find("*.ok").click(this.ok);
				this.winJquery.find("*.cancel").click(this.cancel);
				ui.dialog_stack_close.push(this.close);
				ui.dialog_stack_ok.push(this.ok);
			}
		},
		close:function(){
			this.destroy();
			this.dispatch("CLOSE");
			ui.dialog_stack_close.pop();
			ui.dialog_stack_ok.pop();
		},
		ok:function(){
			var array = [];
			var object = {};
			this.winJquery.find("input[type=text], input[type=checkbox]:checked, input[type=radio]:checked, textarea, select").each(function(){
				array.push($(this).val());
				if(!object[$(this).attr("name")]){
					object[$(this).attr("name")] = $(this).val();
				}
				else{
					if(typeof object[$(this).attr("name")]=="object"){
						object[$(this).attr("name")].push($(this).val());
					}
					else{
						object[$(this).attr("name")]=[object[$(this).attr("name")],$(this).val()];
					}
				}
			});
			this.destroy();
			this.dispatch("OK",[object,array]);
		},
		remove:function(){
			this.winJquery.remove();
		},
		cancel:function(){
			var array = [];
			var object = {};
			this.winJquery.find("input[type=text], input[type=checkbox]:checked, input[type=radio]:checked, textarea, select").each(function(){
				array.push($(this).val());
				object[$(this).attr("id")] = $(this).val();
			});
			this.destroy();
			this.dispatch("CANCEL",[object,array]);
		}
	},
	protected:{
		eventList:["CLOSE","OPEN","OK","CANCEL"],
		html:"",
		inBox:"",
		innerHTML:"",
		position:"",
		positionMode:true,
		random:'~Math.random()*10000>>1~',
		zIndex:function(){ 
			return parseInt($("div[id^='alert_shadow']:last").css('z-index'))+2||500 ;
		},
		shadowMake:function(){
			if(this.shadow){
				$(window).resize(function(){
					$("#alert_shadow_"+this.random).css({
						width:$(document).width(),
						height:$(document).height()
					});
				});
				$("#alert_shadow_"+this.random).remove();
				$("<div id='alert_shadow_"+this.random+"'></div>").css({
					position : "absolute",
					top : "0px",
					left : "0px",
					width : $(document).width(),
					height : $(document).height(),
					zIndex : this.zIndex(),
					background : "#000",
					opacity : .35
				})
				.appendTo("body");
			}
		},
		destroy:function(){
			if(this.shadow){
				$("#alert_shadow_"+this.random).remove();
			}
			this.winJquery.hide();
		},
		shadowRemove:function(){
			if(this.shadow){
				$("#alert_shadow_"+this.random).remove();
			}
		}
	}
});
Class({
	name:"admin_window",
	pack:ui,
	parent:ui.window_decorator,
	constructor:function(){
		switch(arguments.length){
			case 0: this.Super();
			break;
			case 1: this.Super(arguments[0]);
			break;
			case 2: this.Super(arguments[0],arguments[1]);
			break;
		}
	},
	public:{
		cssClass:"admin_window",
		drag_box:"~'div.'+this.cssClass+'_title'~",
		open:function(clear,not){
			$(document).unbind("keydown.admin_window"+this.random);
			$(document).bind("keydown.admin_window"+this.random,this.shortcurts);
			if(!clear){
				this.winJquery.find("input[type=text],textarea").each(function(index,item){
					if(!not && $.inArray(index,not)==-1) $(item).val("");
				});
			}
			if(!this.one){
				this.winJquery.find("div."+this.cssClass+"_close,*."+this.cssClass+"_cancel").click(this.close);
				this.winJquery.find("*."+this.cssClass+"_ok").click(this.ok);
				this.winJquery.find("div.admin_window_button input").classHover("input_hover");
				this.winJquery.draggable({ handle:this.drag_box });
				this.one=true;
			}
			this.parent.open();
			$(this.winJquery.find("input[type=text],textarea")[0]).focus();
		},
		close:function(){
			$(document).unbind("keydown.admin_window"+this.random);
			this.parent.close();
		},
		keypress_off:function(){
			$(document).unbind("keydown.admin_window"+this.random);
		},
		keypress_on:function(){
			$(document).unbind("keydown.admin_window"+this.random+"");
			if(arguments.length==0) $(document).bind("keydown.admin_window"+this.random+"",this.shortcurts);
			if(arguments.length==1 && typeof arguments[0]=='function'){
				var fun=arguments[0];
				var win=this;
				$(document).bind("keydown.admin_window"+this.random,function(e){
					if(e.keyCode==13){
						fun(e);
						return;
					}
					if(e.keyCode==27){
						if(ui.dialog_stop_close){
							setTimeout(function(){
								ui.dialog_stop_close=false;
							},100);
							return;
						}
						if(typeof ui.dialog_stack_close[ui.dialog_stack_close.length-1]=='function'){
							ui.dialog_stack_close[ui.dialog_stack_close.length-1]();
						}
						else{
							win.close();
						}
						ui.dialog_stop_close=!ui.dialog_stop_close;
						return;
					}
				});
			}
		}
	},
	protected:{
		html:
		'<div class="{class}" style="display:none;">\
			<div class="{class}_header">\
				<div class="{class}_title">{title}</div>\
				<div class="{class}_close {class}_cancel">&nbsp;</div>\
			</div>\
			<div class="{class}_content">{content}</div>\
			<div class="{class}_button">\
				<ul>\
					{buttons}\
					<li><div class="{class}_ok znc-button_small" style="display:inline-block;">{ok_text}</div></li>\
					<li><div class="{class}_cancel znc-button_small"  style="display:inline-block;">{cancel_text}</div></li>\
				</ul>\
				<div class="clear zerofont"></div>\
			</div>\
		</div>'
	},
	private:{
		one:false,
		shortcurts:function(e){
			if(e.keyCode==13){
				if(ui.dialog_stop_close) return;
				if(typeof ui.dialog_stack_ok[ui.dialog_stack_close.length-1]=='function'){
					ui.dialog_stack_ok[ui.dialog_stack_close.length-1]();
				}
				else{
					this.ok();
				}
				return;
			}
			if(e.keyCode==27){
				if(ui.dialog_stop_close){
					setTimeout(function(){
						ui.dialog_stop_close=false;
					},100);
					return;
				}
				if(typeof ui.dialog_stack_close[ui.dialog_stack_close.length-1]=='function'){
					ui.dialog_stack_close[ui.dialog_stack_close.length-1]();
				}
				else{
					this.close();
				}
				ui.dialog_stop_close=!ui.dialog_stop_close;
				return;
			}
		}
	}
});