
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require("path")

exports.register = async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({ email: email });
    if (user) {
        res.status(409).send("This User is already exist");
    }else {
        const hash = bcrypt.hashSync(req.body.password, 10);
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash
        });
        console.log(user);
        const userCreated = await user.save();
        if (userCreated) {
            let token = jwt.sign({ userId: userCreated._id, userEmail: userCreated.email }, process.env.JWT_KEY, { expiresIn: '24h' });
            sendMail(`${userCreated.firstName} ${userCreated.lastName}`, userCreated.email);
            res.json({ token: token, user: userCreated });
        }else {
            res.status(500).send("Something went wrong");
        }
    }
}


exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user) {
        const isPasswordMatched = bcrypt.compareSync(password, user.password);
        if (isPasswordMatched) {
            let token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.JWT_KEY, { expiresIn: '24h' });
            
            res.json({ token: token, user: user });
        }else {
            res.status(401).send("Password is incorrect");
        }
    }else {
        res.status(401).send("User does not exist");
    }
}

exports.validateUser = (req, res) => {
    const email = req.query.email;
    console.log(email);
    User.findOne({ email: email }).then(async (user) => {
        user.isActive = true;
        await user.save();
        sendMailAfterValidation(`${user.firstName} ${user.lastName}`);
        res.status(409).send("This User is already exist");
    });
}

exports.refuseUser = (req, res) => {
    const email = req.query.email;
    console.log(email);
    User.deleteOne({ email: email }).then(async (user) => {
        // sendMailAfterValidation(`${user.firstName} ${user.lastName}`);
        res.status(409).send("Deleted");
    });
}


function sendMail(name, email) {
    let mailInfo = {
        from: '"Your Business Support"',
        to: 'khatabbilal12@gmail.com',
        subject: 'Business',
        template: 'test',
        context:{
            name: name,
            email: email
        }
}

    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '',
          pass: ''
        }
     });

     // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./'),
    };

    // use a template file with nodemailer
    transport.use('compile', hbs(handlebarOptions));

     transport.sendMail(mailInfo, (err, data) => {
        if (err) {
            console.log(err);
        }else {
            console.log(data);
        }
    });
}



function sendMailAfterValidation(name, token) {
    let mailInfo = {
        from: '"Your Business Support"',
        to: 'khatabbilal12@gmail.com',
        subject: 'Business',
        template: 'test1'
}

    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: '',
          pass: ''
        }
     });

     // point to the template folder
    const handlebarOptions = {
        viewEngine: {
            partialsDir: path.resolve('./'),
            defaultLayout: false,
        },
        viewPath: path.resolve('./'),
    };

    // use a template file with nodemailer
    transport.use('compile', hbs(handlebarOptions));

     transport.sendMail(mailInfo, (err, data) => {
        if (err) {
            console.log(err);
        }else {
            console.log(data);
        }
    });
}