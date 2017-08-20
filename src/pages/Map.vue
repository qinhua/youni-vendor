<template>
  <div class="map-container">
    <!-- 地图容器 -->
    <el-amap ref="vAmap" vid="amap" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin"
             :events="events"></el-amap>
    <el-amap-search-box class="search-box" :search-option="searchOption"
                        :on-search-result="onSearchResult"></el-amap-search-box>
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
  </div>
</template>

<!--/* eslint-disable no-unused-vars */-->
<script>
  /* eslint-disable */
  let me
  let vm
  import AMap from 'vue-amap';
  let amapManager = new AMap.AMapManager();
  export default {
    name: 'map',
    data() {
      return {
        lastPage: '',
        amapManager,
        zoom: 16,
        center: [121.59996, 31.197646],
        markers: [
          [121.59996, 31.197646],
          [121.40018, 31.197622],
          [121.69991, 31.207649]
        ],
        searchOption: {
          city: '',
          citylimit: false
        },
        events: {
          init: (o) => {
            console.log(o.getCenter())
            console.log(this.$refs.vAmap.$$getInstance())
            o.getCity(result => {
              console.log(result)
            })
          },
          'moveend': () => {
          },
          'zoomchange': () => {
          },
          'click': (e) => {
            alert('map clicked')
          },
          'dragend': (e) => {
            this.$refs.vAmap.$$getInstance().getCity(function (result) {
              console.log(result, '拖动后的位置数据')
            })
          }
        },
        plugin: ['ToolBar', {
          pName: 'MapType',
          defaultType: 0,
          events: {
            init(o) {
              console.log(o);
            }
          }
        }, {
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log(status, result)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.loaded = true;
                  self.$nextTick();
                }
              });
            }
          }
        }],
        lng: 0,
        lat: 0,
        loaded: false
      }
    },
    components: {},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      vm.showMap()
    },
    computed: {},
    watch: {
      '$route'(to, from) {
        vm.showMap()
      }
    },
    methods: {
      // 向父组件传值
      setPageStatus(data) {
        this.$emit('listenPage', data)
      },
      addMarker: function () {
        let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
        let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
        this.markers.push([lng, lat]);
      },
      getMap() {
        // amap vue component
        console.log(amapManager._componentMap);
        // gaode map instance
        console.log(amapManager._map);
      },
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            this.markers.push([poi.lng, poi.lat]);
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.mapCenter = [center.lng, center.lat];
        }
        console.log('搜索结果：' + JSON.stringify(pois))
      },
      showMap() {
        vm.lastPage = vm.$route.params.path ? vm.$route.params.path.replace(/\_/g, '/') : ''
        console.log('上一页：' + vm.lastPage)
      },
      jumpTo(path, param) {
        this.$router.push({path: path + (param ? '/' + param : '')})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>

  .map-container {
    width: 100%;
    height: 100%;
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

</style>
