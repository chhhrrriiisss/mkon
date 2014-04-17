function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	
	var id = MKON.FNC.randomString(5)	
	var req = ['r.resource[LiquidFuel]', 'r.resourceMax[LiquidFuel]'];

	var r;

	if (meta!=null && meta != '') {

	    r = meta.toString();
		req = ['r.resource[' + r + ']', 'r.resourceMax[' + r + ']'];
	    add();

	} else {		

	    alertify.prompt("Enter the resource name to track", function (e,str) {
	        if (e) {
	          
	            if (str!=null && str != '') {
	            	r = str.toString();
					req = ['r.resource[' + r + ']', 'r.resourceMax[' + r + ']'];
	            	add();
	            	// req = ['r.resource[' + r + ']', 'custom','r.resourceMax[' + r + ']','maxCustom'];
	        	} else {
	        		 return alert('You didnt enter a valid resource!');
	        	}

	        } else {
	        	             
	        }
	    }, "LiquidFuel");

	}

    function add() {

		// register a new module
		var mod = new MKON.module('Custom Resource', 'Resource', id, req,

		//handle data function
		function() {   

			var t = $('#'+this.id);

			var custom = MKON.CONTENT.getVariable(req[0]);
			var maxCustom = MKON.CONTENT.getVariable(req[1]);
			var perc = MKON.FNC.toFixed( (custom/maxCustom)*100, 2 );
			custom = MKON.FNC.toFixed(custom, 2);
			maxCustom = MKON.FNC.toFixed(maxCustom, 2);

			if (custom == -1.00 || maxCustom == -1.00) {
				custom = 0;
				maxCustom = 0;
				perc = 0;
			}

			var target = t.find('.data-custom');

			target.css('width', perc + '%');
			target.attr('data-val', custom);
			target.parent().attr('data-val', maxCustom);

			// t.find('.marker').css('left', perc + '%')	
		
		
		}
		);

		// content for insertion to gridster
		var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-meta="' + r + '" data-sizex="3" data-sizey="1">\
						<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
						<div class="content"><div class="resource-bar"><h3>' + r + '</H3><div class="s resource" data-val="0"><div class="s value data-custom" data-val="0"></div></div></div></div></li>';

		content = { html: content, x:3, y:1, col: col, row: row };

		MKON.CONTENT.addModule(mod, content);

		;
		//updateAPIString();

	}

}