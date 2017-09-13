<template>
  <div class="store-con" v-cloak>
    <group class="list-modal">
      <cell title="商品管理" link="/goods">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>
      </cell>
      <cell title="水票管理" link="/tickets">
        <i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>
      </cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'

  export default {
    name: 'my',
    data () {
      return {
        sellerName: '水一波旗舰店',
        count: 0
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount () {
      me = window.me
    },
    mounted () {
      // me.attachClick()
    },
    /*watch: {
      '$route' (to, from) {
      }
    },*/
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
