function init(startCol, startRow, url) {

	var id = MKON.FNC.randomString(5)	
	var req = ['p.paused', 'v.name'];

	// register a new module
	var mod = new MKON.module('Connection Status', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		var i = t.find('.data-connection');
		var s = t.find('.data-status');

		var p =  MKON.CONTENT.getVariable(req[0]) || 0;
		var l = s.attr('data-last'); 

		// if the cached status differs from the retrieved one
		if (p != l) {

		// strip existing indicator colours
		i.removeClass('red green orange');
		s.html('CONNECTED');

			if (p == 0) {

				// game playing
				i.addClass('green');
				s.html('CONNECTED');	

			} else if (p == 1) { //

				// game paused
				i.addClass('orange');
				s.html('PAUSED');			
				
			} else if (p == 3) { //

				s.html('NO SIGNAL');		
				
			} else { // no power or no antenna	

				
				// no connection
				i.addClass('red');
				s.html('ERROR');	
			}

			s.attr('data-last', p);

		}
		




		// var oV = MKON.CONTENT.getVariable(req[1]) || 0;
		// var alt = MKON.CONTENT.getVariable(req[2]) || 0;

		// oV = MKON.FNC.toFixed( oV , 1);
		// sV = MKON.FNC.toFixed( sV , 1);

		

		// if (alt > 35000) {
		// 	t.find('.data-v').html(oV + 'm/s');
		// 	t.find('.data-title').html('ORBIT');
		// } else {
		// 	t.find('.data-v').html(sV + 'm/s');
		// 	t.find('.data-title').html('SURFACE');
		
		// }

	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content"><div class="connection screen data-connection"><div class="indicator green data-indicator"><span class="inner"><span class="highlight"></span></span></div><h3 class="data-status">CONNECTED</h3></div></li>';

	content = { html: content, x: 2, y: 2, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);


	// for (var i=0; i<req.length; i++) {
	// 	addVariables( [ mod.req[i] ] );
	// }

	//updateAPIString();
}

