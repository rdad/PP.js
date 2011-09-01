
PP.lib.shader = {
    
    shaders: {},

    get:function(name, uniforms, parameters ){
        
        var result, s, part;
        
        if(parameters != undefined)
        {
            if(parameters.part != undefined)
            {
                part = parameters.part;
            }
        }
        
        if(part == undefined)
        {
            s = this.shaders[name];           
            s.uniforms = THREE.UniformsUtils.clone( this.shaders[name].uniforms );
            
            if(typeof uniforms != 'undefined')
            {
                s.value = uniforms;
            }

            result = new PP.Shader(name, s);
    
        }else{
            result = ( part == 'uniforms' ) ? THREE.UniformsUtils.clone( this.shaders[name].uniforms ) : this.shaders[name][part];
        }
        
        return result;
    }
};