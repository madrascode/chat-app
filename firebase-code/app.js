var firebaseConfig = {
  apiKey: "AIzaSyCJ2_A4dxkQLdNqmEI9aVtiJt1FKu8BXxA",
  authDomain: "chat-app-ba4a5.firebaseapp.com",
  databaseURL: "https://chat-app-ba4a5-default-rtdb.firebaseio.com",
  projectId: "chat-app-ba4a5",
  storageBucket: "chat-app-ba4a5.appspot.com",
  messagingSenderId: "639850151197",
  appId: "1:639850151197:web:3ba6e6fe63331ec7c875f4"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name


document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})

// data going to database -- firebase
document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault()

	let message = document.querySelector('#message-input').value
	db.collection('messages')
	.add({
		name: name,
		message: message,
		date: firebase.firestore.Timestamp.fromMillis(Date.now())
		})
	.then(docRef => {
		console.log(`Document written with ID: ${docRef.id}`)
		document.querySelector('#message-form').reset()
	})
	.catch(error => {
		console.log(`Error adding document: ${error}`)
	})
})


db.collection('messages')
.orderBy('date','asc')
.onSnapshot(snapshot => {
	document.querySelector('#messages').innerHTML = ''
	snapshot.forEach(doc => {
		let message = document.createElement('div')
		
		message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		<h6>${doc.data().date.toDate()}</h6>
		`
		document.querySelector('#messages').prepend(message)
	});
})

document.querySelector('#clear').addEventListener('click', () => {
    db.collection('messages')
    .get()
    .then(snapshot => {
        snapshot.forEach(doc => {
			db.collection('messages').doc(doc.id).delete()
            .then(() => {
				console.log('Document successfully deleted!')
			})
            .catch(error => {
				console.error(`Error removing document: ${error}`)
			})
        })
    })
    .catch(error => {
        console.log(`Error getting documents: ${error}`)
    })
})