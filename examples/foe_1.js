
function Fire_elk() {
    this.nb = 2000;
    this.pos = {
        x: 0,
        y: 16,
        z: 80
    };
    this.particles = "";
    this.material = "";
    this.attributes = "";
    this.uniforms = "";
    this.system = "";
    this.live = 50;
    this.living = 0;
    this.init = function (g) {
        this.attributes = {
            size: {
                type: "f",
                value: []
            },
            customColor: {
                type: "c",
                value: []
            }
        };
        this.uniforms = {
            amplitude: {
                type: "f",
                value: 1
            },
            color: {
                type: "c",
                value: new THREE.Color(16777215)
            },
            texture: {
                type: "t",
                value: 0,
                texture: g
            }
        };
        this.uniforms.texture.texture.wrapS = this.uniforms.texture.texture.wrapT = THREE.RepeatWrapping;
        this.material = new THREE.MeshShaderMaterial({
            uniforms: this.uniforms,
            attributes: this.attributes,
            vertexShader: getText("vs-particle"),
            fragmentShader: getText("fs-particle"),
            blending: THREE.SubtractiveBlending,
            depthTest: false,
            transparent: true
        });
        var c;
        this.particles = new THREE.Geometry();
        for (var f = 0; f < this.nb; f++) {
            c = new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z);
            vertex = new THREE.Vertex(c);
            this.reset_particle(vertex);
            this.particles.vertices.push(vertex)
        }
        this.system = new THREE.ParticleSystem(this.particles, this.material);
        this.system.dynamic = true;
        var e = this.system.geometry.vertices;
        var a = this.attributes.size.value;
        var b = this.attributes.customColor.value;
        for (var d = 0; d < e.length; d++) {
            a[d] = 20;
            b[d] = new THREE.Color(0)
        }
        return this.system
    };
    this.update = function (b) {
        if (this.living < this.nb) {
            this.living++
        }
        var a = this.living,
            d;
        while (a--) {
            d = this.particles.vertices[a];
            d.velocity.z -= (Math.random() * (wind.getZ() / 10));
            d.velocity.y += (Math.random()) * (wind.getY() / 50);
            d.velocity.x += (Math.random() - 0.5) * (wind.getX() / 30);
            d.position.addSelf(d.velocity);
            var c = THREE.ColorUtils.rgbToHsv(this.attributes.customColor.value[a]);
            c.v -= (d.position.z < -10) ? 0.01 : 0;
            if (c.v <= 0) {
                this.reset_particle(d);
                c.v = 0.9
            }
            this.attributes.customColor.value[a].setHSV(c.h, c.s, c.v);
            this.attributes.customColor.needsUpdate = true
        }
        this.system.geometry.__dirtyVertices = true
    };
    this.reset_particle = function (a) {
        a.position.x = this.pos.x;
        a.position.y = this.pos.y;
        a.position.z = this.pos.z;
        a.velocity = new THREE.Vector3(0, 0, 0)
    }
}

PP.lib.shader.shaders.foe_elk = {
    info: {
        name: "Fly over england - Elk",
        author: "@rdad",
        link: "http://www.whiteflashwhitehit.com"
    },
    uniforms: {
        textureIn: {
            type: "t",
            value: 0,
            texture: null
        }
    },
    vertexShader: PP.lib.vextexShaderBase.join("\n"),
    fragmentShader: ["varying vec2 vUv;", "uniform sampler2D textureIn;", "void main(){", "vec3 col = texture2D(textureIn,vUv).xyz;", "vec3 r = vec3(1.0);", "if(col.r<0.99) r = vec3(0.0);", "gl_FragColor = vec4(r, 1.0);", "}"].join("\n")
};

