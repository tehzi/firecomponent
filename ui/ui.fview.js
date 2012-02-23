if(!ui){
	var ui={};
}
Class({
	name:"fview",
	pack:ui,
	implements:[tools.browser],
	parent:tools.eventDispatcher,
	constructor:function(JqueryLink){
		this.JqueryLink=false;
		// SUPER
		this.Super();
		{this.html_gallery=
		"<div class='fview_plugin_gallery'>"+
			"<div class='load'>&nbsp;</div>"+
			"<div class='fview_plugin_default_number'>0 | 0</div>"+
			"<div class='fview_plugin_gallery'></div>"+
			"<div class='photo_box'></div>"+
			"<div class='fview_plugin_gallery_navigation'>"+
				"<div class='fview_plugin_gallery_prev'>&nbsp;</div>"+
				"<div class='fview_plugin_gallery_close'>&nbsp;</div>"+
				"<div class='fview_plugin_gallery_next'>&nbsp;</div>"+
				"<div class='fview_plugin_gallery_enlarge'>&nbsp;</div>"+
			"</div>"+
			"<div class='photo_tape'>"+
				"<div class='photo_tape_box'>"+
					"<div class='fview_plugin_small_prev'>&nbsp;</div>"+
					"<div class='photo_tape_box_m'>"+
						"<div style='position:relative;left:0px;'></div>"+
					"</div>"+
					"<div class='fview_plugin_small_next'>&nbsp;</div>"+
				"</div>"+
			"</div>"+
		"</div>";}
		{this.html_default=
		"<div class='fview_plugin_default'>"+
			"<div class='fview_plugin_default_box_opacity'></div>"+
			"<div class='fview_plugin_default_close'>&nbsp;</div>"+
			"<div class='fview_plugin_default_next'>&nbsp;</div>"+
			"<div class='fview_plugin_default_prev'>&nbsp;</div>"+
			"<div class='fview_plugin_default_load'>&nbsp;</div>"+
			"<div class='fview_plugin_default_reduce'>&nbsp;</div>"+
			"<div class='fview_plugin_default_number'>0 | 0</div>"+
			"<div class='fview_plugin_default_box'>"+
				"<div class='fview_plugin_default_text'>&nbsp;</div>"+
			"</div>"+
		"</div>";}
		this.flashId+=Math.random()*10000>>>1;
		this.flashTemplate=this.IE ? 
		'<object'+
			'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+
			'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0"'+
			'>'+
				'<param name="movie" value=""> '+
				'<param name="quality" value="high"/>'+
				'<param name="bgcolor" value="#FFFFFF">'+
				'<param name="allowscriptaccess" value="always"/>'+
				'<param name="play" value="true"/>'+
				'<param name="loop" value="false"/>'+
				'<param name="wmode" value="opaque">'+
				'<param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer">'+
		'</object>'
		:
		'<object '+
		'data="" '+
		'type="application/x-shockwave-flash"'+
		'>'+
			'<param name="quality" value="high"/>'+
			'<param name="bgcolor" value="#FFFFFF">'+
			'<param name="allowscriptaccess" value="always"/>'+
			'<param name="play" value="true"/>'+
			'<param name="loop" value="false"/>'+
			'<param name="pluginurl" value="http://www.macromedia.com/go/getflashplayer">'+
			'<param name="wmode" value="opaque">'+
		'</object>';
		if(!$("#fview_plugin_sleep_box")[0]){
			$("<div id='fview_plugin_sleep_box'></div>").appendTo("body");
		}
		if(JqueryLink){
			this.JqueryLink=JqueryLink;
			// HTML mode
			switch(this._mode){
				case "gallery":{
					this.html=this.html_gallery;
				}
				break;
				case "default":{
					this.html=this.html_default;
				}
				break;
				default:{}
			}
		}
	},
	set:{
		mode:function(key,val){
			if(val){
				if(val=="gallery" || val=="default"){
					switch(val){
						case "gallery":{}
						break;
						case "default":{}
						break;
						default:{}
					}
				}
			}
		},
		mode_switch:function(key,val){
			(val ? (this.objJquery.find("div.fview_plugin_default_reduce").show()) : (this.objJquery.find("div.fview_plugin_default_reduce").hide()));
		}
	},
	public:{
		// PUBLIC PARAMS
		shadow:true,
		map:[],
		currentSmall:0,
		smallMax:7,
		img:null,
		flashSelector:"",
		flashRect:[639,600],
		flashTemplate:"",
		flashObject:false,
		// Функции
		init:function(){
			if(this.flashSelector){
				this.img=$(this.flashSelector);
				if(!this.objJquery[0]){
					this.objJquery=$(this.html).css({
						height:(window.innerHeight ? window.innerHeight : document.documentElement.offsetHeight)-30
					});
					this.objJquery.appendTo("body");
				}
				this.JqueryLink=$(this.flashSelector).parent();
				this.closeEL=this.objJquery.find("div.fview_plugin_close");
				this.prev=this.objJquery.find("div.fview_plugin_default_prev");
				this.next=this.objJquery.find("div.fview_plugin_default_next");
				this.load=this.objJquery.find("div.fview_plugin_default_load");
				this.zero=$("#fview_plugin_sleep_box");
				this.map=[];
				this.jqueryArray=[];
				this.map=[];
				for(var i=0;i<this.img.length;i++){
					this.map.push($(this.img[i])[0].href);
				}
				$(this.img).unbind("click");
				$(this.img).click(this.openFlash);
				return;
			}
			if(!this.JqueryLink[0]){
				this.JqueryLink=$(this.JqueryLink.selector);
			}
			if(!$("#fview_plugin_sleep_box")[0]){
				$("<div id='fview_plugin_sleep_box'></div>").appendTo("body");
			}
			//GET ALL IMG IN JqueryLink
			this.img=this.JqueryLink
				.find("a[href$=png], a[href$=jpg], a[href$=jpeg], a[href$=gif],a[href$=PNG], a[href$=JPG], a[href$=JPEG], a[href$=GIF]")
				.find("img");
			if(this.JqueryLink && this.img){
				// objJquery
				if(!this.objJquery){
					this.objJquery=$(this.html).css({
						height:(window.innerHeight ? window.innerHeight : document.documentElement.clientHeight)-30
					});
					this.objJquery.appendTo("body");
				}
				// NAVIGATION
				if(this._mode=="default"){
					this.closeEL=this.objJquery.find("div.fview_plugin_close");
					this.prev=this.objJquery.find("div.fview_plugin_default_prev");
					this.next=this.objJquery.find("div.fview_plugin_default_next");
					this.load=this.objJquery.find("div.fview_plugin_default_load");
				}
				if(this._mode=="gallery"){
					this.closeEL=this.objJquery.find("div.fview_plugin_default_close");
					this.prev=this.objJquery.find("div.fview_plugin_prev");
					this.next=this.objJquery.find("div.fview_plugin_next");
					this.prevSmall=this.objJquery.find("div.fview_plugin_small_prev");
					this.nextSmall=this.objJquery.find("div.fview_plugin_small_next");
				}
				// OTHER ELLEMENTS
				this.zero=$("#fview_plugin_sleep_box");
				// CLEAR ARRAY
				this.map=[];
				this.jqueryArray=[];
				// PUSH ARRAIES
				for(var i=0;i<this.img.length;i++){
					this.map.push([
						this.img[i].src,
						$(this.img[i]).parent()[0].href
					]);
					if(this._mode=="gallery"){
						this.jqueryArray.push([
							$("<div class='fview_image_box'><img src='"+this.map[0][0]+"' alt=''/></div>")
						]);
						this.jqueryArray[i][0].load(this.smallLoad);
					}
				}
				// OPEN VIEWER
				$(this.img).parent().unbind("click");
				$(this.img).parent().click(this.open);
			}
			$(window).resize(this.resize);
		}
	},
	protected:{
		eventList:["open","close","next","prev"],
		JqueryLink:false,
		objJquery:false,
		jqueryArray:[],
		html:"",
		width:100,
		height:100,
		current:-1,
		//Буллеаны
		run:false,
		flashId:"flashId",
		//Функции
		shadowCreate:function(){
			if(this.shadow){
				$("#alert_shadow").remove();
				$("<div id='alert_shadow'>&nbsp;</div>").css({
					position : "absolute",
					top : "0px",
					left : "0px",
					width : $(document).width(),
					height : $(document).height(),
					zIndex : "999",
					background : "#000",
					opacity : .9
				}).appendTo("body");
				$("#alert_shadow").click(this.close);
			}
		},
		resize:function(){
			$("#alert_shadow").css({
				width : $(document).width(),
				height : $(document).height()
			});
		},
		range:function(begin,length){
		},
		open:function(e){
			if(e){
				e.preventDefault();
				((this._mode=="default") ? this.openDefault(e) : null);
				((this._mode=="gallery") ? this.openGallery(e) : null);
				if(this.shadow){
					this.shadowCreate();
				}
			}
		},
		close:function(e){
			switch(this._mode){
				case "default":{
					this.run=false;
					if(this.imgDefault){
						this.imgDefault.remove();
						this.imgDefault.unbind("click");
					}
					this.objJquery.hide();
					$("#alert_shadow").remove();
					this.imgDefault=null;
					this.closeEL.unbind("mouseenter mouseleave click");
					this.next.unbind("mouseenter mouseleave click");
					this.prev.unbind("mouseenter mouseleave click");
					$("div.fview_plugin_default_reduce").unbind("mouseenter mouseleave click");
					$("body").unbind("keyup",this.keysDefault);
					$(window).unbind("resize");
				}
				break;
				case "gallery":{}
				break;
				default:{}
			}
		}
	},
	private:{
		//Элементы
		closeEL:null,
		removeEl:null,
		prev:null,
		next:null,
		prevSmall:null,
		nextSmall:null,
		imgDefault:null,
		zero:null,
		load:null,
		//Строки
		href:"",
		alt:"",
		_mode:"default",
		//Числа
		bordRadiosConst:10,
		minWidth:300,
		minHeight:300,
		loadMode:0,
		//Загрузка маленьких изображений
		smallLoad:function(e){
			var $$=$(e.currentTarget);
		},
		//Открытие
		openDefault:function(e){
			if(e){
				var $$=$(e.currentTarget);
				if(e.type=="click" && !this.run){
					this.run=true;
					this.href=$$[0].href;
					this.alt=$$.find("img")[0].alt;
					this.imgDefault=$("<img src='"+this.href+"' alt=''/>");
					this.load.show();
					for(var i=0,lenght=this.map.length;i<lenght;i++){
						if(this.map[i][1]==this.href){
							this.current=i;
							break;
						}
					}
					this.imgDefault.appendTo(this.zero);
					this.reloadDefault();
					$("body").keyup(this.keysDefault);
					$(this.imgDefault).load(this.openDefault);
				}
				if(e.type=="load" && this.run){
					var width=$$.width()+(this.bordRadiosConst*2);
					var height=$$.height();
					width=(width>=this.minWidth) ? width : this.minWidth;
					height=(height>=this.minHeight) ? height : this.minHeight;
					this.objJquery.show();
					//STD animate
					this.objJquery.animate({
						top:$(window).scrollTop()+(this.bordRadiosConst*4),
						width:width,
						height:height,
						"margin-left":-Math.round(width/2)
					},500);
					{//opacity border animate
						this.objJquery.find("div.fview_plugin_default_box_opacity").animate({
							width:width+(this.bordRadiosConst),
							height:height+(this.alt ? (this.bordRadiosConst*10) : (this.bordRadiosConst*4))
						},500);
						this.objJquery.find("div.fview_plugin_default_box").animate({
							width:width-(this.bordRadiosConst),
							height:height+(this.alt ? (this.bordRadiosConst*8) : (this.bordRadiosConst*2))
						},500,this.openDefault);
					}
					this.eventDefault();
				}
				if(e.type=="timer" && this.run){
					this.objJquery.find("div.fview_plugin_default_text").html(this.alt);
					this.alt="";
					this.run=false;
				}
			}
			if(!e && this.run){
				var timer=new tools.Timer(1000,1);
				timer.bind("timer",this.openDefault);
				this.imgDefault.css({
					"opacity":0,
					position:"relative",
					top:5
				});
				this.load.hide();
				this.imgDefault.appendTo(this.objJquery.find("div.fview_plugin_default_box"));
				this.imgDefault.animate({
					opacity:1
				},1000);
				timer.start();
				this.resizeDefault();
			}
		},
		openGallery:function(e){},
		openFlash:function(e){
			if(e.type=="click" && !this.run){
				e.preventDefault();
				var $$=$(e.currentTarget);
				var width=this.flashRect[0]+10;
				var height=this.flashRect[1];
				width=(width>=this.minWidth) ? width : this.minWidth;
				height=(height>=this.minHeight) ? height : this.minHeight;
				for(var i=0,lenght=this.map.length;i<lenght;i++){
					if(this.map[i]==$$[0].href){
						this.current=i;
						break;
					}
				}
				this.objJquery.show();
				this.load.hide();
				$("div.fview_plugin_default_reduce").hide();
				this.shadowCreate();
				// Флэш анимация
				this.objJquery.animate({
					top:$(window).scrollTop()+(this.bordRadiosConst*4),
					width:width,
					height:height,
					"margin-left":-Math.round(width/2)
				},
				500,
				function(e){
					$(this).css({
						overflow:"visible"
					});
				});
				this.href=$$[0].href;
				for(var i=0,lenght=this.map.length;i<lenght;i++){
					if(this.map[i]==this.href){
						this.current=i;
						break;
					}
				}
				$("body").keyup(this.keysDefault);
				this.reloadDefault();
				$("body").keyup(this.keysDefault);
				// Анимация бордюра
				this.objJquery.find("div.fview_plugin_default_box_opacity").animate({
					width:width+(this.bordRadiosConst),
					height:height+(this.alt ? (this.bordRadiosConst*10) : (this.bordRadiosConst*4))
				},500);
				this.objJquery.find("div.fview_plugin_default_box").animate({
					width:width-(this.bordRadiosConst),
					height:height+(this.alt ? (this.bordRadiosConst*8) : (this.bordRadiosConst*2))
				},500,this.openDefault);
				// События
				this.eventFlash();
				if(!this.IE){
					this.flashObject=$(this.flashTemplate)
						.css({
							width:this.flashRect[0],
							height:this.flashRect[1]
						})
						.attr("data",this.map[this.current]);
				}
				else{
					this.flashObject=$(this.flashTemplate)
						.css({
							width:this.flashRect[0],
							height:this.flashRect[1]
						});
					this.flashObject
						.find("param[name='movie']")
						.attr("value",this.map[this.current]);
				}
				if(!this.flashObject.parent()[0]){
					this.flashObject
					.appendTo(
						this.objJquery.find("div.fview_plugin_default_box")
					);
				}
				return;
			}
		},
		//Следущее
		nextDefault:function(e){
			if(e){
				if(e.type=="click" && !this.run && this.map[this.current+1]){
					this.current++;
					var $$=this.map[this.current];
					this.run=true;
					this.href=$$[1];
					this.alt=this.img[this.current].alt;
					this.removeEl=this.imgDefault;
					this.load.show();
					this.reloadDefault();
					this.imgDefault.animate({
						opacity:0
					},1000,this.nextDefault);
					this.imgDefault=$("<img src='"+this.href+"' alt=''/>");
					this.imgDefault.appendTo(this.zero);
					$(this.imgDefault).load(this.openDefault);
				}
			}
			if(!e && this.run){
				this.removeEl.remove();
			}
		},
		//Преведущее
		prevDefault:function(e){
			if(e){
				if(e.type=="click" && !this.run && this.map[this.current-1]){
					this.current--;
					var $$=this.map[this.current];
					this.run=true;
					this.href=$$[1];
					this.alt=this.img[this.current].alt;
					this.removeEl=this.imgDefault;
					this.load.show();
					this.reloadDefault();
					this.imgDefault.animate({
						opacity:0
					},1000,this.prevDefault);
					this.imgDefault=$("<img src='"+this.href+"' alt=''/>");
					this.imgDefault.appendTo(this.zero);
					$(this.imgDefault).load(this.openDefault);
				}
			}
			if(!e && this.run){
				this.removeEl.remove();
			}
		},
		nextFlash:function(e){
			if(e){
				if(e.type=="click" && !this.run && this.map[this.current+1]){
					this.current++;
					var $$=this.map[this.current];
					this.href=$$;
					this.reloadDefault();
					if(!this.IE){
						this.flashObject.attr("data",$$);
					}
					else{
						this.flashObject
							.find("param[name='movie']")
							.attr("value",$$);
					}
				}
			}
		},
		prevFlash:function(e){
			if(e){
				if(e.type=="click" && !this.run && this.map[this.current-1]){
					this.current--;
					var $$=this.map[this.current];
					this.href=$$;
					this.reloadDefault();
					if(!this.IE){
						this.flashObject.attr("data",$$);
					}
					else{
						this.flashObject
							.find("param[name='movie']")
							.attr("value",$$);
					}
				}
			}
			if(!e && this.run){
				this.removeEl.remove();
			}
		},
		//EVENTS, RELOAD
		eventDefault:function(){
			with(this.objJquery){
				find("div.fview_plugin_default_close").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_close_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_close_hover");
					},
					click:this.close
				});
				find("div.fview_plugin_default_next").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_next_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_next_hover");
					},
					click:this.nextDefault
				});
				find("div.fview_plugin_default_prev").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_prev_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_prev_hover");
					},
					click:this.prevDefault
				});
				find("div.fview_plugin_default_reduce").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_reduce_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_reduce_hover");
					},
					click:this.toGallery
				});
				this.imgDefault.click(this.nextDefault);
			}
		},
		eventFlash:function(){
			with(this.objJquery){
				find("div.fview_plugin_default_close").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_close_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_close_hover");
					},
					click:this.close
				});
				// Обьекты
				find("div.fview_plugin_default_next").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_next_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_next_hover");
					},
					click:this.nextFlash
				});
				find("div.fview_plugin_default_prev").bind({
					mouseenter:function(){
						$(this).addClass("fview_plugin_default_prev_hover");
					},
					mouseleave:function(){
						$(this).removeClass("fview_plugin_default_prev_hover");
					},
					click:this.prevFlash
				});
			}
		},
		reloadDefault:function(){
			(!this.map[this.current-1]) ? this.prev.hide() : this.prev.show();
			(!this.map[this.current+1]) ? this.next.hide() : this.next.show();
			this.objJquery.find("div.fview_plugin_default_number").html((this.current+1)+" | "+this.map.length);
		},
		keysDefault:function(e){
			if(e.which==27){
				this.close();
			}
			if(e.which==39){
				this.next.click();
			}
			if(e.which==37){
				this.prev.click();
			}
		},
		//RESIZE
		resizeDefault:function(){
			if(this.shadow){
				$("#alert_shadow").css({
					width:$(document).width(),
					height:$(document).height()
				});
			}
		},
		//Переключение
		toGallery:function(e){
			if(e){
				if(e.type=="click"){
					this.run=true;
					this.objJquery.animate({
						opacity:0
					},1000,this.toGallery);
				}
			}
			if(!e && this.run && this.loadMode==0){
				this.imgDefault.appendTo(this.zero);
				this.objJquery
					.removeClass("fview_plugin_default")
					.addClass("fview_plugin_gallery")
					.removeAttr("style")
					.html($(this.html_gallery).html())
					.css({ opacity:0 });
				this.objJquery.animate({
					opacity:1
				},1000,this.toGallery);
				this.loadMode++;
			}
			if(!e && this.run && this.loadMode==1){
// 				fview_plugin_gallery
			}
		},
		toDefault:function(e){}
	}
});