
PP.lib.shader.shaders.cellShading = {
    
                    info: {
                        name: 'Cell shading',
                        author: 'Adrien Debesson',
                        link: 'http://gamedev.dreamnoid.com/2009/03/11/cel-shading-en-glsl/'
                    },

                    uniforms:{
                        "textureIn":  { type: "t", value:0, texture: null }
                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform sampler2D textureIn;",
                        "varying vec2 vUv;",
                        "varying vec3 Normal;",
                        "uniform vec3 LightDir;",
                        
                        "vec4 CelShading ( vec4 color ){",

                            "float Intensity = dot( LightDir , normalize(Normal) );",
                            "float factor = 1.0;",
                            "if ( Intensity < 0.5 ) factor = 0.5;",
                            
                            /*float factor = 0.5;

                            if      ( Intensity > 0.95 ) factor = 1.0;
                            else if ( Intensity > 0.5  ) factor = 0.7;
                            else if ( Intensity > 0.25 ) factor = 0.4;*/

                            "color *= vec4 ( factor, factor, factor, 1.0 );",

                            "return color;",

                        "}",
                        
                        "void main (void){",

                            "vec4 color = texture2D( textureIn , vec2( vUv ) );",
                            "color = CelShading ( color );",
                            "gl_FragColor = color;",

                        "}"
			].join("\n")

                };
                
PP.lib.shader.shaders.crossHatch = {
    
                    info: {
                        name: 'Cross hatch',
                        author: '@gpjt',
                        link: 'http://learningwebgl.com/blog/?p=2858'
                    },

                    uniforms:{
                        "textureIn":  { type: "t", value:0, texture: null }
                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform sampler2D textureIn;",
                        "varying vec2 vUv;",
                        
                        "void main() {",

                                "float lum = length(texture2D(textureIn, vUv.xy).rgb);",

                                "vec4 hatch = vec4(1.0);",
                                "vec4 bg    = vec4(0.0, 0.0, 0.0, 1.0);",
                                "vec4 color = bg;",

                                "if (lum < 1.00) {",
                                        "if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {",
                                                "color = hatch;",
                                        "}",
                                "}",

                                "if (lum < 0.75) {",
                                        "if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {",
                                                "color = hatch;",
                                        "}",
                                "}",

                                "if (lum < 0.50) {",
                                        "if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {",
                                                "color = hatch;",
                                        "}",
                                "}",

                                "if (lum < 0.3) {",
                                        "if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {",
                                                "color = hatch;",
                                        "}",
                                "}",
                                
                                "if (lum == 0.0) {",
                                        "color = bg;",
                                "}",
                                
                                "gl_FragColor = color;",
                        "}"
			].join("\n")

                };
                
PP.lib.shader.shaders.dotScreen = {
    
                    info: {
                        name: 'Dot screen',
                        author: '@EvanUltraVegas (Evan Wallace) from webgl-filter',
                        link: 'https://github.com/evanw/glfx.js'
                    },

                    uniforms:{
                        "textureIn":  { type: "t", value:0, texture: null },
                        "angle":    { type: "f", value: 0.5},
                        "size":     { type: "f", value: 0.75},
                        "texSize":  { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                        "useColor": { type: "int", value: 0 }
                    },

                    controls: {
                        angle:      {start:0.5,     min:-1, max: 1, step:.02},
                        size:       {start:0.75,   min:0, max: 1, step:.01},
                        useColor:   {start:0,   min:0, max: 1, step:1}
                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform sampler2D textureIn;",
                        "uniform float angle;",
                        "uniform float size;",
                        "uniform vec2 texSize;",
                        "uniform int useColor;",
                        "varying vec2 vUv;",
                        "void main() {",
                            "vec3 color = texture2D(textureIn, vUv).rgb;",
                            "float s = sin(angle), c = cos(angle);",
                            "vec2 tex = vUv * texSize;",
                            "vec2 point = vec2(",
                                "c * tex.x - s * tex.y,",
                                "s * tex.x + c * tex.y",
                            ") * size;",
                            "float weight = (sin(point.x) * sin(point.y)) * 2.0;",
                            "float average = (color.r + color.g + color.b) / 3.0;",
                            "if(useColor==0){",
                                "color = vec3(average + (average - 0.6) * 4.0 + weight);",
                            "}else{",
                                "color.r = color.r + (color.r - 0.6) * 4.0 + weight;",
                                "color.g = color.g + (color.g - 0.6) * 4.0 + weight;",
                                "color.b = color.b + (color.b - 0.6) * 4.0 + weight;",
                            "}",
                            "gl_FragColor = vec4(color, 1.0);}"
			].join("\n")

                };


/*
 * name: posterize
 * @author: Agnius Vasiliauskas
 */
PP.lib.shader.shaders.posterize  = {
    
                    info: {
                        author: 'Agnius Vasiliauskas',
                        link: 'http://coding-experiments.blogspot.com'
                    },

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            gamma:      { type: "f", value: .6 },
                                            numColors:  { type: "f", value: 8.0 }
                              },
                    
                     controls: {
                                gamma:      {min:0, max: 2, step:.1},
                                numColors:  {min:1, max: 20, step:1}
                        },


                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                       
                        "uniform sampler2D textureIn;",                      
                        "uniform float gamma;", // 0.6
                        "uniform float numColors;", // 8.0
                        
                        "void main(){",
                          "vec3 c = texture2D(textureIn, vUv.xy).rgb;",
                          "c = pow(c, vec3(gamma, gamma, gamma));",
                          "c = c * numColors;",
                          "c = floor(c);",
                          "c = c / numColors;",
                          "c = pow(c, vec3(1.0/gamma));",
                          "gl_FragColor = vec4(c, 1.0);",
                        "}"

                    ].join("\n")
                
                };

