
PP.lib.shader.shaders.ssao = {
    
                    info: {
                        name: 'SSAO',
                        author: 'ArKano22',
                        link: 'http://www.gamedev.net/topic/556187-the-best-ssao-ive-seen/'
                    },

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            tDepth:     { type: "t", value: 1, texture: null },
                                            tNormals:   { type: "t", value: 2, texture: null },
                                            tRandom:    { type: "t", value: 3, texture: THREE.ImageUtils.loadTexture( "asset/img/random.png" ) }
                                      },

                    vertexShader: [

                        "varying mat3 projectionMatrixInverse;",
                        "varying vec2 vUv;",
                        "void main() {",
                                "//projectionMatrixInverse = mat3( projectionMatrix[0].xyz - 1.0, projectionMatrix[1].xyz - 1.0, projectionMatrix[2].xyz - 1.0 );",
                                "projectionMatrixInverse = normalMatrix;",
                                "vUv = vec2( uv.x, 1.0 - uv.y );",
                                "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
                        "}"
                    ].join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        "varying mat3 projectionMatrixInverse;",
                        
                        "uniform sampler2D tNormal;",
                        "uniform sampler2D tDepth;",
                        "uniform sampler2D textureIn;",
                        "uniform sampler2D tRandom;",
                        
                        "vec3 readNormal( in vec2 coord) {",
                            "return normalize(texture2D(tNormal, coord).xyz * 2.0 - 1.0);",
                        "}",
                        "vec3 posFromDepth(vec2 coord) {",
                            "float d = texture2D(tDepth, coord).r;",
                            "vec3 tray = mat3(projectionMatrixInverse) * vec3((coord.x - 0.5) * 2.0, (coord.y - 0.5) * 2.0, 1.0);",
                            "return tray * d;",
                        "}",
                        //Ambient Occlusion form factor:    
                        "float aoFF( in vec3 ddiff, in vec3 cnorm, in float c1, in float c2) {",
                            "vec3 vv = normalize(ddiff);",
                            "float rd = length(ddiff);",
                            "return (1.0 - clamp(dot(readNormal(vUv + vec2(c1, c2)), -vv), 0.0, 1.0)) * clamp(dot(cnorm, vv), 0.0, 1.0) * (1.0 - 1.0 / sqrt(1.0 / (rd * rd) + 1.0));",
                        "} ",
                        //GI form factor:
                        "float giFF( in vec3 ddiff, in vec3 cnorm, in float c1, in float c2) {",
                            "vec3 vv = normalize(ddiff);",
                            "float rd = length(ddiff);",
                            "return 1.0 * clamp(dot(readNormal(vUv + vec2(c1, c2)), -vv), 0.0, 1.0) * clamp(dot(cnorm, vv), 0.0, 1.0) / (rd * rd + 1.0);",
                        "}",
                        "void main() {",
                        
                            //read current normal,position and color.    
                            "vec3 n = readNormal(vUv.st);",
                            "vec3 p = posFromDepth(vUv.st);",
                            "vec3 col = texture2D(textureIn, vUv).rgb;",
                            
                            //randomization texture    
                            "vec2 fres = vec2(800.0 / 128.0 * 5.0, 600.0 / 128.0 * 5.0);",
                            "vec3 random = texture2D(tRandom, vUv.st * fres.xy).rgb;",
                            "random = random * 2.0 - vec3(1.0);", 
                            
                            // initialize variables:    
                            "float ao = 0.0;",    
                            "vec3 gi = vec3(0.0,0.0,0.0);",    
                            "float incx = 1.0/800.0*0.1;",    
                            "float incy = 1.0/600.0*0.1;",    
                            "float pw = incx;",    
                            "float ph = incy;",    
                            "float cdepth = texture2D(tDepth, vUv).r;",  
                            
                            //3 rounds of 8 samples each.     
                            "for (float i = 0.0; i < 3.0; ++i) {",
                                "float npw = (pw + 0.0007 * random.x) / cdepth;",
                                "float nph = (ph + 0.0007 * random.y) / cdepth;",
                                
                                "vec3 ddiff = posFromDepth(vUv.st + vec2(npw, nph)) - p;",
                                "vec3 ddiff2 = posFromDepth(vUv.st + vec2(npw, -nph)) - p;",
                                "vec3 ddiff3 = posFromDepth(vUv.st + vec2(-npw, nph)) - p;",
                                "vec3 ddiff4 = posFromDepth(vUv.st + vec2(-npw, -nph)) - p;",
                                "vec3 ddiff5 = posFromDepth(vUv.st + vec2(0, nph)) - p;",
                                "vec3 ddiff6 = posFromDepth(vUv.st + vec2(0, -nph)) - p;",
                                "vec3 ddiff7 = posFromDepth(vUv.st + vec2(npw, 0)) - p;",
                                "vec3 ddiff8 = posFromDepth(vUv.st + vec2(-npw, 0)) - p;",
                                
                                "ao += aoFF(ddiff, n, npw, nph);",
                                "ao += aoFF(ddiff2, n, npw, -nph);",
                                "ao += aoFF(ddiff3, n, -npw, nph);",
                                "ao += aoFF(ddiff4, n, -npw, -nph);",
                                "ao += aoFF(ddiff5, n, 0.0, nph);",
                                "ao += aoFF(ddiff6, n, 0.0, -nph);",
                                "ao += aoFF(ddiff7, n, npw, 0.0);",
                                "ao += aoFF(ddiff8, n, -npw, 0.0);",
                                "gi += giFF(ddiff, n, npw, nph) * texture2D(textureIn, vUv + vec2(npw, nph)).rgb;",
                                "gi += giFF(ddiff2, n, npw, -nph) * texture2D(textureIn, vUv + vec2(npw, -nph)).rgb;",
                                "gi += giFF(ddiff3, n, -npw, nph) * texture2D(textureIn, vUv + vec2(-npw, nph)).rgb;",
                                "gi += giFF(ddiff4, n, -npw, -nph) * texture2D(textureIn, vUv + vec2(-npw, -nph)).rgb;",
                                "gi += giFF(ddiff5, n, 0.0, nph) * texture2D(textureIn, vUv + vec2(0.0, nph)).rgb;",
                                "gi += giFF(ddiff6, n, 0.0, -nph) * texture2D(textureIn, vUv + vec2(0.0, -nph)).rgb;",
                                "gi += giFF(ddiff7, n, npw, 0.0) * texture2D(textureIn, vUv + vec2(npw, 0.0)).rgb;",
                                "gi += giFF(ddiff8, n, -npw, 0.0) * texture2D(textureIn, vUv + vec2(-npw, 0.0)).rgb;",
                                
                                //increase sampling area:       
                                "pw += incx;",        
                                "ph += incy;",        
                            "}",    
                            "ao/=24.0;",    
                            "gi/=24.0;",    
                            "gl_FragColor = vec4(col-vec3(ao)+gi*5.0,1.0);",
                        "}"

                    ].join("\n")
                
                };


