const tools = {
    //原图
    origin: function (imgL) {
        console.log(imgL[0])
        if(imgL[0].indexOf(".jpg")==-1)
        {
            imgL[0]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[0]
    },
    //处理
    adv: function (imgL) {
        console.log(imgL[1])
        if(imgL[1].indexOf(".jpg")==-1)
        {
            imgL[1]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[1]
    },
    //fake
    deepfake: function (imgL) {
        console.log(imgL[2])
        if(imgL[2].indexOf(".jpg")==-1)
        {
            imgL[2]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[2]
    },
    //处理后fake
    adv_fake: function (imgL) {
        console.log(imgL[3])
        if(imgL[3].indexOf(".jpg")==-1)
        {
            imgL[3]='cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
        }
        return imgL[3]
    },
}


module.exports.tool = function (img, config, imgInfo,imgL){
    const name = config.value || 'statue'
    const width = imgInfo.width
    const height = imgInfo.height
    if(imgL=='')
    {
        return 'cloud://cloud1-1gsixq0o25238361.636c-cloud1-1gsixq0o25238361-1305525063/wn.png'
    }
    // imgL[0]=data.data[0]
    // imgL[1]=data.data[1]
    // imgL[2]=data.data[2]
    // imgL[3]=data.data[3]

    return tools[name](imgL)
}