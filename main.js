const express = require('express');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    fs.readFile('data.xml', 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Помилка зчитування XML файлу');
            return;
        }

        const parser = new XMLParser();
        let jsonData = parser.parse(data);

        if (jsonData && jsonData.exchange && jsonData.exchange.currency) {
            const currency = jsonData.exchange.currency;
            const newXMLData = {
                data: {
                    exchange: {
                        date: currency.exchangedate,
                        rate: currency.rate
                    }
                }
            };

            const builder = new XMLBuilder();
            const xmlContent = builder.build(newXMLData);
            res.type('application/xml');
            res.send(xmlContent);
        } else {
            console.error('Invalid XML structure');
            res.status(500).send('Невалідна структура XML');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
