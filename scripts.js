var moves = 0;
var toGuess = 0;
var solved = true;
var timer = -1;
var solution = [];

const loop1 = new Audio('./audio/loop2.mp3');
const end = new Audio('./audio/end.mp3');
const hint = new Audio('./audio/hint.mp3');
const click1 = new Audio('./audio/click1.mp3');
const click2 = new Audio('./audio/click2.mp3');
loop1.loop = true;

function newSeed(){
    document.getElementById('seed').value=Math.round(Math.random()*99999999999);
}

function checkSeed(){
    x=document.getElementById('seed').value.replace(/\D/g,'');
    if ( x == "" ){
        newSeed();
    }
}

function setToday(size,empty){
	let date = new Date();
	let seed = date.getFullYear() +""+ date.getMonth() +""+ date.getDate();
	document.getElementById('seed').value = seed;
    document.getElementById('size').value = size;
    document.getElementById('empty').value = empty;
	makeGrid();
}

var availableNumbers = [];

function makeGrid(seed,size,empty,tutorial) {
	if ( document.getElementById("music").checked ){
		loop1.play();
	}
	availableNumbers = []; // reset
	if ( document.getElementById("grid")){
		document.getElementById("gridSpace").removeChild(document.getElementById("grid"));
	}
    if (seed == undefined ) { 
		seed = document.getElementById('seed').value;
	}
	if (size == undefined ) {
    	var size = document.getElementById('size').value;
	}
	if (empty == undefined ) {
    	var empty = document.getElementById('empty').value;
	}
	document.getElementById("showSeed").innerHTML = "Puzzle #"+seed+"x"+size;
    var d = 0;
	moves = 0;
	solved = false;
	timer = -1;
	document.getElementById("gridSettings").style.display="none";
	document.getElementById("fadeOut").style.display="none";
	var useSequence = new Array();
	let useNums = [];
	for ( a = 0; a <=size*size; a++ ){
		if ( useNums.length == 0 ){
			useNums = [1,2,3,4,5,6,7,8,9];
		}
		let pR = ( parseInt(seed) + a )%useNums.length;
		useSequence.push(useNums[pR]);
		useNums.splice(pR,1);
	}	
    var removeCells = [];
    var toRemove = Math.round(size*size*(empty/100));
	toGuess = toRemove;
    var i = seed % (size*size);
    while ( toRemove > 0 ){
        var checkCell = i%(size*size);
        if ( !removeCells.includes(checkCell) ){
            removeCells.push(checkCell);
            toRemove--;
            i++;
			// toGuess++;   
        }
        i += parseInt(seed.charAt(d%seed.length));
        d++;
    }
    var placeEmpty = Math.ceil((45*size)/empty);
	var emptyCheck = 0;
	var runningTotal = seed%size;
	var cellVal = seed;
	// Initialize Variables
	var yCheck = 0;
	var dCheck = 0;
	var xCheck = new Array();
	for (x=0;x<size;x++)	{xCheck[x] = 0;}
	// Generate the Grid
	var gridHTML = document.createElement("table");
		gridHTML.classList.add ("grid","size-"+size);
		gridHTML.id = "grid";
		gridHTML.setAttribute("align","center");
    var c = 0;
	for (y=0;y<size;y++){
		var yCheck = 0;
		var thisRow = document.createElement("tr");
		cellVal += y;
		for (x=0;x<size;x++)
		{
			cellVal += x;
			cellVal += (size*size)-seed;
			var getChar = cellVal%(useSequence.length);
			useVal = useSequence[getChar];
            if ( typeof(useVal) == "undefined" ){ useVal = useSequence[0]; }
			useSequence.splice(getChar,1);
			runningTotal += useVal;
			xCheck[x] += useVal;
			var thisCell = document.createElement('td');
				thisCell.className = "gridCell";
            if ( removeCells.includes(c) ){
				availableNumbers.push(useVal);
				solution.push(useVal);
				var thisLink = document.createElement("div");
					thisLink.innerHTML = "0";
					thisLink.id = "cell_"+x+"-"+y;
					thisLink.setAttribute ("onclick","setCell(this);");
					thisCell.classList.add("dynamic");
				thisCell.appendChild(thisLink);
				emptyCheck++;
				runningTotal = 0;
			}
			else
			{
				thisCell.id = "cell_"+x+"-"+y;
				thisCell.innerHTML = useVal;
			}
			thisRow.appendChild(thisCell);
			yCheck += useVal;
			if (x==y)
			{
				dCheck += useVal;
			}
			var prev = useVal;
            c++;
		}
		thisCell = document.createElement("td");
			thisCell.className = "check";
			thisCell.id = "checkY"+y;
			thisCell.innerHTML = yCheck;
		thisRow.appendChild(thisCell);
		gridHTML.appendChild(thisRow);
	}
	thisRow = document.createElement("tr");
		thisRow.className = "checkRow";
	for (x=0;x<size;x++)
	{
		thisCell = document.createElement("td");
			thisCell.className = "check";
			thisCell.id = "checkX"+x;
			thisCell.innerHTML = xCheck[x];
		thisRow.appendChild(thisCell);
	}
	thisCell = document.createElement("td");
		thisCell.className = "check";
		thisCell.id = "checkD";
		thisCell.innerHTML = dCheck;
	thisRow.appendChild(thisCell);
	gridHTML.appendChild(thisRow);
	document.getElementById("gridSpace").appendChild(gridHTML);
	if ( tutorial == true ){
		document.getElementById('feedback').innerHTML = "Lines and columns with a green tile at the end correctly add up. "+
		"Those with red tiles do not.  "+
		"Your job is to swap the black tiles so that all lines and columns add up to the number at the end.<br/><br/>"+
		"The tiles 4 and 2 are in the wrong place.  "+
		"Click the 4 and then the 2 to swap them.";
	}
	whatsLeft();
}

