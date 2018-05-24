<template>
  <div class="login-container">
    <div class="content">
      <div class="content-wrap">
        <div class="content-body">
          <!--登录-->
          <div v-show="showHide">
            <div class="title"><b></b> <span>用户登录</span> <b></b></div>
            <el-form ref="loginForm" :model="loginForm">
              <el-form-item prop="phone">
                <el-input placeholder="请输入手机号" maxlength="11" clearable v-model.number="loginForm.phone">
                  <el-button slot="prepend" icon="icon icon-user" tabindex="-1"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input placeholder="请在此输入密码" maxlength="11" name="password" type="password" autoComplete="on" clearable v-model="loginForm.password"  @keyup.enter.native="handleLogin">
                  <el-button slot="prepend" icon="icon icon-pwd" tabindex="-1"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item style="text-align: right">
                <el-button type="text">忘记密码</el-button>
              </el-form-item>
              <el-form-item>
                <el-button class="login-btn" @click="handleLogin">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        // 登录表单
        showHide: true,
        loginForm: {
          phone: '',
          password: '',
          code: ''
        },
        login: {
          timer: null,
          count: 60,
          loginCodeTxt: '获取验证码',  // 登录获取验证码
          canGetCode: false,  //获取验证码按钮是否禁用
        },
      }
    },
    components: {},
    methods: {
      //登录
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.$ajaxPost('/login', this.loginForm).then(({data}) => {
              if (data.code == 1) {
                console.log(data);
                this.$message.success('登陆成功');
//                this.$refs.loginForm.resetFields();
                //存储获取的token到cookie
                this.$store.dispatch('LoginByUsername', data)
                // 返回的数据存在cookie里面
                Object.keys(data.data).forEach(e => {
                  this.$Cookies.set(e, data.data[e]);
                });
                this.getNavMenu()
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        });
      },
      getNavMenu(role_id) {   //请求菜单
        this.$ajaxPost("/getnav", {mid: this.$Cookies.get('id')}).then(({data}) => {
          //存储导航栏
            sessionStorage.setItem('menu_list', JSON.stringify(data.data));
            this.$router.push({path: '/home'})
        });
      },
    },
    created() {
    },
    mounted() {
    }
  }
</script>
<!--覆盖element样式-->
<style lang="scss">
  #app .login-container {
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-input__inner, .el-textarea__inner {
      border: 1px solid #c0d6d5;
    }
    .el-input.is-active .el-input__inner, .el-input__inner:focus {
      border: 1px solid #1aa86b;
    }
    .handle-btn-wrap {
      margin-top: 50px;
      margin-bottom: 0;
      .el-button {
        width: 200px;
        background-color: #1aa86b;
        font-size: 20px;
        color: #fff;
        &:active {
          color: #fff;
          border-color: #1aa86b;
        }
      }
    }
    .el-form-item__error {
      left: 62px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  *, *:before, *:after {
    box-sizing: border-box;
  }
  .login-container {
    position: relative;
    height: 100%;
    background: #AED581;
    .logo {
      text-align: center;
      padding-top: 83px;
    }
    .content {
      position: relative;
      .content-wrap {
        width: 568px;
        position: absolute;
        top: 175px;
        left: 50%;
        margin-left: -284px;
      }
      .content-body {
        min-height: 360px;
        background: #fff;
        padding: 33px 60px;
        border-radius: 4px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, .2);
        .title {
          margin-bottom: 25px;
          text-align: center;
          font-size: 24px;
          color: #009587;
          b {
            display: inline-block;
            vertical-align: middle;
            width: 50px;
            height: 1px;
            background: #009587;
          }
        }
      }
      .reset-success {
        padding-top: 30px;
        text-align: center;
        font-size: 16px;
        .el-icon-success {
          font-size: 60px;
          color: #1aa86b;
        }
        p {
          margin-top: 20px;
          color: #333;
        }
      }
    }
    .login-btn {
      width: 100%;
      background: #1aa86b;
      border-radius: 0;
      font-size: 20px;
      color: #fff;
      box-shadow: 0 4px 16px rgba(20, 151, 95, 0.3);
    }
    .copyright {
      margin-top: 30px;
      text-align: center;
      font-size: 14px;
      color: #898989;
      .en {
        font-size: 12px;
      }
    }
  }

  /*步骤条*/
  .crumbs {
    text-align: center;
    margin-bottom: 50px;
    .current {
      span {
        background: #1aa86b;
        &:after {
          border-left-color: #1aa86b;
        }
      }
    }
  }

  .crumbs ul {
    list-style: none;
    display: inline-table;
    width: 100%;
  }

  .crumbs ul li {
    display: table-cell;
    width: 30%;
  }

  .crumbs ul li span {
    display: block;
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    background: #ccc;
    text-align: left;
    position: relative;
    margin: 0 10px 0 0;
    font-size: 14px;
    text-decoration: none;
    color: #fff;
  }

  .crumbs ul li span:after {
    content: "";
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid #ccc;
    position: absolute;
    right: -20px;
    top: 0;
    z-index: 1;
  }

  .crumbs ul li span:before {
    content: "";
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-left: 20px solid #fff;
    position: absolute;
    left: 0;
    top: 0;
  }

  .crumbs ul li:first-child span:before {
    display: none;
  }

  .crumbs ul li:last-child span {
    margin-right: 0;
  }

  .crumbs ul li:last-child span:after {
    display: none;
  }
</style>

