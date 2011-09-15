
PP.Shader = function ( name, parameters ) {

        parameters = parameters || {};
	this.name       = name;
        this.type       = PP.SHADER;
        this.cible      = '';

        var dim         = (typeof parameters.dimension != 'undefined') ? parameters.dimension : PP.config.dimension;


        this.material   = new THREE.MeshShaderMaterial({ uniforms:       parameters.uniforms,
                                                        vertexShader:   parameters.vertexShader,
                                                        fragmentShader: parameters.fragmentShader});
                                                    
        this.material.blending = (parameters.blending) ? parameters.blinding : THREE.NormalBlending;
        
        this.textureOut   = new THREE.WebGLRenderTarget(    dim.width,
                                                            dim.height,
                                                            PP.config.rtTexture );
        
        // set values ?
        if(typeof parameters.value != 'undefined')
        {
            this.setUniforms( parameters.value );
        }
        
        // set attributes
        if(typeof parameters.attributes != 'undefined')
        {
            this.setAttributes( parameters.attributes );
        }
        
        if(parameters.controls)     this.controls = parameters.controls;
        if(parameters.variable)     this.variable = parameters.variable;
        if(parameters.update)       this.update   = parameters.update;

};

PP.Shader.prototype.copyTo = function(name){
            
            if(name == PP.rendered)   return;

            var s           = PP.list[name];
            
            if(typeof s.textureOut != 'undefined')
            {
                    s.textureOut = this.textureOut;
            } 

        }

PP.Shader.prototype.setUniforms = function( config) {
    
    for(var u in config){
                this.set(u).toValue(config[u]);
    }
}

PP.Shader.prototype.setAttributes = function(config) {
    
    this.material.attributes = config;

}

PP.Shader.prototype.set = function( key ) {

    if(this.material.uniforms[key]){
        this.cible = key;
    }else{
        PP.error(this.name+".uniforms."+key+" doesn't exist", true);
    }    
    return this;
}

PP.Shader.prototype.get = function( key ) {

    if(this.material.uniforms[key]){
        return this.material.uniforms[key].value;
    }else{
        PP.error(this.name+".uniforms."+key+" doesn't exist", true);
        return 0;
    }    
}

PP.Shader.prototype.toTexture = function( name ) {
    
    if(typeof name == 'string')
    {
        var c       = PP.list[name];
        this.material.uniforms[this.cible].texture = c.textureOut;      
    }else{
        // direct texture
        this.material.uniforms[this.cible].texture = name;
    }
}

PP.Shader.prototype.toValue = function( value ) {
    
    this.material.uniforms[this.cible].value = value;
}

PP.Shader.prototype.toAdd = function( value ) {
    
    this.material.uniforms[this.cible].value += value;
}

PP.Shader.prototype.toSub = function( value ) {
    
    this.material.uniforms[this.cible].value -= value;
}