function newElement(tagName,useClass,useId,content){
	if ( tagName == null ){ console.log("Missing tag name."); return; }
	var newElement = document.createElement(tagName);
		if ( useClass != null ){
			newElement.className = useClass;
		}
		if ( useId != null ){
			newElement.id = useId;
		}
		if ( content != null ){
			newElement.innerHTML = content;
		}
	return newElement;
}

function shuffleArray(array) {
	if ( array.length == 2 ){
		return array.reverse();
	}
	let output = [];
	var seed = document.getElementById('seed').value;
    for (let i = array.length - 1; i >= 0; i--) {
		while ( array[i] == array[seed%array.length-1] ){
			seed++
		}
		output.push(array[seed%array.length])
		array.splice(seed%array.length,1);
    }
	return output;
}

function whatsLeft(){
	availableNumbers = shuffleArray(availableNumbers);
	var grid = document.getElementById("grid");
	var rows = grid.getElementsByTagName("tr");
	for (y=0;y<rows.length-1;y++){
		var col = rows[y].getElementsByTagName("td");
		for ( x=0;x<col.length-1;x++){
			if ( col[x].classList.contains("dynamic") ){
				col[x].getElementsByTagName("div")[0].innerHTML = availableNumbers[0];
				availableNumbers.splice(0,1);
			}
		}

		
	}


	
	for ( var i = 1; i <= 9; i++ ){
		let count = availableNumbers.filter( x => x === i ).length;
		try {
			document.getElementById("guess"+i).getElementsByTagName("span")[0].innerHTML = count;
			if ( count == 0 ){
				document.getElementById("guess"+i).removeAttribute("onclick");
				document.getElementById("guess"+i).parentElement.className = "disabled";
			}
			else {
				document.getElementById("guess"+i).setAttribute("onclick","setCell(this);");
				document.getElementById("guess"+i).parentElement.className = "";
			}
		}
		catch (e) {
			//console.log(e);
		}
	}
	checkGrid();
}

function setCell_disabled(v) {	
    const thisX = document.getElementById("currentX").value;
    const thisY = document.getElementById("currentY").value;
    const cell = document.getElementById(`cell_${thisX}-${thisY}`);
    const oldValue = cell.innerHTML;

    if (oldValue != 0) {
        availableNumbers.push(parseFloat(oldValue));
        console.log(oldValue, availableNumbers);
    } else {
        const index = availableNumbers.indexOf(v);
        if (index > -1) {
            availableNumbers.splice(index, 1);
        }
        moves++;
    }

    cell.innerHTML = v;
    checkGrid();
    document.getElementById("movesHere").innerHTML = `${moves} guesses / ${toGuess} cells`;
}

let previousElement = null;

function setCell(element) {
    if (solved) {
        console.log("solved");
        return;
    }

    if (previousElement) {
        if (document.getElementById("effects").checked) {
            click2.play();
        }

        const oldNum = previousElement.innerHTML.match('[1-9]')[0];
        const newNum = element.innerHTML.match('[1-9]')[0];

        previousElement.innerHTML = newNum;
        element.innerHTML = oldNum;
        element.classList.add("set");
        element.parentNode.classList.add("dynamic");
        previousElement.parentNode.classList.add("dynamic");
        previousElement = null;
        checkGrid();
        moves++;
    } else {
        if (document.getElementById("effects").checked) {
            click1.play();
        }
        element.parentNode.classList.add("active");
        previousElement = element;
    }
}

