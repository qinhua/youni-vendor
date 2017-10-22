<template>
  <div class="store-con" v-cloak>
    <group class="list-modal">
      <!--<cell title="店铺公告" link="/store_topic">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
      </cell>
      <cell title="优惠管理" link="/coupons">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
      </cell>
      <cell title="上楼费" link="/floor_fee"><i slot="icon" width="20" style="margin-right:5px;"
                                         class="fa fa-building-o"></i></cell>
      <cell title="保证金" link="/guarantee_fee"><i slot="icon" width="20" style="margin-right:5px;"
                                             class="fa fa-cny"></i></cell>-->
      <cell title="店铺公告" link="/store_topic"></cell>
      <cell title="优惠管理" link="/coupons"></cell>
      <!--<cell title="上楼费用" link="/floor_fee"></cell>-->
      <cell title="派送时长" link="/dispatch_time"></cell>
      <!--<cell title="店铺押金" link="/guarantee_fee"></cell>-->
      <cell title="押金列表" link="/myguarantee"></cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell} from 'vux'

  export default {
    name: 'my',
    data() {
      return {}
    },
    components: {Group, Cell},
    beforeMount() {
      me = window.me
    },
    mounted() {

    },
    /*watch: {
      '$route' (to, from) {
      }
    },*/
    computed: {},
    methods: {
      jumpTo(pathName, param, type) {
        /* [type=2] 1:'path'2:'name',3:'query' */
        type = type || 'name'
        if (pathName) {
          if (type === 1) {
            this.$router.push({path: '/' + pathName + (param ? '/' + param : '')})
          }
          if (type === 2) {
            this.$router.push({name: pathName, params: param || ''})
          }
          if (type === 3) {
            this.$router.push({path: '/' + pathName, query: param || ''})
          }
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

  .store-con {
    overflow-x: hidden;
    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
      .weui-cell {
        padding: 24/@rem !important;
        .fz(26) !important;
      }
    }
  }

</style>