function ChapterThree() {
    this.camTarget = "";
    this.camera = "";
    this.scene = "";
    this.morphObject = "";
    this.materialElk = "";
    this.elk = "";
    this.fire = "";
    this.init = function () {
        console.log('ch3 init');
        
        //this.camera = new THREE.Camera(50, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera = new THREE.TrackballCamera({

					fov: 60, 
					aspect: window.innerWidth / window.innerHeight,
					near: 1,
					far: 1e3,

					rotateSpeed: 1.0,
					zoomSpeed: 1.2,
					panSpeed: 0.8,

					noZoom: false,
					noPan: false,

					staticMoving: true,
					dynamicDampingFactor: 0.3,

					keys: [ 65, 83, 68 ]

				});
        this.camera.position.z = 220;
        this.camera.position.x = 150;

        this.scene = new THREE.Scene();
        
        asset.addTexture("asset/particle.png")
        
        this.materialElk = new THREE.MeshBasicMaterial({
            color: 0
        });
        var a = new THREE.JSONLoader(true);
        a.load({
            model: "asset/elk.js",
            callback: function (c) {
                console.log('elk loaded')
                chapter[3].addAnimal(c, 300, 0, 80, 0, 0, 1.5)
            }
        });
    };
    this.build = function () {
        console.log('ch3 build');
        
        var b = asset.getTexture("asset/particle.png");
        this.fire = new Fire_elk();
        this.scene.addChild(this.fire.init(b))
    };
    this.addAnimal = function (e, f, c, b, g, d, a) {
        this.morphObject = RO.Animal(e, true);
        this.elk = this.morphObject.mesh;
        this.elk.materials[0].wireframe = false;
        this.elk.materials[0].uniforms.diffuse.value.setHSV(0, 0, 0);
        this.elk.position.set(0, -100, 0);
        if (a != undefined) {
            this.elk.scale.set(a, a, a)
        }
        this.elk.matrixAutoUpdate = false;
        this.elk.updateMatrix();
        this.elk.update();
        this.elk.doubleSided = true;
        this.scene.addChild(this.elk);
        var i = this.morphObject.availableAnimals[0],
            h = this.morphObject.availableAnimals[0];
        this.morphObject.play(i, h, g, d);
        this.morphObject.animalA.timeScale = this.morphObject.animalB.timeScale = 0.2 + 0.3 * Math.random()
        asset.addLoaded();
    }
}