function checkGrid()
{
	var checksOut = true;
	var hasZeros = false;  // POSSIBLE TO SOLVE WITH ZEROS PRESENT - NEED TO FIX THIS!!!
	var gridCheck = document.getElementById("grid");
	var checkSize = parseFloat(gridCheck.getElementsByTagName("tr").length);
	for (y=0;y<(checkSize-1);y++)
	{
		var checkX = 0;
		for (x=0;x<(checkSize-1);x++){
			var thisVal = parseFloat(document.getElementById("cell_"+x+"-"+y).innerHTML);
			checkX = checkX + thisVal;
		}
		if (checkX!=parseFloat(document.getElementById("checkY"+y).innerHTML)) {
			document.getElementById("checkY"+y).className = "check bad";
			checksOut = false;
		}
		else {
			document.getElementById("checkY"+y).className = "check good";
		}
	}

	for (x2=0;x2<(checkSize-1);x2++)
	{
		var checkY = 0;
		for (y2=0;y2<(checkSize-1);y2++) {
			var thisVal = parseFloat(document.getElementById("cell_"+x2+"-"+y2).innerHTML);
			checkY = checkY + thisVal;
		}
		if (checkY!=parseFloat(document.getElementById("checkX"+x2).innerHTML)) {
			document.getElementById("checkX"+x2).className = "check bad";
			checksOut = false;
		}
		else {
			document.getElementById("checkX"+x2).className = "check good";
		}
	}

	var checkZ = 0;
	for (z=0;z<(checkSize-1);z++){
		var thisVal = parseFloat(document.getElementById("cell_"+z+"-"+z).innerHTML);
		checkZ = checkZ + thisVal;
	}
	if (checkZ!=parseFloat(document.getElementById("checkD").innerHTML)) {
		document.getElementById("checkD").className = "check bad";
		checksOut = false;
	}
	else {
		document.getElementById("checkD").className = "check good";
	}
	if (checksOut===true) {
		congratulate();
	}
}
function newGrid() {
	document.getElementById("gridSettings").style.display="block";
	document.getElementById("fadeOut").style.display="block";
	document.getElementById("feedback").innerHTML="";
}
function congratulate() {
	document.getElementById("feedback").innerHTML = "You solved the grid!";
	if ( document.getElementById("effects").checked ){
		end.play();
	}

    for ( var i=0;  i<document.getElementsByClassName("gridCell dynamic").length; i++){
        document.getElementsByClassName("gridCell dynamic")[i].className += " solved";
	} 
	solved = true;
}
function showLevels(x) {
	document.getElementById("easy").style.display = "none";
	document.getElementById("medium").style.display = "none";
	document.getElementById("hard").style.display = "none";
	document.getElementById(x).style.display = "block";

	document.getElementById("link_easy").style.fontWeight = "normal";
	document.getElementById("link_medium").style.fontWeight = "normal";
	document.getElementById("link_hard").style.fontWeight = "normal";
	document.getElementById("link_"+x).style.fontWeight = "bold";

	document.getElementById("link_easy").style.backgroundColor = "#666";
	document.getElementById("link_medium").style.backgroundColor = "#666";
	document.getElementById("link_hard").style.backgroundColor = "#666";
	document.getElementById("link_"+x).style.backgroundColor = "green";

}

function showTimer() {
	if (solved == false)
	{
		timer++;
		var hours = "0"+Math.floor(timer/3600);
		var minutes = "0"+Math.floor((timer-(hours*3600))/60);
		var seconds = "0"+Math.floor(timer-(hours*3600)-(minutes*60));
		document.getElementById("timeHere").innerHTML = hours.slice(-2)+":"+minutes.slice(-2)+":"+seconds.slice(-2);
	}
	var t = setTimeout(function(){showTimer();},1000);
}

function init(){
    newSeed();
	loadLevel();
	let date = new Date();
	document.getElementById('todaysDate').innerHTML = date.getFullYear() +"-"+ date.getMonth() +"-"+ date.getDate();

}

function setVolume(){
	var volume = document.getElementById("volume").value;
	loop1.volume = volume;
}

function toggleMusic(){
	if ( document.getElementById("music").checked ){
		loop1.play();
	}
	else {
		loop1.pause();
	}
}

function toggleAudioSettings(){
	if ( document.getElementById("audioSettings").style.display == "block" ){
		document.getElementById("audioSettings").style.display = "none";
	}
	else {
		document.getElementById("audioSettings").style.display = "block";
	}
}

function playCurrent(){
	let n = document.getElementById('level').value;
	let seed = (12345*n)%9999999999999;
	let size = 6;
	if ( n >= 50 ){
		size = 7;
	}
	else if ( n >= 100 ){
		size = 8;
	}
	let e = 25;
	if ( n >=75 ){
		e = 30;
	}
	else if ( n >= 100 ){
		e = 35;
	}
	document.getElementById('seed').value = seed;
    document.getElementById('size').value = size;
    document.getElementById('empty').value = e;
	makeGrid();
	


}

function showHint(){
	let swap1 = -1;
	let swap2 = -1;
	let playable = document.getElementsByClassName("dynamic");

	for (let i = 0; i<playable.length; i++){
		let thisCell = playable[i].getElementsByTagName("div")[0];
		let thisNum = thisCell.innerHTML;
		if ( parseInt(thisNum) !== parseInt(solution[i]) && swap1 == -1 ){
			thisCell.parentElement.classList += " hint";
			swap1 = thisNum;
			swap2 = solution[i];
		}
		else if ( parseInt(thisNum) === parseInt(swap2) ){
			thisCell.parentElement.classList += " hint";
			if ( document.getElementById("effects").checked ){
				hint.play();
			}
			console.log(swap1,swap2);
			return;
		}
	}
}

function saveLevel(){
	document.cookie = "level=" + document.getElementById("level").value + "; SameSite=Strict";
}

function loadLevel(){
	let level = document.cookie.match(/level=(\d+)/);
	if ( level != null ){
		document.getElementById("level").value = level[1];
	}
}