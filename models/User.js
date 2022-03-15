const {Schema, model} = require('mongoose')

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true //removing white space
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false
    }
);

// Virtual that retrieves the length of the user's friends array field on query
userSchema.virtual('friendCount').get(() => {
    return this.friends.length
})

// Initialize User model
const User = model('User', userSchema)

module.exports = User