// resurse/js/produse.js
window.onload = function() {
    /* INITIALIZARE PAGINARE */
    const K = 8;
    let paginaCurenta = 1;
    let produseFiltrate = [];
    pagineazaProduse();

    /* INITIALIZARE MESAJE */
    const mesajNiciun = document.getElementById("mesaj-niciun-produs");
    const spanNr = document.getElementById("val-nr-produse");
    updateCount();

    /* COMPARARE */

    let produsComparat1 = null;
    let produsComparat2 = null;

    const storageKey = "produseComparate";

    const containerComparare = document.getElementById("container-comparare");  

    const produseContainer = document.querySelector(".grid-produse");
    const produseInitiale = Array.from(document.querySelectorAll(".produs"));

    const salvate = localStorage.getItem(storageKey);
    if (salvate) {
        const obj = JSON.parse(salvate);
        const timestamp = obj.timestamp || 0;
        const unMin = 1000 * 60;
        const acum = Date.now();

        if (acum - timestamp <= unMin) {
            produsComparat1 = obj.produs1 || null;
            produsComparat2 = obj.produs2 || null;
            afiseazaContainerComparare();
            if (produsComparat1 && produsComparat2) {
                document.querySelectorAll(".btn-compara").forEach(btn => {
                    btn.disabled = true;
                    btn.title = "Ștergeți un produs din lista de comparare";
                    btn.classList.add("dezactivat-comparare");
                });
            }

        } else {
            localStorage.removeItem(storageKey);
        }
    }

    for (const prod of produseInitiale) {
        const id = prod.dataset.id;
        const nume = prod.querySelector(".val-nume").textContent;
    
        const btnCompara = prod.querySelector(".btn-compara");
        btnCompara.addEventListener("click", () => {
            if (produsComparat1 && produsComparat2) {
                document.querySelectorAll(".btn-compara").forEach(btn => {
                    btn.disabled = true;
                    btn.title = "Ștergeți un produs din lista de comparare";
                    btn.style.filter = "opacity(0.1)";
                    btn.classList.add("dezactivat-comparare");
                });
            }

            console.log("Click pe buton comparare pentru produsul:", nume);
            if (!produsComparat1 && !produsComparat2) {
                produsComparat1 = { id, nume };
                afiseazaContainerComparare();
                salveazaComparare();
            } else if (produsComparat1 && !produsComparat2 && produsComparat1.id !== id) {
                    produsComparat2 = { id, nume };
                    afiseazaContainerComparare();
                    salveazaComparare();
                
                    document.querySelectorAll(".btn-compara").forEach(btn => {
                        btn.disabled = true;
                        btn.title = "Ștergeți un produs din lista de comparare";
                        btn.style.filter = "opacity(0.1)";
                        btn.classList.add("dezactivat-comparare");
                    });
                }
                
        });
    }

    function activeazaButoaneComparare() {
        document.querySelectorAll(".btn-compara").forEach(btn => {
            btn.disabled = false;
            btn.title = "Compară acest produs";
            btn.classList.remove("dezactivat-comparare");
            btn.style.filter = "none";
            btn.style.opacity = "1";
        });
    }    

    function afiseazaContainerComparare() {
        let html = "<h4>Compara produsele!</h4><ul style='list-style: none; padding: 0;' id='lista-comparare'>";
        if (produsComparat1)
            html += `<li>
                        ${produsComparat1.nume} 
                        <button class="btn-remove-compare" data-id="${produsComparat1.id}" style="margin-left:0.5rem;">❌</button>
                    </li>`;
        if (produsComparat2)
            html += `<li>
                        ${produsComparat2.nume} 
                        <button class="btn-remove-compare" data-id="${produsComparat2.id}" style="margin-left:0.5rem;">❌</button>
                    </li>`;
        html += "</ul>";

        html += `<button id="btn-afiseaza-comparare" style="margin-top:1rem;">Afișează</button>`;

        containerComparare.innerHTML = html;
        containerComparare.style.display = "block";

        document.getElementById("btn-afiseaza-comparare").addEventListener("click", () => {
            if (!produsComparat1 || !produsComparat2) {
                alert("Trebuie să fie două produse pentru comparare.");
                return;
            }
        
            const win = window.open("", "_blank", "width=800,height=600");
            if (!win) {
                alert("Fereastra pop-up a fost blocată. Permite pop-up-uri pentru acest site.");
                return;
            }
        
            const titlu = "<h2>Comparație produse</h2>";
            const tabel = `
                <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
                    <thead>
                        <tr>
                            <th>Caracteristică</th>
                            <th>${produsComparat1.nume}</th>
                            <th>${produsComparat2.nume}</th>
                        </tr>
                    </thead>
                    <tbody style="background-color: var(--pink-lightest);">
                        ${comparareRand("Preț", getValProdus(produsComparat1.id, ".val-pret"), getValProdus(produsComparat2.id, ".val-pret"))}
                        ${comparareRand("Culoare", getValProdus(produsComparat1.id, ".val-culoare"), getValProdus(produsComparat2.id, ".val-culoare"))}
                        ${comparareRand("Tip pantof", getValProdus(produsComparat1.id, ".val-tip"), getValProdus(produsComparat2.id, ".val-tip"))}
                        ${comparareRand("Categorie", getValProdus(produsComparat1.id, ".val-categorie"), getValProdus(produsComparat2.id, ".val-categorie"))}
                        ${comparareRand("Ocazii recomandate", getValProdus(produsComparat1.id, ".val-ocazii"), getValProdus(produsComparat2.id, ".val-ocazii"))}
                        ${comparareRand("Mărimi disponibile", getValProdus(produsComparat1.id, ".val-marimi_disponibile"), getValProdus(produsComparat2.id, ".val-marimi_disponibile"))}
                        ${comparareRand("Material", getValProdus(produsComparat1.id, ".val-material"), getValProdus(produsComparat2.id, ".val-material"))}
                        ${comparareRand("Înălțime toc", getValProdus(produsComparat1.id, ".val-inaltime_toc"), getValProdus(produsComparat2.id, ".val-inaltime_toc"))}
                        ${comparareRand("Tip toc", getValProdus(produsComparat1.id, ".val-tip_toc"), getValProdus(produsComparat2.id, ".val-tip_toc"))}
                        ${comparareRand("Impermeabili", getValProdus(produsComparat1.id, ".val-impermeabili"), getValProdus(produsComparat2.id, ".val-impermeabili"))}
                        ${comparareRand("Ediție limitată", getValProdus(produsComparat1.id, ".val-editie_limitata"), getValProdus(produsComparat2.id, ".val-editie_limitata"))}
                        ${comparareRand("Descriere", getValProdus(produsComparat1.id, ".val-descriere"), getValProdus(produsComparat2.id, ".val-descriere"))}
                        ${comparareRand("Data adăugare", getValProdus(produsComparat1.id, ".val-data_adaugare"), getValProdus(produsComparat2.id, ".val-data_adaugare"))}
                    </tbody>
                </table>
            `;

            win.document.head.innerHTML = `
                <title>Comparație produse</title>
                <link rel="stylesheet" href="/resurse/css/general.css">
            `;
        
            win.document.body.innerHTML = titlu + tabel;
        });
    
        document.querySelectorAll(".produs").forEach(p => {
            const pid = p.dataset.id;
            p.classList.remove("produs-comparat");
            if (produsComparat1?.id === pid || produsComparat2?.id === pid) {
                p.classList.add("produs-comparat");
            }
        });
    
        document.querySelectorAll(".btn-remove-compare").forEach(btn => {
            btn.addEventListener("click", function () {
                const idStergere = this.dataset.id;
                if (produsComparat1?.id === idStergere) {
                    produsComparat1 = produsComparat2;
                    produsComparat2 = null;
                } else if (produsComparat2?.id === idStergere) {
                    produsComparat2 = null;
                }                
    
                if (!produsComparat1 && !produsComparat2) {
                    containerComparare.style.display = "none";
                    localStorage.removeItem(storageKey);
                
                    document.querySelectorAll(".produs").forEach(p => p.classList.remove("produs-comparat"));
                
                    activeazaButoaneComparare();
                } else {
                    salveazaComparare();
                    afiseazaContainerComparare();
                }
    
                activeazaButoaneComparare();
            });
        });
    }
    
    function salveazaComparare() {
        const toSave = {
            produs1: produsComparat1,
            produs2: produsComparat2,
            timestamp: Date.now()
        };
        localStorage.setItem(storageKey, JSON.stringify(toSave));
    }  

    function comparareRand(label, val1, val2) {
        return `
            <tr>
                <td><strong>${label}</strong></td>
                <td>${val1}</td>
                <td>${val2}</td>
            </tr>
        `;
    }

    function getValProdus(id, selector) {
        const produs = [...document.querySelectorAll(".produs")].find(p => p.dataset.id === id);
        if (!produs) return "-";
        return produs.querySelector(selector)?.textContent?.trim() || "-";
    }

    /* BUTOANE */
    const kept = new Set();
    const tempHidden = new Set();
    const blocked = new Set(JSON.parse(sessionStorage.getItem("blockedProducts") || "[]"));

    for (const prod of produseInitiale) {
        const id = prod.dataset.id;
        if (blocked.has(id)) {
            prod.style.display = "none";
        }
    }

    for (const prod of produseInitiale) {
        const id = prod.dataset.id;
        const btnP = prod.querySelector(".btn-pastreaza");
        const btnA = prod.querySelector(".btn-ascunde");
        const btnB = prod.querySelector(".btn-blocheaza");

        if (blocked.has(id)) {
            btnB.classList.add("activ");
        }

        // pastreaza
        btnP.addEventListener("click", () => {
            if (kept.has(id)) {
                kept.delete(id);
                prod.classList.remove("produs-pastrat");
                btnP.classList.remove("activ");
            } else {
                kept.add(id);
                prod.classList.add("produs-pastrat");
                btnP.classList.add("activ");
            }
        });

        // ascunde
        btnA.addEventListener("click", () => {
            tempHidden.add(id);
            prod.style.display = "none";
            updateCount();
        });

        // blocheaza
        btnB.addEventListener("click", () => {
            blocked.add(id);
            sessionStorage.setItem("blockedProducts", JSON.stringify(Array.from(blocked)));
            prod.style.display = "none";
            btnB.classList.add("activ");
            updateCount();
        });
    }

    /* DIACRITICE */
    function normalize(str) {
        return str.trim()
                  .normalize("NFD")
                  .toLowerCase();
    }

    /* FILTRARE */
    function filtreazaProduse() {
        tempHidden.clear();

        if (!valideazaInputuri()) return;

        const inpNume        = normalize(document.getElementById("inp-nume").value);
        const vectRadio      = document.getElementsByName("gr_rad");
        let inpInaltVal = "toate", minInalt = 0, maxInalt = Infinity;
        for (let rad of vectRadio) {
            if (rad.checked && rad.value !== "toate") {
                inpInaltVal = rad.value;
                [minInalt, maxInalt] = rad.value.split(":").map(x => parseInt(x));
                break;
            }
        }
        const inpPret        = parseFloat(document.getElementById("inp-pret").value);
        const inpTip         = document.getElementById("inp-tip").value.trim().toLowerCase();
        const inpDescriere   = document.getElementById("inp-descriere").value
                                  .split(",").map(c => normalize(c)).filter(c => c);
        const inpCulori      = [...document.getElementById("inp-culori").selectedOptions]
                                  .map(o => o.value.toLowerCase());
        const inpMaterial    = normalize(document.getElementById("inp-material").value);
        const inpOcazii      = [...document.querySelectorAll("input[name='ocazii']:checked")]
                                  .map(cb => cb.value.trim().toLowerCase());

        produseFiltrate = [];
        let count = 0;
        const produse = document.getElementsByClassName("produs");
        for (const prod of produse) {
            const id = prod.dataset.id;

            if (blocked.has(id)) {
                prod.style.display = "none";
                continue;
            }

            const nume = normalize(prod.querySelector(".val-nume").textContent);
            const cond1 = nume.startsWith(inpNume);

            const inaltimeToc = parseInt(prod.querySelector(".val-inaltime_toc").textContent);
            const cond2 = (inpInaltVal === "toate" || (minInalt <= inaltimeToc && inaltimeToc <= maxInalt));

            const pret = parseFloat(prod.querySelector(".val-pret").textContent);
            const cond3 = (pret >= inpPret);

            const tip = prod.querySelector(".val-tip").textContent.trim().toLowerCase();
            const cond4 = (inpTip === "toate" || tip === inpTip);

            const descriere = normalize(prod.querySelector(".val-descriere")?.textContent || "");
            const cond5 = inpDescriere.length === 0 || inpDescriere.some(c => descriere.includes(c));

            const culoare = prod.querySelector(".val-culoare").textContent.trim().toLowerCase();
            const cond6 = inpCulori.length === 0 || inpCulori.includes(culoare);

            const material = normalize(prod.querySelector(".val-material").textContent);
            const cond7 = inpMaterial === "" || material.includes(inpMaterial);

            const ocazii = prod.querySelector(".val-ocazii").textContent
                              .split(",").map(o => o.trim().toLowerCase());
            const cond8 = inpOcazii.length === 0 || ocazii.some(o => inpOcazii.includes(o));

            if (kept.has(id) || (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8)) {
                prod.style.display = "block";
                count++;
                produseFiltrate.push(prod);
            } else {
                prod.style.display = "none";
            }
        }

        mesajNiciun.style.display = count === 0 ? "block" : "none";
        spanNr.textContent = produseFiltrate.length;

        paginaCurenta = 1;
        pagineazaProduse();
    }

    /* FILTRARE ON CHANGE */
    const toateInputurile = document.querySelectorAll("#toate-produsele input, #toate-produsele select, #toate-produsele textarea");
    for (const inp of toateInputurile) {
        inp.addEventListener("change", filtreazaProduse);
    }

    /* VALIDARE */
    function valideazaInputuri() {
        let eroare = "";
        const nume      = document.getElementById("inp-nume").value.trim();
        const descriere = document.getElementById("inp-descriere").value.trim();
        const material  = document.getElementById("inp-material").value.trim();
        const ocazii    = document.querySelectorAll("input[name='ocazii']:checked");

        if (/\d/.test(nume))      eroare += "Numele nu trebuie să conțină cifre.\n";
        if (/\d/.test(descriere)) eroare += "Descrierea nu trebuie să conțină cifre.\n";
        if (/\d/.test(material))  eroare += "Materialul nu trebuie să conțină cifre.\n";
        if (ocazii.length === 0)  eroare += "Trebuie selectată cel puțin o ocazie.\n";

        if (eroare) {
            alert("Eroare:\n" + eroare);
            return false;
        }
        return true;
    }

    document.getElementById("toggle-all-ocazii").onchange = function() {
        const toateOcaziile = document.querySelectorAll("input[name='ocazii']");
        for (let cb of toateOcaziile) cb.checked = this.checked;
        filtreazaProduse();
    };

    /* RESETARE */
    document.getElementById("resetare").onclick = function() {
        if (!confirm("Sigur doriți să resetați filtrele?")) return;

        document.getElementById("inp-nume").value = "";
        document.getElementById("i_rad4").checked = true;
        const rangePret = document.getElementById("inp-pret");
        rangePret.value = rangePret.min;
        rangePret.dispatchEvent(new Event("input"));         
        document.getElementById("inp-tip").value = "toate";
        document.getElementById("inp-descriere").value = "";
        document.getElementById("inp-material").value = "";
        for (let opt of document.getElementById("inp-culori").options) opt.selected = false;
        const toggleAll = document.getElementById("toggle-all-ocazii");
        if (toggleAll) { toggleAll.checked = true; toggleAll.dispatchEvent(new Event("change")); }

        kept.clear();
        tempHidden.clear();

        for (const prod of produseInitiale) {
            prod.classList.remove("produs-pastrat");
            prod.querySelector(".btn-pastreaza").classList.remove("activ");
            if (!blocked.has(prod.dataset.id)) {
                prod.style.display = "block";
            }
        }
        updateCount();
        produseFiltrate = Array.from(document.getElementsByClassName("produs"))
                .filter(p => p.style.display !== "none");
        paginaCurenta = 1;
        pagineazaProduse();
    };

    document.getElementById("inp-pret").addEventListener("input", function() {
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    });

    /* SORTARE */
    document.getElementById("btn-sortare-dinamica").onclick = function () {
        if (!valideazaInputuri()) return;
    
        const cheie1 = document.getElementById("cheie1").value;
        const cheie2 = document.getElementById("cheie2").value;
        if (cheie1 === cheie2) {
            alert("Cele două criterii de sortare trebuie să fie diferite.");
            return;
        }
        const directie = document.getElementById("directie").value;
        const semn = (directie === "crescator" ? 1 : -1);
    
        const val = (el, key) => {
            switch (key) {
                case "pret":
                    return parseFloat(el.querySelector(".val-pret").textContent);
                case "nume":
                    return el.querySelector(".val-nume").textContent.toLowerCase();
                case "inaltime_toc":
                    return parseInt(el.querySelector(".val-inaltime_toc").textContent);
                case "nr_ocazii":
                    return el.querySelector(".val-ocazii").textContent.split(",").length;
            }
        };
    
        produseFiltrate.sort((a, b) => {
            const v1a = val(a, cheie1), v1b = val(b, cheie1);
            if (v1a !== v1b) return semn * ((v1a > v1b) ? 1 : -1);
            const v2a = val(a, cheie2), v2b = val(b, cheie2);
            return semn * ((v2a > v2b) ? 1 : -1);
        });
    
        for (let prod of produseFiltrate) {
            produseContainer.appendChild(prod);
        }
    
        paginaCurenta = 1;
        updateCount();
        pagineazaProduse();
    };    

    /* SUMA PRETURI */
    window.onkeydown = function(e) {
        if (e.code === "KeyC" && e.altKey) {
    
            let sumaPreturi = 0;
            for (let prod of produseFiltrate) {
                const val = parseFloat(prod.querySelector(".val-pret")?.textContent);
                if (!isNaN(val)) sumaPreturi += val;
            }
    
            if (!document.getElementById("suma_preturi")) {
                const pRez = document.createElement("p");
                pRez.id = "suma_preturi";
                pRez.textContent = `Total produse filtrate: ${sumaPreturi.toFixed(2)} lei`;
                const pHolder = document.getElementById("p-suma");
                pHolder.parentNode.insertBefore(pRez, pHolder.nextSibling);
                setTimeout(() => {
                    document.getElementById("suma_preturi")?.remove();
                }, 2000);
            }
        }
    };

    /* PAGINARE */
    function pagineazaProduse() {
        const toateProdusele = produseFiltrate;
    
        const nrPagini = Math.ceil(toateProdusele.length / K);
    
        for (const p of toateProdusele) {
            p.style.display = "none";
        }
    
        const start = (paginaCurenta - 1) * K;
        const end = paginaCurenta * K;
        const produseDeAfisat = toateProdusele.slice(start, end);
        for (const p of produseDeAfisat) {
            p.style.display = "block";
        }
    
        const containerPaginare = document.getElementById("paginare");
        containerPaginare.innerHTML = "";
    
        for (let i = 1; i <= nrPagini; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === paginaCurenta) {
                btn.disabled = true;
                btn.style.fontWeight = "bold";
            }
    
            btn.addEventListener("click", () => {
                paginaCurenta = i;
                pagineazaProduse();
                document.getElementById("produse").scrollIntoView({ behavior: "smooth" });
            });
    
            containerPaginare.appendChild(btn);
        }
    }

    produseFiltrate = Array.from(document.getElementsByClassName("produs")).filter(p => p.style.display !== "none");
    paginaCurenta = 1;
    updateCount();
    pagineazaProduse();

    /* FUNCTII AJUTATOARE */
    function updateCount() {
        spanNr.textContent = produseFiltrate.length;
        mesajNiciun.style.display = produseFiltrate.length === 0 ? "block" : "none";
    }
};
