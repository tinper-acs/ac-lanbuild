let creatCpt = require('./set2');
let getExcel = require('./set1.js');

function lanbuild(arg){
    let{type,...res} = arg;
    switch(type){
        case 1:
            getExcel(res);
            break;
        case 2:
            creatCpt(res);
            break;
        default:
            console.log('type格式不正确');
            break;
    }
}

module.exports = lanbuild;