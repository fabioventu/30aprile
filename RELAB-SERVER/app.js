
const express = require('express');
const app = new express();
const sql = require('mssql'); //Libreria per la connessione al dbms MSSQL
const CC = require('./CoordConverter.js');
const coordConverter =  new CC();


//Oggetto di connessione al DB
const config = {
    user: 'PCTO', 
    password: 'xxx123#',
    server: "213.140.22.237",  //Stringa di connessione
    database: 'Katmai', //(Nome del DB)
}

app.get('/', function (req, res) {
    //connect è un metodo della libreria mssql che vuole due parametri: la stringa di
    //connessione e una funzione di callback
    sql.connect(config, (err) => {
        if (err) console.log(err);  // ... error check
        else makeSqlRequest(res);    // Se la connessione va a buon fine esequo il metodo
    });
});


//makeSqlRequest esegue una query sul db, se la query va a buon fine viene richiamata la funzione di //callback che invoca il metodo sendQuery
function makeSqlRequest(res) {
    let sqlRequest = new sql.Request(); //sqlRequest: oggetto che serve a eseguire le query
    let q = 'SELECT DISTINCT TOP (100) [GEOM].STAsText() FROM [Katmai].[dbo].[interventiMilano]';
    //eseguo la query e aspetto il risultato nella callback
    sqlRequest.query(q, (err, result) => {sendQueryResults(err,result,res)}); 
}





function sendQueryResults(err,result, res)
{
    if (err) console.log(err); // ... error checks
    res.send(coordConverter.generateGeoJson(result.recordset));  //Invio il risultato al Browser
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

const proj4 = require('proj4');
const parse = require('wellknown');
const Feature = require('./models/feature.model.js');
const FeatureCollection = require('./models/featureCollection.model.js');

module.exports = class CoordConverter {
    constructor()
    {
        //Definisco il tipo di proiezioni da convertire (32632->4362)
        proj4.defs("EPSG:32632", "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
        //proj4.defs("EPSG:4362", "già definito in proj4");
    }
    //Riceve come parametro il recordset estratto dal DB 
    generateGeoJson(recordset) {
        let geoJsonHeader = new FeatureCollection(); //Crea la Featurecollection
        let i = 0;
        for (const record of recordset) {  
            let polygonGeometry = parse(record[""]); //parso da wkt a geojson geometry
            let geom = this._convertPolygon(polygonGeometry); // converto in "EPSG:4362" 
            geoJsonHeader.features.push(new Feature(i,geom)); //per ogni poligono nel recordset crea una Feature 
        }
        return geoJsonHeader;
    }

    //Converte una geometry coordinata per coordinata con proj4
    _convertPolygon(geometry) {
        let polygon = geometry.coordinates[0];
        for (let index = 0; index < polygon.length; index++) {
            const coord = polygon[index];
            geometry.coordinates[0][index] = proj4("EPSG:32632", "WGS84").forward(coord);
        }
        return geometry;
    }

}



