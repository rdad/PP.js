PP.lib.shader.shaders.blend  = {

                    info: {
                            name: 'blend',
                            author: '@rdad',
                            link: 'http://www.whiteflashwhitehit.com/'
                    },

			uniforms: {

				textureIn: { type: "t", value: 0, texture: null },
                                textureAdd: { type: "t", value: 1, texture: null },
				opacity: { type: "f", value: 1.0 }

			},

			controls: {
                            opacity:    {min:0, max: 1, step:.001}
                        },

                        vertexShader: PP.lib.vextexShaderBase.join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",
				"uniform sampler2D textureIn;",
                                "uniform sampler2D textureAdd;",
				"uniform float opacity;",

				"void main() {",

					"//vec3 texel = texture2D( textureIn, vUv ).rgb;",
                                        "//vec3 add = texture2D( textureAdd, vUv ).rgb;",
                                        "//float intensity = normalize(add.r + add.g + add.b);",
                                        "//float b = intensity * opacity;",
                                        "//float b = add.b * opacity;",
                                        "vec3 color1 = texture2D( textureIn, vUv ).rgb * opacity;",
                                        "vec3 color2 = texture2D( textureAdd, vUv ).rgb * (1.0 - opacity);",

                                        "vec3 color = (color1+color2) * 1.2;",
					"gl_FragColor = vec4(color,1.0);",

				"}"

			].join("\n")

		};

PP.lib.shader.shaders.blendAdd  = {

                    info: {
                            name: 'blendAdd',
                            author: '@rdad',
                            link: 'http://www.whiteflashwhitehit.com/'
                    },

			uniforms: {

				textureIn: { type: "t", value: 0, texture: null },
                                textureAdd: { type: "t", value: 1, texture: null },
				opacity: { type: "f", value: .5 }

			},

			controls: {
                            opacity:    {min:0, max: 1, step:.001}
                        },

                        vertexShader: PP.lib.vextexShaderBase.join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",
				"uniform sampler2D textureIn;",
                                "uniform sampler2D textureAdd;",
				"uniform float opacity;",

				"void main() {",

					"vec3 one = texture2D( textureIn, vUv ).rgb;",
                                        "vec3 add = texture2D( textureAdd, vUv ).rgb;",
                                        "vec3 color = one*add;",
					"gl_FragColor = vec4(color,1.0);",

				"}"

			].join("\n")

		};

PP.lib.shader.shaders.blendOn  = {

                    info: {
                            name: 'blendRot',
                            author: '@rdad',
                            link: 'http://www.whiteflashwhitehit.com/'
                    },

			uniforms: {

				textureIn: { type: "t", value: 0, texture: null },
                                textureAdd: { type: "t", value: 1, texture: null },
				opacity: { type: "f", value: 1.0 }

			},

			controls: {
                            opacity:    {min:0, max: 1, step:.001}
                        },

                        vertexShader: PP.lib.vextexShaderBase.join("\n"),

			fragmentShader: [

				"varying vec2 vUv;",
				"uniform sampler2D textureIn;",
                                "uniform sampler2D textureAdd;",
				"uniform float opacity;",

				"void main() {",

					"vec3 texel = texture2D( textureIn, vUv ).rgb;",
                                        "vec3 add = texture2D( textureAdd, vUv ).rgb;",
                                        "if(texel.r>.1) texel = vec3(1.0, 1.0, 1.0);",
                                        "vec3 color = texel*add;",
					"gl_FragColor = vec4(color,1.0);",

				"}"

			].join("\n")

		};

