'use strict';

var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

/**
 * User Schema
 */
var UserSchema = new Schema({
    name:   String,
    phone:   String,
    email: {type: String,unique: true},  //Physician, Nurse, Patient, Sensor, Relative, Monitor
    password: String,
    address: {type:String},

    city: String,
  
    country: String,
    createdAt  :    {type : Date, default : Date.now},
});

/**
 * Virtuals
 */
/*UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
    })
    .get(function() {
        return this._password;
    });*/

// Basic info to identify the current authenticated user in the app
UserSchema
    .virtual('userInfo')
    .get(function() {
        return {
            'name': this.name,
            'phone': this.phone,
            'email': this.username,
            'address': this.address,
            'city': this.city,
            'country': this.country
        };
    });

// Public profile information
UserSchema
    .virtual('profile')
    .get(function() {
        return {
            'name': this.name
        };
    });

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    return value && value.length;
};

// Validate empty email
UserSchema
    .path('email')
    .validate(function(email) {
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema
    .path('password')
    .validate(function(password) {
        return password.length;
    }, 'Password cannot be blank');

/**
 * Plugins
 */
UserSchema.plugin(uniqueValidator,  { message: 'Value is not unique.' });

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.password))
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.password;
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        return Buffer(password).toString('base64');
    }
};

/**
 * Statics
 */

UserSchema.statics = {

    load: function (id, cb) {
        this.findOne({ _id : id })
            //.populate('user', 'name email username')
            .exec(cb)
    },

    /**
     * Return users list
     *
     * @param {String} options
     * @return none
     * @callback with err, users list
     * @api public
     */
    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria, 'name email role provider organization')
            .sort({'name': 1}) // sort by name
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }
}

mongoose.model('User', UserSchema);
