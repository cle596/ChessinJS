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
  "P":[m.UP,m.UP*2,m.UP+m.RIGHT,m.UP+m.LEFT],
  "p":[m.DOWN,m.DOWN*2,m.DOWN+m.RIGHT,m.DOWN+m.LEFT],
  "n":[m.UP*2+m.RIGHT,m.UP+m.RIGHT*2,m.RIGHT*2+m.DOWN,m.RIGHT+m.DOWN*2,
    m.DOWN*2+m.LEFT,m.DOWN+m.LEFT*2,m.LEFT*2+m.UP,m.LEFT+m.UP*2],
  "b":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT],
  "r":[m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "q":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT,
    m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "k":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT,
    m.UP,m.RIGHT,m.DOWN,m.LEFT]
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
  try{
    return str === str.toLowerCase();
  }
  catch(err){
    console.log(str);
  }
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

function replace(x,mov){
  board[x+mov]=board[x];
  board[x]='.';
}

function not_rbq_empty_gen(gen,piece,x,mov){
  if (!(piece in ["r","b","q"]) && space(x,mov)){
    gen.push(format_move(piece,x,mov));
  }
}

function enemy_gen(gen,piece,x,mov){
  if (enemy(piece,x,mov)){
    gen.push(format_move(piece,x,mov));
  }
}

function pawn_enemy(gen,piece,x,mov){
  if (mov in moves[piece].slice(2,4)){
    enemy_gen(gen,piece,x,mov);
  }
}

function nk_enemy(gen,piece,x,mov){
  if (mov in moves[piece]){
    enemy_gen(gen,piece,x,mov);
  }
}

function rbq(gen,piece,x,mov){
  idx=0;
  while (x+mov!='/'){
    enemy_gen(gen,piece,x,mov*idx);
    idx+=1;
  }
}

function check(board,x,piece,moves){
  gen=[];
  for (mov in moves){
    not_rbq_empty_gen(gen,piece,x,mov);
    pawn_enemy(gen,piece,x,mov);
    nk_enemy(gen,piece,x,mov);
    rbq(gen,piece,x,mov);
  }
  return gen;
}

function gen_moves(board){
  gen=[];
  for (x=0;x<board.length;++x){
    for (piece in moves){
      if (board[x]==piece){
        gen.push(check(board,x,piece,moves[piece]));
      }
    }
  }
  return gen;
}

col={
  "a":0,"b":1,"c":2,"d":3,
  "e":4,"f":5,"g":6,"h":7
};

row={
  "1":10,"2":20,"3":30,"4":40,
  "5":50,"6":60,"7":70,"8":80
};

function interpret_coord(coord){
  l=[];
  l.push(col[coord[0]]+row[coord[1]]);
  l.push(col[coord[2]]+row[coord[3]]);
  return l;
}

function render_move(li){
  board[li[1]]=board[li[0]];
  board[li[0]]='.';
}

function main_loop(board){
  print_board(board);
  eval_board(board);
  render_move(interpret_coord(prompt_move()));
  console.log(gen_moves(board));
}

main_loop(board);
