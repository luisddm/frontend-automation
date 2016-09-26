'use strict';

// Get the NodeList of input DOM elements with the numbers to sum
const numsList = document.querySelectorAll('.num');

// Convert NodeList to Array using a destructuring with a spread operator
// Why is this a NodeList and not an Array? https://developer.mozilla.org/en-US/docs/Web/API/NodeList
const numsArray = [...numsList];

// Get the rest of the DOM elements
const showResult = document.getElementById('show-result');
const calculateResult = document.getElementById('calculate-result');

// Calculate button event
calculateResult.addEventListener('click', calculate);

function calculate() {
  // Do the sum
  const result =
    numsArray
      .map(num => +num.value)
      .reduce((prevNum, nextNum) => prevNum + nextNum, 0);

  // Show the result in the showResult element
  showResult.innerHTML = result;
}
