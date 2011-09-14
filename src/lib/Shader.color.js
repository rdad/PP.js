
PP.lib.shader.shaders.color  = {
    
                    info: {
                        name: 'color adjustement',
                        author: 'Evan Wallace',
                        link: 'https://github.com/evanw/glfx.js'
                    },

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            brightness: { type: "f", value: 0.0 },
                                            contrast:   { type: "f", value: 0.0 },
                                            hue:        { type: "f", value: 0.0 },
                                            saturation: { type: "f", value: 0.0 },
                                            exposure:   { type: "f", value: 0.0 },
                                            negative:   { type: "i", value: 0 }
                                      },

                    controls: {
                                brightness: {min:-1, max: 1, step:.05},
                                contrast:   {min:-1, max: 1, step:.05},
                                hue:        {min:-1, max: 1, step:.05},
                                saturation: {min:-1, max: 1, step:.05},
                                exposure:   {min:0, max: 1, step:.05},
                                negative:   {}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float brightness;",
                        "uniform float contrast;",
                        "uniform float hue;",
                        "uniform float saturation;",
                        "uniform float exposure;",
                        "uniform int   negative;",
                        
                        "const float sqrtoftwo = 1.41421356237;",

                        "void main() {",
                            "vec4 color = texture2D(textureIn, vUv);",   
                            "color.rgb += brightness;",
                            "if (contrast > 0.0) {",
                                "color.rgb = (color.rgb - 0.5) / (1.0 - contrast) + 0.5;",
                            "} else {",
                                "color.rgb = (color.rgb - 0.5) * (1.0 + contrast) + 0.5;",
                            "}",
                            "/* hue adjustment, wolfram alpha: RotationTransform[angle, {1, 1, 1}][{x, y, z}] */",
                            "float angle = hue * 3.14159265;",
                            "float s = sin(angle), c = cos(angle);",
                            "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;",
                            "float len = length(color.rgb);",
                            "color.rgb = vec3(",
                                "dot(color.rgb, weights.xyz),",
                                "dot(color.rgb, weights.zxy),",
                                "dot(color.rgb, weights.yzx)",
                            ");",
                            "/* saturation adjustment */",
                            "float average = (color.r + color.g + color.b) / 3.0;",
                            "if (saturation > 0.0) {",
                                "color.rgb += (average - color.rgb) * (1.0 - 1.0 / (1.0 - saturation));",
                            "} else {",
                                "color.rgb += (average - color.rgb) * (-saturation);",
                            "}",
                            "if(negative == 1){",
                            "   color.rgb = 1.0 - color.rgb;",
                            "}",
                            "if(exposure > 0.0){",
                            "   color = log2(vec4(pow(exposure + sqrtoftwo, 2.0))) * color;",
                            "}",
                            "gl_FragColor = color;",
                            "}",

                    ].join("\n")
                
                };


PP.lib.shader.shaders.bleach  = {
    
                    info: {
                        name: 'Bleach',
                        author: 'Brian Chirls @bchirls',
                        link: 'https://github.com/brianchirls/Seriously.js'
                    },

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            amount:     { type: "f", value: 1.0 }
                                      },

                    controls: {
                                amount:     {min:0, max: 1, step:.1}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        'varying vec2 vUv;',
                        
                        'uniform sampler2D textureIn;',
			'uniform float amount;',

			'const vec4 one = vec4(1.0);',
			'const vec4 two = vec4(2.0);',
			'const vec4 lumcoeff = vec4(0.2125,0.7154,0.0721,0.0);',

			'vec4 overlay(vec4 myInput, vec4 previousmix, vec4 amount) {',
			'	float luminance = dot(previousmix,lumcoeff);',
			'	float mixamount = clamp((luminance - 0.45) * 10.0, 0.0, 1.0);',

			'	vec4 branch1 = two * previousmix * myInput;',
			'	vec4 branch2 = one - (two * (one - previousmix) * (one - myInput));',
                        
			'	vec4 result = mix(branch1, branch2, vec4(mixamount) );',
			'	return mix(previousmix, result, amount);',
			'}',

			'void main (void)  {',
			'	vec4 pixel = texture2D(textureIn, vUv);',
			'	vec4 luma = vec4(vec3(dot(pixel,lumcoeff)), pixel.a);',
			'	gl_FragColor = overlay(luma, pixel, vec4(amount));',
			'}'

                    ].join("\n")
                
};

