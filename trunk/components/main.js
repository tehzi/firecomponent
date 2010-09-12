var __FIREobj__ = {};
try{
	var log = console.log;
}
catch(err){}
$.fn.replace = function(arr){
	var	$$ = $(this);
	if(arr[0].length>0){
		$$.after(arr[0]);
		$$.remove();
		for(var i=0;i<arr.length;i++){
			if(!arr[i +1]) break;
			$(arr[i]).after(arr[i +1]);
		}
	}
}