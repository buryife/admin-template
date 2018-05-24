<template>
  <div style="height: 100%;">
    <el-container style="height: 100%;">
      <el-header id="headBox">
        <el-row type="flex" justify="space-between">
          <el-col :span="12">
            <div class="f-fl"></div>
          </el-col>
          <el-col :span="12">
            <div class="f-fr">
              <div class="account">{{account}}</div>
              <div class="roler">
                {{['超级管理员','省份管理员','城市管理员','区管理员','普通操作人'][roler]}}
              </div>
              <div class="log-out" @click="logOut">退出</div>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <router-view style="width: 100%;"/>
    </el-container>
  </div>
</template>
<script>
  export default {
    props: {},
    data() {
      return {
        account:this.$Cookies.get('username'),   //当前用户
        roler: this.$Cookies.get('role'),
      }
    },
    methods: {
      logOut(){   //退出登录
        this.$confirm('确认退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$Cookies.set('id','');
          // 清除缓存
          sessionStorage.clear();
          this.$message.success("退出成功！");
          this.$router.push({path:"/login"},function () {
            location.reload();
          });
        }).catch(() => {})
      },
    },
    components: {},
    mounted() {

    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  #headBox {
    background: #1aa86b;
    height: 60px !important;
    .f-fl {
      width: 340px;
      height: 45px;
      margin-top: 8px;
      background: url('../../../assets/images/sprite.png') 0 -109px no-repeat;
    }
    .f-fr {
      div {
        float: left;
        height: 60px;
        line-height: 60px;
        padding: 0 25px;
        color: #fff;
        font-size: 16px;
        text-align: left;
        background: url('../../../assets/images/sprite.png') 0 -254px no-repeat;
      }
      .roler{
        background-position: 0 -350px;
      }
      .log-out{
        cursor: pointer;
        background-position: 0 -2077px;
      }
    }
  }
</style>
