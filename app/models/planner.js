/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

/**
 * Post Schema
 */

var PlannerSchema = new Schema({

    p_date:     {type : Date},
    f_time:         {type: Date},
    t_time:         {type: Date},
    summary: {type: String},
    description: {type: String},
    user_id: {type : Schema.ObjectId, ref : 'User'},
    createdAt:      {type: Date, default: Date.now},
    createdBy:      {_id: {type: Schema.ObjectId, ref: 'User'}, name: String}
})

/**
 * Methods
 */

PlannerSchema.methods = {

}

/**
 * Statics
 */

PlannerSchema.statics = {
    /**
     * Find article by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api private
     */

    load: function (id, cb) {
        this.findOne({ _id: id })
            .exec(cb)
    },

    /**
     * List articles
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private

.sort({_id: -1}) // sort by date
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

mongoose.model('Planner', PlannerSchema)

