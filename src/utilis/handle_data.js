export default {
    /*查询所有数据*/
    handel_fetchData_query: function (Vue, url, methodName, param, callback) {
         Vue.$http.post(url, {"methodName": methodName,"param": JSON.stringify(param)}).then((res) => {
            if(res.data.code===0){
                Vue.$http.headers.common['sign'] = res.data.sign;
                callback(res.data);
            }else{
                 alert(res.data.msg);
            }
         })
    },
    fetchData: function (Vue, url, methodName, param, callback) {
        Vue.$http.post(url, {"methodName": methodName,"param": JSON.stringify(param)}).then((res) => {
            if(res.data.code===0){
                Vue.$http.headers.common['sign'] = res.data.sign;
                callback(res.data.data);
            }else{
                alert(res.data.msg);
            }
        })
    },
    deleteData: function (Vue, url, methodName, param, callback) {
        Vue.$http.post(url, {"methodName": methodName,"param": JSON.stringify(param)}).then((res) => {
            if(res.data.code===0){
                Vue.$http.headers.common['sign'] = res.data.sign;
                callback(res.data.data);
            }else{
                alert(res.data.msg);
            }
        })
    },


    /*上传文件到腾讯云*/
    uploadQcload: function(Vue, dir, file, callbacks){
        var self = this,
            cos = new COS({
                SecretId    : 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey   : 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
            });
        cos.putObject({
            Bucket          : 'wxapplet-1253887111',
            Region          : 'ap-beijing-1',
            Key             : dir + '/' + file.name,
            StorageClass    : 'STANDARD',
            Body            : file, // 上传文件对象
            onProgress: function(progressData) {
                progress.innerHTML = '上传完成' +  progressData.percent * 100 + '%';
                if(progressData.loaded == progressData.total){
                    alert('上传成功')
                }
            }
        }, function(err, data) {
            callbacks(data)
        });
    },

    handle_upload_qcload(Vue, dir, file, callbacks){
        // var Bucket = 'wxapplet-1253887111';
        // var Region = 'ap-beijing-1';
        // //初始化实例
        // var cos = new COS({
        //     getAuthorization: function (options, callback) {
        //         //异步获取签名
        //         Vue.$http.post('https://his-dev.gusmedsci.cn/hservice/getTencentCloudInfo', { bucket: options.Bucket, region: options.Region}).then(function (res) {
        //             console.log('back', res.body)
        //             Vue.$http.headers.common['sign'] = res.body.sign;
        //             callback({
        //                 SecretId     :res.body.data.secretId,
        //                 SecretKey    :res.body.data.secretKey,
        //             });
        //         });
        //     }
        // });
        // setTimeout(function () {
        //     console.log('cos', cos)
        //     cos.sliceUploadFile({
        //         Bucket: Bucket,
        //         Region: Region,
        //         Key:  dir + '/' + file.name,
        //         Body: file,
        //     }, function (err, data) {
        //         console.log(err, data);
        //     });
        // }, 3000)


        var self = this,
            cos = new COS({
                SecretId    : 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
                SecretKey   : 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
            });
        cos.putObject({
            Bucket          : 'wxapplet-1253887111',
            Region          : 'ap-beijing-1',
            Key             : dir + '/' + file.name,
            StorageClass    : 'STANDARD',
            Body            : file, // 上传文件对象
            onProgress: function(progressData) {
                progress.innerHTML = '上传完成' +  progressData.percent * 100 + '%';
                if(progressData.loaded == progressData.total){
                    alert('上传成功')
                }
            }
        }, function(err, data) {
            callbacks(data)
        });
    },
    /*删除腾讯云上的文件*/
    handle_del_qcload(dir, file, callback){
        var cos = new COS({
            SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
            SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
        })

        cos.deleteObject({
            Bucket: 'wxapplet-1253887111',          /* 必须 */
            Region: 'ap-beijing-1',                 /* 必须 */
            Key: dir + '/' + file                               /* 必须 */
        }, function(err, data) {
            callback(data)
        });
    },
    deleteQcload: function (dir, file, callback){
        var cos = new COS({
            SecretId: 'AKIDkqpiYCQu0Qgx2wrJjxzorpcCb9aqpmW5',
            SecretKey: 'kJgqnZDg9YpvtgSEoDQSJzUow0eCoETk'
        })

        cos.deleteObject({
            Bucket: 'wxapplet-1253887111',          /* 必须 */
            Region: 'ap-beijing-1',                 /* 必须 */
            Key: dir + '/' + file                   /* 必须 */
        }, function(err, data) {
            if(data.statusCode == 204){
                callback(data.data)
            }
        });
    }
}