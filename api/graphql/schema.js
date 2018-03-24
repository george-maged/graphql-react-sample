//Other experimental server.js
var graphql = require('graphql');
var Tile = require('../models/tile');
var tileType = new graphql.GraphQLObjectType({
    name: 'tile',
    fields: {
        name: {
            type: graphql.GraphQLNonNull(graphql.GraphQLString)
        },
        description: {
            type: graphql.GraphQLString
        },
        internalId: {
            type: graphql.GraphQLInt
        },
        unitLength: {
            type: graphql.GraphQLInt
        },
        unitWidth: {
            type: graphql.GraphQLInt
        },
        color: {
            type: graphql.GraphQLString
        },
        weight: {
            type: graphql.GraphQLInt
        },
        available: {
            type: graphql.GraphQLBoolean
        },
        image: {
            type: graphql.GraphQLString
        }
    }
});

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: function() {
        return {
            tiles: {
                type: new graphql.GraphQLList(tileType),
                resolve: function() {
                    return new Promise(function(resolve, reject) {
                        Tile.find(function(err, tiles) {
                            if (err) reject(err)
                            else resolve(tiles)
                        })
                    });
                }
            }
        }
    }
});
var MutationAdd = {
    type: tileType,
    description: 'Add a tile',
    args: {
        name: {
            name: 'Tile name',
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: (root, args) => {
        var newTile = new Tile({
            name: args.name,
            color: '#abcedf'
        })
        return new Promise((resolve, reject) => {
            newTile.save(function(err) {
                if (err) reject(err)
                else resolve(newTile)
            })
        })
    }
}

var MutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: MutationAdd
    }
});
module.exports = new graphql.GraphQLSchema({
    query: queryType,
    mutation: MutationType

});