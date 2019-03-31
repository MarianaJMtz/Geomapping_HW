// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  ONE: new L.LayerGroup(),
  TWO: new L.LayerGroup(),
  THREE: new L.LayerGroup(),
  FOUR: new L.LayerGroup(),
  FIVE: new L.LayerGroup(),
  FIVE_PLUS: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [39.742043, -104.991531],
  zoom: 5,
  layers: [
    layers.ONE,
    layers.TWO,
    layers.THREE,
    layers.FOUR,
    layers.FIVE,
    layers.FIVE_PLUS
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "ONE": layers.ONE,
  "TWO": layers.TWO,
  "THREE": layers.THREE,
  "FOUR": layers.FOUR,
  "FIVE": layers.FIVE,
  "FIVE_PLUS": layers.FIVE_PLUS
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
//var legend = L.control({
  //position: "bottomright"
//});

// When the layer control is added, insert a div with the class of "legend"
//legend.onAdd = function() {
 // var div = L.DomUtil.create("div", "legend");

// Add the info legend to the map
//legend.addTo(map);

// Initialize an object containing formats for each layer group


// Perform an API call to the Earthquake Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(infoRes) {

  var earthquakeInfo = infoRes.features;

  // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
  var earthquakeCode;

  var fillColors = ["#ADFF2F","#E1F34D","#F3DB4D","#F0A76B","#FF7F50","#DC143C"];

  var colorList = [	"#696969", "#696969","#696969","#696969","#696969","#696969"];

  var UNIX_time;

  // Loop through the stations (they're the same size and have partially matching data)
  for (var n = 0; n < earthquakeInfo.length; n++) {

    // Create a new station object with properties of both station objects
    var feature = Object.assign({}, earthquakeInfo[n]);

    UNIX_time = feature.properties.time;

    var earthquakeDate = new Date(UNIX_time).toLocaleDateString("en-US")
    var eartquakeTime = new Date(UNIX_time).toLocaleTimeString("en-US") 

    // If a station is listed but not installed, it's coming soon
    if (feature.properties.mag < 1) {
      earthquakeCode = "ONE",
      color = colorList[0],
      fillcolor = fillColors[0],
      radius = 10000;
    }
    // If a station has no bikes available, it's empty
    else if (feature.properties.mag < 2) {
      earthquakeCode = "TWO",
      color = colorList[1],
      fillcolor = fillColors[1],
      radius = 30000;
    }
    // If a station is installed but isn't renting, it's out of order
    else if (feature.properties.mag < 3) {
      earthquakeCode = "THREE",
      color = colorList[2],
      fillcolor = fillColors[2],
      radius = 50000;
    }
    // If a station has less than 5 bikes, it's status is low
    else if (feature.properties.mag < 4) {
      earthquakeCode = "FOUR",
      color = colorList[3],
      fillcolor= fillColors[3],
      radius = 70000;
    }
    // If a station has less than 5 bikes, it's status is low
    else if (feature.properties.mag < 5) {
      earthquakeCode = "FIVE",
      color = colorList[4],
      fillcolor= fillColors[4],
      radius = 90000;
    }
    // Otherwise the station is normal
    else {
      earthquakeCode = "FIVE_PLUS",
      color = colorList[5],
      fillcolor= fillColors[5],
      radius = 110000;
    }

    // Create a new marker with the appropriate icon and coordinates
    var newMarker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
    fillOpacity: 1,
    opacity: 1,
    color: color,
    radius: radius,
    fillColor: fillcolor,
    weight: 0.5
    });

    // Add the new marker to the appropriate layer
    newMarker.addTo(layers[earthquakeCode]);

    // Bind a popup to the marker that will  display on click. This will be rendered as HTML
    newMarker.bindPopup(feature.properties.title + "<br> Magnitude: " + feature.properties.mag + "<br>" 
                        + "Date: " + earthquakeDate + " Time: " + eartquakeTime);
  }
  
  // Set up the legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        colors = fillColors,
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
 
});