RO = {};
RO.Animal = function (h, b) {
    var j = RO.AnimalAnimationData.init(h, b);
    var d = {};
    d.morph = 0;
    d.animalA = {
        frames: undefined,
        currentFrame: 0,
        lengthInFrames: 0,
        currentTime: 0,
        lengthInMS: 0,
        timeScale: 1,
        name: ""
    };
    d.animalB = {
        frames: undefined,
        currentFrame: 0,
        lengthInFrames: 0,
        currentTime: 0,
        lengthInMS: 0,
        timeScale: 1,
        name: ""
    };
    d.availableAnimals = j.availableAnimals;
    d.mesh = new THREE.Mesh(h, j.material);
    var c = false;
    var i = d.mesh.morphTargetForcedOrder;
    var e = j.material;
    d.play = function (k, o, n, m, l) {
        if (!c) {
            c = true;
            d.morph = 0;
            THREE.AnimationHandler.addToUpdate(d)
        }
        o = o !== undefined ? o : k;
        n = n !== undefined ? n : 0;
        g(k, d.animalA);
        g(o, d.animalB);
        d.animalA.currentTime = m ? m : 0;
        d.animalB.currentTime = l ? l : 0;
        d.update(0)
    };
    d.update = function (v) {
        if (d.mesh._modelViewMatrix) {
            var s, A = ["animalA", "animalB"];
            var x, u;
            var w, y;
            var l, k;
            var o, q;
            var z;
            var n;
            var m;
            var r;
            var p;
            for (x = 0, u = A.length, r = 0; x < u; x++) {
                s = d[A[x]];
                z = s.currentTime;
                s.currentTime = (s.currentTime + v * s.timeScale) % s.lengthInMS;
                if (z > s.currentTime) {
                    s.currentFrame = 0
                }
                l = 0;
                for (w = s.currentFrame, y = s.lengthInFrames - 1; w < y; w++) {
                    if (s.currentTime >= s.frames[w].time && s.currentTime < s.frames[w + 1].time) {
                        l = w;
                        break
                    }
                }
                s.currentFrame = l;
                k = l + 1 < y ? l + 1 : 0;
                i[r++] = s.frames[l].index;
                i[r++] = s.frames[k].index;
                o = s.frames[l].time;
                q = s.frames[k].time > o ? s.frames[k].time : s.frames[k].time + s.lengthInMS;
                p = (s.currentTime - o) / (q - o);
                e.uniforms[A[x] + "Interpolation"].value = p
            }
            e.uniforms.animalMorphValue.value = d.morph;
            if (e.attributes[d.animalA.name] !== undefined) {
                e.attributes.colorAnimalA.buffer = e.attributes[d.animalA.name].buffer
            }
            if (e.attributes[d.animalB.name] !== undefined) {
                e.attributes.colorAnimalB.buffer = e.attributes[d.animalB.name].buffer
            }
        }
    };
    d.setNewTargetAnimal = function (m, k) {
        if (d.morph === 1) {
            for (var l in d.animalA) {
                d.animalA[l] = d.animalB[l]
            }
            d.animalB.currentTime = k ? k : 0;
            g(m, d.animalB);
            f(d.animalB);
            d.morph = 0
        } else {
            console.log("Error: Cannot change animal target if morph != 1. Skipping.")
        }
    };
    var g = function (k, l) {
            if (RO.AnimalAnimationData[k] !== undefined) {
                l.frames = RO.AnimalAnimationData[k];
                l.lengthInFrames = l.frames.length;
                l.lengthInMS = l.frames[l.lengthInFrames - 1].time;
                l.name = k.toLowerCase();
                l.normalsOffset = Math.floor(l.frames.length * 0.5, 10)
            } else {
                console.log("Error: Couldn't find data for animal " + k)
            }
        };
    var f = function (n) {
            var m, l;
            var k = n.currentTime;
            var o = n.frames;
            for (m = 0, l < o.length; m < l; m++) {
                if (k >= o[m].time) {
                    n.currentFrame = m;
                    return
                }
            }
        };
    var a = function (k) {};
    return d
};
RO.AnimalShader = {
    uniforms: function () {
        return THREE.UniformsUtils.merge([THREE.UniformsLib.common, THREE.UniformsLib.lights,
        {
            animalAInterpolation: {
                type: "f",
                value: 0
            },
            animalBInterpolation: {
                type: "f",
                value: 0
            },
            animalMorphValue: {
                type: "f",
                value: 0
            },
            scale: {
                type: "f",
                value: 1
            },
            lightScale: {
                type: "f",
                value: 0
            },
            lightOffset: {
                type: "v3",
                value: new THREE.Vector3(0, 0, 0)
            },
        }])
    },
    attributes: function () {
        return {
            colorAnimalA: {
                type: "c",
                boundTo: "faces",
                value: []
            },
            colorAnimalB: {
                type: "c",
                boundTo: "faces",
                value: []
            }
        }
    },
    vertexShader: ["uniform 	float	animalAInterpolation;", "uniform 	float	animalBInterpolation;", "uniform 	float	animalMorphValue;", "attribute	vec3	colorAnimalA;", "attribute	vec3	colorAnimalB;", "varying vec3 vColor;", "varying vec3 vLightWeighting;", THREE.ShaderChunk.lights_pars_vertex, "uniform float lightScale;", "uniform vec3 lightOffset;", "void main() {", "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "vColor = mix( colorAnimalA, colorAnimalB, animalMorphValue );", "vec3 animalA = mix( morphTarget0, morphTarget1, animalAInterpolation );", "vec3 animalB = mix( morphTarget2, morphTarget3, animalBInterpolation );", "vec3 morphed = mix( animalA,      animalB,      animalMorphValue );", "vec3 transformedNormal = normalize( normalMatrix * normal );", "vLightWeighting = vec3( 0.1 );", "vec4 lDirection = viewMatrix * vec4( vec3( 1.0, -1.0, 0.0 ), 0.0 );", "float directionalLightWeighting = dot( transformedNormal, normalize( lDirection.xyz ) ) * 0.5 + 0.5;", "vLightWeighting += vec3( 1.0 ) * directionalLightWeighting;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( morphed, 1.0 );", "}"].join("\n"),
    fragmentShader: ["uniform vec3 diffuse;", "uniform float opacity;", THREE.ShaderChunk.fog_pars_fragment, THREE.ShaderChunk.lights_pars_fragment, "varying vec3 vLightWeighting;", "varying vec3 vColor;", "void main() {", "gl_FragColor = vec4( vLightWeighting, 1.0 );", "gl_FragColor = gl_FragColor * vec4( vColor, 1.0 );", THREE.ShaderChunk.fog_fragment, "}"].join("\n")
};
RO.AnimalAnimationData = {
    animalNames: ["elk"],
    colorVariations: {
        elk: {
            hRange: 0.03,
            sRange: 0.1,
            vRange: 0.3,
            hOffset: -0.0075,
            sOffset: 0,
            vOffset: -0.2
        }
    },
    animalVariationMap: {
        elk: "elk"
    },
    init: function (f, j) {
        if (!f.initialized) {
            f.initialized = true;
            var g = [];
            var h, r;
            var d, o, v, n = f.morphTargets;
            var z, u, s, w, x;
            if (j) {
                for (s = 0, w = n.length; s < w; s++) {
                    for (z = 0, u = this.animalNames.length; z < u; z++) {
                        r = this.animalNames[z];
                        if (n[s].name.indexOf(r) !== -1) {
                            break
                        }
                    }
                    if (z === u) {
                        o = n[s].name;
                        for (z = 0; z < o.length; z++) {
                            d = o.charCodeAt(z);
                            if (!((d >= 65 && d <= 90) || (d >= 97 && d <= 122))) {
                                break
                            }
                        }
                        this.animalNames.push(o.slice(0, z))
                    }
                }
            }
            for (z = 0, u = this.animalNames.length; z < u; z++) {
                r = this.animalNames[z];
                h = this[r];
                x = 0;
                if (h === undefined || h.length === 0) {
                    h = this[r] = [];
                    for (s = 0, w = n.length; s < w; s++) {
                        if (n[s].name.indexOf(r) !== -1) {
                            h.push({
                                index: s,
                                time: x
                            });
                            x += parseInt(1000 / 24, 10);
                            if (g.indexOf(r) === -1) {
                                g.push(r)
                            }
                        }
                    }
                } else {
                    for (s = 0, w = n.length; s < w; s++) {
                        if (g.indexOf(r) === -1 && n[s].name.indexOf(r) !== -1) {
                            g.push(r)
                        }
                    }
                }
            }
            var p = new THREE.MeshShaderMaterial({
                uniforms: RO.AnimalShader.uniforms(),
                attributes: RO.AnimalShader.attributes(),
                vertexShader: RO.AnimalShader.vertexShader,
                fragmentShader: RO.AnimalShader.fragmentShader,
                fog: true,
                lights: true,
                morphTargets: true,
                vertexColors: THREE.VertexColors,
                points: true,
                wireframeLinewidth: 2
            });
            var y, l, k, e = f.morphColors;
            var i = p.attributes;
            if (f.morphColors && f.morphColors.length) {
                for (y = 0, l = e.length; y < l; y++) {
                    k = e[y];
                    o = k.name;
                    for (z = 0; z < o.length; z++) {
                        d = o.charCodeAt(z);
                        if (!((d >= 65 && d <= 90) || (d >= 97 && d <= 122))) {
                            break
                        }
                    }
                    o = o.slice(0, z).toLowerCase();
                    i[o] = {
                        type: "c",
                        boundTo: "faces",
                        value: k.colors
                    };
                    var q = this.colorVariations.zero;
                    if (this.animalVariationMap[o] !== undefined) {
                        q = this.colorVariations[this.animalVariationMap[o]]
                    }
                    if (q.lScale) {
                        p.uniforms.lightScale.value = q.lScale
                    } else {
                        p.uniforms.lightScale.value = 0.5
                    }
                    if (q.lOffset) {
                        p.uniforms.lightOffset.value.set(q.lOffset[0], q.lOffset[1], q.lOffset[2])
                    } else {
                        p.uniforms.lightOffset.value.set(0.6, 0.6, 0.6)
                    }
                    randomizeColors(i[o].value, q)
                }
                i.colorAnimalA.value = e[0].colors;
                i.colorAnimalB.value = e[0].colors;
                for (z = 0, u = g.length; z < u; z++) {
                    r = g[z].toLowerCase();
                    for (y = 0, l = e.length; y < l; y++) {
                        k = e[y].name.toLowerCase();
                        if (k.indexOf(r) !== -1) {
                            break
                        }
                    }
                    if (y === l) {
                        console.error("Animal.constructor: Morph Color missing for animal " + r + ". Deploying backup plan.");
                        i[r] = {
                            type: "c",
                            boundTo: "faces",
                            value: []
                        };
                        for (y = 0, l = f.faces.length; y < l; y++) {
                            i[r].value.push(new THREE.Color(16711680))
                        }
                    }
                }
            } else {
                console.error("Animal.constructor: Morph Colors doesn't exist, deploying fallback!");
                for (y = 0, l = f.faces.length; y < l; y++) {
                    i.colorAnimalA.value.push(new THREE.Color(16711935))
                }
                i.colorAnimalB.value = i.colorAnimalA.value;
                for (z = 0, u = g; z < u; z++) {
                    i[g[z]] = {
                        type: "c",
                        boundTo: "faces",
                        value: i.colorAnimalA.value
                    }
                }
            }
            f.availableAnimals = g;
            f.customAttributes = p.attributes
        } else {
            var p = new THREE.MeshShaderMaterial({
                uniforms: RO.AnimalShader.uniforms(),
                attributes: {},
                vertexShader: RO.AnimalShader.vertexShader,
                fragmentShader: RO.AnimalShader.fragmentShader,
                fog: true,
                lights: true,
                morphTargets: true
            });
            for (var z in f.customAttributes) {
                var b = f.customAttributes[z];
                if (z === "colorAnimalA" || z === "colorAnimalB") {
                    p.attributes[z] = {
                        type: "c",
                        size: 3,
                        boundTo: b.boundTo,
                        value: b.value,
                        array: undefined,
                        buffer: undefined,
                        needsUpdate: false,
                        __webglInitialized: true,
                    }
                } else {
                    p.attributes[z] = b
                }
            }
        }
        return {
            availableAnimals: f.availableAnimals,
            material: p
        }
    }
};

