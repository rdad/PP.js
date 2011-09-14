PP.lib.shader.shaders.simplexNoise = {
    
                    info: {
                        name: 'Simplex noise',
                        author: 'Ian McEwan, Ashima Arts',
                        link: 'https://github.com/ashima/webgl-noise'
                    },
                    
                    uniforms:{
                        "textureIn":    { type: "t", value:0, texture: null },
                        "time":         { type: "f", value: 0.0},
                        "speed":        { type: "f", value: .5 },
                        "scale":        { type: "f", value: .001 },
                        "bias":         { type: "f", value: .01 }
                    },

                    controls: {
                            speed:     {min:0, max: 2, step:.01},
                            scale:     {min:0, max: .05, step:.0001},
                            bias:      {min:0, max: .5, step:.001}
                        },

                     update: function(e){

                            e.material.uniforms.time.value += this.material.uniforms.speed.value;
                     },
                     
                     vertexShader: [
                        "uniform float time;",
			"uniform float scale;",

			"varying vec3 vTexCoord3D;",
                        "varying vec2 vUv;",
			

			"void main( void ) {",

				

				"vTexCoord3D = scale * ( position.xyz + vec3( 0.0, 0.0, -time ) );",
                                "vUv = vec2( uv.x, 1.0 - uv.y );",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
                        
                     ].join("\n"),

                    fragmentShader: [

                        "varying vec3 vTexCoord3D;",
                        "varying vec2 vUv;",
                        
                        
                        "uniform float time;",
                        "uniform sampler2D textureIn;",
                        "uniform float bias;",

			"vec4 permute( vec4 x ) {",

				"return mod( ( ( x * 34.0 ) + 1.0 ) * x, 289.0 );",

			"}",

			"vec4 taylorInvSqrt( vec4 r ) {",

				"return 1.79284291400159 - 0.85373472095314 * r;",

			"}",

			"float snoise( vec3 v ) {",

				"const vec2 C = vec2( 1.0 / 6.0, 1.0 / 3.0 );",
				"const vec4 D = vec4( 0.0, 0.5, 1.0, 2.0 );",

				// First corner

				"vec3 i  = floor( v + dot( v, C.yyy ) );",
				"vec3 x0 = v - i + dot( i, C.xxx );",

				// Other corners

				"vec3 g = step( x0.yzx, x0.xyz );",
				"vec3 l = 1.0 - g;",
				"vec3 i1 = min( g.xyz, l.zxy );",
				"vec3 i2 = max( g.xyz, l.zxy );",

				//  x0 = x0 - 0. + 0.0 * C
				"vec3 x1 = x0 - i1 + 1.0 * C.xxx;",
				"vec3 x2 = x0 - i2 + 2.0 * C.xxx;",
				"vec3 x3 = x0 - 1. + 3.0 * C.xxx;",

				// Permutations

				"i = mod( i, 289.0 );",
				"vec4 p = permute( permute( permute(",
						 "i.z + vec4( 0.0, i1.z, i2.z, 1.0 ) )",
					   "+ i.y + vec4( 0.0, i1.y, i2.y, 1.0 ) )",
					   "+ i.x + vec4( 0.0, i1.x, i2.x, 1.0 ) );",

				// Gradients
				// ( N*N points uniformly over a square, mapped onto an octahedron.)

				"float n_ = 1.0 / 7.0; // N=7",

				"vec3 ns = n_ * D.wyz - D.xzx;",

				"vec4 j = p - 49.0 * floor( p * ns.z *ns.z );  //  mod(p,N*N)",

				"vec4 x_ = floor( j * ns.z );",
				"vec4 y_ = floor( j - 7.0 * x_ );    // mod(j,N)",

				"vec4 x = x_ *ns.x + ns.yyyy;",
				"vec4 y = y_ *ns.x + ns.yyyy;",
				"vec4 h = 1.0 - abs( x ) - abs( y );",

				"vec4 b0 = vec4( x.xy, y.xy );",
				"vec4 b1 = vec4( x.zw, y.zw );",

				"vec4 s0 = floor( b0 ) * 2.0 + 1.0;",
				"vec4 s1 = floor( b1 ) * 2.0 + 1.0;",
				"vec4 sh = -step( h, vec4( 0.0 ) );",

				"vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;",
				"vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;",

				"vec3 p0 = vec3( a0.xy, h.x );",
				"vec3 p1 = vec3( a0.zw, h.y );",
				"vec3 p2 = vec3( a1.xy, h.z );",
				"vec3 p3 = vec3( a1.zw, h.w );",

				// Normalise gradients

				"vec4 norm = taylorInvSqrt( vec4( dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3) ) );",
				"p0 *= norm.x;",
				"p1 *= norm.y;",
				"p2 *= norm.z;",
				"p3 *= norm.w;",

				// Mix final noise value

				"vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3) ), 0.0 );",
				"m = m * m;",
				"return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),",
											"dot(p2,x2), dot(p3,x3) ) );",

			"}",

			"float heightMap( vec3 coord ) {",

				"float n = abs( snoise( coord ) );",

				"n += 0.25   * abs( snoise( coord * 2.0 ) );",
				"n += 0.25   * abs( snoise( coord * 4.0 ) );",
				"n += 0.125  * abs( snoise( coord * 8.0 ) );",
				"n += 0.0625 * abs( snoise( coord * 16.0 ) );",

				"return n;",

			"}",

			"void main( void ) {",

				//"float n = heightMap( vec3(vUv.x, vUv.y, 0.0) );",
                                "float n = heightMap( vTexCoord3D );",
                                "vec2 disto = vec2(n,n) * bias;",
                                "vec3 c = texture2D(textureIn, vUv+disto).xyz;",

				// color

                                "gl_FragColor = vec4(c, 1.0);",

			"}"

                        
                    ].join("\n")

                };
                
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
