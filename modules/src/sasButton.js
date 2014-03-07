function init(startCol, startRow, url) {

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
	var content =   '<li id="' + id + '" data-com="' + com + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content blank"><a class="button lightText large square white" data-defaultClass="white" href="javascript:void(0);">SAS</a></div></li>';

	content = { html: content, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);

	// Adds a keyboard hook that sends a command
	MKON.CONTENT.addHook(id, 't', function() { MKON.COMMS.command(com[0]); });
}