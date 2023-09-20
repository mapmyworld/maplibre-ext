
// parameters to ensure the model is georeferenced correctly on the map
const def_origin = [0,0];
const def_altitude = 0;
const def_mercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat( def_origin, def_altitude );

// transformation parameters to position, rotate and scale the 3D model onto the map
const def_rotate = [0, 0, 0];
const def_transform = {
	translateX: def_mercatorCoordinate.x,
	translateY: def_mercatorCoordinate.y,
	translateZ: def_mercatorCoordinate.z,
	rotateX: def_rotate[0],
	rotateY: def_rotate[1],
	rotateZ: def_rotate[2],
	/* Since our 3D model is in real world meters, a scale transform needs to be
	* applied since the CustomLayerInterface expects units in MercatorCoordinates.
	*/
	scale: def_mercatorCoordinate.meterInMercatorCoordinateUnits()
};

const THREE = window.THREE;
const camera3js = new THREE.Camera();
const scene3js = new THREE.Scene();
const loader3js = new THREE.GLTFLoader();

function newThreeJSLayer(animate) {
	return {
		id: 'ThreeJSLayer',
		type: 'custom',
		renderingMode: '3d',
		onAdd (map, gl) {
			const ambientLight = new THREE.AmbientLight( 0xffffff); // white light
			scene3js.add(ambientLight);
			
			const directionalLight2 = new THREE.DirectionalLight(0xffffff);
			directionalLight2.position.set(.5, -1, .5);
			scene3js.add(directionalLight2);
			
			this.map = map;
			this.renderer = new THREE.WebGLRenderer({ canvas: map.getCanvas(), context: gl, antialias: true });
			this.renderer.autoClear = false;
		},

		render (gl, matrix) {
			
			if(animate) {
				animate();
			}

			const m = new THREE.Matrix4().fromArray(matrix);
			const l = new THREE.Matrix4()
				.makeTranslation( def_transform.translateX, def_transform.translateY, def_transform.translateZ)
				.scale(new THREE.Vector3( def_transform.scale, -def_transform.scale, def_transform.scale ));
			
			//const rotationX = new THREE.Matrix4().makeRotationAxis( new THREE.Vector3(1, 0, 0), def_transform.rotateX );
			//const rotationY = new THREE.Matrix4().makeRotationAxis( new THREE.Vector3(0, 1, 0), def_transform.rotateY );
			//const rotationZ = new THREE.Matrix4().makeRotationAxis( new THREE.Vector3(0, 0, 1), def_transform.rotateZ );
			//l.multiply(rotationX).multiply(rotationY).multiply(rotationZ);

			camera3js.projectionMatrix = m.multiply(l);
			this.renderer.render(scene3js, camera3js);
			this.map.triggerRepaint();
			
			this.renderer.resetState();
		}
	}
};