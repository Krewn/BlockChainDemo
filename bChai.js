console.log("bChai")

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

var block = class{
	constructor(payload, previousHash, difficulty) {
		this.payload = payload;
		this.nonce = 0;
		var payloadHash = sjcl.codec.hex.fromBits(
			sjcl.hash.sha256.hash(payload));
		var blockLinkHash = sjcl.codec.hex.fromBits(
			sjcl.hash.sha256.hash(payloadHash+previousHash));
		this.strHash = sjcl.codec.hex.fromBits(
			sjcl.hash.sha256.hash(blockLinkHash+this.nonce.toString()));
		var dispDiv = document.getElementById("disp");
		this.displayBlock(dispDiv);
		while(parseInt(this.strHash, 16) > difficulty){
			this.nonce += 1;
			this.strHash = sjcl.codec.hex.fromBits(
			sjcl.hash.sha256.hash(blockLinkHash+this.nonce.toString()));
			this.clearBlock(dispDiv);
			this.displayBlock(dispDiv);
		}
		// Todo generate nonce
		this.nextBlock = null;
		this.difficulty = difficulty
	}
	
	headDisplay(){
		var dispDiv = document.getElementById("disp");
		while (dispDiv.firstChild) {
			dispDiv.removeChild(dispDiv.firstChild);
		}
		this.displayBlock(dispDiv);
	}
	
	displayHash(h){
		var parts = h.match(/.{1,4}/g);
		var container = document.createElement("tbody");
		for(var k = 0; k < 4; k++){
			var aTr = document.createElement("tr");
			for(var k2 = 0; k2 < 4 ; k2++){
				var aTd = document.createElement("td");
				aTd.innerHTML = parts[4*k+k2];
				aTr.appendChild(aTd);
			}
			container.appendChild(aTr);
		}
		return(container);
	}
	
	clearBlock(dispDiv){
		dispDiv.removeChild(dispDiv.lastChild);
	}
	
	displayBlock(dispDiv){
		var container = document.createElement("div");
		container.className = "blockDiv";
		var text1 = document.createTextNode("Payload:"+this.payload);
		var text2 = document.createTextNode("Nonce:"+this.nonce);
		var table = document.createElement("table");
		table.appendChild(this.displayHash(this.strHash));
		container.appendChild(text1);
		container.appendChild(document.createElement("br"));
		container.appendChild(text2);
		container.appendChild(table);
		dispDiv.appendChild(container);
	}
	
	setNext(b){
		this.nextBlock = b;
	}
	
	appendBlock(payload){
		b = new block(payload,this.strHash,this.difficulty);
		this.setNext(b);
		return(b);
	}
}

let headBlock = new block('','');
let currentBlock = headBlock;
document.getElementById("dif").value = "0";

function getHashTime(){
	t0 = performance.now();
	sjcl.codec.hex.fromBits(
			sjcl.hash.sha256.hash(payload));
	t1 = performance.now();
	return(
		((t1-t0)* // time to hash once
		(2**(parseInt(document.getElementById("dif").value)))) // expected Value for nonce
		.toString().split(".")[0]);
}

function updateSlider(){
	bt = document.getElementById("blockTime");
	bt.innerHTML = getHashTime().toString();
}
document.getElementById("dif").onchange =  updateSlider;

function newChain(){
	var difficulty = 2**(256-parseInt(document.getElementById("dif").value));
	bt = document.getElementById("blockTime");
	bt.innerHTML = getHashTime().toString();
	headBlock = new block("", "", difficulty);
	currentBlock = headBlock;
	headBlock.headDisplay();
}
document.getElementById("newChain").onclick = newChain;

document.getElementById("newBlock").onclick = function newBlock(){
	var pl = document.getElementById("payload").value;
	var hash = currentBlock.strHash;
	var nb = new block(pl,hash,currentBlock.difficulty);
	currentBlock.setNext(nb);
	currentBlock=nb;
	//nb.displayBlock(document.getElementById("disp"));
}

newChain();


