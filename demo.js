  /*globals L $*/
      
var bikeIcon = L.icon({
    iconUrl: 'marker-bike-green-shadowed.png',
    iconSize: [25, 39],
    iconAnchor: [12, 39],
    shadowUrl: null
    });

var config = {
    //tileUrl : 'http://{s}.tiles.mapbox.com/v3/openplans.map-g4j0dszr/{z}/{x}/{y}.png',
    tileUrl : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    overlayTileUrl : 'http://{s}.tiles.mapbox.com/v3/intertwine.nyc_bike_overlay/{z}/{x}/{y}.png',
    tileAttrib : 'Routing powered by <a href="http://opentripplanner.org/">OpenTripPlanner</a>, Map tiles &copy; Development Seed and OpenStreetMap ',
    initLatLng: new L.LatLng(37.77443, -121.97555), //San Ramon
    //initLatLng: new L.LatLng(38.88628, 121.52486), //Dalian
    initZoom : 13,
    minZoom : 13,
    maxZoom : 17
    };
var map = L.map('map', {minZoom: config.minZoom, maxZoom: config.maxZoom});
map.addLayer(new L.TileLayer(config.tileUrl, {attribution: config.tileAttrib}));
map.setView(config.initLatLng, config.initZoom);
L.control.scale().addTo(map)

var latlngs, markers, routeLines;

var roadisclicked = false; //路线是否已经在地图上显示
var rLine ;                      //路线

var filenamepoi = 'data2/JSON_Yanming_DriveTesting_09-05.json' ; //设定定位点的文件名
var filenamelte = 'data2/lteloc/JSON_LTE_Yanming_DriveTesting_09-05.json' ; //设定lte位置的文件名
var filenamegps = 'data2/gps/JSON_Yanming_DriveTesting_09-05.json' ; //设定真实gps获得道路的文件名




//----真实gps信息
var gpsLine 
//----基站信息
var ltegroup =L.layerGroup(); //多个circle组成的组

//显示默认的文件
$(function() {  
  $.showInfo();
})



//----------车辆移动图标
$(function() {
  $('#start').click(function() {
    latlngs=[];
    markers=[];
    routeLines=[];
    console.log('start to load file');
    
    $.getJSON(filenamepoi, function(jsonData){  //初始filenamepoi = 'data2/JSON_Yanming_DriveTesting_09-05.json'
        console.log(jsonData);
        $.each(jsonData, function(i, v) {
            latlngs.push([v.latitude, v.longitude]);
       })
     })
       .done(function(){
           var rLine = L.polyline(latlngs);
           console.log(rLine);  //输出到控制台


           routeLines.push(rLine);
           console.log(routeLines);
           map.fitBounds(routeLines[0].getBounds());
            
           $.each(routeLines,function(index,routeLine) {
               var marker = L.animatedMarker(routeLine.getLatLngs(), {
                   icon:bikeIcon,
                   autoStart: false,
                   onEnd: function(){
                       $(this._shadow).fadeOut();
                       $(this._icon).fadeOut(10000, function(){
                           map.removeLayer(this);
                           })
                   }
               })
           map.addLayer(marker);
           markers.push(marker); 

        });

        console.log(markers);
        $.each(markers, function(i, marker) {
            marker.start();
        });

        $(this).hide();
        })
        .fail(function() {
            console.log('error in loading json file');
        });

  });
})





//---------get file按钮的响应
$(function() {
  $('#refresh').click(function() {

      $("#file").empty();   
      $("#file").append('<option value="Yanming_DriveTesting_09-05">Yanming_DriveTesting_09-05</option>'); 
      $.getJSON('data2/File_Name.json', function(jsonData){ 
        $.each(jsonData, function(i, v) {
            $("#file").append('<option value="'+v.name+'">'+v.name+'</option>'); 
       });
     });
  });
})



