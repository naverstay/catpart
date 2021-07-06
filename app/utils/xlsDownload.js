import XLSX from 'xlsx';
import priceFormatter from './priceFormatter';
import { findPriceIndex } from './findPriceIndex';

const MODE_CART = 0;
const MODE_BOM = 1;
const MODE_SEARCH = -1;

const transformSearchData = data =>
  data.reduce(
    (arr, c) =>
      arr.concat(
        c.hasOwnProperty('data')
          ? c.data.map(d => {
              d.query = c.q;
            return d;
            })
          : [],
      ),
    [],
  );

const prepareJSON = (data, mode, currency) => {
  if (mode !== MODE_CART) {
    data = transformSearchData(data);
  }

  return data.map(row => {
    let price = '';
    let priceMatch = -1;

    if (mode === MODE_CART) {
      priceMatch = findPriceIndex(row.pricebreaks, row.cart);
      price = priceFormatter((row.cart * parseFloat(row.pricebreaks[priceMatch].price / currency.exChange)).toFixed(currency.precision), currency.precision);
      row.price = `${priceMatch}#${price}`;
    } else {
      delete row.cart;
    }

    row.pricebreaks = row.pricebreaks.map(p => `${p.quant} - ${priceFormatter(p.price / currency.exChange, currency.precision)}`).join('\n');

    row.currency = currency.name;

    delete row.id;
    delete row.cur;
    delete row.request;
    delete row.currentPricebreak;

    return row;
  });
};

export const xlsDownload = (data, currency, mode) => {
  console.log('xlsDownload', mode);

  if (data && data.length) {
    const fileName = mode === MODE_CART ? 'cart' : 'search';

    let tableHeader = ['manufacturer', 'name', 'brand', 'quantity', 'pack_quant', 'price_unit', 'moq', 'delivery_period'];

    if (mode === MODE_CART) {
      tableHeader.push('cart');
    }

    tableHeader.push('pricebreaks');

    if (mode === MODE_CART) {
      tableHeader.push('price');
    }

    tableHeader.push('currency');

    if (mode === MODE_BOM) {
      tableHeader = ['query', ...tableHeader];
    }

    let WS = XLSX.utils.json_to_sheet(prepareJSON(JSON.parse(JSON.stringify(data)), mode, currency), { header: tableHeader });

    if (mode === MODE_CART) {
      const newJSON = XLSX.utils.sheet_to_json(WS);

      Object.keys(newJSON).map(j => {
        const row = newJSON[j];
        const priceMatch = row.price.split('#');
        const space = '\n'.repeat(+priceMatch[0]);
        row.currency = space + row.currency;
        row.cart = space + row.cart;
        row.price = space + priceMatch[1];
      });

      WS = XLSX.utils.json_to_sheet(newJSON, { header: tableHeader });
    }

    const WB = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(WB, WS, fileName);

    XLSX.writeFile(WB, `${fileName}.xls`);
  }
};