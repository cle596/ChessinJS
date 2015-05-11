var board="rnbqkbnr/pppppppp/eeeePPPPPPPP/RNBQKBNR/"

function print_board(board){
  str="";
  for (i=0;i<board.length;++i){
    if (board[i]=='/'){
      console.log(str);
      str="";
    }
    else if (board[i]=='e'){
      console.log(Array(9).join('. '));
    }
    else{
      str+=board[i]+" ";
    }
  }
}

print_board(board);
