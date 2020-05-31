const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'zettabyte'

MongoClient.connect(connectionURL,{ useNewUrlParser: true},(error,client) => {
    if(error){
        return console.log('Unable to connect to the Database !')
    }
    console.log('Connected !')
})