/* Constants*/
const armorSlot = {
    Head:"s1",
    Neck:"s2",
    Shoulder:"s3",
    Back:"s4",
    Chest:"s5",
    Shirt:"s6",
    Tabard:"s7",
    Wrist:"s8",
    Hands:"s9",
    Waist:"s10",
    Legs:"s11",
    Feet:"s12",
    Finger:"s13",
    Trinket:"s14",
    HeldInOffHand:"s15",
    Relic:"s16"
    }
const armorType = {
    Cloth:"a1",
    Leather:"a2",
    Mail:"a3",
    Plate:"a4"
    }
const weaponSlot = {
    Onehand:"h1",
    Twohand:"h2",
    MainHand:"h3",
    OffHand:"h4"
    }
const weaponType = {
    Axe:"w1",
    Bow:"w2",
    Crossbow:"w3",
    Dagger:"w4",
    Gun:"w5",
    Mace:"w6",
    Polearm:"w7",
    Shield:"w8",
    Staff:"w9",
    Sword:"w10",
    Thrown:"w11",
    Wand:"w12",
    FistWeapon:"w13",
    FishingPole:"w14",
    Totem:"Totem",
    Idol:"Idol",
    Libram:"Libram"
    }
/* variables */
//exception case tracker
var noSlot          = false;
var noType          = false;
var noEquip         = false;
//final item string info (for atlas loot usage)
var itemString      = null;
//item data
var itemId          = null;
var itemIcon        = null;
var itemQuality     = null;
var itemName        = null;
var itemSlot        = null;
var itemType        = null;
var itemDroprate    = null;
//tooltip
var itemTooltip     = null;

/*  functions */
//get the item tooltip info
function getItemTooltip(){ itemTooltip = document.getElementsByClassName("tooltip")[0]; }
//check the droprate
function getItemDroprate(){
    //get the loot table
    var lootTables      = document.querySelectorAll("table");
    var lootTable       = lootTables[(lootTables.length-1)];
    try {
        itemDroprate        = lootTable.rows.item(1).cells.item(5).innerHTML;
    } catch {}
}
function allDataExists() {
    if (itemTooltip === undefined) {
        return false
    } else if (itemDroprate === null) {
        return false
    }
    return true
}
//convert item info into atlasloot shorthand
function convertItemSlotType(index, arrayItemSlotType) {
    let itemInfo = arrayItemSlotType[index].replace(/ /g,"").replace(/-/g,"");
    if (index == 0) {
        let infoWeapon = weaponSlot[itemInfo];
        let infoSlot = armorSlot[itemInfo];
        if (infoWeapon !== undefined){
            return infoWeapon;
        } else if (infoSlot !== undefined){
            return infoSlot;
        }
        return null;
    } else if (index == 1) {
        let infoWeapon = weaponType[itemInfo];
        let infoSlot = armorType[itemInfo];
        if (infoWeapon !== undefined){
            return infoWeapon;
        } else if (infoSlot !== undefined){
            return infoSlot;
        }
        return null;
    }
}
//debug print item values
function consoleLog() {
    console.log("Id: "+itemId);
    console.log("Icon: "+itemIcon);
    console.log("Quality: "+itemQuality);
    console.log("Name: "+itemName);
    console.log("Slot: "+itemSlot);
    console.log("Type: "+itemType);
    console.log("Droprate: "+itemDroprate);
}
function getItemData() {
    var itemSlotType    = itemTooltip.querySelectorAll("table")[2].innerText.split("\t");
    itemId          = document.URL.match(/(\d*)$/)[0];
    itemIcon        = document.getElementsByClassName("iconlarge")[0].style.backgroundImage.toString().match(/(?:large\/)(.*)(?:.png)/)[1];
    itemQuality     = itemTooltip.outerHTML.match("(?:<b class=\"q)(\\d)")[1];
    itemName        = itemTooltip.querySelectorAll("table")[1].rows.item(0).cells.item(0).firstChild.innerText;
    itemSlot        = convertItemSlotType(0,itemSlotType);
    itemType        = convertItemSlotType(1,itemSlotType);
}
//flag variables if the item is an exception
function checkForExceptions(){
    if (itemSlot === null && itemType === null) {
        noEquip = true;
        return;
    }
    switch (itemSlot) {
    case "s2"://neck
    case "s4"://back
    case "s6"://shirt
    case "s7"://tabard
    case "s13"://finger
    case "s14"://trinket
    case "s15"://held in off hand
        noType = true;
        break;
    default:
        break;
    }
    switch (itemType) {
    case "w2"://bow
    case "w3"://crossbow
    case "w5"://gun
    case "w7"://polearm
    case "w8"://shield
    case "w9"://staff
    case "w11"://thrown
    case "w12"://wand
        noSlot = true;
        break;
    default:
        break;
    }
}
function handleRelic() {
    if (itemType == "Libram") {
        return ("\"=ds=#s16#, #e18# =q16=#c4#\"");
    } else if (itemType == "Idol") {
        return ("\"=ds=#s16#, #e16# =q13=#c1#\"");
    } else if (itemType == "Totem") {
        return ("\"=ds=#s16#, #e17# =q15=#c7#\"");
    } else {
        throw "Item is a relic, but not detected as Libram, Idol or Totem.";
        return ""
    }
}
//create the final item info string
function createItemString() {
    getItemData();
    checkForExceptions();
    let itemInfo = null;
    if (noEquip) {
        itemInfo = "\"\"";
    } else if (itemSlot == "s16") {
        itemInfo = handleRelic();
    } else if (noType) {
        itemInfo = ("\"=ds=#"+itemSlot+"#\"");
    } else if (noSlot) {
        itemInfo = ("\"=ds=#"+itemType+"#\"");
    //normal items
    } else {
        itemInfo = ("\"=ds=#"+itemSlot+"#, #"+itemType+"#\"");
    }
    itemString = ("\t\t{ "+itemId+", \""+itemIcon+"\", \"=q"+itemQuality+"="+itemName+"\", "+itemInfo+", \""+itemDroprate+"%\" },");
}
//copy string to clipboard
//function copyToClipboard(text) { window.prompt("Copy to clipboard: Ctrl+C, Enter", text);}
function copyToClipboard(text) { navigator.clipboard.writeText(text);}
//create the html
function createButton() {
    let newSpan         = document.createElement('span');
    let newI            = document.createElement('i');
    let newBq           = document.createElement('blockquote');
    let newDiv          = document.createElement('div');
    let newA            = document.createElement('a');
    //let newSpann        = document.createElement('span');
    newSpan.innerHTML   = "Copy Atlas Info";
    newI.innerHTML      = "Copy Atlas Info";
    newBq.appendChild(newI);
    newDiv.appendChild(newBq);
    newDiv.appendChild(newSpan);
    newA.appendChild(newDiv);
    newA.onclick        = function(){
        copyToClipboard(itemString);
    }
    newA.className      = "button-red";
    //newSpann.appendChild(newA);
    //newSpann.className  = "menu-buttons";
    let doc = document.getElementsByClassName("text");
    doc[0].insertBefore(newA,null);
}

getItemTooltip();
getItemDroprate()
if (allDataExists()) {
    createItemString();
    createButton();
    document.getElementsByTagName("h2")[0].innerText = "See also - "+itemString;
    //consoleLog();
}