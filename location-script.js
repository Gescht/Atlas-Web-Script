/*todo


*/

/* variables */
//final npc string info (for final addon usage)
var npcString       = null;
//npc data
var npcMap          = null;
var npcName         = null;
var npcId           = null;
var npcLevel        = null;
var npcCreatureType = null;
var npcElite        = null;
var npcLocations    = null;

/*  functions */
//get npc name
function getNpcName(){
    return document.getElementById("main-contents").getElementsByTagName('h1')[0].innerText;
}
function getNpcId(){
    return document.URL.match("(\\d+)")[0];
}
function getNpcLevel(){
    return document.getElementById("infobox-contents0").getElementsByTagName('div')[0].innerText.match("(\\d+)")[0];
}
function getNpcCreatureType(){
    return document.getElementById("main-precontents").getElementsByTagName('span')[2].innerText.replace(/s$/,"");
}
function getNpcElite(){
    return /Elite/.test(document.getElementById("infobox-contents0").getElementsByTagName('div')[1].innerText);
}
function getNpcLocations(){
    let nodes = document.getElementById("mapper-generic").children[0].children[2].children;
    const data = [];
    for (var i=0, max=nodes.length; i < max; i++) {
        let left = nodes[i].style.left.replace(/\./,"").replace(/%/,"");
        do {
            left = left + "0"
        } while (left.length < 4)
        let top = nodes[i].style.top.replace(/\./,"").replace(/%/,"");
        do {
            top = top + "0"
        } while (top.length < 4)
        data[i] = left + top ;
    }
    return data
}
//create the final npc info string
function createNpcString() {
    let npcInfo = "\t\t\t[\""              + npcName         + "\"] = {";
    npcInfo = npcInfo + "id="              + npcId           + ",";
    npcInfo = npcInfo + "level="           + npcLevel        + ",";
    npcInfo = npcInfo + "creature_type=\"" + npcCreatureType + "\",";
    if (npcElite) {
        npcInfo = npcInfo + "elite=true,";
    }
    npcInfo = npcInfo + "locations = {"
    for (var i=0, max=npcLocations.length; i < max; i++) {
        if (!(npcLocations[i].includes("px"))) {
            npcInfo = npcInfo + npcLocations[i] + ",";
        }
    }
    npcInfo = npcInfo + "},},";
    return npcInfo
}


//copy string to clipboard
//function copyToClipboard(text) { window.prompt("Copy to clipboard: Ctrl+C, Enter", text);}
function copyToClipboard(text) { navigator.clipboard.writeText(text);}
//create the html
function createButton() {
    let newSpan         = document.createElement('span');
    let newI            = document.createElement('i');
    let newB           = document.createElement('b');
    let newEm          = document.createElement('em');
    let newA            = document.createElement('a');
    //let newSpann        = document.createElement('span');
    newSpan.innerHTML   = "Copy NPC Info";
    newI.innerHTML      = "Copy NPC Info";
    newB.appendChild(newI);
    newEm.appendChild(newB);
    newEm.appendChild(newSpan);
    newA.appendChild(newEm);
    newA.onclick        = function(){
        copyToClipboard(npcString);
    }
    newA.className      = "button-red";
    //newSpann.appendChild(newA);
    //newSpann.className  = "menu-buttons";
    let doc = document.getElementsByClassName("text");
    doc[0].insertBefore(newA,null);
}
//all in one call for npc handling
function queryNpcInfo() {
    //getNpcMap();
    npcName         = getNpcName();
    npcId           = getNpcId();
    npcLevel        = getNpcLevel();
    npcCreatureType = getNpcCreatureType();
    npcElite        = getNpcElite();
    npcLocations    = getNpcLocations();

    npcString       = createNpcString();
    document.getElementsByTagName("h2")[0].innerText = "Related"+" "+npcString;
}

if (window.history) {
    window.addEventListener('hashchange', function(){
        queryNpcInfo();
    });
}
queryNpcInfo();
createButton();