
PP.Texture = function ( name, parameters ) {

        var config;
        
        if(typeof parameters === 'object')
        {
            config = parameters;
        }else{
            config = {width: PP.config.dimension.width, 
                            height: PP.config.dimension.height, 
                            options: PP.config.rtTexture
                         };
        }
        
	this.name       = name;
        this.type       = PP.TEXTURE;       
        this.textureOut = new THREE.WebGLRenderTarget(    config.width,
                                                          config.height,
                                                          config.options );
};

PP.Shader.prototype.copyTo = function(name){

    if(name == this.rendered)   return;

    var s           = PP.list[this.rendered];

    if(typeof s.textureOut != 'undefined')
    {
            this.textureOut = s.textureOut.clone();
    } 
}
