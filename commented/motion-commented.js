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
* @name Animation
* @class
* Класс управления анимируемыми инстансами 
* @memberOf animation
* @description
*/
Class({
	name : "Animator",
	pack : motion,
	/**
	* @name constructor
	* @description
	* <b>Конструктор класса</b> : <i>Да</i>
	*/
	constructor : function(object, params){
		object.each(function(){
			temp = new motion.Instance($(this), params);
		});
	},
	public : {},
	protected : {
		instances : {},
		animate : function(){
			
		},
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
	},
	private : {
		
	}
});
/**
* @name Intance
* @class
* Класс, отвечающий за анимацию определенного свойства.
* @memberOf animation
* @description
*/
Class({
	name : "Instance",
	pack : motion,
	parent : motion.Animator,
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
			var interval = params.interval || this.defaultInterval;
			var duration = params.duration || this.defaultDuration;
			
			this.targetObject = object;
			this.step = this.parent.step(from, to, interval, duration);
			this.array = this.parent.tweeningArray(from, to, this.step);
			console.log(this.step);
			console.log(this.array);
			this.timer = new tools.Timer(interval, this.array.length-1);
			this.timer.bind('timer', this.tick);
			this.timer.start();}
	},
	private : {
		defaultInterval : 10,
		defaultDuration : 1000,
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