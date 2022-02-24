const express = require("express");
const Flavors = require("./flavors/flavors-model");
const {checkId, validateFlavor} = require('./flavors/flavors-middleware');

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.status(200).json({ api: "up" });
});

server.get("/flavors", (req, res) => {
    Flavors.getAll()
        .then(flavors => {
            res.status(200).json(flavors);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

server.get("/flavors/:id", checkId, (req, res) => {
    Flavors.getById(req.params.id)
        .then(flavor => {
            res.status(200).json(flavor)
        });
});

server.post("/flavors", validateFlavor, (req, res) => {
    Flavors.insert(req.body)
        .then(flavor => {
            res.status(201).json(flavor)
        });
});

server.delete("/flavors/:id", (req, res) => {
    Flavors.remove(req.params.id)
        .then(flavor => {
            res.json(flavor);
        });
});

server.put("/flavors/:id", (req, res) => {
    Flavors.update(req.params.id, req.body)
        .then(flavor => {
            res.json(flavor);
        })
});

module.exports = server;
