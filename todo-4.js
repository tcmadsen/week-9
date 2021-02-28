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
    let response = await fetch(`/.netlify/functions/get_todos?userId=${user.uid}`)
    let todos = await response.json()
    console.log(todos)

    for (let i=0; i<todos.length; i++) {
      let todo = todos[i]
      let todoId = todo.id
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
