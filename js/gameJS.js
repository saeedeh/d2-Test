//inilize variables
const nRow=6;
const nCol=6;
const margin=5;//5px margin
var stage;
var mainCV;
var startPage;

function loadSounds()
{
  createjs.Sound.registerSound("assets/click2.wav", "hit");
  createjs.Sound.registerSound("assets/fail.wav", "wrong");
  createjs.Sound.registerSound("assets/success-norm.wav", "right");
  createjs.Sound.registerSound("assets/shoot2.wav", "shoot");

}

/////////////////////////////////


function displayStartPage(){
    startPage.startBut=createButton(startPage.startBut,150,60)
    stage.addChild(startPage.startBut);
    startPage.startBut.x=mainCV.width/2-150/2;
    startPage.startBut.y=mainCV.height*1/3;
    stage.addChild(startPage.startText);
    startPage.startText.x=mainCV.width/2-startPage.startText.getBounds().width/2;
    startPage.startText.y=startPage.startBut.y+60/4.5;
    startPage.startBut.addEventListener("click",onStartClicked);
    stage.update();
  }

  function onStartClicked(){
      createjs.Sound.play("hit");
      startPage.startBut.removeEventListener("click",onStartClicked);
      stage.removeAllChildren();
      stage.update();

  }
class StartPage{
  constructor(){
    this.startBut=new createjs.Shape();
    this.startText=new createjs.Text("Start", "20px cursive", "#002b2b");
  }
}
class trial{
  constructor(trialN){
    this.trialN=trialN;
    this.textShapes=[];
    this.quote
    for(var i=0;i<nRow;i++){
      for(var j=0; j<nCol;j++){
          this.

      }
    }
  }
}
function startGame(){
  loadSounds();
  mainCV =document.getElementById('mainCV')
  stage = new createjs.Stage(mainCV);
  stage.canvas.height =window.innerHeight;
  stage.canvas.width=window.innerWidth;
  startPage=new StartPage();
  displayStartPage();
}
startGame()

////////////
