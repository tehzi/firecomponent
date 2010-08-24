/**
* @fileoverview
* Пакет содержит набор утилит разработаных для проекта firecomponent
* @author <a href="mailto:zi.white.drago@gmail.com">Zi White</a>
* @version 0.1.0
*/
if(!Date.prototype.lastMonthDay){
	Date.prototype.lastMonthDay=function(month, year){
		var d=new Date(year ? year : this.getFullYear(), month ? month  : this.getMonth() + 1, 0);
		return d.getDate();
	};
}
if(!Date.prototype.lastYearDay){
	Date.prototype.lastYearDay=function(year){
		return new Date().lastMonthDay(2,year)==28 ? 365 : 366;
	};
}
/**
* @namespace
* Пакет предоставляет набор утилит для проекта firecomponent 
* @description
* <b>Тип данных:</b> <i>Object</i>
*/
var tools={};
/**
* @name browser
* @class
* Интерфейс, предоставляющий информацию для работы с текущей версией браузера
* @memberOf tools
* @example
* 	Class({
*		name:"some",
*		implements:[tools.browser],
*		constructor:function(){}
*	});
*	alert(new some().IE)
* @description
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
		* @function
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
/**
* @name eventDispatcher
* @class
* Абстрактный класс для добавление в другие классы функций предоставляющих создание и обработку пользовательских событий 
* @memberOf tools
* @description
*/
Class({
	pack:tools,
	name:"eventDispatcher",
	/**
	* @name constructor
	* @memberOf tools.eventDispatcher
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	* <br/>Заполняет внутренний объект содержащий информацию о событиях в классе
	*/
	constructor:function(){
		this.eventAll={};
		for(var i=0;i<this.eventList.length;i++){
			this.eventAll[this.eventList[i]]=[];
		}
	},
	public:{
		/**
		* @name bind
		* @function
		* @memberOf tools.eventDispatcher
		* @param _event {String} Имя события
		* @param _function {Mixed} Ссылка на фунцию
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/>Добавляет обработчик события
		*/
		bind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event].push(_function);
					$(this).bind(_event,_function);
				}
			}
		},
		/**
		* @name unbind
		* @function
		* @memberOf tools.eventDispatcher
		* @param _event {String} Имя события
		* @param _function {Mixed} Ссылка на фунцию
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип данных:</b> <i>Void</i>
		* <br/> Удаляет обработчик события
		*/
		unbind:function(_event,_function){
			if(typeof _event=="string" && typeof _function=="function"){
				if(this.eventAll[_event]){
					this.eventAll[_event]=$.grep(this.eventAll[_event],function(key,i){
 						return key!==_function;
					});
					$(this).unbind(_event,_function);
				}
			}
		}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Список событий объекта
		*/
		eventList:[],
		/**
		* @name eventAll
		* @memberOf tools.eventDispatcher
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Хранилище для событий
		*/
		eventAll:{},
		/**
		* @name dispatch
		* @function
		* @memberOf tools.eventDispatcher
		* @param {String} _event Название события
		* @param {Array} _arr Список аргументов функции
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Выбрасывает новое событие в поток событий
		*/
		dispatch:function(_event,_arr){
			var __arr=[];
			if(typeof _arr=="object"){
				__arr=_arr;
			}
			if(typeof _event=="string"){
				if(this.eventAll[_event]){
					$(this).trigger(_event,__arr);
				}
			}
		}
	}
});
/**
* @name Timer
* @class
* Простой таймер облегчающий работу с периодичными функциями
* @memberOf tools
* @description
* <br/><b>Наследует</b> : <i>tools.eventDispatcher</i>
* <br/><b>Событие</b> : <i>timer</i>
* <br/>Срабатывает каждые this.delay миллисекунд
* <br/><b>Событие</b> : <i>timerComplete</i>
* <br/>Срабатывает когда таймер пройдет количество циклов указанной в переменной repeatCount
* @example
* // Таймер повторится 5 раз с интервало в 2 секунды
* var timer=new tools.Timer(2000,5);
* // Каждые 2 секунды
* timer.bind("timer",function(){
* 	//do somethink
* });
* // В конце 5-го цикла
* timer.bind("timerComplete",function(){
* 	//do somethink
* });
* timer.start();
*/
Class({
	pack:tools,
	parent:tools.eventDispatcher,
	name:"Timer",
	/**
	* @name constructor
	* @memberOf tools.Timer
	* @function
	* @param delay Задержка в миллисекундах между событиями таймера.
	* @param repeatCount Общее число запусков, на которое настроен таймер.
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor:function(delay,repeatCount){
		this.Super();
		if(typeof delay=="number"){
			this.delay=delay;
		}
		if(typeof repeatCount=="number"){
			this.repeatCount=repeatCount;
		}
	},
	public:{
		/**
		* @name currentCount
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Общее число срабатываний таймера с момента его запуска с нуля.
		*/
		currentCount:0,
		/**
		* @name delay
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Задержка в миллисекундах между событиями таймера.
		*/
		delay:0,
		/**
		* @name repeatCount
		* @memberOf tools.Timer
		* @default 0
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Общее число запусков, на которое настроен таймер.
		*/
		repeatCount:0,
		/**
		* @name running
		* @memberOf tools.Timer
		* @default false
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Текущее состояние таймера: если таймер выполняется, то true, в противном случае false.
		*/
		running:false,
		/**
		* @name start
		* @memberOf tools.Timer
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Запускает таймер
		*/
		start:function(){
			if(this.delay>0){
				this.currentCount=0;
				this.running=true;
				this.timeLink=setInterval(this.timeExec,this.delay);
			}
		},
		/**
		* @name halt
		* @memberOf tools.Timer
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Останавливает таймер
		* <br/><i>Примечание: свойтсво stop недоступно в ie</i>
		*/
		halt:function(){
			this.running=false;
			clearInterval(this.timeLink);
		}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.Timer
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Список событий таймера
		*/
		eventList:["timer","timerComplete"]
	},
	private:{
		/**
		* @name timeLink
		* @memberOf tools.Timer
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Номер Интервала
		*/
		timeLink:null,
		/**
		* @name timeExec
		* @function
		* @memberOf tools.eventDispatcher
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Вызывается каждые delay милисекунд
		*/
		timeExec:function(){
			this.dispatch("timer",[++this.currentCount]);
			if(this.repeatCount>0 && this.currentCount==this.repeatCount){
				this.dispatch("timerComplete",[this.currentCount]);
				this.halt();
			}
		}
	}
});
/**
* @name CookieManager
* @class
* Управление cookie для проекта firecomponent
* @memberOf tools
* @description
* <br/><b>Наследует</b> : <i>tools.eventDispatcher</i>
* <br/><b>Событие</b> : <i>change</i>
* Срабатывает при внешнем изменение cookie
* <br/><b>Событие</b> : <i>add</i>
* Срабатывает при внутреннем добавлении cookie
* <br/><b>Событие</b> : <i>remove</i>
* Срабатывает при внутреннем удалении cookie
* @example
* // Создаем новую копию класса для управления cookie
* var cookie=new tools.CookieManager();
* // Добавляем событие прослушивающая внешние изменения cookie
* cookie.bind("change",function(e,newC,old){
*	//do somethink
* });
* // Внутренние добавление куки
* cookie.bind("add",function(e,key,val){
*	//do somethink
* });
* // Добавляем новую куки
* cookie.add("sample",123);
* cookie.val("sample1",123);
* // Управление датой m - минуты, h - часы, d - дни, w - недели, M - месяцы, Y - годы.
* cookie.add={name:"sample2",val:123,date:"+10h +5w",path:"/"};
* // Получаем значение
* cookie.val("sample1");
* cookie.ls["sample1"];
* // Удаляем куки
* cookie.remove("sample1");
* cookie.rm("sample");
*/
Class({
	name:"CookieManager",
	pack:tools,
	parent:tools.eventDispatcher,
	final:true,
	/**
	* @name constructor
	* @memberOf tools.CookieManager
	* @function
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	* Создает список куки, события и вызывает проверку на изменения куки каждую секунду.
	*/
	constructor:function(){
		if(this.cookieEnabled){
			this.Super();
			this.oldCookieString=document.cookie;
			this.timer.bind("timer",this.cookieEvent);
			this.timer.start();
			this.lsCreate();
		}
	},
	public:{
		/**
		* @name ls
		* @memberOf tools.CookieManager
		* @default new Object()
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Список всех куки
		*/
		ls:{},
		/**
		* @name defaultTime
		* @memberOf tools.CookieManager
		* @default "Mon, 01-Jan-2020 00:00:00 GMT"
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Время, когда создаётся куки, по-умолчанию
		*/
		defaultTime:"Mon, 01-Jan-2020 00:00:00 GMT",
		/**
		* @name defaultPath
		* @memberOf tools.CookieManager
		* @default "/"
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Путь, где создаётся куки, по-умолчанию
		*/
		defaultPath:"/",
		/**
		* @name rm
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Синоним для this._remove
		* @see tools.CookieManager#_remove
		*/
		rm:"~this._remove~",
		/**
		* @name val^1
		* @memberOf tools.CookieManager
		* @function
		* @param name Имя получаемой куки
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/> Получения значение куки с именем name
		*/
		/**
		* @name val^2
		* @memberOf tools.CookieManager
		* @function
		* @param name Имя устанавливаемой куки
		* @param val Значения устанавливаемой куки
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/>Сидоним для add
		* @see tools.CookieManager#add
		*/
		val:function(name,val){	
			if(arguments.length==1){
				if(this.ls[name]){
					return this.ls[name];
				}
				else{
					return null;
				}
			}
			if(arguments.length==2){
				this._add(name,val);
				return null;
			}
		}
	},
	get:{
		/**
		* @name add
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Возвращает приватный метод _add/Устанавливает куки из пользовательского объекта
		*/
		add:function(key){
			return this._add;
		},
		/**
		* @name remove
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter/Setter</i>
		* <br/>Возвращает приватный метод _remove/Удаляет куки с именем key
		*/
		remove:function(key){
			return this._remove;
		},
		/**
		* @name cookieEnabled
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Публичная</i>
		* <br/><b>Тип</b> : <i>Getter</i>
		* <br/>Проверяет включены ли в браузере куки
		*/
		cookieEnabled:function(){
			return window.navigator.cookieEnabled;
		}
	},
	set:{
		add:function(key,val){
			if(this.cookieEnabled){
				if(typeof val.name=="string" && (typeof val=="string" || typeof val=="number") && this.cookieEnabled){
					this._add(val.name,val.val);
				}
				if(typeof val=="object"){
					if(val.name && val.val){
						if(typeof val.name=="string" && (typeof val.val=="string" || typeof val.val=="number") && this.cookieEnabled){
							this._add(val.name,val);
						}
					}
				}
			}
		},
		remove:function(key,val){
			if(this.cookieEnabled){
				this._remove(val);
			}
		},
		cookieEnabled:function(){}
	},
	protected:{
		/**
		* @name eventList
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Защищенная</i>
		* <br/>Список событий куки
		*/
		eventList:["change","add","remove"]
	},
	private:{
		/**
		* @name oldCookieString
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Строка со старым значением куки
		*/
		oldCookieString:"",
		/**
		* @name timer
		* @memberOf tools.CookieManager
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Содержит инсталированный таймер
		*/
		timer:new tools.Timer(1000),
		/**
		* @name cookieEvent
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Событие срабатывающее каждую секунду и проверяющая валидность куки строке oldCookieString
		*/
		cookieEvent:function(e){
			if(this.oldCookieString!=document.cookie){
				this.dispatch("change",[document.cookie,this.oldCookieString]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		/**
		* @name _add
		* @memberOf tools.CookieManager
		* @function
		* @param name Имя куки
		* @param val Значение куки
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Добавляет куки
		*/
		_add:function(name,val){
			if(typeof name=="string" && (typeof val=="string" || typeof val=="number") && this.cookieEnabled){
				document.cookie=escape(name)+"="+escape(val)+"; expires="+this.defaultTime+"; path="+this.defaultPath+";";
				this.dispatch("add",[name,val]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
			if(typeof name=="string" && typeof val=="object"){
				var date=val.date ? this.parseTime(val.date) : "";
				var path=val.path ? val.path : this.defaultPath;
				var domain=val.domain ? val.domain : false;
				var secure=secure ? true : false;
				if(typeof name=="string" && (typeof val.val=="string" || typeof val.val=="number") && this.cookieEnabled){
					document.cookie=
						escape(name)+"="+escape(val.val) +
						"; path="+path +
						"; expires="+date +
						((!!domain) ? "; domain="+domain: "") +
						((!!secure) ? "; secure" : "")
				}
				this.dispatch("add",[name,val]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		/**
		* @name _remove
		* @memberOf tools.CookieManager
		* @function
		* @param name Имя куки
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Удаляет куки
		*/
		_remove:function(name){
			if(typeof name=="string"){
				var expireAt = new Date(1970,1);
				document.cookie=unescape(name)+ "= 0;  path=/;  expires="+expireAt.toGMTString();
				this.dispatch("remove",[name]);
				this.oldCookieString=document.cookie;
				this.lsCreate();
			}
		},
		/**
		* @name lsCreate
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Создаёт список всех куки
		*/
		lsCreate:function(){
			var ls=this.oldCookieString.match(/([^;]+);?/gi);
			ls=!!ls ? ls : [];
			var space;
			var key;
			var val;
			for(var i=0;i<ls.length;i++){
				space=ls[i].substr(0,1);
				if(space==" "){
					key=ls[i].substr(1,ls[i].indexOf("=")-1);
					val=ls[i].substr(ls[i].indexOf("=")+1,ls[i].length);
					val=val.substr(val.length-1,val.length)==";" ? val.substr(0,val.length-1) : val;
				}
				else{
					key=ls[i].substr(0,ls[i].indexOf("="));
					val=ls[i].substr(ls[i].indexOf("=")+1,ls[i].length);
					val=val.substr(val.length-1,val.length)==";" ? val.substr(0,val.length-1) : val;
				}
				this.ls[unescape(key)]=unescape(val);
			}
		},
		/**
		* @name parseTime
		* @memberOf tools.CookieManager
		* @function
		* @description
		* <b>Область видимости</b> : <i>Приватная</i>
		* <br/>Вычисляет время согласно внутреннем селекторам.
		*/
		parseTime:function(time){
			if(typeof time=="string"){
				var options=time.match(/\+[0-9]+(?:m|h|d|w|M|Y)/g);
				var m=60000;
				var h=m*60;
				var d=h*24;
				var w=d*7;
				var todaySimp=new Date();
				var today={
					day:todaySimp.getDate(),
					month:todaySimp.getMonth()+1,
					year:todaySimp.getFullYear()
				};
				var endTime=0;
				for(var i=0;i<options.length;i++){
					var optArr=options[i].match(/\+([0-9]+)(m|h|d|w|M|Y)/);
					if(optArr[1] && optArr[2]){
						var currentTimeInt=parseInt(optArr[1]);
						switch(optArr[2]){
							case "m":{
								endTime+=currentTimeInt*m;
							}
							break;
							case "h":{
								endTime+=currentTimeInt*h;
							}
							break;
							case "d":{
								endTime+=currentTimeInt*d;
							}
							break;
							case "w":{
								endTime+=currentTimeInt*w;
							}
							break;
							case "M":{
								for(var j=0;j<currentTimeInt;j++){
									var deltaDate=new Date(today.year,today.month+j);
									var maxDay=Date.prototype.lastMonthDay(deltaDate.getMonth()+1,deltaDate.getFullYear());
									endTime+=d*maxDay;
								}
							}
							break;
							case "Y":{
								for(var j=1;j<=currentTimeInt;j++){
									endTime+=d*Date.prototype.lastYearDay(today.year+j);
								}
							}
							break;
							default:
						}
					}
				}
				var Time=new Date(new Date().getTime()+endTime);
				return Time.toGMTString();
			}
		}
	}
});