
PP.lib.shader.shaders.fluid_source  = {
    
                    info: {
                            name: 'Fluid source',
                            author: '@Geeks3D',
                            link: 'http://www.geeks3d.com/20091216/geexlab-how-to-visualize-the-depth-buffer-in-glsl/'
                    },
                        
                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null }
                    },


                    vertexShader:[
                        
                          "attribute vec3 aSource;",
                          "attribute vec2 aTCSource;",
                          "varying   vec2 vUv;",
                          "varying  float S;",
                          
                        "void main(void) {",
                           "gl_Position = vec4(aSource.xy, 0., 1.);",
                           "S = aSource.z;",
                           "vUv = aTCSource;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                          "uniform sampler2D textureIn;",
                          "varying vec2 vUv;",
                          "varying float S;",
                          
                        "void main(void) {",
                           "vec4 t = texture2D(textureIn, vUv);",
                           "t.b += S;",
                           "gl_FragColor = t;",
                        "}"
                        
                    ].join("\n")

                };

PP.lib.shader.shaders.fluid_force  = {
    
                    info: {
                            name: 'Fluid force',
                            author: 'ibiblio',
                            link: 'http://www.ibiblio.org'
                    },
                        
                    uniforms:{
                        textureIn:    { type: "t", value:0, texture: null },
                        c:       { type: "f", value: .01 }
                    },

                    controls: {
                            c:    {min:0, max: .1, step:.001}
                        },
                    
                    //vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    vertexShader:[

                        "varying vec2 vUv;",

                        "void main(){",
                           "gl_Position = vec4(position.xy, 0., 1.);",
                           "vUv = uv;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                          "uniform sampler2D textureIn;",
                          "varying vec2 vUv;",
                          "uniform float c;",
                          
                          "const float h = 1./512.;",
                          
                        "void main() {",

                               "vec4 t = texture2D(textureIn, vUv);",
                               "float b = texture2D(textureIn, vec2(vUv.r, vUv.g + h)).b;",
                               "t.g += c * (t.b + b );",    // .01 = c
                               "gl_FragColor = t;",

                        "}"
                        
                    ].join("\n")

                };
                
PP.lib.shader.shaders.fluid_advec  = {
    
                    info: {
                            name: 'Fluid advec',
                            author: 'ibiblio',
                            link: 'http://www.ibiblio.org'
                    },
                        
                    uniforms:{
                        textureIn:    { type: "t", value:0, texture: null }
                    },

                    //vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    vertexShader:[

                        "varying vec2 vUv;",

                        "void main(){",
                           "gl_Position = vec4(position.xy, 0., 1.);",
                           "vUv = uv;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                              "uniform sampler2D textureIn;",
                              "varying vec2 vUv;",
                              "const float h = 1./512., dt = .001, tau = .5*dt/h;",
                              
                            "void main() {",
                               "vec2 D = -tau*vec2(",
                                 "texture2D(textureIn, vUv).r + texture2D(textureIn, vec2(vUv.r - h, vUv.g)).r,",
                                 "texture2D(textureIn, vUv).g + texture2D(textureIn, vec2(vUv.r, vUv.g - h)).g );",
                               "vec2 Df = floor(D),   Dd = D - Df;",
                               "vec2 tc1 = vUv + Df*h;",
                               "vec3 new =  ",
                                 "(texture2D(textureIn, tc1).rgb*(1. - Dd.g) +",
                                  "texture2D(textureIn, vec2(tc1.r, tc1.g + h)).rgb*Dd.g)*(1. - Dd.r) +",
                                 "(texture2D(textureIn, vec2(tc1.r + h, tc1.g)).rgb*(1. - Dd.g) +",
                                  "texture2D(textureIn, vec2(tc1.r + h, tc1.g + h)).rgb*Dd.g)*Dd.r;",
                               "gl_FragColor = vec4( new, texture2D(textureIn, vUv).a );",
                            "}"
                        
                    ].join("\n")

                };

PP.lib.shader.shaders.fluid_p  = {
    
                    info: {
                            name: 'Fluid p',
                            author: 'ibiblio',
                            link: 'http://www.ibiblio.org'
                    },
                        
                    uniforms:{
                        textureIn:    { type: "t", value:0, texture: null }
                    },

                    //vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    vertexShader:[

                        "varying vec2 vUv;",

                        "void main(){",
                           "gl_Position = vec4(position.xy, 0., 1.);",
                           "vUv = uv;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                              "uniform sampler2D textureIn;",
                              "varying vec2 vUv;",
                              "const float h = 1./512.;",
                              
                            "void main() {",
                               "vec4 t = texture2D(textureIn, vUv);",
                               "t.a =",
                                 "(texture2D(textureIn, vec2(vUv.r - h, vUv.g)).a +",
                                  "texture2D(textureIn, vec2(vUv.r + h, vUv.g)).a +",
                                  "texture2D(textureIn, vec2(vUv.r, vUv.g - h)).a +",
                                  "texture2D(textureIn, vec2(vUv.r, vUv.g + h)).a -",
                                 "(t.r - texture2D(textureIn, vec2(vUv.r - h, vUv.g)).r +",
                                  "t.g - texture2D(textureIn, vec2(vUv.r, vUv.g - h)).g) *h) *.25;",
                               "gl_FragColor = t;",
                            "}"
                        
                    ].join("\n")

                };

PP.lib.shader.shaders.fluid_div  = {
    
                    info: {
                            name: 'Fluid div',
                            author: 'ibiblio',
                            link: 'http://www.ibiblio.org'
                    },
                        
                    uniforms:{
                        textureIn:    { type: "t", value:0, texture: null }
                    },

                    //vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    vertexShader:[

                        "varying vec2 vUv;",

                        "void main(){",
                           "gl_Position = vec4(position.xy, 0., 1.);",
                           "vUv = uv;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                              "uniform sampler2D textureIn;",
                              "varying vec2 vUv;",
                              "const float n = 512., h = 1./n;",
                              
                            "void main() {",
                               "vec4 t = texture2D(textureIn, vUv);",
                               "t.r -= (texture2D(textureIn, vec2(vUv.r + h, vUv.g)).a - t.a)*n;",
                               "t.g -= (texture2D(textureIn, vec2(vUv.r, vUv.g + h)).a - t.a)*n;",
                               "gl_FragColor = t;",
                            "}"
                        
                    ].join("\n")

                };

PP.lib.shader.shaders.fluid_show  = {
    
                    info: {
                            name: 'Fluid show',
                            author: 'ibiblio',
                            link: 'http://www.ibiblio.org'
                    },
                        
                    uniforms:{
                        textureIn:    { type: "t", value:0, texture: null }
                    },

                    //vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    vertexShader:[

                        "varying vec2 vUv;",

                        "void main(){",
                           "gl_Position = vec4(position.xy, 0., 1.);",
                           "vUv = uv;",
                        "}"
                        
                    ].join("\n"),

                    fragmentShader: [

                              "uniform sampler2D textureIn;",
                              "varying vec2 vUv;",
                              
                            "void main() {",
                                "float T = texture2D(textureIn, vUv).b;",
                                "if(T > 0.) gl_FragColor = vec4(T, 0., 0., 1.);",
                                "else gl_FragColor = vec4(0., 0., -T, 1.);",
                            "}"
                        
                    ].join("\n")

                };
