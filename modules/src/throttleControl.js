function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5);	
	var req = ['f.throttle'];

	// register a new module
	var mod = new MKON.module('Throttle Control', 'Button', id, req,

	//handle data function
	function() {   

		var t = $('#'+this.id);

		var thr = MKON.CONTENT.getVariable(req);	

		var rot = parseFloat(thr)*180;
		var pos = 100 - (parseFloat(thr)*100);

		rot = rot + 'deg';
		pos = pos + '%';		

		if (!MKON.CONTENT.freezeData && MKON.COMMS.received) {
			t.find('.data-handle').css('top', pos);

			t.find('.data-stem').css({
				'transform': 'rotateX(' + rot + ')',
				'-webkit-transform': 'rotateX(' + rot + ')',
				'-ms-transform': 'rotateX(' + rot + ')',
				'-o-transform': 'rotateX(' + rot + ')'
			});
		}	
		}
	);

	// content for insertion to gridster
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="3" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-close"></i></div></div>\
					<div class="content blank">\
					 <div class="control throttle">\
					 <div class="bar one"></div>\
					 <div class="bar two"></div>\
					 <div class="data-stem stem one"></div>\
					 <div class="data-stem stem two"></div>\
					 <div class="data-handle handle s"></div>\
					 </div>\
					 </div>\
                	</div></li>';

	content = { html: content, x:2, y:4, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);

	MKON.CONTENT.addHook(id, 'shift', function() { MKON.COMMS.command("f.throttleUp"); });
	MKON.CONTENT.addHook(id, 'ctrl', function() { MKON.COMMS.command("f.throttleDown"); });
	MKON.CONTENT.addHook(id, 'x', function() { MKON.COMMS.command("f.throttleZero"); });
	MKON.CONTENT.addHook(id, 'z', function() { MKON.COMMS.command("f.throttleFull"); });

	$('#'+id).find('.data-handle').drags({
		axis: 'y',
		start: function() {
			MKON.CONTENT.freezeData = true;


		},
		stop: function() {
			MKON.CONTENT.freezeData = false;			
		},
		condition: function() { 
			return MKON.LAYOUT.locked;
		},
		move: function(target) {

			var parent = target.parent();
			var h = parent.outerHeight();
			var t = parseFloat( target.css('top'), 10);
			var p = MKON.FNC.toFixed( (1 - (t / h)), 2);

			var rot = parseFloat(p)*180;
			rot = rot + 'deg';

			parent.find('.data-stem').css({
				'transform': 'rotateX(' + rot + ')',
				'-webkit-transform': 'rotateX(' + rot + ')',
				'-ms-transform': 'rotateX(' + rot + ')',
				'-o-transform': 'rotateX(' + rot + ')'
			});

			MKON.COMMS.command("f.setThrottle[" + p + "]");
		},
		boundary: $('#'+id)
	});	

}