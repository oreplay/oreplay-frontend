/* eslint-disable */
const CATEGORY_OFFICIAL_SUB20 = 'officialSub20';
const CATEGORY_OFFICIAL_SENIOR = 'officialSenior';
const CATEGORY_OTHERS = 'others';
const GENDERS = ['M', 'F'];

function getGenders(categoryData) {
  return Object.keys(categoryData).filter(key => GENDERS.includes(key));
}

function processData(data) {
  const result = {
    table1: {},
    table2: {}
  };

  const rowsTable1 = [
    '1 Inscritos totales',
    '2 Inscritos totales cat. <SUB-20',
    '3 Inscritos totales cat. >SUB-20',
    '4 No salen',
    '5 Error en tarjeta',
    '6 Abandonan',
    '7 Fuera de control',
    '8 Descalificados'
  ];

  const rowsTable2 = [
    '1 Inscritos totales',
    '2 No salen',
    '3 Error en tarjeta',
    '4 Abandonan',
    '5 Fuera de control',
    '6 Descalificados'
  ];

  const initTable = (rows) =>
    Object.fromEntries(rows.map(row => [row, { M: 0, F: 0, total: 0 }]));

  result.table1 = initTable(rowsTable1);
  result.table2 = initTable(rowsTable2);

  const officialCategories = [CATEGORY_OFFICIAL_SUB20, CATEGORY_OFFICIAL_SENIOR];

  // Process official categories
  for (const categoryName of officialCategories) {
    const categoryData = data[categoryName];
    const genders = getGenders(categoryData);

    for (const gender of genders) {
      const cat = categoryData[gender];

      // General totals
      result.table1[rowsTable1[0]][gender] += cat.total;

      // Sub-totals for categories
      if (categoryName === CATEGORY_OFFICIAL_SUB20) {
        result.table1[rowsTable1[1]][gender] += cat.total;
      } else if (categoryName === CATEGORY_OFFICIAL_SENIOR) {
        result.table1[rowsTable1[2]][gender] += cat.total;
      }

      // Common fields
      result.table1[rowsTable1[3]][gender] += cat.dns;
      result.table1[rowsTable1[4]][gender] += cat.mp;
      result.table1[rowsTable1[5]][gender] += cat.dnf;
      result.table1[rowsTable1[6]][gender] += cat.ot;
      result.table1[rowsTable1[7]][gender] += cat.dqf;
    }
  }

  // Process non-official ("others") category
  const othersCategory = data[CATEGORY_OTHERS];
  const othersGenders = getGenders(othersCategory);

  for (const gender of othersGenders) {
    const cat = othersCategory[gender];

    result.table2[rowsTable2[0]][gender] += cat.total;
    result.table2[rowsTable2[1]][gender] += cat.dns;
    result.table2[rowsTable2[2]][gender] += cat.mp;
    result.table2[rowsTable2[3]][gender] += cat.dnf;
    result.table2[rowsTable2[4]][gender] += cat.ot;
    result.table2[rowsTable2[5]][gender] += cat.dqf;
  }

  // Totals
  const calculateTotals = table => {
    for (const row of Object.keys(table)) {
      table[row].total = table[row].M + table[row].F;
    }
  };

  calculateTotals(result.table1);
  calculateTotals(result.table2);

  return result;
}

function formatAsMarkdownTables(result) {
  const formatTable = (tableName, tableData) => {
    let md = '';
    md += `| ${tableName} | M | F | Total |\n`;
    md += '|-----------|---|---|-------|\n';

    for (const [rowName, values] of Object.entries(tableData)) {
      md += `| ${rowName} | ${values.M} | ${values.F} | ${values.total} |\n`;
    }

    md += '\n';
    return md;
  };

  let markdown = '';
  markdown += formatTable('OFICIAL', result.table1);
  markdown += formatTable('NO OFICIAL', result.table2);

  return markdown;
}


export const stageStatsService = {
  processData,
  formatAsMarkdownTables,
}
