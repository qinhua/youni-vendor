<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <div id="my-map"></div>
    <!-- 搜索框-->
    <div id="searchBox">
      <div class="wrap">
        <input id="tipinput" type="text" placeholder="请输入关键字搜索"/>
        <div id="clearSearchBtn">
          <div class="del">&#10005;</div>
        </div>
      </div>
    </div>
    <!-- 搜索结果面板 -->
    <div id="panel" class="hidden">
      <!-- 隐藏按钮 -->
      <a id="showHideBtn"></a>
      <div id="emptyTip">没有内容！</div>
      <!--搜索结果列表 -->
      <div id="poiList"></div>
    </div>
    <!-- loading -->
    <div id="loader"></div>
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
    <!--<div class="button-group">
      <input type="button" class="button" value="显示当前城市" onClick="javascript:showCityInfo()"/>
    </div>-->
    <div class="my-marker"></div>
    <div id="tip"></div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import $ from 'jquery'

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

      /*逆向地理编码*/
      // var lnglatXY = [116.396574, 39.992706]; //已知点坐标
      function regeocoder(lnglatXY) {  //逆地理编码
        var geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: "all"
        });
        geocoder.getAddress(lnglatXY, function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            geocoder_CallBack(result);
          }
        });
        /*var marker = new AMap.Marker({  //加点
          map: map,
          position: lnglatXY
        });*/
//        map.setFitView();
      }

      function geocoder_CallBack(data) {
        var address = data.regeocode.formattedAddress; //返回地址描述
        document.getElementById("tip").innerHTML = address;
      }
      map.on('dragstart', function () {
         map.clearMap()
      })
      map.on('dragend', function () {
//        marker.setPosition(map.getCenter());
       /* map.getCity(function (data) {
          if (data['province'] && typeof data['province'] === 'string') {
            console.log('城市：' + (data['city'] || data['province']))*/

        console.log([map.getCenter().lng,map.getCenter().lat])
        console.log(regeocoder(map.getCenter()),585)
            // 自定义搜索
        console.log(document.getElementById("tip").innerHTML)
            placeSearch.search(document.getElementById("tip").innerHTML, function (status, result) {
              console.log(status, result)
              $('#panel').removeClass('hidden')
            });

       /*   }
        });*/
        console.log('%c' + map.getCenter(), 'color:darkred;font-size:20px')
      });
      /*map.on('complete', function() {
        document.getElementById('tip').innerHTML = "地图图块加载完毕！当前地图中心点为：" + map.getCenter();
      });*/

      /*加载插件*/
      map.plugin(['AMap.ToolBar', 'AMap.Geolocation', 'AMap.MapType', 'AMap.PlaceSearch', 'AMap.Autocomplete', 'AMap.CitySearch', 'AMap.Geocoder'], function () {
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.PlaceSearch());
        // map.addControl(new AMap.MapType());
        map.addControl(new AMap.Autocomplete());
        map.addControl(new AMap.CitySearch());
      })

      /*01.定位*/
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 8000, // 超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition: 'RB',
        useNative: true
      });
      map.addControl(geolocation)
      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', onComplete) // 返回定位信息
      AMap.event.addListener(geolocation, 'error', onError) // 返回定位出错信息
      //a.解析定位结果
      function onComplete(data) {
        var str = ['定位成功']
        str.push('经度：' + data.position.getLng())
        str.push('纬度：' + data.position.getLat())
        if (data.accuracy) {
          str.push('精度：' + data.accuracy + ' 米')
        }//如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
//        document.getElementById('tip').innerHTML = str.join('<br>')
        // marker.setPosition([data.position.getLng(), data.position.getLat()]);
//        vm.$emit('on-geo-end', data)
      }

      //b.解析定位错误信息
      function onError(data) {
//        document.getElementById('tip').innerHTML = '定位失败'
//        vm.$emit('on-geo-end', data)
      }

      /*02.搜索功能*/
      // 输入提示
      var auto = new AMap.Autocomplete({
        input: "tipinput"
      });
      // POI搜索
      var placeSearch = new AMap.PlaceSearch({
        map: map,
        pageSize: 5,
        pageIndex: 1,
        city: '', //城市
        panel: 'poiList'
      });
      var checkPoiList = function () {
        $('#panel').toggleClass('empty', !($.trim($('#poiList').html())))
      }
      var select = function (e) {
        /* console.log(e, 52852)
         placeSearch.setCity(e.poi.adcode);
         placeSearch.search(e.poi.name);  //关键字查询查询*/
        // 设置搜索的城市
        placeSearch.setCity(e.poi.adcode)
        // 检查结果列表是否为空， 为空时显示必要的提示，即#emptyTip
        checkPoiList()
        // 监听搜索列表的渲染完成事件
        AMap.event.addListener(placeSearch, 'renderComplete', function () {
          checkPoiList()
        })
        // 开始搜索对应的poi名称
        placeSearch.search(e.poi.name, function (status, results) {
          if (results.pois && results.pois.length > 0) {
            $('#panel').toggleClass('empty')
          }
          // 显示结果列表
          $('#panel').removeClass('hidden')
          // 隐藏loading状态
          $(document.body).removeClass('searching')
        })
        // 显示loading状态
        $(document.body).addClass('searching')
      }
      $('#showHideBtn').click(function () {
        $('#panel').toggleClass('hidden')
      })
      $('#clearSearchBtn').click(function () {
        // 清除搜索框内容
        $('#tipinput').val('')
        // 清除结果列表
        placeSearch.clear()
        $('#panel').addClass('hidden')
        checkPoiList()
      })
      // 自定义搜索
      /*placeSearch.search('武汉', function(status, result){
        console.log(status,result)
      });*/
      // 事件：
      var listenSearch = AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
      // AMap.event.removeListener(listenSearch);//需要时这样移除

     /*/!*03.点标记*!/
      var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
        // icon: "http://101.132.35.4/upload/images/29uogvj1qsgnbo86ttn7tna8b8.png",
        position: map.getCenter(),
        draggable: true,
        cursor: 'move',
        raiseOnDrag: true,
        // offset: new AMap.Pixel(-26, -13),
      });
      marker.setAnimation('AMAP_ANIMATION_NONE')
      marker.setMap(map);
      // var listenMarker = AMap.event.addListener(auto, "dragEnd", dragMarker);//注册监听，当选中某条记录时会触发
      // AMap.event.removeListener(listenSearch);//需要时这样移除*/
    },
