const express = require('express')
const bodyParser = require('body-parser')
const user = require('../models/user.js')
const fs = require('fs')
var validator = require('validator');
var multipart = require('connect-multiparty');

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Recordings/');
    },
    filename: function(req, file,cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({storage: storage});

const app = require('express').Router();
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

app.post('/course', async (req, res) => {
    ret = await insert.addCourse(req.body.tid, req.body.name)

    req.body.code = ret

    res.send({
        result: req.body
    })
})

app.get('/courses', (req, res) => {
    user.db.collection('courses').get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.get('/courses/myCourses', (req, res) => {
    user.db.collection('courses').where('tid', '==', req.query.tid).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.get('/enrolled', (req, res) => {
    user.db.collection('users').doc(req.query.sid).get().then(snapshot => {
        let data = snapshot.data().courses

        res.send({
            resources: data
        })
    });
})

app.post('/enroll', async(req, res) => {
    let data = []
    await user.db.collection('users').doc(req.body.sid).get()
    .then(async(res)=>{
        let userData = res.data()
        userData.courses ? userData.courses = [...userData.courses, req.body.code] : userData.courses =[req.body.code]
        await user.db.collection('users').doc(req.body.sid).set(userData)
        .then(async()=>{
            await user.db.collection('resources').where('code', '==', req.body.code).get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    data.push(doc.data());
                });
            });

            user.db.collection('responses').add({
                sid: req.body.sid, 
                code: req.body.code, 
                red: [], 
                yellow: [], 
                green: [], 
                wrong: [], 
                medium: [], 
                correct: [] 
            })
            .then((doc)=>{
                user.db.collection('responses').doc(doc.id).set({id: doc.id}, {merge: true});
            })
            .catch((e) => console.log(e))
        })
        .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e))

    res.send({
        resources: data
    })
})

var cpUpload = upload.fields([{ name: 'ques_rec', maxCount: 1 }, { name: 'ans_rec', maxCount: 1 }])
app.post('/addData', cpUpload, async (req, res) => {
    ret = await insert.addData(req.body.code, req.files['ques_rec'][0]['filename'], req.files['ans_rec'][0]['filename'], req.body.ques_text, req.body.ans_text, req.body.timer)

    res.send({
        result: req.body
    })
})

app.get('/data', (req, res) => {
    user.db.collection('resources').where('code', '==', req.query.code).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/metadata', (req, res) => {
    user.db.collection('responses').where('sid', '==', req.body.sid).where('code', '==', req.body.code).get().then(snapshot => {
        let data = []
        snapshot.docs.forEach(doc => {
            data.push(doc.data());
        });

        res.send({
            resources: data
        })
    });
})

app.post('/response', (req, res) => {
    user.db.collection('responses').where('sid', '==', req.body.sid).where('code', '==', req.body.code).get().then(snapshot => {
        let data = snapshot.docs[0].data();

        if(req.body.res == "red"){
            data.red ? data.red = [...data.red, req.body.id] : data.red =[req.body.id]
        }else if(req.body.res == "yellow"){
            data.yellow ? data.yellow = [...data.yellow, req.body.id] : data.yellow =[req.body.id]
        }else if(req.body.res == "green"){
            data.green ? data.green = [...data.green, req.body.id] : data.green =[req.body.id]
        }

        user.db.collection('responses').doc(snapshot.docs[0].data().id).set(data)

        res.send({
            resources: "Updated !"
        })
    });
})

app.post('/finish', (req, res) => {
    user.db.collection('responses').where('sid', '==', req.body.sid).where('code', '==', req.body.code).get().then(snapshot => {
        let data = snapshot.docs[0].data();

        data.wrong = data.red
        data.medium = data.yellow
        data.correct = data.green

        data.red = []
        data.yellow = []
        data.green = []

        user.db.collection('responses').doc(snapshot.docs[0].data().id).set(data)

        res.send({
            resources: "Finished !"
        })
    });
})

app.get('/attendees', (req, res) => {
    user.db.collection('users').where('type', '==', 'student').get().then(snapshot => {
        let list = []

        snapshot.docs.forEach(doc => {
            let data = doc.data()

            if(data.courses){
                data.courses.forEach(id => {
                    if(id == req.query.code){
                        list.push(doc.data().fname + " " + doc.data().lname);
                    }
                })
            }
        });

        res.send({
            resources: list
        })
    });
})
    
module.exports = app;