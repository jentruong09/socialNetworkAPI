const {Schema, model, Types} = require('mongoose');
const moment = require('moment');

// Reaction Schema first b/c Thought Schema uses it
const reactionSchema = new Schema(
    {
       reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
       },
       reactionBody: {
           type: String,
           required: true,
           maxlength: 280
       },
       username: {
           type: String,
           required: true
       },
       createdAt: {
           type: Date,
           default: Date.now,
           get: (createdAtTime) => moment(createdAtTime).format('MM DD, YYYY [at] HH:mm')
       }
    },
    {
        toJSON: {
            getters: true
        }
    }
)


const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtTime) => moment(createdAtTime).format('MM DD, YYYY [at] HH:mm')
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);

// Virtual that retrieves the length of the thought's reaction array field on query
// Needs to be ES5 in order for .virtual and this. to work
thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length
})

// Initialize Thought model
const Thought = model('Thought', thoughtSchema);

module.exports = Thought