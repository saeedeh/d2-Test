//inilize variables
const nRow=10;
const nCol=6;
var p_target=0.3333;
var numTarget=22;
const timeLimit=20000;
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const TRIAL_NUM=14;
const ITI=1000;

const fontSize=35;
const fontStr=fontSize+'px Calibri';
const Wmargin=50;//5px margin
const Hmargin=50;//5px margin
const BUTTON_FONT='Arial'
var stage;
var mainCV;
var startPage,endPage;
var trial;
var practiceTrial;
var cellWidth,cellHeight;
var respTimeout;
var SUBJ_ID
const letters=['p','d']
const topQuotes=['','\u030D','\u030E']; //single above, double above
const downQuotes=['','\u0329','\u0348']; //single below, double below
//var cir

//time

//FILE
var subjFileEntry=null;
var subjFileWriter=null;
var subjFileName;
var fileSetupDone;


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
    SUBJ_ID=document.getElementById("subjID").value
    if(isNaN(SUBJ_ID)){
      alert('Enter a valid number for subject ID.')
      return;
    }
    SUBJ_ID= +SUBJ_ID;
    subjFileName=SUBJ_ID+'.txt';
    createFile();
  }
function afterFileSetup(){
  //alert('after file setup with value: '+ fileSetupDone)
  if (fileSetupDone==false){
    var r = confirm("Do you want to continue without saving?");
    if(r==false){
      return;
    }
    else {
      startPage.clear();
      //setTimeout(function(){trial=new Trial(0);},10)
      setTimeout(function(){practiceTrial=new PracticeTrial();},10)
      return;
    }
  }
  //createjs.Sound.play("hit");

  startPage.clear();
  saveSubjInfo();
  setTimeout(function(){practiceTrial=new PracticeTrial(0);},10)
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
    //alert("just started!")
    this.startBut.addEventListener("click",onStartClicked,true);

    this.domElement = new createjs.DOMElement(document.getElementById('myForm'));
    this.domElement.x = mainCV.width/2-100;
    this.domElement.y = 100;
    fileSetupDone=null;
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

      this.shareText=new createjs.Text("Share Results", "20px "+BUTTON_FONT, "#002b2b");
      this.shareText.x=mainCV.width/2-this.shareText.getBounds().width/2;
      this.shareText.y=this.againText.y+120;
      this.shareRect=new createjs.Shape();
      this.shareRect=createButton(this.shareRect,150,60)
      this.shareRect.x=mainCV.width/2-150/2;
      this.shareRect.y=this.shareText.y-60/4.5;

  }
 addToStage(){
    stage.addChild(this.gameOverText);
    stage.addChild(this.againRect);
    stage.addChild(this.againText)

    stage.addChild(this.shareRect);
    stage.addChild(this.shareText)
    this.againRect.addEventListener("click",playAgain);
    this.shareRect.addEventListener("click",fileShare);
    stage.update();
  }
}

