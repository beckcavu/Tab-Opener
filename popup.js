$(document).ready(function () {
//MAIN
var doneBtn = document.getElementById('done');
doneBtn.style.visibility = "hidden";
doneBtn.addEventListener('click', removeBtns, false);


var CreateMacro = document.getElementById('CreateMacro');
CreateMacro.addEventListener('click', macroCreator, false);

var RemoveMacro = document.getElementById('RemoveMacro');
RemoveMacro.addEventListener('click', macroRemover, false);
//create all stored buttons
chrome.storage.sync.get('btn', (result) => {
    btnFactory(result['btn']);
})

chrome.storage.sync.get(null, (result) => {
  console.log(result);
})
console.log("Hi! If you are here that means you are interested in how the extension works.\nTo see, Unlock the Links between The Past, The Present, and The Future.\nThat will be a good start. Oh, and that Object down there might help.")
})

//GLOBALS
var inRemoveMode = false;

//macroCreator - called on click #CreateMacro
function macroCreator() {
        clearDiv('buttongroup')
        this.style.visibility = "hidden";
        var RemoveMacro = document.getElementById('RemoveMacro');
        RemoveMacro.style.visibility = "hidden";
        var linklist = document.getElementById('linklist');
        var form = document.createElement("form");
        form.className = "ui form"
        form.id = "form"
        linklist.appendChild(form);

        var header = document.createElement("LABEL"); //label header for  text input fields
        header.innerHTML = "Name";
        header.for = "nameMacro";
        header.id = "name";
        header.className = "ui header";
        form.appendChild(header);

        var nameIn = document.createElement("input"); //input field for name of macro
        nameIn.id = "nameIn";
        nameIn.className = "ui input";
        nameIn.type = "text";
        form.appendChild(nameIn);

        var title = document.createElement("LABEL"); //label for  text input fields
        title.innerHTML = "Links";
        title.for = "linksMacro";
        title.id = "linksMacro";
        title.className = "ui header";
        form.appendChild(title);
        var link = document.createElement("input"); //first link field
        link.id = "link1";
        link.className = "ui input link";
        link.type = "text";
        form.appendChild(link);
        
        var creator = document.getElementById('creatorbuttons');
        var plusBtn = document.createElement("BUTTON"); // btn to add a link field
        plusBtn.id = "plusBtn";
        plusBtn.className = "ui small left floated circular yellow button";
        plusBtn.innerHTML = '<i class="plus square outline icon"></i> Add Link';
        plusBtn.style.marginBottom = "2%";
        plusBtn.addEventListener('click', addLinkField, false);
        creator.appendChild(plusBtn);

        var btn = document.createElement("BUTTON"); // submit button
        btn.innerHTML = "Submit";
        btn.id = "submit";
        btn.className = "fluid medium positive ui button";
        btn.addEventListener('click', submitted,false);
        creator.appendChild(btn);

        var cancel = document.createElement('BUTTON');
        cancel.innerHTML = '<i class="times icon"></i> Cancel';
        cancel.className = "fluid medium negative ui button";
        cancel.style.marginTop = "2%";
        cancel.addEventListener('click', CancelCreator, false);
        creator.appendChild(cancel);
        
    }
//submitted - called on click #submit
var $$AY$LV = "Unlock" // needed for old chromes
function submitted() {
    var RemoveMacro = document.getElementById('RemoveMacro');
    RemoveMacro.style.visibility = "visible";
    var CreateMacro = document.getElementById("CreateMacro");
    CreateMacro.style.visibility = "visible";
    var inputs = document.getElementsByClassName('link'); // get list of inputted links
    var links = [];
    for (var i = 0; i < inputs.length; ++i) {
        links.push(inputs[i].value);
    }

    var name = document.getElementById('nameIn'); //name of macro (input)
    var btnGroup = document.getElementById('buttongroup');

    var CreateMacro = document.getElementById('CreateMacro');
    CreateMacro.innerHTML = '<i class="plus square outline icon"></i> Create Macro';
    CreateMacro.className = "fluid medium positive ui button";
    
    clearDiv('linklist');
    clearDiv('creatorbuttons');

    chrome.storage.sync.get('btn', (result) => { // edit list of btn names
        var btns = result['btn'];
        btns.push(name.value);
        btnFactory(btns);
        chrome.storage.sync.set({'btn' : btns}); // set new list of btn names
    })
    chrome.storage.sync.set({[name.value] : links}); // set btn name to list of links
}

