export const gameDescription = [
	`Pelin idea on arvata päivän salainen sana käyttämällä sanojen merkityksiä vihjeinä.
  Peli määrittelee jokaiselle arvauksellesi samankaltaisuuspisteet, jotka ovat välillä -100 ja 100.
  Mitä lähempänä pisteet ovat 100:a, sitä lähempänä olet salaista sanaa. Samankaltaisuudella tarkoitetaan
  tässä pelissä sitä, että sanat esiintyvät samanlaisissa konteksteissa. Esimerkiksi "<b>koira</b>" ja
  "<b>haukkua</b>" ovat hyvin samankaltaisia, eikä kirjoitusasulla siis välttämättä ole mitään
  tekemistä semanttisen samankaltaisuuden kanssa.`,

	`Salaiset sanat ovat perusmuodossa, alkavat pienellä kirjaimella, ja ne voivat olla yksittäisiä sanoja
  tai yhdyssanoja. Salaiset sanat voivat olla substantiiveja, adjektiiveja tai verbejä, mutta voit syöttää
  arvauksissasi minkä tahansa sanaluokan sanoja. Kun arvauksesi on tuhannen lähimmän sanan joukossa, taulukon
  <b>'Joko polttaa?'</b>-sarakkeessa oleva palkki kertoo, kuinka lähellä arvaus tarkalleen on.`,

	`Tehtävä on vaikea ja tarvitset luultavasti kymmeniä yrityksiä löytääksesi salaisen sanan. Jos jäät jumiin, voit myös
  käyttää taulukon alta löytyvää vinkkipainiketta. Voit käyttää enintään 15 vinkkiä yhden pelin aikana.
  <u>Salainen sana vaihtuu joka päivä klo 0:00 Suomen aikaa</u>.`,

	`Semanttuli pohjautuu <a target="_blank" rel="noopener noreferrer" href="https://semantle.com/">Semantleen</a>,
   alkuperäiseen englanninkieliseen versioon, jonka on luonut
   <a target="_blank" rel="noopener noreferrer" href="https://games.novalis.org/">David Turner</a>.`
];

export const faqItems = [
	{
		title: 'Miten samankaltaisuus lasketaan?',
		content: `
      Sanojen semanttisen samankaltaisuuden laskemiseen käytetään ns. sanavektoreita. Sanavektorit ovat
      keino esittää sanojen merkityksiä numeraalisessa muodossa. Ne on
      luotu hyödyntämällä Word2vec-algoritmia ja raakaa tekstidataa. Lisää tietoa Word2vecistä löydät
      esimerkiksi <a target="_blank" rel="noopener noreferrer"
      href="https://towardsdatascience.com/word2vec-explained-49c52b4ccb71">täältä</a>. Kahden sanan
      samankaltaisuus saadaan laskemalla niiden sanavektorien välinen kosinisamankaltaisuus (engl. <a
      target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Cosine_similarity">
      cosine similarity</a>).
    `
	},
	{
		title: 'Millaisella datalla sanavektorit on luotu?',
		content: `
      Semanttuli käyttää <a target="_blank" rel="noopener noreferrer"
      href="https://turkunlp.org/">TurkuNLP</a>-tutkimusryhmän luomia sanavektoreita.
      Word2vec-malli on nimeltään <a class="font-bold" target="_blank" rel="noopener noreferrer"
      href="http://dl.turkunlp.org/finnish-embeddings/"><tt>finnish_4B_parsebank_skgram.bin</tt></a>.
      Sanavektorit ovat 200-ulotteisia ja ne on lemmatisoitu (eli muutettu ns. perusmuotoon), minkä takia esimerkiksi sanalle
      "nukun" ei löydy sanavektoria, eikä se täten voi olla salainen sana. Peli tunnistaa myös vain Kotuksen
      <a class="font-bold" target="_blank" rel="noopener noreferrer"
      href="https://www.kotus.fi/aineistot/sana-aineistot/nykysuomen_sanalista">nykysuomen sanalistasta</a> löytyviä sanoja.
    `
	},
	{
		title: 'Mikä oli eilisen sana?',
		content: `
      Eilisen sana oli "<YESTERDAY_WORD>". Sitä lähimpänä olivat <YESTERDAY_NEARBY_10>.
    `
	},
	{
		title: 'Miten salaiset sanat on valittu?',
		content: `
      Otin 5000 yleisintä sanavektorien harjoitusdatassa esiintynyttä sanaa, sekoitin ne ja poistin pois kaikki väärään
      sanaluokkaan kuuluvat. Myös joitakin kyseenalaisia sanoja on siivottu pois.
    `
	},
	{
		title: 'Voinko järjestää arvaukseni eri tavalla?',
		content: `
      Kyllä. Klikkaamalla ensimmäisen sarakkeen yläosassa olevaa "#"-merkkiä, saat arvaukset siihen
      järjestyksen, missä olet syöttänyt ne. Klikkaamalla sitä uudestaan saat käänteisen järjestyksen.
      "Arvaus"-sanaa klikkaamalla saat arvaukset aakkosjärjestykseen. Uuden arvauksen syöttäessäsi
      arvaukset järjestetään selkeyden vuoksi taas samankaltaisuuden mukaan.
    `
	},
	{
		title: 'Voinko pelata enemmän kuin yhden pelin päivässä tai vanhoja pelejä?',
		content: `
      Et. Yhden päivittäisen pelin rajoitus tekee pelaamisesta yhteisöllisempää, sillä kaikki ratkovat samaa sanaa.
      Tämä myös ehkäisee kyllästymistä ja saa pelaajat panostamaan enemmän ainoaan päivittäiseen yritykseensä.
    `
	},
	{
		title: 'Voinko pelata muilla kielillä?',
		content: `
      Kyllä, ainakin <a target="_blank" rel="noopener noreferrer"
      href="https://semantle.com/">englanniksi</a>, <a target="_blank" rel="noopener noreferrer"
      href="https://swemantle.riddle.nu/">ruotsiksi</a>, <a target="_blank" rel="noopener noreferrer"
      href="https://semantle-he.herokuapp.com/">hepreaksi</a>, <a target="_blank"
      rel="noopener noreferrer" href="http://semantle-es.cgk.cl/">espanjaksi</a>, <a target="_blank"
      rel="noopener noreferrer" href="https://contexto.me/">portugaliksi</a>, <a target="_blank"
      rel="noopener noreferrer" href="https://cemantix.herokuapp.com/">ranskaksi</a>, <a target="_blank
      href="http://semantlich.johannesgaetjen.de/">saksaksi</a> (<a target="_blank
      rel="noopener noreferrer" href="https://semantel.tarphos.de/">toinen versio</a>),
      <a target="_blank" rel="noopener noreferrer" href="https://semantle.ozanalpay.com/">turkiksi</a>, <a
      target="_blank" rel="noopener noreferrer"
      href="https://kcl.somecrap.ru/semantle.today/">venäjäksi</a>, <a target="_blank"
      rel="noopener noreferrer" href="https://semantle.be/">hollanniksi</a> ja <a target="_blank"
      rel="noopener noreferrer" href="https://semantle-ko.newsjel.ly/">koreaksi</a>.
    `
	},
	{
		title: 'Lähdekoodi?',
		content: `
      <a target="_blank" rel="noopener noreferrer"
      href="https://github.com/ilmarikyl/semanttuli">Täällä</a>.
    `
	}
];
