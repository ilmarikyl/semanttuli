export default {
	navbar: {
		title: 'Meaningle',
		openInfo: 'Open help',
		toggleTheme: {
			light: 'Switch to light theme',
			dark: 'Switch to dark theme',
		},
	},
	modal: {
		title: 'Find the secret word',
		instructions: 'Instructions',
		howToPlay: 'How to play',
		faq: 'Questions and Answers',
		scrollIndicator: 'Scroll down for more content',
	},
	game: {
		title: 'Meaningle',
		game: 'GAME:',
		backToGame: 'Back to game',
		loading: 'Loading...',
		scoreHint: 'The higher the score, the closer your guess is to the secret word.',
		nearest: 'Nearest',
		tenthNearest: '10th nearest',
		thousandNearest: '1000th nearest',
		giveUp: 'Give up',
		getHint: 'Use hint',
		shareResult: 'Share result',
		guess: 'Guess',
		guessPlaceholder: 'Guess a word',
		resultCopied: 'Result copied to clipboard!',
		continueGuessing: 'You can still continue entering words.',
		secretWordIs: 'The secret word is:',
		foundSecretWord: 'Secret word found with',
		hintsUsedTotal: 'You used a total of',
		hintsWord: 'hints',
		noHintsUsed: "You didn't use any hints!",
		seeNearestWords: 'You can see the words nearest to the secret word',
		here: 'here',
		guessesUsedTotal: 'You used a total of',
		withGuesses: 'guesses',
		usedGuesses: 'guesses',
		gameStats: 'Game Statistics',
		gaveUp: 'You gave up',
		secretWordWouldHaveBeen: 'The secret word would have been:',
		hintButton: 'Hint #{currentHint}/{maxHints}',
		confirmGiveUp: 'Are you sure you want to give up?',
		yes: 'Yes',
		cancel: 'Cancel',
	},
	errors: {
		wordNotRecognized: 'I don\'t recognize the word "{word}" 🥲',
		unexpectedError: 'An unexpected error occurred, please try again 🤔',
		fetchError: 'Something went wrong, please try again 😐',
	},
	guessTable: {
		word: 'Guess',
		score: 'Score',
		gettingWarm: 'Getting warm',
		gettingWarmTooltip:
			'When your guess is among the thousand closest words, the bar shows exactly how close it is. The bigger the number/bar, the closer you are.',
	},
	stats: {
		showStats: 'Show statistics',
		hideStats: 'Hide statistics',
		totalGames: 'Total Games',
		wins: 'Wins',
		giveUps: 'Give Ups',
		abandons: 'Abandoned',
		totalGuesses: 'Total Guesses',
		totalHints: 'Total Hints',
		averageGuesses: 'Avg. Guesses',
		winStreak: 'Win Streak',
	},
	clipboardContent: {
		gaveUp: '🚫 Meaningle #{gameNumber} gave up after {guesses} guesses and {hints} hints | meaningle.fly.dev',
		firstGuess: '✅ Meaningle #{gameNumber} solved on first guess! | meaningle.fly.dev',
		solved: '✅ Meaningle #{gameNumber} solved with {guesses} guesses and {hints} hints.',
		firstGuessSimilarity: '▪️The score of my first guess was {similarity}.',
		firstTop1000: '▪️My first guess in top 1000 was #{guessNumber}.',
		penultimateSimilarity: '▪️My second to last guess similarity was {similarity}.',
		url: 'meaningle.fly.dev',
	},
	nearestWords: {
		title: 'Words nearest to "{word}":',
		word: 'Word',
		points: 'Score',
		rank: '#',
	},
	footer: {
		downloadAndroid: 'Download Android app from',
		playStore: 'Play Store',
	},
	privacy: {
		title: 'Privacy Policy',
		sections: {
			intro:
				'To better protect your sensitive information, we provide this privacy policy that explains our data practices, particularly regarding what type and how much information may be collected from you when using the service (Meaningle application or website (meaningle.fly.dev)). These data practices are the same regardless of the device used.',
			commitment: 'The site does not collect any personal information.',
			collectedData:
				"Information about users' IP addresses, time spent on games, and where users click is temporarily stored. This information is never sold or shared with anyone else. The data is used to study the interaction between users and the service. The purpose of this is to improve the user interface.",
			logData:
				'We collect certain log information whenever you use our website. The information we collect may include your IP address, device name and version, and the time when you use the site. These and other statistics are used to help improve the user experience.',
			cookies:
				"Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. They are sent to your browser from the websites you visit and stored in your device's internal memory. This service itself does not use cookies. However, the service uses Google Analytics analytics tool to collect anonymous user data. Google Analytics may use cookies to distinguish between separate users and sessions.",
			contact: 'All questions and feedback related to the application can be sent to ilmariware@gmail.com.',
			commitmentTitle: 'Our Commitment',
			collectedDataTitle: 'Collected Data',
			logDataTitle: 'Log Data',
			cookiesTitle: 'Cookies',
			contactTitle: 'Contact',
		},
	},
	description: [
		`Meaningle is based on <a target="_blank" rel="noopener noreferrer" href="https://semantle.com/">Semantle</a>
    which was created by <a target="_blank" rel="noopener noreferrer" href="https://games.novalis.org/">David Turner</a>.`,

		`The idea of the game is to guess the daily secret word using word meanings as hints.
    The game assigns similarity points to each of your guesses, ranging from -100 to 100.
    The closer the points are to 100, the closer you are to the secret word. In this game,
    similarity means that words appear in similar contexts. For example, "<b>dog</b>" and
    "<b>bark</b>" are very similar, so the written form doesn't necessarily have anything
    to do with semantic similarity.`,

		`Secret words are in their uninflected form, start with a lowercase letter, and are single words.
    Secret words can be nouns, adjectives, or verbs, but you can input words from any word class
    in your guesses. When your guess is among the thousand closest words, the bar in the
    <b>'Getting warm?'</b> column of the table shows exactly how close the guess is.`,

		`The task is difficult and you'll probably need dozens of attempts to find the secret word. If you get stuck,
    you can also use the hint button found below the table. You can use up to 15 hints during one game.
    <u>The secret word changes every day at 12:00 AM (UTC+3)</u>.`,
	],
	faq: {
		howCalculated: {
			title: 'How is similarity calculated?',
			content: `The game uses word vectors to measure how similar words are to each other.
			  These vectors convert word meanings into numbers that computers can understand. The vectors were created using
				the GloVe algorithm and raw text data. You can find more information about GloVe
				<a target="_blank" rel="noopener noreferrer"
				href="https://en.wikipedia.org/wiki/GloVe">here</a>. The
				similarity between two words is calculated by computing the cosine similarity between
				their word vectors (see <a target="_blank" rel="noopener noreferrer"
				href="https://en.wikipedia.org/wiki/Cosine_similarity">cosine similarity</a>).`,
		},
		whatData: {
			title: 'What data is used for the word vectors?',
			content: `Meaningle uses pre-trained GloVe word vectors from the 
				<a target="_blank" rel="noopener noreferrer" href="https://nlp.stanford.edu/projects/glove/">Stanford's GloVe project</a> 
				(specifically the <code>glove.6B.300d.txt</code> dataset). The vectors are 300-dimensional. 
				Before storing the vectors in the database, they were lemmatized (converted to their uninflected form) 
				as a preprocessing step. This is why words like "slept" won't be found as they're not in their base form. 
				The game only recognizes words from a curated list of common English words.`,
		},
		yesterdayWord: {
			title: "What was yesterday's word?",
			content: `Yesterday's word was "<YESTERDAY_WORD>". The closest words to it were <YESTERDAY_NEARBY_10>.`,
		},
		wordSelection: {
			title: 'How are secret words selected?',
			content: `I took the 5000 most common words from the training data, shuffled them, and removed words from 
				incorrect word classes. Some questionable words have also been filtered out. From the remaining words,
				I randomly picked around 700 to be used as secret words.`,
		},
		sortGuesses: {
			title: 'Can I sort my guesses differently?',
			content: `Yes. By clicking the "#" at the top of the first column, you'll get the guesses in the order you entered them. 
				Clicking it again reverses the order. Clicking "Guess" sorts them alphabetically. When entering a new guess, 
				they're sorted by similarity again for clarity.`,
		},
		multipleGames: {
			title: 'Can I play more than one game per day or play old games?',
			content: `No. The one-game-per-day limit makes playing more communal as everyone is solving the same word. 
				This also prevents players from getting tired of the game and makes them invest more in their single daily attempt.`,
		},
		otherLanguages: {
			title: 'Can I play in other languages?',
			content: `Yes! I've created a Finnish version at <a target="_blank" rel="noopener noreferrer" href="https://semanttuli.fly.dev/">semanttuli.fly.dev</a>.<br/><br/>
				The original game <a target="_blank" rel="noopener noreferrer" href="https://semantle.com/">Semantle</a> can be found at semantle.com.
				Other versions have been created in many languages: <a target="_blank" rel="noopener noreferrer" href="https://swemantle.riddle.nu/">Swedish</a>, 
				<a target="_blank" rel="noopener noreferrer" href="https://semantle-he.herokuapp.com/">Hebrew</a>, 
				<a target="_blank" rel="noopener noreferrer" href="http://semantle-es.cgk.cl/">Spanish</a>, 
				<a target="_blank" rel="noopener noreferrer" href="https://contexto.me/">Portuguese</a>, 
				<a target="_blank" rel="noopener noreferrer" href="https://cemantix.herokuapp.com/">French</a>, 
				<a target="_blank" href="http://semantlich.johannesgaetjen.de/">German</a> 
				(<a target="_blank" rel="noopener noreferrer" href="https://semantel.tarphos.de/">another version</a>),
				<a target="_blank" rel="noopener noreferrer" href="https://semantle.ozanalpay.com/">Turkish</a>, 
				<a target="_blank" rel="noopener noreferrer" href="https://kcl.somecrap.ru/semantle.today/">Russian</a>, 
				<a target="_blank" rel="noopener noreferrer" href="https://semantle.be/">Dutch</a>, and
				<a target="_blank" rel="noopener noreferrer" href="https://semantle-ko.newsjel.ly/">Korean</a>.`,
		},
		sourceCode: {
			title: 'Source code?',
			content: `<a target="_blank" rel="noopener noreferrer" href="https://github.com/ilmarikyl/semanttuli">Here</a>.`,
		},
	},
};
