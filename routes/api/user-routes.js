const router = require("express").Router();
const { User } = require("../../models");

router.get("/", (req, res) => {
    User.find().select("-__v")
})

router.post("/", async (req, res) => {
    User.create(req.body).then((dbUserData) => {
        res.json(dbUserData)
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err)
    })
})

module.exports = router;