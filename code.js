// 1. Set Camera View to Singapore
    var camera = viewer.camera;
    camera.setView({
      position : Cesium.Cartesian3.fromDegrees(103.819169, 1.353564, 40000),
      heading : Cesium.Math.toRadians(0),
      pitch : Cesium.Math.toRadians(-90),
      roll : Cesium.Math.toRadians(0),
    });


// 2 Load jQuery and ArcGIS Parser    
<!-- 2 Load jQuery and ArcGIS Parser --->
  <script src="jquery-2.1.4.min.js"></script>
  <script src="terraformer.min.js"></script>
  <script src="terraformer-arcgis-parser-1.0.4.min.js"></script>


// 3 function to load data 
    function load3D(PA_name) {
      var start = new Date().getTime();
      $('#info').html("loading...");
      $.ajax({
        url: "http://urasvr205.ura.gov.sg/arcgis/rest/services/3D/demo/MapServer/0/query",
        data: {
          where: "PLN_AREA_N='"+PA_name+"'",
          text: "",
          geometry: "",
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects",
          outFields: "NAME, GPR_NUM, LU_DESC, LU_TEXT",
          outSR: '4326',
          returnGeometry: true,
          f: "pjson"
        },
        
        success: function( data ) {
          alert(data.length);  
        }
      });
    }

  load3D("JURONG EAST");
  
  
// 4 Handle the AJAX return
          // clear existing datasources
          viewer.dataSources.removeAll();
          
          // create GeoJSON structure
          var FeatureCollection = {
            type: "FeatureCollection",
            features: []
          }
          
          // parse string return into JSON object
          var arcgis = jQuery.parseJSON(data);
      
          // Start using the parse and convert methods!
          for (var i = 0; i < arcgis.features.length; i++) {
            var feature = Terraformer.ArcGIS.parse(arcgis.features[i]);
            feature.id = i;
            FeatureCollection.features.push(feature)
          };
  
          // Load FeatureCollection into Cesium datasource
          var promise = Cesium.GeoJsonDataSource.load(FeatureCollection);
          promise.then(function(dataSource) {
            viewer.dataSources.add(dataSource);
            
            //Get the array of entities
            var entities = dataSource.entities.values;
            $('#info').html(entities.length + " features loaded.");
            
            for (var i = 0; i < entities.length; i++) {
                  //For each entity, retrieve color by land use code
                  var entity = entities[i];
                  var name = entity.name;
                  var landuse = entity.properties.LU_DESC;
  
                  // var color = colorHash[landuse];
                  
                  var color = Cesium.Color.fromRandom({
                          alpha : 1.0
                      });
                  
                  
                  //Set the polygon material to our random color.
                  entity.polygon.material = color;
                  //Remove the outlines.
                  entity.polygon.outline = false;
      
                  //Extrude the polygon based on the land parcel's GPR.  Each entity
                  //stores the properties for the GeoJSON feature it was created from
                  //Since the GPR is a ratio, we multiple by 100.
                  
                  entity.polygon.extrudedHeight = (entity.properties.GPR_NUM +0.01) * 100;
                  
              }
              var end = new Date().getTime();
              $('#info').html(entities.length + " features loaded in " + (end-start) + "ms");
          }).otherwise(function(error){
              //Display any errrors encountered while loading.
              window.alert(error);
          });
          

