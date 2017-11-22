<template>
  <div class="store-con" v-cloak>
    <group class="list-modal">
      <!--<cell title="商品管理" link="/goods">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
      </cell>
      <cell title="水票管理" link="/tickets">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
      </cell>-->
      <cell title="商品管理" link="/goods"></cell>
      <cell title="水票管理" link="/tickets" v-if="showTicket"></cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, Cell} from 'vux'

  export default {
    name: 'item',
    data () {
      return {
        seller: null,
        showTicket: false
      }
    },
    components: {Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      vm = this
      vm.getSeller()
    },
    watch: {
      '$route' (to, from) {
        if (to.name === 'goods_items') {
          vm.getSeller()
        }
      }
    },
    computed: {},
    methods: {
      // 向父组件传值
      setPageStatus (data) {
        this.$emit('listenPage', data)
      },
      jumpTo (pathName, param, type) {
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
      },
      getSeller() {
        vm.seller = vm.$store.state.global.userInfo || (me.sessions.get('ynSellerInfo') ? JSON.parse(me.sessions.get('ynSellerInfo')) : {})
        if (vm.seller.serviceType === 'seller_service_type.1' || vm.seller.serviceType === 'seller_service_type.3') {
          vm.showTicket = true
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
