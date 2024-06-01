const fs = require('fs');
const readline = require('readline');

function parseAmountValue(valueString){
    return parseInt(valueString.trim().replace(',', ''));
}

let yearMap = new Map();
let yearMonthMap = new Map();

let rl = readline.createInterface({
    input: fs.createReadStream('revenue.csv'),
    output: process.stdout,
    terminal: false
});

rl.on('line', function(line) {
    let values = line.split('\t');

    if (values[0].includes('年') && values[0].includes('月')) {

        y = values[0].split('年')[0];
        m = values[0].split('年')[1].replace('月', '');

        if (!yearMonthMap.has(y)) {
            yearMonthMap.set(y, new Map());
        }

        yearMonthMap.get(y).set(m, parseAmountValue(values[1]));

    } else if (values[0].includes('年')) {

        yearMap.set(values[0].replace('年', ''), parseAmountValue(values[1]));

    }
});

rl.on('close', function() {

    // console.log('Year Map:', yearMap);
    // console.log('Year Month Map:', yearMonthMap);

    let jsonArray = [];

    for (let [year, yearAmount] of yearMap) {
        let jsonObject = {
            Year: parseInt(year),
            YearAmount: parseInt(yearAmount)
        };

        if (yearMonthMap.has(year)) {
            jsonObject.Months = Array.from(yearMonthMap.get(year), ([Month, MonthAmount]) => ({Month: parseInt(Month), MonthAmount: parseInt(MonthAmount)}));
        }

        jsonArray.push(jsonObject);
    }

    console.log('JSON Array:', JSON.stringify(jsonArray, null, 2));

    fs.writeFile('revenue.json', JSON.stringify(jsonArray, null, 2), function(err) {
        if (err) {
            console.log(err);
        }
    });
});