//    computed: {},
    /*watch: {
     '$route'(to, from) {
     }
     },*/
    methods: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .my-marker {
    .abs-center-vh;
    z-index: 100;
    .rsize(20, 33);
    margin-top: -14px;
    background: url(../../static/img/marker.png) bottom center;
    .ele-base;
  }

  /*---------------------*/
  #panel {
    height: 43%;
    -webkit-flex: 0 0 auto;
    overflow: visible;
    border-top: 1px solid #ccc;
    position: relative;
    z-index: 999;
    /*-webkit-transition: all 0.2s;*/
  }

  #showHideBtn {
    display: block;
    position: absolute;
    width: 63px;
    height: 32px;
    text-align: center;
    margin: 0 auto;
    left: 0;
    right: 0;
    top: -25px;
  }

  #showHideBtn:after,
  #showHideBtn:before {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    cursor: pointer;
  }

  #showHideBtn:before {
    width: 60px;
    height: 30px;
    background: rgba(255, 255, 255, 0.9);
    top: 0;
    border-radius: 30px 30px 0 0;
    border: 1px solid #ccc;
    border-bottom: 0;
  }

  #showHideBtn:after {
    content: "";
    top: 7px;
    border: 10px solid rgba(255, 0, 0, 0);
    z-index: 99999;
    border-top-color: #ccc;
    /* -webkit-transition: all 0.2s;*/
  }

  #poiList {
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 100%;
    overflow: scroll;
    position: relative;
    background: #fff;
  }

  #poiList .amap_lib_placeSearch {
    border: none;
  }

  #panel.hidden {
    height: 0 !important;
    overflow: hidden;
  }

  #panel.hidden #showHideBtn {
    /*  top: -30px;*/
  }

  #panel.hidden #showHideBtn:after {
    /*  -webkit-transform: rotate(180deg);
   -webkit-transform-origin: 50% 4px;*/
    top: -5px;
    border-bottom-color: #ccc;
    border-top-color: transparent;
  }

  #panel .amap_lib_placeSearch .pageLink {
    font-size: 120%;
    margin: 0 3px;
  }

  #searchBox {
    position: fixed;
    width: 94%;
    margin: 0 auto;
    left: 0;
    right: 0;
    z-index: 999;
    top: 14px;
    height: 80/@rem;
  }

  #tipinput {
    width: 100%;
    height: 80/@rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 24/@rem;
    line-height: 80/@rem;
    padding: 0 7px;
    box-sizing: border-box;
  }

  #clearSearchBtn {
    position: absolute;
    right: 10/@rem;
    top: 20/@rem;
    margin: auto;
    .size(40, 40);
    line-height: 40/@rem;
    text-align: center;
    vertical-align: middle;
    font-size: 24/@rem;
    color: #999;
  }

  #clearSearchBtn .del {
    background: #eee;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  #page.searching #clearSearchBtn {
    display: none;
  }

  #loader {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 1;
    margin: -75px 0 0 -75px;
    border: 16px solid #eee;
    border-radius: 50%;
    border-top: 16px solid #0b83ea;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
    display: none;
  }

  @-webkit-keyframes spin {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .searching #loader {
    display: block;
  }

  .searching #page {
    filter: grayscale(1);
    opacity: 0.5;
  }

  #panel.empty #showHideBtn {
    opacity: 0.5;
  }

  #emptyTip {
    display: none;
  }

  #panel.empty #emptyTip {
    display: block;
    position: relative;
    background: #fff;
    width: 100%;
    text-align: center;
    padding: 30px 0;
    color: #666;
  }

  .poi-more {
    display: none !important;
  }

  /*---------------------*/
  .map-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .amap-logo,.amap-copyright {
      display: none!important;
    }
    /*地图*/
    #my-map {
      width: 100%;
      height: 100%;
    }
    /*搜索框*/
    #search-box {
      position: absolute;
      top: 24px;
      left: 20px;
      right: 20px;
      .wrap {
        position: relative;
        width: 100%;
      }
      .search-btn {
        width: 62px !important;
        color: #fff;
        background: #0b96fb !important;
      }
    }
    /*联想列表*/
    .amap-sug-result {
      width: 94%;
      left: 0;
      right: 0;
    }
    /*搜索列表*/
    #panel {
      position: fixed;
      width: 100%;
      height: auto;
      left: 0;
      bottom: 0;
      z-index: 200;
    }
    /*定位图标*/
    .amap-geolocation-con {
      right: auto;
      left: 10px;
      bottom: 30px !important;
      z-index: 100 !important;
    }
  }

  #tip {
    position: absolute;
    top: 50px;
    left: 0;
  }

</style>
