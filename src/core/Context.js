
PP.Context = function ( parameters  ) {
    
        parameters = parameters || {};
        
        this.dimension = (typeof parameters.dimension == 'undefined') ? PP.config.dimension : parameters.dimension;

        // --- scene
        
	this.scene  = new THREE.Scene();
        
        // --- camera
        
        this.camera                     = new THREE.Camera();
        this.camera.projectionMatrix    = THREE.Matrix4.makeOrtho( this.dimension.width / - 2, this.dimension.width / 2,  this.dimension.height / 2, this.dimension.height / - 2, -10000, 10000 );
	this.camera.position.z          = PP.config.camera.z;

        // --- quad
        
        this.quad                       = new THREE. Mesh( new THREE.PlaneGeometry( this.dimension.width, this.dimension.height ), new THREE.MeshBasicMaterial() );
        this.quad.position.z            = -500;

        if(typeof parameters.quadReverse != 'undefined')
        {
            this.quad.doubleSided = true;
            this.quad.scale.y = - 1;
        }
	this.scene.addObject( this.quad );
};