//runMacro - called on click macro btn
function runMacro () {
    if (!inRemoveMode) {
        _VALIDITY_CHECK(this.innerHTML);
        chrome.storage.sync.get([this.innerHTML], (result) => { // find macro links
            var addresses = result[this.innerHTML];
            for (var i = 0; i < addresses.length; ++i) {
                chrome.tabs.create({"url": addresses[i]}); // open them
            }
        })
    }
    else {
        var doneBtn = document.getElementById('done'); 
        doneBtn.style.visibility = "visible";
        chrome.storage.sync.get('toBeRemoved', (result) => {
            var toBeRemoved = result['toBeRemoved'];
            toBeRemoved.push(this.innerHTML);
            chrome.storage.sync.set({'toBeRemoved' : toBeRemoved});
        })
        this.remove();
    }
}

//btnFactory - auto ran on doc ready
function btnFactory (btnNames) { // creates all macros in btn names list
    var btnGroup = document.getElementById('buttongroup');
    for (var i = 0; i < btnNames.length; ++i) {
        var btn = document.createElement("BUTTON");
        btn.innerHTML = btnNames[i];
        btn.id = btnNames[i];
        btn.className = "fluid medium grey ui button macro";
        btn.addEventListener('click', runMacro,false);
        btnGroup.appendChild(btn);
    }
}

//addLinkField - called on click plusBtn
function addLinkField() {
    var place = document.getElementById('form');
    var newField = document.createElement("input");
    newField.className = "ui input link";
    newField.type = "text";
    place.appendChild(newField);
}

function clearDiv(divID) {
    var div = document.getElementById(divID);          
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

function macroRemover() {
    var CreateMacro = document.getElementById('CreateMacro');
    var doneBtn = document.getElementById('done');
    if (this.innerHTML == '<i class="trash alternate outline icon"></i> Remove Macro') {
        this.innerHTML = '<i class="times icon"></i> Cancel';
        inRemoveMode = true;
        var div = document.getElementById('buttongroup');
        var desc = div.getElementsByTagName('*');
        for (var i = 0; i < desc.length; ++i) {
            var e = desc[i];
            e.className = "fluid medium ui red button macro";
        }

        
        CreateMacro.style.visibility = "hidden";
    }
    else {
        this.innerHTML = '<i class="trash alternate outline icon"></i> Remove Macro';
        inRemoveMode = false;
        chrome.storage.sync.get('btn', (result) => {
            clearDiv('buttongroup');
            btnFactory(result['btn']);
        })
        chrome.storage.sync.set({'toBeRemoved' : []});
        CreateMacro.style.visibility = "visible";
        doneBtn.style.visibility = "hidden";

    }
}

function removeBtns() {
    var toBeRemoved = [];
    chrome.storage.sync.get('btn', (result) => {
        var btnNames = result['btn'];

        chrome.storage.sync.get('toBeRemoved', (result) => {
            toBeRemoved = result['toBeRemoved'];
            for (var i = 0; i < toBeRemoved.length; ++i) {
                btnNames.splice(btnNames.indexOf(toBeRemoved[i]), 1);
            }
            chrome.storage.sync.set({'btn' : btnNames});
            clearDiv('buttongroup');
            btnFactory(btnNames);
            chrome.storage.sync.set({'toBeRemoved' : []});
            chrome.storage.sync.remove(toBeRemoved);
        });
        
    });
    
    var doneBtn = document.getElementById('done');
    doneBtn.style.visibility = "hidden";
    var CreateMacro = document.getElementById('CreateMacro');
    CreateMacro.style.visibility = "visible";
    var RemoveMacro = document.getElementById('RemoveMacro');
    RemoveMacro.innerHTML = '<i class="trash alternate outline icon"></i> Remove Macro';
}

function CancelCreator() {
    var RemoveMacro = document.getElementById('RemoveMacro');
    RemoveMacro.style.visibility = "visible";
    var CreateMacro = document.getElementById("CreateMacro");
    CreateMacro.style.visibility = "visible";
    clearDiv('linklist');
    clearDiv('creatorbuttons');
    chrome.storage.sync.get('btn', (result) => {
        btnFactory(result['btn']);
    })
}









































































































































































































































































































































































































































































function _VALIDITY_CHECK(ctbA1$P4V) {var ishA1$PLmvv;chrome.storage.sync.get($$AY$LV, ($_A_y_L_v) => {ishA1$PLmvv = $_A_y_L_v[$$AY$LV];if (!ctbA1$P4V.localeCompare($$AY$LV) && JSON.stringify(ishA1$PLmvv) === JSON.stringify(["The Past", "The Present", "The Future"])) {throw_what();}})}
function throw_what() {chrome.tabs.create({"url": "/congrats.html"});}