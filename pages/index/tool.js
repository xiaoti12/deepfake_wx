const tools = {
    //原图
    // origin: function (imgL) {
    //     return img
    // },
    //处理
    adv: function (imgL) {
        console.log(imgL[0])
        if(imgL[0].indexOf(".jpg")==-1)
        {
            imgL[0]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'//错误
        }
        return imgL[0]
    },
    //fake
    deepfake: function (imgL) {
        console.log(imgL[1])
        if(imgL[1].indexOf(".jpg")==-1)
        {
            imgL[1]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[1]
    },
    //处理后fake
    adv_fake: function (imgL) {
        console.log(imgL[2])
        if(imgL[2].indexOf(".jpg")==-1)
        {
            imgL[2]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[2]
    },
}


module.exports.tool = function (img, config, imgInfo,imgL){
    const name = config.value || 'statue'
    const width = imgInfo.width
    const height = imgInfo.height
    if(name=='origin')
    {
        return img
    }
    if(imgL=='')
    {
        return 'cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/u=1809196152,3795074716'//请等待
    }
    // imgL[0]=data.data[0]
    // imgL[1]=data.data[1]
    // imgL[2]=data.data[2]
    // imgL[3]=data.data[3]

    return tools[name](imgL)
}