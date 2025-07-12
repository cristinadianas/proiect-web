const express = require("express");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sass = require("sass");
const pg = require("pg");

const Client=pg.Client;

client=new Client({
    database:"magazin_pantofi",
    user:"cristina",
    password:"cristina",
    host:"localhost",
    port:5432
})

client.connect()
client.query("select * from pantofi", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})
client.query("select * from unnest(enum_range(null::tip_pantof))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
})

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
    folderBackup: path.join(__dirname, "backup"),
    optiuniMeniu:null
}

client.query("select * from unnest(enum_range(null::categorie_pantof))", function(err, rezultat ){
    console.log(err)    
    console.log(rezultat)
    obGlobal.optiuniMeniu=rezultat.rows;
    app.listen(8080);
})

vect_foldere=["temp", "backup", "temp1"]
for(let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder);
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )

    console.log("cale:",caleCss);
    

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
        console.log(`  • Backup creat: ${numeFisCss}`);
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
            console.log(">>> compile for", numeFis);
            compileazaScss(caleCompleta);
        }
    }
})

const BACKUP_DIR = path.join(__dirname, 'backup', 'resurse', 'css');
const T_MINUTES = 30;
const CHECK_INTERVAL = 30 * 60 * 1000;

async function purgeOldBackups() {
    try {
      const files = await fs.promises.readdir(BACKUP_DIR);
      console.log(`[purge] Găsite ${files.length} fișiere în ${BACKUP_DIR}`);
      
      const now = Date.now();
      const cutoff = now - T_MINUTES * 60 * 1000;
      console.log(`[purge] now=${new Date(now).toISOString()}, cutoff=${new Date(cutoff).toISOString()}`);
  
      for (const file of files) {
        const filePath = path.join(BACKUP_DIR, file);
        try {
          const stats = await fs.promises.stat(filePath);
          const mtimeMs = stats.mtimeMs;
          console.log(`  → ${file}: mtime=${new Date(mtimeMs).toISOString()}`);
  
          if (mtimeMs < cutoff) {
            await fs.promises.unlink(filePath);
            console.log(`    • Șters: ${file}`);
          } else {
            console.log(`    • Păstrat: ${file}`);
          }
        } catch (statErr) {
          console.error(`  ! Eroare stat pentru ${file}:`, statErr);
        }
      }
    } catch (err) {
      console.error('[purge] Eroare la citirea directorului backup:', err);
    }
}

setInterval(purgeOldBackups, CHECK_INTERVAL);

purgeOldBackups();

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

function esteProdusNou(dataAdaugare, T_zile = 1) {
    const acum = new Date();
    const data = new Date(dataAdaugare);
    const diffZile = (acum - data) / (1000 * 60 * 60 * 24);
    return diffZile <= T_zile;
}  

function randomEven(min, max) {
    const count = ((max - min) / 2) + 1; 
    const r = Math.floor(Math.random() * count);
    return min + r * 2;
}

app.use(/.*/, function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})
app.use("/resurse", express.static(path.join(__dirname, "resurse")));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));


