// Prepare readable structure
function processData(data) {
  const result = {
    table1: {}, // Official classes summary
    table2: {}  // Non-official (colors) classes summary
  };

  // Table 1 - Official classes (Sub-20 + Senior)
  const officialCategories = ['officialSub20', 'officialSenior'];
  const genders = ['M', 'F'];

  // Initialize rows
  const rows = [
    'Inscritos totales',
    'No salen',
    'Error en tarjeta',
    'Abandonan',
    'Fuera de control',
    'Descalificados'
  ];

  result.table1 = Object.fromEntries(rows.map(row => [row, { M: 0, F: 0, total: 0 }]));
  result.table2 = Object.fromEntries(rows.map(row => [row, { M: 0, F: 0, total: 0 }]));

  /* eslint-disable */
  // Process official classes
  for (const category of officialCategories) {
    for (const gender of genders) {
      const cat = data[category][gender];

      result.table1['Inscritos totales'][gender] += cat.total;
      result.table1['No salen'][gender] += cat.dns;
      result.table1['Error en tarjeta'][gender] += cat.mp;
      result.table1['Abandonan'][gender] += cat.dnf;
      result.table1['Fuera de control'][gender] += cat.ot;
      result.table1['Descalificados'][gender] += cat.dqf;
    }
  }

  // Process non-official ("others") classes
  const othersCategory = data.others;

  for (const gender of genders) {
    const cat = othersCategory[gender];

    result.table2['Inscritos totales'][gender] += cat.total;
    result.table2['No salen'][gender] += cat.dns;
    result.table2['Error en tarjeta'][gender] += cat.mp;
    result.table2['Abandonan'][gender] += cat.dnf;
    result.table2['Fuera de control'][gender] += cat.ot;
    result.table2['Descalificados'][gender] += cat.dqf;
  }

  // Calculate totals
  for (const table of [result.table1, result.table2]) {
    for (const row of rows) {
      const m = table[row].M;
      const f = table[row].F;
      table[row].total = m + f;
    }
  }

  return result;
}

export const stageStatsService = {
  processData,
}
