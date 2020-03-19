let myImage = document.querySelector('img');

myImage.onclick = function() {
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/wacky.jpg') {
      myImage.setAttribute ('src','images/clouds.jpg');
    } else {
      myImage.setAttribute ('src','images/wacky.jpg');
    }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');
myButton.onclick = function() {
    setUserName();
  }

if(!localStorage.getItem('name')) {
    setUserName();
  } else {
    let storedName = localStorage.getItem('name');
    myHeading.textContent = 'Hi, ' + storedName + ' you are a dumb bitch!';
  }

function setUserName() {
    let myName = prompt('Please enter your name.');
    if (!myName || myName === null){
        setUserName();
    } else {
        localStorage.setItem('name', myName);
        myHeading.textContent = 'Hi, ' + myName + ' you are a dumb bitch!';
    }
}