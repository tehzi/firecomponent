var editor={};
Class({
	parent:tools.eventDispatcher,
	name:"EditorIframeAbstract",
	pack:editor,
	constructor:function(){
		this.Super();
	},
	public:{
		cssList:[],
		init:function(){
			this.setupFrame();
			if(this.eventList[0]=="ready"){
				this.bind("ready",this.ready);
			}
		}/*,
		IframeId:*/
	},
	protected:{
		addCss:function(){},
		removeCss:function(){},
		setupFrame:function(){}
	},
	private:{
		
	}
});
Class({
	name:"SingleIframe",
	pack:editor,
	parent:editor.EditorIframeAbstract,
	implements:[tools.browser],
	constructor:function(iframe){
		this.Super();
		if(iframe.nodeName=="TEXTAREA"){
			this.object=iframe;
		}
	},
	public:{
		height:0,
		width:0,
		object:null,
		objectIframe:null,
		contentDocument:null
	},
	protected:{
		setupFrame:function(){
			if(this.object){
				var $$=$(this.object);
				this.objectIframe=$("<iframe scrolling='no' frameborder='no' src='#' class='fireEdit'></iframe>");
				this.height=$$.height();
				this.width=$$.width();
				this.objectIframe.css({
					width:this.width,
					height:this.height
				});
				$$.before(this.objectIframe);
				$$.hide();
				if(this.IE){
					console.log(this.objectIframe[0].document)
					this.contentDocument=this.objectIframe[0].document;
// 					this.contentDocument.designMode="On";
// 					this.contentDocument.open();
// 					this.contentDocument.write(this.iframeHtml);
// 					this.contentDocument.close();
				}
				else{
					this.contentDocument=this.objectIframe[0].contentDocument;
					this.contentDocument.designMode="on";
					this.contentDocument.open();
					this.contentDocument.write(this.iframeHtml);
					this.contentDocument.close();
				}
			}
		},
		eventList:["ready","addCss","removeCss"]
	},
	private:{
		iframeHtml:
			"<html>"+
				"<head>"+
					"<title>{title}</title>"+
				"<head>"+
				"<body></body>"+
			"</html>",
		ready:function(){}
	}
});
Class({
	name:"ControlerIframe",
	pack:editor,
	parent:editor.EditorIframeAbstract,
	implements:[tools.browser],
	constructor:function(IframeArray){
		this.Super();
		if(typeof IframeArray=="object"){
			this.IframeArray=IframeArray;
		}
	},
	public:{
		init:function(){
			for(var i=0;i<this.IframeArray.length;i++){
				this.SingleIframeArray.push(new editor.SingleIframe(this.IframeArray[i]));
				this.SingleIframeArray[i].cssList=this.cssList;
				this.SingleIframeArray[i].init();
// 				console.log(this.SingleIframeArray[i].height)
			}
			this.parent.init();
		}
	},
	protected:{
	
	},
	private:{
		IframeArray:[],
		SingleIframeArray:[]
	}
});