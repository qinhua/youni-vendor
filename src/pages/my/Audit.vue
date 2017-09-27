<template>
  <div class="audit-con">
    <div class="wrap">
      <img src="../../../static/img/ico_audit.png">
      <h3>审核中</h3>
      <p>管理员正在审核，请耐心等待</p>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */
  export default {
    name: 'rules-con',
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
  /*@import '../../../static/css/tools.less';*/

  .audit-con {
    height: 100%;
    background: #fff;
    overflow: hidden;
    .wrap {
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate3d(-50%, -50%, 0);
      transform: translate3d(-50%, -50%, 0);
      text-align: center;
      white-space: nowrap;
      img {
        width: 66%;
        max-width: 600px;
        display: block;
        margin: 8px auto;
        border-radius: 50%;
      }
      h3 {
        padding: 10px 0;
        font-weight: normal;
        font-size: 18px;
        color: #5f5aec;
        text-align: center;
      }
      p {
        color: #999;
        font-size: 13px;
      }
    }
  }

</style>