//5 Color Hash for Land Use Codes
    var colorHash = {};
    colorHash['RESIDENTIAL'] = Cesium.Color.fromCssColorString('#F6BB81');
    colorHash['RESIDENTIAL WITH COMMERCIAL AT 1ST STOREY'] = Cesium.Color.fromCssColorString('#E78385');
    colorHash['COMMERCIAL & RESIDENTIAL'] = Cesium.Color.fromCssColorString('#36ADE5');
    colorHash['COMMERCIAL'] = Cesium.Color.fromCssColorString('#215297');
    colorHash['HOTEL'] = Cesium.Color.fromCssColorString('#A59DC6');
    colorHash['WHITE'] = Cesium.Color.fromCssColorString('#F5F1F2');
    colorHash['BUSINESS 1'] = Cesium.Color.fromCssColorString('#C8A5CF');
    colorHash['BUSINESS 1 - WHITE'] = Cesium.Color.fromCssColorString('#C8A5CF');
    colorHash['BUSINESS 2'] = Cesium.Color.fromCssColorString('#B10166');
    colorHash['BUSINESS 2 - WHITE'] = Cesium.Color.fromCssColorString('#B10166');
    colorHash['BUSINESS PARK'] = Cesium.Color.fromCssColorString('#007FA2');
    colorHash['BUSINESS PARK - WHITE'] = Cesium.Color.fromCssColorString('#007FA2');
    colorHash['RESIDENTIAL / INSTITUTION'] = Cesium.Color.fromCssColorString('#007FA2');
    colorHash['HEALTH & MEDICAL CARE'] = Cesium.Color.fromCssColorString('#CC0021');
    colorHash['EDUCATIONAL INSTITUTION'] = Cesium.Color.fromCssColorString('#CC0021');
    colorHash['PLACE OF WORSHIP'] = Cesium.Color.fromCssColorString('#CC0021');
    colorHash['CIVIC & COMMUNITY INSTITUTION'] = Cesium.Color.fromCssColorString('#CC0021');
    colorHash['OPEN SPACE'] = Cesium.Color.fromCssColorString('#ABB20D');
    colorHash['PARK'] = Cesium.Color.fromCssColorString('#00A33A');
    colorHash['BEACH AREA'] = Cesium.Color.fromCssColorString('#F9F7C6');
    colorHash['SPORTS & RECREATION'] = Cesium.Color.fromCssColorString('#A3D49D');
    colorHash['WATERBODY'] = Cesium.Color.fromCssColorString('#BEDEF5');
    colorHash['ROAD'] = Cesium.Color.fromCssColorString('#EEEEEE');
    colorHash['RAILWAY'] = Cesium.Color.fromCssColorString('#EEEEEE');
    colorHash['MASS RAPID TRANSIT'] = Cesium.Color.fromCssColorString('#EEEEEE');
    colorHash['LIGHT RAPID TRANSIT'] = Cesium.Color.fromCssColorString('#EEEEEE');
    colorHash['TRANSPORT FACILITIES'] = Cesium.Color.fromCssColorString('#959A9D');
    colorHash['UTILITY'] = Cesium.Color.fromCssColorString('#959A9D');
    colorHash['CEMETERY'] = Cesium.Color.fromCssColorString('#9F8900');
    colorHash['AGRICULTURE'] = Cesium.Color.fromCssColorString('#8C875D');
    colorHash['PORT / AIRPORT'] = Cesium.Color.fromCssColorString('#D0D0D0');
    colorHash['RESERVE SITE'] = Cesium.Color.fromCssColorString('#FDF76B');
    colorHash['SPECIAL USE'] = Cesium.Color.fromCssColorString('#516703');
    
    
// 6 Create dropdown to select Planning Area
<!-- 6 Create dropdown to select Planning Area -->
  <div id="select_PA">
    Select Planning Area: <select id="dropdown"></select> <div id="info">initializing...</div>
  </div>
  
  
// 7 init()
function init() {
      // 1. Set Camera View to Singapore
      var camera = viewer.camera;
      camera.setView({
        position : Cesium.Cartesian3.fromDegrees(103.819169, 1.353564, 40000),
        heading : Cesium.Math.toRadians(0),
        pitch : Cesium.Math.toRadians(-90),
        roll : Cesium.Math.toRadians(0),
      });
      
      createDropdown();
    }
    
// 8 createDropdown()
function createDropdown() {
  var $select = $('#dropdown');
    
     $.ajax({
      url: "http://urasvr205.ura.gov.sg/arcgis/rest/services/3D/demo/MapServer/0/query",
      data: {
        where: "1=1",
        outFields: "PLN_AREA_N",
        orderByFields: "PLN_AREA_N ASC",
        returnDistinctValues: true,
        returnGeometry: false,
        f: "pjson"
      },
      
      success: function( data ) {
        // convert to JSON object
        var arcgis = jQuery.parseJSON(data);
        
        // clear dropdown options
        $select.html('');
        
        // populate dropdown options with Planning Area names
        $.each(arcgis.features, function(key, val){
          $select.append('<option id="' + val.attributes.PLN_AREA_N + '">' + val.attributes.PLN_AREA_N + '</option>');
        })
        
        // add onChange listener to dropdown to load Planning Area data
        $select.change(function() {
          load3D(this.value);
        });
        
        // auto-load data for first item
        load3D($select.val());
      }
    });
}


// 9 iPAD-friendly codes
<!-- 9 iPAD-friendly codes -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">