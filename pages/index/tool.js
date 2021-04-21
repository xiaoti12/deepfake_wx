const tools = {
    //原图
    origin: function (imgL) {
        console.log(imgL[0])
        
        return imgL[0]
    },
    //处理
    adv: function (imgL) {
        console.log(imgL[1])
        return imgL[1]
    },
    //fake
    deepfake: function (imgL) {
        console.log(imgL[2])
        return imgL[2]
    },
    //处理后fake
    adv_fake: function (imgL) {
        console.log(imgL[3])
        return imgL[3]
    },
}


module.exports.tool = function (img, config, imgInfo,imgL){
    const name = config.value || 'statue'
    const width = imgInfo.width
    const height = imgInfo.height
     
    // imgL[0]=data.data[0]
    // imgL[1]=data.data[1]
    // imgL[2]=data.data[2]
    // imgL[3]=data.data[3]

    return tools[name](imgL)
}