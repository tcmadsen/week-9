exports.handler = async function(event) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      thingToKnow: 'KIEI-451 is awesome'
    })
  }
}