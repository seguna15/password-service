const express = require('express')
const app = express()
const mysql = require('mysql')
const cors = require('cors')
const {encrypt, decrypt} = require('./EncryptionHandler')
const PORT = process.env.PORT || 3001;


app.use(cors())
app.use(express.json());
const db = mysql.createConnection({
  user: "sql8519858",
  host: "sql8.freemysqlhosting.net",
  password: "ubqEALsDm7",
  database: "sql8519858",
});

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.post("/addPassword", (req, res) => {
    const {password, title} = req.body;
    const hashedPassword = encrypt(password);
    db.query(
        "INSERT INTO passwords (password, title, iv) VALUES (?,?,?)", [
            hashedPassword.password,
            title,
            hashedPassword.iv
        ], (err, result) => {
            if(err){
                console.log(err)
            }else{
                res.send("Success")
            }
        }
    );
});

app.get('/showPasswords', (req, res) => {
    db.query('SELECT * FROM passwords;', (err, result) => {
        if(err){
            console.log(err)
        }else{
            res.send(result);
        }
    });
});

app.post('/decryptpassword', (req, res) => {
    res.send(decrypt(req.body))
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})