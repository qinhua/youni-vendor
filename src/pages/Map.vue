<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div id="my-map"></div>
    <!-- 搜索框-->
    <!--<div id="searchBox">
      <input id="tipinput" type="input" placeholder="请输入关键字搜索"/>
      <div id="clearSearchBtn">
        <div class="del">&#10005;</div>
      </div>
    </div>-->
    <!-- 结果面板 -->
    <!-- loading -->
    <!--<div id="loader"></div>-->
    <div id="container" class="map" tabindex="0"></div>
    <div id='right'>
      <div>
        <div class='title'>选择模式</div>
        <input type='radio' name='mode' value='dragMap' checked>拖拽地图模式</input>
        </br>
        <input type='radio' name='mode' value='dragMarker'>拖拽Marker模式</input>
      </div>
      <div>
        <button id='start'>开始选点</button>
        <button id='stop'>关闭选点</button>
      </div>
      <div>
        <div class='title'>选址结果</div>
        <div class='c'>经纬度:</div>
        <div id='lnglat'></div>
        <div class='c'>地址:</div>
        <div id='address'></div>
        <div class='c'>最近的路口:</div>
        <div id='nearestJunction'></div>
        <div class='c'>最近的路:</div>
        <div id='nearestRoad'></div>
        <div class='c'>最近的POI:</div>
        <div id='nearestPOI'></div>
      </div>
    </div>

  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  export default {
    name: 'map',
    data() {
      return {}
    },
    components: {},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      /*vm.$nextTick(function () {
      })*/

      AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
        var map = new AMap.Map('my-map', {
          zoom: 16,
          scrollWheel: false
        })
        var positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: map
        });
        AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.Geolocation','MapType'],
          function(){
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
            map.addControl(new AMap.Geolocation());
            map.addControl(new AMap.MapType());
          });
        positionPicker.on('success', function(positionResult) {
          document.getElementById('lnglat').innerHTML = positionResult.position;
          document.getElementById('address').innerHTML = positionResult.address;
          document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
          document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
          document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
        });
        positionPicker.on('fail', function(positionResult) {
          document.getElementById('lnglat').innerHTML = ' ';
          document.getElementById('address').innerHTML = ' ';
          document.getElementById('nearestJunction').innerHTML = ' ';
          document.getElementById('nearestRoad').innerHTML = ' ';
          document.getElementById('nearestPOI').innerHTML = ' ';
        });
        var onModeChange = function(e) {
          positionPicker.setMode(e.target.value)
        }
        var startButton = document.getElementById('start');
        var stopButton = document.getElementById('stop');
        var dragMapMode = document.getElementsByName('mode')[0];
        var dragMarkerMode = document.getElementsByName('mode')[1];
        AMap.event.addDomListener(startButton, 'click', function() {
          positionPicker.start(map.getBounds().getSouthWest())
        })
        AMap.event.addDomListener(stopButton, 'click', function() {
          positionPicker.stop();
        })
        AMap.event.addDomListener(dragMapMode, 'change', onModeChange)
        AMap.event.addDomListener(dragMarkerMode, 'change', onModeChange);
        positionPicker.start();
        map.panBy(0, 1);

        map.addControl(new AMap.ToolBar({
          liteStyle: true
        }))
      });



    },
    computed: {},
    /*watch: {
      '$route'(to, from) {
      }
    },*/
    methods: {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

  .map-container {
    width: 100%;
    height: 100%;
    #my-map{
      width: 100%;
      height: 100%;
    }
    .map-wrapper {
      width: 100%;
      height: 100%;
    }
    .search-box {
      position: absolute;
      top: 25px;
      left: 20px;
      right: 20px;
    }
    .el-vue-search-box-container {
      width: auto;
      .search-btn {
        width: 62px !important;
        color: #fff;
        background: #0b96fb !important;
      }
      .search-tips {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
      }
    }
    .amap-maptypecontrol {
      top: auto !important;
      right: auto !important;
      bottom: 120px !important;
      left: 70px !important;
      z-index: 304;
      .amap-maptype-list {
        left: -62px !important;
      }
      /*.amap-maptype-item {
        width: 100%;
        text-align: center;
      }*/
    }
  }

  .map {
    height: 100%;
    width: 60%;
    float: left;
  }

  #right {
    color: #444;
    background-color: #f8f8f8;
    width: 40%;
    float: left;
    height: 100%;
  }

  #start,
  #stop,
  #right input {
    margin: 4px;
    margin-left: 15px;
  }

  .title {
    width: 100%;
    background-color: #dadada
  }

  button {
    border: solid 1px;
    margin-left: 15px;
    background-color: #dadafa;
  }

  .c {
    font-weight: 600;
    padding-left: 15px;
    padding-top: 4px;
  }

  #lnglat,
  #address,
  #nearestJunction,
  #nearestRoad,
  #nearestPOI,
  .title {
    padding-left: 15px;
  }

</style>
