// The night effect class can create nights effects and display them.
// - position of trees
// - 
// - 

function NightEffects(pos) {
	// standard attributs
	this.pos = pos; //position of the effect
	this.planeEyes =  new Array();
	this.size = [10000,10000]; //In unit size
	
	// 0 nothing
	// 1 eyes
	this.listObjPosition =  new Array();
	this.listObjPosition[0] = [1,400,0];
	this.listObjPosition[1] = [1,0,400];
	
}

NightEffects.prototype.init = function(N, minDist) {
	for (var i = 0; i < N; i++) {
		p = new THREE.Vector2(Math.random()*this.size[0], Math.random()*this.size[1]),
		
		this.listObjPosition[i] = [1,p.x,p.y];
	}
}

NightEffects.prototype.setup = function(sceneEyes, controls) {

	var textEyes = THREE.ImageUtils.loadTexture("images/sprites/eyes.png");
	textEyes.magFilter = THREE.NearestFilter;
			
	for (var i = 0; i < this.listObjPosition.length; i++) {
		
		var materialEyes = new THREE.MeshBasicMaterial({ map: textEyes , transparent: true, side: THREE.DoubleSide, depthTest: false});
		//materialEyes.opacity = 0.1;//((Date.now()) % 100)/100
		this.planeEyes[i] = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), materialEyes);
		this.planeEyes[i].quaternion = controls.getObject().quaternion;	
		this.planeEyes[i].position.x = this.listObjPosition[i][1];
		this.planeEyes[i].position.z = this.listObjPosition[i][2];
		this.planeEyes[i].position.y = 100;	
		//sceneEyes.overrideMaterial = materialEyes;
		sceneEyes.add( this.planeEyes[i] );
	}
}

// Go througth the list of object on the map to check collision
NightEffects.prototype.update = function(o) {
	for (var i = 0; i < this.listObjPosition.length; i++) {
		var a = (hero.hitbox.position.x - this.planeEyes[i].position.x);
		var b = (hero.hitbox.position.z - this.planeEyes[i].position.z);
		var dist_2 = a*a +  b*b;
	
		this.planeEyes[i].material.opacity = Math.sqrt(dist_2)/10000 - 0.3;
		/*if ((dist_2/10000) >= 1)
			this.planeEyes.material.opacity = 1;*/
	
	}
	

}