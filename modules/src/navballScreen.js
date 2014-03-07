function init(startCol, startRow, url) {

	var id = MKON.FNC.randomString(5)	
	var req = ['n.rawheading', 'n.rawpitch', 'n.rawroll'];
	var sphere;
	var lines = [];
	var guides;
	this.isWebGL = function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } },

	function radToDeg(val) {
		val = val * (180 / Math.PI);
		return -val;		
	}


	function degToRad(val) {

		var rads = val * (Math.PI / 180);
		return rads;
	}


	var targetSpherePitch, targetSphereHeading, targetSphereRoll;
	// register a new module
	var mod = new MKON.module('Navball', 'Screen', id, req,

	function() {   

		var t = $('#'+this.id);	
		targetSphereHeading = MKON.CONTENT.getVariable(req[0]);
		targetSpherePitch = MKON.CONTENT.getVariable(req[1]);
		targetSphereRoll = MKON.CONTENT.getVariable(req[2]);	
	} );

	// content for insertion to gridster
	var content =   '<li id="' + id + '" data-row="1" data-col="1" data-link="' + url + '" data-sizex="1" data-sizey="1">\
					<div class="options"><div class="remove"><i class="fa fa-times"></i></div></div>\
					<div class="content blank"><div class="navball screen"><div class="navballPointer"></div><div class="navballOutside"></div><div id="sphere" class="sphere"></div></div></div></li>';

	content = { html: content, x:3, y:3, col: startCol, row: startRow };

	MKON.CONTENT.addModule(mod, content);

	;
	
	//updateAPIString();

	// standard global variables
	var container, scene, camera, renderer, controls, stats;

	// custom global variables
	var mesh;

	initSphere();
	animate();

	// FUNCTIONS 		
	function initSphere() 
	{
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var VIEW_ANGLE = 45, ASPECT = 400 / 400, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0,0,-150);
	
	camera.lookAt(scene.position);	
	camera.rotation.z = 0;

	// RENDERER
	if (this.isWebGL()) {
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	}
	else {
		renderer = new THREE.CanvasRenderer(); 
	}
	renderer.setSize(290, 290);

	container = document.getElementById( 'sphere' );
	container.appendChild( renderer.domElement );

	// // LIGHT
	// var light = new THREE.PointLight(0xffffff);
	// light.position.set(0,2000,0);
	// scene.add(light);


	guides = new THREE.Object3D();


	var r = 49.99;

	// Sphere parameters: radius, segments along width, segments along height.
	var geometry = new THREE.SphereGeometry(r,49.99,49.99);
	var texture = THREE.ImageUtils.loadTexture('img/navballTexture_10_low.jpg');
	texture.needsUpdate = true;
	// var material = new THREE.MeshPhongMaterial({
	// 										map: texture,
	// 										specular: 0x222222,
	// 										shininess: 100
	// 									});
	
	// to help orient
	var N = new THREE.Vector3(0, r, 0);
	var S1 = new THREE.Vector3(0.01, -r, 0);
	var S2 = new THREE.Vector3(-0.01, -r, 0);
	var S3 = new THREE.Vector3(0, -r, 0.01);
	var S4 = new THREE.Vector3(0, -r, -0.01);


		var val = Math.sin(45) * r;

	var E = new THREE.Vector3(r, 0, 1);
	var W1 = new THREE.Vector3(-val, 0, 0);
	var W2 = new THREE.Vector3(-val, 0, 0);	

	var SW = new THREE.Vector3(-0.01, -r, -0.01);
	var SE = new THREE.Vector3(0.01, -r, -0.01);
	var NW = new THREE.Vector3(-0.01, -r, 0.01);
	var NE = new THREE.Vector3(0.01, -r, 0.01);

	// var val = Math.sin(45) * r;
	// var TEST = new THREE.Vector3(val, val, 0);
	// var TEST2 = new THREE.Vector3(-val, val, 0.01);
	// var TEST3 = new THREE.Vector3(-val, val, -0.01);

	drawCurve( createSphereArc(N,S1), new THREE.Color(0xffffff), 1 ); // East
	drawCurve( createSphereArc(N,S2), new THREE.Color(0xffffff), 1 ); // West
	drawCurve( createSphereArc(N,S3), new THREE.Color(0xffffff), 1 ); // North
	drawCurve( createSphereArc(N,S4), new THREE.Color(0xff6600), 1 ); // South
	drawCurve( createSphereArc(N,SW), new THREE.Color(0xffffff), 0.4 ); // South West
	drawCurve( createSphereArc(N,SE), new THREE.Color(0xffffff), 0.4 ); // South West
	drawCurve( createSphereArc(N,NW), new THREE.Color(0xffffff), 0.4 ); // North West
	drawCurve( createSphereArc(N,NE), new THREE.Color(0xffffff), 0.4 ); // North East


	var midRadius = Math.cos( degToRad(45) ) * r;

	// 45 degree markers
	drawCircle(midRadius, -midRadius*1.01, 0xffffff, 0.4); // north hs
	drawCircle(midRadius, midRadius*1.01, 0xffffff, 0.4);  // south hss

	var pos = new THREE.Vector3(0, -50, 0);

	createText('270', 4,
	-48, 0, 5, //position xyz
	0, degToRad(-90), degToRad(180),  //rotation xyz
	1, 0xffffff, 1);

	createText('225', 4,
	-37, 0, -31, //position xyz
	0,degToRad(225) , degToRad(180),  //rotation xyz
	1, 0xffffff, 1);

	createText('90', 4,
	48, 0, -3, //position xyz
	0, degToRad(90), degToRad(-180),  //rotation xyz
	1, 0xffffff, 1);

	createText('N', 4,
	1.5, -4, -48, //position xyz
	0, degToRad(180), 0,  //rotation xyz
	1, 0xffffff, 1);

	createText('135', 4,
	38, 0, 30, //position xyz
	0, degToRad(45), degToRad(180),  //rotation xyz
	1, 0xffffff, 1);

	createText('180', 4,
	5, -1, 48, //position xyz
	0, 0, degToRad(180),  //rotation xyz
	1, 0xffffff, 1);

	var material = new THREE.MeshBasicMaterial({map: texture});
	// var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: false, transparent: false } );
	sphere = new THREE.Mesh( geometry, material );
	scene.add(sphere);
	scene.add(guides);

	

	// var material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, transparent: true } );
	// mesh2 = new THREE.Mesh( geometry, material );
	// scene.add(mesh2);
	

	} 
	function drawCircle (radius, position, color, opacity) {

		var segmentCount = 32,
		radius = radius,	
		geometry = new THREE.Geometry(),
		material = new THREE.LineBasicMaterial({ color: color, opacity: opacity, transparent:true });

		for (var i = 0; i <= segmentCount; i++) { 
			var theta = (i / segmentCount) * Math.PI * 2;	
			geometry.vertices.push(	new THREE.Vector3(Math.cos(theta) * radius,Math.sin(theta) * radius, 0));        
		}

		var circle = new THREE.Line(geometry, material);
		circle.position.set(0,position,0);
		circle.rotation.set(degToRad(90), 0, 0);
		guides.add(circle);
	}
	
	function createText(text, size, px, py, pz, rx, ry, rz, color, opacity) {

		var textGeo = new THREE.TextGeometry( text, {

			size: size,
			color: 0xffffff,
			height: size/2,	
			curveSegments: 0,
			font: "helvetiker"

		});


		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();

		var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

		var textMesh = new THREE.Mesh( textGeo, material );



		textMesh.position.set(px, py, pz);
		textMesh.rotation.set(rx, ry, rz);
		guides.add(textMesh);
	}


	// some methods to create and draw great circles on a sphere
	function greatCircleFunction(P, Q)
	{
		var angle = P.angleTo(Q);
		return function(t)
		{
		    var X = new THREE.Vector3().addVectors(
				P.clone().multiplyScalar(Math.sin( (1 - t) * angle )), 
				Q.clone().multiplyScalar(Math.sin(      t  * angle )))
				.divideScalar( Math.sin(angle) );
		    return X;
		};
	}

	function createSphereArc(P,Q)
	{
		var sphereArc = new THREE.Curve();
		sphereArc.getPoint = greatCircleFunction(P,Q);
		return sphereArc;
	}


	function drawCurve(curve, color, opacity)
	{
		var lineGeometry = new THREE.Geometry();
		lineGeometry.vertices = curve.getPoints(100);
		lineGeometry.computeLineDistances();
		var lineMaterial = new THREE.LineBasicMaterial( { color: color, opacity: opacity, transparent: true } );
		var line = new THREE.Line( lineGeometry, lineMaterial );
		line.rotation.set(0,0,0);
		lines.push(line);
		guides.add(line);
	}


	function animate() {

	    setTimeout( function() {

	        requestAnimationFrame( animate );

	    }, 1000 / 30 );

	    render();
	    update();

	}

	function update()
	{



		euler = new THREE.Euler(
				degToRad( 360 - targetSpherePitch), // pitch
				degToRad(targetSphereHeading), // heading
				degToRad(targetSphereRoll), // roll
				'ZXY'
		);		

		var q = new THREE.Quaternion().setFromEuler( euler );

		var newQuaternion = new THREE.Quaternion();

		THREE.Quaternion.slerp( sphere.quaternion, q, newQuaternion, 0.4 );

		sphere.quaternion = guides.quaternion = newQuaternion;
		// mesh.quaternion.multiplySelf( newQuaternion );
		sphere.quaternion.normalize();
		guides.quaternion.normalize();
		// sphere.rotation.copy(euler);
		// guides.rotation.copy(euler);
	

	//


		

	}

	function render() 
	{	
		renderer.render( scene, camera );
	}


}

