// create express  and add to variable on nodejs
const express = require('express')
const app = express()

// create mongo
const mon = require("mongodb")
const mongo = mon.MongoClient
const url = "mongodb://localhost:27017"
let db
mongo.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err, client) => {
        if (err) {
            console.error(err)
            return
        }
        db = client.db("tripcost")
        trips = db.collection("trips")
        expenses = db.collection("expenses")
    }
)

// create AdminBro
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const adminBro = new AdminBro({
    Database: [],
    rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBro)

// middleware
app.use(adminBro.options.rootPath, router)
app.use("/", (req, res, next) => {
    console.log('Go to path /')
    next()
})
app.use(express.json())



app.get('/', (req, res) => {
    res.send("How are you?")
})

app.post("/trip", (req, res) => {
    const name = req.body.name
    trips.insertOne({ name: name }, (err, result) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        console.log(result)
        res.status(200).json({ ok: true })
    })
})

app.post('/delete/:id', (req, res) => {
    const id = req.params.id;
    trips.deleteOne({_id: new mon.ObjectID(id)}, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({err:err})
            return
        }

        console.log(result)
        res.status(300).json({delete: 'done'})
    })
})

app.get("/trip", (req, res) => {
    trips.find().toArray((err, items) => {
        if (err) {
            console.error(err)
            res.status(500).json({ err: err })
            return
        }
        res.status(200).json({ trips: items })
    })
})


// start listion server node
app.listen(8088, () => {
    console.log('start express framework and admin bro.: http://localhost:8088/ http://localhost:8088/admin')
})