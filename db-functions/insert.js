var exports = module.exports = {},
    constants = require('../utils/constant'),
    userModel = require ('../models/user');

const user = require('../models/user.js')
var validator = require('validator');
let admin = require('firebase-admin');
const fs = require('fs')

const signupTeacher = (type, fname, lname, email, pwd, uni, subject) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('users').add({
                status: 'inactive',
                type, 
                fname, 
                lname, 
                email, 
                pwd, 
                uni, 
                subject
            })
            .then((doc)=>{
                user.db.collection('users').doc(doc.id).set({id: doc.id}, {merge: true});
                resolve(doc.id)
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

const signupStudent = (type, fname, lname, email, pwd, uni, course, phone) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('users').add({
                status: 'inactive',
                type, 
                fname, 
                lname, 
                email, 
                pwd, 
                uni, 
                course, 
                phone
            })
            .then((doc)=>{
                user.db.collection('users').doc(doc.id).set({id: doc.id}, {merge: true});
                resolve(doc.id)
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

const addCourse = (tid, name) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('courses').add({
                tid, 
                name, 
            })
            .then((doc)=>{
                user.db.collection('courses').doc(doc.id).set({code: name+"-"+doc.id}, {merge: true});
                resolve(name+"-"+doc.id)
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

const addData = (code, ques_rec="", ans_rec="", ques_text="", ans_text="", timer) => {
    return new Promise((resolve, reject) => {
        try{
            user.db.collection('resources').add({
                code, 
                ques_rec, 
                ans_rec, 
                ques_text, 
                ans_text, 
                timer            
            })
            .then((doc)=>{

                // fs.readFile(ques_rec, function (err, data) {
                //     const filename = ques_rec
                //     const store = './Recordings/' + doc.id + filename;
                //     fs.writeFile(store, data,async function (err) {
                //         if (err) throw err;
                //         await user.bucket.upload(store, {
                //             gzip: true,
                //             // destination: 'Bilal/' + ques_rec,
                //             metadata: {
                //                 cacheControl: 'public, max-age=31536000',
                //             }
                //             }, function(err, ques_rec, apiResponse) {
                //                 user.db.collection('resources').doc(doc.id).set({ques_rec: apiResponse.mediaLink}, {merge: true});
                //                 fs.unlink(store, function (err) {
                //                 if (err) throw err;
                //                 }); 
                //             });                        
                //     }); 
                // })
                
                // fs.readFile(ans_rec, function (err, data) {
                //     const filename = ans_rec.split('\\').pop().split('/').pop()
                //     const store = './Recordings/' + doc.id + filename;
                //     fs.writeFile(store, data,async function (err) {
                //         if (err) throw err;
                //         await user.bucket.upload(store, {
                //             gzip: true,
                //             metadata: {
                //                 cacheControl: 'public, max-age=31536000',
                //             }
                //             }, function(err, ans_rec, apiResponse) {
                //                 user.db.collection('resources').doc(doc.id).set({ans_rec: apiResponse.mediaLink}, {merge: true});
                //                 fs.unlink(store, function (err) {
                //                 if (err) throw err;
                //                 }); 
                //             });                        
                //     }); 
                // })

                user.db.collection('resources').doc(doc.id).set({id: doc.id}, {merge: true});
                resolve()
            })
            .catch((e) => console.log(e))
        } catch (e) {
            console.log(e);
            throw new Error(e)
        }
    })
}

module.exports = {
    signupTeacher: signupTeacher,
    signupStudent: signupStudent,
    addCourse: addCourse,
    addData: addData
}