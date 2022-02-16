const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() { //updates automatically on browser
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(localMediaStream => {
        console.log(localMediaStream);
      
  //  DEPRECIATION : 
  //       The following has been depreceated by major browsers as of Chrome and Firefox.
  //       video.src = window.URL.createObjectURL(localMediaStream);
  //       Please refer to these:
  //       Deprecated  - https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  //       Newer Syntax - https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
        
        video.srcObject = localMediaStream;
        video.play(); //wont update the video in real time unless you have play
      })
      .catch(err => {
        console.error(`OH NO!!!`, err);
      });
  }
  
  function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
  
    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height); //you can pass video or image elements
      // take the pixels out
      let pixels = ctx.getImageData(0, 0, width, height);//let to reassign later on
      // mess with them
      // pixels = redEffect(pixels);
      //debugger;//to pause it to that point to debug
  
      pixels = rgbSplit(pixels);
      // ctx.globalAlpha = 0.8; //colour movement will show for another 10 frames
  
      // pixels = greenScreen(pixels); //returns min and max values of each RBG color
      // put them back
      ctx.putImageData(pixels, 0, 0);
    }, 16); //every 16 milliseconds 
  }
  
  function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();
  
    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a'); //so we dont use back text
    link.href = data;
    link.setAttribute('download', 'handsome'); //creates download link on page as it will only exist on browser
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
  }
  
  function redEffect(pixels) { //adding filters
    for (let i = 0; i < pixels.data.length; i+=4) { //increment by 4 not 1, PIXELS.DATA is the array
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
    }
    return pixels;
  }
  
  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
    }
    return pixels;
  }
  
  function greenScreen(pixels) {
    const levels = {}; //holds minimum and maximum green
  
    document.querySelectorAll('.rgb input').forEach((input) => { //grab all RGB inputs 
      levels[input.name] = input.value; //set them to be on maximum
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) { //figure out what each color is
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin 
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        //if any of the colours are in between the min and max values we take it out (transparent)
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }
  
  getVideo();
  
  video.addEventListener('canplay', paintToCanvas); //once video is played it will trigger the page load
  