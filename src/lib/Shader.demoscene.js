
// http://www.chromeexperiments.com/detail/b-webgl-test/?f=


/*
 * name: meta cloud
 * @author: rle / rale at palkki.org
 * @link: http://traction.untergrund.net/slamdown/
 */
PP.lib.shader.shaders.metaCloud  = {

                    info: {
                        author: 'rle / rale at palkki.org',
                        link: 'http://traction.untergrund.net/slamdown/'
                    },

                    uniforms: {             time:       { type: "f", value: 0.0 },
                                            signal:     { type: "f", value: 0.0 }
                              },


                     update: function(e){
                        e.material.uniforms.time.value += .001;
                    },

                    vertexShader: [

                        "uniform float time;",
                        "varying vec2 vUv;",
                        "varying vec4 v;",
                        "varying vec3 p, d, lx, ly;",
                        "void main() {",
                            "v = vec4(time);",
                            "vec3 up = vec3(0., 1., 0.);",
                            "p = vec3(0., 0., -5.);",
                            "d = vec3(0., 0., 1.);",
                            "lx = normalize(cross(d, up));",
                            "ly = normalize(cross(-d, lx));",
                            "gl_Position = vec4(position, 1.);",
                            "vUv = position.xy * .5 + .5;",
                        "}"

                    ].join("\n"),

                    fragmentShader: [

                        "varying vec4 v;",
                        "const float pi = 3.14159;",
                        "#define R(p, a) p = cos(a) * p + sin(a) * vec2(p.y, -p.x)",
                        "uniform float signal;",
                        "varying vec2 vUv;",

                        "float pn(vec3 p) {",
                            "vec3 i = floor(p);",
                            "vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);",
                            "vec3 f = cos((p - i) * pi) * -.5 + .5;",
                            "a = mix(sin(cos(a) * a), sin(cos(1. + a) * (1. + a)), f.x);",
                            "a.xy = mix(a.xz, a.yw, f.y);",
                            "return mix(a.x, a.y, f.z);",
                        "}",
                        "float fpn(vec3 p) {",
                            "return pn(p * .06125) * .5 + pn(p * .125) * .25 + pn(p * .25) * .125;",
                        "}",
                        "float ba(vec3 p) {",
                            "float tt = v.z * 4. + signal * .125 + .2, val = 0.;",
                            "for (float f = 0.; f < 7.; f += 1.) {",
                                "vec3 pp = p + vec3(sin(f * 2. + tt) * 1.4, cos(f + tt), sin(f * .8 + tt)) * 3.;",
                                "float value = length(pp) - 2.5 - f * .14;",
                                "val += min(.15, value);",
                            "}",
                            "return val;",
                        "}",
                        "float simplef(vec3 p) {",
                            "return p.z += 9., R(p.xy, v.z), R(p.xz, v.z), ba(p);",
                        "}",
                        "float f(vec3 p) {",
                            "return p.z += 9., R(p.xy, v.z), R(p.xz, v.z), ba(p) + fpn(p * 50. + v.z * 60.) * .45;",
                        "}",
                        "vec3 g(vec3 p) {",
                            "vec2 e = vec2(.0001, 0.);",
                            "return normalize(vec3(f(p + e.xyy) - f(p - e.xyy), f(p + e.yxy) - f(p - e.yxy), f(p + e.yyx) - f(p - e.yyx)));",
                        "}",

                        "void main() {",
                            "vec3 p = vec3(0., 0., 3.5), d = vec3((vUv.xy - vec2(.5)) * vec2(2.), 0.) - p;",
                            "d = normalize(d);",
                            "float ld, td = 0., w;",
                            "vec3 tc = vec3(.5, .5, .5);",
                            "float r = 0., l = 0., b = 0.;",
                            "for (float i = 0.; i < 1.; i += 1. / 64.) {",
                                "l = f(p) * .5;",
                                "if (l < .05) ld = .05 - l, w = (1. - td) * ld, tc -= w * 1.052, td += w;",
                                "td += .01;",
                                "l = max(l, .005);",
                                "p += l * d;",
                                "r += l;",
                                "if (l <= .001 * r || r > 50. || td > .95) break;",
                            "}",
                            "tc = pow(tc, vec3(.8)) * vec3(.971, .971, 1.);",
                            "vec3 neg = vec3(1.0 - tc.r, 1.0 - tc.g, 1.0 - tc.b);",
                            "gl_FragColor = vec4(neg, 1.);",
                        "}"

                    ].join("\n")

                };




