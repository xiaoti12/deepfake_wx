const tools = {
    //原图
    origin: function (data, config, width, height) {
        
        return data
    },
    //处理
    adv: function (data, config, width, height) {
        
        return data
    },
    //fake
    deepfake: function (data, config, width, height) {
        
        return data
    },
    //处理后fake
    adv_fake: function (data, config, width, height) {
       
        return data
    },
}


module.exports.tool = function (data, config, imgInfo){
    const name = config.value || 'statue'
    const width = imgInfo.width
    const height = imgInfo.height
    return tools[name](data, config, width, height)
}