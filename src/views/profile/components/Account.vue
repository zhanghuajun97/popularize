<template>
  <el-form>
    <el-form-item label="原密码">
      <el-input v-model.trim="info.oldPassword" show-password/>
    </el-form-item>
    <el-form-item label="新密码">
      <el-input v-model.trim="info.newPassword"  show-password/>
    </el-form-item>
    <el-form-item label="确认新密码">
      <el-input v-model.trim="info.rePassword" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { editPassword } from '@/api/user' 
export default {
  data() {
    return {
      info: {
        oldPassword: '',
        newPassword: '',
        rePassword: ''
      }
    }
  },
  methods: {
    submit() {
      let params = {
        oldPassword: this.info.oldPassword,
        newPassword: this.info.newPassword,
        rePassword: this.info.rePassword
      };
      editPassword(params).then(res => {
        if (res.code == 1) {
          this.$message('更新成功')
        }
      })
    }
  }
}
</script>
