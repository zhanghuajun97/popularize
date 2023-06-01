<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
        <el-button
         style="margin-left: 20px;"
			   type="primary"
			   @click="addCode()"
         icon="el-icon-plus"
			>
			   新增
			</el-button>
      <el-button
          style="margin-left: 20px;"
          type="primary"
          @click="syncCrmList()"
        >
          同步销售
        </el-button>
		</el-form>
    <div class="title">页面列表</div>
    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="linkList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接" align="center" width="900">
        <template slot-scope="{row}">
          <span>{{ row.link }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="title">绑定活码列表</div>
    <el-table
      class="table"
      :key="1"
      v-loading="listLoading"
      :data="userList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ row.corp_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定页面" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.html_list }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工头像" align="center">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="25" :src="row.avatar"></el-avatar>
          </template>
      </el-table-column>
      <el-table-column label="userid" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工名称" align="center" >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定销售" align="center">
        <template slot-scope="{row}">
          <span>{{ row.crm_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="delWecode(row)">
            一键解绑
          </el-button>
          <!-- <el-button type="primary" size="mini" @click="pause(row)">
            一键暂停
          </el-button>
          <el-button type="primary" size="mini" @click="normal(row)">
            一键开启
          </el-button> -->
          <el-button type="primary" size="mini" @click="showPage(row)">
            查看绑定页面
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增企微带参活码" :visible.sync="dialogFormVisible" width="2000px">
      <el-form :model="digQuery" ref="ruleForm" label-width="120px" inline>
        <el-form-item label="关键字">
          <el-input v-model="digQuery.keyword" type="text" placeholder="请输入（名称 电话 邮箱）" clearable></el-input>
        </el-form-item>
        <el-button
          style="margin-left: 20px;"
          type="primary"
          icon="el-icon-search"
          @click="handleSearch"
        >
          搜索
        </el-button>
        <el-button type="danger" icon="el-icon-refresh" @click="handleReset"
          >重置</el-button>
        <el-button
          style="margin-left: 20px;"
          type="primary"
          @click="syncCrm()"
        >
          同步当前页销售
        </el-button>
      </el-form>

      <div class="select">已选择的企微带参活码</div>

      <el-table
        class="table dia_table"
        v-loading="listLoading"
        height="500px"
        :data="digList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="序号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信主体" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ formatterCompany(row.corp_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工userid" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.userid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="员工昵称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.alias }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="{row}">
            <el-avatar shape="square" :size="30" :src="row.avatar"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column label="电话" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定销售" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crm_name }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        class="table dia_table"
        v-loading="listLoading"
        height="500px"
        :data="selectStaff"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="微信主体" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ formatterCompany(row.corp_id) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="员工名称" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="头像" align="center">
          <template slot-scope="{row}">
            <el-avatar shape="square" :size="30" :src="row.avatar"></el-avatar>
            </template>
        </el-table-column>
        <el-table-column label="电话" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="绑定销售" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crm_name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="delStaff(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="digQuery.page" :limit.sync="digQuery.limit" @pagination="getCodeList" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmAdd">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="statusData.name + '-' + statusData.id  +' ' + '多页面下推广状态'" :visible.sync="dialogStatusVisible" width="1100px">
      <el-form label-width="120px" inline style="display: flex; justify-content: flex-end;">
        <el-button
          style="margin-left: 20px;"
          type="primary"
          @click="allNormal"
        >
          开启
        </el-button>
        <el-button type="info" @click="allPause"
          >暂停</el-button>
      </el-form>
      <el-table
        class="table"
        v-loading="statusListLoading"
        max-height="700px"
        :data="statusList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="selectPause"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column label="员工id" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.staff_id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面id" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.type_id }}</span>
            </template>
        </el-table-column>
        <el-table-column label="标题" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="链接" align="center" show-overflow-tooltip width="400">
          <template slot-scope="{row}">
            <span>{{ row.link }}</span>
            </template>
        </el-table-column>
        <el-table-column label="暂停状态" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <!-- <span>{{ row.is_pause == 1 ? '暂停' : '正常' }}</span> -->
            <el-switch
              @change="changeStatus(row)"
              style="display: block"
              v-model="row.is_pause"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-text="暂停"
              inactive-text="正常">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { allCodeList, delRelationAll, addRelationAll, wecodeStaffList, syncCrmInfo, allCodePauseList, changeRelationPause, changeWeworkPause } from '@/api/popularize'
