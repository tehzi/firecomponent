(function($, __FIREobj__){
	{//global vars
		var __GLOBAL__;
		var highlight = __FIREobj__.highlight;
		var fireIe = __FIREobj__.fireIe;
		var fireOther = __FIREobj__.fireOther;
	}
	var fireMain = function(setting){
		{//extends:
			if(document.createRange)	var p = fireOther(setting);
			else						var p = fireIe(setting);
		}
		{//public vars:
			p.version = "0.01";
			p.constructor = fireMain;
			p.textarea = setting.textarea;
			p.width = (function(p){
				var arr = [];
				for(var i = 0;i < p.textarea.get().length;i++)
					arr.push( $( p.textarea.get(i) ).width() );
				return arr;
			})(p);
			p.height = (function(p){
				var arr = [];
				for(var i = 0;i < p.textarea.get().length;i++)
					arr.push( $( p.textarea.get(i) ).height() );
				return arr;
			})(p);
			p.panel = {
				height : (function(){
					return 20;
				})()
			},
			p.mode = {
				height : (function(){
					return 20;
				})()
			},
			p.html = p.textarea.val();
			p.browser = (function(p){
				switch(true){
					case p.ie6:{
						return "ie6";
					}
					break;
					case p.ie7:{
						return "ie7";
					}
					break;
					case p.ie8:{
						return "ie8";
					}
					break;
					case p.opera:{
						return "opera";
					}
					break;
					case p.firefox:{
						return "firefox";
					}
					break;
					case p.webkit:{
						return "webkit";
					}
					break;
					default:
						return "unknown";
				}
			})(p);
			p.iframes = [];
			p.focused = {
				window : false,
				Body : {
					o : false,
					begin : 0,
					end : false
				},
				Tag : {
					o : false,
					begin : 0,
					end : false
				}
			};
			p.textProcessor = {
				mode : highlight,
				text : function(){
					if(p.focused)
						return $(p.focused.Tag.o).text();
					else
						return "";
				}
			};
		}
		{//public methods install:
			p.createWorkSpace = function(){
				var t = p.textarea;
				var iframes = [];
				var IframeBox, fireWS, iframe;
				var html = 
					   "<div class='fireWS'>"
					+ 	"<div class='firePanel'>&nbsp;</div>"
					+ 	"<div class='fireIframe_box'>&nbsp;</div>"
					+ 	"<div class='fireMode'>&nbsp;</div>"
					+ "</div>";
				t.hide();
				t.after(html);
				p.iframeDom();
				for(var i = 0;i < p.iframes.length;i++){
					fireWS = $("div.fireWS").get(i);
					IframeBox = $("div.fireIframe_box").get(i);
					$(fireWS).css({
						width : p.width[i],
						height : p.height[i] + p.panel.height + p.mode.height
					});
					$(IframeBox)
						.css({
							width : p.width[i],
							height : p.height[i]
						})
						.html(p.iframes[i]);
					iframe = $(IframeBox).find("iframe");
					iframe.css({
						width : p.width[i],
						height : p.height[i]
					});
					iframes.push(iframe);
				}
				p.iframes = iframes;
			}
			p.iframeDom = function(){
				var t = p.textarea;
				var iframes = [];
				var rand = 0;
				for(var i = 0; i < t.get().length; i++){
					rand = Math.round(Math.random() *10000)
					p.iframes.push(
						"<iframe scrolling='no' frameborder='no' src='#' name='fireIframe_"+rand+"' id='fireIframe_"+rand+"' class='fireEdit'>"+
						"</iframe>"
					);
				}
			}
			p.panelWP = function(){
			}
			p.modeWP = function(){
			}
			p.install = function(){
				p.createWorkSpace();
				p.createIframe();
// 				p.panelWP();
// 				p.modeWP();
				p.action();
			}
		}
		{//protected utils
			p._foreach = function(array, after){
				var i = 0;
				for(key in array)
					if(typeof after == "function")
						after(array, key, array[key], i++);
			}
		}
		return p;
	}
	$.fn.fireEdit = function(setting){
		setting.textarea = $(this);
		var fire = new fireMain(setting);
		fire.install();
	}
})($, __FIREobj__);