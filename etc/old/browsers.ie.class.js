__FIREobj__.fireIe = function(setting){
	return {
		//public vars
			ie6 : /MSIE 6/.test(navigator.userAgent),
			ie7 : /MSIE 7/.test(navigator.userAgent),
			ie8 : /MSIE 8/.test(navigator.userAgent),
			ie : true,
			O : [],
			DM : "On",
			begin : 0,
			end : 0,
		//protected methods
			createIframe : function(){
				var f;
				var html =
					"<html>";
					+ 	"<head>"
					+		"<title>_</title>"
					+	"</head>"
					+ 	"<body>"
					+	this.html
					+ 	"</body>"
					+ "<html>";
				for(var i=0;i<this.iframes.length;i++){
					f = frames[this.iframes[i].attr("id")].document;
					this.O.push(f);
					f.designMode = this.DM;
					f.open();
					f.write(html);
					f.close();
				}
				return;
			},
			addCss : function(setting){
				var frame;
				var __THIS__ = this;
				setTimeout(function(){
					__THIS__._foreach(__THIS__.O, function(arr, key, val, i){
						frame = val;
						__THIS__._foreach(setting.css, function(arr, key, val, i){
							$(frame).find("head").append('<link rel="stylesheet" type="text/css" href="'+val+'" />');
						});
					});
				}, 0);
			},
			action : function(){
				var $$ = this;
				$$.addCss(setting);
				$$._foreach($$.O, function(arr, key, val, i){
					$(val).find("body").append("123")
				});
			}
		//protected utils
			// method _ALL is fall
	};
}