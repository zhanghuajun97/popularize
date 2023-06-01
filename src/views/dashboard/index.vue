<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="title">中广云智投欢迎您</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
  }
}
</script>

<style scoped>
  .dashboard-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 84px);
  }
  .title {
    font-size: 54px;
  }
</style>

