
function init(config) {  

	var url = config.u;
	var col = config.c || MKON.LAYOUT.defaultCol;
	var row = config.r || MKON.LAYOUT.defaultRow;
	var meta = config.m || '';
	var width = config.w;
	var height = config.h;

	var id = MKON.FNC.randomString(5)	
	var req = ['o.ApA', 'o.PeA', 'o.trueAnomaly','o.eccentricity','v.body'];

	// register a new module
	var mod = new MKON.module('Mini-Map', 'Screen', id, req,

	//handle data function
	function() {   
		function drawEllipse(ctx, x0, y0, a, exc, lineWidth, color) {
			x0 += a * exc;
			var r = a * (1 - exc*exc)/(1 + exc)
			var x = x0 + r;
			var y = y0;
			ctx.beginPath();
			ctx.moveTo(x, y);
			var i = 0;
			var twoPi = 2 * Math.PI;
			while (i < twoPi) {
				r = a * (1 - exc*exc)/(1 + exc * Math.cos(i));
				x = x0 + r * Math.cos(i);
				y = y0 + r * Math.sin(i);
				ctx.lineTo(x, y);
				i += 0.01 * Math.PI;
			}
			ctx.lineWidth = lineWidth;
			ctx.strokeStyle = color;
			ctx.closePath();
			ctx.stroke();
		}
		
		//draw the ship icons
		function drawShip(ctx, x0, y0, a, exc, angle) {
			x0 += a * exc;
			var r = a * (1 - exc*exc)/(1 + exc * Math.cos(angle));
			var x = x0 + r * Math.cos(angle); //center icon on the line
			var y = y0 + r * Math.sin(angle); //center icon on the line
			
			// No need for a bitmap! Go vectors!
			ctx.save();
			ctx.translate(x, y);
			var grd=ctx.createLinearGradient(-6,-1,7,-1);grd.addColorStop(0,"rgba(59,176,42,1)");grd.addColorStop(.2795698928833008,"rgba(175,250,61,1)");grd.addColorStop(.6881719970703125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(59,176,42,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(-5,0);ctx.lineTo(-1,-6);ctx.lineTo(-1,-9);ctx.lineTo(2,-9);ctx.lineTo(2,-6);ctx.lineTo(6,0);ctx.bezierCurveTo(6,0,8,2,6,4);ctx.lineTo(5,5);ctx.lineTo(-4,5);ctx.bezierCurveTo(-4,5,-5,4,-5,3);ctx.bezierCurveTo(-5,3,-6,1,-5,0);ctx.fill();ctx.fillStyle="rgb(153,153,153)";ctx.beginPath();ctx.moveTo(1,0);ctx.bezierCurveTo(1,0,1,1,0,1);ctx.lineTo(-1,0);ctx.bezierCurveTo(-1,-2,0,-3,0,-3);ctx.bezierCurveTo(1,-3,1,-2,1,0);ctx.fill();ctx.fillStyle="rgb(188,210,187)";ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(0,0);ctx.lineTo(0,0);ctx.bezierCurveTo(0,-1,0,-1,0,-1);ctx.bezierCurveTo(0,-1,1,-1,1,0);ctx.fill();ctx.fillStyle="rgb(105,202,44)";ctx.fillRect(-1,-6,4,0);ctx.fill()
			ctx.restore();

		}
		
		//draw ap and pe icons
		function drawApAndPe(ctx,a) {

			//Pe
			x = a; //center icon
			y = 0; //center icon

			// No need for a bitmap! Go vectors!
			ctx.save();
			ctx.translate(x, y);
			var grd=ctx.createLinearGradient(13,8,13,-11);grd.addColorStop(0,"rgba(113,162,40,1)");grd.addColorStop(.10752686500549316,"rgba(175,250,61,1)");grd.addColorStop(.9032257080078125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(113,162,40,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(27,-10);ctx.lineTo(11,-10);ctx.lineTo(0,0);ctx.lineTo(11,9);ctx.lineTo(27,9);ctx.lineTo(27,-10);ctx.fill();ctx.fillStyle="rgb(0,0,0)";ctx.beginPath();ctx.moveTo(17,-3);ctx.lineTo(17,-1);ctx.bezierCurveTo(17,0,17,0,15,0);ctx.lineTo(14,0);ctx.lineTo(14,4);ctx.lineTo(12,4);ctx.lineTo(12,-5);ctx.lineTo(15,-5);ctx.bezierCurveTo(17,-5,17,-4,17,-3);ctx.fill();var grd=ctx.createLinearGradient(14,-2,15,-2);grd.addColorStop(0,"rgba(113,162,40,1)");grd.addColorStop(.10752686500549316,"rgba(175,250,61,1)");grd.addColorStop(.9032257080078125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(113,162,40,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(14,-4);ctx.lineTo(14,0);ctx.lineTo(15,0);ctx.bezierCurveTo(15,0,16,0,16,-1);ctx.lineTo(16,-3);ctx.bezierCurveTo(16,-4,15,-4,15,-4);ctx.lineTo(14,-4);ctx.fill();ctx.fillStyle="rgb(0,0,0)";ctx.beginPath();ctx.moveTo(20,-1);ctx.lineTo(22,-1);ctx.lineTo(22,0);ctx.lineTo(20,0);ctx.lineTo(20,3);ctx.lineTo(23,3);ctx.lineTo(23,4);ctx.lineTo(18,4);ctx.lineTo(18,-5);ctx.lineTo(23,-5);ctx.lineTo(23,-4);ctx.lineTo(20,-4);ctx.lineTo(20,-1);ctx.fill()
			ctx.restore();

			//Ap
			x = -a; //center icon
			y = 0; //center icon

			// No need for a bitmap! Go vectors!
			ctx.save();
			ctx.translate(x, y);
			var grd=ctx.createLinearGradient(-13,9,-12,-10);grd.addColorStop(0,"rgba(113,162,40,1)");grd.addColorStop(.10752686500549316,"rgba(175,250,61,1)");grd.addColorStop(.9032257080078125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(113,162,40,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(-27,-10);ctx.lineTo(-11,-10);ctx.lineTo(0,0);ctx.lineTo(-11,9);ctx.lineTo(-27,9);ctx.lineTo(-27,-10);ctx.fill();ctx.fillStyle="rgb(0,0,0)";ctx.beginPath();ctx.moveTo(-17,4);ctx.lineTo(-19,4);ctx.lineTo(-19,2);ctx.lineTo(-21,2);ctx.lineTo(-22,4);ctx.lineTo(-23,4);ctx.lineTo(-21,-5);ctx.lineTo(-19,-5);ctx.lineTo(-17,4);ctx.fill();var grd=ctx.createLinearGradient(-21,-1,-19,-1);grd.addColorStop(0,"rgba(113,162,40,1)");grd.addColorStop(.10752686500549316,"rgba(175,250,61,1)");grd.addColorStop(.9032257080078125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(113,162,40,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(-21,1);ctx.lineTo(-19,1);ctx.lineTo(-20,-3);ctx.lineTo(-21,1);ctx.fill();ctx.fillStyle="rgb(0,0,0)";ctx.beginPath();ctx.moveTo(-12,-3);ctx.lineTo(-12,-1);ctx.bezierCurveTo(-12,0,-13,0,-14,0);ctx.lineTo(-15,0);ctx.lineTo(-15,4);ctx.lineTo(-17,4);ctx.lineTo(-17,-5);ctx.lineTo(-14,-5);ctx.bezierCurveTo(-13,-5,-12,-4,-12,-3);ctx.fill();var grd=ctx.createLinearGradient(-15,-2,-13,-2);grd.addColorStop(0,"rgba(113,162,40,1)");grd.addColorStop(.10752686500549316,"rgba(175,250,61,1)");grd.addColorStop(.9032257080078125,"rgba(175,250,61,1)");grd.addColorStop(1,"rgba(113,162,40,1)");ctx.fillStyle=grd;ctx.beginPath();ctx.moveTo(-15,-4);ctx.lineTo(-15,0);ctx.lineTo(-14,0);ctx.bezierCurveTo(-14,0,-13,0,-13,-1);ctx.lineTo(-13,-3);ctx.lineTo(-14,-4);ctx.lineTo(-15,-4);ctx.fill();
			ctx.restore();

		}
		
		// I could use telemachus to get them but... 
		// It is much more simple like this...
		function getVBodyRadius(vbody) {
			var bodies = [["Sun",261600000],["Kerbin",600000],["Mun",200000],["Minmus",60000],["Eve",700000],["Gilly",13000],["Moho",250000],["Duna",320000],["Dres",138000],["Jool",6000000],["Laythe",500000],["Vall",300000],["Tylo",600000],["Bop",65000],["Pol",44000],["Eeloo",138000],["Ike",130000]];
			for (i = 0; i < bodies.length; i++) { 
				if (vbody === bodies[i][0]) {
					return bodies[i][1];
				}
			}
			return 0;
		}
		function getVBodyAtmo(vbody) {
			var bodies = [["Sun",0],["Kerbin",69077],["Mun",0],["Minmus",0],["Eve",96708],["Gilly",0],["Moho",0],["Duna",202650],["Dres",0],["Jool",138155],["Laythe",55262],["Vall",0],["Tylo",0],["Bop",0],["Pol",0],["Eeloo",0],["Ike",0]]; //data from the official wiki
			for (i = 0; i < bodies.length; i++) { 
				if (vbody === bodies[i][0]) {
					return bodies[i][1];
				}
			}
			return 0;
		}
		var t = $('#'+this.id);
		var maxradius=170; //this is the max radius of the drawn orbit.
	
		var Plane = document.getElementById("canvas"+this.id);
		var Context = Plane.getContext('2d');

		var apo = MKON.CONTENT.getVariable(req[0]);
		var per = MKON.CONTENT.getVariable(req[1]);
		var trueano = MKON.CONTENT.getVariable(req[2]);
		var ecc = MKON.CONTENT.getVariable(req[3]);
		var body = MKON.CONTENT.getVariable(req[4]) || 'NOTHING';
		
		var bodyradius = getVBodyRadius(body);
		var bodyradiuswithatmo = bodyradius + getVBodyAtmo(body);

		var ratio = (2*maxradius / (per + apo + (2*bodyradius))); //do not round this 
		var shipangle = -(trueano/190)* Math.PI; //in radians

		Context.save();
		//clear the context
		Context.clearRect(0,0,400,400);
		Context.translate(200,200);
			
		if (ecc < 1) { //The Orbit is closing... or at least not (hyper/para)boloid
			//Draw the Orbit
			drawEllipse(Context,0,0,maxradius,ecc,1,"YellowGreen"); 
			//Draw the body
			drawEllipse(Context,ecc*maxradius,0,bodyradius*ratio,0,0.5,"White");
			drawEllipse(Context,ecc*maxradius,0,bodyradiuswithatmo*ratio,0,0.1,"LightBlue");
			//Draw the Ship
			drawShip(Context,0,0,maxradius,ecc,shipangle);
			//Draw the cute Ap and Pe icons
			drawApAndPe(Context,maxradius);
			
			Context.fillStyle = "lightgrey";
			Context.font = "15pt BebasNeue";
			Context.translate(-200,-180);
			Context.fillText("ORBITING " + body,0,0);
		} else {
			Context.fillStyle = "lightgrey";
			Context.font = "15pt BebasNeue";
			Context.translate(-200,-180);
			Context.fillText("paraboloid orbits not yet implemented...",0,0);
		}
		Context.restore();
	}
	);

	// content for insertion to gridster
	// I need the canvas to have fixed height and width...
	// I load image there to avoid multiple loadings...
	var content =  '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="4" data-sizey="4">\
						<div class="options">\
							<div class="remove"><i class="fa fa-close"></i>\
							</div>\
						</div>\
						<div class="content">\
							<div class="mini-map screen">\
								<script>\
									minimapicons = new Image();\
									minimapicons.src = "./img/minimapicons.png";\
								</script>\
								<canvas class="mapcanvas" id="canvas'+ id + '" height="400" width="400"></canvas>\
								<h3>MINI-MAP</h3>\
								</div>\
							</div>\
						</div>\
					</li>';

	content = { html: content, x:4, y:4, col: col, row: row };

	MKON.CONTENT.addModule(mod, content);
}
