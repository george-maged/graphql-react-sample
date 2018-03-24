var express = require('express');
var graphql = require('graphql');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var Tile = require('../models/tile');
var schema2 = require('./schema')
var db = require('../db');
var MongoQS = require('mongo-querystring');
const qs = new MongoQS({
    custom: {
        bbox: 'geojson',
        near: 'geojson',
    },
});
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Tile {
      name: String!
      internalId: Int
      color: String
    }
    type Query {
      random(num1:Int,num2:Int): Float!
      getTiles(name:String, internalId:Int, color:String): [Tile]
    }
    type Mutation {
      addTile(name:String, internalId:Int, color:String): Tile
      removeTile(name:String, internalId:Int, color:String): Int
    }
`);

var root = {
    random: ({ num1, num2 }) => {
        return Math.random() + num1 + num2;
    },
    getTiles: async function(args) {
        var query = qs.parse(args);
        const resultTiles = await Tile.find(args);
        return resultTiles;
    },
    addTile: async function(args) {
        var newTile = new Tile(args)
        const saved = await newTile.save();
        return saved;
    },
    removeTile: async function(args) {
        const removed = await Tile.remove(args);
        return removed.n; //Number of removed tiles
    }
};

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');