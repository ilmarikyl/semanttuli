<script>
	import {
		PrivacyPolicyHeader as TextHeader,
		PrivacyPolicySection as TextSection
	} from '$components';
</script>

<svelte:head>
	<title>Semanttuli - Yksityisyyskäytäntö</title>
</svelte:head>

<div class="mb-4 rounded px-6 pb-8 pt-6 shadow-md">
	<a
		href="/"
		class="font-semibold text-highlight-light transition-colors duration-200 ease-in-out hover:text-highlight-hover-light dark:text-highlight-dark dark:hover:text-highlight-hover-dark"
		>⬅ Takaisin peliin</a
	>
	<TextHeader level={2} text="Yksityisyyskäytäntö" />

	<TextSection
		title=""
		content="Suojataksemme arkaluontoisia tietojasi paremmin, tarjoamme tämän tietosuojaselosteen, jossa selitetään tietokäytäntöjämme erityisesti sen osalta, minkä tyyppisiä ja minkä verran tietoja sinulta saatetaan kerätä käyttämällä palvelua (Semanttuli-sovellus tai verkkosivusto (semanttuli.fly.dev)). Tietokäytännöt ovat samat käytetystä laitteesta riippumatta."
	/>

	<TextSection title="Sitoumuksemme" content="Sivusto ei kerää minkäänlaisia henkilötietoja." />

	<TextSection
		title="Kerättävä data"
		content="Tiedot käyttäjien IP-osoitteista, peleihin käytetystä ajasta sekä siitä, mihin käyttäjien klikkaukset
		kohdistuvat säilytetään väliaikaisesti. Näitä tietoja ei koskaan myydä tai jaeta kenenkään muun kanssa.
		Tietoja käytetään käyttäjien ja palvelun välisen interaktion tutkimiseen. Tämän tarkoituksena on
		käyttöliittymän parantaminen."
	/>

	<TextSection
		title="Lokitiedot"
		content="Keräämme tiettyjä lokitietoja aina, kun käytät verkkosivustoamme. Keräämämme tiedot voivat
		sisältää IP-osoitteesi, laitteen nimen ja version sekä ajan, jolloin käytät sivustoa. Näitä ja
		muita tilastoja käytetään apuna käyttökokemuksen parantamisessa."
	/>

	<TextSection
		title="Evästeet"
		content="Evästeet ovat tiedostoja, joissa on pieni määrä tietoa ja joita käytetään yleisesti anonyymeinä yksilöllisinä
		tunnisteina. Ne lähetetään selaimeesi vierailluilta verkkosivustoilta, ja ne tallennetaan laitteesi
		sisäiseen muistiin. Tämä palvelu ei itsessään käytä evästeitä. Palvelu käyttää kuitenkin Google Analytics
		-analytiikkatyökalua anonyymin käyttäjädatan keruuseen. Google Analytics saattaa käyttää evästeitä
		erillisten
		käyttäjien ja istuntojen erottamiseen."
	/>

	<TextSection
		title="Yhteystiedot"
		content="Kaikki sovellukseen liittyvät kysymykset ja palautteet voi lähettää osoitteeseen ilmariware@gmail.com."
	/>
</div>
