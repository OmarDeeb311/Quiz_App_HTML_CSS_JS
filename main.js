let interval;
let count = 0;
fetch("html.json")
  .then((result) => {
    return result.json();
  })
  .then((result) => {
    //? Creates An Array from Json object to shuffle
    let array_of_object = Object.keys(result).map((key) => {
      return {
        question: key,
        options: result[key].options,
        answer: result[key].answer,
      };
    });
    shuffleArray(array_of_object);

    //? Get Every Question Details From Shuffled Array
    for (let i = 0; i < array_of_object.length; i++) {
      let q_num = `Q${i + 1}`;
      let question = `${q_num}`;
      question += "&nbsp;)&nbsp;&nbsp;";
      question += array_of_object[i].question;
      let options = array_of_object[i].options;
      let options_array = Array.from(options);
      let Answer = array_of_object[i].answer;

      //? Create QuestionDiv
      let question_div = document.createElement("div");
      question_div.className = "question";
      question_div.setAttribute("id", `q${i + 1}`);
      if (question_div.getAttribute("id") !== "q1") {
        question_div.classList.add("disable");
      }

      //? Create Question Title
      let h3 = document.createElement("h3");
      h3.innerHTML = question;

      //? Create Options Div
      let opt = document.createElement("div");
      opt.className = "options";

      //? Create Submit Button
      let submit = document.createElement("button");
      submit.innerHTML = "Submit";
      submit.className = "submit-button";

      //? Randomize The Options
      let random_options = [...options_array];
      shuffleArray(random_options);

      //? Sets Options
      for (let j = 0; j < random_options.length; j++) {
        let input = document.createElement("input");
        let label = document.createElement("label");
        let ans = document.createElement("div");
        ans.className = "ans";
        input.setAttribute("type", "radio");
        input.setAttribute("name", `ans-${i + 1}`);
        input.setAttribute("id", `${i + 1}-${j + 1}`);
        label.setAttribute("for", `${i + 1}-${j + 1}`);
        label.innerHTML = random_options[j];
        ans.appendChild(input);
        ans.appendChild(label);
        opt.appendChild(ans);
      }
      //? Click Submit --> check for correct answer , jump to the next.
      submit.addEventListener("click", () => {
        let length = Object.keys(result).length;
        let parent = submit.parentElement;
        let choice = parent.getElementsByTagName("label");
        for (let i = 0; i < choice.length; i++) {
          if (choice[i].innerHTML === Answer) {
            let correct_label = choice[i];
            let id = correct_label.getAttribute("for");
            let correct_radio = document.getElementById(`${id}`);
            if (correct_radio.checked) {
              count++;
            }
          }
        }
        let current = question_div;
        let next = document.getElementById(`q${i + 2}`);
        current.classList.add("disable");
        if (next) {
          next.classList.remove("disable");
          startTime(next, length);
        } else {
          showResult(length);
        }
      });

      //? Timer
      let timer = document.createElement("span");
      timer.className = "time";
      let timer_value = document.createElement("span");
      let timer_word = "Timer : 01:20 ";
      timer.innerHTML = `${timer_word}`;
      timer.appendChild(timer_value);

      question_div.appendChild(h3);
      question_div.appendChild(timer);
      question_div.appendChild(opt);
      question_div.appendChild(submit);
      document.querySelector(".container").appendChild(question_div);
    }

    //? Start First Question Timer
    setTimeout(() => {
      let e = document.querySelector("#q1");
      startTime(e, Object.keys(result).length);
    });
  });

let num_of_questions = 0;
//? Start Timer of the given div
function startTime(element, length) {
  let progress = document.querySelector(".container .progress");
  progress.style.width = `${Math.floor((num_of_questions / length) * 100)}%`;
  num_of_questions++;
  clearInterval(interval);
  let timer = document.createElement("span");
  timer.className = "time";
  let timer_value = document.createElement("span");

  // ? Sets The Full Time of Each Question
  let full_time_in_sec = 80;
  let seconds;

  //? Sets Minutes From Seconds
  let minutes = Math.floor(full_time_in_sec / 60);

  //? Check If Minutes is 0 to assign seconds to full time
  if (minutes === 0) {
    seconds = full_time_in_sec;
  }

  //? Check If Minutes is not 0 to assign seconds in 0 to 60 range
  else if (minutes > 0) {
    seconds = full_time_in_sec - 60 * minutes;
  }
  interval = setInterval(() => {
    let timer_word = `Timer : 0${minutes}:`;

    //? check if seconds > 10 do not seconds as is
    if (seconds >= 10) {
      timer_value.innerHTML = seconds;
      seconds--;
      timer.innerHTML = timer_word;
      timer.appendChild(timer_value);
    }
    //? check if seconds > 10 to add 0 before seconds
    else if (seconds >= 0 && seconds < 10) {
      timer_value.innerHTML = "0" + seconds;
      seconds--;
      timer.innerHTML = timer_word;
      timer.appendChild(timer_value);
    }

    //? Start New Minute if minutes > 0
    if (seconds < 0 && minutes !== 0) {
      seconds = 59;
      minutes--;
    }

    //? Check if time over
    else if (seconds < 0 && minutes === 0) {
      timeover(element, length);
    }
    element.appendChild(timer);
  }, 1000);
}

//? Jump To The Next Question When Time Is Over
async function timeover(element, length) {
  element.classList.add("disable");
  let current_div = element;
  let arr = Array.from(current_div.getAttribute("id"));
  let index = +arr[1] + 1;
  let arr2 = [arr[0], index];
  let id = arr2.join("");
  let next_div = document.getElementById(`${id}`);
  if (next_div !== null) {
    next_div.classList.remove("disable");
    startTime(next_div, length);
  } else {
    clearInterval(interval);
    showResult(length);
  }
}

//? Show pop-up Message That Show Result.
function showResult(length) {
  let overlay = document.querySelector(".overlay");
  let pop_up = document.querySelector(".pop-up");
  let h1 = document.createElement("h1");
  let result = document.querySelector(".pop-up span");
  let txt = document.createTextNode("Your Result is :");
  result.innerHTML = `${count}` + " of " + length;

  if (count >= Math.ceil(length / 2)) {
    h1.innerHTML = "Congratulation !!";
    h1.style.color = "#183d3d";
  } else {
    h1.innerHTML = "Unfortunately!!";
    h1.style.color = "#dc3545";
  }

  let msg = document.createElement("div");
  msg.classList.add("msg");
  msg.appendChild(txt);
  msg.appendChild(result);
  pop_up.appendChild(h1);
  pop_up.appendChild(msg);
  overlay.classList.add("show");
  clearInterval(interval);
}

//? Shuffling The Array Using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
