import XLSX from 'xlsx';
import priceFormatter from './priceFormatter';
import { findPriceIndex } from './findPriceIndex';

const prepareJSON = (data, cart, currency) => {
  return data.map(row => {
    let price = '';
    let priceMatch = -1;

    if (cart) {
      priceMatch = findPriceIndex(row.pricebreaks, row.cart);
      price = priceFormatter((row.cart * parseFloat(row.pricebreaks[priceMatch].price / currency.exChange)).toFixed(2));
      row.price = priceMatch + '#' + price;
    }

    row.pricebreaks = row.pricebreaks.map(p => `${p.quant} - ${priceFormatter(p.price / currency.exChange)}`).join('\n');

    row.currency = currency.name;

    delete row.id;
    delete row.cur;
    delete row.request;
    delete row.currentPricebreak;

    return row;
  });
};

export const xlsDownload = (data, currency, cart) => {
  let fileName = cart ? 'cart' : 'search';

  const tableHeader = ['manufacturer', 'name', 'brand', 'quantity', 'pack_quant', 'price_unit', 'moq', 'delivery_period'];

  if (cart) {
    tableHeader.push('cart');
  }

  tableHeader.push('pricebreaks');

  if (cart) {
    tableHeader.push('price');
  }

  tableHeader.push('currency');

  let WS = XLSX.utils.json_to_sheet(prepareJSON(JSON.parse(JSON.stringify(data)), cart, currency), { header: tableHeader });

  if (cart) {
    let newJSON = XLSX.utils.sheet_to_json(WS);

    Object.keys(newJSON).map(j => {
      let row = newJSON[j];
      let priceMatch = row.price.split('#');
      let space = '\n'.repeat(+priceMatch[0]);
      row.currency = space + row.currency;
      row.cart = space + row.cart;
      row.price = space + priceMatch[1];
    });

    WS = XLSX.utils.json_to_sheet(newJSON, { header: tableHeader });
  }

  let WB = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(WB, WS, fileName);

  XLSX.writeFile(WB, fileName + '.xls');
};
