function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['p.paused', 'v.name'];

	// register a new module
	var mod = new MKON.module('Connection Status', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		var i = t.find('.data-connection');
		var s = t.find('.data-status');

		var p =  MKON.CONTENT.getVariable(req[0]) || 0;
		var l = s[0].getAttribute('data-last'); 

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
				
			} else if (p == 2) {

				s.html('NO POWER');	

			} else if (p == 3) { //

				s.html('NO SIGNAL');		
				
			} else { // no power or no antenna	
				
				// no connection
				i.addClass('red');
				s.html('ERROR');	
			}

			s.attr('data-last', p);

		}
		
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content"><div class="connection screen data-connection"><div class="radio"></div><div class="indicator green data-indicator"><span class="inner"><span class="highlight"></span></span></div><h3 class="data-status">NO SIGNAL</h3></div></li>';

	content = { html: content, x: 2, y: 2, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

}
