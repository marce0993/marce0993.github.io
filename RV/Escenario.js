<!DOCTYPE html>
<html lang="en">
	<head>
		<title>three.js webvr - video</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
		<style>
			body {
				font-family: Monospace;
				background-color: #f0f0f0;
				margin: 0px;
				overflow: hidden;
			}
			#info {
				position: absolute;
				top: 10px;
				width: 100%;
				color: #fff;
				text-align: center;
			}
			a {
				color: #ff0
			}
		</style>
	</head>
	<body>
		<div id="container"></div>
		<div id="info">
			<a href="http://threejs.org" target="_blank">three.js</a> webgl - vr video<br />
			stereoscopic panoramic render by <a href="http://pedrofe.com/rendering-for-oculus-rift-with-arnold/" target="_blank">pedrofe</a>. scene from <a href="http://www.meryproject.com/" target="_blank">mery project</a>.
		</div>

		<script src="../build/three.js"></script>

		<script src="js/WebVR.js"></script>
		<script src="js/effects/VREffect.js"></script>
		<script src="js/controls/VRControls.js"></script>

		<script>
			if ( WEBVR.isLatestAvailable() === false ) {
				document.body.appendChild( WEBVR.getMessage() );
			}
			//
			var camera, scene, renderer;
			var video, texture;
			var controls, effect;
			init();
			animate();
			function init() {
				var container = document.getElementById( 'container' );
				container.addEventListener( 'click', function () {
					video.play();
				} );
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 2000 );
				camera.layers.enable( 1 ); // render left view when no stereo available
				// video
				video = document.createElement( 'video' );
				video.loop = true;
				video.muted = true;
				video.src = 'textures/MaryOculus.webm';
				video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
				video.play();
				texture = new THREE.VideoTexture( video );
				texture.minFilter = THREE.NearestFilter;
				texture.maxFilter = THREE.NearestFilter;
				texture.format = THREE.RGBFormat;
				texture.generateMipmaps = false;
				scene = new THREE.Scene();
				// left
				var geometry = new THREE.SphereGeometry( 500, 60, 40 );
				geometry.scale( - 1, 1, 1 );
				var uvs = geometry.faceVertexUvs[ 0 ];
				for ( var i = 0; i < uvs.length; i ++ ) {
					for ( var j = 0; j < 3; j ++ ) {
						uvs[ i ][ j ].x *= 0.5;
					}
				}
				var material = new THREE.MeshBasicMaterial( { map: texture } );
				var mesh = new THREE.Mesh( geometry, material );
				mesh.rotation.y = - Math.PI / 2;
				mesh.layers.set( 1 ); // display in left eye only
				scene.add( mesh );
				// right
				var geometry = new THREE.SphereGeometry( 500, 60, 40 );
				geometry.scale( - 1, 1, 1 );
				var uvs = geometry.faceVertexUvs[ 0 ];
				for ( var i = 0; i < uvs.length; i ++ ) {
					for ( var j = 0; j < 3; j ++ ) {
						uvs[ i ][ j ].x *= 0.5;
						uvs[ i ][ j ].x += 0.5;
					}
				}
				var material = new THREE.MeshBasicMaterial( { map: texture } );
				var mesh = new THREE.Mesh( geometry, material );
				mesh.rotation.y = - Math.PI / 2;
				mesh.layers.set( 2 ); // display in right eye only
				scene.add( mesh );
				//
				renderer = new THREE.WebGLRenderer();
				renderer.setClearColor( 0x201020 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild( renderer.domElement );
				//
				controls = new THREE.VRControls( camera );
				effect = new THREE.VREffect( renderer );
				effect.scale = 0; // video doesn't need eye separation
				effect.setSize( window.innerWidth, window.innerHeight );
				if ( WEBVR.isAvailable() === true ) {
					document.body.appendChild( WEBVR.getButton( effect ) );
				}
				//
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				effect.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				effect.requestAnimationFrame( animate );
				render();
			}
			function render() {
				controls.update();
				effect.render( scene, camera );
			}
		</script>
	</body>
</html>
