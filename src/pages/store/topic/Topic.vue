<template>
  <div class="s-topic" v-cloak>
    <group class="bottom">
      <x-textarea title="店铺公告：" :max="20" placeholder="一段展示在店铺首页的文字…" @on-blur="" v-model="topic"
                  show-clear></x-textarea>
    </group>
    <div class="btn btn-save" @click="update"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, XTextarea} from 'vux'
  import {userApi} from '../../../service/main.js'

  export default {
    name: 's-topic',
    data() {
      return {
        onFetching: false,
        isPosting: false
      }
    },
    components: {Group, XTextarea},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      vm.sellerId = me.sessions.get('ynSellerInfo') ? JSON.parse(me.sessions.get('ynSellerInfo')).id : ''
    },
    methods: {
      update() {
        if (!vm.topic) {
          vm.toast('请填写公告内容！')
          return false
        }
        if (vm.isPosting) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.update, {
          id: vm.sellerId,
          notice: vm.topic
        }, 'POST', function (res) {
          vm.isPosting = false
          vm.processing(0, 1)
          if (res.success) {
            vm.$router.back()
            vm.getSeller(true)
          } else {
            vm.toast('设置失败！')
          }
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        }, true)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../../static/css/tools.less';

  .s-topic {
    .btn-save {
      .fix;
      bottom: 0;
      z-index: 20;
      width: 100%;
      .ma-w(640);
      .borBox;
      letter-spacing: 2px;
      padding: 24/@rem;
      .center;
      .cf;
      .fz(28);
      .bdiy(@c2);
    }
  }

</style>
