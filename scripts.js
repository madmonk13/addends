var moves = 0;
var toGuess = 0;
var solved = true;
var timer = -1;

function newSeed(){
    document.getElementById('seed').value=Math.round(Math.random()*99999999999);
}

function checkSeed(){
    x=document.getElementById('seed').value.replace(/\D/g,'');
    console.log(x);
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
function makeGrid() {
	availableNumbers = []; // reset
	if ( document.getElementById("grid")){
		document.getElementById("gridSpace").removeChild(document.getElementById("grid"));
	}
    var seed = document.getElementById('seed').value;
    var size = document.getElementById('size').value;
    var empty = document.getElementById('empty').value;
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
	var missingTemp = (parseInt((size*size)*(empty*.01)));
	var missing = parseInt((size*size)/missingTemp);
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
	checkGrid();
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
	checkGrid();
}


function guessBoard(x,y) {
	return;
	// whatsLeft();
	// console.log(availableNumbers);
	// document.getElementById("currentX").value=x;
	// document.getElementById("currentY").value=y;
	// document.getElementById("guessBoard").style.display = "block";
	// document.getElementById("guessBoard").style.left = mouseX+"px";
	// document.getElementById("guessBoard").style.top = mouseY+"px";
}

function setCell_disabled(v) {
	var thisX = document.getElementById("currentX").value;
	var thisY = document.getElementById("currentY").value;
	let oldValue = document.getElementById('cell_'+thisX+'-'+thisY).innerHTML;
	if ( oldValue != 0 ){
		availableNumbers.push(parseFloat(oldValue));
		console.log(oldValue,availableNumbers);
	}
	else {
		availableNumbers.splice(availableNumbers.indexOf(v),1);
		moves++;
	}
	document.getElementById('cell_'+thisX+'-'+thisY).innerHTML = v;
	document.getElementById("guessBoard").style.display = "none";
	checkGrid();
	document.getElementById("movesHere").innerHTML = moves+" guesses / "+toGuess + " cells";
}

var previousElement = null;
function setCell(element){
	// console.log(element,previousElement);

	// you've won, it's time to stop.
	if ( solved === true ){
		console.log("solved")
		return;
	}
	
	if ( previousElement != null ){

		let oldNum = previousElement.innerHTML.match('[1-9]')[0];
		let newNum = element.innerHTML.match('[1-9]')[0];

		previousElement.innerHTML = newNum;
		element.innerHTML = oldNum;
		element.classList += " set";
		previousElement.parentNode.className = "gridCell dynamic";
		previousElement = null;
		checkGrid();

		moves++;

		return;

	}
	else {
		// console.log(element);
		element.parentNode.classList += " active";
		previousElement = element;
	}


	return;
}



function closeGuess(){
	document.getElementById("guessBoard").style.display = "none";
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
		solved = true;
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
    for ( var i in document.getElementsByClassName("gridCell dynamic")){
        setTimeout(document.getElementsByClassName("gridCell dynamic")[i].className += " solved",1000);
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
}

