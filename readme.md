
## PURPOSE
diwork 多语

## STEP
1.lanbuild({1, otherArg})
    生成excel

2.lanbuild({2, otherArg})
    生成en,tw

## API
|参数|说明|类型|默认值|
|:--|:---:|:--:|---:|
|type|执行多语编译步骤，共两步|[1,2]|-|
|basepath|根目录，生成en tw代码存放的路径|String|-|
|codePath|实际放置的目录|String|-|
|enDir|翻译人员翻译完成的英文excel|String|-|
|twDir|翻译人员翻译完成的繁体excel|String|-|
|i18n_|生成文件件i18n的目录|String|-|
|i18n_addTags|生成文件，i18n_addTags的目录|String|-|
|defaultDir|生成文件，最新的中文excel|String|-|
|enDirNew|生成文件，最新的英文excel，请保证翻译内容正确，最后注入en|String|-|
|twDirNew|生成文件，最新的繁体excel，请保证翻译内容正确，最后注入tw|String|-|
|addTagsReg|添加$i18n{}$i18n_end标签所使用的正则|Reg|/[\u4E00-\u9FA5]+([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[0-9]|[\?\,\。\.\、])*/g|

 // "name": "@yonyou/ac-lanbuild",
以上参数必须有，缺一不可
具体的配置信息可以参照lanbuild.js
##changelog
version1.0.2:保留第八列的备注信息

version1.0.3:window下的绝对路径与linux下的不一样问题