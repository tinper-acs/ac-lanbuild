const fs = require('fs');
const path = require('path');
var Excel = require('exceljs');

var inboundWorkbook = new Excel.Workbook();

var inputFunc = function (currentFileName, key, value='noDictionnaryFlag') {
  //写入变量
  let obj = {};
  obj.key = key;
  obj.value = value;
  let input = JSON.stringify(obj);
  fs.appendFileSync(currentFileName, input + '\n');
};

function i18nImport(root_i18n, codePath, fileName , lanType='en',callBack) {
  inboundWorkbook.xlsx.readFile(fileName).then(function () {
    var inboundWorksheet = inboundWorkbook.getWorksheet(1); //or name of the worksheet
    let preFileName = undefined;
    let currentFileName = undefined;
    inboundWorksheet.eachRow(function (row, rowNumber) {
      if(rowNumber!==1){
        // currentFileName = root_i18n + '/workbench/pc/' + row.values[1].replace('.cn.i18n',`.${lanType}.i18n`);
        currentFileName = codePath + row.values[1].replace('.cn.i18n',`.${lanType}.i18n`);
        //判断文件是否存在
        if(fs.existsSync(currentFileName) && rowNumber === 2){
          //存在，并且不是由该node创建的,因为node在rowNumber的时候才执行创建
          fs.unlinkSync(currentFileName);
          preFileName = currentFileName ;
          inputFunc(currentFileName,row.values[3],row.values[7]);
        }else{
          inputFunc(currentFileName,row.values[3],row.values[7]);
        }
      }
    });
  }).then((res,error)=>{
    console.log('i18n_tool_import',lanType);
    callBack(res,error)
  });
}

module.exports = i18nImport