DROP TABLE IF EXISTS pantofi CASCADE;
DROP TYPE IF EXISTS tip_pantof CASCADE;
DROP TYPE IF EXISTS categorie_pantof CASCADE;
DROP TYPE IF EXISTS tipuri_toc CASCADE;
DROP TYPE IF EXISTS culoare_pantof CASCADE;

CREATE TYPE tip_pantof AS ENUM ('sandale', 'pantofi eleganti', 'pantofi cu toc', 'pantofi sport', 'balerini', 'botine', 'cizme', 'ghete', 'role', 'patine', 'slip-on');
CREATE TYPE categorie_pantof AS ENUM ('casual', 'business', 'sport', 'eveniment special', 'elegant');
CREATE TYPE tipuri_toc AS ENUM ('fara toc', 'toc subtire', 'toc gros', 'platforma', 'toc patrat', 'kitten heel', 'wedges');
CREATE TYPE culoare_pantof AS ENUM ('negru', 'alb', 'bej', 'rosu', 'roz', 'roz pudrat', 'roz pastel', 'gri', 'auriu', 'argintiu', 'albastru', 'verde', 'maro', 'nude', 'crem', 'multicolor');

CREATE TABLE IF NOT EXISTS pantofi (
   id SERIAL PRIMARY KEY,
   nume VARCHAR(100) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL CHECK (pret > 0),
   tip tip_pantof DEFAULT 'pantofi eleganti',
   categorie categorie_pantof DEFAULT 'casual',
   ocazii_recomandate VARCHAR[],
   marimi_disponibile INTEGER[] NOT NULL,
   culoare culoare_pantof NOT NULL,
   material VARCHAR(100) NOT NULL,
   inaltime_toc INT CHECK (inaltime_toc >= 0),
   tip_toc tipuri_toc DEFAULT 'fara toc',
   impermeabili BOOLEAN NOT NULL DEFAULT FALSE,
   editie_limitata BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO pantofi (nume, descriere, pret, tip, categorie, ocazii_recomandate, marimi_disponibile, culoare, material, inaltime_toc, tip_toc, impermeabili, editie_limitata, imagine)
VALUES
('Adidasi imblaniti pentru copii', 'Adidasi albi cu interior roz pufos, perfecti pentru zile racoroase.', 120.00, 'pantofi sport', 'casual', '{"joaca","plimbare"}', '{26,27,28,29}', 'roz', 'panza si blanita sintetica', 0, 'fara toc', FALSE, FALSE, 'adidasi-copil.jpg'),
('Adidasi roz casual', 'Adidasi roz monocolor, ideali pentru tinute relaxate de zi cu zi.', 230.00, 'pantofi sport', 'casual', '{"plimbare","activitati zilnice"}', '{36,37,38,39}', 'roz', 'material textil si piele eco', 0, 'fara toc', FALSE, FALSE, 'adidasi-roz-casual.jpg'),
('Bocanci de iarna', 'Bocanci negri cu talpa groasa, potriviti pentru zapada si gheata.', 350.00, 'ghete', 'sport', '{"iarna","excursii"}', '{37,38,39,40}', 'negru', 'piele naturala', 4, 'toc gros', TRUE, FALSE, 'bocanci-sanie.jpg'),
('Pointes balet', 'Pantofi speciali pentru balet, culoare roz pal, pentru antrenamente si spectacole.', 280.00, 'balerini', 'elegant', '{"dans","spectacol"}', '{35,36,37}', 'roz pudrat', 'satin', 0, 'fara toc', FALSE, FALSE, 'pantofi-balet.jpg'),
('Pantofi maro casual', 'Pantofi maro simpli, comozi, potriviti pentru tinute casual sau smart casual.', 210.00, 'pantofi eleganti', 'casual', '{"birou","iesiri relaxate"}', '{37,38,39}', 'maro', 'piele naturala', 2, 'toc patrat', FALSE, FALSE, 'pantofi-costum.jpg'),
('Sandale plaja cu snur', 'Sandale minimaliste negre cu snur, ideale pentru vara si plaja.', 90.00, 'sandale', 'casual', '{"vacanta","plaja"}', '{37,38,39}', 'negru', 'material textil si piele eco', 1, 'fara toc', FALSE, FALSE, 'sandale-elegante-plaja.jpg'),
('Adidasi outdoor', 'Adidasi confortabili bej cu accente roz, perfecti pentru activitati in natura.', 260.00, 'pantofi sport', 'sport', '{"drumetie","plimbare in parc"}', '{37,38,39,40}', 'bej', 'piele eco si material textil', 0, 'fara toc', FALSE, FALSE, 'adidasi-in-natura.jpg'),
('Bocanci visinii', 'Bocanci robusti visinii, ideali pentru conditii grele si toamna/iarna.', 320.00, 'ghete', 'sport', '{"drumetii","zile ploioase"}', '{37,38,39}', 'roz', 'piele intoarsa', 3, 'toc gros', TRUE, FALSE, 'bocanci-roz.jpg'),
('Cizme maro elegante', 'Cizme lungi din piele intoarsa maro, elegante si comode.', 380.00, 'cizme', 'elegant', '{"birou","toamna","eveniment"}', '{37,38,39}', 'maro', 'piele intoarsa', 7, 'toc patrat', FALSE, FALSE, 'cizme-inalte.jpg'),
('Pantofi de ocazie albi', 'Pantofi albi cu toc inalt si pietre decorative, ideali pentru nunti si evenimente speciale.', 450.00, 'pantofi cu toc', 'eveniment special', '{"nunta","petrecere"}', '{36,37,38}', 'alb', 'satin si pietre decorative', 9, 'toc subtire', FALSE, TRUE, 'pantofi-albi-ocazie.jpg'),
('Adidasi casual roz', 'Adidasi roz monocolor, ideali pentru tinute relaxate de zi cu zi.', 230.00, 'pantofi sport', 'casual', '{"plimbare","activitati zilnice"}', '{36,37,38,39}', 'roz', 'material textil si piele eco', 0, 'fara toc', FALSE, FALSE, 'adidasi-casual.jpg'),
('Ghete outdoor', 'Ghete negre rezistente, perfecte pentru drumetii si activitati in aer liber.', 270.00, 'ghete', 'sport', '{"outdoor","drumetii"}', '{37,38,39,40}', 'negru', 'piele intoarsa', 4, 'toc gros', TRUE, FALSE, 'ghete.jpg'),
('Pantofi patine albe clasice', 'Patine clasice albe cu siret, perfecte pentru gheata si antrenamente.', 320.00, 'patine', 'sport', '{"iarna","activitati sportive"}', '{36,37,38}', 'alb', 'piele ecologica', 3, 'fara toc', FALSE, FALSE, 'pantofi-eleganti-pe-gheata.jpg'),
('Sandale perlate elegante', 'Sandale elegante cu perle si fundite, perfecte pentru vara si evenimente.', 260.00, 'sandale', 'elegant', '{"evenimente","vara"}', '{36,37,38}', 'crem', 'material textil si piele eco', 2, 'kitten heel', FALSE, FALSE, 'sandale-deosebite.jpg'),
('Ghete de iarna imblanite', 'Ghete imblanite ideale pentru zapada, confortabile si calduroase.', 330.00, 'ghete', 'casual', '{"zapada","iarna"}', '{37,38,39}', 'gri', 'piele ecologica si blanita sintetica', 4, 'toc gros', TRUE, FALSE, 'ghete-in-zapada.jpg'),
('Pantofi balerini albi', 'Balerini albi eleganti, ideali pentru evenimente speciale sau vara.', 210.00, 'balerini', 'elegant', '{"eveniment","vara"}', '{36,37,38}', 'alb', 'material textil brodat', 1, 'fara toc', FALSE, FALSE, 'pantofi-balerini-albi.jpg'),
('Pantofi aurii de ocazie', 'Pantofi aurii cu toc stiletto, perfecti pentru petreceri si evenimente formale.', 410.00, 'pantofi cu toc', 'eveniment special', '{"petrecere","gala"}', '{36,37,38}', 'auriu', 'piele ecologica lucioasa', 9, 'toc subtire', FALSE, TRUE, 'pantofi-de-ocazie.jpg'),
('Pantofi roz pastel eleganti', 'Pantofi cu toc inalt roz pastel, ideali pentru tinute feminine si elegante.', 390.00, 'pantofi cu toc', 'elegant', '{"birou","eveniment"}', '{36,37,38}', 'roz pastel', 'piele ecologica lacuita', 9, 'toc gros', FALSE, FALSE, 'pantofi-deosebiti.jpg'),
('Role pentru copii', 'Role roz si albastre cu roti luminoase, perfecte pentru joaca si sport.', 340.00, 'role', 'sport', '{"joaca","miscare"}', '{30,31,32,33}', 'multicolor', 'material textil si plastic', 4, 'platforma', FALSE, FALSE, 'role.jpg'),
('Slapi colorati de plaja', 'Slapi colorati cu talpa confortabila, ideali pentru plaja si vacanta.', 80.00, 'slip-on', 'casual', '{"plaja","vara"}', '{36,37,38}', 'multicolor', 'spuma EVA si cauciuc', 1, 'fara toc', FALSE, FALSE, 'slapi-in-nisip.jpg'),
('Adidasi New Balance roz', 'Adidasi sport roz cu accente gri si talpa alba, ideali pentru un stil urban activ.', 340.00, 'pantofi sport', 'casual', '{"plimbare","oras"}', '{36,37,38,39}', 'roz', 'material textil si cauciuc', 0, 'fara toc', FALSE, FALSE, 'adidasi-new-balance.jpg'),
('Cizme cowboy brodate', 'Cizme negre inalte cu broderie alba, inspirate de stilul western.', 420.00, 'cizme', 'casual', '{"festival","primavara","toamna"}', '{37,38,39}', 'negru', 'piele ecologica', 5, 'toc gros', FALSE, FALSE, 'cizme-inalte-cowboy.jpg'),
('Ghete mix casual', 'Ghete negre robuste si UGG maro calduroase pentru sezonul rece.', 310.00, 'ghete', 'sport', '{"iarna","zile reci"}', '{37,38,39,40}', 'negru', 'piele ecologica si textil', 4, 'toc gros', TRUE, FALSE, 'ghete-si-ugg.jpg'),
('Ghete verzi cu toc', 'Ghete verzi cu toc patrat, curea decorativa si textura catifelata.', 290.00, 'ghete', 'business', '{"birou","toamna"}', '{36,37,38}', 'verde', 'piele intoarsa', 4, 'toc patrat', FALSE, FALSE, 'ghete-toamna.jpg'),
('Pantofi bleumarin eleganti', 'Pantofi bleumarin din catifea cu toc inalt, potriviti pentru tinute formale.', 390.00, 'pantofi cu toc', 'elegant', '{"birou","eveniment"}', '{36,37,38}', 'albastru', 'catifea', 8, 'toc subtire', FALSE, FALSE, 'pantofi-ocazie.jpg'),
('Patine albe clasice', 'Patine albe cu sireturi si lama metalica, perfecte pentru patinaj artistic.', 280.00, 'patine', 'sport', '{"iarna","patinaj"}', '{36,37,38}', 'alb', 'piele ecologica si metal', 3, 'toc gros', FALSE, FALSE, 'patine.jpg'),
('Adidasi Nike albi', 'Adidasi sport albi cu logo negru, rezistenti si comozi, purtati pe ploaie.', 360.00, 'pantofi sport', 'casual', '{"plimbare","urban"}', '{38,39,40}', 'alb', 'material textil si cauciuc', 0, 'fara toc', FALSE, FALSE, 'adidasi-pe-ploaie.jpg'),
('Sandale de ocazie albe', 'Sandale albe cu toc si barete fine, ideale pentru ocazii speciale in aer liber.', 420.00, 'sandale', 'eveniment special', '{"nunta","gradina"}', '{36,37,38}', 'alb', 'piele ecologica', 9, 'toc subtire', FALSE, TRUE, 'pantofi-ocazie-in-natura.jpg'),
('Sandale maro vacanta', 'Sandale maro simple cu barete si talpa ortopedica, perfecte pentru drumuri lungi si vacante.', 160.00, 'sandale', 'casual', '{"vacanta","condus"}', '{37,38,39}', 'maro', 'piele ecologica', 2, 'platforma', FALSE, FALSE, 'sandale-in-masina-vacanta.jpg'),
('Cizme de ploaie colorate', 'Cizme roz cu buline galbene, ideale pentru zilele ploioase, impermeabile.', 180.00, 'cizme', 'casual', '{"ploaie","joaca"}', '{28,29,30}', 'roz', 'cauciuc impermeabil', 2, 'fara toc', TRUE, FALSE, 'cizme-de-ploaie.jpg'),
('Adidasi roz in raft', 'Adidasi roz aprins expusi pe raft, ideali pentru un look urban si indraznet.', 320.0, 'pantofi sport', 'casual', '{"shopping","plimbare"}', '{36,37,38,39}', 'roz', 'material textil si cauciuc', 0, 'fara toc', FALSE, FALSE, 'adidasi-pe-raft.jpg'),
('Adidasi roz pal in natura', 'Adidasi roz pal din piele intoarsa, perfecti pentru o plimbare relaxanta in natura.', 290.0, 'pantofi sport', 'casual', '{"natura","relaxare"}', '{36,37,38}', 'roz pudrat', 'piele intoarsa', 0, 'fara toc', FALSE, FALSE, 'adidasi-in-natura-2.jpg'),
('Adidasi roz pastel futurist', 'Adidasi roz pastel cu talpa futurista, asortati cu sosete sport, pentru un stil jucaus.', 310.0, 'pantofi sport', 'casual', '{"moda","urban"}', '{36,37,38}', 'roz pastel', 'material textil', 0, 'fara toc', FALSE, TRUE, 'adidasi-roz.jpg'),
('Botine roz pe mocheta', 'Botine roz aprins cu platforma si toc gros, ideale pentru petreceri tematice.', 360.0, 'botine', 'eveniment special', '{"petrecere","moda"}', '{36,37,38,39}', 'roz', 'piele ecologica', 10, 'platforma', FALSE, TRUE, 'botine-roz.jpg'),
('Tenisi albi relaxare', 'Tenisi albi clasici purtati casual, ideali pentru vacante si iesiri relaxate.', 210.0, 'pantofi sport', 'casual', '{"vacanta","relaxare"}', '{36,37,38,39}', 'alb', 'material textil', 0, 'fara toc', FALSE, FALSE, 'converse-care-free.jpg'),
('Pantofi eleganti roz', 'Pantofi stiletto roz cu fundita satinata, potriviti pentru evenimente elegante.', 390.0, 'pantofi cu toc', 'elegant', '{"eveniment","cocktail"}', '{36,37,38}', 'roz', 'piele intoarsa si satin', 9, 'toc subtire', FALSE, FALSE, 'pantofi-eleganti-roz.jpg'),
('Pantofi eleganti negri', 'Pantofi cu toc stiletto negri, clasici si versatili, ideali pentru birou sau ocazii.', 420.0, 'pantofi cu toc', 'business', '{"birou","elegant"}', '{36,37,38}', 'negru', 'piele ecologica lucioasa', 9, 'toc subtire', FALSE, FALSE, 'pantofi-eleganti.jpg'),
('Sandale elegante albe', 'Sandale albe cu toc patrat, purtate intr-un cadru natural de vara, perfecte pentru rochii vaporoase.', 270.0, 'sandale', 'elegant', '{"vara","gradina"}', '{36,37,38}', 'alb', 'piele ecologica', 6, 'toc patrat', FALSE, FALSE, 'sandale-elegante-in-natura.jpg'),
('Slapi impletiti de lemn', 'Slapi simpli cu barete impletite, fotografiati pe podea de lemn umed, ideali pentru plaja sau sauna.', 110.0, 'slip-on', 'casual', '{"plaja","spa"}', '{36,37,38}', 'bej', 'material sintetic si cauciuc', 1, 'fara toc', FALSE, FALSE, 'slapi.jpg'),
('Botine casual urbane', 'Botine maro cu detalii decorative si toc mic, perfecte pentru plimbari urbane in sezonul rece.', 280.00, 'botine', 'casual', '{"plimbari urbane","toamna","iarna","vremea instabila"}', '{36,37,38,39,40}', 'maro', 'piele eco', 3, 'toc gros', TRUE, FALSE, 'ghete-ploaie.jpg'),
('Pantofi bebelus roz', 'Pantofi mici de bebelus, roz, asezati pe un suport de lemn, fundal estompat.', 85.00, 'balerini', 'casual', '{"primul pas","evenimente speciale copii","fotografii"}', '{17,18,19,20}', 'roz', 'piele moale si material textil', 0, 'fara toc', FALSE, FALSE, 'pantofi-bebelus.jpg'),
('Sandale elegante de seara', 'Sandale aurii si rosii, perfecte pentru tinute de ocazie si seri speciale.', 420.00, 'sandale', 'eveniment special', '{"seri speciale","evenimente elegante","petreceri","vara"}', '{36,37,38,39}', 'auriu', 'piele cu finisaj metalic', 8, 'toc subtire', FALSE, TRUE, 'pantofi-eleganti-parfum.jpg'),
('Papuci pentru domnisoare', 'Papuci comozi si simpatici, ideali pentru relaxare inainte de o zi speciala.', 120.00, 'sandale', 'eveniment special', '{"nunta","petrecere burlacite","relaxare","evenimente speciale"}', '{36,37,38,39,40}', 'roz', 'material textil moale', 1, 'fara toc', FALSE, FALSE, 'papuci.jpg'),
('Sandale negre cu platformă', 'Sandale negre din lac cu barete și platformă înaltă, potrivite pentru ieșiri de seară.', 300.0, 'sandale', 'elegant', '{"ieșire","eveniment"}', '{36,37,38}', 'negru', 'piele ecologică lacuită', 10, 'platforma', FALSE, FALSE, 'black-heels.jpg'),
('Adidasi New Balance roz pudrat', 'Adidasi sport New Balance într-o nuanță delicată de roz pudrat, potriviți pentru un stil urban activ și confortabil.', 350.00, 'pantofi sport', 'casual', '{"oras","activitati usoare","plimbare"}', '{36,37,38,39}', 'roz pudrat', 'material textil si cauciuc', 0, 'fara toc', FALSE, FALSE, 'new-balance.jpg'),
('Pantofi bordo lacuiti', 'Pantofi eleganti cu toc subtire, din piele ecologica lacuita de culoare bordo, ideali pentru birou sau evenimente formale.', 410.00, 'pantofi cu toc', 'business', '{"birou","elegant","eveniment"}', '{36,37,38}', 'rosu', 'piele ecologica lacuita', 7, 'toc subtire', FALSE, FALSE, 'pantofi-cu-toc-subtire.jpg');


