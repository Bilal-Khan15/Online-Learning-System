const express = require('express')
const app = express();
var cors = require('cors')
app.use(cors())   
const user = require('./routes/user.js')
const resource = require('./routes/resource.js')

app.use(express.static('Recordings'));

app.use('/user', user);
app.use('/resource', resource);

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports.app = app;