
function newExtrusionLayer(source, color, opacity, height) {
	return {
		'id': source +'-extrusion',
		'type': 'fill-extrusion',
		'source': source,
		'paint': {

			'fill-extrusion-color': color || ['get', 'fill-color'],

			// make extrusions slightly opaque for see through indoor walls ( by default ).
			'fill-extrusion-opacity': opacity || .9,
			
			// use an 'interpolate' expression to add a smooth transition effect to the buildings as the user zooms in
			'fill-extrusion-height':  height || ['interpolate',['linear'],['zoom'],15,0,15.05, ['get', 'height']],
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
		'layout': {
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

function newCircleLayer(source, radius, color) {
	var circleLayer = {
		'id': source+'-'+color+'-circles',
		'type': 'circle',
		'source': source,
		'paint': {
			'circle-radius': radius || 10,
			'circle-color': color || ['get', 'circle-color']
		},
	};
	
	return circleLayer;
}

function newBubbleLayer(source, value) {
	var bubbleLayer = {
		'id': source+'-'+'-bubbles',
		'type': 'circle',
		'source': source,
		'paint': {
			'circle-radius':  [ 'interpolate', ['linear'], ['zoom'], 1, value, 7, ['*', 7, value ] ],
			'circle-color':
			[ 'interpolate', ['linear'], value,
				1, 'rgba(33,102,172,0)',
				2, 'rgb(103,169,207)',
				3, 'rgb(209,229,240)',
				4, 'rgb(253,219,199)',
				5, 'rgb(239,138,98)',
				6, 'rgb(178,24,43)'
			]
		},
	};
	
	return bubbleLayer;
}

function newHeatmapLayer(source, value) {
	
	var heatmapLayer = {
		'id': source + '-heatmap',
		'type': 'heatmap',
		'source': source,
		'paint': {

			// Increase the heatmap weight based on frequency and property magnitude
			'heatmap-weight': [ 'interpolate', ['linear'], value, 0, 0, 5, 1 ],
			
			// Increase the heatmap color weight weight by zoom level
			// heatmap-intensity is a multiplier on top of heatmap-weight
			'heatmap-intensity': [ 'interpolate', ['linear'], ['zoom'], 0, 1, 5, 2 ],
			
			// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
			// Begin color ramp at 0-stop with a 0-transparancy color to create a blur-like effect.
			'heatmap-color': [ 'interpolate', ['linear'], ['heatmap-density'],
				0, 'rgba(33,102,172,0)',
				0.2, 'rgb(103,169,207)',
				0.4, 'rgb(209,229,240)',
				0.6, 'rgb(253,219,199)',
				0.8, 'rgb(239,138,98)',
				1, 'rgb(178,24,43)'
			],

			// Adjust the heatmap radius by zoom level
			'heatmap-radius': [ 'interpolate', ['linear'], ['zoom'], 0, 2, 5, 10 ]
		}
	};
	
	return heatmapLayer;
}