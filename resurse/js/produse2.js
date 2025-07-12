window.onload = function () {
    const gridProduse = document.querySelector(".grid-produse");
    const mesajNiciunProdus = document.getElementById("mesaj-niciun-produs");
    const spanNr = document.getElementById("val-nr-produse");

    document.getElementById("btn-sortare-dinamica").onclick = incarcaProduse;

    document.querySelectorAll("#toate-produsele input, #toate-produsele select, #toate-produsele textarea").forEach(inp => {
        inp.addEventListener("change", incarcaProduse);
    });

    document.getElementById("inp-pret").addEventListener("input", function () {
        document.getElementById("infoRange").textContent = `(${this.value})`;
    });

    incarcaProduse(); // încarcă la început

    function getFiltre() {
        const normalize = s => s.trim().toLowerCase();

        const filtre = {
            nume: normalize(document.getElementById("inp-nume").value),
            descriere: document.getElementById("inp-descriere").value,
            pret: document.getElementById("inp-pret").value,
            tip: document.getElementById("inp-tip").value,
            material: normalize(document.getElementById("inp-material").value),
            cheie1: document.getElementById("cheie1").value,
            cheie2: document.getElementById("cheie2").value,
            directie: document.getElementById("directie").value
        };

        const radio = document.querySelector("input[name='gr_rad']:checked");
        if (radio && radio.value !== "toate") {
            const [min, max] = radio.value.split(":");
            filtre.inaltime_min = min;
            filtre.inaltime_max = max;
        }

        const culori = [...document.getElementById("inp-culori").selectedOptions].map(opt => opt.value);
        if (culori.length) filtre.culori = culori;

        const ocazii = [...document.querySelectorAll("input[name='ocazii']:checked")].map(cb => cb.value);
        if (ocazii.length) filtre.ocazii = ocazii;

        return filtre;
    }

    async function incarcaProduse() {
        const query = getFiltre();
        const url = new URL("/produse2", window.location.origin);

        Object.entries(query).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                val.forEach(v => url.searchParams.append(key, v));
            } else {
                url.searchParams.append(key, val);
            }
        });

        const raspuns = await fetch(url);
        const produse = await raspuns.json();

        gridProduse.innerHTML = "";

        if (produse.length === 0) {
            mesajNiciunProdus.style.display = "block";
        } else {
            mesajNiciunProdus.style.display = "none";

            for (let p of produse) {
                const art = document.createElement("article");
                art.className = "produs";
                art.innerHTML = `
                    <h3><a href="/produs/${p.id}">${p.nume}</a></h3>
                    <p>Preț: ${p.pret} lei</p>
                    <p>Descriere: ${p.descriere}</p>
                    <p>Culoare: ${p.culoare}</p>
                    <p>Ocazii: ${p.ocazii_recomandate.join(", ")}</p>
                    <img src="/resurse/imagini/produse/${p.imagine}" height="150">
                `;
                gridProduse.appendChild(art);
            }
        }

        spanNr.textContent = produse.length;
    }
};
