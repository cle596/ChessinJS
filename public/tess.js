(function(){
  var board;
  board=
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
    "1":"p","3":"n","5":"n","7":"n","20":"q","100":"k",
    "-1":"P","-3":"N","-5":"B","-7":"R","-20":"Q","-100":"K"
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
  var col={
    "a":1,"b":2,"c":3,"d":4,
    "e":5,"f":6,"g":7,"h":8
  };
  var row={
    "1":80,"2":70,"3":60,"4":50,
    "5":40,"6":30,"7":20,"8":10
  };
  var print_board=function(){
    offset=11;
    i=offset;
    while(i<board.length-offset+1){
      s="";
      s=board.substr(i,8).split("").join(" ");
      console.log(s);
      i+=10;
    }
  };
  var eval_board=function(board){
    var score=0;
    ///material
    for (var x=0;x<board.length;++x){
      for (k in key){
        if (board[k]==key[k]){
          score+=k;
        }
      }
    }
    console.log(score);
    return score;
  };
  var prompt_move=function(){
    ret=""
    ret=$("#submit").val();
    console.log(ret);
    return ret;
  };
  var space=function(x,mov){
    if (board[x+mov]=='.'){
      return true;
    }
    else{
      return false;
    }
  };
  var isUpperCase=function(str,x,mov) {
    return str === str.toUpperCase();
  };
  var isLowerCase=function(str) {
    return str === str.toLowerCase();
  };
  var isPiece=function(str) {
    if (str=="." || str=="/"){
      return false;
    }
    else{
      return true;
    }
  };
  var enemy=function(piece,x,mov){
    if (((isUpperCase(piece,x,mov) && isUpperCase(board[x+mov],x,mov))
      || (isLowerCase(piece) && isLowerCase(board[x+mov])))
    ){
      return false;
    }
    else {
      return true;
    }
  };
  var format_move=function(piece,x,mov,local_board){
    var data_object={};
    data_object["piece"]=piece;
    data_object["from"]=x;
    data_object["to"]=x+mov;
    data_object["board"]=render_move([x,x+mov],"local",local_board);
    //data_object["score"]=eval_board(data_object["board"]);
    return data_object;
  };
  var replace=function(x,mov){
    board[x+mov]=board[x];
    board[x]='.';
  };
  var nk_empty_gen=function(piece,x,mov){
    var gen;
    gen=[];
    if (
    ($.inArray(piece, ["N","n","K","k"])!=-1)
    && space(x,mov)){
      gen.push(format_move(piece,x,mov,board));
    }
    return gen;
  };
  var enemy_gen=function(piece,x,mov){
    var gen;
    gen=[];
    if (enemy(piece,x,mov)){
      gen.push(format_move(piece,x,mov,board));
    }
    return gen;
  };
  var pawn_empty_gen=function(piece,x,mov){
    var gen;
    gen=[];
    if (
    ($.inArray(piece, ["P","p"])!=-1)
    && ($.inArray(mov, moves[piece].slice(0,2))!=-1)
    && space(x,mov)){
      gen.push(format_move(piece,x,mov,board));
    }
    return gen;
  };
  var pawn_enemy=function(piece,x,mov){
    var gen;
    gen=[];
    if (
    ($.inArray(piece, ['P','p'])!=-1)
    && ($.inArray(mov, moves[piece].slice(2,4))!=-1)){
      gen.push.apply(gen,enemy_gen(piece,x,mov));
    }
    return gen;
  };
  var nk_enemy=function(piece,x,mov){
    var gen;
    gen=[];
    if (
    ($.inArray(piece,['N','n','K','k']) !=-1)
    && ($.inArray(x+mov, moves[piece])!=-1)){
      gen.push.apply(gen,enemy_gen(piece,x,mov));
    }
    return gen;
  };
  var rbq=function(piece,x,mov){
    var gen;
    gen=[];
    idx=1;
    if (
      $.inArray(piece,['R','r','B','b','Q','q']) !=-1
    ){
      while (board[x+mov*idx]!='/'){
        gen.push.apply(gen,enemy_gen(piece,x,mov*idx));
        if (!space(x,mov*idx)){
          break;
        }
        else{
          idx+=1;
        }
      }
    }
    return gen;
  };
  var check=function(board,x,piece,moves){
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
  };
  var gen_moves=function(board){
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
  };
  var interpret_coord=function(coord){
    var l;
    l=[];
    l.push(col[coord[0]]+row[coord[1]]);
    l.push(col[coord[2]]+row[coord[3]]);
    return l;
  };

  var replaceAt=function(string,index, character) {
    return string.substr(0, index) + character + string.substr(index+character.length);
  };

  var render_move=function(li,opt,local_board){
    if(opt=="global"){
      board=replaceAt(board,li[1],board[li[0]]);
      board=replaceAt(board,li[0],'.');
    }
    else if(opt=="local"){
      local_board=replaceAt(local_board,li[1],local_board[li[0]]);
      local_board=replaceAt(local_board,li[0],'.');
      return local_board;
    }
  };
  var print_gen=function(gen){
    console.log("there are "+gen.length+" moves gened");
    for (var x in gen){
      console.log(JSON.stringify(gen[x]));
    }
  };
  var search_push=function(gen_cur,gen_prev){
    for (i in gen_prev){
      gen_cur.push.apply(gen_cur,gen_moves(gen_prev[i]["board"]));
    }
  };
  var search=function(){
    var gen1=[];var gen2=[];var gen3=[];
    var gen4=[];var gen5=[];var gen6=[];
    gen1=gen_moves(board);
    search_push(gen2,gen1);
    search_push(gen3,gen2);
    search_push(gen4,gen3);
    console.log("done");
  };
  var main_loop=function(input){
    //eval_board();
    render_move(interpret_coord(input),"global",null);
    console.log("");print_board();
    //print_gen(gen_moves(board));
    search();
  };
  $("#move").submit(function(e){
    e.preventDefault();
    var input=$(this).serializeArray()[0]["value"];
    main_loop(input);
  });
})();