PP.lib.shader.shaders.plasma  = {
    
                    info: {
                        name: 'plasma',
                        author: 'iq',
                        link: 'http://www.iquilezles.org'
                    },

                    uniforms: {     resolution:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.01 },
                                    saturation:   { type: "f", value: 1.0 },
                                    waves:        { type: "f", value: .2 },
                                    wiggle:       { type: "f", value: 1000.0 },
                                    scale:        { type: "f", value: 1.0 }
                              },

                    controls: {
                                speed: {min:0, max: .1, step:.001},
                                saturation: {min:0, max: 10, step:.01},
                                waves: {min:0, max: .4, step:.0001},
                                wiggle: {min:0, max: 10000, step:1},
                                scale: {min:0, max: 10, step:.01}
                        },
                    
                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",

                        "uniform float time;",
                        "uniform float saturation;",
                        "uniform vec2 resolution;",
                        
                        "uniform float waves;",
                        "uniform float wiggle;",
                        "uniform float scale;",

                        "void main() {",
                           "float x = gl_FragCoord.x*scale;",
                           "float y = gl_FragCoord.y*scale;",
                           "float mov0 = x+y+cos(sin(time)*2.)*100.+sin(x/100.)*wiggle;",
                           "float mov1 = y / resolution.y / waves + time;",
                           "float mov2 = x / resolution.x / waves;",
                           
                           "float r = abs(sin(mov1+time)/2.+mov2/2.-mov1-mov2+time);",
                           "float g = abs(sin(r+sin(mov0/1000.+time)+sin(y/40.+time)+sin((x+y)/100.)*3.));",
                           "float b = abs(sin(g+cos(mov1+mov2+g)+cos(mov2)+sin(x/1000.)));",
                           
                           "vec3 plasma  = vec3(r,g,b) * saturation;",
                           "gl_FragColor = vec4( plasma ,1.0);",
                        "}"
                    ].join("\n")
                
                };

PP.lib.shader.shaders.plasma2  = {

                    info: {
                        name: 'plasma2',
                        author: 'mrDoob',
                        link: 'http://mrdoob.com'
                    },

                    uniforms: {     resolution:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.01 },
                                    qteX:         { type: "f", value: 80.0 },
                                    qteY:         { type: "f", value: 10.0 },
                                    intensity:    { type: "f", value: 10.0 },
                                    hue:          { type: "f", value: .25 }
                              },

                    controls: {
                                speed: {min:0, max: 1, step:.001},
                                qteX: {min:0, max: 200, step:1},
                                qteY: {min:0, max: 200, step:1},
                                intensity: {min:0, max: 50, step:.1},
                                hue: {min:0, max: 2, step:.001}
                        },

                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform float time;",
                        "uniform vec2 resolution;",

                        "uniform float qteX;",
                        "uniform float qteY;",
                        "uniform float intensity;",
                        "uniform float hue;",

                        "void main() {",

                            "vec2 position = gl_FragCoord.xy / resolution.xy;",

                            "float color = 0.0;",
                            "color += sin( position.x * cos( time / 15.0 ) * qteX ) + cos( position.y * cos( time / 15.0 ) * qteY );",
                            "color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );",
                            "color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );",
                            "color *= sin( time / intensity ) * 0.5;",

                            "gl_FragColor = vec4( vec3( color, color * (hue*2.0), sin( color + time / (hue*12.0) ) * (hue*3.0) ), 1.0 );",

                        "}"
                    ].join("\n")

                };

PP.lib.shader.shaders.plasma3  = {

                    info: {
                        name: 'plasma 3',
                        author: 'Hakim El Hattab',
                        link: 'http://hakim.se'
                    },

                    uniforms: {     color:        { type: "c", value: new THREE.Color( 0x8CC6DA ) },
                                    resolution:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.05 },
                                    scale:        { type: "f", value: 10.0 },
                                    quantity:     { type: "f", value: 5.0 },
                                    lens:         { type: "f", value: 2.0 },
                                    intensity:    { type: "f", value: .5 }
                              },

                    controls: {
                                speed: {min:0, max: 1, step:.001},
                                scale: {min:0, max: 100, step:.1},
                                quantity: {min:0, max: 100, step:1},
                                lens: {min:0, max: 100, step:1},
                                intensity: {min:0, max: 5, step:.01}
                        },

                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform float time;",
                        "uniform vec2 resolution;",
                        "uniform vec3 color;",
                        "uniform float scale;",
                        "uniform float quantity;",
                        "uniform float lens;",
                        "uniform float intensity;",

                        "void main() {",

                                "vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
                                "p = p * scale;",
                                "vec2 uv;",

                                "float a = atan(p.y,p.x);",
                                "float r = sqrt(dot(p,p));",

                                "uv.x = 2.0*a/3.1416;",
                                "uv.y = -time+ sin(7.0*r+time) + .7*cos(time+7.0*a);",

                                "float w = intensity+1.0*(sin(time+lens*r)+ 1.0*cos(time+(quantity * 2.0)*a));",

                                "gl_FragColor = vec4(color*w,1.0);",

                        "}"
                    ].join("\n")

                };

