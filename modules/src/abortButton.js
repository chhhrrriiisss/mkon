function init(url, col, row, meta, width, height) {

	var id = MKON.FNC.randomString(5)	
	// var req = ['v.lightValue', 'lght'];
	var com = ['f.abort'];
	
	// register a new module
	var mod = new MKON.module('Abort Button', 'Button', id, ['',''], 

	function() {   

		// var t = $('#'+this.id);

		// var d = MKON.CONTENT.getVariable(req[1]);	
	
		// if (d == 'True') {
		// 	t.find('.button').removeClass('gray');
		
		// } else {
		// 	t.find('.button').addClass('gray');
	
		// }
	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-com="' + com + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content blank"><a class="button lightText large square orange gray abort" href="javascript:void(0);"><i class="fa fa-exclamation-triangle"></i></a></div></li>';
					
	content = { html: content, x: 1, y: 1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	MKON.CONTENT.addHook(id, 'backspace', function() { MKON.COMMS.command(com[0]); });
	// 
	// updateAPIString();
}