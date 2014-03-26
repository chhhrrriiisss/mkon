function init(startCol, startRow, url) {

	// var id = MKON.FNC.randomString(5)	
	// var req = ['v.lightValue', 'light'];

	// // register a new module
	// var mod = new MKON.module('Light', 'Button', id, function() {   

	// 	var t = $('#'+this.id);

	// 	var d = MKON.CONTENT.getVariable(req[1]);	
	// 	console.log(d);

	// 	if (d == 'True') {
	// 		t.find('.button').removeClass('gray');
		
	// 	} else {
	// 		t.find('.button').addClass('gray');
	
	// 	}
	
	// } );

	// content for insertion to gridster	
	var content = '<li class="blank"  data-col="1" data-sizex="1" data-sizey="1">\
				   <div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
				   </li>';

	content = { html: content, x: 1, y: 1, col: startCol, row: startRow };

	MKON.CONTENT.addModule('', content);
	
}

