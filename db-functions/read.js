var exports = module.exports = {},
   utilsFunctions = require('../utils/functions'),
   constants = require('../utils/constant');

const user = require('../models/user.js')

const signinTeacher = (email, pwd) => {
    try{
        return new Promise((resolve,reject)=>{
            user.db.collection('users').where('email', '==', email).get()
                .then((res) => {
                    if((pwd == res.docs[0].data().pwd) && (res.docs[0].data().status == 'active')){
                        resolve(res.docs[0].data());
                    }else{
                        reject({ message: "You are not allowed to Sign In" })
                    }
                })
                .catch((e) => {
                    const mess = e.message
                    reject({ message: mess })
                })
            }) 
    }  catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

const signinStudent = (email, pwd) => {
    try{
        return new Promise((resolve,reject)=>{
            user.db.collection('users').where('email', '==', email).get()
                .then((res) => {
                    if((pwd == res.docs[0].data().pwd) && (res.docs[0].data().status == 'active')){
                        resolve(res.docs[0].data());
                    }else{
                        reject({ message: "You are not allowed to Sign In" })
                    }
                })
                .catch((e) => {
                    const mess = e.message
                    reject({ message: mess })
                })
            }) 
    }  catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

module.exports = {
    signinTeacher: signinTeacher,
    signinStudent: signinStudent,
}