PP.lib.shader.shaders.bokeh = {
    
                    info: {
                        name: 'Depth-of-field shader with bokeh',
                        author: 'Altered Qualia, ported from GLSL shader by Martins Upitis',
                        link: 'http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html'
                    },

                    uniforms: {             textureIn:    { type: "t", value: 0, texture: null },
                                            tDepth:   { type: "t", value: 1, texture: null },
                                            focus:    { type: "f", value: 1.0 },
                                            aspect:   { type: "f", value: PP.config.dimension.width / PP.config.dimension.height },
                                            aperture: { type: "f", value: 0.025 },
                                            maxblur:  { type: "f", value: 1.0 }
                                      },

                    controls: {
                                focus:      {start:1.0,     min:0, max: 2, step:.2},
                                aperture:   {start:0.025,   min:0, max: .5, step:.01},
                                maxblur:    {start:1.0,     min:0, max: 5.0, step:.5}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                    "varying vec2 vUv;",

                    "uniform sampler2D textureIn;",
                    "uniform sampler2D tDepth;",

                    "uniform float maxblur;",  	// max blur amount
                    "uniform float aperture;",	// aperture - bigger values for shallower depth of field

                    "uniform float focus;",
                    "uniform float aspect;",

                    "void main() {",

                    "vec2 aspectcorrect = vec2( 1.0, aspect );",

                    "vec4 depth1 = texture2D( tDepth, vUv );",

                    "float factor = depth1.x - focus;",

                    "vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );",

                    "vec2 dofblur9 = dofblur * 0.9;",
                    "vec2 dofblur7 = dofblur * 0.7;",
                    "vec2 dofblur4 = dofblur * 0.4;",

                    "vec4 col = vec4( 0.0 );",

                    "col += texture2D( textureIn, vUv.xy );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );",

                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",		
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",		
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",		
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",	

                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );",

                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
                    "col += texture2D( textureIn, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",	
                    "col += texture2D( textureIn, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );",

                    "gl_FragColor = col / 41.0;",
                    "gl_FragColor.a = 1.0;",

                    "}"

                    ].join("\n")
                
                };


PP.lib.shader.shaders.unsharpMasking = {

                    info: {
                        name: 'unsharp masking',
                        author: 'ported by thierry tranchina aka @rDad',
                        link: 'http://graphics.uni-konstanz.de/publikationen/2006/unsharp_masking/webseite/'
                    },

                    uniforms:{
                        "tDepth":       { type: "t", value:2, texture: null },
                        "tBlur":        { type: "t", value:1, texture: null },
                        "textureIn":    { type: "t", value:0, texture: null },
                        "bias":         { type: "f", value: -1.0 }
                    },
                    
                    controls: {
                            bias:      { min:-10, max: 10, step:.5}
                    },
                    
                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",

                        "uniform float bias;",
                        "uniform sampler2D tDepth;",
                        "uniform sampler2D tBlur;",
                        "uniform sampler2D textureIn;",

                        "void main() {",

                            "vec4 tex_depth = texture2D( tDepth, vUv );",
                            "vec4 tex_blur  = texture2D( tBlur, vUv );",
                            "vec4 tex_color = texture2D( textureIn, vUv );",

                            "vec3 spatial_imp = tex_blur.rgb - tex_depth.rgb;",

                            "vec3 final = tex_color.rgb;",
                            "if(spatial_imp.r>0.0)",
                            "{",
                                "final += spatial_imp * bias;",
                            "}",

                          "gl_FragColor = vec4(final, 1.0);",

                        "}",
                    
                    ].join("\n")

                };

