/*
 * name: PP.Gui
 * @todo: add boolean and vec2 uniforms type
 */

PP.gui = {
    enabled: false,
    mouseControl: { enabled:false,
                    x:0,
                    y:0,
                    windowHalfX: window.innerWidth / 2,
                    windowHalfY: window.innerHeight / 2
                  },
    handler:null
}

PP.gui.addControl= function(shader){

            var control, p, t, c, prop;
            
            control                     = {};
            control.effectController    = {shaderName: function(){}, effect:shader};

            c                           = shader.controls;

            control.onChange            = function(value)
            {
                this.object.effect.material.uniforms[this.propertyName].value = value;
            };
            
            control.onChangeMouseControl            = function(value)
            {
                if(value){
                    this.object.effect.update = function(e)
                    {
                        e.material.uniforms.position.value.x = PP.gui.mouseControl.windowHalfX + PP.gui.mouseControl.x;
                        e.material.uniforms.position.value.y = PP.gui.mouseControl.windowHalfY - PP.gui.mouseControl.y;
                    }
                }else{
                    this.object.effect.update = undefined;
                }
            };

            this.handler.add(control.effectController, 'shaderName').name('EFFECT: '+shader.name.toUpperCase());

            for(prop in c)
            {
                p = c[prop];
                t = shader.material.uniforms[prop].type;
                
                switch(t){
                    // boolean: type : 'i' value : 0/1
                    case 'i':
                        control.effectController[prop] = (shader.material.uniforms[prop].value == 1) ? true : false;
                        this.handler.add(control.effectController, prop).name(prop).onChange( control.onChange );
                        break;
                    case 'v2':
                        control.effectController[prop] = false;
                        this.enableMouseControl();
                        this.handler.add(control.effectController, prop).name(prop+' (mouse control)').onChange( control.onChangeMouseControl );
                        break;
                    default:
                        control.effectController[prop] = shader.material.uniforms[prop].value;
                        this.handler.add(control.effectController, prop, p.min, p.max, p.step).onChange( control.onChange );
                }
                
            }

            shader.control = control;
}

/* todo: possibilité d'ajouter des controls manuellement
 *PP.gui.addControl = function(){

    
}*/

// -------------------------------------------------- MouseControl ---------------------------------------------

PP.gui.enableMouseControl = function(){

    if(!this.mouseControl.enabled)
    {
        this.mouseControl.enabled = true;
        document.addEventListener( 'mousemove', PP.gui.onDocumentMouseMove, false );
    }
}

PP.gui.onDocumentMouseMove = function(event){
    
    PP.gui.mouseControl.x = event.clientX - PP.gui.mouseControl.windowHalfX;
    PP.gui.mouseControl.y = event.clientY - PP.gui.mouseControl.windowHalfY;
}
