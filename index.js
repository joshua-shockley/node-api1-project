// implement your API here
const express = require('express');
const dbModel = require('./data/db.js');
const server = express();
//now i need to tell it to read json from the body
server.use(express.json());


//now i set up the handlers

server.get('/api/users', (req, res) => {

    dbModel
        .find()
        .then(db => {
            res.send(db);
        }).catch(error => {
            res.status(500).json({ message: "the users information could not be retrived." });
        });
    //either sends the list of users or an error
});

server.post('/api/users', (req, res) => {
    const dbData = req.body;
    console.log('db data', dbData);

    if (!dbData.name || !dbData.bio) {
        res.status(400).json({ message: 'Please provide name and bio ' });
    } else {
        dbModel
            .insert(dbData)
            .then(db => {
                res.status(201).json(db);
            })
            .catch(error => {
                res.status(500).json({ message: 'there was an error while saving the user to the database' });
            });
    }
});

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;


    dbModel.findById(id)
        .then(db => {
            if (!db) { res.status(404).json({ message: 'The user with the specified id doesnt exist' }) } else {
                res.json(db);
            };
            console.log(db);
        })
        .catch(err => {
            res.status(500).json({ message: 'error grabbing the user info' });
        });
});

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;

    dbModel.remove(id)
        .then(db => {
            if (!db) { res.status(404).json({ message: 'The user with the specified id doesnt exist' }) } else {
                res.json(db);
            };

            // res.json(db)
        })
        .catch(db => {
            res.status(500).json({ message: 'the user could not be removed' });
        });
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id; //this specifies that the id for the user is passed into the param for the object
    const changes = req.body; //this specifies that the params for the update on the object body will be passes in
    if (!changes.name || !changes.bio) {
        res.status(400).json({ message: 'Please provide name and bio ' });
    } else {

        dbModel
            .update(id, changes)
            .then(db => {
                if (!db) { res.status(404).json({ message: 'The user with the specified id doesnt exist' }) } else {
                    res.status(200).json(db);
                };

            })
            .catch(err => {
                res.staus(500).json({ message: 'the user information could not be modified' });
            });
    }
});



const port = 5000; //set the port to watch
server.listen(port, () => console.log(`\n** API on port ${port}**/n`)); //set the port to listen to proper port