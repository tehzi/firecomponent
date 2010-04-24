__FIREobj__.highlight = [
	false,
	{
		find :  /(.*)(<)(.*)/i,
		class : "tag",
		tag : "span",
		command : ["begin modeTag"],
		mode : [
			__FIREobj__.hightlighting,
			{
				begin : /^<\s*([_a-z0-9-]+)/i,
				class : "tag-name",
				tag : "span",
				command : ["listen"],
				mode : []
			}
		]
	}/*,
	{
		find : /([^\S]+)(\S+)([^\S]+)/i,
		class : "word",
		tag : "span",
		command : [],
		mode : []
	}*/
];