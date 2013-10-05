(function(){
  function Game(names){
    var game = this;
    $("#hangman-board").empty();
    this.namesArray = names;
    this.pickName(); 
    this.strikes = 0; 
    this.buildBoard();
    // for(var i = 0; i < this.name.length; i++){
//       console.log(i);
//       var char_span = $("<span>").html("_");
//       char_span.attr("data-char-num", i).addClass("hang-char");
//       $("#hangman-board").append(char_span);
//     }
    
    console.log(this.letterHash);
    $("body").on("keyup.turns", function(event){
      var character = String.fromCharCode(event.keyCode + 32);
      if(game.letterHash[character] == undefined){
        game.strikes++;
        $("#strikes").html(game.strikes);
        game.checkLoss();
      } else {
        game.letterHash[character].forEach(function(index){
          var identifier = '[data-char-num="' + index + '"]';
          $(identifier).html(game.name[index]);
        });
        delete game.letterHash[character];
        game.checkWin();
      }
    });
  }
  
  Game.prototype.buildBoard = function(){
    for(var i = 0; i < this.name.length; i++){
      console.log(i);
      var char_span = $("<span>").html("_");
      char_span.attr("data-char-num", i).addClass("hang-char");
      $("#hangman-board").append(char_span);
    }
  };
  
  // picks random name, removes it from array, and sets to this.name;
  Game.prototype.pickName = function(){
    var nameIndex = Math.floor(Math.random() * this.namesArray.length);
    this.name = this.namesArray.splice(nameIndex, 1)[0].toLowerCase();
    this.letterHash = Object.create(null);
    for(var i = 0; i < this.name.length; i++ ){
      this.letterHash[this.name[i]] = this.letterHash[this.name[i]] || [];
      this.letterHash[this.name[i]].push(i);
    }
  };
  
  Game.prototype.checkWin = function(){
    if(Object.keys(this.letterHash).length == 0 ){
      $("#win-loss").html("YOU WIN!");
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  Game.prototype.checkLoss = function(){ 
    if(this.strikes == 6){
      $("#win-loss").html("YOU LOSE!");
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  Game.prototype.setupFreshBoard = function(){
    $("#hangman-board").empty();
    this.pickName();
    this.strikes = 0; 
    this.buildBoard();
    $("#strikes").html(this.strikes);   
    $("body").on("keyup.turns", this.newLetterListener(this));
  };
  
  Game.prototype.newLetterListener = function(game){
    return function(event){
      var character = String.fromCharCode(event.keyCode + 32);
      if(game.letterHash[character] == undefined){
        game.strikes++;
        $("#strikes").html(game.strikes);
        game.checkLoss();
      } else {
        game.letterHash[character].forEach(function(index){
          var identifier = '[data-char-num="' + index + '"]';
          $(identifier).html(game.name[index]);
        });
        delete game.letterHash[character];
        game.checkWin();
      }
    });
  };
  
  Game.prototype.restartPrompt = function(){
    var game = this;
    $("body").off("keyup.turns");
    $("#message").html("press r to restart");
    $("body").on("keyup.restart", function(event){
      if(event.keyCode == 82){
        game.setupFreshBoard();
      }
    });
  };
  
  window.Game = Game;
  
})();