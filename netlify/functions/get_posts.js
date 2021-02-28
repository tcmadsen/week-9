let firebase = require('./firebase')

exports.handler = async function(event) {
  let postsData = []
  
  // Retrieve posts from Firestore; for each post, construct
  // a new Object that contains the post's id, username, imageUrl,
  // and number of likes. Add the newly created Object to the
  // postsData Array.
  
  return {
    statusCode: 200,
    body: JSON.stringify(postsData)
  }
}