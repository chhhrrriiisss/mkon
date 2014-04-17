function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	// var req = ['v.lightValue', 'lght'];

	var r;

	if (meta!=null && meta != '' && !isNaN(meta) && meta <= 10 && meta > 0) {  

	    r = meta.toString();
		add();

	} else {

		
		alertify.prompt("Enter a number for the Action Button", function (e,str) {
	        if (e) {
	          
	            if (str!=null && str != '' && !isNaN(str) && str <= 10 && str > 0) {                
	            	r = str.toString();

	            	add();
	            	// req = ['r.resource[' + r + ']', 'custom','r.resourceMax[' + r + ']','maxCustom'];
	        	} else {
	        		 return alert('You didnt enter a valid number!');
	        	}

	        } else {
	        	             
	        }
	    }, "1");
	}    

	function add() {

		var action = 'f.ag' + r;
    	var com = [action];

		// register a new module
		var mod = new MKON.module('Action' + r, 'Button', id, ['',''], 

		function() {   

		} );

		// content for insertion to gridster
		var content =   '<li id="' + id + '" data-com="' + com + '" class="command" data-row="1" data-col="1" data-meta="' + r + '" data-link="' + url + '" data-sizex="1" data-sizey="1">\
						<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
						<div class="content blank"><a class="button lightText large square orange gray action" >A' + r + '</a></div></li>';

		content = { html: content, x:1, y:1, col: col, row: row };

		MKON.CONTENT.addModule(mod, content);

		MKON.CONTENT.addHook(id, r, function() { MKON.COMMS.command(com[0]); });

		// register a new module
		var mod = new MKON.module('Action' + r, 'Button', id, ['',''], function() {  } );

	}
}