//inilize variables
const nRow=3;
const nCol=3;
const timeLimit=15000;
const TRIAL_NUM=10;
const ITI=800;

const fontSize=35;
const fontStr=fontSize+'px Calibri';
const Wmargin=50;//5px margin
const Hmargin=50;//5px margin
const BUTTON_FONT='Arial'
var stage;
var mainCV;
var startPage,endPage;
var trial;
var cellWidth,cellHeight;
var respTimeout;
var SUBJ_ID
const letters=['p','q','d']
const topQuotes=['','\u030D','\u030E']; //single above, double above
const downQuotes=['','\u0329','\u0348']; //single below, double below
var cir

//FILE
var subjFileEntry=null;
var subjFileWriter=null;
var subjFileName="subj01.txt"


function loadSounds()
{
  createjs.Sound.registerSound("assets/click2.wav", "hit");
  createjs.Sound.registerSound("assets/error.wav", "wrong");
  createjs.Sound.registerSound("assets/success-norm.wav", "right");
  createjs.Sound.registerSound("assets/timeout.wav", "timeout");


}
  function createButton(shape, width,height){
    shape.graphics.beginStroke("black").setStrokeStyle(1).f("lightGray").drawRoundRect(0,0,width,height, 15);
    return shape
}
/////////////////////////////////



  function onStartClicked(e){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    SUBJ_ID=document.getElementById("subjID").value
      createjs.Sound.play("hit");
      startPage.clear();
      mainCV.width=window.innerWidth;
      mainCV.height=window.innerHeight;
      //writeToFile('example.json', { foo: 'bar' });
      //mySQLite();
    //  var personalData= new Blob(['name: '+'Ali'+', ID: '+ '0'+',age: '+'21'], { type: 'text/plain' })
    //  appendToFile(personalData);
      setTimeout(function(){trial=new Trial(0);},10)
  }