function randomizeColors(a, h) {
    var e, b, j, g, f, d;
    for (e = 0, b = a.length; e < b; e++) {
        j = a[e];
        g = h.hRange * Math.random() + h.hOffset;
        f = h.sRange * Math.random() + h.sOffset;
        d = h.vRange * Math.random() + h.vOffset;
        THREE.ColorUtils.adjustHSV(j, g, f, d)
    }
}
if (!Detector.webgl) {
    Detector.addGetWebGLMessage()
}
var container, renderer, bpm, delta, time, current, oldTime = 0,
    sign = 1,
    rate = 1,
    t = 0,
    diameter = 100,
    wind, chapter = [],
    chapterOn = 3;

wind = {
    x: 0,
    y: 0,
    z: 0,
    px: 0.1,
    py: 0.1,
    pz: 0.05,
    bx: 10,
    by: 0,
    size: 10,
    update: function () {
        this.x += this.px;
        if (this.x <= 0 || this.x >= 5) {
            this.px = -this.px
        }
        this.y += this.py;
        if (this.y <= 0 || this.y >= 4) {
            this.py = -this.py
        }
        this.z += this.pz;
        if (this.z <= 0 || this.z >= 6) {
            this.pz = -this.pz
        }
        this.bx -= (this.bx > 0) ? this.bx / 100 : 0;
        this.size -= (this.size > 10) ? this.size / 100 : 0
    },
    getX: function () {
        return this.x + this.bx
    },
    getY: function () {
        return this.y + this.by
    },
    getZ: function () {
        return this.z
    },
    getSize: function () {
        return this.size
    }
};

