

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
  "UP":-10,
  "DOWN":10,
  "RIGHT":-1,
  "LEFT":1
};

var moves={
  "P":[m.UP,m.UP*2,m.UP+m.RIGHT,m.UP+m.LEFT],
  "p":[m.DOWN,m.DOWN*2,m.DOWN+m.RIGHT,m.DOWN+m.LEFT],
  "N":[m.UP*2+m.RIGHT,m.UP+m.RIGHT*2,m.RIGHT*2+m.DOWN,m.RIGHT+m.DOWN*2,
    m.DOWN*2+m.LEFT,m.DOWN+m.LEFT*2,m.LEFT*2+m.UP,m.LEFT+m.UP*2],
  "n":[m.UP*2+m.RIGHT,m.UP+m.RIGHT*2,m.RIGHT*2+m.DOWN,m.RIGHT+m.DOWN*2,
    m.DOWN*2+m.LEFT,m.DOWN+m.LEFT*2,m.LEFT*2+m.UP,m.LEFT+m.UP*2],
  "B":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT],
  "b":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT],
  "R":[m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "r":[m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "Q":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT,
    m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "q":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT,
    m.UP,m.RIGHT,m.DOWN,m.LEFT],
  "K":[m.UP+m.RIGHT,m.DOWN+m.RIGHT,m.DOWN+m.LEFT,m.UP+m.LEFT,
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
  ret=prompt("your move: ");
  console.log(ret);
  return ret;
}

function space(x,mov){
  if (board[x+mov]=='.'){
    return true;
  }
  else{
    return false;
  }
}

function isUpperCase(str,x,mov) {
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
  if (((isUpperCase(piece,x,mov) && isUpperCase(board[x+mov],x,mov))
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

function nk_empty_gen(piece,x,mov){
  var gen;
  gen=[];
  if (
  ($.inArray(piece, ["N","n","K","k"])!=-1)
  && space(x,mov)){
    gen.push(format_move(piece,x,mov));
  }
  return gen;
}

function enemy_gen(piece,x,mov){
  var gen;
  gen=[];
  if (enemy(piece,x,mov)){
    gen.push(format_move(piece,x,mov));
  }
  return gen;
}

function pawn_empty_gen(piece,x,mov){
  var gen;
  gen=[];
  if (
  ($.inArray(piece, ["P","p"])!=-1)
  && ($.inArray(mov, moves[piece].slice(0,2))!=-1)
  && space(x,mov)){
    gen.push(format_move(piece,x,mov));
  }
  return gen;
}

function pawn_enemy(piece,x,mov){
  var gen;
  gen=[];
  if (
  ($.inArray(piece, ['P','p'])!=-1)
  && ($.inArray(mov, moves[piece].slice(2,4))!=-1)
  && enemy(piece,x,mov)){
    gen.push(enemy_gen(piece,x,mov));
  }
  return gen;
}

function nk_enemy(piece,x,mov){
  var gen;
  gen=[];
  if (
    ($.inArray(piece,['N','n','K','k']) !=-1)
    && (mov in moves[piece])){
    gen.push(enemy_gen(piece,x,mov));
  }
  return gen;
}

function rbq(piece,x,mov){
  var gen;
  gen=[];
  idx=1;
  if (
    $.inArray(piece,['R','r','B','b','Q','q']) !=-1
  ){
    while (board[x+mov*idx]!='/'){
      gen.push(enemy_gen(piece,x,mov*idx));
      idx+=1;
    }
  }
  return gen;
}

function check(board,x,piece,moves){
  var gen;
  gen=[];
  for (m in moves){
    gen.push.apply(gen,nk_empty_gen(piece,x,moves[m]));
    gen.push.apply(gen,pawn_empty_gen(piece,x,moves[m]));
    gen.push.apply(gen,pawn_enemy(piece,x,moves[m]));
    gen.push.apply(gen,nk_enemy(piece,x,moves[m]));
    gen.push.apply(gen,rbq(piece,x,moves[m]));
  }
  return gen;
}

function gen_moves(board){
  var gen;
  gen=[];
  for (x=0;x<board.length;++x){
    for (piece in moves){
      if (board[x]==piece){
        gen.push.apply(gen,check(board,x,piece,moves[piece]));
      }
    }
  }
  return gen;
}

col={
  "a":1,"b":2,"c":3,"d":4,
  "e":5,"f":6,"g":7,"h":8
};

row={
  "1":80,"2":70,"3":60,"4":50,
  "5":40,"6":30,"7":20,"8":10
};

function interpret_coord(coord){
  var l;
  l=[];
  l.push(col[coord[0]]+row[coord[1]]);
  l.push(col[coord[2]]+row[coord[3]]);
  return l;
}

String.prototype.replaceAt=function(index, character) {
  return this.substr(0, index) + character + this.substr(index+character.length);
}

function render_move(li){
  board=board.replaceAt(li[1],board[li[0]]);
  board=board.replaceAt(li[0],'.');
  return board;
}

function print_gen(gen){
  console.log("there are "+gen.length+" moves gened");
  for (var x in gen){
    //console.log(gen[x]);
  }
}

function main_loop(board){
  print_board(board);
  eval_board(board);
  board=render_move(interpret_coord(prompt_move()));
  print_board(board);
  print_gen(gen_moves(board));
}

main_loop(board);
