
var tb;
var layerCount = 0;

function newThreeboxLayer(geoJSONData) {

	var newThreeboxLayer = {
		id: 'ThreeboxLayer-' + (layerCount++),
		type: 'custom',
		renderingMode: '3d',
		onAdd: function (map, gl) {

			tb = window.tb = window.tb ? window.tb : new Threebox(map, gl, {defaultLights: true} );

			geoJSONData.features.forEach( (f) => {
				if(f.properties.model) {
					var scale = f.properties.scale || 1;
					var rotY = f.properties.bearing || 0;
					var options = {
						obj: MAP_BASE + mapId + '/data/' + f.properties.model, type: 'gltf',  units: 'meters',
						scale: { x: scale, y: scale, z: scale }, 
						rotation: { x: 90, y: rotY, z: 0 },
					};
					tb.loadObj(options, (model) => {
						model.setCoords(f.geometry.coordinates);
						tb.add(model);
					});
				}
			});
		},
	 
		render: function () {
			tb.update();
		}
	};
	
	return newThreeboxLayer;

}