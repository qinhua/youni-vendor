<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div id="my-map"></div>
    <div id="panel"></div>
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

      var map = new AMap.Map("container", {
        zoom: 16,
        scrollWheel: false,
        resizeEnable: true
      });
      map.plugin(['AMap.ToolBar', 'AMap.Geolocation', 'AMap.MapType', 'AMap.PlaceSearch','AMap.Autocomplete'], function () {
        map.addControl(new AMap.ToolBar());
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
        placeSearch.setCity(e.poi.adcode);
        placeSearch.search(e.poi.name);  //关键字查询查询
      }
      //方式一：
      var listener = AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
      //AMap.event.removeListener(listener);//需要时这样移除
      //======================
      ////方式二：
      ////用on和off方法
      //auto.on('select',select)
      ////auto.off('select',select)//移除的方法
      //======================

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

  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    #my-map {
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

  #panel {
    position: absolute;
    left: 0;
    top: 0;
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
