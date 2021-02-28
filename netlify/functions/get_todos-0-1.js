let firebase = require('./firebase')

exports.handler = async function(event) {
  console.log('hello from the back-end!')

  let todosData = []
  let db = firebase.firestore()
  let querySnapshot = await db.collection('todos').get()
  console.log(`Number to todos in collection: ${querySnapshot.size}`)

  return {
    statusCode: 200,
    body: JSON.stringify(todosData)
  }
}
