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
var isBag           = false;
var isTrade         = false;
var isMisc          = false;
var isQuest         = false;
var isKey           = false;
var hasRandomStats  = false;
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
var hasDroprate     = null;

/*  functions */
//get the item tooltip info
function getItemTooltip(){ itemTooltip = document.getElementsByClassName("tooltip")[0]; }
//check the droprate
function getItemDroprate(){
    //get the loot table
    try {
        let activeTabName       = document.getElementsByClassName("tabs")[0].getElementsByClassName("selected")[0].hash.slice(1);
        let lootTable           = document.getElementById("tab-"+activeTabName).querySelectorAll("table")[0];
        let lootTableFirstRow   = lootTable.rows.item(0).cells;
        let lastColumnIndex     = lootTableFirstRow.length-1;
        let cellPercent         = lootTableFirstRow.item(lastColumnIndex).innerText;
        if (cellPercent == "%") {
            hasDroprate = true;
            itemDroprate = lootTable.rows.item(1).cells.item(lastColumnIndex).innerText;
        } else {
            hasDroprate = false;
        }
    } catch {
        hasDroprate = false;
        throw("Couldn't detect a droprate")
    }
}
function allDataExists() {
    if (itemTooltip === undefined) {
        return false
    }
    return true
}
//convert item info into atlasloot shorthand
function convertItemSlotType(index, arrayItemSlotType) {
    let itemInfo = null;
    try {
        itemInfo = arrayItemSlotType[index].replace(/ /g,"").replace(/-/g,"");
    } catch {
        return null
    }
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
//get the raw item data
function getItemDataEquip() {
    let itemSlotType    = itemTooltip.querySelectorAll("table")[2].innerText.split("\t");

    getItemDataLight();

    itemSlot            = convertItemSlotType(0,itemSlotType);
    itemType            = convertItemSlotType(1,itemSlotType);
    hasRandomStats      = itemTooltip.innerHTML.includes("Random Bonus");
    debugger;
}
function getItemDataLight() {
    itemId              = document.URL.match(/(\d+)/)[0];
    itemIcon            = document.getElementsByClassName("iconlarge")[0].style.backgroundImage.toString().match(/(?:large\/)(.*)(?:.png)/)[1];
    itemQuality         = itemTooltip.outerHTML.match("(?:<b class=\"q)(\\d)")[1];
    itemName            = itemTooltip.querySelectorAll("table")[1].rows.item(0).cells.item(0).firstChild.innerText;
}
//figure out what type of item we are looking at and get the data of the item
function getItemTypeData(){
    let preContent = document.getElementById("main-precontents").innerHTML;
    if (preContent.includes("Weapons")) {
        getItemDataEquip();
        checkForExceptions();
    } else if (preContent.includes("Armor")) {
        getItemDataEquip();
        checkForExceptions();
    } else if (preContent.includes("Containers")) {
        isBag = true;
        getItemDataLight();
    }  else if (preContent.includes("Consumables")) {

    } else if (preContent.includes("Trade Goods")) {
        isTrade = true;
        getItemDataLight();
    } else if (preContent.includes("Projectiles")) {

    } else if (preContent.includes("Quivers")) {

    } else if (preContent.includes("Recipes")) {

    } else if (preContent.includes("Miscellaneous")) {
        isMisc = true;
        getItemDataLight();
    } else if (preContent.includes("Quest")) {
        isQuest = true;
        getItemDataLight();
    } else if (preContent.includes("Keys")) {
        isKey = true;
        getItemDataLight();
    } else {
        throw "unknown item type";
    }
    createItemString();
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
    let itemInfoBonus = "";
    if (hasRandomStats) {
        itemInfoBonus = " =q2=#e31#";
    }
    let itemInfo = null;
    if (noEquip) {
        itemInfo = "\"\"";
    } else if (itemSlot == "s16") {
        itemInfo = handleRelic();
    } else if (noType) {
        itemInfo = ("\"=ds=#" + itemSlot + "#\"");
    } else if (noSlot) {
        itemInfo = ("\"=ds=#" + itemType + "#\"");
    } else if (isBag) {
        itemInfo = ("\"=ds=#e10#\"");
    } else if (isMisc) {
        // e27 is "Token", add more use cases when needed
        itemInfo = ("\"=ds=#e27#\"");
    } else if (isQuest) {
        //m2, "This Item Begins a Quest"; m3, "Quest Item"
        itemInfo = ("\"=ds=#m3#\"");
    } else if (isKey) {
        //e14, "Key"
        itemInfo = ("\"=ds=#e14#\"");
    } else if (isTrade) {
        //m31, "Reagent"
        itemInfo = ("\"=ds=#m31#\"");
    //normal items
    } else {
        itemInfo = ("\"=ds=#" + itemSlot + "#, #" + itemType + "#"+itemInfoBonus+"\"");
    }
    if (hasDroprate) {
        itemDroprate =  ", \""+itemDroprate+"%\"";
    } else {
        itemDroprate = "";
    }
    itemString = ("{ " + itemId+ ", \"" + itemIcon + "\", \"=q" + itemQuality + "=" + itemName + "\", " + itemInfo + itemDroprate + "},");
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
//all in one call for item handling
function queryItemInfo() {
    getItemTooltip();
    getItemDroprate();
    if (allDataExists()) {
        getItemTypeData();
        document.getElementsByTagName("h2")[0].innerText = "See also - "+itemString;
    }
}

if (window.history) {
    window.addEventListener('hashchange', function(){
        queryItemInfo();
    });
}
queryItemInfo();
createButton();