app.get(["/", "/index", "/home"], function(req, res){
    const queryProduseNoi = "SELECT * FROM pantofi ORDER BY data_adaugare DESC LIMIT 6";
    client.query(queryProduseNoi, function(err, rez) {
      if (err) {
        console.log(err);
        afisareEroare(res, 2);
      } else {
        const produseNoi = rez.rows.map(p => ({
          ...p,
          esteNou: esteProdusNou(p.data_adaugare)
        }));
  
        res.render("pagini/index", {
          Ip: req.ip,
          imagini: obGlobal.obImagini.imagini,
          produseNoi: produseNoi
        });
      }
    });
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

app.get("/produse2", async function(req, res) {
    try {
        const [optiuni, culori, ocazii, materiale, preturi, maxToc] = await Promise.all([
            client.query("SELECT * FROM unnest(enum_range(NULL::tip_pantof))"),
            client.query("SELECT * FROM unnest(enum_range(NULL::culoare_pantof))"),
            client.query("SELECT DISTINCT unnest(ocazii_recomandate) AS ocazie FROM pantofi ORDER BY ocazie"),
            client.query("SELECT DISTINCT material FROM pantofi ORDER BY material"),
            client.query("SELECT MIN(pret) AS pret_min, MAX(pret) AS pret_max FROM pantofi"),
            client.query("SELECT MAX(inaltime_toc) AS max_toc FROM pantofi")
        ]);

        res.render("pagini/produse2", {
            optiuni: optiuni.rows,
            culori: culori.rows,
            ocazii: ocazii.rows.map(r => r.ocazie),
            materiale: materiale.rows.map(r => r.material),
            pretMin: preturi.rows[0].pret_min,
            pretMax: preturi.rows[0].pret_max,
            maxToc: maxToc.rows[0].max_toc
        });
    } catch (err) {
        console.log(err);
        afisareEroare(res, 2);
    }
});

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditieQuery = "";
    if (req.query.categorie){
        conditieQuery = ` where categorie='${req.query.categorie}'`;
    }

    const queryProduse = "select * from pantofi" + conditieQuery;
    const queryOptiuni = "select * from unnest(enum_range(null::tip_pantof))";
    const queryCulori = "select * from unnest(enum_range(null::culoare_pantof))";
    const queryMateriale = "select material, count(*) as aparitii from pantofi group by material order by aparitii desc;";
    const queryOcazii = "select distinct unnest(ocazii_recomandate) as ocazie from pantofi order by ocazie;";
    const queryPreturi = "SELECT MIN(pret) AS pret_min, MAX(pret) AS pret_max FROM pantofi";
    const queryMaxToc = "SELECT MAX(inaltime_toc) AS max_toc FROM pantofi";
    const queryIeftine = `SELECT DISTINCT ON (categorie) id FROM pantofi ORDER BY categorie, pret ASC`;

    client.query(queryIeftine, function(errIeftine, rezIeftine){
        if (errIeftine) {
            console.log(errIeftine);
            afisareEroare(res, 2);
        } else {
        const iduriIeftine = rezIeftine.rows.map(r => r.id);
        client.query(queryMaxToc, function(errMaxToc, rezMaxToc) {
            if (errMaxToc) {
                console.log(errMaxToc);
                afisareEroare(res, 2);
            } else {
                const maxToc = rezMaxToc.rows[0].max_toc;
                client.query(queryPreturi, function(errPreturi, rezPreturi) {
                    if (errPreturi) {
                    console.log(errPreturi);
                    afisareEroare(res, 2);
                    } else {
                        const pretMin = rezPreturi.rows[0].pret_min;
                        const pretMax = rezPreturi.rows[0].pret_max;
                        client.query(queryOcazii, function(errOcazii, rezOcazii){
                            if (errOcazii) {
                                console.log(errOcazii);
                                afisareEroare(res, 2);
                            } else {
                                client.query(queryMateriale, function(errMateriale, rezMateriale){
                                    if (errMateriale) {
                                        console.log(errMateriale);
                                        afisareEroare(res, 2);
                                    } else {
                                        client.query(queryOptiuni, function(errOptiuni, rezOptiuni){
                                            if (errOptiuni) {
                                                console.log(errOptiuni);
                                                afisareEroare(res, 2);
                                            } else {
                                                client.query(queryCulori, function(errCulori, rezCulori){
                                                    if (errCulori) {
                                                        console.log(errCulori);
                                                        afisareEroare(res, 2);
                                                    } else {
                                                        client.query(queryProduse, function(errProduse, rezProduse){
                                                            if (errProduse){
                                                                console.log(errProduse);
                                                                afisareEroare(res, 2);
                                                            } else {
                                                                const iduriNoi = rezProduse.rows
                                                                    .filter(p => esteProdusNou(p.data_adaugare))
                                                                    .map(p => p.id);

                                                                console.log("iduriNoi:", iduriNoi);

                                                                res.render("pagini/produse", {
                                                                    produse: rezProduse.rows,
                                                                    optiuni: rezOptiuni.rows,
                                                                    culori: rezCulori.rows,
                                                                    materiale: rezMateriale.rows.map(r => r.material),
                                                                    ocazii: rezOcazii.rows.map(r => r.ocazie),
                                                                    pretMin: pretMin,
                                                                    pretMax: pretMax,
                                                                    maxToc: maxToc,
                                                                    iduriIeftine: iduriIeftine,
                                                                    iduriNoi: iduriNoi,
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});
});


app.get("/produs/:id", function(req, res) {
    client.query(`SELECT * FROM pantofi WHERE id=${req.params.id}`, function(err, rez) {
      if (err) {
        console.log(err);
        afisareEroare(res, 2);
      } else {
        if (rez.rowCount === 0) {
          afisareEroare(res, 404);
        } else {
          const produs = rez.rows[0];
          const esteNou = esteProdusNou(produs.data_adaugare);
          produs.imagini = produs.imagine.split(",").map(f => f.trim());
  
          res.render("pagini/produs", {
            prod: produs,
            esteNou: esteNou
          });
        }
      }
    });
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

console.log("Serverul a pornit");