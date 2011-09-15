/* PP - Post Processing for THREE.js
 * @author rdad / http://www.whiteflashwhitehit.com
 * @link three.js https://github.com/mrdoob/three.js
 */

/*
 * @todo : affectation d'un nom perso pour les shaders (permet d'utiliser plusieur fois le même shader)
 **/

var PP = PP || {
    
    enabled:    true,
    list:       {},

    renderer:   null,
    context3D:  {},
    context2D:  {},
    contextFinal:   {},

    config:     {
                    camera:     {   z:100},
                    rtTexture:  {   minFilter: THREE.LinearFilter, 
                                    magFilter: THREE.NearestFilter, 
                                    format: THREE.RGBFormat,
                                    stencilBuffer: false
                                },
                    dimension:  {   width: window.innerWidth, 
                                    height: window.innerHeight
                                },
                    resolution: 1.0
    },
    rendered:   null,
    
    mouse: {    enabled:false, 
                x:0, 
                y:0
            },
                
    TEXTURE:    0,
    SHADER:     1,
    
    e:          null,
    
    
    init: function( parameters ){

        parameters = parameters || {};
        
        this.config.camera.z                = ( parameters.camera_z !== undefined )     ? parameters.camera_z   : this.config.camera.z;
        this.config.dimension               = ( parameters.dimension !== undefined )    ? parameters.dimension  : this.config.dimension;
        this.config.resolution              = ( parameters.resolution !== undefined )   ? parameters.resolution  : this.config.resolution;
        this.gui.enabled                    = ( parameters.guiEnabled !== undefined )   ? parameters.guiEnabled : false;

        // --- résolution
        this.config.dimension.width  *= this.config.resolution;
        this.config.dimension.height *= this.config.resolution;
               
        // --- 2D context & Final
        this.context2D = new PP.Context();        
        this.contextFinal = new PP.Context({quadReverse: true});
        
        // --- 3D context
        this.renderer                       = ( parameters.renderer !== undefined )     ? parameters.renderer   : null;
        this.context3D.scene                = ( parameters.scene !== undefined )        ? parameters.scene      : null;
        this.context3D.camera               = ( parameters.camera !== undefined )       ? parameters.camera     : null;
        
        if(parameters.clearColor !== undefined)        this.renderer.setClearColorHex( parameters.clearColor, 0.0 );

        // --- Gui
        if(this.gui.enabled && DAT.GUI != undefined)
        {
            this.gui.handler = new DAT.GUI();
            this.gui.handler.close();
        }
        
        // --- ready ?      
        if(this.renderer === null || this.context3D.scene === null || this.context3D.camera === null)
        {
            this.error('PP not initialized correctly: Three infos not set', true);
            return this;
        }

        return this;
       
    },

    setScene: function(scene, camera){
        
        this.context3D.scene                = scene;
        this.context3D.camera               = camera;
    },
    
    addTexture:function(name, parameters){
        
        if(this.enabled === false)   return this;

        var texture = new PP.Texture(name, parameters);

        if(this.debug)  this.debug.addSprite(texture);
         
        this.list[name] = texture;
        
        this.error('Texture "'+name+'" successfully added');

        return this;
    },
    
    addShader: function(name, parameters){
        
        if(this.enabled === false)   return this;
        
        var shader  = new PP.Shader(name, parameters);

        if(this.guiControl)     this.gui.addControl(shader); 
        if(this.debug)          this.debug.addSprite(shader);
        
        this.list[shader.name] = shader;
        
        this.error('Shader "'+name+'" successfully added');
        
        return this;
    },
    
    loadShader: function( name, uniforms, parameters ){
        
        if(this.enabled === false)   return this;
        
        if(typeof this.lib === 'undefined' || typeof this.lib.shader.shaders[name] === 'undefined')
        {
            this.error(["Shader '", name, "' doesn't exist in PP.lib"].join(''), true);
            return;
        }
        
        var shader = this.lib.shader.get( name, uniforms, parameters );
        
        if(PP.gui.enabled)          PP.gui.addControl(shader);
        if(PP.debug)                PP.debug.addSprite(shader);
        
        this.list[shader.name] = shader;
        
        this.error('Shader "'+name+'" successfully loaded');
        
        return this;
    },
    
    get: function( name )
    {
        if(this.enabled === false)   return;
        
        if(this.list[name])
        {
                return this.list[name];
        }else{
                this.error([name," doesn't exist."].join(''), true);
        }
    },
    
    start: function(){

        //this.renderer.clear();
        this.rendered = null;
        
    },
 
    // ---------------------------------- Render -------------------------------

    renderScene: function() {

        this.rendered = '_scene';
        return this;
    },
    
    renderTexture: function(name){
      
        if(this.enabled === false)   return this;
        this.rendered = name;
        return this;
    },
    
    renderShader: function(name) {
        
        if(this.enabled === false)   return this;
        
        this.rendered = name;

        this.e = this.list[name];

        if(typeof this.e === 'undefined')
        {
            this.error(["Shader '", name, "' can't be found: no render"].join(''), true);
            return this;
        }

        this.e = this.list[name];
        this.context2D.quad.materials = [ this.e.material ];

        if(this.e.update)    this.e.update(this.e);

        this.renderer.render( this.context2D.scene, 
                              this.context2D.camera, 
                              this.e.textureOut,
                              true);           
        return this;
    },
    
    toTexture:function( name ) {

        if(this.enabled === false)   return;
        
        if(this.rendered === '_scene')
        {
            this.renderer.render( this.context3D.scene, 
                                  this.context3D.camera, 
                                  this.list[name].textureOut, 
                                  true);
        }else{
            
            if(name == this.rendered)   return;
            
            var e       = this.list[name],
            s           = PP.list[this.rendered];
            
            if(e.type == PP.SHADER && typeof e.material.uniforms.textureIn != 'undefined'){
                    e.material.uniforms.textureIn.texture = s.textureOut;
            } 
        }
    },
    
    toScene: function(){
 
        if(this.enabled === false)   return;
        
        if(this.debug){           
            this.debug.update();
        }
        
        this.contextFinal.quad.materials[0].map = this.list[this.rendered].textureOut;       
        this.renderer.render( this.contextFinal.scene, this.contextFinal.camera );
        
    },
    
    error:function(message, stopProcess)
    {
        if(this.debug){
            this.debug.toConsole(message);
        }
        
        if(typeof stopProcess != undefined && stopProcess == true){
            this.enabled = false;
            PP.debug.showConsole();
        }
    }

};


