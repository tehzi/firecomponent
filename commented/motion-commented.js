/**
* @fileoverview
* Набор функционала для анимации свойств DOM-элементов с поддержкой относительных ускорения и траектории движения.
* @author <a href="mailto:Numinos@overkin.net">Numinos X</a>
* @version 0.0.1
*/
/**
* @namespace
* Пакет предоставляет набор утилит для анимации свойств DOM-элементов с поддержкой относительных ускорения и траектории движения.
* @description
* <b>Тип данных:</b> <i>Object</i>
*/
var motion={};
/**
* @name Animator
* @class
* Класс управления анимируемыми инстансами 
* @memberOf motion
* @description
* Класс-менеджер для управлениями анимациями.
*/
Class({
	name : "Animator",
	pack : motion,
	/**
	* @name constructor
	* @memberOf motion.Animator
	* @function
	* @param object объект jQuery, содержащий набор элементов для применения анимации
	* @param params объект, содержащий наборы инструкций и параметров для анимации элементов, переданных параметром object
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor : function(object, params){
		if (object != undefined){
			this.add(object, params);
		}
	},
	public : {
		instances :{},
		defaultInterval : 10,
		defaultDuration : 1000,
		start : function (insName){
			insName = (insName == undefined) ? 'all' : insName;
			if (insName == 'all') {
				var n;
				for (var n in this.instances){
					this._start(this.instances[n]);
					console.log(n);
				}
			}
			else {
				this._start(this.instances[insName]);
			}
		},
		add : function (JQobject, params){
			var i;
			var object = {};
			for (i = 0; i<JQobject.length; i++){
				object = JQobject.eq(i);
				this._add(object, params);
			}
		}
	},
	protected : {
		update : function (targetObject, property, val){
			targetObject.css(property, val);
		},
		tweeningArray : function (first, last, step){
			var a = [];
			var l = Math.ceil(Math.abs((last-first)/step));
			for (var i = first, j = 0; j < l; i += step, j++){
				a.push(i);
			}
			if (a[l] != last) {a.push(last);}
			return a;
		},
		step : function (first, last, interval, duration){
			var step = (last-first)*interval/duration;
			return step;
		},
		getDefaultValue : function(object, param){
			var p;
			switch (param){
				case 'width':
					p = object.width();	
					break;
				case 'height':
					p = object.height();	
					break;
				case 'top':
					p = object.position().x;
					break;
				case 'left':
					p = object.position().y;
					break;
				default :
					p = object.css(param) || 0;
					break;
			}
			p = (typeof p == "string") ? p.replace(',', '.') : p;
			return Number(p);
		},
		_start : function (p){
			var m;
			for (m in p){
				p[m].start();
			}
		},
		_add : function (object, params){
			if (typeof params.property == "object" || typeof params.to == "object"){
				var m;
				var n;
				var i = 0;
				var insName = '';
				var holder = (typeof params.property == "object") ? "property" : "to";
				for (n in params[holder]){
					var _params = new tools.copy(params);
					insName = 'ins_'+i;
					for (m in _params){
						if (typeof _params[m] == "object"){
							_params[m] = (_params[m][n] != undefined) ? 
								_params[m][n] : 
								(_params[m].pop() || _params[m]);
						}
					}
					if (_params.name != undefined){
						insName = _params.name;
					}
					if (this.instances[insName] == undefined){
						this.instances[insName] = [];
					}
					this.instances[insName].push(new motion.Instance(object, _params));
					i++;
				}
			}
			else{
				insName = (params.name == undefined) ? 'ins_0' : params.name;
				this.instances[insName] = [new motion.Instance(object, params)];
			};
		}
	}
});
/**
* @name Instance
* @class
* Класс, отвечающий за анимацию определенного свойства.
* @memberOf motion
* @description
* Данный класс управляет анимацией определенного свойства элемента.
*/
Class({
	name : "Instance",
	pack : motion,
	parent : motion.Animator,
	/**
	* @name constructor
	* @memberOf motion.Instance
	* @function
	* @param object объект jQuery, содержащий элемент для применения анимации
	* @param params объект, содержащий инструкции и параметры для анимации
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor : function(object, params) {
		this.targetObject = object;
		this.property = params.property;
		this.params = params;
		this.timer.bind('timer', this.tick);
	},
	private : {
		step : 0,
		array : [],
		nowAt : 1,
		timer : new tools.Timer(),
		targetObject : {},
		params : {},
		property : "",
		from : 0,
		to : 0,
		interval : 0,
		duration : 0,
		tick : function (){
// 			console.log(this.targetObject, this.property, this.array[this.nowAt])
			this.parent.update(this.targetObject, this.property, this.array[this.nowAt]);
			this.nowAt++;
		}
		
	},
	public : {
		start : function (){
			this.nowAt = 1;
			this.from = (this.params.from == undefined) ?
				this.parent.getDefaultValue(this.targetObject, this.property) :
				this.params.from;
			if (typeof this.from == "string"){
				switch (from.substring(from.length-2)){
					case "px":
						this.from = Number(from.substring(0, from.length-2));
					break;
					default : this.from = 0; break;
				}
			}
			this.to = this.params.to;
			if(!(this.to == undefined)){
				if (typeof this.to == "string"){
					switch (this.to[0]){
						case "+": 
							this.to = this.from + Number(to.substring(1));
							break;
						case "-": 
							this.to = this.from - Number(to.substring(1));
							break;
					}
				}
				this.interval = this.params.interval || this.parent.defaultInterval;
				this.duration = this.params.duration || this.parent.defaultDuration;
				
				
				this.step = this.parent.step(this.from, this.to, this.interval, this.duration);
				this.array = this.parent.tweeningArray(this.from, this.to, this.step);
				this.timer.delay=this.interval;
				this.timer.repeatCount=this.array.length-1;
// 				this.timer = (this.interval, this.array.length-1);
// 				this.timer.bind('timer', this.tick);
				this.timer.start();
			}
		}
	}
})