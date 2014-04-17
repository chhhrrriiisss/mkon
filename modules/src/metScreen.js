function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.missionTime'];

	// register a new module
	var mod = new MKON.module('Mission Time Screen', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		
		var met =  MKON.CONTENT.getVariable(req) || 0;
		
		met = MKON.FNC.formatters.hourMinSec( parseFloat(met) );		

		t.find('.data-time').html('T+' + met);
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="met screen"><h3>MET</H3><h3 class="data-time">T+00:00:00</h3></div></li>';

	content = { html: content, x: 3, y: 1, col: col, row: row };
	// MKON.CONTENT.addModule(mod);

	MKON.CONTENT.addModule(mod, content);

	//addVariables(mod.req)
	//updateAPIString();
}

