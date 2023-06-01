<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="listQuery.createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="添加时间"
          end-placeholder="添加时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          @change="changeAddTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="直播间名">
          <el-select v-model="listQuery.cid" clearable>
            <el-option v-for="(item, index) in groupList"  :key="index" :label="item.account_name" :value="item.cid"></el-option>
          </el-select>
        </el-form-item>
			<el-form-item label="渠道重复">
			  <el-select v-model="listQuery.repeat" clearable placeholder="请选择">
          <el-option label="新增" :value="2"></el-option>
			    <el-option label="重复" :value="1"></el-option>
			  </el-select>
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
				>重置</el-button
			>
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-document"
        @click="exportExcel"
        :loading="downloadLoading"
        >导出
      </el-button>
		</el-form>

    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      max-height="800px"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="直播间名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.client_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sc_p_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属员工" align="center">
        <template slot-scope="{row}">
          <span>{{ row.staff_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ row.company_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reply_title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_del }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道重复" align="center">
        <template slot-scope="{row}">
          <span>{{ row.channel_text }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :pageSizes.sync="pagesize" @pagination="getList" />

  </div>
</template>

<script>
import { searchClientList,clientList } from '@/api/other'
import Pagination from '@/components/Pagination'
import { deepClone } from "@/utils";
const defaultQuery = {
  page: 1,
  limit: 10,
  repeat: '',
  start_time: '',
  end_time: '',
  cid: '',
  createTime: ''
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
      addBtn: false,
      groupList: [],
      pagesize: [10, 20, 30, 50, 100, 200],
      downloadLoading: false,
      downLoadData: [],
    }
  },
  created() {
    this.getList()
    this.getClientList()
  },
  methods: {
    getClientList () {
      clientList().then(res => {
        if (res.code == 1) {
          this.groupList = res.data
        }
      })
    },
    // 查询
    handleSearch() {
			this.listQuery.page = 1
			this.getList()
		},
    // 重置
    handleReset() {
      this.listQuery = JSON.parse(JSON.stringify(defaultQuery))
      this.getList()
    },
    // 监听添加时间改变
    changeAddTime (value) {
      if (value[1].slice(value[1].length - 8, value[1].length) == '00:00:00') {
        var newDate = value[1].slice(0, value[1].length - 8);
        this.listQuery.createTime[1] = newDate + '23:59:59'
      }
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      if (this.listQuery.createTime != '' && this.listQuery.createTime != null) {
        this.listQuery.start_time = this.listQuery.createTime[0];
        this.listQuery.end_time = this.listQuery.createTime[1]
      } else {
        this.listQuery.start_time = '';
        this.listQuery.end_time = '';
      }
      searchClientList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.rows
          this.total = response.data.total
        } 
        this.listLoading = false    
      })
    },
    exportExcel() {
      let _this = this;
      if (this.total == 0) {
        this.$message.error("无数据要导出");
        return false;
      }
      if (this.total > 30000) {
				this.$message.error('数据量大于3W条,请分批导出')
				return false
			}
      this.downloadLoading = true;
      this.$confirm(
        "共检测到 " + this.total + " 条数据，确认要导出？",
        "下载确认框",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "danger",
        }
      )
        .then(async () => {
          _this.downLoadData = [];
          const params = deepClone(this.listQuery);
          let maxPage = parseInt(this.total / 1000 + 1);
          let lists_pro = [];
          for (let i = 1; i <= maxPage; i++) {
            params.page = i;
            params.limit = 1000;
            let list = new Promise(function (resolve, reject) {
              searchClientList(params).then(function (response) {
                if (response.code == 1) {
                  resolve(response.data.rows);
                } else {
                  reject();
                }
              });
            });
            lists_pro.push(list);
          }
          Promise.all(lists_pro).then(function (val) {
            const filterVal = [
              "account_name",
              "client_name",
              "sc_p_title",
              "staff_name",
              "company_name",
              "create_time",
              "reply_title",
              "is_del",
              "channel_text"
            ];
            let lists = [];
            for (let i = 0; i < val.length; i++) {
              let tmp = _this.formatJson(filterVal, val[i]);
              for (let j = 0; j < tmp.length; j++) {
                lists.push(tmp[j]);
              }
            }
            _this.downloadExcel(lists);
          });
        })
        .catch(() => {
          _this.downloadLoading = false;
          return false;
        });
    },
    formatJson(filterVal, jsonData) {
			return jsonData.map((v) =>
				filterVal.map((j) => {
					let vj = ''
					try {
						vj = v[j]
					} catch (err) {}
					return vj
				})
			)
		},
    downloadExcel(data = []) {
      let _this = this;
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        let tHeader = [
          "直播间名",
          "客户姓名",
          "平台",
          "所属员工",
          "企微主体",
          "添加时间",
          "回复状态",
          '删除状态',
          '渠道重复'
        ];
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "资源明细报表",
          autoWidth: _this.autoWidth,
          bookType: _this.bookType,
        });
        _this.downloadLoading = false;
      });
    },
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
