var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

var board=
  "//////////"+
  "/rnbqkbnr/"+
  "/pppppppp/"+
  "/......../"+
  "/......../"+
  "/......../"+
  "/......../"+
  "/PPPPPPPP/"+
  "/RNBQKBNR/"+
  "//////////";

var key={
  "p":1,"n":3,"b":5,"r":7,"q":20,"k":100,
  "P":-1,"N":-3,"B":-5,"R":-7,"Q":-20,"K":-100
};

var m={
  "UP":10,
  "DOWN":-10,
  "RIGHT":1,
  "LEFT":-1
};

var moves={
  "p":[m.UP,m.UP*2,m.UP+m.RIGHT,m.UP+m.LEFT],
  "n":3,
  "b":5,
  "r":7,
  "q":20,
  "k":100
};

function print_board(board){
  offset=11;
  i=offset;
  while(i<board.length-offset+1){
    s="";
    s=board.substr(i,8).split("").join(" ");
    console.log(s);
    i+=10;
  }
  return board;
}

function eval_board(board){
  score=0;
  ///material
  for (x=0;x<board.length;++x){
    for (property in key){
      if (board[x]==property){
        score+=key[property];
      }
    }
  }
  return score;
}

function prompt_move(){
  ret=""
  console.log("your move: ");
  rl.resume();
  rl.on('line', function(line){
    ret=line;
    rl.pause();
  });
  return ret;
}

function space(x,mov){
  if (x+mov=='.'){
    return true;
  }
  else{
    return false;
  }
}

function isUpperCase(str) {
  return str === str.toUpperCase();
}

function isLowerCase(str) {
  return str === str.toLowerCase();
}

function isPiece(str) {
  if (str=="." || str=="/"){
    return false;
  }
  else{
    return true;
  }
}

function enemy(piece,x,mov){
  if ( isPiece(piece) &&
    ((isUpperCase(piece) && isUpperCase(board[x+mov]))
    || (isLowerCase(piece) && isLowerCase(board[x+mov])))
  ){
    return false;
  }
  else {
    return true;
  }
}

function format_move(piece,x,mov){
  return {
    "piece":piece,
    "from":x,
    "to":x+mov
  };
}

function replace(x,x+mov){
  board[x+mov]=board[x];
  board[x]='.';
}

function empty_gen(gen,x,mov){
  if (space(x,mov)){
    gen.push(format_move(piece,x,mov));
  }
}

function enemy_gen(gen,piece,x,mov){
  if (enemy(piece,x,mov)){
    gen.push(format_move(piece,x,mov));
  }
}

l3=['n'];
l4=['b','r','q'];
function check(board,x,piece,moves){
  gen=[];
  if (piece in ['p','k']){
    for (mov in moves){
      empty_gen(gen,x,mov);
      if (piece in ['p'] && mov in moves.slice(2,4)){
        enemy_gen(gen,piece,x,mov);
      }
    }
  }
  else if (piece in ['n']){
  }
  else if (piece in ['b','r','q']){
  }
}

function gen_moves(board){
  for (x=0;x<board.length;++x){
    for (piece in moves){
      if (board[x]==piece){
        check(board,x,piece,moves[piece]);
      }
    }
  }
}

function main_loop(board){
  print_board(board);
  eval_board(board);
  prompt_move();
}

main_loop(board);
