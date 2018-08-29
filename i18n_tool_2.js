/**
 * Created by liuqnh on 2017/12/21.
 */


const fs = require('fs');
const path = require('path');
const lineReader = require('readline');


var walk = function (dir, dir_i18n, lan, done) {
  let results = [];
  const root = dir;
  const root_i18n = dir_i18n;


  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {

          var half = file.substring(root.length, file.length);
          if (!fs.existsSync(root_i18n + half)) {
            fs.mkdirSync(root_i18n + half);

          }

          walk(file, root_i18n + half, lan, function (err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {

          var tails = file.split('.')
          if (tails[tails.length - 1] != 'i18n') {
            results.push(file);


            var readLine = lineReader.createInterface({
              input: fs.createReadStream(file)
            });


            var half = file.substring(root.length, file.length);

            if (fs.existsSync(root_i18n + half)) {
              fs.truncateSync(root_i18n + half)
            }
             // 20180531 添加图片不处理
            if(file.match(/.jpg|.gif|.png|.bmp|.svg|.css|.woff/i)){
              fs.writeFileSync(root_i18n + half, fs.readFileSync(file)); 
            } else {
              readLine.on('line', function (line) {
                var spieces = line.split(/\$i18n-end/)
                var re = /\$i18n{.+}/g
                var replaced = ''
                for (i = 0; i < spieces.length; i++) {
  
                  var match = spieces[i].match(re)
                  if (match) {
                    var key = match[0].substring(6, match[0].length - 1)
                    var i18n_file = dir + half + '.' + lan + '.i18n'
  
                    var replacement = getValue(i18n_file, key)
                    replaced = replaced + spieces[i].replace(re, replacement)
  
                  } else {
                    replaced = replaced + spieces[i]
                  }
  
  
                }
                fs.appendFileSync(root_i18n + half, replaced + '\n')
              })
            }
          }

        }


        if (!--pending) done(null, results);
      });
    });
  });
};
var getValue = function (i18n_file, key) {
  if (!fs.existsSync(i18n_file)) return 'NoDictionary';
  const content = fs.readFileSync(i18n_file).toString().split('\n');
  for (let i = 0; i < content.length; i++) {
    const obj = JSON.parse(content[i]);
    if (obj.key == key) {
      return obj.value;
    }
  }
};

var lansRecursive = function (path, lans) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      // const curPath = `${path}/${file}`;
      let curPath = path.join(path,file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        lans = lansRecursive(curPath, lans);
      } else {
        const tails = curPath.split('.');
        if (tails[tails.length - 1] == 'i18n' && lans.indexOf(tails[tails.length - 2]) == -1) {
          lans = lans.concat(tails[tails.length - 2]);
        }
      }
    });
  }
  return lans;
};

// var deleteall = function (path) {
//   let files = [];
//   if (fs.existsSync(path)) {
//     files = fs.readdirSync(path);
//     files.forEach((file, index) => {
//       const curPath = `${path}/${file}`;
//       if (fs.statSync(curPath).isDirectory()) { // recurse
//         deleteall(curPath);
//       } else { // delete file
//         fs.unlinkSync(curPath);
//       }
//     });
//     fs.rmdirSync(path);
//   }
// };



function i18nEnd(indir,callBack){
  // const indir = process.argv[2];
  const rootpaths = indir.split(/\/|\\/);
  const root_i18n = indir;
  if (!fs.existsSync(root_i18n)) { fs.mkdirSync(root_i18n); }
  let lans = [];
  lans = lansRecursive(root_i18n, lans);
  for (i = 0; i < lans.length; i++) {
    const root_lan = indir.substring(0, indir.length - rootpaths[rootpaths.length - 1].length) + lans[i];
    if (lans[i] == 'cn') continue;
    if (!fs.existsSync(root_lan)) { fs.mkdirSync(root_lan); }
    walk(indir, root_lan, lans[i], (err, results) => {
      callBack(err, results)
      // if (err) throw err;
      // const root_i18n_addTags = `${indir.substring(0, indir.length - rootpaths[rootpaths.length - 1].length)}i18n_addTags`; // /Users/yaoxin/Downloads/workspace/cloud-os_manager_fe/i18n
      // deleteall(root_i18n_addTags);
    });
  }
}
module.exports = i18nEnd

