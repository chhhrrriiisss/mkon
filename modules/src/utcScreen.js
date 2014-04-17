function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['t.universalTime'];

	// register a new module
	var mod = new MKON.module('UTC Time Screen', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		
		var utc =  MKON.CONTENT.getVariable(req) || 0;

		utc = MKON.FNC.formatters.time( parseFloat(utc) );	

		t.find('.data-time').html(utc);
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="utc screen"><h3>UTC</H3><h3 class="data-time">0D 0H 0M 0S</h3></div></li>';

	content = { html: content, x: 4, y: 1, col: col, row: row };
	// MKON.CONTENT.addModule(mod);

	MKON.CONTENT.addModule(mod, content);

	//addVariables(mod.req)
	//updateAPIString();
}

