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
		object.each(function(){
			console.log(typeof params.property);
			if (typeof params.property == "object"){
				var n;
				var props = params.property;
				for (n in props){
					var _params = new tools.copy(params);
					_params.property = _params.property[n];
					for (m in _params){
						if (typeof _params[m] == "object" && m != 'property'){
							_params[m] = (_params[m][n] != undefined) ? _params[m][n] : (_params[m].pop() || _params[m]);
						}
					}
					console.log(_params);
					temp = new motion.Instance($(this), _params);
				}
			}
			else{
				temp = new motion.Instance($(this), params);
			}
		});
	},
	public : {},
	protected : {
		defaultInterval : 10,
		defaultDuration : 1000,
		update : function (targetObject, property, val){
			console.log('changing '+property+' to '+val);
			targetObject.css(property, val);
		},
		tweeningArray : function (first, last, step){
			var a = [];
			var l = Math.ceil(Math.abs((last-first)/step));
			for (var i = first, j = 0; j < l; i += step, j++){
				a.push(i);
			}
			console.log('l='+l+' length='+a.length);
			if (a[l] != last) {a.push(last);}
			return a;
		},
		step : function (first, last, interval, duration){
			var step = (last-first)*interval/duration;
			return step;
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
		this.property = params.property;
		var from = (params.from == undefined) ? object.css(this.property) || 0 : params.from;
		if (typeof from == "string"){
			switch (from.substring(from.length-2)){
				case "px":
					from = Number(from.substring(0, from.length-2));
				break;
				default : from = 0; break;
			}
		}
		var to = params.to;
		if(!(to == undefined)){
			if (typeof to == "string"){
				switch (to[0]){
					case "+": to = from + Number(to.substring(1)); break;
					case "-": to = from - Number(to.substring(1)); break;
				}
			}
			var interval = params.interval || this.parent.defaultInterval;
			var duration = params.duration || this.parent.defaultDuration;
			
			this.targetObject = object;
			this.step = this.parent.step(from, to, interval, duration);
			this.array = this.parent.tweeningArray(from, to, this.step);
			console.log(this.step);
			console.log(this.array);
			this.timer = new tools.Timer(interval, this.array.length-1);
			this.timer.bind('timer', this.tick);
			this.timer.start();
		}
	},
	private : {
		step : 0,
		array : [],
		nowAt : 1,
		timer : {},
		targetObject : {},
		property : "",
		tick : function (){
			this.parent.update(this.targetObject, this.property, this.array[this.nowAt]);
			this.nowAt++;
		}
	}
})