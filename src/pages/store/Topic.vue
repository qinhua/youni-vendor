<template>
  <div class="s-topic" v-cloak>
    <group class="bottom">
      <x-textarea title="店铺公告：" :max="20" placeholder="店铺公告" @on-blur="" v-model="topic" show-clear></x-textarea>
    </group>
    <div class="btn btn-save" @click="update"><i class="fa fa-save"></i>&nbsp;保存</div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  let me
  let vm
  import {Group, XTextarea} from 'vux'
  import {userApi} from '../../service/main.js'

  export default {
    name: 's-topic',
    data() {
      return {
        onFetching: false,
        isPosting: false,
        sellerId: null,
        topic: ''
      }
    },
    components: {Group,XTextarea},
    beforeMount() {
      me = window.me
    },
    mounted() {
      vm = this
      // me.attachClick()
      // vm.userId = vm.$route.query.userId
      vm.sellerId = vm.$store.state.sellerId
      console.log(vm.sellerId)
    },
    methods: {
      validate() {
        if (!vm.topic) {
          vm.toast('请填写公告内容！')
          return false
        }
      },
      update() {
        if (vm.isPosting || !vm.validate()) return false
        vm.isPosting = true
        vm.processing()
        vm.loadData(userApi.updateSeller, {
          id: vm.sellerId,
          name: vm.storeName,
          avtar: vm.storeImg,
          authInfo: vm.authInfo,
          description: vm.description,
          topic: vm.topic,
          area: vm.area,
          detailAddress: vm.detailAddress
        }, 'POST', function (res) {
          this.$store.commit('updateStore', res.data)
          vm.$router.back()
          vm.isPosting = false
          vm.processing(0, 1)
        }, function () {
          vm.isPosting = false
          vm.processing(0, 1)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='less'>
  @import '../../../static/css/tools.less';

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
