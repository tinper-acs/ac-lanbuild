/**
 * Created by yyxx on 2017/7/8.
 * 目的:生成最新的翻译文件，若是有新增词条请交给专业翻译人员再次翻译
 */


var path=require('path');

let addTags = require('./i18n_tool_addTags');
let i18nGenerate =  require('./i18n_tool_1');
let i18nExport = require('./i18n_tool_exportExcel');
let i18nCompare = require('./i18n_tool_compareExcel');

// let basepath = path.join(__dirname,'./src');
// let i18n_addTags = path.join(__dirname,'./i18n_addTags');
// let i18n_ = path.join(__dirname,'./i18n');
// let enDir = path.join(__dirname,'./manager_fe_20180816.xlsx'); 
// let twDir = path.join(__dirname,'./manager_fe_20180816_tw.xlsx'); 
// let defaultDir = path.join(__dirname,'./default.xlsx'); 

//addTags
let addTagsFunc = function (basepath,addTagsReg) {
    return new Promise((res, rej) => {
        addTags(basepath,addTagsReg,(err, results) => {
            if (err) rej(err);
            res(1)
        });
        
    })
}

let i18nGenerateFunc = function (addTagsDir) {
    return new Promise((res,rej)=>{
        i18nGenerate(addTagsDir, (err, results) => {
            if (err) rej(err);
            res(1)
        });
    })
   
}
let i18nExportFunc  =  function (indir,excelName='default',lan='cn') {
    return new Promise((res,rej)=>{
        i18nExport(indir,excelName='default',lan='cn' ,(err, results) => {
            if (err) rej(err);
            res(1);
        });
    })
   
}
let i18nCompareFunc  =  function (dir,translateFile,outPut) {
    console.log('开始compared',outPut)
    return new Promise((res,rej)=>{
        i18nCompare(dir,translateFile,outPut, (err, results) => {
            if (err) rej(err);
            res(1)
        });
    })
   
}
async function getExcel(res) {
    let { basepath,i18n_addTags,i18n_, enDir, twDir, defaultDir,addTagsReg} = res;
    try {
        await addTagsFunc(basepath,addTagsReg)
        // //生成一次i18n2 import4 提取 删除
        await i18nGenerateFunc(i18n_addTags);
        await i18nExportFunc(i18n_);
        await i18nCompareFunc(enDir,defaultDir,'manager_new_en');
        await i18nCompareFunc(twDir,defaultDir,'manager_new_tw');

    }
    catch (err) {
        console.error(err);
    }
}
// getExcel();
module.exports = getExcel;