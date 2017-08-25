<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div id="my-map"></div>
    <!-- 搜索框-->
    <div id="searchBox">
      <div class="wrap">
        <input id="tipinput" type="input" placeholder="请输入关键字搜索"/>
        <div id="clearSearchBtn">
          <div class="del">&#10005;</div>
        </div>
      </div>
    </div>
    <!-- 结果面板 -->
    <div id="panel"></div>
    <!-- loading -->
    <!--<div id="loader"></div>-->
    <!--<div id="container" class="map" tabindex="0"></div>-->
    <div id='right'>
      <div>
        <div class='title'>选择模式</div>
        <input type='radio' name='mode' value='dragMap' checked>拖拽地图模式
        <input type='radio' name='mode' value='dragMarker'>拖拽Marker模式
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
  //  import $ from 'zeptojs/zepto.js'
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

      var map = new AMap.Map("my-map", {
        zoom: 16,
        scrollWheel: false,
        resizeEnable: true
      });
      map.plugin(['AMap.Geolocation', 'AMap.MapType', 'AMap.PlaceSearch','AMap.Autocomplete'], function () {
        map.addControl(new AMap.Geolocation());
        map.addControl(new AMap.PlaceSearch());
        map.addControl(new AMap.MapType());
        map.addControl(new AMap.Autocomplete());
      })
      //输入提示
      var auto = new AMap.Autocomplete({
        input: "tipinput"
      });
      //POI搜索
      var placeSearch = new AMap.PlaceSearch({
        map: map
      });
      var select = function(e) {
        console.log(e,52852)
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
      }

      /*var _onClick = function(e){
        new AMap.Marker({
          position : e.lnglat,
          map : map
        })
      };
      var clickListener = AMap.event.addListener(map, "click", _onClick); //绑定事件，返回监听对象
      AMap.event.removeEventListener(clickListener);//移除*/

      //方式一：
      var listener = AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
      AMap.event.removeListener(listener);//需要时这样移除

    },
    computed: {},
    /*watch: {
     '$route'(to, from) {
     }
     },*/
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

  .amap-sug-result{
    width: 94%;
    left: 0;
    right: 0;
  }
  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .amap-logo{
      display: none;
    }
    #my-map {
      width: 100%;
      height: 100%;
    }
    #search-box {
      position: absolute;
      top: 24px;
      left: 20px;
      right: 20px;
      .wrap{
        position: relative;
        width: 100%;
      }
      .search-btn {
        width: 62px !important;
        color: #fff;
        background: #0b96fb !important;
      }
    }
    .amap-maptypecontrol {
      top: 60px !important;
      right: auto !important;
      bottom: auto !important;
      left: 72px !important;
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

  #panel {
    position: absolute;
    width: 100%;
    left: 0;
    top: 72px;
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
