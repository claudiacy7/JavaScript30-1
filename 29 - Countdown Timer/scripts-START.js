let countdown; //so it can be updated later on
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]'); //anything with time attribute could be a photo

function timer(seconds) { //takes number of seconds the timer should be in
  /*setInterval(function(){  //this causes performance issues on browser when scrolling
      seconds--;
  }, 1000);*/ 
  clearInterval(countdown); // clear any existing timers to avoid overlap

  const now = Date.now(); //when did the timer start
  const then = now + seconds * 1000; //Current time plus the seconds of the timer
  //console.log({now, then});
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => { //setInterval doesnt know when to stop, goes into minus eventually
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft); //run it immediately once so that the first second isnt skipped
  }, 1000);
}

function displayTimeLeft(seconds) {
  //console.log(seconds);
  const minutes = Math.floor(seconds / 60); //the lower bound of the decimal minute 
  const remainderSeconds = seconds % 60;
  //console.log({minutes, remainderSeconds});
//if remainder seconds is less than 10 add zero in front of remaining number eg. 2:04 not 2:4
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp); //converts it in a proper time stamp (Date, Day, etc)
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  //endTime.textContent = `Be Back At ${adjustedHour}:${minutes < 10 ? '0' : ''}${minutes}`; //US clock
  endTime.textContent = `Be Back At ${hour}:${minutes}`; //european clock
}

function startTimer() {
  //console.log(this.dataset.time); //returns a string of what we are looking for 
  const seconds = parseInt(this.dataset.time); //parseInt turns the string into a real number
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {//document. Name attribute if it exists
  e.preventDefault(); //stops from reloading page
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60); //pass number of minutes to our timer, multiply by 60 because timer uses seconds not minutes
  this.reset(); //clears out value
});
