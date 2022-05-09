export default function (attrsString = '') {
    if (attrsString === '') return [];
    // 去除首位多余空格减少无意义判断，尾部增加一个空格用于标记最后一个元素的结尾位置
    attrsString = attrsString.trim() + ' ';
    // 判断当前是否在引号内 默认开始不在
    let isIn = false;
    // 记录上一个属性开始位置
    let point = 0;
    let attrs = [];
    for (let i = 0; i < attrsString.length; i++) {
        let char = attrsString[i];
        // 遇见引号更改状态
        if (char === '"') isIn = !isIn;
        else if (char === ' ' && !isIn) {
            // 如果不在引号内，且当前为空格，则代表处在属性之间，
            // 根据上一个属性的开始位置截取到当前索引为一个属性
            attrs.push(attrsString.substring(point, i));
            // 重新记录属性的位置
            point = i
        }
    }
    // 格式化 attrs 去除多余空格和引号
    return attrs.map(item => ({
        name: item.split('=')[0].trim(),
        value: valueFormat(item.split('=')[1])
    }));
    
}

function valueFormat(value) {
    if(!value) return true
    return value.trim().replace(/\"/g, '');
}