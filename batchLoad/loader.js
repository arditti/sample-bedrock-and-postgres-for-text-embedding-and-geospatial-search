const fs = require('fs');
const csv = require('csv-parser');
const SERVER_ENDPOINT_TYPE_1 = 'http://localhost:3000/ingestNeedHelp';
const SERVER_ENDPOINT_TYPE_2 = 'http://localhost:3000/ingestCanHelp';
const CSV_INPUT_FILE = './example_input.csv';

const rowToBody = (row)=>{
    return JSON.stringify({
        "user": {
            "phone": row.ID,
            "email": "example@gmail.com",
            "name": row.NAME
        },
        "props": {
            "text": row.TEXT,
            "address": row.ADDRESS
        }
    });
}

fs.createReadStream(CSV_INPUT_FILE)
    .pipe(csv())
    .on('data', (row) => {
        // Skip header row
        if (row[0] === 'id') return;
        console.log(row)
        const server = row.TYPE.replaceAll(' ','') === '1' ? SERVER_ENDPOINT_TYPE_1 : SERVER_ENDPOINT_TYPE_2;
        // Make POST request for each row
        fetch(server, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: rowToBody(row)
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));
    });