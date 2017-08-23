<template>
  <div :class="['geo-container',!visible ? 'hide' :'']" @click="events.click">
    <div id="geo-map"></div>
    <div id="tip">
      <div id="info">初始化加载地图时，center及level属性缺省，地图默认显示用户所在城市范围</div>
    </div>
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  export default {
    name: 'geo',
    data() {
      return {}
    },
    props: {
      events: {
        type: Object,
      },
      visible: {
        type: Boolean,
        default: false
      },
    },
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      console.log(vm.events)
      // me.attachClick()
      // vm.showMap()
      /*vm.$nextTick(function () {
      })*/
      vm.geoLocation()
    },
    computed: {},
    /*watch: {
      '$route'(to, from) {
        vm.showMap()
      }
    },*/
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      /*浏览器定位*/
      geoLocation() {
        /***** 由于Chrome、IOS10等已不再支持非安全域的浏览器定位请求，为保证定位成功率和精度，请尽快升级您的站点到HTTPS。******/
        var map, geolocation
        //01.加载地图，调用浏览器定位服务
        map = new AMap.Map('geo-map', {
          resizeEnable: true
        })
        map.plugin('AMap.Geolocation', function () {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 8000, // 超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', onComplete) // 返回定位信息
          AMap.event.addListener(geolocation, 'error', onError) // 返回定位出错信息
        })

        //02.解析定位结果
        function onComplete(data) {
          var str = ['定位成功']
          str.push('经度：' + data.position.getLng())
          str.push('纬度：' + data.position.getLat())
          if (data.accuracy) {
            str.push('精度：' + data.accuracy + ' 米')
          }//如为IP精确定位结果则没有精度信息
          str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'))
          document.getElementById('tip').innerHTML = str.join('<br>')
          alert(JSON.stringify(data, null, 2))
          vm.$emit('listenGeo', data)
        }

        //03.解析定位错误信息
        function onError(data) {
          document.getElementById('tip').innerHTML = '定位失败'
          vm.$emit('listenGeo', data)
        }
      },
      jumpTo(path, param) {
        this.$router.push({path: path + (param ? '/' + param : '')})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>

  .geo-container {
    width: 100%;
    height: 100%;
    &.hide {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 0;
      height: 0;
    }
    #mapContainer {
      width: 100%;
      height: 100%;
    }
    #tip {
      height: 45px;
      background-color: #fff;
      padding-left: 10px;
      padding-right: 10px;
      border: 1px solid #969696;
      position: absolute;
      font-size: 12px;
      right: 10px;
      bottom: 20px;
      border-radius: 3px;
      line-height: 45px;
    }
  }

</style>
