
/* -------------------------------------------------------------------------
// name:    motion blur
// author:  by iq/rgba
 ------------------------------------------------------------------------- */

PP.lib.shader.shaders.blurMotion= {
    
                    info: {
                        name: 'motion blur',
                        author: 'Inigo Quilez aka iq/rgba',
                        link: 'http://www.iquilezles.org/apps/shadertoy/'
                    },

                    uniforms:{
                        "textureIn":        { type: "t", value:0, texture: null },
                        "resolution":   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                        "time":         { type: "f", value: 0.0},
                        "speed":        { type: "f", value: 0.01}
                    },
                    
                     controls: {
                                    speed:    {min:0, max: .2, step:.0001}
                              },

                    variable: {
                            delta: 1
                        },
                        
                    update: function(e){

                        e.material.uniforms.time.value += e.variable.delta * e.material.uniforms.speed.value;
                        
                        if ( e.material.uniforms.time.value > 10 || e.material.uniforms.time.value < 0 )
                        {
                            e.variable.delta *= -1;
                        }

                    },
                    
                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform vec2 resolution;",
                        "uniform float time;",
                        "uniform sampler2D textureIn;",

                        "vec3 deform( in vec2 p, float scale ){",
                            "vec2 uv;",

                            "float mtime = scale+time;",
                            "float a = atan(p.y,p.x);",
                            "float r = sqrt(dot(p,p));",
                            "float s = r * (1.0+0.5*cos(mtime*1.7));",

                            "uv.x = .1*mtime +.05*p.y+.05*cos(-mtime+a*3.0)/s;",
                            "uv.y = .1*mtime +.05*p.x+.05*sin(-mtime+a*3.0)/s;",

                            "float w = 0.8-0.2*cos(mtime+3.0*a);",

                            "vec3 res = texture2D(textureIn,uv).xyz*w;",
                            "return  res*res;",

                        "}",

                        "void main()",
                        "{",
                            "vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
                            "vec3 total = vec3(0.0);",
                            "float w = 0.0;",
                            "for( int i=0; i<20; i++ )",
                            "{",
                                "vec3 res = deform(p,w);",
                                "total += res;",
                                "w += 0.02;",
                            "}",
                            "total /= 20.0;",

                            "gl_FragColor = vec4( 3.0*total,1.0);",
                        "}"
                    ].join("\n")

                };



PP.lib.shader.shaders.blurRadial= {
    
                    info: {
                        name: 'radial blur',
                        author: 'Inigo Quilez aka iq/rgba',
                        link: 'http://www.iquilezles.org/apps/shadertoy/'
                    },

                    uniforms:{
                        "textureIn":        { type: "t", value:0, texture: null },
                        "resolution":   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height )},
                        "time":         { type: "f", value: 0.0}
                    },

                    update: function(e){

                            e.material.uniforms.time.value += .01;
                    },
                    
                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "uniform vec2 resolution;",
                        "uniform float time;",
                        "uniform sampler2D textureIn;",
                        

                        "vec3 deform( in vec2 p ){",
                        
                            "vec2 muv;",

                            "vec2 q = vec2( sin(1.1*time+p.x),sin(1.2*time+p.y) );",

                            "float a = atan(q.y,q.x);",
                            "float r = sqrt(dot(q,q));",

                            "muv.x = sin(0.0+1.0*time)+p.x*sqrt(r*r+1.0);",
                            "muv.y = sin(0.6+1.1*time)+p.y*sqrt(r*r+1.0);",

                            "return texture2D(textureIn,muv*.5).xyz;",
                        "}",

                        "void main()",
                        "{",
                            "vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;",
                            "vec2 s = p;",

                            "vec3 total = vec3(0.0);",
                            "vec2 d = (vec2(0.0,0.0)-p)/20.0;",
                            "float w = 1.0;",
                            "for( int i=0; i<20; i++ )",
                            "{",
                                "vec3 res = deform(s);",
                                "res = smoothstep(0.1,1.0,res*res);",
                                "total += w*res;",
                                "w *= .99;",
                                "s += d;",
                            "}",
                            "total /= 20.0;",
                            "float r = 1.5/(1.0+dot(p,p));",
                            "gl_FragColor = vec4( total*r,1.0);",
                        "}"
                    ].join("\n")

                };
/*
 * @author: Evan Wallace
 * @link: https://github.com/evanw
 *
 **/
PP.lib.shader.shaders.blurZoom  = {
    
                    info: {
                        name: 'zoom blur',
                        author: 'Evan Wallace',
                        link: 'https://github.com/evanw/glfx.js'
                    },

                    uniforms: {     textureIn:      { type: "t", value: 0, texture: null },
                                    position:   { type: "v2", value: new THREE.Vector2( PP.config.dimension.width/2, PP.config.dimension.height/2 ) },
                                    strength:   { type: "f", value: 0.0 },
                                    resolution:    { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height ) }
                              },

                    controls: {
                                    strength:    {min:0, max: 1, step:.05},
                                    position:    {}
                              },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform vec2 position;",
                        "uniform float strength;",
                        "uniform vec2 resolution;",
                        
                        "float random(vec3 scale, float seed) {",
                            "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
                        "}",

                        "void main() {",
                            "vec4 color = vec4(0.0);",
                            "float total = 0.0;",
                            "vec2 toCenter = position - vUv * resolution;",

                            "/* randomize the lookup values to hide the fixed number of samples */",
                            "float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);",

                            "for (float t = 0.0; t <= 40.0; t++) {",
                                "float percent = (t + offset) / 40.0;",
                                "float weight = 4.0 * (percent - percent * percent);",
                                "color += texture2D(textureIn, vUv + toCenter * percent * strength / resolution) * weight;",
                                "total += weight;",
                            "}",
                            "gl_FragColor = color / total;",
                        "}"

                    ].join("\n")
                
                };



