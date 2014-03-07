function init(startCol, startRow, url) {

	var id = MKON.FNC.randomString(5)	
	// var req = ['v.rcsValue', 'rcs'];
	var com = ['f.brake'];

	// register a new module
	var mod = new MKON.module('Brakes', 'Button', id, ['',''],

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
					<div class="content blank"><a class="button lightText large square red" data-defaultClass="red" href="javascript:void(0);">BRK</a></div></li>';

	content = { html: content, x:1, y:1, col: startCol, row: startRow };
	
	MKON.CONTENT.addModule(mod, content);

	MKON.CONTENT.addHook(id, 'b', function() { MKON.COMMS.command(com[0]); });
	// 
	// updateAPIString();
}