class StartPage{
  constructor(){
    this.startBut=new createjs.Shape();
    this.startText=new createjs.Text("Start", "20px "+BUTTON_FONT, "#002b2b");
    this.startBut=createButton(this.startBut,150,60)
    this.startBut.x=mainCV.width/2-150/2;
    this.startBut.y=mainCV.height*2/3;
    this.startText.x=mainCV.width/2-this.startText.getBounds().width/2;
    this.startText.y=this.startBut.y+60/4.5;
    alert("just started!")
    this.startBut.addEventListener("click",onStartClicked,true);

    this.domElement = new createjs.DOMElement(document.getElementById('myForm'));
    this.domElement.x = mainCV.width/2-100;
    this.domElement.y = 100;

  }
   addToStage(){
      stage.addChild(this.domElement);
      stage.addChild(this.startBut);
      stage.addChild(this.startText);
      this.domElement.htmlElement.style.visibility = "visible";
      stage.update();
    }
    clear(){
      this.startBut.removeEventListener("click",onStartClicked,true);
      stage.removeAllChildren();
      //this.domElement.htmlElement.style.visibility = "hidden";
      this.domElement.visible=false;
      stage.update();
    }
}
class EndPage{
  constructor(){
    this.gameOverText=new createjs.Text("Finished", "30px "+BUTTON_FONT, "black");
      this.gameOverText.x=mainCV.width/2-this.gameOverText.getBounds().width/2;
      this.gameOverText.y=mainCV.height/3-this.gameOverText.getBounds().height/2;
      this.againText=new createjs.Text("Play again", "20px "+BUTTON_FONT, "#002b2b");
      this.againText.x=mainCV.width/2-this.againText.getBounds().width/2;
      this.againText.y=this.gameOverText.y+120;
      this.againRect=new createjs.Shape();
      this.againRect=createButton(this.againRect,150,60)
      this.againRect.x=mainCV.width/2-150/2;
      this.againRect.y=this.againText.y-60/4.5;

  }
 addToStage(){
    stage.addChild(this.gameOverText);
    stage.addChild(this.againRect);
    stage.addChild(this.againText)
    this.againRect.addEventListener("click",playAgain);
    stage.update();
  }
}
class Trial{
  constructor(trialN){
    this.trialN=trialN;
    this.textShapes=[];
    this.correctAnswered=false;
    this.correct_ij=new Object();
    this.correct_ij.i=Trial.getRandomInt(nRow);
    this.correct_ij.j=Trial.getRandomInt(nCol);
    for(var i=0;i<nRow;i++){
      for(var j=0; j<nCol;j++){
          var ind=Trial.ij2ind(i,j);
          if(i==this.correct_ij.i && j==this.correct_ij.j)
              this.textShapes[ind] = new createjs.Text(Trial.getRandomTargetStr(), fontStr, 'black')
          else
              this.textShapes[ind] = new createjs.Text(Trial.getRandomStr(), fontStr, 'black')
          this.textShapes[ind].ind=ind;
          var xy=Trial.ij2xy(i,j);
          this.textShapes[ind].x=xy.x-fontSize/3;
          this.textShapes[ind].y=xy.y-fontSize/1.2;
          stage.addChild(this.textShapes[ind]);
      }
    }
    stage.update();
    mainCV.addEventListener("click", onClick,false);
    respTimeout= setTimeout(onNoResponse,timeLimit);
  }
  static getRandomStr(){
    var ind1=Trial.getRandomInt(3);
    var ind2=Trial.getRandomInt(3);
    var letter=letters[Trial.getRandomInt(3)]
    if ((ind1==0 && ind2==0)||(ind1+ind2==2 && letter=='d'))
        return Trial.getRandomStr();
    else{
        return letter+topQuotes[ind1]+downQuotes[ind2];
    }
  }
  static getRandomTargetStr(){
    var ind1=Trial.getRandomInt(3);
    var ind2=2-ind1;
    return 'd'+topQuotes[ind1]+downQuotes[ind2];
  }
  static ij2ind(i,j){
    return i*nCol+j;
  }
  static ind2ij(ind){
    var ij=new Object();
    ij.i = Math.floor(ind/nCol);
    ij.j = ind - ij.i * nCol
    return ij;
  }
  static ij2xy(i,j){
    var xy=new Object();
    var xLeft=j*cellWidth+Wmargin+cellWidth/2;
    var yTop=i*cellHeight+Hmargin+cellHeight/2;
    xy.x=xLeft//+cellWidth/2;
    xy.y=yTop//+cellHeight/2;
    return xy;
  }
  static xy2ij(x,y){//for event listener
      var ij=new Object();
      if(x<Wmargin|| x>nCol*cellWidth+Wmargin || y<Hmargin||y>nRow*cellHeight+Hmargin){
        ij.i=-1;
        ij.j=-1;
        return ij;
      }
      ij.j=Math.floor((x-Wmargin)/cellWidth)
      ij.i=Math.floor((y-Hmargin)/cellHeight)
      return ij;
  }
  static getRandomInt(max) {
    //0<=result<=max
  return Math.floor(Math.random() * Math.floor(max));
}
}
function startNextTrial(){
  stage.removeAllChildren();
  stage.update();
  if(trial.trialN==TRIAL_NUM-1){
    finishGame();
  }
  else{
    setTimeout(function(){
      trial=new Trial(trial.trialN+1);
    },ITI)
  }
}
function onNoResponse(){
  createjs.Sound.play("timeout");
  mainCV.removeEventListener("click", onClick,false);
  startNextTrial();
}

function correctClicked(){
  clearTimeout(respTimeout);
  createjs.Sound.play("right");
  trial.correctAnswered=true;
  mainCV.removeEventListener("click", onClick,false);
  setTimeout(startNextTrial,800);
}
function wrongClicked(){
  createjs.Sound.play("wrong");
}
function onClick(e){
    var x=e.layerX;
    var y=e.layerY;
    var ij=Trial.xy2ij(x,y);
    var xy=Trial.ij2xy(ij.i,ij.j);
    var trialData= new Blob(['x: '+x+', y: '+ y], { type: 'text/plain' })
    appendToFile(trialData);
    if(ij.i==trial.correct_ij.i && ij.j==trial.correct_ij.j){
      drawClickCircle(xy.x,xy.y,'green')
        correctClicked();
    }
    else {
        drawClickCircle(xy.x,xy.y,'red')
      wrongClicked();
    }
}
function drawClickCircle(x,y,color){
if(cir !=undefined)
    cir.alpha=0;
  cir=new createjs.Shape();
  cir.graphics.beginFill(color).drawCircle(x,y,Math.min(cellWidth/3,cellHeight/3));
  cir.alpha=0.1;
  stage.addChild(cir);
  //createjs.Tween.get(cir).to({alpha:0},1000).call(test);
  stage.update();
  setTimeout(function(){
    cir.alpha=0;
    stage.update();
  },800);
}
function startGame(){
  loadSounds();
  mainCV =document.getElementById('mainCV')
  stage = new createjs.Stage(mainCV);
  stage.canvas.height =window.innerHeight;
  stage.canvas.width=window.innerWidth;
  cellWidth=(mainCV.width- Wmargin*2)/nCol;
  cellHeight=(mainCV.height- Hmargin*2)/nRow;
  startPage=new StartPage();
  startPage.addToStage();
}

