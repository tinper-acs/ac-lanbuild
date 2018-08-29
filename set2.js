/**
 * Created by 51375 on 2017/7/8.
 */


var path = require('path');
let fs = require('fs');

// let addTags = require('./i18n_tool_addTags');
let i18nGenerate =  require('./i18n_tool_1');
let i18nImport = require('./i18n_tool_importExcel');
let i18nEnd = require('./i18n_tool_2');


// let basepath = path.join(__dirname,'./src');
// let i18n_addTags = path.join(__dirname,'./i18n_addTags');
// let i18n_ = path.join(__dirname,'./i18n');
// let enDirNew = path.join(__dirname,'./manager_new_en.xlsx'); 
// let twDirNew = path.join(__dirname,'./manager_new_tw.xlsx'); 
// let defaultDir = path.join(__dirname,'./default.xlsx'); 
//addTags

// let addTagsFunc = function (basepath) {
//     return new Promise((res, rej) => {
//         addTags(basepath, (err, results) => {
//             if (err) rej(err);
//             res(1);
//         });
        
//     })
// }

//i18n
let i18nGenerateFunc = function (addTagsDir) {
    return new Promise((res,rej)=>{
        i18nGenerate(addTagsDir, (err, results) => {
            if (err) rej(err);
            res(1);
        });
    })
   
}
let i18nImportFunc = function (root_i18n, codePath,fileName , lanType) {
    return new Promise((res, rej)=>{
        i18nImport(root_i18n,codePath, fileName , lanType,(err,results)=>{
            if (err) rej(err);
            res(results)
        })
    })
}
let i18nEndFunc = function (root_i18n) {
    return new Promise((res, rej)=>{
        i18nEnd(root_i18n,(err,results)=>{
            if (err) rej(err);
            res(results);
        })
    })
}

let  deleteFile = function (path) {
    let files = [];
    if(fs.existsSync(path) && fs.statSync(path).isFile()){
        fs.unlinkSync(path);
        return false;
    }
    
  };

  let deleteFolder = function (pathVal) {
    let files = [];
    if(fs.existsSync(pathVal) ) {
        files = fs.readdirSync(pathVal);
        files.forEach(function(file,index){
            // var curPath = pathVal + "/" + file;
            var curPath = path.join(pathVal,file);
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(pathVal);
    }
    
  }


async function creatCpt(res) {
    // let { basepath,i18n_addTags,i18n_, enDirNew, twDirNew, defaultDir,codePath} = res;
    let { basepath,i18n_addTags,i18n_, outPutObj, defaultDir,codePath} = res;
    try {
        if(Object.keys(outPutObj).length>0){
            for(let key in outPutObj){
                await i18nImportFunc(i18n_,codePath, outPutObj[key].dirNew , key);
            }
        }
        // await i18nImportFunc(i18n_,codePath, enDirNew , 'en');
        // await i18nImportFunc(i18n_,codePath, twDirNew , 'tw');
        await i18nEndFunc(i18n_);
        //完成构建之后
        deleteFile(defaultDir);
        deleteFolder(i18n_addTags);
        // deleteFolder(i18n_);
        return console.log(`Successfully created en and tw`)
    }
    catch (err) {
        console.error(err);
    }
}
// creatCpt();
module.exports = creatCpt;
