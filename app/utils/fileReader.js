import XLSX from 'xlsx';
import {tsv2json, json2tsv} from 'tsv-json';

export const readFile = (file, cb) => {
  let txtReader = new FileReader();
  let xlsFile = file && file.name.match(/\.(xls[x]?)$/);

  console.log('file', file);

  let response = (obj) => {
    if (typeof cb === 'function') {
      obj.name = file.name;
      cb(obj);
    }
  }

  txtReader.onload = function () {
    console.log('readFile', txtReader, txtReader.result);

    if (xlsFile) {
      let data = new Uint8Array(txtReader.result);
      let workbook = XLSX.read(data, {type: "array"});

      console.log('workbook', workbook);

      if (workbook.SheetNames.length) {
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        let csv = XLSX.utils.sheet_to_json(sheet);

        response({success: true, text: csv});
      } else {
        response({success: false, text: 'В таблице нет данных'});
      }
    } else {
      let ret = txtReader.result;

      if (file.name.match(/\.tsv$/)) {
        console.log('TSV');
        ret = tsv2json(ret);
      }

      response({success: true, text: ret});
    }
  };

  txtReader.onerror = function () {
    console.log('readFile', txtReader.error);

    response({success: false, text: ''});
  };

  if (file && file.name.match(/\.([c|t]sv|txt|xls[x]?)$/)) {
    txtReader[xlsFile ? 'readAsArrayBuffer' : 'readAsText'](file);
  } else {
    if (typeof cb === 'function') {
      response({success: false, text: 'Файл не соответствует формату .txt, .csv, .tsv, .xls, . xlsx'});
    }
  }
}

