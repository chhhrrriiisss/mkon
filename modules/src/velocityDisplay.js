function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.surfaceVelocity', 'v.orbitalVelocity', 'v.altitude'];

	// register a new module
	var mod = new MKON.module('Velocity Display', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		
		var sV =  MKON.CONTENT.getVariable(req[0]) || 0;
		var oV = MKON.CONTENT.getVariable(req[1]) || 0;
		var alt = MKON.CONTENT.getVariable(req[2]) || 0;

		oV = MKON.FNC.toFixed( oV , 1);
		sV = MKON.FNC.toFixed( sV , 1);

		

		if (alt > 35000) {
			t.find('.data-v').html(oV + 'm/s');
			t.find('.data-title').html('ORBIT');
		} else {
			t.find('.data-v').html(sV + 'm/s');
			t.find('.data-title').html('SURFACE');
		
		}

	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="met screen"><h3 class="data-title">SURFACE</h3><h3 class="data-v data-time">0m/s</h3></div></li>';

	content = { html: content, x: 3, y: 1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);


	// for (var i=0; i<req.length; i++) {
	// 	addVariables( [ mod.req[i] ] );
	// }

	//updateAPIString();
}

