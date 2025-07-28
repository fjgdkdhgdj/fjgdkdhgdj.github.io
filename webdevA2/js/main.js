//get DOM for all the main content for the pages
const homepage = document.querySelector(".indexcontent");
const examplespage = document.querySelector(".examplescontent");
const consequencespage = document.querySelector(".consequencescontent");
const whypage = document.querySelector(".whycontent");
//get DOM for all the navigation anchors for the pages
const homenav = document.getElementsByClassName("indexnav");
const examplesnav = document.getElementsByClassName("examplesnav");
const consequencesnav = document.getElementsByClassName("consequencesnav");
const whynav = document.getElementsByClassName("whynav");
//get DOM for the buttons to switch the pages
const indexbtn = document.querySelector("#indexbtn");
const examplesbtn = document.querySelector("#examplesbtn");
const consequencesbtn = document.querySelector("#consequencesbtn");
const whybtn = document.querySelector("#whybtn");

//array for all the quiz answers and options
const quizoptions = ["Astolfo", "Gold Ship", "Haru Urara", "Ereshkigal", "Tokai Teio", "Gilgamesh", "Ashiya Douman", "Sinclair", "Leonidas", "Yi Sang", "Vergil", "Dante"];
const imageids = ["astolfo", "goldshi", "haru", "eresh", "teio", "gil", "douman", "sinclair", "leonidas", "yisang", "vergil", "dante"];
var minoption = 0, maxoption=11;
//get DOM for the quiz answers area
const optioncontainer = document.querySelector("#minigameoptions");
//get DOM for the quiz image
const quizimg = document.querySelector("#gameqn");
//correct answer id
var currcorrectanswer = null;
//shows which option the correct answer is at
var correctanswerpos = null;
//timerintervalcontroller var to set and clear interval
var timerintervalcontroller;
//timer var for the html timer
const timer = document.querySelector("#timer");
//start game button
const startgame=document.querySelector("#gamestartbtn");
//bool for if the player is in game or not
var ingame = false;
//DOM for difficulty dropdown
const difficulty = document.querySelector("#difficulty");
//var for current game difficulty
var currdiff = null;
//var for score
var score = 0;
//const for score element
const scoreelement = document.querySelector("#score");
//sound effects
const explodsfx = new Audio('audio/boom.mp3');
const yippeesfx = new Audio('audio/yippee.mp3');
//get DOM for the history
const his = document.querySelector("#history");
//get DOM for nameinput
const nameinput=document.querySelector("#nameinput");


//borders for bouncing answers
const maxtop = 100;
const mintop = -350;
const maxleft = 60;
const minleft = -60;

//velocity
const speed=5;
//movement direction, i made an array so i could use it like a vector2 with 0 being x and 1 being y
var movedir = [0, 0];
//option coords
var optioncoords = [50,0];

function hideall(){
    //hide all the navigations and main contents
    homepage.style.display="none";
    examplespage.style.display="none";
    consequencespage.style.display="none";
    whypage.style.display="none";

    for (var i = 0; i<homenav.length; i++){
        homenav[i].style.display="none";
    }
    for (var i = 0; i<examplesnav.length; i++){
        examplesnav[i].style.display="none";
    }
    for (var i = 0; i<consequencesnav.length; i++){
        consequencesnav[i].style.display="none";
    }
    for (var i = 0; i<whynav.length; i++){
        whynav[i].style.display="none";
    }
}
//this part kind of the same as that practical, just hideall then display the ones that we need
indexbtn.addEventListener("click", function(){
    hideall();
    for (var i = 0; i<homenav.length; i++){
        homenav[i].style.display="block";
    }
    homepage.style.display="block";
});
examplesbtn.addEventListener("click", function(){
    hideall();
    examplespage.style.display="block";
    for (var i = 0; i<examplesnav.length; i++){
        examplesnav[i].style.display="block";
    }
});
consequencesbtn.addEventListener("click", function(){
    hideall();
    consequencespage.style.display="block";
    for (var i = 0; i<consequencesnav.length; i++){
        consequencesnav[i].style.display="block";
    }
});
whybtn.addEventListener("click", function(){
    hideall();
    whypage.style.display="block";
    for (var i = 0; i<whynav.length; i++){
        whynav[i].style.display="block";
    }
});
startgame.addEventListener("click", function(){
    //start game
    gamestart();
    
});

optioncontainer.addEventListener("click", function(event){
    if (ingame==true){
        if (event.target.innerHTML == quizoptions[currcorrectanswer]){
            //increase score by 5 to the power of the difficulty
            score+=Math.pow(5, currdiff);
            yippeesfx.play();
        }
        else{
            //decrease score by this formula
            score-=Math.pow(5, currdiff) - Math.pow(5, currdiff - 1);
            explodsfx.play();
        }
        //update score ui count
        scoreelement.innerHTML= "Score: "+score;
        generateoptions();
    }
    
});

