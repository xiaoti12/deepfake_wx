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
        id:'',
        loading: false,
        hasUserInfo: true,
        userimg: '/img/wechat.png',
        imgL:[],
        // userimgInfo: {},
        
        openModeSetting: false,
        modeIndex: 0,
        modeConfig: {
            value: 'origin',
            name: '原图',},
        mode: [{
            value: 'origin',
            name: '原图',
        },
        {
            value: 'adv',
            name: '处理后',
        },
        {
            value: 'deepfake',
            name: 'fake',
        },
        {
            value: 'adv_fake',
            name: '处理后fake',
        },
        ],
        else:{
            name:'其余特征:',
            items:[
                {name:'有眼镜',value:'glasses'},
                {name:'小眼睛',value:'seye'},
                {name:'浓妆',value:'makeup'},
                {name:'鹅蛋脸',value:'egg'},
                {name:'微笑',value:'smile'},
                {name:'张嘴',value:'openm'},
                {name:'年轻',value:'young'},
                {name:'鬓角',value:'bj'},

            ]
        },
        configKey: ['hair','hcolor','hstyle','sex','beard','target'],
            config: {
                hair:{
                    name:'头发： ',
                    show:true,
                    items:[
                        {name:'有头发',value:'YES'},
                        {name:'没有头发',value:'NO',checked: 'true'},
                    ]
                },
                beard:{
                    name:'胡须： ',
                    show:true,
                    items:[
                        {name:'小胡子',value:'xhz'},
                        {name:'短胡须',value:'dhx'},
                        {name:'无胡须',value:'whx', checked: 'true'},
                    ]
                },
                hcolor: {
                    name: '发色： ',
                    show:false,
                    items:[
                        {name: '黑发', value: 'Black'},
                        {name: '棕发', value: 'Brown', checked: 'true'},
                        {name: '金发', value: 'Blond'},
                    ]
                },
                hstyle:{
                    name:'发型： ',
                    show:false,
                    items:[
                        {name:'直发',value:'straight',checked:'true'},
                        {name:'卷发',value:'curly'}
                    ]
                },
                sex: {
                    name: '性别： ',
                    show:true,
                    items:[
                        {name: '男性', value: 'Male'},
                        {name: '女性', value: 'Female', checked: 'true'},
                    ]
                },
                target:{
                    name:'目标： ',
                    show:true,
                    items:[
                        {name: '黑发',value: 'TBlack',checked :'true'},
                        {name: '金发',value: 'TBlond'},
                        {name: '棕发',value: 'TBrown'},
                        {name: '男性',value: 'TMale'},
                    ]
                }
            }
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
        var that = this
        if (this.data.loading) return
        wx.chooseImage({
            count: 1,
            success: res=>{
                var filePath = res.tempFilePaths[0];
                that.setData({
                img: res.tempFilePaths[0],
                })
                console.log("图片临时网址，小程序关闭后将会被销毁：");
                console.log(filePath)
                this.openModeConfig()
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
                    var data = tool(this.data.img, modeConfig, imgInfo,this.data.imgL)
                    this.setData({
                        showImg: data
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
                wx.canvasPutImageData({
                    canvasId: 'myCanvas',
                    data: res.data,
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                    success: res => {
                        drawImg()
                    },
                    fail: failFun
                })

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
    submit(){
        // const id=''
        const index = this.data.modeIndex
        const modeConfig=this.data.modeConfig
        // console.log(that.data.modeConfig)
        wx.uploadFile({ 
            // url: 'https://sm.ms/api/upload',//图床URL 
            url: 'http://10.122.233.152/php_server/upload_img.php', 
            filePath: this.data.img, 
            name: 'smfile', 
            formData:{ 
                'user':'test' 
            }, 
            success: res => { 
              //逆向转换JSON字符串后抽取网址 ]\
              console.log(res)
              console.log("图片上传成功！") 
              var data=JSON.parse(res.data) 
            //   console.log(data)
            //   id:res.data.message
                // id:res.message
                // var id=data.data
                this.setData({
                    id:data.data
                })
                this.submitForm()
            } 
        })
        
    },
    submitForm(){
        // console.log(this.data.else)
        wx.request({ 
            url: 'http://10.122.233.152/php_server/form.php', 
            method: "POST",
            data:{
                name:this.data.id,
                config:JSON.stringify(this.data.config),
                else:JSON.stringify(this.data.else)
            },
            header: { 
            "Content-Type": "application/x-www-form-urlencoded"
            },
            success: res=> {
                console.log(res.data.data)
                // var data=JSON.parse(res.data) 
                    this.setData({
                        imgL:res.data.data
                    })
                this.transImage()
            }
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
        this.submit()
        wx.nextTick(() => {
            this.imgLoad()
        })

    },
    openIndex1(){
        wx.navigateTo({
            url: '/pages/index1/index',
        })
    },
    radioChange: function(e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value)
        if(e.detail.value=='YES')
        {
            this.setData({
                ['config.hcolor.show']:true,
                ['config.hstyle.show']:true,
            })
        }
        else if(e.detail.value=='NO')
        {
            this.setData({
                ['config.hcolor.show']:false,
                ['config.hstyle.show']:false,
            })
        }
        var config = this.data.config
        var configKey=this.data.configKey
        var key
        var cvalue
        // console.log(items[0])
        var values = e.detail.value
        for (key in configKey)
        {
            key=configKey[key]
            for(cvalue in config[key].items)
            {
                cvalue=config[key].items[cvalue]
                if (cvalue.value==values)
                    cvalue.checked=true
                    this.setData({
                        cvalue
                    })
                
            }
        }
      },
    checkboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        var items = this.data.else.items

        // console.log(items[0])
        var values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
          items[i].checked = false
    
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
            if (items[i].value === values[j]) {
              items[i].checked = true
              break
            }
          }
        }
        this.setData({
          items
        })
    },
})
