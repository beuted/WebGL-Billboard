// The map class contain all the information about the map :
// - position of trees
// - 
// - 

function Map(fileName) {
	// standard attributs
	this.fileName = fileName;
	this.size = [10000,10000]; //In unit size
	this.treeSize = 100;
	
	// 0 nothing
	// 1 tree
	this.listObjPosition =  new Array();
	this.listObjPosition[0] = [1,400,0];
	this.listObjPosition[1] = [1,0,400];
	
}

// N = number of tree
// minDist = minimal distance between trees

Map.prototype.init = function(N, minDist) {
	for (var i = 0; i < N; i++) {
		p = new THREE.Vector2(Math.random()*this.size[0], Math.random()*this.size[1]),
		
		this.listObjPosition[i] = [1,p.x,p.y];
	}
}

Map.prototype.setup = function(scene,controls) {

	for (var i = 0; i < this.listObjPosition.length; i++) {
		var textTree = THREE.ImageUtils.loadTexture("images/sprites/tree.png");
		textTree.magFilter = THREE.NearestFilter;
		var material = new THREE.MeshLambertMaterial({ map: textTree , transparent: true, side: THREE.DoubleSide});
		var plane = new THREE.Mesh(new THREE.PlaneGeometry(720, 1920), material);
		//var orientation = new THREE.Matrix4();
		//orientation.makeRotationFromEuler(new THREE.Euler( 0, controls.getObject().rotation.y, 0, "YXZ" ));//rotate on X 90 degrees
		//orientation.setPosition(new THREE.Vector3(0,0,halfLength));//move half way on Z, since default pivot is at centre
		//plane.applyMatrix(orientation);//apply transformation for geometry
		plane.quaternion = controls.getObject().quaternion;
		
		//plane.side = THREE.DoubleSide;
		plane.position.x = this.listObjPosition[i][1];
		plane.position.z = this.listObjPosition[i][2];
		plane.position.y = 500;
		
		//plane.quaternion = camera.quaternion;
		scene.add( plane );
	}

}

// Go througth the list of object on the map to check collision
Map.prototype.checkTreeCollision = function(o) {
	for (var i = 0; i < this.listObjPosition.length; i++) {
		var a = (hero.hitbox.position.x - this.listObjPosition[i][1]);
		var b = (hero.hitbox.position.z - this.listObjPosition[i][2]);
		if(a*a +  b*b < this.treeSize*this.treeSize)
			return true;
	}
	
	return false;	

}