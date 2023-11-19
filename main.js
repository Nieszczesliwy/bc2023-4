const express = require('express');
const { XMLParser, XMLBuilder } = require('fast-xml-parser');
const fs = require('fs');
const app = express();
const port = 8000;

app.get('/', (req, res) => {
    fs.readFile('data.xml', 'utf-8', (err, data) => {
        try {
            const parser = new XMLParser();
            let jsonData = parser.parse(data);
    
            if (jsonData && jsonData.exchange && jsonData.exchange.currency) {
                let currencies = jsonData.exchange.currency;
                if (!Array.isArray(currencies)) {
                    currencies = [currencies]; 
                }
    
                const newXMLData = {
                    data: {
                        exchange: currencies.map(cur => ({
                            date: cur.exchangedate,
                            rate: cur.rate
                        }))
                    }
                };
    
                const builder = new XMLBuilder();
                const xmlContent = builder.build(newXMLData);
    
                res.set('Content-Type', 'text/xml');
                res.status(200).send(xmlContent);
            }
        } catch (e) {
            console.error('Помилка зчитування XML:', e);
            res.status(500).send('Помилка 500'); 
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
