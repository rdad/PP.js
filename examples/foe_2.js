
function ChapterOne() {
    this.camTarget = "";
    this.camera = "";
    this.scene = "";
    this.param = {
        uk: {
            materials: [],
            mesh: "",
            deepness: 0.4
        }};
    this.nbp = 35;
    this.uk = "";
    this.init = function () {
        this.camTarget = new THREE.Object3D();
        this.camTarget.position = {
            x: 400,
            y: -100,
            z: 0
        };
        this.camera = new THREE.Camera(50, window.innerWidth / window.innerHeight, 1, 10000, this.camTarget);
        this.camera.position.set(0,-1000,300);
        this.scene = new THREE.Scene();
        
        asset.addTexture("asset/uk2.png");
    };
    this.build = function () {
        uk = new THREE.Object3D();
        var f = asset.getTexture("asset/uk2.png");
        var a = new THREE.PlaneGeometry(2048, 1024, 1, 1);
        var e = 1 / this.nbp;
        for (var b = 0; b < this.nbp; b++) {
            var c = new THREE.MeshShaderMaterial({
                uniforms: {
                    tDiffuse: {
                        type: "t",
                        value: 0,
                        texture: f
                    },
                    bias: {
                        type: "f",
                        value: e * b
                    }
                },
                vertexShader: getText("vs-hdr"),
                fragmentShader: getText("fs-hdr")
            });
            var g = new THREE.Mesh(a, c);
            g.position.z = b * this.param.uk.deepness;
            uk.addChild(g)
        }
        this.scene.addObject(uk);
        
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
    chapterOn = 1,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2,
    mouseX = 0, mouseY = 0;

if (Detector.webgl) {
    init()
}

function start() { 
    console.log('start');
    document.getElementById('progress').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    chapter[1].build();
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    animate()
}
function init() {
    console.log('init');
    container = document.getElementById("container");
    
    chapter[1] = new ChapterOne();
    chapter[1].init();
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    container.appendChild(renderer.domElement);
    PP.init({
        renderer: renderer,
        scene: chapter[chapterOn].scene,
        camera: chapter[chapterOn].camera
    });

    PP.addTexture("diffuse"); 


    asset.load("barre", start, 0)
}

function animate() {
    requestAnimationFrame(animate);
    render()
}

function render() {

    chapter[1].camera.position.x    += ( mouseX - chapter[1].camera.position.x ) * .05;
    chapter[1].camera.position.y    += ( - mouseY - chapter[1].camera.position.y ) * .05;
    
    PP.start();
    PP.renderScene().toTexture('diffuse');
    PP.renderTexture('diffuse').toScene();
}

function onDocumentMouseMove(event) {

        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY );

}

function getText(a) {
    return document.getElementById(a).textContent
}