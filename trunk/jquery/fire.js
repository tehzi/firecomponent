(function(){
	$.fn.fire=function(params){
		var path="/";
		if(typeof params=="object"){
			if(typeof params.path=="string"){
				path=params.path;
			}
		}
		if(editor.ControlerIframe){
			var setup_controler=new editor.ControlerIframe(this);
			var cssPath=new tools.Url();
			var stylesWithoutPath=["editor.css","html.css"];
			var styles=[];
			cssPath.directory=path+"/css/";
			for(var i=0;i<stylesWithoutPath.length;i++){
				cssPath.file=stylesWithoutPath[i];
				styles.push(cssPath.url);
			}
			setup_controler.cssList=styles;
			setup_controler.init();
		}
	}
})();