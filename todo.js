firebase.auth().onAuthStateChanged(async function(user) {

  if (user) {
    // Signed in
    let db = firebase.firestore()

    db.collection('users').doc(user.uid).set({
      name: user.displayName,
      email: user.email
    })

    document.querySelector('form').addEventListener('submit', async function(event) {
      event.preventDefault()

      let todoText = document.querySelector('#todo').value

      if (todoText.length > 0) {
        // Add user ID to newly created to-do
        let docRef = await db.collection('todos').add({
          text: todoText,
          userId: user.uid
        })

        let todoId = docRef.id
        console.log(`new todo with ID ${todoId} created`)

        document.querySelector('.todos').insertAdjacentHTML('beforeend', `
          <div class="todo-${todoId} py-4 text-xl border-b-2 border-purple-500 w-full">
            <a href="#" class="done p-2 text-sm bg-green-500 text-white">✓</a>
            ${todoText}
          </div>
        `)

        document.querySelector(`.todo-${todoId} .done`).addEventListener('click', async function(event) {
          event.preventDefault()
          document.querySelector(`.todo-${todoId}`).classList.add('opacity-20')
          await db.collection('todos').doc(todoId).delete()
        })
        document.querySelector('#todo').value = ''
      }
    })

    // Show only my to-dos
    let querySnapshot = await db.collection('todos').where('userId', '==', user.uid).get()
    console.log(`Number to todos in collection: ${querySnapshot.size}`)

    let todos = querySnapshot.docs
    for (let i=0; i<todos.length; i++) {
      let todoId = todos[i].id
      let todo = todos[i].data()
      let todoText = todo.text

      document.querySelector('.todos').insertAdjacentHTML('beforeend', `
        <div class="todo-${todoId} py-4 text-xl border-b-2 border-purple-500 w-full">
          <a href="#" class="done p-2 text-sm bg-green-500 text-white">✓</a>
          ${todoText}
        </div>
      `)

      document.querySelector(`.todo-${todoId} .done`).addEventListener('click', async function(event) {
        event.preventDefault()
        document.querySelector(`.todo-${todoId}`).classList.add('opacity-20')
        await db.collection('todos').doc(todoId).delete()
      })
    }

    // Create a sign-out button
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `

    document.querySelector('.sign-out').addEventListener('click', function(event) {
      console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'todo.html'
    })

  } else {
    // Not logged-in

    // Hide the form when signed-out
    document.querySelector('form').classList.add('hidden')

    // Initializes FirebaseUI Auth
    let ui = new firebaseui.auth.AuthUI(firebase.auth())

    // FirebaseUI configuration
    let authUIConfig = {
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: 'todo.html'
    }

    // Starts FirebaseUI Auth
    ui.start('.sign-in-or-sign-out', authUIConfig)
  }
})

// Goals:   Move the part of the code that gets todos when the page is loaded
//          to the backend lambda function – separate responsibilities of the
//          front-end and the back-end
//
// Step 0:  Setup. Start your server in the Terminal using the command `netlify dev`.
//          Visit /.netlify/functions/test in the browser to confirm the server is running and you can access it.
//          Add firebase config into todos.html and verify frontend application still works as it did last week.
//          Add firebase config into netlify/functions/firebase.js so that the backend also has access to firebase.
// Step 1:  Read data from firestore in the backend. In the netlify function get_todos.js, retrieve all of the todos from firestore.
//          Console log the number of todos to confirm it's reading the data.
// Step 2:  Build the API response. Loop through the todos collection. The backend has no access to manipulate the DOM, so instead we'll expose the desired data to the frontend.
//          Inside the loop, use .push() to add a javascript object into the todosData array with each todo's id and text values.
//          Visit localhost:****/.netlify/functions/get_todos in the browser to see the todos data. That's your API response!
// Step 3:  Filter todos by userId. Append the get_todos API URL with the userId as a query string parameter
//          and the user's id as its value: /.netlify/functions/get_todos?userId=****
//          The query string data is available in the event.queryStringParameters object.
//          Use the userId from the query string to filter the firestore collection.
// Step 4:  Get the current user's todos from the API instead of firestore.
//          In todo.js, replace the code that's reading directly from firestore with a fetch() request to the server.