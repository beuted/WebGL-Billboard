		
			//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container, stats;
			var camera, controls, clock, scene, sceneSnow, sceneFloor, sceneEyes, renderer, composer, particles, geometry, materials = [], parameters, i, h, color, sprite, size;
			var particleCount = 2000;
			var weather = 0;
			var mouseX = 0, mouseY = 0;
			
			var WIDTH = window.innerWidth;
			var HEIGHT = window.innerHeight;
			
			var windowHalfX = window.innerWidth / 2; //TODO : DOUBLON
			var windowHalfY = window.innerHeight / 2;
			
			// Creation of the hero object
			var hero = new Hero("beuted");
			
			// Creation of the map object
			var map = new Map("test");
			
			// Creation of night effects
			var nightEffects = new NightEffects(new THREE.Vector3(100,100,100));

			/*init();
			animate();*/

			
			$(document).ready(function() {

				var blocker = document.getElementById( 'blocker' );
				var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

				if ( havePointerLock ) {

				var element = document.body;

				var pointerlockchange = function ( event ) {

					if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					controls.enabled = true;

					blocker.style.display = 'none';

					} else {

					controls.enabled = false;

					blocker.style.display = '-webkit-box';
					blocker.style.display = '-moz-box';
					blocker.style.display = 'box';

					instructions.style.display = '';

					}

				}

				var pointerlockerror = function ( event ) {

					instructions.style.display = '';

				}

				// Hook pointer lock state change events
				document.addEventListener( 'pointerlockchange', pointerlockchange, false );
				document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
				document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

				document.addEventListener( 'pointerlockerror', pointerlockerror, false );
				document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
				document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.addEventListener( 'click', function ( event ) {

					instructions.style.display = 'none';

					// Ask the browser to lock the pointer
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

					if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

					} else {

					element.requestPointerLock();

					}

				}, false );

				} else {

				instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

				}
				

				init();
				setInterval(test, 1000);
				animate();
				/*
				  new t.ColladaLoader().load('models/Yoshi/Yoshi.dae', function(collada) {
				  model = collada.scene;
				  skin = collada.skins[0];
				  model.scale.set(0.2, 0.2, 0.2);
				  model.position.set(0, 5, 0);
				  scene.add(model);
				  });
				*/
			});
			
			function test() {}

			function init() {

				clock = new THREE.Clock();
			
				container = document.createElement( 'div' );
				document.body.appendChild( container );
	
				scene = new THREE.Scene();
				sceneFloor = new THREE.Scene();
				sceneSnow = new THREE.Scene();
				sceneEyes = new THREE.Scene();
				
				scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );
				sceneFloor.fog = new THREE.FogExp2( 0x000000, 0.0008 );
				sceneSnow.fog = new THREE.FogExp2( 0x000000, 0.0020 );
				
				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 10000 );
				//camera.position.z = 1000;

				controls = new THREE.PointerLockControls( hero, camera );
				
				scene.add(controls.getObject());
				
				geometry = new THREE.Geometry();

				sprite1 = THREE.ImageUtils.loadTexture( "images/sprites/snowflake1.png" );
				sprite2 = THREE.ImageUtils.loadTexture( "images/sprites/snowflake2.png" );
				sprite3 = THREE.ImageUtils.loadTexture( "images/sprites/snowflake3.png" );
				sprite4 = THREE.ImageUtils.loadTexture( "images/sprites/snowflake4.png" );
				sprite5 = THREE.ImageUtils.loadTexture( "images/sprites/snowflake5.png" );

				for ( i = 0; i < particleCount; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 1000 - 500;
					vertex.y = Math.random() * 1000 - 500;
					vertex.z = Math.random() * 1000 - 500;

					geometry.vertices.push( vertex );
				}

				parameters = [ [ [1.0, 0.2, 0.5], sprite2, 20 ],
							   [ [0.98, 0.1, 0.5], sprite3, 15 ],
							   [ [0.93, 0.05, 0.5], sprite1, 10 ],
							   [ [0.90, 0, 0.5], sprite5, 8 ],
							   [ [0.88, 0, 0.5], sprite4, 5 ],
							   ];

				for (k = 1; k <= 3; k++) {
					for ( i = 0; i < parameters.length; i ++ ) {

						color  = parameters[i][0];
						sprite = parameters[i][1];
						size   = parameters[i][2];

						materials[i] = new THREE.ParticleSystemMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
						materials[i].color.setHSL( color[0], color[1], color[2] );

						particles = new THREE.ParticleSystem( geometry, materials[i] );

						particles.rotation.x = Math.random() * 6;
						particles.rotation.y = Math.random() * 6;
						particles.rotation.z = Math.random() * 6;
						
						particles.position.y = k*1000 +500;

						sceneSnow.add( particles );

					}
				}

				
				// Track mouse position so we know where to shoot
				//document.addEventListener( 'mousemove', onDocumentMouseMove, false ); //TODO : VIRER ?
				
				//renderer = new THREE.WebGLRenderer( { clearAlpha: 1 } );
				//renderer.setSize( window.innerWidth, window.innerHeight );
				//container.appendChild( renderer.domElement );

				//Add objects to the scene
				var cube = new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() );
				cube.position.y = 150;
				//scene.add( cube );
				
				// Add the floor
				var matFloor = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture("images/sprites/snow.png") , transparent: true, side: THREE.DoubleSide});
				var floor = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000), matFloor);
				var orientation = new THREE.Matrix4();
				orientation.makeRotationFromEuler(new THREE.Euler( Math.PI/2, 0, 0, "YXZ" ));//rotate on X 90 degrees
				orientation.setPosition(new THREE.Vector3(5000,-500,5000));//move half way on Z, since default pivot is at centre
				floor.applyMatrix(orientation);//apply transformation for geometry
				sceneFloor.add( floor );
				
				// Addbillboard
				map.init(10,0);
				map.setup(scene, controls);
				
				// Add all fixed effects other than snow like eyes in the dark
				nightEffects.init(10,0);
				nightEffects.setup(sceneEyes, controls);
				
			    // Directional lighting
				var directionalLight = new THREE.DirectionalLight(0x868686);
				directionalLight.position.set(1, 1, 1).normalize();
				scene.add(directionalLight);
				var ambientLight = new THREE.AmbientLight(0x464646);
				scene.add(ambientLight);

				// Handle drawing as WebGL (faster than Canvas but less supported)
				renderer = new THREE.WebGLRenderer();
				renderer.setSize(WIDTH, HEIGHT);
				renderer.autoClear = false;
				
				// Add the canvas to the document
				renderer.domElement.style.backgroundColor = '#D6F1FF'; // easier to see
				document.body.appendChild(renderer.domElement);
				
				// Display stats (fps, tpf...)
				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );
				
				
				
				// Initialise post processing (shaders ...)
				initPostProcessing(); 

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			/*function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}*/

			/*function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}*/

			/*function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}*/

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				nightEffects.update(hero);
				stats.update();

			}

			function render() {

				var delta = clock.getDelta();
				controls.update(delta); // Move camera	
				var time = Date.now() * 0.00005;

				//camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				//camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				//camera.lookAt( scene.position );
				
				for ( i = 0; i < sceneSnow.children.length; i ++ ) {

					var object = sceneSnow.children[ i ];

					if ( object instanceof THREE.ParticleSystem ) {
						object.rotation.y = time * weather *( i < 4 ? i + 1 : ( i + 1 ) );
						//object.rotation.x = time * ( i < 4 ? i + 1 : ( i + 1 ) );
						object.position.y --;
						
						if (object.position.y < -500)
							object.position.y = 1500;//Math.random() * 2000 - 1000;
							
					}

				}

				for ( i = 0; i < materials.length; i ++ ) {

					color = parameters[i][0];

					h = ( 360 * (( color[0] + time ) % 360) ) / 360;
					materials[i].color.setHSL( h, color[1], color[2] );

				}
				
				renderer.clear(); 
				//composer.render();
				
				//render of the floor
				renderer.render(sceneFloor,camera);
				
				//render of the billboard objects
				renderer.render(scene,camera);
				
				//render of the billboard objects
				renderer.render(sceneEyes,camera);
				
				//render of the snow
				var camera2 = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 10000 );
				
				
				camera2.lookAt( controls.getDirection() );
				renderer.render(sceneSnow,camera2);
			}
			
			function checkWallCollision(o) { //TODO : test de collision a chier Three.js doit en avoir un mieux
									// Il faut aussi que ca marche avec nimporte quel objet 
									// (ex : balles) la méthode doit être plus générale
			
			/*for(var ix=-1; ix <= 1; ix+=2){
				for(var iy=-1; iy <= 1; iy+=2) {
					for(var iz=-1; iz <= 1; iz+=2) {
						// Position v is on the middle of the bottom of the hitbox (thus "/2")
						var foo = new THREE.Vector3(o.hitbox.position.x + ix*o.dimensions.x * 0.5,
										o.hitbox.position.y + iy*o.dimensions.y * 0.5, //TODO : changer ca pour l'instant les yeux sont à 50% de la taille...
										o.hitbox.position.z + iz*o.dimensions.z * 0.5);
						var c2 = getMapSector(foo);
						if(c2.x < 1 || c2.y < 1 || c2.z < 1 || c2.x > map.size[1]-1 || c2.y > map.size[0]-1 || c2.z > map.size[2]-1) {
							return true;
						}
						if (map.blocsMap[c2.y][c2.x][c2.z] > 0)
							return true;	
					}
				}
			}
			
			return false;*/
			return ((o.hitbox.position.y < 0) || map.checkTreeCollision(hero));
		}
		
		 //ADDED for post processing
		function initPostProcessing() {
			composer = new THREE.EffectComposer(renderer);
			renderModel = new THREE.RenderPass(scene,camera);
			renderModel.renderToScreen = true;
			composer.addPass(renderModel);
			
			/*var effectDotScreen = new THREE.DotScreenPass(
				new THREE.Vector2(0,0), 0.5, 0.8);
			effectDotScreen.renderToScreen = true;
			composer.addPass(effectDotScreen);*/
		} 
