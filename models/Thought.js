const { Schema, model } = require("mongoose");

const thoughSchema = new Schema({
    thoughtText: {

    },
    createdAt: {

    },
    username: {

    },
    reactions: []

}, {
    toJSON: {
        getters: true
    },
    id: false
})

thoughSchema.virtual("reactionCount").get(function(){
    return this.reactions.length;
})

const Thought = model("Thought", thoughSchema);

module.exports = Thought;