//---------下拉菜单响应
var filename ; //存放文件名
$(function() {
  $('#file').change(function() {
      map.removeLayer(rLine);
      map.removeLayer(gpsLine);
      map.removeLayer(ltegroup);
      filename = $("#file").val();
      filenamepoi = 'data2/JSON_'+filename+'.json' ; //设定定位点的文件名
      filenamelte = 'data2/lteloc/JSON_LTE_'+filename+'.json' ; //设定lte位置的文件名
      filenamegps = 'data2/gps/JSON_'+filename+'.json'; //设定真实gps路径的文件名
      console.log(filename);

        $.showInfo()
      });
})


//画图方法
$.showInfo = function() {
  $.showRoad();
  $.mysleep(200);    //休眠一点时间，保证路线按顺序描在图上
  $.showGPS();
  
  $.mysleep(200);
  $.showLte();
   
};

//设置休眠
$.mysleep = function sleep(n) {
    var start = new Date().getTime();
    while(true)  if(new Date().getTime()-start > n) break;
}

$.showGPS = function() {
  //--------显示GPS真实道路
      gpslatlngs=[];
      gpsrouteLines=[];
      console.log('start to load gps file');
    
      $.getJSON(filenamegps, function(jsonData){  //初始 filenamegps = data2/gps/JSON_Yanming_DriveTesting_09-05.json
          console.log(jsonData);
          $.each(jsonData, function(i, v) {
              gpslatlngs.push([v.latitude, v.longitude]);
        })
      })
       .done(function(){           
              gpsLine = L.polyline(gpslatlngs,{ //设定路线以及属性
                color: '#ff0000',
                weight: 3,
                opacity: 0.7
              });
              map.addLayer(gpsLine); //将路线画到地图上
              gpsrouteLines.push(gpsLine);
              map.fitBounds(gpsrouteLines[0].getBounds());     
        })
        .fail(function() {
            console.log('error in loading gps json file');
        });
}
$.showRoad = function(){
  //-----------显示匹配道路
        latlngs=[];
        markers=[];
        routeLines=[];
        console.log('start to load file');
        
        $.getJSON(filenamepoi, function(jsonData){  //初始 filenamepoi = data2/JSON_Yanming_DriveTesting_09-05.json
            console.log(jsonData);
            $.each(jsonData, function(i, v) {
                latlngs.push([v.latitude, v.longitude]);
           })
         })
           .done(function(){
                  rLine = L.polyline(latlngs,{ //设定路线以及属性
                    color: '#0099dd',
                    weight: 7,
                    opacity: 0.7
                  });
                  map.addLayer(rLine); //将路线画到地图上
                  console.log(rLine);  //输出到控制台
                  routeLines.push(rLine);
                  console.log(routeLines);
                  map.fitBounds(routeLines[0].getBounds());                   

            })
            .fail(function() {
                console.log('error in loading road json file');
            });
}

$.showLte = function(){
    //---------------显示基站位置
        ltegroup.clearLayers();
        ltelatlngs=[];
        ltelatlngswithdiff=[];
        lterouteLines=[];
        console.log('start to load lte');
        
        $.getJSON(filenamelte, function(jsonData){ //初始filenamelte = 'data2/lteloc/JSON_lteloc.json'
            console.log(jsonData);
            $.each(jsonData, function(i, v) {
                ltelatlngs.push([v.latitude, v.longitude]);
                ltelatlngswithdiff.push([v.latitude, v.longitude,v.diff]);
           })
         })
           .done(function(){
                  var lteLine = L.polyline(ltelatlngs);              
                  //console.log(lteLine);  //输出到控制台
                  lterouteLines.push(lteLine);
                  //console.log(lterouteLines);
                  map.fitBounds(lterouteLines[0].getBounds());     

                  //Circle
                  $.each(ltelatlngswithdiff,function(index,latlng) {
                      var currlatlng = L.latLng(latlng[0], latlng[1]);
                      //var circle = L.circle(currlatlng  , latlng[2], {
                      var circle = L.circle(currlatlng  , 30, {
                        color: '#0099dd',
                        opacity : 0.8 ,
                        weight: 2, 
                        fillColor: '#00aacc',
                        fillOpacity: 0.2
                      })
                      ltegroup.addLayer(circle);

                  });

                  map.addLayer(ltegroup);
                  $(this).hide();
            })
            .fail(function() {
                console.log('error in loading lte json file');
            });
}