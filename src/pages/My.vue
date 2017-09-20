<template>
  <div class="my" v-cloak>
    <!--<router-view></router-view>-->
    <div class="user-modal">
      <div class="user-inner">
        <img :src="seller.headimgurl">
        <p class="user-name">{{seller.name}}</p>
        <!--<span><i class="fa fa-building-o"></i>&nbsp;{{seller.companyName}}</span>-->
      </div>
    </div>
    <group class="list-modal">
      <cell title="店铺资料" link="/edit_user">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-credit-card"></i>-->
      </cell>
      <!--<cell title="押金列表" link="/myguarantee">
        &lt;!&ndash;<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-money"></i>&ndash;&gt;
      </cell>-->
      <cell title="使用帮助" link="/help">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-question-circle"></i>-->
      </cell>
      <cell title="关于友你" link="/aboutus">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-info-circle"></i>-->
      </cell>
    </group>
    <group class="bottom">
      <!--<cell title="修改密码" style="color:#666" @click.native="modPassword"><i slot="icon" width="20"
                                                                           style="margin-right:5px;"
                                                                           class="fa fa-wrench"></i></cell>-->
      <cell title="退出登录" style="color:#666" @click.native="logout">
        <!--<i slot="icon" width="20" style="margin-right:5px;" class="fa fa-sign-out"></i>-->
      </cell>
    </group>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Grid, GridItem, Group, Cell} from 'vux'
  import {commonApi, userApi} from '../service/main.js'

  export default {
    name: 'my',
    data() {
      return {
        seller: {}
      }
    },
    components: {Grid, GridItem, Group, Cell},
    beforeMount() {
      me = window.me
    },
    mounted() {
      // me.attachClick()
      vm = this
      vm.getSeller()
    },
    /*watch: {
      '$route'(to, from) {
        if (to.name === 'user') {
          vm.getSeller()
        }
      }
    },*/
    // computed: {},
    methods: {
      getSeller() {
        vm.seller = vm.$store.state.global.userInfo || (me.sessions.get('ynSellerInfo') ? JSON.parse(me.sessions.get('ynSellerInfo')) : {})
      },
      logout() {
        vm.confirm('退出登录？', '', function () {
          vm.loadData(commonApi.logout, null, 'POST', function (res) {
            if (res.success) {
              vm.$store.commit('logout')
              vm.jump('login')
            }
          }, function () {
          })
        })
      },
      modPassword() {
        this.$router.push({name: 'password', query: {id: vm.sellerId}})
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../static/css/tools.less';

  .my {
    .disable-sel;
    padding-bottom: 150/@rem;
    overflow-x: hidden;
    .user-modal {
      .rel;
      .center;
      background: #3077d2 url(../../static/img/bg_user.jpg);
      .bg100;
      .user-inner {
        .rel;
        z-index: 2;
        padding: 50/@rem 20/@rem 30/@rem;
        > img {
          .block;
          .size(130, 130);
          .ma-w(100);
          .ma-h(100);
          .ma;
          background: rgba(255, 255, 255, .5);
          .bor(3px, solid, #fff);
          .borR(50%);
          box-shadow: 0 0 0 5px rgba(255, 255, 255, .4), 0 0 0 11px rgba(255, 255, 255, .2)
        }
        p {
          padding-top: 40/@rem;
          .fz(24);
          .cf;
          letter-spacing: 1px;
          i {
            padding-left: 10/@rem;
          }
        }
        span {
          opacity: .8;
          .center;
          .fz(22);
          .ce;
        }
      }
      canvas {
        opacity: .25;
      }
    }
    .list-modal {
      .weui-cells {
        margin-top: 10/@rem;
        padding: 0;
      }
    }
    .bottom {
      margin-top: 10/@rem;
    }
    .weui-cell {
      padding: 24/@rem !important;
      .fz(26) !important;
    }
  }

</style>