PP.lib.shader.shaders.blurTriangleX  = {
    
                    info: {
                        name: 'triangle blur (pass 1)',
                        author: 'Evan Wallace',
                        link: 'https://github.com/evanw/glfx.js'
                    },

                    uniforms: {     textureIn:      { type: "t", value: 0, texture: null },
                                    radius:         { type: "f", value: 0.0 },
                                    resolutionW:    { type: "f", value: PP.config.dimension.width }
                              },

                    controls: {
                                    radius:     {min:0, max: 200, step:.05}
                              },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float radius;",
                        "uniform float resolutionW;",
                        
                        "float random(vec3 scale, float seed) {",
                            "/* use the fragment position for a different seed per-pixel */",
                            "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
                        "}",

                        "void main() {",
                            "vec4 color = vec4(0.0);",
                            "float total = 0.0;",
                            "vec2 delta = vec2(radius / resolutionW, 0);",

                            "/* randomize the lookup values to hide the fixed number of samples */",
                            "float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);",

                            "for (float t = -30.0; t <= 30.0; t++) {",
                                "float percent = (t + offset - 0.5) / 30.0;",
                                "float weight = 1.0 - abs(percent);",
                                "color += texture2D(textureIn, vUv + delta * percent) * weight;",
                                "total += weight;",
                            "}",
                            "gl_FragColor = color / total;",
                        "}",

                    ].join("\n")
                
                };


PP.lib.shader.shaders.blurTriangleY  = {
    
                    info: {
                        name: 'triangle blur (pass 2)',
                        author: 'Evan Wallace',
                        link: 'https://github.com/evanw/glfx.js'
                    },

                    uniforms: {     textureIn:      { type: "t", value: 0, texture: null },
                                    radius:         { type: "f", value: 0.0 },
                                    resolutionH:    { type: "f", value: PP.config.dimension.height }
                              },

                    controls: {
                                    radius:     {min:0, max: 200, step:.05}
                              },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float radius;",
                        "uniform float resolutionH;",
                        
                        "float randomy(vec3 scale, float seed) {",
                            "/* use the fragment position for a different seed per-pixel */",
                            "return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
                        "}",

                        "void main() {",
                            "vec4 color = vec4(0.0);",
                            "float total = 0.0;",
                            "vec2 delta = vec2(0, radius / resolutionH);",

                            "/* randomize the lookup values to hide the fixed number of samples */",
                            "float offset = randomy(vec3(12.9898, 78.233, 151.7182), 0.0);",

                            "for (float t = -30.0; t <= 30.0; t++) {",
                                "float percent = (t + offset - 0.5) / 30.0;",
                                "float weight = 1.0 - abs(percent);",
                                "color += texture2D(textureIn, vUv + delta * percent) * weight;",
                                "total += weight;",
                            "}",
                            "gl_FragColor = color / total;",
                        "}",

                    ].join("\n")
                
                };
                
                
PP.lib.shader.shaders.heat  = {
    
                        info: {
                            name: 'heat',
                            author: '@alteredq',
                            link: 'http://alteredqualia.com/'
                        },
                        
                        uniforms: {
                            "textureIn":                { type: "t", value:0, texture: null },
                            "resolution":               { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height ) },
                            "vingeNetOffset":           { type: "f", value: 0.8 },
                            "vingeNetDark":             { type: "f", value: 0.25 },
                            "sampleDistance":           { type: "f", value: 0.94 },
                            "waveFactor":               { type: "f", value: 0.00125 }
                        },

                        controls: {
                            sampleDistance:             {min:0, max: 4.0, step:.1},
                            waveFactor:                 {min:0, max: .05, step:.001},
                            vingeNetOffset:             {min:0, max: 2.0, step:.2},
                            vingeNetDark:               {min:0, max: 2.0, step:.2}
                        },

			vertexShader: PP.lib.vextexShaderBase.join("\n"),

			fragmentShader: [
 
                                "uniform vec2 resolution;",
				"uniform float vingeNetOffset;",
				"uniform float vingeNetDark;",
				"uniform float sampleDistance;",
				"uniform float waveFactor;",

				"uniform sampler2D textureIn;",
				"varying vec2 vUv;",

				"void main() {",

					"vec4 color, org, tmp, add;",
					"float sample_dist, f;",
					"vec2 vin;",
					"vec2 uv = vUv;",

					"add += color = org = texture2D( textureIn, uv );",

					"vin = (uv - vec2(0.5)) * vec2( 1.4 /*vingeNetOffset * 2.0*/);",
					"sample_dist =(dot( vin, vin ) * 2.0);",

					"f = (waveFactor * 100.0 + sample_dist) * sampleDistance * 4.0;",

					"vec2 sampleSize = vec2(  1.0 / resolution.x, 1.0 / resolution.y ) * vec2(f);",

					"add += tmp = texture2D( textureIn, uv + vec2(0.111964, 0.993712) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(0.846724, 0.532032) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(0.943883, -0.330279) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(0.330279, -0.943883) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(-0.532032, -0.846724) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(-0.993712, -0.111964) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"add += tmp = texture2D( textureIn, uv + vec2(-0.707107, 0.707107) * sampleSize);",
					"if( tmp.b < color.b ) color = tmp;",

					"uv = (uv - vec2(0.5)) * vec2( vingeNetOffset );",
					"color = color * vec4(2.0) - (add / vec4(8.0));",
					"color = color + (add / vec4(8.0) - color) * (vec4(1.0) - vec4(sample_dist * 0.5));",

					"gl_FragColor = vec4( mix(color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, vec3( 0.0 ) - vec3( vingeNetDark ), vec3( dot( uv, uv ))), 1.0 );",
				"}"

			].join("\n")

		};