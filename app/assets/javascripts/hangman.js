(function(){
  function Game(names){
    var game = this;
    this.namesArray = names;
    this.setupFreshBoard();
  }
  
  Game.prototype.buildBoard = function(){
    $("#hangman-board").empty();
    for(var i = 0; i < this.name.length; i++){
      var char_span = $("<span>").html("&nbsp;");
      char_span.attr("data-char-num", i).addClass("hang-char");
      $("#hangman-board").append(char_span);
    }
  };
  
  // picks random name, removes it from array, and sets to this.name;
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
  
  Game.prototype.checkWin = function(){
    if(Object.keys(this.letterHash).length == 0 ){
      $("#win-loss").html("YOU WIN!").removeClass().addClass("win");
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  Game.prototype.checkLoss = function(){ 
    if(this.strikes == 6){
      $("#win-loss").html("YOU LOSE!").removeClass().addClass("lose");;
      $("body").off("keyup.turns");
      this.restartPrompt();
    }
  };
  
  Game.prototype.setupFreshBoard = function(){
    this.pickName();
    this.strikes = 0; 
    $("#strikes").html(this.strikes); 
    this.buildBoard();  
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
    };
  };
  
  Game.prototype.restartPrompt = function(){
    var game = this;
    $("body").off("keyup.turns");
    $("#message").html("press r to restart");
    $("body").on("keyup.restart", function(event){
      if(event.keyCode == 82){
        $("#win-loss").empty();
        $("#message").empty();
        game.setupFreshBoard();
        $("body").off("keyup.restart");
      }
    });
  };
  
  window.Game = Game;
  
})();