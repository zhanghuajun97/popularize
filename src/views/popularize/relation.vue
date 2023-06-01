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
          同步当前页销售
      </el-button>
		</el-form>
    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="页面固定码关联id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>     
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterCompany(row.corp_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工userid" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="30" :src="row.avatar"></el-avatar>
          </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定销售" align="center">
        <template slot-scope="{row}">
          <span>{{ row.crm_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="暂停状态" align="center">
        <template slot-scope="{row}">
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
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="delCode(row)">
            删除
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

  </div>
</template>

<script>
import { weworkRelation, delWeworkRelation, addWeworkRelation, wecodeStaffList, syncCrmInfo, changeWeworkPause, addRelationAll } from '@/api/popularize'
import { deepClone } from "@/utils";
import Pagination from '@/components/Pagination'
import { thisExpression } from '@babel/types';
const defaultQuery = {
  type_id: ''
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
      total: 0,
      listLoading: true,
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      dialogFormVisible: false,
      editData: {},
      type: [],
      digLoading: false,
      digQuery: JSON.parse(JSON.stringify(defaultDigQuery)),
      digList: [],
      selectedNum: 0,
      selectedArr: [],
      selectStaff: [],
      selectList: []
    }
  },
  created() {
    this.listQuery.type_id = this.$route.query.id
    this.getList();
  },
  methods: {
    // 格式化企微主体
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
    // 修改暂停状态
    changeStatus (val) {
      let params = {
        id: val.id,
        pause: val.is_pause == true ? 1 : 0
      }
      changeWeworkPause(params).then(res => {
        if (res.code == 1) {
          this.$message.success('修改成功')
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 同步当前页销售
    syncCrm () {
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
    // 同步当前列表销售
    syncCrmList() {
      var ids = [];
      this.list.forEach(item => {
        ids.push(item.staff_id)
      });
      var params = {
        ids: ids.toString()
      }
      syncCrmInfo(params).then(res => {
         if(res.code == 1) {
          this.getList()
         }
      })
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
            type_ids: this.$route.query.id,
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
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/popularize/popularize'
      })
    },
    // 重置
    handleReset () {
      this.digQuery = JSON.parse(JSON.stringify(defaultDigQuery))
      this.getCodeList()
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
    handleClick(item) {
      item.isDisabled = false;
      this.list = deepClone(this.list);
    },
    handleSure(row) {
      const param = {
        id: row.id,
        weight: row.weight
      };
      this.changeAssign(param);
    },
    changeAssign(data) {
      editWeight(data)
        .then((response) => {
          this.$message.success('修改成功');
          this.getList();
        })
        .catch((err) => {});
    },
    // 查询
    handleSearch() {
			this.getCodeList()
		},
    // 获取列表数据
    getList() {
      this.listLoading = true
      weworkRelation(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data
          this.list.forEach((ele) => (ele.isDisabled = true));
          response.data.forEach((item, index) => {
            this.list[index].is_pause = item.is_pause == 0 ? false : true
          })
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 新增账号
    addCode () {
      this.dialogFormVisible = true;
      this.getCodeList()
    },
    // 编辑账号
    editInfo () {
      let params = {
        key: this.editData.key,
        info: this.editData.info,
        content: this.editData.content
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditConfig(params).then(response => {
        if (response.code == 1) {
          this.dialogFormVisible = false;
          this.getList()
          this.isEdit ? this.$message.success('编辑成功') : this.$message.success('新增成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    delCode (row) {
      let params = {
        id: row.id
      }
      delWeworkRelation(params).then(res => {
         if (res.code == 1) {
           this.$message.success('删除成功');
           this.getList()
         } else {
            this.$message.error(res.msg)
         }
      })
    },
    handleUpdate(row) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(row));
    }
  }
}
</script>
<style scoped>
  .table {
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
