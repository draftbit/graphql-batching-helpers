const { GraphQLClient } = require('graphql-request')

const client = new GraphQLClient(process.env.GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${process.env.GRAPHQL_ACCESS_TOKEN}`
  }
})

module.exports = client
