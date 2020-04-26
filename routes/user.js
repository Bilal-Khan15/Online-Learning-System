const express = require('express')
const bodyParser = require('body-parser')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
var multipartMiddleware = multipart();

let router = express.Router(),
    constants = require('../utils/constant'),
    insert = require('../db-functions/insert'),
    db_delete = require('../db-functions/delete'),
    read = require('../db-functions/read'),
    update = require('../db-functions/update'),
    utilsFunction = require('../utils/functions');

app.post('/signup', async (req, res) => {
    if (req.body.type == 'teacher') {
        ret = await insert.signupTeacher(req.body.type, req.body.fname, req.body.lname, req.body.email, req.body.pwd, req.body.uni, req.body.subject)

        req.body.id = ret

        res.send({
            result: req.body
        })
    }
    if (req.body.type == 'student') {
        ret = await insert.signupStudent(req.body.type, req.body.fname, req.body.lname, req.body.email, req.body.pwd, req.body.uni, req.body.course, req.body.phone)

        req.body.id = ret

        res.send({
            result: req.body
        })
    }
})

app.post('/signin', async (req, res) => {
    if (req.body.type == 'teacher') {
        let data;
        try {
            data = await read.signinTeacher(req.body.email, req.body.pwd)
        }
        catch (e) {
            // console.log(e)
            return res.status(404).send({ error: e })
        }
        if (data == undefined) {
            return res.status(404).send({
                result: 'Sign In not allowed'
            })
        }
        res.send({
            result: data
        })
    }
    else if (req.body.type === 'student') {
        let data;
        try {
            data = await read.signinStudent(req.body.email, req.body.pwd)
        }
        catch (e) {
            // console.log(e)
            return res.status(404).send({ error: e })
        }
        if (data == undefined) {
            return res.status(404).send({ error: 'Sign In not allowed' })
        }
        res.send({
            result: data
        })
    }
})

app.get('/users', (req, res) => {
    user.db.collection('users').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/status', (req, res) => {
    user.db.collection('users').doc(req.body.id).get().then((res) => {
        let data = res.data()

        if (req.body.status) {
            data.status = req.body.status
        }

        user.db.collection('users').doc(req.body.id).set(data)
    })

    res.send({
        result: 'Targeted user status has been updated.'
    })
})

app.get('*', (req, res) => {
    console.log('route not found')
    res.status(404).send({
        title: '404',
        name: 'Bilal Khan',
        error: 'Page not found.'
    })
})

module.exports = app;