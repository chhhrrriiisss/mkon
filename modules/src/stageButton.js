function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = [''];
	var com = ['f.stage'];

	// register a new module
	var mod = new MKON.module('Stage', 'Button', id, req,

	function() {   
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-com="' + com + '" class="command" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content blank"><div class="stageButton"><div class="inner"><i class="fa fa-stage fa-4x"></i></div></div></div></li>';

	content = { html: content, x: 2, y: 2, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	MKON.CONTENT.addHook(id, 'space', function() { MKON.COMMS.command(com[0]); });

}