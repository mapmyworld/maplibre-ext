
var colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];

function newHexagonLayer(data, radius, extruded) {
	var hexagonLayer = new deck.MapboxLayer({
		id: 'deckgl-pois',
		type: deck.HexagonLayer,
		data,
		radius : radius,
		colorRange : colorRange,
		getPosition: d => d,
		coverage : 1,
		elevationRange: [0, 3000],
		elevationScale: data && data.length ? 50 : 0,
		extruded: extruded,
		pickable: true,
		upperPercentile : 100,
		transitions: { elevationScale: 3000 }
	});
	
	return hexagonLayer;
}