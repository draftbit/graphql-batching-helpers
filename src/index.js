const _ = require('lodash')
const Client = require('./graphql-client')

const generateBatchQuery = (modelName, first = 100) => {
  const queryName = `get${modelName}s`
  const queryAlias = `${modelName}s`
  const queryAll = `all${modelName}s`

  return `
    query ${queryName} {
      ${queryAlias}: ${queryAll} (first: ${first}) {
        id
      }
    }
  `
}

const generateBatchDeleteMutation = (modelName, id) => {
  const mutationName = `delete${modelName}`
  return `
    mutation {
      ${mutationName}(id: "${id}") {
        id
      }
    }
  `
}

const generateBatchDeleteMutations = (values, options) => {
  const { modelName } = options
  const mutations = _.chain(values)
    .map(v => generateBatchDeleteMutation(modelName, v.id))
    .value()

  return mutations
}

const runBatchQuery = async options => {
  const { modelName, first } = options
  const batchQuery = generateBatchQuery(modelName, first)
  const data = `${modelName}s`
  const values = (await Client.request(batchQuery))[data]
  return values
}

const runBatchDelete = async (mutations, options) => {
  const deleteValues = await Promise.map(mutations, m => Client.request(m), {
    concurrency: options.concurrency || 4
  })

  return deleteValues
}

const batchDeleteAllModels = async options => {
  const queryValues = await runBatchQuery(options)
  const mutationValues = generateBatchDeleteMutations(queryValues, options)
  const result = await runBatchDelete(mutationValues, {
    concurrency: options.concurrency
  })

  return result
}

module.exports.generateBatchQuery = generateBatchQuery
module.exports.runBatchQuery = runBatchQuery
module.exports.generateBatchDeleteMutation = generateBatchDeleteMutation
module.exports.generateBatchDeleteMutations = generateBatchDeleteMutations
module.exports.runBatchDelete = runBatchDelete
module.exports.batchDeleteAllModels = batchDeleteAllModels
