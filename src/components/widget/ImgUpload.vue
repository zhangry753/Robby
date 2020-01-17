<!--
    图片上传控件
    example单图: <img-upload v-model="url" :upload-url="imgUpLoadUrl" :limit="1"></img-upload>
    example多图: <img-upload v-model="urlList" :upload-url="imgUpLoadUrl"></img-upload>
    example上传检测: :before-upload = "(file,filelist,next) => {next(true)}"
    author: runyan1@staff.sina.com.cn
    createdTime: 2019/10/31
-->
<template>
    <el-upload ref="upload" list-type="picture-card" :file-list="filelist"
               :limit="limit" :multiple="limit==1? false: multiple" :auto-upload="false" action="#"
               :on-change="handleChange" :on-remove="handleRemove" :on-exceed="handleExceed">
        <i slot="default" class="el-icon-plus"></i>
    </el-upload>
</template>

<script>

    export default {
        name: "ImgUpload",
        props: {
            value: {
                type: Array|String,
            },
            uploadUrl: {
                type: String,
                required: true,
            },
            limit: Number,
            multiple: Boolean,
            //func(file, filelist, next)
            beforeUpload: Function,
            //func(file, res)
            uploadSucc: Function,
            //func(file, res)
            uploadError: Function,
        },
        data() {
            return {
                filelist: [],
                uploadQueue: [],
                isUploading() {
                    return this.uploadQueue.length>0;
                }
            }
        },
        watch: {
            value(val) {
                this.load();
            },
        },
        mounted() {
            this.load();
        },
        methods: {
            load() {
                if(!this.value) {
                    this.filelist = [];
                } else {
                    if (this.limit == 1) {
                        this.filelist = [{url: this.value}];
                    } else {
                        let filelist = [];
                        for (let url of this.value) {
                            filelist.push({url: url});
                        }
                        this.filelist = filelist;
                    }
                }
                this.toggleUploadButton();
            },
            update() {
                this.toggleUploadButton();
                if(this.limit == 1) {
                    this.$emit('input', this.filelist.length>0? this.filelist[0].url: '');
                } else {
                    let value = [];
                    for(let file of this.filelist) {
                        value.push(file.url);
                    }
                    this.$emit('input', value);
                }
            },
            handleChange(file, filelist) {
                var that = this;
                let uploadFunc = function (pass=true) {
                    if(!pass) {
                        filelist.splice(filelist.indexOf(file), 1);
                        return;
                    }
                    that.uploadQueue.push(file.uid);
                    //压缩图片
                    var img = new Image();
                    img.src = file.url;
                    this.imageCompress(img).then(blob => {
                        var params = new FormData();
                        params.append('file', blob);
                        that.$axios.post(that.uploadUrl,
                            params,
                        ).then((res) => {
                            if (res.data.result.status.code == 0) {
                                file.url = res.data.result.data.url;
                                that.filelist.push(file);
                                that.update();
                                that.uploadSucc instanceof Function && that.uploadSucc(file, res);
                            } else {
                                that.$message.error(res.data.result.status.msg);
                                filelist.splice(filelist.indexOf(file), 1);
                                that.uploadError instanceof Function && that.uploadError(file, res);
                            }
                            that.uploadQueue.splice(that.uploadQueue.indexOf(file.uid), 1);
                        }).catch(res => {
                            that.$message.error(res);
                            filelist.splice(filelist.indexOf(file), 1);
                            that.uploadQueue.splice(that.uploadQueue.indexOf(file.uid), 1);
                            that.uploadError instanceof Function && that.uploadError(file, res);
                        })
                    });
                };
                if(this.beforeUpload instanceof Function){
                    this.beforeUpload(file, filelist, uploadFunc);
                } else {
                    uploadFunc();
                }
            },
            handleRemove(file, filelist) {
                this.filelist = filelist;
                this.update();
            },
            //达到最大限制时隐藏上传按钮，待优化
            toggleUploadButton() {
                let uploadButton = this.$refs.upload.$el.getElementsByClassName('el-upload');
                if(uploadButton && uploadButton.length>0) {
                    if (this.filelist.length >= this.limit) {
                        uploadButton[0].style.display = 'none';
                    } else {
                        uploadButton[0].style.display = 'inline-block';
                    }
                }
            },
            handleExceed(file, filelist) {
                this.$message.error('已达到最大上传数量');
            },
            //图片压缩
            imageCompress(img, {maxWidth=1080, maxHeight=1080, quality=0.92, mimeType="image/jpeg"}={}) {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                return new Promise(function (resolve, reject) {
                    let work = function () {
                        //选需要缩放最少的边，不会拉伸
                        var ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                        canvas.width = img.width * ratio;
                        canvas.height = img.height * ratio;
                        context.drawImage(img, 0, 0, canvas.width, canvas.height);
                        canvas.toBlob((blob) => {
                            resolve(blob);
                        }, mimeType, quality);
                    };
                    //如果img未加载则等待img加载后再压缩
                    if(!img.width) {
                        let onloadHandler = function (event) {
                            img.removeEventListener('load', onloadHandler);
                            work();
                        };
                        img.addEventListener('load', onloadHandler);
                    } else {
                        work();
                    }
                });
            },

        }
    }
</script>

<style scoped>

</style>