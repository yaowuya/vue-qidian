<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on"
             label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          ref="username"
          v-model="registerForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="registerForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" class="f-left" style="width:40%;"
                 @click.native.prevent="handleRegister">注册
      </el-button>
      <el-button @click="goLogin" class="f-right" style="width:40%;">登陆</el-button>

    </el-form>
  </div>
</template>

<script>
  import {getInfo} from "../../api/user"

  export default {
    name: "register",
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      };
      return {
        registerForm: {
          username: '',
          password: ''
        },
        registerRules: {
          username: [{required: true, trigger: 'blur'}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined
      }
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleRegister() {
        this.$refs.registerForm.validate(async valid => {
          if (valid) {
            // this.loading = true;
            const res = await getInfo(this.registerForm.username);
            console.log(res);
            if (res.username === this.registerForm.username) {
              this.$message({
                type: "false",
                message: "该名称已经存在"
              });
              this.loading = false;
            } else {
              const res = await this.$http.post("rest/users", this.registerForm);
              this.$router.push({name:"login"});
              this.$message({
                type: "success",
                message: "注册成功"
              });
              this.loading = false;
            }
            this.loading = false;
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      goLogin() {
        return this.$router.push({name: "login"})
      }
    }
  }
</script>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