if (Detector.webgl) {
    init()
}

function start() { 
    console.log('start');
    document.getElementById('progress').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    chapter[3].build();
    animate()
}

function init() {
    console.log('init');
    container = document.getElementById("container");
    
    chapter[3] = new ChapterThree();
    chapter[3].init();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    PP.init({
        renderer: renderer,
        scene: chapter[chapterOn].scene,
        camera: chapter[chapterOn].camera,
        clearColor: 0xffffff,
        guiEnabled:true
    });
    PP.debug.init();
    PP.addTexture("diffuse")     
        .loadShader("foe_elk")
        .loadShader("rgbWiggle", {
        waveR: 0.06,
        waveG: 0.24,
        waveB: 0.37,
        speed: 0.022
    });
    
    asset.load("barre", start, 1)
}
function animate() {
    requestAnimationFrame(animate);
    time = new Date().getTime();
    delta = time - oldTime;
    oldTime = time;
    if (chapterOn == 3) {
        THREE.AnimationHandler.update(delta)
    }
    render()
}
function render() {
    
    wind.update();
 
    chapter[3].fire.update();

    PP.start();
    PP.renderScene().toTexture("diffuse");
    PP.get("foe_elk").set("textureIn").toTexture("diffuse");
    PP.renderShader("foe_elk");
    PP.get("rgbWiggle").set("textureIn").toTexture("foe_elk");
    PP.renderShader("rgbWiggle").toScene();
}
function getText(a) {
    return document.getElementById(a).textContent
}