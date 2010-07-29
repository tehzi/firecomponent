var tools={};
Class({
	name:"browser",
	type:"interface",
	pack:tools,
	constructor:function(){},
	public:{
		browser:(function(){
			var name="Another";
			var agent=navigator.userAgent.toLowerCase();
			if(agent.search("firefox")>-1){
				name="Firefox";
			}
			if(agent.search("opera")>-1){
				name="Opera";
			}
			if(agent.search("safari")>-1){
				name="Safari";
			}
			if(agent.search("chrome")>-1){
				name="Chrome";
			}
			if(agent.search("msie")>-1){
				name="Internet Explorer";
			}
			return name;
		})(),
		IE:"~this.browser=='Internet Explorer'~",
		IE6:"~this.IE && this.intertrigoBrowserVersion()=='6.0'~",
		IE7:"~this.IE && this.intertrigoBrowserVersion()=='7.0'~",
		IE8:"~this.IE && this.intertrigoBrowserVersion()=='8.0'~",
		Opera:"~this.browser=='Opera'~",
		Firefox:"~this.browser=='Firefox'~",
		Chrome:"~this.browser=='Chrome'~",
		Safari:"~this.browser=='Safari'~",
		browserVersion:"~this.intertrigoBrowserVersion()~"
	},
	protected:{
		intertrigoBrowserVersion:function(){
			var version="None";
			var agent=navigator.userAgent.toLowerCase();
			version=agent
			if(this.IE){
				var version_detect=agent.match(/msie ([0-9]+\.[0-9]+)/i);
			}
			if(this.Opera){
				var version_detect=agent.match(/opera\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Firefox){
				var version_detect=agent.match(/firefox\/([0-9]+\.[0-9]+\.[0-9]+)/i);
			}
			if(this.Chrome){
				var version_detect=agent.match(/chrome\/([0-9]+\.[0-9]+)/i);
			}
			if(this.Safari){
				var version_detect=agent.match(/version\/([0-9]+\.[0-9]+)/i);
			}
			if(version_detect){
				if(version_detect[1]){
					version=version_detect[1];
				}
			}
			return version;
		}
	}
});