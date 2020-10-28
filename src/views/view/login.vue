<template>
  <login-bkg>
    login 测试页，跳转到登录鉴权：
    <!-- <router-link to="home/wedget">home</router-link> -->
    <router-link to="authorize">authorize</router-link>
  </login-bkg>
</template>
<script>
import loginBkg from '@/components/login/login-bkg'
export default {
  components: {
    loginBkg
  },
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>

</style>
