function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['v.altitude'];


	// register a new module
	var mod = new MKON.module('Altitude Screen', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		
		var alt =  MKON.CONTENT.getVariable(req)	
		
		var unit = 'm';

		if (alt > 999999) {
			alt = alt/1000;
			unit = 'k';			
		}

		alt = MKON.FNC.toFixed( alt , 0);		

		alt = MKON.FNC.zeroPad(parseFloat(alt), 6);


		var output = [];

		for (var i = 0; i < alt.length; i ++) {
			output.push(alt.charAt(i));	
		}

		//console.log(output.length + ' ' + output);

		for (var i = 0; i<output.length; i++) {

			var c = getClass(output[i]);	
			var slot = t.find('.slot' + i);
			var last = slot[0].getAttribute('data-last');
			slot.removeClass(last);
			slot.addClass(c);
			slot.attr('data-last', c);
		}

		if (unit == 'k') {
			t.find('.distance').removeClass('m');
			t.find('.distance').addClass('k');
		} else {
			t.find('.distance').removeClass('k');
			t.find('.distance').addClass('m');
		}
	
		
		function getClass(num) {
			var number;
			switch(num)
			{
				case "1":
				number = "one";
				break;

				case "2":
				number = "two";
				break;

				case "3":
				number = "three";
				break;

				case "4":
				number = "four";
				break;

				case "5":
				number = "five";
				break;

				case "6":
				number = "six";
				break;

				case "7":
				number = "seven";
				break;

				case "8":
				number = "eight";
				break;

				case "9":
				number = "nine";
				break;

				default:
				number = "zero";
			}
			
			return number;
		}




	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content blank"><div class="content blank"><div class="screen"><div class="altitude data-alt">\
					<span class="slot0 number n" data-last=""></span>\
                        <span class="slot1 number n" data-last=""></span>\
                        <span class="slot2 number n" data-last=""></span>\
                        <span class="slot3 number n" data-last=""></span>\
                        <span class="slot4 number n" data-last=""></span>\
                        <span class="slot5 number n" data-last=""></span>\
                        <span class="distance n m"></span>\
                        </div></div></div></div></li>';



	content = { html: content, x:3, y:1, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	;
	//updateAPIString();
}

