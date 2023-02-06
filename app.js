const http = require("http");
//Express フレームワークを読み込む
const express = require('express');
const app = express();
var path = require('path');

const bodyParser = require('body-parser');//postをjsonで取得

const fs = require('fs');//ファイルを使うため

let menu = fs.readFileSync('menu.json');
let read_menu = JSON.parse(menu);
let like_to = JSON.parse(fs.readFileSync('wouldlike.json'));

let tell = [];//これで情報を行き来させる
let kago = [];//購入物を保存

// ビューエンジンをejsにセットする
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//初期化
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// indexのテンプレートを呼び出す
app.get('/', function(req, res) {
  res.render('pages/index',{text:""});
});

// meatページのテンプレートを呼び出す
app.get('/meat', function(req, res) {
  tell = [];
  spl(read_menu,'meat');
  res.render('pages/meat', {tell,text:""});
});

app.post('/meat', function(req, res){
  Buying(req.body.contents);
  res.render('pages/meat',{tell,text:"カゴに入れました"});
});

// fishページのテンプレートを呼び出す
app.get('/fish', function(req, res) {
  tell = [];
  spl(read_menu,'fish');
  res.render('pages/fish', {tell,text:""});
});

app.post('/fish', function(req, res){
  Buying(req.body.contents);
  res.render('pages/fish',{tell,text:"カゴに入れました"});
});

// vegitableページのテンプレートを呼び出す
app.get('/vegetable', function(req, res) {
  tell = [];
  spl(read_menu,'vegetable');
  res.render('pages/vegetable', {tell,text:""});
});

app.post('/vegetable', function(req, res){
  Buying(req.body.contents);
  res.render('pages/vegetable',{tell,text:"カゴに入れました"});
});

// sweetページのテンプレートを呼び出す
app.get('/sweet', function(req, res) {
  tell = [];
  spl(read_menu,'sweet');
  res.render('pages/sweet', {tell,text:""});
});

app.post('/sweet', function(req, res){
  Buying(req.body.contents);
  res.render('pages/sweet',{tell,text:"カゴに入れました"});
});

// drinkページのテンプレートを呼び出す
app.get('/drink', function(req, res) {
  tell = [];
  spl(read_menu,'drink');
  res.render('pages/drink', {tell,text:""});
});

app.post('/drink', function(req, res){
  Buying(req.body.contents);
  res.render('pages/drink',{tell,text:"カゴに入れました"});
});

// clothsページのテンプレートを呼び出す
app.get('/cloths', function(req, res) {
  tell = [];
  spl(read_menu,'cloths');
  res.render('pages/cloths', {tell,text:""});
});

app.post('/cloths', function(req, res){
  Buying(req.body.contents);
  res.render('pages/cloths',{tell,text:"カゴに入れました"});
});

// othersページのテンプレートを呼び出す
app.get('/others', function(req, res) {
  tell = [];
  spl(read_menu,'others');
  res.render('pages/others', {tell,text:""});
});

app.post('/others', function(req, res){
  Buying(req.body.contents);
  res.render('pages/others',{tell,text:"カゴに入れました"});
});

// regiページのテンプレートを呼び出す
app.get('/regi', function(req, res) {
  spl2;
  res.render('pages/regi', {kago,text:""});
});

app.post('/regi', function(req, res) {
  let randomm = random_make(100);
  let amount = [];
  amount.unshift(randomm);
  for (let i=0;i<kago.length;i++){
    amount.push({ name : req.body.name[i] , amount : parseFloat(req.body.bai[i])*parseFloat(kago[i].amount)});
  }
  like_to.push(amount);
  fs.writeFileSync('wouldlike.json',JSON.stringify(like_to));
  tell = [];kago = [];
  res.render('pages/buy',{user:randomm.user});
});

// menuページのテンプレートを呼び出す
app.get('/menu', function(req, res) {
  res.render('pages/menu',{text:""});
});

//POSTデータを受けとる
app.post('/menu', function(req, res){
  let news={name:req.body.name, price:parseFloat(req.body.price)/parseFloat(req.body.amount), tag:req.body.tag, amount:parseFloat(req.body.amount),count:req.body.count,pic:req.body.pic};
  read_menu.push(news);
  fs.writeFileSync('menu.json', JSON.stringify(read_menu));
  res.render('pages/menu',{text:"完了"});
});


// http://localhost:3000/ をオープンにする
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

function spl(data, tag){
  for(let j = 0;j < data.length;j++){
    if(data[j].tag == tag) tell.push(data[j]);
  };
  tell = tell.filter(Boolean);//配列を詰める
  for(let j =0;j < tell.length;j++){
    tell[j].bai = '1';
  };
};

function spl2(){
  for(let i=0;i<(kago.length-1);i++){
    for(let j=kago.length-1;j>i;j--){
      if(kago[i].name == kago[j].name){
        delete kago[j];
      };
    };
  };
  kago = kago.filter(Boolean);//配列を詰める
};

function Buying (data){
  let j=0;
  for (let i=0; i < data.length;i++) {
      if(parseFloat(data[i])==1){
        if (kago.length != 0){
          for(let k=0;k<kago.length;k++){
            if (tell[i-j-1].name == kago[k].name){
              data[i]='0';
            };
          };
        };
        data[i] == 1 ? kago.push(tell[i-j-1]) : console.log("ダブりや") ;
          data[i]='0';
          j++;
      };
  };
};

function random_make(max){
  let random = Math.floor(Math.random() * (max + 1) );
  let i = 0;
  for(;i < like_to.length;i++){
    if (like_to[i].user == random){
      random = Math.floor(Math.random() * (100 + 1) );
      i = 0;
    };
  };
  return({user:random});
}