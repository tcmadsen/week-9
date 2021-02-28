let firebase = require('./firebase')

exports.handler = async function(event) {
  console.log('hello from the back-end!')

  let todosData = []

  return {
    statusCode: 200,
    body: JSON.stringify(todosData)
  }
}