/*
 * name: magnetic field
 * @author: Saku Tiainen
 * @link: http://www.byterapers.com/suckho/webgl/test02/index.html
 */
PP.lib.shader.shaders.magneticField  = {
    
                    info: {
                        author: 'Saku Tiainen',
                        link: 'http://www.byterapers.com/suckho/webgl/test02/index.html'
                    },

                    uniforms: {             textureIn:  { type: "t", value: 0, texture: null },
                                            time:       { type: "f", value: 0.0 },
                                            amplitude:  { type: "f", value: 1.0 }
                              },

                    controls: {
                                amplitude:   {min:0, max: 20, step:.5}
                        },

                    
                     update: function(e){
                        e.material.uniforms.time.value += e.material.uniforms.amplitude.value;
                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float time;",

                        "void main(){",
                                "vec2 sum, v;",
                                "float l;",
                                "float t = time*3.0 + 54162.5136;",

                                "float str0 = 1.0;",
                                "float str1 = -1.0;",
                                "float str2 = 1.0;",
                                "float str3 = -1.0;",
                                
                                "vec2 u_pos0 = vec2(0.75*sin(t*0.00061554), 0.75*sin(t*0.00091645));",
                                "vec2 u_pos1 = vec2(0.75*sin(t*0.00071354), 0.75*sin(t*0.00081589));",
                                "vec2 u_pos2 = vec2(0.75*sin(t*0.00035789), 0.75*sin(t*0.00044575));",
                                "vec2 u_pos3 = vec2(0.75*sin(t*0.00029751), 0.75*sin(t*0.00057934));",

                                "sum += normalize(u_pos0.xy-vUv.xy)*str0;",
                                "sum += normalize(u_pos1.xy-vUv.xy)*str1;",
                                "sum += normalize(u_pos2.xy-vUv.xy)*str2;",
                                "sum += normalize(u_pos3.xy-vUv.xy)*str3;",

                                "vec2 uv = sum * 0.3;",

                                "l = pow(min(length(sum), 1.0), 0.5);",

                                "gl_FragColor = vec4(l*texture2D(textureIn, uv).rgb, 1.0);",
                        "}"

                    ].join("\n")
                
                };
                
                
/*
 * name: Muljuttelu
 * @author: Saku Tiainen
 * @link: http://www.byterapers.com/suckho/webgl/test01/index.html
 */
