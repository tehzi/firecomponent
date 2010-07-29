/**
* @fileoverview
* Пакет содержит набор утилит разработаных для проекта firecomponent
*/
/**
* @namespace
* @description
* <b>Тип данных:</b> <i>Object</i>
* <br/>Пакет предоставляет набор утилит для проекта firecomponent 
*/
var tools={};
/**
* @name browser
* @class
* @memberOf tools
* @example
* 	Class({
*		name:"some",
*		implements:[tools.browser],
*		constructor:function(){}
*	});
*	alert(new some().IE)
* @description
* Интерфейс, предоставляющий информацию для работы с текущей версией браузера
*/
Class({
	name:"browser",
	type:"interface",
	pack:tools,
	/**
	* @name constructor
	* @memberOf tools.browser
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor:function(){},
	public:{
		/**
		* @name browser
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/><b>Значение:</b> <i>Another/Firefox/Opera/Safari/Chrome/Internet Explorer</i>
		* <br/>Возвращает строку с названием браузера
		*/
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
		/**
		* @name IE
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер членом семейства Internet Explorer
		*/
		IE:"~this.browser=='Internet Explorer'~",
		/**
		* @name IE6
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 6 версии
		*/
		IE6:"~this.IE && this.intertrigoBrowserVersion()=='6.0'~",
		/**
		* @name IE7
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 7 версии
		*/
		IE7:"~this.IE && this.intertrigoBrowserVersion()=='7.0'~",
		/**
		* @name IE8
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Internet Explorer'ом 8 версии
		*/
		IE8:"~this.IE && this.intertrigoBrowserVersion()=='8.0'~",
		/**
		* @name Opera
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Oper'ой
		*/
		Opera:"~this.browser=='Opera'~",
		/**
		* @name Firefox
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Firefox'ом
		*/
		Firefox:"~this.browser=='Firefox'~",
		/**
		* @name Chrome
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Chrome'ом
		*/
		Chrome:"~this.browser=='Chrome'~",
		/**
		* @name Safari
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Boolean</i>
		* <br/>Проверяет является ли браузер Safari
		*/
		Safari:"~this.browser=='Safari'~",
		/**
		* @name browserVersion
		* @memberOf tools.browser
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>String</i>
		* <br/>Возвращает строку c версией браузера
		*/
		browserVersion:"~this.intertrigoBrowserVersion()~"
	},
	protected:{
		/**
		* @name intertrigoBrowserVersion
		* @memberOf tools.browser
		* @type String
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Определяет версию браузера
		*/
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