import Pagination from '@/components/Pagination'
import { deepClone } from "@/utils";
const defaultQuery = {
  ids: ''
}

const defaultDigQuery = {
  page: 1,
  limit: 10,
  keyword: '',
  name: ''
}

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      listLoading: true,
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      ids: '',
      userList: [],
      linkList: [],
      dialogFormVisible: false,
      digQuery: JSON.parse(JSON.stringify(defaultDigQuery)),
      digLoading: false,
      selectedNum: 0,
      selectedArr: [],
      total: 0,
      digList: [],
      dialogStatusVisible: false,
      statusList: [],
      statusListLoading: true,
      statusData: {},
      pauseList: [],
      selectStaff: [],
      selectList: []
    }
  },
  created() {
    this.listQuery.ids = this.$route.query.ids;
    this.getList();
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      console.log(this.listQuery)
      allCodeList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.userList = response.data.userList;
          this.linkList = response.data.linkList
          response.data.userList.forEach((item, index) => {
            this.userList[index].corp_name = this.formatterCompany(item.corp_id)
          })
          
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 同步当前页销售
    syncCrm () {
      console.log(this.digList)
      var ids = [];
      this.digList.forEach(item => {
        ids.push(item.id)
      });
      var params = {
        ids: ids.toString()
      }
      console.log(params)
      syncCrmInfo(params).then(res => {
         if(res.code == 1) {
          this.getCodeList()
         }
      })
    },
    // 修改暂停状态
    changeStatus (val) {
      let params = {
        staff_id: val.staff_id,
        html_list: val.type_id,
        pause: val.is_pause == true ? 1 : 0
      }
      changeRelationPause(params).then(res => {
        if (res.code == 1) {
          this.$message.success('修改成功')
          // this.getCodeList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 活码多页面下暂停状态
    showPage(row) {
      this.statusData = row;
      this.dialogStatusVisible = true;
      let params = {
        html_list: row.html_list,
        staff_id: row.id
      };
      allCodePauseList(params).then(res => {
        if (res.code == 1) {
          this.statusList = res.data
          res.data.forEach((item, index) => {
            this.statusList[index].is_pause = item.is_pause == 0 ? false : true
          })
        } else {
          this.$message.error(res.msg)
        }
        this.statusListLoading = false;
      })
    },
    // 一键暂停
    pause (row) {
      let params = {
        html_list: row.html_list,
        staff_id: row.id,
        pause: 1
      }
      changeRelationPause(params).then(res => {
        if (res.code == 1) {
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 一键正常
    normal (row) {
      let params = {
        html_list: row.html_list,
        staff_id: row.id,
        pause: 0
      }
      changeRelationPause(params).then(res => {
        if (res.code == 1) {     
          this.$message.success('修改成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 勾选一键正常
    allNormal () {
      if (this.pauseList.length < 1) {
        this.$message.error('请先勾选要开启的数据')
      } else {
        let ids = []
        this.pauseList.forEach(item => {
          ids.push(item.type_id)
        })
        let params = {
          html_list: ids.toString(),
          staff_id: this.statusData.id,
          pause: 0
        }
        changeRelationPause(params).then(res => {
          if (res.code == 1) {
            this.dialogStatusVisible = false;
            this.$message.success('修改成功')
          } else {
          this.$message.error(res.msg)
        }
        })
      }  
    },
    // 勾选一键暂停
    allPause () {
      if (this.pauseList.length < 1) {
        this.$message.error('请先勾选要暂停的数据')
      } else {
        let ids = []
        this.pauseList.forEach(item => {
          ids.push(item.type_id)
        })
        let params = {
          html_list: ids.toString(),
          staff_id: this.statusData.id,
          pause: 1
        }
        changeRelationPause(params).then(res => {
          if (res.code == 1) {
            this.dialogStatusVisible = false;
            this.$message.success('修改成功')
          } else {
            this.$message.error(res.msg)
          }
        })
      }  
    },
    // 同步列表销售
    syncCrmList() {
      var ids = [];
      this.userList.forEach(item => {
        ids.push(item.id)
      });
      var params = {
        ids: ids.toString()
      }
      console.log(params)
      syncCrmInfo(params).then(res => {
         if(res.code == 1) {
          this.getList()
         }
      })
    },
    formatterCompany (id) {
      switch (id) {
        case 'ww84e21ddcde245da7':
          return '中广云投顾';
        case 'ww5fbafe202a1f7d80':
          return '中广云学堂';
        case 'ww1415629f5fbf0627':
          return '中广云智投';
        case 'ww473eb3c9a67a6830':
          return '中广云牛股营'
      }
    },
    // 查询
    handleSearch() {
			this.getCodeList()
		},
    // 重置
    handleReset () {
      this.digQuery = JSON.parse(JSON.stringify(defaultDigQuery))
      this.getCodeList()
    },
    // 解绑
    delWecode (row) {
      console.log(row)
      let params = {
        ids: this.$route.query.ids,
        staff_id: row.id
      };
      delRelationAll(params).then(res => {
         if (res.code ==1) {
           this.$message.success('解绑成功');
           this.getList()
         }
      })
    },
    // 新增活码
    addCode () {
      this.dialogFormVisible = true;
      this.getCodeList()
    },
    // 新增二维码列表
    getCodeList () {
      this.digLoading = true;
      wecodeStaffList(this.digQuery).then(res => {
        if (res.code == 1) {
          this.digList = res.data.list;
          this.total = res.data.total;
        }
        this.digLoading = false;
      })
    },
    // 选择新增
    handleSelectionChange(selectedData) {
      this.selectedNum = selectedData.length
      this.selectedArr = selectedData
      if (selectedData.length > 0) {
        this.selectList = deepClone(selectedData)
        this.selectStaff = [...new Set(this.selectStaff.concat(this.selectList).map(t => JSON.stringify(t)))].map(s => JSON.parse(s)) 
      }
    },
    // 删除已选择活码
    delStaff (row) {
      console.log(row)
      var delIndex = 0;
      this.selectStaff.forEach((item, index) =>{
        if (item.name == row.name) {
          delIndex = index
        }
      })
      this.selectStaff.splice(delIndex, 1)
    },
    // 选择暂停
    selectPause (val) {
      this.pauseList = deepClone(val)
    },
    // 确认添加
    confirmAdd() {
      if (this.selectStaff.length < 1) {
          this.$message.warning('请先勾选要新增的企微活码')
      } else {
        if (this.selectStaff[0].crm_id == '') {
          this.$message.error('勾选项未绑定CRM销售，请先点击同步按钮，同步销售')
        } else {
          let ids = [];
          this.selectStaff.forEach(item => {
            ids.push(item.id)
          })
          let params = {
            type_ids: this.$route.query.ids,
            staff_ids: ids.toString(),
          }
          addRelationAll(params).then(res => {
            if (res.code == 1) {
              this.dialogFormVisible = false;
              this.selectStaff = []
              this.getList()
            }
          })
        }
      }
    }
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
  .title {
    font-size: 24px;
    line-height: 40px;
    height: 40px;
    margin-top: 20px;
  }
  .dia_table {
    margin-left: 40px;
    display: inline-block;
    width: 920px !important;
  }
  .select {
    font-size: 24px;
    margin-left: 1000px;
  }
</style>
