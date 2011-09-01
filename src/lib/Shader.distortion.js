
PP.lib.shader.shaders.kaleidoscope = {

                    info: {
                        name: 'kaleidoscope',
                        author: 'iq',
                        link: 'http://www.iquilezles.org'
                    },

                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "resolution":   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                        "time":         { type: "f", value: 0.0},
                        "speed":        { type: "f", value: .01}
                    },

                    controls: {
                            speed:     {min:0, max: 10, step:.001}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                     update: function(e){

                            e.material.uniforms.time.value += this.material.uniforms.speed.value;
                     },

                    fragmentShader: [

                        "varying vec2 vUv;",

                        "uniform float time;",
                        "uniform vec2 resolution;",
                        "uniform sampler2D textureIn;",

                        "void main(){",

                            "vec2 p = -1.0 + 2.0 * vUv.xy / resolution.xy;",
                            "vec2 muv;",

                            "float a = atan(p.y,p.x);",
                            "float r = sqrt(dot(p,p));",

                            "muv.x =          7.0*a/3.1416;",
                            "muv.y = -time+ sin(7.0*r+time) + .7*cos(time+7.0*a);",

                            "float w = .5+.5*(sin(time+7.0*r)+ .7*cos(time+7.0*a));",

                            "vec3 color = texture2D(textureIn, muv*.5).xyz;",
                            "gl_FragColor = vec4(color*w,1.0);",

                        "}"

                    ].join("\n")

                };

PP.lib.shader.shaders.wiggle = {
    
                    info: {
                        name: 'wiggle',
                        author: 'Petri Wilhelmsen, @petriw',
                        link: 'http://digitalerr0r.wordpress.com/2009/04/22/xna-shader-programming-tutorial-9-post-process-wiggle/'
                    },
                    
                    uniforms:{
                        "textureIn":        { type: "t", value:0, texture: null },
                        "waveX":        { type: "f", value: .1 },
                        "waveY":        { type: "f", value: .1 },
                        "time":         { type: "f", value: 0.0},
                        "speed":        { type: "f", value: 0.05}
                    },

                    controls: {
                            waveX:     {min:0, max: .2, step:.001},
                            waveY:     {min:0, max: .2, step:.001},
                            speed:     {min:0, max: .1, step:.001}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                     update: function(e){

                            e.material.uniforms.time.value += this.material.uniforms.speed.value;
                     },

                    fragmentShader: [

                        "varying vec2 vUv;",
                        
                        "uniform float time;",
                        "uniform float waveX;",
                        "uniform float waveY;",
                        "uniform sampler2D textureIn;",

                        "void main(){",

                            "vec2 tex = vUv;",
                            "tex.x += sin(time+tex.x*10.0)*waveX;",
                            "tex.y += cos(time+tex.y*10.0)*waveY;",

                            "vec3 color = texture2D(textureIn, tex).xyz;",
                            "gl_FragColor = vec4(color,1.0);",

                        "}"
                    ].join("\n")

                };

PP.lib.shader.shaders.rgbWiggle = {
    
                    info: {
                        name: 'rvb wiggle',
                        author: 'Petri Wilhelmsen, @petriw',
                        link: 'http://digitalerr0r.wordpress.com/2009/04/22/xna-shader-programming-tutorial-9-post-process-wiggle/'
                    },
                    
                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "time":         { type: "f", value: 0.0},
                        "waveR":        { type: "f", value: 0.5 },
                        "waveG":        { type: "f", value: 1.0 },
                        "waveB":        { type: "f", value: 1.5 },
                        "speed":        { type: "f", value: 0.01},
                        "amplitude":    { type: "f", value: .02}
                    },

                    controls: {
                            waveR:     {min:0, max: 2, step:.01},
                            waveG:     {min:0, max: 2, step:.01},
                            waveB:     {min:0, max: 2, step:.01},
                            speed:     {min:0, max: .1, step:.001},
                            amplitude: {min:0, max: 1, step:.001}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                     update: function(e){

                            e.material.uniforms.time.value += this.material.uniforms.speed.value;
                     },

                    fragmentShader: [

                        "varying vec2 vUv;",
                        "uniform float time;",
                        "uniform float waveR;",
                        "uniform float waveG;",
                        "uniform float waveB;",
                        "uniform float amplitude;",
                        "uniform sampler2D textureIn;",

                        "void main() {",

                                "float m1 = sin(time * 3.0 + vUv.y * 16.0) * cos(time * 2.0 + vUv.x * 10.0) * amplitude;",

                                "vec4 a = texture2D(textureIn, vUv + m1 * waveR);",
                                "vec4 b = texture2D(textureIn, vUv + m1 * waveG);",
                                "vec4 c = texture2D(textureIn, vUv + m1 * waveB);",

                                "gl_FragColor = vec4(a.r, b.g, c.b, 1.0);",

                        "}"
                        
                    ].join("\n")

                };

PP.lib.shader.shaders.tunnel = {

                    info: {
                        name: 'tunnel',
                        author: 'mrDoob, @mrdoob',
                        link: 'http://www.mrdoob.com'
                    },

                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "time":         { type: "f", value: 0.0},
                        "resolution":   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                        "speed":        { type: "f", value: 0.01}
                    },

                    controls: {
                            speed:     {min:0, max: .1, step:.001}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                     update: function(e){

                            e.material.uniforms.time.value += this.material.uniforms.speed.value;
                     },

                    fragmentShader: [

                        "uniform float time;",
                        "uniform vec2 resolution;",
                        "uniform sampler2D textureIn;",

                        "void main() {",


                            "vec2 position = - 1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",

                            "float a = atan( position.y, position.x );",
                            "float r = sqrt( dot( position, position ) );",

                            "vec2 uv;",
                            "uv.x = cos( a ) / r;",
                            "uv.y = sin( a ) / r;",
                            "uv /= 10.0;",
                            "uv += time * 0.05;",

                            "vec3 color = texture2D( textureIn, uv ).rgb;",

                            "gl_FragColor = vec4( color * r * 1.5, 1.0 );",

                        "}"

                    ].join("\n")

                };
