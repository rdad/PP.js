/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

	canvas : !! window.CanvasRenderingContext2D,
	webgl : ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )(),
	workers : !! window.Worker,
	fileapi : window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage : function () {

		var domElement = document.createElement( 'div' );

		domElement.style.fontFamily = 'monospace';
		domElement.style.fontSize = '13px';
		domElement.style.textAlign = 'center';
		domElement.style.background = '#eee';
		domElement.style.color = '#000';
		domElement.style.padding = '1em';
		domElement.style.width = '475px';
		domElement.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			domElement.innerHTML = window.WebGLRenderingContext ? [
				'Sorry, your graphics card doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>'
			].join( '\n' ) : [
				'Sorry, your browser doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a><br/>',
				'Please try with',
				'<a href="http://www.google.com/chrome">Chrome</a>, ',
				'<a href="http://www.mozilla.com/en-US/firefox/new/">Firefox</a> or',
				'<a href="http://nightly.webkit.org/">Webkit Nightly (Mac)</a>'
			].join( '\n' );

		}

		return domElement;

	},

	addGetWebGLMessage : function ( parameters ) {

		var parent, id, domElement;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		domElement = Detector.getWebGLErrorMessage();
		domElement.id = id;

		parent.appendChild( domElement );

	}

};


if (!window.requestAnimationFrame) window.requestAnimationFrame = function () {
    return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function (a) {
        window.setTimeout(a, 1E3 / 60)
    }
}();

var asset = asset || {
    file: [],
    nb: 0,
    loaded: 0,
    texture: [],
    callback: null,
    dom: "",
    step: 0,
    addTexture: function (a) {
        this.file.push(a);
        return this
    },
    getTexture: function (a) {
        var b = new THREE.Texture(asset.texture[a]);
        b.needsUpdate = true;
        return b
    },
    load: function (e, d, c) {
        console.log('asset load');
        console.log(this.file);
        this.callback = d;
        this.nb = this.file.length;
        this.dom = document.getElementById(e);
        this.dom.style.width = "0%";
        for (var a = 0; a < this.nb; a++) {
            var b = THREE.ImageUtils.loadTexture(this.file[a], null, asset.threeCallback)
        }
        this.nb += c;
        this.step = parseInt(100 / this.nb)
    },
    threeCallback: function (a) {
        var b = a.getAttributeNode("src").value;
        asset.texture[b] = a;
        asset.loaded++;
        asset.isComplete()
    },
    addLoaded: function () {
        console.log('add loaded');
        this.loaded++;
        this.isComplete()
    },
    isComplete: function () {
        console.log(this.loaded+'/'+this.nb);
        var a = parseInt(this.dom.style.width);
        a += this.step;
        this.dom.style.width = a + "%";
        if (this.loaded >= this.nb) {
            this.dom.style.width = "100%";
            this.callback()
        }
    }
};


function showInfo() {
    var a = document.getElementById("info");
    a.style.display = (a.style.display == "none" || a.style.display == "") ? "block" : "none"
}