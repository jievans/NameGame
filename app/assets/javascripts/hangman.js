(function(){
  
  function Game(names){
    var game = this;
    this.namesArray = names;
    this.setupFreshBoard();
  }
  
  Game.prototype.setupFreshBoard = function(){
    this.pickName();
    this.prevGuesses = Object.create(null);
    this.strikes = 0; 
    this.buildBoard();  
    $("body").on("keyup.turns", this.newLetterListener(this));
  };
  
  // the name is picked randomly and then removed from the names array, so as not to be repeated in subsequent plays. also generates a letter frequency hash that serves to: 1) check the presence of a letter and 2) provide the indices of that letter in the string.
  Game.prototype.pickName = function(){
    var nameIndex = Math.floor(Math.random() * this.namesArray.length);
    this.name = this.namesArray.splice(nameIndex, 1)[0].toLowerCase();
    console.log("The name is " + this.name + ".");
    this.letterHash = Object.create(null);
    for(var i = 0; i < this.name.length; i++ ){
      this.letterHash[this.name[i]] = this.letterHash[this.name[i]] || [];
      this.letterHash[this.name[i]].push(i);
    }
  };
  
  // build a fresh board, emptying out all previous information.  we insert the html space character in empty spans so that future insertion of characters doesn't cause a change in height of the span.
  Game.prototype.buildBoard = function(){
    $("#hangman-board").empty();
    $("#win-loss").empty();
    $("#message").empty();
    $("#guessed-letters").empty();
    $("#strikes").html(this.strikes); 
    for(var i = 0; i < this.name.length; i++){
      var char_span = $("<span>").html("&nbsp;");
      char_span.attr("data-char-num", i).addClass("hang-char");
      $("#hangman-board").append(char_span);
    }
  };
  
  // listener that fires on every keyup event
  Game.prototype.newLetterListener = function(game){
    return function(event){
      if( ! game.checkProperGuess(event.keyCode) ){
        return true;
      }
      
      var character = String.fromCharCode(event.keyCode + 32);

      if( ! game.checkPrevGuesses(character) ){
        return true
      }    
      game.processChoice(character);
    };
  };
  
  // checks that the input is a proper letter, so as to prevent counting as guesses extraneous input (such as hitting the period key)
  Game.prototype.checkProperGuess = function(keycode){
    if(keycode < 49 || keycode > 90){
      return false;
    } else {
      return true;
    }
  };
  
  // see if guess has already been made.  if it has, message the user. else, add the guess to previousGuesses and reflect in guess history.  
  Game.prototype.checkPrevGuesses = function(character){
    if(this.prevGuesses[character]){
      $("#message").html("You've already guessed that letter!");
      return false;
    } else {
      $("#message").empty();
      this.prevGuesses[character] = true;
      var prevGuessString = Object.keys(this.prevGuesses).join(", ");
      $("#guessed-letters").html(prevGuessString);
      return true;
    }
  };
  
  // check if character choice is in the word.  if so, reveal the letter in the game display and check for win condition.  if not, increment strikes and check for loss.  
  Game.prototype.processChoice = function(character){
    var game = this;
    if(game.letterHash[character] == undefined){
      game.strikes++;
      $("#strikes").html(this.strikes);
      game.checkLoss();
    } else {
      game.letterHash[character].forEach(function(index){
        var identifier = '[data-char-num="' + index + '"]';
        $(identifier).html(game.name[index]);
      });
      delete this.letterHash[character];
      this.checkWin();
    }
  };
  
 
  // if user has lost, tell user and prepare for restart.
  Game.prototype.checkLoss = function(){ 
    if(this.strikes == 6){
      var message = 'YOU LOSE! Your "friend" has the last name: ' + this.name;
      $("#win-loss").html(message).removeClass().addClass("lose");;
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  // if user has won, tell user and prepare for restart.
  Game.prototype.checkWin = function(){
    if(Object.keys(this.letterHash).length == 0 ){
      var message = "YOU WIN! You must really care about your friends :)"
      $("#win-loss").html(message).removeClass().addClass("win");
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  // in restart mode, stop listening for regular keypress and only listen for restart decision signaled by pressing 'r'.  once signaled, setup a fresh board.
  Game.prototype.restartPrompt = function(){
    var game = this;
    $("body").off("keyup.turns");
    $("#message").html("press r to restart");
    $("body").on("keyup.restart", function(event){
      if(event.keyCode == 82){
        game.setupFreshBoard();
        $("body").off("keyup.restart");
      }
    });
  };
  
  window.Game = Game;
  
})();