PP.lib.shader.shaders.photoshopBlend  = {

                    info: {
                        name: 'photoshop blend math',
                        author: 'Romain Dura aka Romzr',
                        link: 'http://mouaif.wordpress.com'
                    },

                    uniforms: {     textureIn:    { type: "t", value: 0, texture: null },
                                    textureAdd:   { type: "t", value: 1, texture: null },
                                    mix:          { type: "f", value: .5},
                                    mode:         { type: "f", value: 0}
                              },

                    controls: {
                                mix:    {min:0, max: 1.0, step:.01},
                                mode:   {min:0, max: 7.0, step:1.0}
                        },


                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        "uniform sampler2D textureIn;",
                        "uniform sampler2D textureAdd;",
                        "uniform float mix;",
                        "uniform float mode;",

                        "void main(){",
                            "vec4 one = texture2D(textureIn, vUv);",
                            "vec4 second = texture2D(textureAdd, vUv);",
                            "vec4 result = vec4(1.0);",

                            // Fade
                            "if(mode==0.0){",
                                "one.a *= mix;",
                                "one.rgb *= one.a;",
                                "second.rgb *= second.a;",
                                "vec3 blended = one.rgb + ((1.0-one.a)*second.rgb);",
                                "float alpha = second.a + (1.0 -second.a)*one.a;",
                                "vec4 r = vec4(blended, alpha);",
                                "result = vec4(r.rgb/r.a, r.a);",
                            "}",

                            // Blend Multiply
                            "if(mode==1.0){",
                                "result = one * second * mix;",
                            "}",

                             // Screen
                            "if(mode==2.0){",
                                "result.r = 1.0 - ((1.0 - one.r)*(1.0 - (second.r*mix)));",
                                "result.g = 1.0 - ((1.0 - one.g)*(1.0 - (second.g*mix)));",
                                "result.b = 1.0 - ((1.0 - one.b)*(1.0 - (second.b*mix)));",
                            "}",

                             // Blend Overlay
                            "if(mode==3.0){",
                                "result.r = (one.r < mix) ? (2.0 * one.r * second.r) : (1.0 - 2.0 * (1.0 - one.r) * (1.0 - second.r));",
                                "result.g = (one.g < mix) ? (2.0 * one.g * second.g) : (1.0 - 2.0 * (1.0 - one.g) * (1.0 - second.g));",
                                "result.b = (one.b < mix) ? (2.0 * one.b * second.b) : (1.0 - 2.0 * (1.0 - one.b) * (1.0 - second.b));",
                            "}",

                             // Blend Add
                            "if(mode==4.0){",
                                "result = min(one + (second*mix), 1.0);",
                            "}",

                            //Blend Color Dodge
                            "if(mode==5.0){",
                                "result = ((second == 1.0) ? second*mix : min(one / (1.0 - (second*mix)), 1.0));",
                            "}",

                            //Blend Color Burn
                            "if(mode==6.0){",
                                "result = ((second == 0.0) ? second : max((1.0 - ((1.0 - one*mix) / second)), 0.0));",
                            "}",
                            
                            //My Blend Color Burn
                            "if(mode==7.0){",
                                "vec4 a = ((second == 0.0) ? second : max((1.0 - ((1.0 - one*mix) / second)), 0.0));",
                                "a.a = mix;",
                                "result = one+a;",
                            "}",

                            "gl_FragColor = result;",
                        "}"
                    ].join("\n")

                };

PP.lib.shader.shaders.fadeToColor  = {

                    info: {
                        name: 'Fade to color',
                        author: '@rdad',
                        link: 'http://www.whoteflashwhitehit.com'
                    },

                    uniforms: {     textureIn:    { type: "t", value: 0, texture: null },
                                    color:        { type: "c", value: new THREE.Color(0xffffff)},
                                    time:         { type: "f", value: 0},
                                    run:          { type: "f", value: 0}
                              },
                    
                     controls: {
                                run:    {min:0, max: 1.0, step:1.0}
                        },
                    
                    update: function(e){

                        e.material.uniforms.time.value += (e.material.uniforms.run.value>0.0) ? .015 : 0;

                    },

                    vertexShader: PP.lib.vextexShaderBase.join("\n"),

                    fragmentShader: [

                        "varying vec2 vUv;",
                        "uniform sampler2D textureIn;",
                        "uniform vec3 color;",
                        "uniform float time;",

                        "void main(){",
                            "vec3 i = texture2D(textureIn, vUv).rgb;",
                            //"vec4 img = (i, 1.0 - time);",
                            //"vec4 final = vec4(color, time);",
                            "gl_FragColor = vec4(i, 1.0 - time);",
                        "}"
                    ].join("\n")

                };
