__FIREobj__.fireOther = function(setting){
	var t = {};
	{//public vars
		t.opera = /opera/i.test(navigator.userAgent);
		t.webkit = /webkit/i.test(navigator.userAgent);
		t.firefox = /firefox/i.test(navigator.userAgent);
		t.ie = false;
		t.O = [];
		t.DM = "on";
		t.begin = 0;
		t.end = 0;
	}
	{//protected methods
		t.createIframe = function(){
			var 	f,
				html =
				"<html>";
				+ 	"<head></head>"
				+ 	"<body>"
				+	""
				+ 	"</body>"
				+ "<html>";
			for(var i = 0;i<this.iframes.length;i++){
				f = this.iframes[i].get(0).contentDocument;
				this.O.push(f);
				f.designMode = this.DM;
				f.open();
				f.write(html);
				f.close();
			}
		};
		t.addCss = function(setting){
			var CSS;
			var __THIS__ = this;
			__THIS__._foreach(setting.css, function(arr, key, val, i){
				if( typeof val == "string" ){
					CSS = val;
					__THIS__._foreach(__THIS__.O, function(arr, key, val, i){
						$(val).ready(function(){
							$(val).find("head").append('<link rel="stylesheet" type="text/css" href="'+CSS+'" />');
						});
					});
				}
			});
		};
		t.action = function(){
			var $$ = this;
			with($$){
				var 	__ALL__ = _ALL(),
					body = __ALL__.find("body");
				__GLOBAL__ = $$;
				addCss(setting);
				body.append("<br/>");
				body.click(focus);
				body.dblclick(dblfocus);
				body.find("*").live("click", focus);
				body.find("*").live("dblclick", dblfocus);
			}
		};
	}
	{//editor events
		t.focus = function(e){
			var $$ = __GLOBAL__;
			var __ALL__ = $$._ALL();
			e.stopPropagation();
			with($$){
				switch(e.target.nodeName){
					case "BODY":{
						var 	body = e.target,
							win = body.ownerDocument.defaultView,
							range = win.getSelection().getRangeAt(0),
							inBegin = range.startOffset == 0 && range.collapsed;
						if(inBegin){
							var getFirst = $(body).find("span,pre").get(0);
							if(!getFirst){
								var span = $("<span></span>");
								span.addClass("cursor");
								$(body).append(span);
								$( $(body).find("br").get(0) ).remove();
							}
							else
								var span = $(getFirst);
							with($$.focused){
								window = win;
								Body.o = body;
								Body.begin = 0;
								Tag.o = span.get(0);
								Tag.begin = 0;
							}
							$$.setCursor();
						}
					}
					break;
					case "SPAN":{
						var	body = $(e.target).parents("body").get(0),
							win = body.ownerDocument.defaultView,
							range = win.getSelection().getRangeAt(0);
						with($$.focused){
							window = win;
							body.o = body;
							body.begin = range.startOffset;
							Tag.o = e.target;
							Tag.begin = range.startOffset;
						}
						$$.setCursor();
						$$.setCursorClass(e.target);
					}
					break;
					default:
				}
				//set enter event
				if(win){
					$(win).unbind("keyup");
					$(win).keyup(Enter);
				}
			}
		};
		t.dblfocus = function(e){
			var 	$$ = __GLOBAL__;
			e.stopPropagation();
			switch(e.target.nodeName){
				case "BODY":{
					var 	body = e.target,
						win = body.ownerDocument.defaultView,
						range = win.getSelection().getRangeAt(0),
						inBegin = range.startOffset == 1 && range.collapsed,
						getFirst = $(body).find("span,pre").get(0);
					if(inBegin){
						with($$.focused){
							window = win;
							body.o = body;
							body.begin = 0;
							Tag.o = e.target;
							Tag.begin = 0;
						}
						$$.setCursor();
					}
				}
				break;
				default:
			}
		}
		t.Enter = function(e){
			var 	$$ = __GLOBAL__
				body = $$.focused.Body.o,
				win = body.ownerDocument.defaultView,
				range = win.getSelection().getRangeAt(0)
				def = {
					o : range.endContainer,
					end : range.endOffset
				};
			with($$.focused){
				try{
					range.setStart(Body.o, Body.begin);
					range.setEnd(def.o, def.end);
				}
				catch(err){
					Body.begin--;
				}
				var	fragment = range.cloneContents(),
					text = range.toString();
				range.deleteContents();
// 				log(
// 					(text.length == 0 && fragment.childNodes.length == 0)+":"+
// 					(text.length == 1 && fragment.childNodes.length == 1)+":"+
// 					(text.length > 1 || fragment.childNodes.length > 1)
// 				)
				if(text.length == 0 && fragment.childNodes.length == 0)	$$.zeroEnter(fragment);
				if(text.length == 1 && fragment.childNodes.length == 1) 	$$.letterEnter(fragment);
				if(text.length > 1 || fragment.childNodes.length > 1) 		$$.pasteEnter(fragment);
				$$.rewrite();
			}
		}
	}
	{//add tools
		t.zeroEnter = function(fragment){
			
		}
		t.letterEnter = function(fragment){
			var	$$ = __GLOBAL__,
				text = $(fragment.firstChild).text();
			with($$.focused){
				var 	parts = [
					text.substr(0, Tag.begin),
					text.substr(Tag.begin, text.length)
				],
					__text__ = parts[0]+parts[1];
				$(Tag.o).html(__text__);
				Tag.begin++;
				Body.begin++;
			}
			$$.setCursor();
		}
		t.pasteEnter = function(fragment){
// 			log(fragment )
		}
		t.rewrite = function(){
			var	$$ = __GLOBAL__,
				TEXT = $($$.focused.Tag.o).text(),
				focused = $$.focused.Tag.o;
			with($$.textProcessor){
				for(var i=0;i<mode.length;i++){
					if(!mode[i].find) continue;
					if( mode[i].find.test(TEXT) ){
						var	find = TEXT.match(mode[i].find),
							rewrite = mode[i];
						if(find.length > 0) find.shift();
						switch(find.length){
							case 3:{
								var 	part1 = $("<"+focused.nodeName+">"+find[0]+"</"+focused.nodeName+">"),
								part2 = $("<"+rewrite.tag+">"+find[1]+"</"+rewrite.tag+">"),
								part3 = $("<"+focused.nodeName+">"+find[2]+"</"+focused.nodeName+">"),
								parts = [];
								{//parts1
									if(find[0].length>0){
										parts.push(part1);
									}
									else
									{
										delete part1;
									}
								}
								{//parts2
									part2.addClass(rewrite.class);
									parts.push(part2);
								}
								{//parts3
									part3.addClass("cursor");
									parts.push(part3);
								}
								$(focused).replace(parts);
								__GLOBAL__ = $$;
								$(part3).ready(function(){
									with($$.focused){
										Tag.o = part3.get(0);
										Tag.begin = 0;
										Body.begin += 2;
									}
									$$.setCursor();
								});
							}
							break;
							case 2:{
								
							}
							break;
							default:
						}
						break;
					}
				}
			}
		}
		t.command = function(com, el, section){
// 			var com = com.match(/[\S]+/ig);
// 			if(com[0])
// 				switch(com[0]){
// 					case "begin":{
// 						el.wrapAll("<span class='"+com[1]+"'/>");
// 						this.command("rememberContent", el.parent() );
// 						return el;
// 					}
// 					case "listen":{
// 						this.textProcessor.listen = el;
// 						this.textProcessor.regexp = section.regexp;
// 					}
// 					break;
// 					default:
// 				}
		};
		t.setCursor = function(){
			if(__GLOBAL__.focused.window){
				var 	$$ = __GLOBAL__.focused.window,
					range = $$.getSelection().getRangeAt(0);
				try{
					with(__GLOBAL__.focused){
						if(typeof Tag.begin == "number")
							range.setStart(
								Tag.o,
								Tag.begin
							);
						if(typeof Tag.end == "number")
							range.setEnd(
								Tag.o,
								Tag.end
							);
					}
				}
				catch(err){}
			}
		}
	}
	{//protected utils
		t.setCursorClass = function(cursor){
			var 	$$ = __GLOBAL__;
			with($$.focused){
				if(Body.o && cursor){
					$(Body.o).find("*.cursor").removeClass("cursor");
					$(cursor).addClass("cursor");
				}
			}
		}
		t._ALL = function(){
			if(!inline) var inline = $(this.O);
			return inline;
		}
		t._trim = (function(){
			var 	ws = {},
				chars = ' \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
			for(var i = 0; i < chars.length; i++)
				ws[chars.charAt(i)] = true;
			return function(str){
				var s = -1,
				e = str.length;
				while( ws[str.charAt(--e)] );
				while( s++ !== e && ws[str.charAt(s)] );
				return str.substring(s, e+1);
			};
		})();
	}
	return t;
}