PP.lib.shader.shaders.muljuttelu  = {
    
                    info: {
                        author: 'Saku Tiainen',
                        link: 'http://www.byterapers.com/suckho/webgl/test01/index.html'
                    },

                    uniforms: {             textureIn:      { type: "t", value: 0, texture: null },
                                            time:           { type: "f", value: 0.0 },
                                            radius:         { type: "f", value: 1.0 },
                                            angle:          { type: "f", value: 1.0 },
                                            positionX:      { type: "f", value: PP.config.dimension.width /2 },
                                            positionY:      { type: "f", value: PP.config.dimension.height /2 },
                                            amplitude:      { type: "f", value: 1.0 }
                                      },

                    controls: {
                                positionX:   {min:0, max: PP.config.dimension.width, step:.05},
                                positionY:   {min:0, max: PP.config.dimension.height, step:.05},
                                radius:     { min:0, max: 100, step:1 },
                                angle:      { min:0, max: 100, step:1 },
                                amplitude:  { min:0, max: 10, step:.5 }
                        },
                    
                     update: function(e){

                        e.material.uniforms.time.value += e.material.uniforms.amplitude.value;
                        var t = e.material.uniforms.time.value;
                        
                        e.material.uniforms.positionX.value = 0.75 * Math.sin(t*0.0005159);
			e.material.uniforms.positionY.value = 0.75 * Math.sin(t*0.0008985);
			
			e.material.uniforms.radius.value = Math.sin(t*0.001165)*Math.sin(t*0.00062767);
			e.material.uniforms.angle.value = Math.sin(t*0.00016421)*5.0 + Math.sin(t*0.00031347)*3.0 + Math.sin(t*0.0015513)*1.0;

                        //f0 radius wobble: sin(t*0.001165)*sin(t*0.00062767)
                        //f1 angle wobble: sin(t*0.00016421)*5.0 + sin(t*0.00031347)*3.0 + sin(t*0.0015513)*1.0
                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float time;",
                        "uniform float positionX;",
                        "uniform float positionY;",	//position offset: vec2(0.75*sin(t*0.0005159), 0.75*sin(t*0.0008985));
                        "uniform float radius;",	//f0 radius wobble: sin(t*0.001165)*sin(t*0.00062767)
                        "uniform float angle;",		//f1 angle wobble: sin(t*0.00016421)*5.0 + sin(t*0.00031347)*3.0 + sin(t*0.0015513)*1.0


                        "void main(){",
                                "vec2 position = vec2(positionX, positionY);",
                                "float t = time + 35431.53190;",
                                "vec2 pos = vUv.xy + position;",
                                "float r = (pos.x*pos.x + pos.y*pos.y) * radius * 0.5;",
                                "float f_r = sin(r*15.0 + t*0.0085787);",
                                "r = r * (1.0+0.2*f_r);",

                                "float an = atan(pos.y, pos.x) + angle;",

                                "float f_an = sin(an*5.0);",
                                "vec2 muv = (vUv.xy * (r + (0.4+0.3*f_an) ))*0.75 + vec2(0.5,0.5);",

                                //float l = clamp(1.0+0.5*f_an*f_r, 0.5, 1.2);
                                "float l = 0.75+0.3*f_an*f_r;",

                                "gl_FragColor = vec4(l*texture2D(textureIn, muv).rgb, 1.0);",
                        "}"

                    ].join("\n")
                
                };
                
PP.lib.shader.shaders.nautilus  = {

                    uniforms: {             textureIn:      { type: "t", value: 0, texture: null },
                                            time:       { type: "f", value: 0.0 },
                                            resolution: { type: "v2", value: new THREE.Vector2( PP.config.dimension.width, PP.config.dimension.height ) },
                                            mouseX:     { type: "f", value: PP.config.dimension.width /2 },
                                            mouseY:     { type: "f", value: PP.config.dimension.height /2 }
                                      },

                    controls: {
                                mouseX: {min:0, max: PP.config.dimension.width, step:.05},
                                mouseY:   {min:0, max: PP.config.dimension.height, step:.05},
                                time:     { min:0, max: 100, step:1 }
                        },
                    
                     update: function(e){

                        e.material.uniforms.time.value += .5;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [
                        
                        "varying vec2 vUv;",
                        
                        "uniform sampler2D textureIn;",
                        "uniform float time;",
                        "uniform float mouseX;",
                        "uniform float mouseY;",
                        "uniform vec2 resolution;",

                        "float e(vec3 c){",
                            "c=cos(vec3(cos(c.r+time/6.0)*c.r-cos(c.g*3.0+time/5.0)*c.g, cos(time/4.0)*c.b/3.0*c.r-cos(time/7.0)*c.g, c.r+c.g+c.b+time));",
                            "return dot(c*c,vec3(1.0))-1.0;",
                        "}",

                        "void main(){",
                            "vec2 c=-1.0+2.0*gl_FragCoord.xy/resolution.xy;",
                            "vec3 o=vec3(c.r,c.g,0.0),g=vec3(c.r,c.g,1.0)/64.0,v=vec3(0.5);",
                            "float m = 0.4;",

                            "for(int r=0;r<100;r++){",
                              "float h=e(o)-m;",
                              "if(h<0.0)    break;",
                              "o+=h*10.0*g;",
                              "v+=h*0.02;",
                            "}",

                            "v +=e(o+0.1)*vec3(0.4,0.7,1.0);",

                            "float a=0.0;",
                            "for(int r=0;r<100;r++){",
                               "a+=clamp(4.0*(e(o+0.5*vec3(cos(1.1*float(r)),cos(1.6*float(r)),cos(1.4*float(r))))-m),0.0,1.0);",
                             "}",
                            "v*=a/100.0;",
                            "vec3 color   = texture2D(textureIn, vUv).xyz;",
                            "v = color * v;",
                            "gl_FragColor=vec4(v,1.0);",
                        "}"

                    ].join("\n")
                
                };