function finishGame(){
  stage.removeAllChildren();
  stage.update();
endPage= new EndPage()
endPage.addToStage();
}
function playAgain(e){
  createjs.Sound.play("hit");
  endPage.againRect.removeEventListener("click",playAgain);
  stage.removeAllChildren();
  stage.update();
  setTimeout(onRestart,10);

}
function onRestart(){
  startPage=new StartPage();
    startPage.addToStage();
}

document.addEventListener("deviceready", onDeviceReady, false);
    // device APIs are available
    //
    function onDeviceReady() {
        // Empty
        startGame()

    }
////////////////FILE new

function gotFS(fileSystem) {
    alert(" got file system! root is "+fileSystem.root)
    fileSystem.root.getFile(subjFileName, {create: true, exclusive: false}, gotFileEntry, fail);
}

function gotFileEntry(fileEntry) {
    subjFileEntry= fileEntry.createWriter(gotFileWriter, fail);
    alert("got file entry")

}
function gotFileWriter(writer) {
    subjFileWriter=writer;
}
function appendToFile(dataObj){
    alert('starting to write..')
    if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }
    try {
                subjFileWriter.seek(subjFileWriter.length);
            }
    catch (e) {
                alert("file doesn't exist!");
            }
    subjFileWriter.onwriteend = function() {
            alert("Successful file write...");
        };
    subjFileWriter.write(dataObj);
}
 function fail(error) {
        alert("in fail");
        alert(error.code);
}



//sqlite
function mySQLite(){
 alert('starting to save')
var db = window.sqlitePlugin.openDatabase({name: 'test.db',iosDatabaseLocation: 'Documents'});
alert('opened')
db.transaction(function(tr) {
    tr.executeSql("SELECT upper('Test string') AS upperString", [], function(tr, rs) {
    alert('Got upperString result: ' + rs.rows.item(0).upperString);
    });
});

db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS subjTable (name, subj_id)');
    tx.executeSql('INSERT INTO subjTable VALUES (?,?)', ['Alice', 101]);
    tx.executeSql('INSERT INTO subjTable VALUES (?,?)', ['Betty', 202]);
  }, function(error) {
    alert('Transaction ERROR: ' + error.message);
  }, function() {
    alert('Populated database OK');
  });

  db.transaction(function(tx) {
      tx.executeSql('SELECT count(*) AS mycount FROM subjTable', [], function(tx, rs) {
        alert('Record count (expected to be 2): ' + rs.rows.item(0).mycount);
      }, function(tx, error) {
        alert('SELECT error: ' + error.message);
      });
    });


  // var db = null;
  // db = window.sqlitePlugin.openDatabase({
  //   name: 'my.db',
  //   location: 'default',
  // });
}

//////////// file
//document.addEventListener('deviceready', onDeviceReady, false);

    function writeToFile(fileName, data) {

        data = JSON.stringify(data, null, '\t');
        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
            directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    fileWriter.onwriteend = function (e) {
                        // for real-world usage, you might consider passing a success callback
                        alert('Write of file "' + fileName + '"" completed.');
                    };

                    fileWriter.onerror = function (e) {
                        // you could hook this up with our global error handler, or pass in an error callback
                        alert('Write failed: ' + e.toString());
                    };

                    var blob = new Blob([data], { type: 'text/plain' });
                    fileWriter.write(blob);
                }, errorHandler.bind(null, fileName));
            }, errorHandler.bind(null, fileName));
        }, errorHandler.bind(null, fileName));
    }
