const startGame = document.querySelector("#startGame");
const scoreBar = document.querySelector("#scoreBar");
const gameContainer = document.querySelector("#gameContainer");
const weapon = document.querySelector("#weapon");
const bombs = document.querySelector("#bombs");
const target = document.querySelector("#target");

let score = 0;
let started = false;

let currentHighest;
if (localStorage.getItem("highest")) {
  currentHighest = localStorage.getItem("highest");
} else {
  currentHighest = 0;
}
startGame.addEventListener("click", e => {

  startPlaying();

  started = true;
  startGame.textContent = "Good Luck!";
  startGame.style.pointerEvents = "none";
  scoreBar.textContent = `score: ${score}`;
});

let player = {
  score: 0,
  speed: 5,
  gameOver: true,
  fire: false,
  alienSpeed: 5
};

let movementListener = {};


document.addEventListener("keydown", e => {

  if (started)
    arrangeMovement(e, true);
})


document.addEventListener("keyup", e => {
  if (started)
    arrangeMovement(e, false);
})


const arrangeMovement = (e, inverse) => {
  let key = e.key;

  if (key === "ArrowLeft") {
    movementListener.left = inverse;
  } else if (key === "ArrowRight") {
    movementListener.right = inverse;
  } else {
    if (inverse) {
      addShoot();
    }

  }
  console.log(movementListener)
};


const playingAreaCalculated = gameContainer.getBoundingClientRect();


console.log("Bilgiler:" + playingAreaCalculated.left);

const startPlaying = () => {
  requestAnimationFrame(update);
}

const addShoot = () => {
  player.fire = true;
  score++;
  scoreBar.textContent = score;
  bombs.classList.remove("hide");
  bombs.xpos = (weapon.offsetLeft + (weapon.offsetWidth / 2));
  bombs.ypos = weapon.offsetTop - 10,
    bombs.style.left = bombs.xpos + "px";
  bombs.style.top = bombs.ypos + "px";

}

const detectCollision = (a, b) => {

  const aRectangle = a.getBoundingClientRect();
  const bRectangle = b.getBoundingClientRect();

  return !(
    (aRectangle.bottom < bRectangle.top)
    ||
    (aRectangle.top > bRectangle.bottom)
    ||
    (aRectangle.right < bRectangle.left)
    ||
    (aRectangle.left > bRectangle.right)
  )



}

let direction = 1;
let targetSpeed = 1;

const update = () => {
  let currentLeft = weapon.offsetLeft;
  let currentRight = weapon.offsetLeft + weapon.offsetWidth;
  let targetXPos = target.offsetLeft;



  if (player.fire) {

    bombs.ypos -= 4;
    bombs.style.top = bombs.ypos + "px";

  }


  if (movementListener.left && currentLeft > gameContainer.getBoundingClientRect().left) {

    if (player.speed > currentLeft - gameContainer.getBoundingClientRect().left) {
      currentLeft -= (currentLeft - gameContainer.getBoundingClientRect().left);
    } else {
      currentLeft -= player.speed;
    }

    console.log("Left limit: " + gameContainer.getBoundingClientRect().left);
    console.log("Current Left: " + currentLeft);

  }

  if (movementListener.right && currentRight < gameContainer.getBoundingClientRect().right) {
    if (player.speed > (gameContainer.getBoundingClientRect().right - currentRight)) {
      currentRight += (gameContainer.getBoundingClientRect().right - currentRight);
    } else {
      currentRight += player.speed;
    }


    console.log("Current right: " + currentRight);
    console.log("Right limit: " + gameContainer.getBoundingClientRect().right);
    currentLeft = currentRight - weapon.offsetWidth;
  }

  if (direction === 1) {
    if (targetXPos + targetSpeed < gameContainer.getBoundingClientRect().right) {
      targetXPos += targetSpeed;
    } else {
      direction = 0;
    }
  } else if (direction === 0) {
    if (targetXPos - targetSpeed > gameContainer.getBoundingClientRect().left) {
      targetXPos -= targetSpeed;
    } else {
      direction = 1;
    }
  }

  target.style.left = targetXPos + "px";
  weapon.style.left = currentLeft + "px";


  if (detectCollision(bombs, target)) {
    targetSpeed++;

    if (target.offsetWidth - 8 > 0) {
      target.style.width = (target.offsetWidth - 8) + "px";
    } else {



      if (score < currentHighest || currentHighest == 0) {
        scoreBar.textContent = `NEW BEST SCORE! You've finished in ${score} trials.`
        scoreBar.style.color = "green";
        scoreBar.style.backgroundColor = "white";
        currentHighest = score;
        localStorage.setItem("highest", currentHighest);
      } else {
        scoreBar.textContent = `You've completed the game in ${score} trials. Your best performance was ${currentHighest} trials.`
      }


      return false;
    }
  }


  requestAnimationFrame(update);
}