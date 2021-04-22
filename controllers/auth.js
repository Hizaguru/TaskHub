const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.signup = (req, res) =>{
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;
    //Gives an error if something goes wrong(typo, connection etc..)
    database.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        if(results.length > 0){
            return res.render('register', {
                message: 'Email already in use.'
            })
        }else if (password !== passwordConfirm){
            return res.render('register', {
                message: 'Passwords dont match'
            });
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        database.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedPassword}, (error, results) =>{
            if(error) {
                console.log(error);
            }else {
                console.log(results);
                return res.render('register', {
                    message: 'Userprofile created.'
                });
            }
        })

    });

}