let mainDiv = document.querySelector('.main-container')
let middleDiv = document.querySelector('.middle-container')
let audioSong = document.createElement('audio')
let countDown = document.querySelector('#count-down')
let bottomTag = document.createElement('h3')
let bottomDiv = document.querySelector('.bottom-container')
let countDownInterval
let mybr = document.createElement('br');

const stopSong = () => {
  mainDiv.style.display = 'none'
  audioSong.pause()
}

const startSong = () => {
  mainDiv.style.display = 'initial'
  audioSong.play()
}


const scoreLister = (user) => {
  return `<p>User: ${user.name} -- Points: ${user.score}</p>`
}

const scoreTitle = () => {
  return `<p> LEADERBOARD </p>`
}


function pickRandom(array){
let song = array[Math.floor(Math.random()*array.length)];
return song
}
 

let points = 0
let attempts = 3;

// let attempts = 3

function getSongs(){
fetch('http://localhost:3000/genres')
  .then(function(response) {
    return response.json();
  })
  .then(function(genres) {
    mainDiv.innerHTML = ""
    genres.forEach(genre =>{
    	console.log(genre)

    let createButton = document.createElement('button')
    let mybr = document.createElement('br');
    createButton.dataset.id = genre.id
    createButton.id = genre.name
    createButton.className = 'genre-button'
    createButton.innerText = genre.name
    mainDiv.appendChild(createButton)
    mainDiv.appendChild(mybr)
    })
  //    let popButton = document.getElementById('Pop')
	 // console.log(popButton)
  });
}



getSongs()


	mainDiv.addEventListener('click', (event)=>{
		event
		 
		 if(event.target.className === 'genre-button'){
		 let body = document.querySelector('.main-container')
		 body.innerHTML = ''
		 	let id = parseInt(event.target.dataset.id)
		 	 fetch(`http://localhost:3000/genres/${id}`)
  				.then(function(response) {
   			 return response.json();
  			})
  			.then(function(genre) {
   			 console.log((genre.songs));
   			 let mainDiv = document.querySelector('.main-container')
         let iframe = document.createElement('img');

         iframe.style.width = "180px";
         iframe.style.height = "180px"
         iframe.src = "https://i.gifer.com/LixF.gif";

  
         //  genre.songs.forEach(song =>{
         //  console.log(song.id)

         // })
    
         const randomSong = pickRandom(genre.songs)

         audioSong.controls = 'controls'
         audioSong.dataset.id = randomSong.id 
         audioSong.src = randomSong.audioPath
         audioSong.type = 'audio/mp3'
         audioSong.autoplay = true

          // audioSong.dataset.id = genre.songs.id
          // audioSong.id = genre.songs.title
         audioSong.currentTime = 65;
         mainDiv.appendChild(iframe)
         mainDiv.appendChild(audioSong)
         let middlehTag = document.createElement('h2')
        
         middleDiv.appendChild(middlehTag)
         
         genre.songs.forEach(song =>{
          songButton()

        function songButton(){
          let songButton =  document.createElement('button')
          songButton.dataset.id = song.id
          songButton.id = song.id
          songButton.innerText = song.title
          songButton.className = "songButton"
          middlehTag.appendChild(songButton)
        }
         })
      
       

         let timeLeft = 25
         countDownInterval = setInterval(function() {
          // update the dom
          countDown.innerText = timeLeft;
          if (timeLeft === 0) {
            alert('time up!')
            clearInterval(countDownInterval)
            stopSong()
            countDown.innerText = "TIME UP!"
            countDown.innerHTML = ""
            mainDiv.style.display = 'initial'

            // getSongs()
          }
          timeLeft--
         }, 1000)
      
          // let user_Choice = document.getElementsByTagName('button')
          // user_Choice.addEventListener('click', (event)=>{
          //   event
          //   debugger
          // })

       });

		}
}) 

const getScoreboard = () => {
  fetch(`http://localhost:3000/scoreboards`)
  .then(res => res.json())
  .then(scoreList => {
    scoreList.forEach(score => {
      bottomTag.innerHTML += scoreLister(score)
    })
  })
}









middleDiv.addEventListener('click', (event) => {
  event 
  console.log(event)
  if(event.target.className === "songButton"){
    if(event.target.dataset.id === mainDiv.querySelector('audio').dataset.id){
      points++
      clearInterval(countDownInterval)
      bottomDiv.appendChild(bottomTag)
      countDown.innerText = ""
      bottomTag.innerText = `POINTS: ${points}` 
      middleDiv.innerHTML = ""
      mainDiv.querySelector('audio').remove()
      getSongs()

     
    } else { 

      alert("try again")
      countDown.innerHTML = ""
      attempts--;
      if(attempts < 1){
        middleDiv.innerHTML = ''
        countDownInterval.innerHTML =''
        alert(`GAME OVER, YOUR SCORE IS ${points}`)
        let userName = window.prompt("Enter your name")
        fetch('http://localhost:3000/scoreboards', {
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: userName,
            score: points
          })
        })
        getScoreboard();
      }
    }
  }

})




 