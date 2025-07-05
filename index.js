const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");

const app = express();

console.log("Folderul proiectului: ", __dirname)
console.log("Calea fisierului index.js: ", __filename)
console.log("Folderul curent de lucru: ", process.cwd())

app.set("view engine", "ejs")

obGlobal={
    obErori:null,
    obImagini:null,
    folderScss: path.join(__dirname, "resurse/scss"),
    folderCss: path.join(__dirname, "resurse/css"),
    folderBackup: path.join(__dirname, "backup")
}

vect_foldere=["temp", "backup", "temp1"]
for(let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let baseName      = path.basename(caleCss, '.css');
    let timestamp     = Date.now();
    let numeFisCss    = `${baseName}_${timestamp}.css`;

    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}

//compileazaScss("a.scss");
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if ((eveniment=="change" || eveniment=="rename")
        && path.extname(numeFis).toLowerCase() === ".scss"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }
    console.log(obGlobal.obErori)
}

initErori()

function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    let caleAbsMic=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mic");
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs,imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.fisier_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        let caleFisMicAbs=path.join(caleAbsMic, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMicAbs);
        imag.fisier_mic=path.join("/", obGlobal.obImagini.cale_galerie, "mic",numeFis+".webp" )
        imag.fisier=path.join("/", obGlobal.obImagini.cale_galerie, imag.fisier )
        
    }
    console.log(obGlobal.obImagini)
}

initImagini();

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
                    
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;
    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;
    }

    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
    });
}

function randomEven(min, max) {
    const count = ((max - min) / 2) + 1; 
    const r = Math.floor(Math.random() * count);
    return min + r * 2;
}
  
app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));


app.get(["/", "/index", "/home"], function(req, res){
    res.render("pagini/index", {Ip: req.ip, imagini: obGlobal.obImagini.imagini});
});

app.get(["/galerie"], function(req, res){
    const oddImages = obGlobal.obImagini.imagini.filter((_, i) => i % 2 === 1);
    const N = randomEven(6, 14);
    const shuffled = [...oddImages].sort(() => 0.5 - Math.random());
    const selection = shuffled.slice(0, N);
    res.render("pagini/galerie", {imagini: obGlobal.obImagini.imagini, imaginiD: selection});
});

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname, "resurse", "imagini", "favicon", "favicon.ico"));
});

app.get(/^\/resurse\/[a-zA-Z0-9_\/]*$/, function(req, res, next){
    afisareEroare(res, 403);
});

app.get(/^\/(.+)\.ejs$/, function(req, res, next){
    afisareEroare(res, 400);
});


app.get(/.*/, function(req, res, next){
    try{
        res.render("pagini" + req.url, function(err, rezultatRandare){
            if(err){
                console.log(err);
                if(err.message.startsWith("Failed to lookup view")){
                    afisareEroare(res, 404);
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                console.log(rezultatRandare);
                res.send(rezultatRandare);
            }
        });
    }
    catch(errRandare){
        if(errRandare.message.startsWith("Cannot find module")){
            afisareEroare(res, 404);
        }
        else{
            afisareEroare(res);
        }
    }
});

app.listen(8080);
console.log("Serverul a pornit");