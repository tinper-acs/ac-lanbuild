/**
 * Created by liuqnh on 2017/12/21.
 */


const fs = require('fs');
const path = require('path');
const lineReader = require('readline');
let allFile = 0;
let allStreamFile = 0;
let callBackVal;
function walk(dir, dir_i18n,addTagsReg, done) {
  if (!fs.existsSync(dir_i18n)) { fs.mkdirSync(dir_i18n); }
  let results = [];
  const root = dir;
  const root_i18n = dir_i18n;
  let list  = fs.readdirSync(dir);
  let pending = list.length;
  if (!pending) return false;
  list.forEach((file) => {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { // 文件的嵌套
      var half = file.substring(root.length, file.length);
      if (!fs.existsSync(root_i18n + half)) {
        fs.mkdirSync(root_i18n + half);
      }
      walk(file, root_i18n + half ,addTagsReg,(err, res) => {
          results = results.concat(res);
          // if (!--pending) done(null, results);
      });
    } else { //这是单个文件
      ++allFile;
      results.push(file);
      var half = file.substring(root.length, file.length);
      // 20180531新增判断如果不是js文件，则不用解析了
      // if(file.match(/.jpg|.gif|.png|.bmp|.svg|.css|.woff/i)){
      //   //fs.copyFileSync(file,root_i18n+half);
      //   fs.writeFileSync(root_i18n+half, fs.readFileSync(file)); 
      //   ++allStreamFile;
      // }else 
      if(file.match(/.js|.jsx/i) && stat.size >0){
        let readLine = lineReader.createInterface({
          input: fs.createReadStream(file),
        });// 先创建一个实例
        let count = 0;
        readLine.on('line', (line) => {
            var spieces=line.trim(line);// 拿到所有字符串
            // var re= /([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[0-9]|[\?\,\。\.\、\/])*/g; 
            var re = addTagsReg;
            var regNote =/(^.*\/\/|^\s*\/\*.*\*\/$)/g; // 存在的问题：中文展示后面有注释
            var replaced=''
            var matchNote = spieces.match(regNote);
            // 添加一个判断 是否是注释
            if(matchNote){
              replaced=replaced+spieces;
            }else{
              var match=spieces.match(re);//取到中文
              // 20180605 新增判断，如果一行代码多处匹配
              if(match){ // 由此可见值校验前半段
                  if(match.length > 1){
                      // 一行逐一替换
                      var subMatch;
                      var replaced;
                      var tempReplace = spieces ;
                      var subReplace; 
                      var endFlag;
                      match.map((item)=>{
                          subMatch = '$i18n{' +item+'}$i18n-end' ;
                          endFlag  = tempReplace.indexOf(item)+ item.length;
                          subReplace = tempReplace.substring(0,endFlag);
                          tempReplace  = tempReplace.substring(endFlag);
                          subReplace = subReplace.replace(new RegExp(item,'g'), subMatch);
                          replaced += subReplace
                      });
                      replaced += tempReplace;
                  }else{ //只有一处匹配那么全局替换就可以
                    var replacement = '$i18n{' + match +'}$i18n-end' ;
                    replaced=replaced+spieces.replace(re,replacement)
                  }
              }else{
                  replaced=replaced+spieces;
              }
            }
            fs.appendFileSync(root_i18n+half, replaced+'\n');
        });
        readLine.on('close',res=>{
          ++allStreamFile;
          if(allStreamFile == allFile){
            console.log('i18n_tool_addTags.js结束');
            callBackVal(null,1)
          }
        })
      }else{
        fs.writeFileSync(root_i18n+half, fs.readFileSync(file)); 
        ++allStreamFile;
      }
    }
    // if (!--pending) done(null, results);
  });
};

function addTags(indir,addTagsReg=/[\u4E00-\u9FA5]+([\u4E00-\u9FA5]|[\uFE30-\uFFA0]|[0-9]|[\?\,\。\.\、])*/g,callBack){
  callBackVal = callBack;
  const rootpaths = indir.split(/\/|\\/);// [,Users,yaoxin,Downloads,workspace,cloud-os_manager_fe,src]
  const root_i18n = `${indir.substring(0, indir.length - rootpaths[rootpaths.length - 1].length)}i18n_addTags`; // /Users/yaoxin/Downloads/workspace/cloud-os_manager_fe/i18n
  if (!fs.existsSync(root_i18n)) { fs.mkdirSync(root_i18n); }
  let err,results;
  walk(indir, root_i18n,addTagsReg,(err, results) => {
   err = err;
   results = results;
  });
}

module.exports = addTags;