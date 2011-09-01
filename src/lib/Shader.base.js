
PP.lib.shader.shaders.depthLinear  = {
    
                    info: {
                            name: 'Linear Depth buffer',
                            author: '@Geeks3D',
                            link: 'http://www.geeks3d.com/20091216/geexlab-how-to-visualize-the-depth-buffer-in-glsl/'
                    },
                        
                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "cameraNear":   { type: "f", value: 1.0 },
                        "cameraFar":    { type: "f", value: 100.0 }
                    },

                    controls: {
                            cameraNear:    {min:0, max: 1000, step:1},
                            cameraFar:     {min:0, max: 10000, step:1}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;", // non linear depth buffer
                        "uniform float cameraNear;",
                        "uniform float cameraFar;",

                        "float LinearizeDepth(vec2 uv){",
                          "float n = cameraNear; // camera z near",
                          "float f = cameraFar; // camera z far",
                          "float z = texture2D(textureIn, vUv).x;",
                          "return (2.0 * n) / (f + n - z * (f - n));",
                        "}",
                        
                        "void main(){",
                          "float d = LinearizeDepth(vUv.xy);",
                          "gl_FragColor = vec4(d, d, d, 1.0);",
                        "}"
                    ].join("\n")

                };
                
PP.lib.shader.shaders.treshold  = {
    
                    info: {
                            name: 'treshold',
                            author: '@rdad',
                            link: 'http://www.whiteflashwhitehit.com/'
                    },
                        
                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "treshold":     { type: "f", value: 0.001 }
                    },

                    controls: {
                            treshold:    {min:0, max: 1, step:.001}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        
                        "uniform float treshold;",
                        "uniform sampler2D textureIn;",

                        "void main(){",

                            "vec3 color = texture2D(textureIn, vUv).xyz;",
                            "vec3 black = vec3(0.0);",
                            
                            "//float intensity = (color.r + color.g + color.b) / 3.0;",
                            
                            "float intensity = max(color.r, color.g);",
                            
                            "intensity = max(intensity,color.b);",

                            "gl_FragColor = (intensity > treshold) ? vec4(intensity, intensity, intensity,1.0) : vec4(black,1.0);",

                        "}"
                    ].join("\n")

                };

