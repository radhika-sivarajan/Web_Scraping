var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentsSchema = new Schema({
    username: {
        type: String
    },
    message: {
        type: String
    }
});

var Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;