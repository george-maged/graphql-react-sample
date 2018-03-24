var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tileSchema = new Schema(
{
	name: {type: String, required: true},
	description: String,
	internalId: Number,
	unitLength: Number,
	unitWidth: Number,
	color: String,
	weight: Number,
	available: Boolean,
	image: String
});

module.exports = mongoose.model('Tile', tileSchema);