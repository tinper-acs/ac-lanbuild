const fs = require('fs');
const path = require('path');
var Excel = require('exceljs');

let translateFile;
let newFile;
var outPut;
var callBack ;


//翻译好的文件和最新生成的文件
var newFileWorkBook = new Excel.Workbook();
var translateFileWorkBook = new Excel.Workbook();
var translateFileSheet;
var newFileSheet
function i18nCompare(translateFileVal,newFileVal,fileNameVal,callBackVal){
  //定义一个新的表格
  const workbook = new Excel.Workbook();
  var ws2 = workbook.addWorksheet(`${outPut}.xlsx`);
  translateFile = translateFileVal;
  newFile = newFileVal;
  outPut = fileNameVal;
  callBack = callBackVal;
  translateFileWorkBook.xlsx.readFile(translateFile).then(()=>{
      translateFileSheet = translateFileWorkBook.getWorksheet(1);
      if(translateFileSheet) nextFunc(workbook,ws2)  ;
  })

}

var nextFunc = function (workbook,ws2) {
  newFileWorkBook.xlsx.readFile(newFile).then((res) => {
      newFileSheet = newFileWorkBook.getWorksheet(1); //or name of the worksheet
      if(newFileSheet ){
        getTranslate(newFileSheet,translateFileSheet,ws2);
        writeFunc(workbook);
      }
  });
}
var match = false;
var getTranslate = function (newFileSheet,translateFileSheet,ws2) {
  if(!newFileSheet || !translateFileSheet) return false;
  newFileSheet.eachRow(function (row, rowNumber) {
    translateFileSheet.eachRow((translateRow, num) =>{
        if(translateRow.values[1].replace(/\/|\\/g,'') === row.values[1].replace(/\/|\\/g,'')  && translateRow.values[6] === row.values[6] && !match){
            match = true
            ws2.addRow([row.values[1], row.values[2], row.values[3],row.values[4], row.values[5], row.values[6], translateRow.values[7], translateRow.values[8]]);
        }else if(!match && num === translateFileSheet.actualRowCount){
          ws2.addRow([row.values[1], row.values[2], row.values[3],row.values[4], row.values[5], row.values[6], row.values[7], '']);
        }
    });
    //新的一轮默认为false
    match  = false;
  });
  
}
var writeFunc = function (workbook) {
  workbook.xlsx.writeFile(`${outPut}.xlsx`)
  .then(function () {
    console.log(`生成${outPut}.xlsx`);
    callBack();
  });
}



module.exports = i18nCompare;

