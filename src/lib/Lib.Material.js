
PP.lib.material = {

    get:function(name){
        
        var s;

        s = PP.lib.shader.shaders[name];           
        s.uniforms = THREE.UniformsUtils.clone( this.shaders[name].uniforms );

        return new THREE.MeshShaderMaterial(s);
    }
};