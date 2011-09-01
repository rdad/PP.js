PP.debug = PP.debug || {
    
    enabled: false,
    debugObject: null,
    debugOffset: {x:0, y:0},
    nbSprite: 0,
    console: null
    
};

PP.debug.init = function(){
    
    var debugController, bg;
    
    // --- Gui
    if(PP.gui.enabled)
    {
        debugController = {showTexture:false, showConsole: false, exportSettings:false};
        PP.gui.handler.add(debugController, 'showTexture').name('show debug texture').onChange( PP.debug.showTexture );
        PP.gui.handler.add(debugController, 'showConsole').name('show console').onChange( PP.debug.showConsole );
        PP.gui.handler.add(debugController, 'exportSettings').name('export settings').onChange( PP.debug.exportSettings );

        // --- Texture debug
        this.debugObject            = new THREE.Object3D();
        PP.contextFinal.scene.addObject( this.debugObject );

        bg = new THREE.Mesh( new THREE.PlaneGeometry( PP.config.dimension.width, PP.config.dimension.height ), new THREE.MeshBasicMaterial({color:0x999999}) );
        bg.position.z = -470;
        bg.visible = false;
        this.debugObject.addChild(bg);
    } 
    
    // console
    this.console = document.createElement( 'div' );
    this.console.setAttribute('style', 'display:none; position:fixed; padding:5px; width:300px; height:400px; overflow:auto; background-color:#333333; font-size:12px; font-family:Arial; left:0px; bottom:0px; color:#ccc; text-align:left');
    this.console.setAttribute('id', 'debug_console');
   
    document.body.appendChild( this.console );
}

PP.debug.addSprite = function(shader){
    
    var dim, m, plane;
    
    dim     = {width: PP.config.dimension.width/4, height: PP.config.dimension.height/4};
    m       = new THREE.MeshBasicMaterial({map: shader.textureOut});
    plane   = new THREE.PlaneGeometry(dim.width, dim.height, 8, 8);
    
    shader.debug = new THREE. Mesh( plane, m );
    
    if(this.nbSprite==0){
        shader.debug.doubleSided = true;
        shader.debug.scale.y = - 1;
    }
    shader.debug.position.z = -450;
    shader.debug.position.x = -(PP.config.dimension.width/3) + (this.debugOffset.x * (dim.width + 20));
    shader.debug.position.y = (PP.config.dimension.height/3) - (this.debugOffset.y * (dim.height + 20));
    this.debugObject.addChild( shader.debug );
    
    this.debugOffset.x++;
    if(this.debugOffset.x>2){
        this.debugOffset.x = 0;
        this.debugOffset.y++;
    }
    
    this.nbSprite++;
}

PP.debug.update = function(){
    
    if(this.enabled)
    {
        var e;
        for(var name in PP.list)
        {
            e = PP.list[name];
            if(e.debug){
                if(e.type !== PP.TEXTURE){
                    e.debug.materials = [e.material];
                }else{
                    e.debug.materials[0].map = e.textureOut;
                }
            }
        }

        THREE.SceneUtils.traverseHierarchy( this.debugObject, function ( object ) {object.visible = true;} );

    }else{
        THREE.SceneUtils.traverseHierarchy( this.debugObject, function ( object ) {object.visible = false;} );
    }
}

PP.debug.showTexture = function(value){
    
    PP.debug.enabled = value;
}

PP.debug.showConsole = function(value){
    
    var d = document.getElementById('debug_console').style.display;
    d = (d == 'none') ? 'block' : 'none';
    document.getElementById('debug_console').style.display = d;
}

PP.debug.exportSettings = function()
{
    var result = 'Settings:\n',
        list = DAT.GUI.allControllers,
        nb = list.length,
        settings = {},
        name, value, shader,
        i,n,s,l;
    
    // --- Get the values
    
    for(i=0; i<nb; i++)
    {
        if(list[i].type == 'number'){

                name    = list[i].propertyName;
                value   = list[i].object[name];
                shader  = list[i].object.effect.name;
                
                if(typeof settings[shader] == 'undefined') settings[shader] = {};
                
                settings[shader][name] = value;
        }       
    }
    
    // --- render values
    
    for(n in settings)
    {
        l = ".loadShader('"+n+"',{";
        for(s in settings[n])
        {
            l += s + ':' + settings[n][s] +', ';
        }
        l = l.slice(0, -2);
        l += "})\n";
        result += l;
    }
    
    //alert(result);    
    //console.log(result);
    
    PP.debug.toConsole(result);
    PP.debug.showConsole(true);
}


PP.debug.toConsole = function(message){
    
    var m = document.createElement( 'p' );
    m.appendChild(document.createTextNode(message)); 
    this.console.appendChild( m );
}