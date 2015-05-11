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

console.log(moves["p"][0]);

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

function gen_moves(board){
  for (x=0;x<board.length;++x){
    for (piece in moves){
      if (board[x]==piece){
        check(moves[piece]);
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
