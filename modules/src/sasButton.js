function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.sasValue'];
	var com = ['f.sas'];
	
	// register a new module
	var mod = new MKON.module('SAS', 'Button', id, req,

	function() {   

		var t = $('#'+this.id);

		var d = MKON.CONTENT.getVariable(req);	

		if (d == 'True') {
			t.find('.button').removeClass('gray');
		
		} else {
			t.find('.button').addClass('gray');
	
		}
	
	});

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-com="' + com + '" class="command" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content blank"><a class="button lightText large square white" data-defaultClass="white" >SAS</a></div></li>';

	content = { html: content, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	// Adds a keyboard hook that sends a command
	MKON.CONTENT.addHook(id, 't', function() { MKON.COMMS.command(com[0]); });
}