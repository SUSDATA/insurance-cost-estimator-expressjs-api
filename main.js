const express = require('express');
const mysql = require('mysql'); 
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
const puerto = process.env.PUERTO || 3333;

// We create the Pool of Connections
var pool  = mysql.createPool({
    connectionLimit : 10, // Set limit to ten when it comes about creating connections simultaneously 
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b8bab31555f3a9',
    password: '6cf838a6',
    database: 'heroku_dec502b32f26ded'
});

if(pool) console.log("Database Pool Created Successfully");

app.get('/',function(req,res) {
    res.send('Ruta de Inicio');
})

app.get('/api/getFormData',function(req,res) {
    
    // pool.query('SELECT * FROM departamento', (error,filas) => {
    //     if(error){
    //         throw error;
    //     }else{
    //         res.send(filas);
    //     }   
    // });

    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
        var objResult = {};             
        
        connection.query('SELECT * FROM departamento;', (err, results) => {
            if (err) throw err;
            objResult.departamentos = results;

            connection.query('SELECT * FROM lugar_movilizacion;', (err, results) => {    
                if (err) throw err; 
                objResult.lugaresMovilizacion = results;
                
                connection.query('SELECT * FROM tipo_documento;', (err, results) => {    
                    if (err) throw err; 
                    objResult.tipoDocumentos = results;

                    connection.release();
                    res.send(objResult); 
                }); 
            });                    
        });
    });

})

app.post('/api/processData',(req, res) => {
    const sentData = req.body;
    res.send(sentData);
});

app.listen(puerto,() => { console.log("Servidor Ok. Listing on Port: "+puerto) });