/*
 * name: pixelate
 * @author: Agnius Vasiliauskas
 */
PP.lib.shader.shaders.pixelate  = {
    
                    info: {
                        author: 'Agnius Vasiliauskas',
                        link: 'http://coding-experiments.blogspot.com'
                    },

                    uniforms: {             textureIn:      { type: "t", value: 0, texture: null },
                                            pixelX:     { type: "f", value: 10.0 },
                                            pixelY:     { type: "f", value: 10.0 },
                                            texSize:    { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height ) }
                              },
                    
                     controls: {
                                pixelX:    {min:1, max: 50, step:1.0},
                                pixelY:    {min:1, max: 50, step:1.0}
                        },


                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                       
                        "uniform sampler2D textureIn;",
                        "uniform vec2 texSize;",
                        "uniform float pixelX;",
                        "uniform float pixelY;",
                        
                        "void main(){",
                          "vec2 uv = vUv.xy;",

                          "vec3 tc = vec3(1.0, 0.0, 0.0);",
                          "float dx = pixelX*(1./texSize.x);",
                          "float dy = pixelY*(1./texSize.y);",
                          "vec2 coord = vec2(dx*floor(uv.x/dx), dy*floor(uv.y/dy));",
                          "tc = texture2D(textureIn, coord).rgb;",
                          
                          "gl_FragColor = vec4(tc, 1.0);",
                        "}"

                    ].join("\n")
                
                };
     
PP.lib.shader.shaders.halfTone  = {

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            scale:      { type: "f", value: 0.75 },
                                            angle:      { type: "f", value: 0.5 },
                                            center:    { type: "v2", value: new THREE.Vector2( PP.config.dimension.width/2,PP.config.dimension.height/2 ) },
                                            texSize:    { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height ) }
                                      },

                    controls: {
                                angle:      {min:-1, max: 1, step:.02},
                                scale:      {min:0, max: 1, step:.01},
                                center:     {}
                        },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform vec2 center;",
                        "uniform float angle;",
                        "uniform float scale;",
                        "uniform vec2 texSize;",

                        "float pattern(float angle) {",
                            "float s = sin(angle), c = cos(angle);",
                            "vec2 tex = vUv * texSize - center;",
                            "vec2 point = vec2(",
                                "c * tex.x - s * tex.y,",
                                "s * tex.x + c * tex.y",
                            ") * scale;",
                            "return (sin(point.x) * sin(point.y)) * 4.0;",
                        "}",
    
                        "void main() {",
                            "vec4 color = texture2D(textureIn, vUv);",
                            "vec3 cmy = 1.0 - color.rgb;",
                            "float k = min(cmy.x, min(cmy.y, cmy.z));",
                            "cmy = (cmy - k) / (1.0 - k);",
                            "cmy = clamp(cmy * 10.0 - 3.0 + vec3(pattern(angle + 0.26179), pattern(angle + 1.30899), pattern(angle)), 0.0, 1.0);",
                            "k = clamp(k * 10.0 - 5.0 + pattern(angle + 0.78539), 0.0, 1.0);",
                            "gl_FragColor = vec4(1.0 - cmy - k, color.a);",
                            "}",

                    ].join("\n")
                
                };

    

