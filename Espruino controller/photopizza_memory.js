this.f = new (require("FlashEEPROM"))();

function memRec() {
    console.log('start memRec');
    this.f.write(0, 'readable');
    
}
function memRead() {
    console.log(E.toString(this.f.read(0)));  
}

this.myRec = setTimeout(memRec, 2000);
this.myRec = setTimeout(memRead, 40000);