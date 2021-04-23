const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//db information in .env file.
const database = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = async (req,res) => {
    try {
        const {email, password} = req.body;
        //If there's no email or password
        if(!email || !password) {
            return res.status(400).render('login', {
                message: 'You need to provide your email and password to sign in.'
            })
        }

        database.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
            console.log(results);
            //If there's no result of the email or is the password is wrong
            if(!results || !(await bcrypt.compare(password, results[0].password))){
                res.status(401).render('login', {
                    message: 'No such an email or password'
                })
            }else{
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/");

            }

        })
    } catch (error) {
        console.log(error);
    }
}


exports.register = (req, res) =>{
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