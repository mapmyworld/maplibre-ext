
function newExtrusionLayer(source, color, opacity) {
	return {
		'id': source +'-extrusion',
		'type': 'fill-extrusion',
		'source': source,
		'paint': {

			'fill-extrusion-color': color || ['get', 'fill-color'],

			// make extrusions slightly opaque for see through indoor walls ( by default ).
			'fill-extrusion-opacity': opacity || .9,
			
			// use an 'interpolate' expression to add a smooth transition effect to the buildings as the user zooms in
			'fill-extrusion-height': ['interpolate',['linear'],['zoom'],15,0,15.05, ['get', 'height']],
			'fill-extrusion-base': ['interpolate',['linear'],['zoom'],15,0,15.05, ['get', 'min_height']]
		},
		"filter" : ['==', '$type', 'Polygon']
	};
}

function newSymbolLayer(source, symbol, text_field) {
	
	var layerId = source + '-symbols';
	var symbolLayer = {
		'id': layerId,
		'type': 'symbol',
		'source': source,
		'layout': {},
		'paint': {},
		'filter' : ['==', '$type', 'Point']
	};

	if(text_field) {
		var text_layout = {
			'text-field': text_field,
			'text-font': [ 'NotoSans-Regular'],
			'text-offset': [1, .5],
			'text-anchor': 'left'
		};
		symbolLayer.layout = text_layout;
	}

	if(symbol){
		symbolLayer.layout['icon-image'] = symbol;
	}

	return symbolLayer;
}

function newFillLayer(source, color, opacity, hover_opacity) {
	
	var layerId = source + '-fills';
	
	var fillLayer = {
		'id': layerId,
		'type': 'fill',
		'source': source,
		'paint': {
			'fill-color': color || ['get', 'fill-color']
		},
		'filter' : ['==', '$type', 'Polygon']
	};
	
	if(opacity) {
		fillLayer.paint['fill-opacity'] = opacity;
		
		if(hover_opacity) {
			fillLayer.paint['fill-opacity'] = [ 'case', ['boolean', ['feature-state', 'hover'], false ], hover_opacity, opacity ]
		}
	}
	
	return fillLayer;
}

function newLineLayer(source, color, width) {
	var lineLayer = {
		'id': source+'-lines',
		'type': 'line',
		'source': source,
		layout: {
			'line-cap': "round",
			'line-join': "round"
		},
		'paint': {
			'line-color': color || ['get', 'line-color'],
			'line-width': width || 2
		},
	};
	
	return lineLayer;
}