//function random number generator
function rng(min, max){
    return Math.round(Math.random()*(max-min)+min);
}

//function to generate quiz options
function generateoptions(){
    //generate new random correct answer
    var correctanswer=rng(minoption, maxoption);
    //if there is a previous correct answer
    if (currcorrectanswer!=null){
        //remove previous sprite class
        quizimg.classList.remove(imageids[currcorrectanswer]);
    }
    //change the sprite for the image
    quizimg.classList.add(imageids[correctanswer]);
    //set the current correct answer to the new one
    currcorrectanswer=correctanswer;
    //reset all the options
    optioncontainer.innerHTML="";
    //randomise where the answer is at
    correctanswerpos = rng(0, 3);
    //array for tracking current option ids
    var curroptionids = [100,100,100,100];
    for (var i = 0; i<4; i++){
        //create new element
        var newoption=document.createElement('div');
        //add option class for styling with css
        newoption.classList.add("option");
        //if the correct answer is at this position
        if (i==correctanswerpos){
            //set it to the correct answer
            newoption.textContent=quizoptions[correctanswer];
        }
        else {
            //wrong option id variable here
            var wrongoptionid;
            //do a while loop to keep randomising
            while(true){
                //randomise wrong option id number
                wrongoptionid=rng(minoption, maxoption);
                //if it is the correct answer, reroll the random number
                if (wrongoptionid!=correctanswer){
                    //variable here as a bool to check if it matches with past options
                    var match = false;
                    //if its not the correct answer check with past options
                    for (var u = 0; u<i; u++){
                        //if it matches, match=true
                        if (curroptionids[u]==wrongoptionid){
                            match=true;
                        }
                    }
                    //break if match = false
                    if (match==false){
                        curroptionids[i]=wrongoptionid;
                        newoption.textContent=quizoptions[wrongoptionid];
                        break;
                    }
                }
            }
        }
        optioncontainer.appendChild(newoption);
    }
}
//game start function
function gamestart(){
    if (ingame==false){
        //player is in game
        ingame=true;
        //set timer to 60 seconds
        timer.innerHTML=30;
        //generate the first options
        generateoptions();
        //start the timer
        timerintervalcontroller=setInterval(function () {
            //every second timer -1
            timer.innerHTML -= 1;
            //when reaches 0
            if (timer.innerHTML==0){
                //stops game
                ingame=false;
                //clears interval
                clearInterval(timerintervalcontroller);
                //stops the image spinning gimmick
                quizimg.classList.remove("spin");
                
                var newwin=document.createElement('div');
                newwin.classList.add("history");
                newwin.textContent=nameinput.value + "-" + score;
                his.appendChild(newwin);
            }
        }, 1000);
        //reset and update score ui
        score=0;
        scoreelement.innerHTML= "Score: "+score;
        //get the difficulty the player chose
        currdiff=parseInt(difficulty.value);
        //medium difficult add spin
        if (currdiff > 1){
            quizimg.classList.add("spin");
        }
        if (currdiff > 2){
            //randomise the x and y velocities with custom formula because rng function only gives out integers
            movedir[0] = Math.random()*(2)-1;
            movedir[1] = Math.random()*(2)-1;   
            //start the animation
            requestAnimationFrame(moveoptions);
        }
        //reset the positions to default values
        optioncoords[0]=0;
        optioncoords[1]=50;
        //set the positions to the coords the +"px" is there so it becomes like 200px for example beccause it wouldnt take 200
        optioncontainer.style.left=optioncoords[0]+"px";
        optioncontainer.style.top=optioncoords[1]+"px";
    }
}

function moveoptions(){

    //get the speed * movement direction
    optioncoords[0]+=speed*movedir[0];
    optioncoords[1]+=speed*movedir[1];

    //collision checks
    if (optioncoords[0] > maxleft){
        movedir[0] *= -1;
        optioncoords[0]=maxleft;
    }
    if (optioncoords[0] < minleft){
        movedir[0] *= -1;
        optioncoords[0]=minleft;
    }
    if (optioncoords[1] > maxtop){
        movedir[1] *= -1;
        optioncoords[1]=maxtop;
    }
    if (optioncoords[1] < mintop){
        movedir[1] *= -1;
        optioncoords[1]=mintop;
    }
    //if not in game stop moving
    if (ingame==false){
        movedir[0]=0;
        movedir[1]=0;
    }
    else{
         //loop this function again
        requestAnimationFrame(moveoptions);
    }
    //set the positions to the coords the +"px" is there so it becomes like 200px for example beccause it wouldnt take 200
    optioncontainer.style.left=optioncoords[0]+"px";
    optioncontainer.style.top=optioncoords[1]+"px";
   
}
//hide all tabs
hideall();
//display the homepage stuff
for (var i = 0; i<homenav.length; i++){
    homenav[i].style.display="block";
}
homepage.style.display="block";
