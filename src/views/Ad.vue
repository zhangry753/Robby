<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 运营位列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-add" @click="handleAdd">添加运营位</el-button>
            </div>

            <!-- 列表table -->
            <el-table :data="data" border class="table" ref="multipleTable">
                <el-table-column label="位置">
                    <template slot-scope="scope">{{$const.adPos[scope.row.pos]}}</template>
                </el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="scope">
                        <el-popover v-for="(item, index) in scope.row.pics" :key="index" placement="top" title="" trigger="hover">
                            <img v-if='index<=2' :src="item.pic" alt="image" style="max-width: 350px;"/>
                            <img v-if='index<=2' slot="reference" :src="item.pic" class="dis-img" alt="image">
                        </el-popover>
                        <span v-if='scope.row.pics.length>3' style="font-size: 19px;">&nbsp;&nbsp;...</span>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="描述">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-view" @click="handleView(scope.row)">详情</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="[10, 20, 30, 40, 50]"
                               :current-page="this.cur_page" :page-size="this.pagesize" :total="this.totalNum"
                               @current-change="handleCurrentChange" @size-change="handleSizeChange">
                </el-pagination>
            </div>
        </div>

        <!-- 添加/编辑弹出框 -->
        <el-dialog title="添加/编辑" :visible.sync="formVisible" width="40%" :close-on-click-modal="false">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="位置" required>
                    <el-select v-model="form.pos" placeholder="请选择" value="">
                        <el-option v-for="(label,value) in $const.adPos" :key="value" :label="label" :value="value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.desc"></el-input>
                </el-form-item>
                <h4>图片</h4>
                <template v-for="(item,index) in form.pics">
                    <div @mouseenter="idx=index">
                        <el-form-item label="标题">
                            <el-input v-model="item.title"></el-input>
                        </el-form-item>
<!--                        <el-form-item label="跳转链接">-->
<!--                            <el-input v-model="item.url"></el-input>-->
<!--                        </el-form-item>-->
                        <el-form-item label="图片" required>
                            <img-upload v-model="item.pic" :upload-url="$url.imgUpLoad" :limit="1"
                                        :before-upload="beforeUpload"></img-upload>
                        </el-form-item>
                        <el-button type="danger" size="mini" @click="form.pics.splice(index,1)" style="float: right;">删除</el-button>
                        <div style="clear: both;"></div>
                        <el-divider></el-divider>
                    </div>
                </template>
                <el-button type="primary" size="mini" @click="form.pics.push({})">添加</el-button>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button @click="formVisible = false">取 消</el-button>
            </span>
        </el-dialog>


        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="viewVisible" width="40%">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="位置">{{$const.adPos[form.pos]}}</el-form-item>
                <el-form-item label="描述">{{form.desc}}</el-form-item>
                <el-table :data="form.pics">
                     <el-table-column label="图片">
                         <template slot-scope="scope">
                            <el-popover placement="top" title="" trigger="hover">
                                <img :src="scope.row.pic" alt="加载失败" style="max-width: 350px;"/>
                                <img slot="reference" :src="scope.row.pic" alt="加载失败" class="dis-img"/>
                            </el-popover>
                         </template>
                     </el-table-column>
                     <el-table-column prop="title" label="图片标题"></el-table-column>
<!--                     <el-table-column prop="url" label="跳转链接"></el-table-column>-->
                </el-table>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="viewVisible = false">关 闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    import ImgUpload from "@/components/widget/img_upload/ImgUpload";
    export default {
        name: 'ad',
        components: {ImgUpload},
        data() {
            return {
                tableData: [
                    {
                        "pos": "focus",
                        "desc": "焦点图2:1",
                        "pics": [
                            {
                                "pic": "https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3381573685,1866477444&fm=26&gp=0.jpg",
                                "width": "1080",
                                "height": "610",
                                "title": "",
                                "url": ""
                            },
                            {
                                "pic": "https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3209370120,2008812818&fm=26&gp=0.jpg",
                                "width": "950",
                                "height": "533",
                                "title": "",
                                "url": ""
                            }
                        ],
                        "aid": "373428294885014800",
                        "isdel": "0",
                    }
                ],
                totalNum:0,
                cur_page: 1,
                pagesize:10,
                formVisible: false,
                viewVisible: false,
                form: {
                    'pics':[],
                },
                idx:0,
            }
        },
        created() {
            this.getData();
        },
        computed: {
            data() {
                if(!this.tableData) {
                    return this.tableData;
                }
                return this.tableData.filter((d) => {
                   return d;
                })
            }
        },
        methods: {
            // 分页导航
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            // 分页每页条数变更
            handleSizeChange(val) {
                this.pagesize = val;
                this.getData();
            },
            // 获取数据
            getData() {
                return
                this.$axios.get(this.$url.adList, {
                    params:{
                        page: this.cur_page,
                        pagesize: this.pagesize
                    }
                }).then((res) => {
                    if(res.data.result.status.code === 0) {
                        this.tableData = res.data.result.data;
                        this.totalNum = res.data.result.pageStr.totalNum;
                    } else {
                        this.$message.error(res.data.result.status.msg);
                    }
                })
            },
            // 保存添加/编辑
            save() {
                var params = new FormData(); // 创建form对象
                params.append('formdata', JSON.stringify(this.form)); // 通过append向form对象添加数据
                let url = ('aid' in this.form)? this.$url.adEdit: this.$url.adAdd;
                this.$axios.post(url,
                    params,
                ).then((res) => {
                    if(res.data.result.status.code == 0) {
                        this.$message.success(`保存成功`);
                        this.formVisible = false;
                        this.getData();
                    } else {
                        this.$message.error(res.data.result.status.msg);
                    }
                })
            },
            //图片上传判断
            beforeUpload(file, filelist, next) {
                var img = new Image();
                img.src = file.url;
                let that = this;
                img.onload = function () {
                    if (img.width < img.height) {
                        that.$message.error('上传图片必须为宽图!');
                        next(false);
                    } else {
                        next();
                    }
                }
            },
            //新增按钮事件
            handleAdd() {
                this.form={
                    'pics':[],
                };
                this.formVisible = true;
            },
            //编辑按钮事件
            handleEdit(row) {
                this.form = JSON.parse(JSON.stringify(row));
                this.formVisible = true;
            },
            //查看按钮事件
            handleView(row) {
                this.form = JSON.parse(JSON.stringify(row));
                this.viewVisible = true;
            },
            //删除按钮事件
            handleDelete(row) {
                this.$confirm('确定删除“'+this.$const.adPos[row.pos]+'”吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = new FormData();
                    params.append('aid', row.aid);
                    this.$axios.post(this.$url.adDelete,
                        params,
                    ).then((res) => {
                        if (res.data.result.status.code == 0) {
                            this.$message.success(`删除成功`);
                            this.getData();
                        } else {
                            this.$message.error(res.data.result.status.msg);
                        }
                    });
                }).catch(()=>{});
            },

        }
    };


</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .table{
        width: 100%;
        font-size: 14px;
    }
    .red{
        color: #ff0000;
    }
    .mr10{
        margin-right: 10px;
    }
    .dis-img{
        width: 120px;
        height: 80px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
        display: inline-block;
    }
</style>
