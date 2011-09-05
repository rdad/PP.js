
function Particle(emitter){
    
    this.emitter    = emitter;
    this.material   = '';
    this.mesh       = '';
    this.living     = false;
    this.velocity   = new THREE.Vector3();
    this.livingTime = 1;
    this.wind       = new THREE.Vector3(2,4,1);
    this.elevetion  = 0;
    
    this.init = function(mat, mesh)
    {
        this.material = mat;
        this.mesh = mesh;
    }
    
    this.wakeUp = function()
    {        
        this.living         = true;
        this.mesh.visible   = true;
        this.livingTime     = 1;
        
        this.setStart(); 
    }
    
    this.sleep = function()
    {
        this.living         = false;
        this.mesh.visible   = false;
    }
    
    this.setStart = function()
    {
        this.elevation = 0;
         this.mesh.scale.set(this.livingTime,
                            this.livingTime,
                            this.livingTime);
        //this.mesh.position.set(mouseX,-mouseY,0);
        this.mesh.position.set( this.emitter.positionStart.x,
                                this.emitter.positionStart.y,
                                this.emitter.positionStart.z);
                                
        this.velocity.set( Math.random()-.5   * this.wind.x,
                            Math.random()  * this.wind.y,
                            Math.random()-.5  * this.wind.z );
       
    }
    
    this.update = function()
    {
        this.elevation += .0001;
        this.velocity.y += this.elevation;
        this.velocity.x += (Math.random() -.5)*.05;
        this.velocity.z += (Math.random() -.5)*.1;
        this.mesh.position.addSelf(this.velocity);
        
        this.livingTime -= this.livingTime*.018;
        this.mesh.scale.set(this.livingTime, this.livingTime, this.livingTime);

        this.material.opacity = this.livingTime; //(this.livingTime>.7) ? this.livingTime : this.livingTime *.5;        
        this.mesh.updateMatrix();
        
        if(this.livingTime<=0.02)  this.sleep();
        //if(cc.v<=0)  this.sleep();
    }
}

function Mega_particle()
{
    this.material_depth     = "";
    this.material_diffuse   = "";
    this.nb                 = 0;
    this.group              = '';
    this.particle           = [];
    this.pt                 = 0;
    this.positionStart      = new THREE.Vector3(0,-200,0);

    this.init = function (nb_particle, scene)
    {
        this.material_depth     = new THREE.MeshDepthMaterial();
        /*this.material_diffuse   = new THREE.MeshLambertMaterial({color:0xff5200,
                                                                 shading:THREE.SmoothShading, 
                                                                 blending: THREE.AdditiveBlending});*/
        this.material_diffuse = new THREE.MeshPhongMaterial({color: 0xff5200,
                                                             ambient: 0x202020,
                                                             specular: 0xfffbb8,
                                                             shininess: 16,
                                                             opacity: 1.0,
                                                             shading:THREE.SmoothShading,
                                                             blending: THREE.AdditiveBlending});
        this.group              = new THREE.Object3D();
        this.nb                 = nb_particle;

        // objects

        var i, p, mesh, geometry = new THREE.SphereGeometry( 70, 10, 10 );

        for ( i = 0; i < this.nb; i ++ ) {

                mesh                    = new THREE.Mesh( geometry, this.material_diffuse );
                mesh.position.set(0,0,0);
                mesh.matrixAutoUpdate   = false;
                mesh.updateMatrix();
                mesh.visible            = false;
                
                p = new Particle(this);
                p.init(this.material_diffuse, mesh);

                this.group.addChild( mesh );
                this.particle.push(p);
        }

        scene.addObject( this.group );
    };
    
    this.update = function()
    {
        var i,p,newOne = false;

        for( i = 0; i < this.nb; i++ )
        {
            p = this.particle[i];
            
            // --- new one
            
            if(p.living==false && newOne == false)
            {
                newOne      = true;
                p.wakeUp();
            }
            
            if(p.living){
                p.update();
            }
        }
    }
    
    this.switchToDepth = function()
    {
        var i;
        for( i = 0; i < this.nb; i++ ) this.particle[i].material = [ this.material_depth ];
    }
    
    this.switchToDiffuse = function()
    {
        var i;
        for( i = 0; i < this.nb; i++ ) this.particle[i].material = [ this.material_diffuse ];
    }
}