class instructionPage{
  constructor(){
    this.text='You will see a page containing a number of  \'d and \'p letters.'+
    'Each letter can have one or two dashes above and/or below it.'+
    ' Your task is to touch letters \'d\' when it has a total of two dashes above or below it.'+
    '\n\nThese are the letters you have to touch\n'+
    'd'+topQuotes[1]+'  '+'d'+downQuotes[1]+'  '+
    'd'+topQuotes[0]+downQuotes[0]+
    '\n\nAnd these are all other letters you have to ignore:\n'+
    'd'+topQuotes[1]+dwonQuotes[1]+ '  '+
    'd'+topQuotes[0]+'  '+
    'd'+            downQuotes[0]+'  '+
    'd'+topQuotes[0]+downQuotes[1]+ '  '+
    'd'+topQuotes[1]+downQuotes[0]+ '  '+

    'p'+topQuotes[1]+'  '+'p'+downQuotes[1]+'  '+
    'p'+topQuotes[0]+downQuotes[0]+
    'p'+topQuotes[1]+dwonQuotes[1]+ '  '+
    'p'+topQuotes[0]+'  '+
    'p'+            downQuotes[0]+'  '+
    'p'+topQuotes[0]+downQuotes[1]+ '  '+
    'p'+topQuotes[1]+downQuotes[0]+ '  ';
   this.txtShape=new createjs.Text(this.text,fontStr,'black');
   this.txtShape.x=10;this.txtShape.y=10;
   this.nextBut=new createjs.Shape();
   this.startBut=createButton(this.startBut,250,60)
   this.startBut.x=mainCV.width/2-150/2;
   this.startBut.y=mainCV.height*2/3;
   this.nextText=new createjs.Text("Practice", "20px "+BUTTON_FONT, "#002b2b");

  }
  addToStage(){
    stage.addChild(this.txtShape);
    stage.update();

  }
}
class Trial{
  constructor(trialN){
    this.trialN=trialN;
    this.textShapes=[];
    this.correctAnswered=false;
    this.correctAr=[];
    var str ='';
    str=str+'trial: '+trialN+'\n';
    str= str+new Date().toJSON()+', '
    str=str+Date.now()+'\n'
    this.correctAr=Trial.randBool(this.correctAr,nRow*nCol,numTarget)
    for(var i=0;i<nRow;i++){
      for(var j=0; j<nCol;j++){
          var ind=Trial.ij2ind(i,j);
          if(j==0){
              str=str+this.correctAr[ind];
            }
          else {
            str=str+', ' +this.correctAr[ind];
          }
          if(this.correctAr[ind])
              this.textShapes[ind] = new createjs.Text(Trial.getRandomTargetStr(), fontStr, 'black')
          else
              this.textShapes[ind] = new createjs.Text(Trial.getRandomStr(), fontStr, 'black')
          this.textShapes[ind].ind=ind;
          var xy=Trial.ij2xy(i,j);
          this.textShapes[ind].x=xy.x-fontSize/3;
          this.textShapes[ind].y=xy.y-fontSize/1.2;
          stage.addChild(this.textShapes[ind]);
      }
      str=str+'\n'
    }
    str=str+'\n'
    var trialInfo=new Blob([str],{ type: 'text/plain' })
    appendToFile(trialInfo)
    this.onsetTime=Date.now();
    this.respTime=null;
    stage.update();
    mainCV.addEventListener("click", onClick,false);
    respTimeout= setTimeout(onNoResponse,timeLimit);
  }
  static  shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
static randBool(ar,n,m){
  for(var i=0;i<n;i++){
    ar[i]=false;
    if(i < m){
      ar[i]=true;
    }
  }
  ar=Trial.shuffle(ar);
  return ar;
}
  static getRandomStr(){
    var ind1=Trial.getRandomInt(3);
    var ind2=Trial.getRandomInt(3);
    var letter=letters[Trial.getRandomInt(letters.length)]
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
    if(i<0 ||j<0)
      return -1;
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
  appendToFile(new Blob(['-1\n\n\n'], {type:'text/plain'}));
  startNextTrial();
}

function correctClicked(){
  clearTimeout(respTimeout);
//  createjs.Sound.play("right");
  trial.correctAnswered=true;
  mainCV.removeEventListener("click", onClick,false);
  setTimeout(startNextTrial,800);
}
function wrongClicked(){
  //createjs.Sound.play("wrong");
}
function onClick(e){
  //alert('in onClick')
   trial.respTime=Date.now();
  // alert('timeStamp: '+trial.respTime);
    var x=e.layerX;
    var y=e.layerY;
    var ij=Trial.xy2ij(x,y);
    var xy=Trial.ij2xy(ij.i,ij.j);
    var ind=Trial.ij2ind(ij.i,ij.j);
    var rightResp=trial.correctAr[ind];
    //alert('right? '+rightResp)

    var clickData= new Blob([trial.trialN+ ', '+ij.i+', '+ij.j +', '+ x+ ', '+ y+ ', '+rightResp+ ', '+trial.onsetTime+', '+trial.respTime+'\n'], { type: 'text/plain' })
    //alert('saving ')
    appendToFile(clickData);
    //alert('saved')
    drawLine(xy.x,xy.y);
    //drawClickCircle(xy.x,xy.y,'red');
    // if(rightResp){
    //   //alert('right')
    //   drawClickCircle(xy.x,xy.y,'green')
    //     correctClicked();
    // }
    // else {
    //   //alert('wrong');
    //     drawClickCircle(xy.x,xy.y,'red')
    //   wrongClicked();
    // }
}
function drawLine(x,y){
  var r=Math.min(cellWidth/4,cellHeight/4)
  var line1 = new createjs.Shape();
  line1.graphics.setStrokeStyle(2);
  line1.graphics.beginStroke('black');
  line1.graphics.moveTo(x-r, y-r)
  line1.graphics.lineTo(x+r,y+r);

  var line2 = new createjs.Shape();
  line2.graphics.setStrokeStyle(2);
  line2.graphics.beginStroke('black');
  line2.graphics.moveTo(x-r, y+r)
  line2.graphics.lineTo(x+r,y-r);
  stage.addChild(line1);
  //stage.addChild(line2);
  stage.update();
}
function drawClickCircle(x,y,color,disappear,alpha){
  var cir=new createjs.Shape();
  cir.graphics.beginFill(color).drawCircle(x,y,Math.min(cellWidth/3,cellHeight/3));
  cir.alpha=alpha;
  stage.addChild(cir);
  //createjs.Tween.get(cir).to({alpha:0},1000).call(test);
  stage.update();
  if(disappear){
    setTimeout(function(){
      cir.alpha=0;
      stage.update();
    },1000);
  }
}
function startGame(){

  screen.orientation.lock("portrait");
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
fileShare();
//emailRes();
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



//practice trials

class PracticeTrial{
  constructor(){
    this.textShapes=[];
    this.correctAnswered=false;
    this.correctAr=[];
    this.numRow=5;
    this.numCol=nCol;
    for(var i=0;i<this.numRow;i++){
      for(var j=0; j<this.numCol;j++){
          var ind=Trial.ij2ind(i,j);
          if(Math.random()<p_target){
            this.correctAr[ind]=true;
          }
          else {
            this.correctAr[ind]=false;
          }
          if(this.correctAr[ind])
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
    //add buttons

    this.ansBut=new createjs.Shape();
    this.ansText=new createjs.Text("Solution", "20px "+BUTTON_FONT, "#002b2b");
    this.ansBut=createButton(this.ansBut,150,60)
    this.ansBut.x=mainCV.width/2-150/2;
    this.ansBut.y=mainCV.height*2/3;
    this.ansText.x=mainCV.width/2-this.ansText.getBounds().width/2;
    this.ansText.y=this.ansBut.y+60/4.5;

    stage.addChild(this.ansBut);
    stage.addChild(this.ansText);
    stage.update();
    mainCV.addEventListener("click", onPracticeClick,false);
    this.ansBut.addEventListener("click",OnSeeAnswers,true);

    //make finish and practice more buttons
    this.pmBut=new createjs.Shape();
    this.pmText=new createjs.Text("Practice more", "20px "+BUTTON_FONT, "#002b2b");
    this.pmBut=createButton(this.pmBut,150,60)
    this.pmBut.x=mainCV.width/2-150/2-200;
    this.pmBut.y=mainCV.height*2/3;
    this.pmText.x=mainCV.width/2-this.pmText.getBounds().width/2-200;
    this.pmText.y=this.pmBut.y+60/4.5;

    this.fpBut=new createjs.Shape();
    this.fpText=new createjs.Text("Finish practice", "20px "+BUTTON_FONT, "#002b2b");
    this.fpBut=createButton(this.fpBut,150,60)
    this.fpBut.x=mainCV.width/2-150/2+200;
    this.fpBut.y=mainCV.height*2/3;
    this.fpText.x=mainCV.width/2-this.fpText.getBounds().width/2+200;
    this.fpText.y=this.fpBut.y+60/4.5;
    stage.update()
  }
}
function onPracticeClick(e){
  var x=e.layerX;
  var y=e.layerY;
  var ij=Trial.xy2ij(x,y);
  var xy=Trial.ij2xy(ij.i,ij.j);
  var ind=Trial.ij2ind(ij.i,ij.j);
  var rightResp=practiceTrial.correctAr[ind];
  if(rightResp){
      //drawClickCircle(xy.x,xy.y,'green',false,0.1)
      drawLine(xy.x,xy.y)
  }
  else if(ij.i>=0 && ij.j>=0 && ij.i<practiceTrial.numRow){
    drawClickCircle(xy.x,xy.y,'red',true,0.1)
  }
}
function OnSeeAnswers(){
  mainCV.removeEventListener("click", onPracticeClick,false);
  practiceTrial.ansBut.removeEventListener("click",OnSeeAnswers,true);
  for(var i=0;i<practiceTrial.numRow;i++){
    for(var j=0; j<practiceTrial.numCol;j++){
        var ind=Trial.ij2ind(i,j);
        if(practiceTrial.correctAr[ind]){
          xy=Trial.ij2xy(i,j);
          drawClickCircle(xy.x,xy.y,'green',false,0.4)
        }
      }
    }
    stage.removeChild(practiceTrial.ansBut);
    stage.removeChild(practiceTrial.ansText);

    practiceTrial.pmBut.addEventListener("click",function(){
      stage.clear();
      stage.removeAllChildren();
      stage.update();
      setTimeout(function(){practiceTrial=new PracticeTrial();},10)
    },true);


    practiceTrial.fpBut.addEventListener("click",function(){
      stage.clear();
      stage.removeAllChildren();
      stage.addChild(startPage.startBut);
      stage.addChild(startPage.startText);
      stage.update();
      startPage.startBut.addEventListener('click',function(){
        stage.removeAllChildren();
        stage.update();
        setTimeout(function(){trial=new Trial(0);},10)
      },true)
      stage.update();
    },true);


    stage.addChild(practiceTrial.fpBut);
    stage.addChild(practiceTrial.fpText);
    stage.addChild(practiceTrial.pmBut);
    stage.addChild(practiceTrial.pmText);
    stage.update();
}
////////////////////////////////////////////////
//
document.addEventListener("deviceready", onDeviceReady, false);
    // device APIs are available
    //
    function onDeviceReady() {
        // Empty
        startGame()

    }
////////////////FILE new

function createFile(){
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}
function gotFS(fileSystem) {
  //  alert(" got file system! root is "+fileSystem.root)
    fileSystem.root.getFile(subjFileName, {create: true, exclusive: false}, gotFileEntry, fail);
}
function gotFileEntry(fileEntry) {
    subjFileEntry= fileEntry.createWriter(gotFileWriter, fail);
  //  alert("got file entry")
}
function gotFileWriter(writer) {
    subjFileWriter=writer;
    fileSetupDone=true;
    afterFileSetup();
}
function fail(error) {
       alert("Not able to save to file. Error: "+error.code);
       fileSetupDone=false;
       afterFileSetup();
}
////////////////////////////
function fileExists(){
  try {
              subjFileWriter.seek(subjFileWriter.length);
          }
  catch (e) {
              return false;
          }
  return true;

}
function appendToFile(dataObj){
    //alert('starting to write..')
    if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }
        subjFileWriter.onwriteend = function() {
            //alert("Successful file write...");
        };
    subjFileWriter.write(dataObj);
}


function saveSubjInfo(){
  str='';
  str=str+'Subj_id: '+ SUBJ_ID+'\n';
  var age=document.getElementById('age').value;
  str=str+'Age: '+age+'\n';
  var gender='U';
  if(document.getElementById('gender-male').checked){
    gender='M';
  }
  else if(document.getElementById('gender-female').checked){
    gender='F';
  }
  str= str + 'Gender: '+gender+'\n';
  var comment=document.getElementById("comment").value;
  str=str + 'Comment: ' + comment+'\n';
  var personalData= new Blob([str], { type: 'text/plain' });
  appendToFile(personalData);
}

//file sharing
// this is the complete list of currently supported params you can pass to the plugin (all optional)
function emailRes(){
  window.plugin.email.isServiceAvailable(
    function (isAvailable) {
        alert('is available')
    }
);
    cordova.plugins.email.open({
      to:          'ss3767@cornell.edu', // email addresses for TO field
    //  cc:          Array, // email addresses for CC field
    //  bcc:         Array, // email addresses for BCC field
      attachments: 'app://Documents/'+subjFileName, // file paths or base64 data streams
      subject:    'd2 test data file (SUBJECT: '+SUBJ_ID+')', // subject of the email
      body:       ' ', // email body (for HTML, set isHtml to true)
  }, callback, scope);

}
function fileShare(){
  var options = {
  message: 'share data', // not supported on some apps (Facebook, Instagram)
  subject: 'd2 Test iPad data', // fi. for email
  files: [cordova.file.documentsDirectory+subjFileName], // an array of filenames either locally or remotely
  };

  var onSuccess = function(result) {
  //  alert("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
    //alert("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
  };

  var onError = function(msg) {
    alert("Sharing failed with message: " + msg);
  };

  window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
}
