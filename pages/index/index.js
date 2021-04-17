//index.js
//获取应用实例
const tool = require('./tool.js').tool
const app = getApp();
let ctx;

Page({
    data: {
        img: '',
        showImg: '',
        imgInfo: {},
        loading: false,
        hasUserInfo: true,
        userimg: '/img/wechat.png',
        // userimgInfo: {},
        
        openModeSetting: false,
        modeIndex: 0,
        modeConfig: {},
        mode: [{
            value: 'origin',
            name: '原图',
            configKey: ['hair','sex'],
            config: {
                hair: {
                    name: '头发黑度',
                    value: 1,
                    max: 2,
                    min: 0,
                    step: 1
                },
                sex: {
                    name: '性别',
                    value: '1',
                    max: 2,
                    min: 1,
                    step:1
                }
            }
        },
        {
            value: 'adv',
            name: '处理后',
            configKey: ['hair','sex'],
            config: {
                hair: {
                    name: '头发黑度',
                    value: 1,
                    max: 2,
                    min: 0,
                    step: 1
                },
                sex: {
                    name: '性别',
                    value: '1',
                    max: 2,
                    min: 1,
                    step:1
                }
            }
        },
        {
            value: 'deepfake',
            name: 'fake',
            configKey: ['hair','sex'],
            config: {
                hair: {
                    name: '头发黑度',
                    value: 1,
                    max: 2,
                    min: 0,
                    step: 1
                },
                sex: {
                    name: '性别',
                    value: '1',
                    max: 2,
                    min: 1,
                    step:1
                }
            }
        },
        {
            value: 'adv_fake',
            name: '处理后fake',
            configKey: ['hair','sex'],
            config: {
                hair: {
                    name: '头发黑度',
                    value: 1,
                    max: 2,
                    min: 0,
                    step: 1
                },
                sex: {
                    name: '性别',
                    value: '1',
                    max: 2,
                    min: 1,
                    step:1
                }
            }
        }
    ]
    },

    onLoad: function () {
        ctx = wx.createCanvasContext('myCanvas')
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.setData({
                                loading: false,
                                userInfo: res.userInfo,
                                userimg: res.userInfo.avatarUrl
                            })
                        }
                    })
                }else{
                    this.setData({
                        hasUserInfo: false
                    })
                }
            }
        })
    },
    getUserInfo: function (e) {
        if (e.detail.userInfo){
            this.setData({
                loading: false,
                userInfo: e.detail.userInfo,
                userimg: e.detail.userInfo.avatarUrl,
                hasUserInfo: true
            })
        }else{
            // this.openIndex()
            // wx.showToast({
            //     title: '没图没真相啊',
            //     image: '../../img/wn.png',
            //     duration: 2000
            // })
        }
    },
    imgPreview(){
        wx.previewImage({
            urls: [this.data.showImg]
        })
    },
    saveImg(){
        wx.saveImageToPhotosAlbum({
            filePath: this.data.showImg
        })
    },
    choseImg() {
        if (this.data.loading) return
        wx.chooseImage({
            count: 1,
            success: res=>{
                var filePath = res.tempFilePaths[0];
                this.setData({
                img: res.tempFilePaths[0],
                modelData: {
                    src1: filePath
                }
                })
                console.log("图片临时网址，小程序关闭后将会被销毁：");
                console.log(filePath)
                wx.uploadFile({
                    url: 'https://sm.ms/api/upload',//图床URL
                    filePath: filePath,
                    name: 'origin',
                    success: res => {
                      //逆向转换JSON字符串后抽取网址
                      console.log("图片上传成功！")
                      console.log(JSON.parse(res.data).data.url)
                    }
                })
            }
        })
    },
    imgLoad(res){
        if (this.data.loading || !this.data.img) return
        if(res){
            this.setData({
                imgInfo: res.detail,
                loading: true,
                showImg: ''
            })
        }
        wx.showLoading({
            title: '图像处理中...',
        })
        ctx.drawImage(this.data.img, 0, 0)
        ctx.draw(true, this.transImage)
    },
    // 转换图片
    transImage(){
        const imgInfo = this.data.imgInfo
        const width = imgInfo.width
        const height = imgInfo.height
        const modeConfig = this.data.mode[this.data.modeIndex]

        var failFun = ()=>{
            wx.hideLoading()
            this.setData({
                loading: false
            })
        }
        var drawImg = () => {
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: width,
                height: height,
                destWidth: width,
                destHeight: height,
                canvasId: 'myCanvas',
                quality: 1,
                success: res => {
                    this.setData({
                        showImg: res.tempFilePath
                    })
                },
                complete: failFun
            }) 
        }
        wx.canvasGetImageData({
            canvasId:'myCanvas', 
            x: 0, 
            y: 0, 
            width: width, 
            height: height,
            success: res=>{
                var data = tool(res.data, modeConfig, imgInfo)

                wx.canvasPutImageData({
                    canvasId: 'myCanvas',
                    data: data,
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    success: res => {
                        drawImg()
                    },
                    fail: failFun
                })
                console.log(2)

            },
            fail: failFun
        })
    },
    // 选择模式
    choseMode(e){
        const index = e.currentTarget.dataset.index
        this.setData({
            modeIndex: index
        })
        wx.nextTick(() => {
            this.imgLoad()
        })
    },
    // 打开设置参数
    openModeConfig() {
        const index = this.data.modeIndex
        const modeConfig = JSON.parse(JSON.stringify(this.data.mode[index]))
        this.setData({
            modeConfig: modeConfig,
            openModeSetting: true
        })
    },
    // 取消设置参数
    cancelConfig() {
        this.setData({
            openModeSetting: false
        })
    },
    // 滑块变动
    sliderChange(e) {
        const key = e.currentTarget.dataset.key
        const modeConfig = this.data.modeConfig
        modeConfig.config[key].value = e.detail.value
        this.setData({
            modeConfig: modeConfig
        })
    },
    // 确定设置参数
    confirmConfig() {
        const index = this.data.modeIndex
        const modeConfig = JSON.parse(JSON.stringify(this.data.modeConfig))
        this.setData({
            [`mode[${index}]`]: modeConfig,
            openModeSetting: false
        })
        wx.nextTick(() => {
            this.imgLoad()
        })
    },
    openIndex1(){
        wx.navigateTo({
            url: '/pages/index1/index',
        })
    },
})
