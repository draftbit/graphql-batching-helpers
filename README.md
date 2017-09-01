# GraphQL Batching Helpers

## Installation

```
yarn add graphql-batching-helpers

or

npm install --save graphql-batching-helpers
```

## Setup
- process.env.GRAPHQL_ENDPOINT
- process.env.GRAPHQL_ACCESS_TOKEN

## Quick Start

```es6
  await BatchQueryHelpers.batchDeleteAllModels({
    modelName: 'Contact',
    first: 100,
    concurrency: 4,
  })
```
What happens in order:
1. generate generate batch query name:

```graphql
query getContacts {
  contacts: allContacts(first: 100) {
    id
  }
}
```

2. Request first N `Contact`s
3. If there are more than 0:
  - Generate match query mutations
  - Delete first N  with concurrency N

## API

- `generateBatchQuery`
  - modelName: String ("Contact")
  - first: Int (100)
- `generateBatchDeleteMutation`
  - modelName: String ("Contact")
  - id
- `generateBatchDeleteMutations`
  - values
    - id: String ("xyz")
  - options
    - modelName: String ("Contact")
- `runBatchQuery`
  - options
    - modelName: String ("Contact")
    - first: Int (100)
- `runBatchDelete`
  - mutations
  - options
    - concurrency: Int (4)
- `batchDeleteAllModels`
  - options
    - modelName: String ("Contact")
    - first: Int (100)
    - concurrency: Int (4)
