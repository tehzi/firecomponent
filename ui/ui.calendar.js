Date.prototype.MONTHNAMES = [
	"Январь",
	"Февраль",
	"Март",
	"Апрель",
	"Май",
	"Июнь",
	"Июль",
	"Август",
	"Сентябрь",
	"Октябрь",
	"Ноябрь",
	"Декабрь"
];
Date.prototype.getFullMonthRU = function(){
	return this.MONTHNAMES[this.getMonth()];
}
Date.prototype.DAYNAMES = [
	"Вс",
	"Пн",
	"Вт",
	"Ср",
	"Чт",
	"Пт",
	"Сб"
];
Date.prototype.getDayRU = function(){
	return this.DAYNAMES[this.getDay()];
}
Date.prototype.lastday = function(month, year) {
	var d = new Date(year ? year : this.getFullYear(), month ? month  : this.getMonth() + 1, 0);
	return d.getDate();
};


Class({
	parent:ui.Forms,
	pack:ui,
	name:'Calendar',
	constructor:function(element, args){
		this.Super(element);
		this.template = $(ui.templates.calendar.main);
		
		// static calendar properties fetch
		if (this.elementJquery.find("div.znc-calendar").length > 0){
			var calendar = this.elementJquery.find("div.znc-calendar");
			this.amount = calendar.find("div.znc-calendar-holder").length;
			this.rows = calendar.find("div.znc-calendar-header.first").length;
			this.cols = this.amount / this.rows;
			this.shadow = (calendar.find("div.znc-calendar-shadow").length > 0) ? true : false;
			// current date and if found — main calendar position
			var currDay = calendar.find("div.znc-calendar-day.current");
			if (currDay.length > 0){
				this.currentDate.setTime(currDay.attr('data-date'));
				this.targetDate = this.currentDate;
				this.targetPosition = currDay.parents("div.znc-calendar-holder").index();
			}
			else{
				this.targetDate.setTime($("div.znc-calendar-day:not(.inactive)").eq(0).attr('data-date'));
				this.targetPosition = 0;
			}
		}
		
		var $this = this;
		if (args){
			$.each(args, function(key, val){
				$this[key] = val;
			})
		}
		this.amount = this.rows * this.cols;
		var index = this.calculateTargetIndex();	
		for (var i = 0; i < this.amount; ++i){
			var container = this.constructContainer();
			var targetDate = new Date(this.targetDate.getFullYear(), this.targetDate.getMonth() + i - index);
			if (i == 0 || i % this.cols == 0){
				container.find("div.znc-calendar-header").addClass("first");
			}
			this.template.find("div.znc-calendarsHolder").append(container);
			// header
			this.updateContainer(targetDate, container)
			
		}
		this.template.find(".znc-calendar-buttonPrev, .znc-calendar-buttonNext").click(function(e){
			$this.slide($(this).hasClass("znc-calendar-buttonPrev") ? 'prev' : 'next');
		});
		this.template.find("input.znc-calendar-dateInput").bind("blur keyup", this.dateInputChange);
		// shadow
		if (this.shadow) this.template.append($(ui.templates.calendar.shadow));
		
		// output
		this.elementJquery.html(this.template);
		
		// width|height fixing
		this.updateSize();
	},
	public:{
		step : 1,							// количество месяцев, пролистываемое стрелками
		currentDate : new Date(),			// текущая дата
		resizeParent: false,
		parentWidthAdd: 0,
		parentHeightAdd : 0,
		updateParentSize : function(){
			var container = this.elementJquery.find("div.znc-calendar");
			this.elementJquery.parents(this.resizeParent).css('width', container.width() + this.parentWidthAdd).css('height', container.height() + this.parentHeightAdd);
		}
	},
	protected:{
		firstDay : 1, 						// первый день недели (0 — Воскресенье)
		targetPosition : 'middleOrPrev',	// положение текущего календаря в связке
		targetDate : new Date(),			// дата текущего календаря
		rows : 1,							// количество колонок
		cols : 1,							// количество столбцов
		dateFormat : 'dd.mm.yyyy',			// форматирование даты на выходе
		weekends : [0, 6],					// выходные дни
		showWeekends : true,				// выделять выходные дни цветом
		showCurrent : true,					// показывать текущую дату
		shadow : true,						// отображение тени

		amount: 12,							// колчичество календарей в „связке”, helper, установка значения через пару rows/cols
	  
		colWidth : 200,
		rowHeight : 179,
		template : false,
		constructContainer : function(){
			var container = $(ui.templates.calendar.holder);
			var $this = this;
			// day names
			var i = 0;
			var dayNames = $(ui.templates.calendar.dayNames);
			while (i < 7){
				var index = (i + this.firstDay < 7) ? i + this.firstDay : 6 - i;
				var day = $(ui.templates.calendar.day);
				if ($this.showWeekends && $.inArray(index, this.weekends) != -1){
					day.addClass("weekend");
				}
				day.text(Date.prototype.DAYNAMES[index]);
				container.find("div.znc-calendar-daynames").append(day);
				++i;
			}
			var j = 0;
			while (j < 42){
				var day = $(ui.templates.calendar.day).click(function(){
					$("div.znc-calendar-day").removeClass("selected")
					$(this).addClass("selected").parents("div.znc-calendar").find("input.znc-calendar-dateInput").val($this.formatDate(($(this).attr('data-date'))));
				});
				container.find("div.znc-calendar-days").append(day);
				++j;
			}
			return container;
		},
		updateContainerDayNames : function(){
			var i = 0;
			var $this = this;
			this.elementJquery.find("div.znc-calendar-daynames div.znc-calendar-day").each(function(){
				if (i>6) i -= 7;
				var index = (i + $this.firstDay) % 7;
				$(this).text(Date.prototype.DAYNAMES[index]);
				console.log(i, i+$this.firstDay, index);
				if ($this.showWeekends && $.inArray(((i + $this.firstDay) % 7), this.weekends) != -1){
					$(this).addClass("weekend");
				}
				else{
					$(this).removeClass("weekend");
				}
				++i;
			})
		},
		updateCalendar : function(){
			var i = 0;
			var index = this.calculateTargetIndex();
			var $this = this;
			this.elementJquery.find("div.znc-calendar-holder").each(function(){
				var date = new Date($this.targetDate.getFullYear(), $this.targetDate.getMonth() + i - index);
				if (i == 0 || i % $this.cols == 0){
					$(this).find("div.znc-calendar-header").addClass("first");
				}
				$this.updateContainer(date, $(this));
				++i;
			});
		},
		updateContainer : function(date, container){
			// header
			var monthName = date.getFullMonthRU();
			container.find("div.znc-calendar-header").find(".year").html(date.getFullYear()).end().find(".monthName").html(monthName);
			
			// days
			var year = date.getFullYear();
			var month = date.getMonth();
			var j = 0;
			var dayIndex, val;
			var firstTargetDay = date.getDay();
			var lastPrevDate = new Date(year, month, 0).lastday();
			var lastTargetDay = new Date(year, month + 1, 0).getDay();
			var lastTargetDate = new Date(year, month + 1, 0).getDate();
			
			var firstIndex = firstTargetDay - this.firstDay - 1;
			if (firstIndex < -1) firstIndex += 7;
			var lastIndex = firstIndex + lastTargetDate;
			
			if (this.showCurrent) $("div.znc-calendar-day").removeClass("current");
			while (j < 42){
				dayIndex = (j + this.firstDay < 7) ? j + this.firstDay : 6 - j;
				var day = container.find("div.znc-calendar-days div.znc-calendar-day").eq(j);
				var date;
				if (j <= firstIndex || j > lastIndex){
					day.addClass('inactive').removeClass("weekend");
					if (j <= firstIndex ) {
						val = lastPrevDate - firstIndex + j;
						date = new Date(year, month - 1, val);
					}
					else{
						val = j - lastIndex;
						date = new Date(year, month + 1, val);
					}
				}
				else{
					val = j - firstIndex;
					if ($.inArray(((j + this.firstDay) % 7), this.weekends) != -1) day.addClass("weekend");
					else day.removeClass("weekend");
					date = new Date(year, month, val);
					day.removeClass('inactive');
				}
				if (this.showCurrent && !day.hasClass("inactive") && this.currentDate.getDate() == date.getDate() && this.currentDate.getFullYear() == date.getFullYear() && this.currentDate.getMonth() == date.getMonth()){
					day.addClass("current");
				}
				day.attr('data-date', date.getTime());
				day.html(val);
				++j;
			}
		},
		updateAmount : function(){
			this.amount = this.rows * this.cols;
			var length = this.elementJquery.find("div.znc-calendar-holder").length;
			var diff = length - this.amount;
			var i = 0;
			if (diff > 0){
				while (i < diff){
					this.elementJquery.find("div.znc-calendar-holder:last").remove();
					++i;
				}
			}
			else{
				while (i > diff){
					this.elementJquery.find("div.znc-calendarsHolder").append(this.constructContainer());
					--i;
				}
			}
		},
		updateSize : function(){
			var container = this.elementJquery.find("div.znc-calendar");
			if (this.amount > this.cols){
				container.width(this.colWidth * this.cols);
			}
			else{
				container.width(this.colWidth * this.amount);
			}
			container.height(this.rowHeight * this.rows + 28);
			if (this.shadow){
				container.find("div.znc-calendar-shadow_right").height(container.height());
				container.find("div.znc-calendar-shadow_bottom").width(container.width() - 1);
			}
			if (this.resizeParent){
				this.updateParentSize();
				
			}
		},
		slide : function(dir){
			var d = (dir == 'next') ? this.step : -this.step;
			this.targetDate = new Date(this.targetDate.getFullYear(), this.targetDate.getMonth() + d);
			this.updateCalendar();
		},
		calculateTargetIndex : function(){
			var index = 0;
			switch (this.targetPosition){
				case 'first':			// в начале связки
				case 0:
					break;
				case 'last' :			// в конце связки
				case -1:
					index = this.amount - 1;
					break;
				case 'middleOrNext':	// в середине или на следующем месте (если количество четное)
					index = (this.amount % 2 == 1) ? (this.amount - 1) / 2 : this.amount / 2
					break;
				case 'middleOrPrev':	// в середине или на предыдущем месте (если количество четное)
					index = (this.amount % 2 == 1) ? (this.amount - 1) / 2 : (this.amount - 2) / 2
					break;
				default :				// положение задано напрямую цифрой
					if (this.targetPosition < 0){
						index = this.amount + this.targetPosition;
					}
					else{
						index = this.targetPosition;
					}
					break;
			}
			return index;
		},
		formatDate : function(timestamp){
			var date = new Date();
			date.setTime(timestamp);
			var s = ['dd', 'd', 'mm', 'm', 'yyyy', 'yy'];
			var r = [this.zero(date.getDate()), date.getDate(), this.zero(date.getMonth() + 1), date.getMonth() + 1, date.getFullYear(), String(date.getFullYear()).substr(2)];
			var result = this.dateFormat.s_replace(s, r);
			return result;
		},
		zero : function(val){
			if (val < 10){
				val = '0'+val;
			}
			return val;
		},
		dateInputChange : function(e){
			var input = $(e.target);
			if ((e.type == 'blur' || e.which == 13 || e.which == 9) && input.val().length == this.dateFormat.length){
				var inputVal = $(input).val();
				var escDateFormat = this.dateFormat.escape();
				var dayVariant = (this.dateFormat.match("dd")) ? 'dd' : (this.dateFormat.match("m") ? 'd' : false);
				var monthVariant = (this.dateFormat.match("mm")) ? 'mm' : (this.dateFormat.match("m") ? 'm' : false);
				var yearVariant = (this.dateFormat.match("yyyy")) ? 'yyyy' : (this.dateFormat.match("yy") ? 'yy' : false);
				var day = regReplace(escDateFormat, dayVariant, monthVariant, yearVariant, inputVal);
				var month = regReplace(escDateFormat, monthVariant, dayVariant, yearVariant, inputVal);
				var year = regReplace(escDateFormat, yearVariant, dayVariant, monthVariant, inputVal);
				if (yearVariant == 'yy'){
					year = ((year > 70) ? '19' : '20') + year;
				}
				try {
					
					var testDate = new Date(year, month - 1, day);
					console.log(testDate);
					if (testDate && testDate.toString() != 'Invalid Date'){
						this.targetDate = testDate
						this.updateCalendar();
						input.val(this.formatDate(testDate));
					}
				}
				catch (e){
					console.log('error', e);
				}
				e.preventDefault();
			}
			function regReplace(string, what, whatnot1, whatnot2, replace){
				var s = [what];
				var r = ["(\\d+)"];
				if (whatnot1){
					s.push(whatnot1);
					r.push("\\d+");
				}
				if (whatnot2){
					s.push(whatnot2);
					r.push("\\d+");
				}
				var regExp = new RegExp(string.s_replace(s, r), 'i');
				var result = replace.match(regExp);
				return result[1];
			}
		}
	},
	get : {
		firstDay : function(){
			return this.firstDay;
		},
		amount: function(){
			return this.amount;
		},	
		targetPosition: function(){
			return this.targetPosition;
		},
		targetDate: function(){
			return this.targetDate;
		},	
		rows: function(){
			return this.rows;
		},	
		cols: function(){
			return this.cols;
		},	
		dateFormat: function(){
			return this.dateFormat;
		},	
		shadow: function(){
			return this.shadow;
		}
	},
	set : {
		firstDay : function(key, value){
			this.firstDay = Number(value);
			this.updateContainerDayNames();
			this.updateCalendar();
		},
		targetPosition: function(key, value){
			if (parseInt(value) != NaN)	this.targetPosition = parseInt(value);
			else this.targetPosition = value;
			this.updateCalendar();
		},
		targetDate: function(key, value){
			this.targetDate = value;
			this.updateCalendar();
		},	
		rows: function(key, value){
			this.rows = Number(value);
			this.updateAmount();
			this.updateSize();
			this.updateCalendar();
		},	
		cols : function(key, value){
			this.cols = Number(value);
			this.updateAmount();
			this.updateSize();
			this.updateCalendar();
		},
		dateFormat: function(key, value){
			this.dateFormat = value;
		},	
		shadow : function(key, value){
			this.shadow = value;
			if (value){
				this.elementJquery.find("div.znc-calendar").append($(ui.templates.shadow));
			}
			else{
				this.elementJquery.find("div.znc-calendar-shadow").remove();
			}
			this.updateSize();
		}
	}
});
