'use strict';
const colors = require('colors');

const assert = require('assert');
const readline = require('readline');
const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

let board = [];
let solution = '';
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

console.log(`Hey user! These are your possible inputs: `, `${letters.join(', ')}`.rainbow);

const printBoard = () => {
   /** everytime after user's input, the board will print hints (guess, correctLettersAndLocations and correctLettersButNotLocation)  */
   for (let i = 0; i < board.length; i++) {
      console.log(`Attempt #${i + 1}:`.underline, board[i].cyan);
   }
};

const generateSolution = () => {
   /** value of solution variable is generated randomly by picking 4 letters from array named letters,
    * this function is modified, so it can avoid adding duplicate letters */
   solution = solution.split('');
   while (solution.length < 4) {
      let randomIndex = Math.floor(Math.random() * (0 - letters.length)) + letters.length;
      // console.log(`randomIndex: ${randomIndex}`);
      // console.log(`letters[randomIndex]: ${letters[randomIndex]}`);
      /** randomIndex sometimes is the same, so we need if statement to allow push only non-duplicates, meaning -
       * if randomSolution array already has the letter then don't allow to push it again */
      if (!solution.includes(letters[randomIndex])) {
         solution.push(letters[randomIndex]);
      }
   }
   // console.log("solution.join(''):", solution.join(''));
   /** use .join() to convert Array ([a,b,c,d]) to String ("abcd") */
   solution = solution.join('');
};

const generateHint = guess => {
   // console.log('=====guess:', guess);
   // console.log('=====solution:', solution);
   let correctLettersAndLocations = 0;
   let correctLettersButNotLocation = 0;
   let indexOfCorrectLetterAndLocations;
   let indexOfCorrectLetterAndWrongLocation;

   /** solution and guess variables come to this function as Strings ("abcd"), .split('') them  to convert to Array ([a,b,c,d]) -
    * need to do it because we can't use .forEach() and .map() with Strings but only with Arrays */
   let solutionArray = solution.split('');
   let guessArray = guess.split('');

   solutionArray.forEach((letter, index) => {
      if (letter === guessArray[index] && index === guessArray.indexOf(letter)) {
         /** in this section find if letter from solutionArray exists in guessArray AND their position (index) is the same */
         // console.log('index:', guessArray.indexOf(letter));
         // console.log('letter:', letter);
         // console.log(`Correct letter and its location: ${letter}`.red);
         indexOfCorrectLetterAndLocations = index;
         correctLettersAndLocations++;
         solutionArray[index] = null;
      }

      if (guessArray.includes(letter) && index !== guessArray.indexOf(letter)) {
         /** in this section find if letter from solutionArray exists in guessArray BUT their position (index) is NOT the same */
         // console.log(`Correct letter but not its location: ${letter}`.yellow);
         indexOfCorrectLetterAndWrongLocation = index;
         correctLettersButNotLocation++;
         solutionArray[index] = null;
      }
   });

   // console.log(`solutionArray: ${solutionArray}`);
   // console.log(`correctLettersAndLocations: ${correctLettersAndLocations}`.red);
   // console.log(`correctLettersButNotLocations: ${correctLettersButNotLocation}`.yellow);
   /** push results of generateHint function (guess, correctLettersAndLocations and correctLettersButNotLocation) to board, so it can
    * print hits to the user */
   board.push(`Your guess is: ${guess}. Correct Letters and Locations: ${correctLettersAndLocations}. Correct Letters but not Locations: ${correctLettersButNotLocation}.`);
   return `${correctLettersAndLocations}-${correctLettersButNotLocation}`;
};

const mastermind = guess => {
   // console.log('=====guess:', guess);
   // console.log('=====solution:', solution);
   // solution = 'abcd'; // Comment this out to generate a random solution
   if (solution === guess) {
      /** print 'You guessed it!' if guess and solution match */
      console.log('You guessed it!'.green, 'Hit "Ctrl+C" to start a new game.');
      return 'You guessed it!';
      //  board.push(`Your guess is: ${guess}. Correct Letters and Locations: 4. Correct Letters but not Locations: 0.`);
   }
   if (board.length === 10) {
      /** print 'You ran out of turns! The solution was: solution' if the board length is 10 */
      console.log(`You ran out of turns! The solution was: `.red, solution.rainbow, '. Hit "Ctrl+C" to start a new game.');
      return false;
   } else {
      /** continue generating hints until guess matches solution or number of attempts exceeds 10 */
      generateHint(guess);
   }
};

const getPrompt = () => {
   rl.question('Enter your guess (4 non-duplicate letters): '.underline, guess => {
      mastermind(guess);
      printBoard();
      getPrompt();
   });
};

// Tests
if (typeof describe === 'function') {
   solution = 'abcd';
   describe('#mastermind()', () => {
      it('should register a guess and generate hints', () => {
         mastermind('aabb');
         assert.equal(board.length, 1);
      });
      it('should be able to detect a win', () => {
         assert.equal(mastermind(solution), 'You guessed it!');
      });
   });

   describe('#generateHint()', () => {
      /** setting board to [], each unit test should be independent and not rely on results of a previous test */
      it('should generate hints', () => {
         board = [];
         assert.equal(generateHint('abdc'), '2-2');
      });
      it('should generate hints if solution has duplicates', () => {
         board = [];
         assert.equal(generateHint('aabb'), '1-1');
      });
   });
} else {
   generateSolution();
   getPrompt();
}
