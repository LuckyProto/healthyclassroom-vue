//url
export function baseUrl(){
    // return "http://10.20.0.84:8080/hservice";
    //测试用
    //return "https://class-dev.gusmedsci.cn/hservice";
    //生产用
    return "https://health.gusmedsci.cn/hservice";
    // return "http://his.gusskids.cn/cliservice";
}
//本地存储
export function getLocalStorage () {
    if(typeof localStorage == "object"){
        return localStorage;
    }else if(typeof localStorage == "object"){
        return localStorage[location.host]
    }else{
        throw new Error ("Local storage not available")
    }
}

export function fetchData (url, type, data, sign) {
    $.ajax({
        url: url,
        type: type,
        data: data,
        beforeSend: function(xhr){xhr.setRequestHeader('X-Test-Header', sign);},
        success: function () {
            return data;
        }
    });
}

//网络请求返回值处理
export function requestSuccess(data,_this){
    switch (data.code){
        case 0:
            let storage = getLocalStorage();
            storage.setItem("sign", data.sign);
            return true;
        case -1:
            _this.$alert(data.msg, '提示', {
                confirmButtonText: '确定',
            });
            return false;
        case -999:
            _this.$router.push('/');
            return false;
        default:
            return false;

    }

}
//表格数据处理
export function tableRequest(data,page_size){
    let table={};
    table.TableData = data.data.rows;
    table.total_num = data.data.total_num;
    if (table.total_num <= Number(page_size)) {
        table.pagination = "total, sizes";
    } else {
        table.pagination = "total, sizes, prev, pager, next";
    }
    return table;
}
//去前后格
export function StrTrim(str){
    let start=0;
    let end=0;
    for(let i=0;i<str.length;i++){
        if(str.charAt(i)==" ")
            start++;
        else
            break;
    }
    if(str.length>1)
    for(let i=str.length-1;i>=0;i--){
        if(str.charAt(i)==" ")
            end++;
        else
            break;
    }

    return str.substring(start,str.length-end);
}
//获取当前日期
export function CurrentDate(){

    var date = new Date();
    var Y = date.getFullYear();
    var M =(date.getMonth()+1);
    if(M<10)
        M='0'+M;
    var D = date.getDate();
    if(D<10)
        D='0'+D;
    return Y+"-"+M+"-"+D;

}
