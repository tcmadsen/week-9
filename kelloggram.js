let db = firebase.firestore()

// Change main event listener from DOMContentLoaded to 
// firebase.auth().onAuthStateChanged and move code that 
// shows login UI to only show when signed out
firebase.auth().onAuthStateChanged(async function(user) {
  if (user) {
    // Signed in
    console.log('signed in')

    // Ensure the signed-in user is in the users collection
    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

    // Sign-out button
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `
    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'kelloggram.html'
    })

    // Listen for the form submit and create/render the new post
    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()
      let postUsername = user.displayName
      let postImageUrl = document.querySelector('#image-url').value
      let postNumberOfLikes = 0
      let docRef = await db.collection('posts').add({ 
        userId: user.uid,
        username: postUsername, 
        imageUrl: postImageUrl, 
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
      let postId = docRef.id // the newly created document's ID
      document.querySelector('#image-url').value = '' // clear the image url field
      renderPost(postId, postUsername, postImageUrl, postNumberOfLikes)
    })

    // 🔥 LAB STARTS HERE 🔥
    let querySnapshot = await db.collection('posts').orderBy('created').get()
    let posts = querySnapshot.docs
    for (let i=0; i<posts.length; i++) {
      let postId = posts[i].id
      let postData = posts[i].data()
      let postUsername = postData.username
      let postImageUrl = postData.imageUrl
      let querySnapshot = await db.collection('likes').where('postId', '==', postId).get()
      let postNumberOfLikes = querySnapshot.size
      renderPost(postId, postUsername, postImageUrl, postNumberOfLikes)
    }
    // 🔥 LAB ENDS HERE 🔥

  } else {
    // Signed out
    console.log('signed out')

    // Hide the form when signed-out
    document.querySelector('form').classList.add('hidden')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'kelloggram.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

async function renderPost(postId, postUsername, postImageUrl, postNumberOfLikes) {
  document.querySelector('.posts').insertAdjacentHTML('beforeend', `
    <div class="post-${postId} md:mt-16 mt-8 space-y-8">
      <div class="md:mx-0 mx-4">
        <span class="font-bold text-xl">${postUsername}</span>
      </div>
  
      <div>
        <img src="${postImageUrl}" class="w-full">
      </div>
  
      <div class="text-3xl md:mx-0 mx-4">
        <button class="like-button">❤️</button>
        <span class="likes">${postNumberOfLikes}</span>
      </div>
    </div>
  `)
  document.querySelector(`.post-${postId} .like-button`).addEventListener('click', async function(event) {
    event.preventDefault()
    console.log(`post ${postId} like button clicked!`)
    let currentUserId = firebase.auth().currentUser.uid

    let querySnapshot = await db.collection('likes')
      .where('postId', '==', postId)
      .where('userId', '==', currentUserId)
      .get()

    if (querySnapshot.size == 0) {
      await db.collection('likes').add({
        postId: postId,
        userId: currentUserId
      })
      let existingNumberOfLikes = document.querySelector(`.post-${postId} .likes`).innerHTML
      let newNumberOfLikes = parseInt(existingNumberOfLikes) + 1
      document.querySelector(`.post-${postId} .likes`).innerHTML = newNumberOfLikes
    }
    
  })
}

// Goals:  Move the part of the code that gets posts when the page is loaded
//         to its own lambda function – separate responsibilities of the
//         front-end and the back-end
//
// Step 1: In this lab, you'll modify the code that currently sits on lines
//         44-55, moving some of it to its own lambda function. Review the 
//         existing code and be sure to understand the current functionality.
// Step 2: Take a look at the get_posts lambda function that lives at 
//         /netlify/functions/get_posts.js. Visit /.netlify/functions/get_posts
//         in Chrome; it should return an empty Array in the browser. 
// Step 3: Add code to the get_posts lambda function to retrieve posts from 
//         Firestore and fill the postsData Array with that data. Only a post's
//         id, username, and imageUrl are needed. You can use the built-in 
//         .push() function on an existing Array to add items to it.
// Step 4: Modify the code from Step 3 to include each post's total number of 
//         likes. The result should an API that lives at /.netlify/functions/get_posts
//         that returns an Array of Objects, each of which contain a post's id,
//         username, imageUrl, and numberOfLikes.
// Step 5: Here, in kelloggram.js, consume the API you've created, using fetch.
//         Modify the code that lives on lines 44-55, eliminating the code that
//         uses Firestore directly; use your newly created API instead.