PP.lib.shader.shaders.plasma4  = {

                    info: {
                        name: 'plasma 4 (vortex)',
                        author: 'Hakim El Hattab',
                        link: 'http://hakim.se'
                    },

                    uniforms: {     color:        { type: "c", value: new THREE.Color( 0xff5200 ) }, // 0x8CC6DA
                                    resolution:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.05 },
                                    scale:        { type: "f", value: 20.0 },
                                    wobble:       { type: "f", value: 1.0 },
                                    ripple:       { type: "f", value: 5.0 },
                                    light:       { type: "f", value: 2.0 }
                              },

                    controls: {
                                speed: {min:0, max: 1, step:.001},
                                scale: {min:0, max: 100, step:.1},
                                wobble: {min:0, max: 50, step:1},
                                ripple: {min:0, max: 50, step:.1},
                                light: {min:1, max: 50, step:1}
                        },

                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform float time;",
                        "uniform vec2 resolution;",
                        "uniform vec3 color;",

                        "uniform float scale;",
                        "uniform float wobble;",
                        "uniform float ripple;",
                        "uniform float light;",

                        "void main() {",

                                "vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
                                "vec2 uv;",

                                "float a = atan(p.y,p.x);",
                                "float r = sqrt(dot(p,p));",

                                "float u = cos(a*(wobble * 2.0) + ripple * sin(-time + scale * r));",
                                "float intensity = sqrt(pow(abs(p.x),light) + pow(abs(p.y),light));",
                                "vec3 result =  u*intensity*color;",
                                "gl_FragColor = vec4(result,1.0);",

                        "}"
                    ].join("\n")

                };


PP.lib.shader.shaders.plasma5  = {

                    info: {
                        name: 'plasma 5',
                        author: 'Silexars',
                        link: 'http://www.silexars.com'
                    },

                    uniforms: {     resolution:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.01 }
                                   
                              },

                    controls: {
                                speed: {min:0, max: .2, step:.001}
                        },

                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform vec2 resolution;",
                        "uniform float time;",

                        "void main() {",

                                    "vec3 col;",
                                    "float l,z=time;",

                                    "for(int i=0;i<3;i++){",
                                        "vec2 uv;",
                                        "vec2 p=gl_FragCoord.xy/resolution.xy;",
                                        "uv=p;",
                                        "p-=.5;",
                                        "p.x*=resolution.x/resolution.y;",
                                        "z+=.07;",
                                        "l=length(p);",
                                        "uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));",
                                        "col[i]=.01/length(abs(mod(uv,1.)-.5));",
                                    "}",
                                    "gl_FragColor=vec4(col/l,1.0);",
                        "}"
                    ].join("\n")

                };

      
PP.lib.shader.shaders.plasmaByTexture  = {
    
                    info: {
                        name: 'plasma by texture',
                        author: 'J3D',
                        link: 'http://www.everyday3d.com/j3d/demo/011_Plasma.html'
                    },

                    uniforms: {     textureIn:    { type: "t", value: 0, texture: null },
                                    time:         { type: "f", value: 0.0},
                                    speed:        { type: "f", value: 0.01 }
                              },

                    controls: {
                                speed: {min:0, max: .1, step:.001}
                        },
                    
                    update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.speed.value;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        "uniform sampler2D textureIn;",
                        "uniform float time;",

 
                        "void main() {",
                            "vec2 ca = vec2(0.1, 0.2);",
                            "vec2 cb = vec2(0.7, 0.9);",
                            "float da = distance(vUv, ca);",
                            "float db = distance(vUv, cb);",

                            "float t = time * 0.5;",

                            "float c1 = sin(da * cos(t) * 16.0 + t * 4.0);",
                            "float c2 = cos(vUv.y * 8.0 + t);",
                            "float c3 = cos(db * 14.0) + sin(t);",

                            "float p = (c1 + c2 + c3) / 3.0;",

                            "gl_FragColor = texture2D(textureIn, vec2(p, p));",
                        "}"
                    ].join("\n")
                
                };



               