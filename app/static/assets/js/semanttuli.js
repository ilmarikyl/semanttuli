/*
    Copyright (c) 2022, Ilmari Kylliäinen <kylliainenilmari@gmail.com>

     This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

	The code is based on the source code of Semantle by David Turner.
*/
"use strict";

let gameOver = false;
let firstGuess = true;
let guesses = [];
let latestGuess = undefined;
let guessed = new Set();
let guessCount = 0;
let hintCount = 0;
let model = null;
const now = Date.now() + 10800000; // add 10800000 for UTC+3
const today = Math.floor(now / 86400000);
// console.log('TODAY:', today)
const initialDay = 19145; // oikeasti 19145
const puzzleNumber = (today - initialDay) % secretWordsEncoded.length;
const handleStats = puzzleNumber >= 1;
const yesterdayPuzzleNumber =
	(today - initialDay + secretWordsEncoded.length - 1) %
	secretWordsEncoded.length;
const storage = window.localStorage;
let caps = 0;
let warnedCaps = 0;
let chrono_forward = 1;
let darkMode = true;
const MAX_HINT_AMOUNT = 15;

function $(q) {
	return document.querySelector(q);
}

function mag(a) {
	return Math.sqrt(
		a.reduce(function (sum, val) {
			return sum + val * val;
		}, 0)
	);
}

function dot(f1, f2) {
	return f1.reduce(function (sum, a, idx) {
		return sum + a * f2[idx];
	}, 0);
}

function getCosSim(f1, f2) {
	return dot(f1, f2) / (mag(f1) * mag(f2));
}

function plus(v1, v2) {
	const out = [];
	for (let i = 0; i < v1.length; i++) {
		out.push(v1[i] + v2[i]);
	}
	return out;
}

function minus(v1, v2) {
	const out = [];
	for (let i = 0; i < v1.length; i++) {
		out.push(v1[i] - v2[i]);
	}
	return out;
}

function scale(v, s) {
	const out = [];
	for (let i = 0; i < v.length; i++) {
		out.push(v[i] * s);
	}
	return out;
}

function project_along(v1, v2, t) {
	const v = minus(v2, v1);
	const num = dot(minus(t, v1), v);
	const denom = dot(v, v);
	return num / denom;
}

function share(gaveUp = false) {
	// We use the stored guesses here, because those are not updated again
	// once you win -- we don't want to include post-win guesses here.
	const text = solveStory(
		JSON.parse(storage.getItem("guesses")),
		puzzleNumber,
		gaveUp
	);
	const copied = ClipboardJS.copy(text);

	if (copied) {
		alert("Tulos kopioitu leikepöydälle");
	} else {
		alert("Tuloksen kopioiminen leikepöydälle ei onnistunut");
	}
}

function toggleStatVisibility() {
	let statsDiv = document.getElementById("stats");
	let toggleButton = document.getElementById("toggle-stats-btn");

	if (statsDiv.style.display === "none" || !statsDiv.style.display) {
		statsDiv.style.display = "flex";
		toggleButton.textContent = "Piilota tilastot";
	} else {
		statsDiv.style.display = "none";
		toggleButton.textContent = "Näytä tilastot";
	}
}

function decodeB64(b64_word) {
	return decodeURIComponent(escape(atob(b64_word)));
}

const words_selected = [];
const cache = {};
let secret = "";
let secretVec = null;
let similarityStory = null;

function guessRow(
	similarity,
	oldGuess,
	percentile,
	guessNumber,
	guess,
	wasHint
) {
	let percentileText = "❄️";
	let progress = "";
	if (similarity >= similarityStory.top1000 * 100) {
		percentileText = `<span class="weirdWord">
							<svg style="height: 1.5em;" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
							</svg>
							<span class="tooltiptext">
								Harvinainen sana löytyi! Tämä sana on tuhannen samankaltaisimman joukossa, mutta sen tarkka sijoitus ei jostain syystä ole tiedossa.
							</span>
						</span>`;
	}
	if (percentile) {
		if (percentile == 1000) {
			percentileText = `<svg class="checkmark-icon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" 						  fill="currentColor">
								<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
							  </svg>`;
		} else {
			percentileText = `<span class="percentile">${percentile}/1000</span>&nbsp;`;
			progress = ` <span class="progress-container">
							<span class="progress-bar" style="width:${percentile / 10}%">
								&nbsp;
							</span>
						</span>`;
		}
	}
	let color;

	if (oldGuess === guess) {
		color = "#c0c";
	} else if (darkMode) {
		color = "#fafafa";
	} else {
		color = "#000";
	}

	const similarityLevel = similarity * 2.55;
	let similarityColor;

	if (darkMode) {
		similarityColor = `255,${255 - similarityLevel},${
			255 - similarityLevel
		}`;
	} else {
		similarityColor = `${similarityLevel},0,0`;
	}

	let oldGuessText = oldGuess;
	if (wasHint) {
		oldGuessText += `<span class="hint-used-icon">
							<svg style="height: 1em" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
  							</svg>
						 </span>`;
	}

	let similarityToDisplay = similarity.toFixed(2);

	return `<tr>
				<td>${guessNumber}</td>
				<td style="color:${color}; white-space: nowrap; max-width: 11em; text-overflow: ellipsis; overflow: hidden;">${oldGuessText}</td>
				<td style="color: rgb(${similarityColor}); text-align: center; ">${similarityToDisplay}</td>
				<td class="closeness">
					<span class="pcont">
						${percentileText}${progress}
					</span>
				</td>
			</tr>`;
}

// function updateLocalTime() { // EI KÄYTöSSÄ ATM
// 	const now = new Date();
// 	now.setUTCHours(21, 0, 0, 0);
// 	$("#localtime").innerHTML = `klo ${now.getHours()}:00 paikallista aikaa.`;
// }

function mapToEmoji(number) {
	const emojiDict = {
		0: "0️⃣",
		1: "1️⃣",
		2: "2️⃣",
		3: "3️⃣",
		4: "4️⃣",
		5: "5️⃣",
		6: "6️⃣",
		7: "7️⃣",
		8: "8️⃣",
		9: "9️⃣",
	};
	let emojiStr = "";
	const chars = Array.from(String(number)).map((e) => parseInt(e));

	chars.forEach((e) => {
		emojiStr += emojiDict[e];
	});

	return emojiStr;
}

function solveStory(guesses, puzzleNumber, gaveUp = false) {
	const guess_count = guesses.length;
	if (guess_count == 0) {
		return `🚫 Luovutin Semanttulin #${puzzleNumber} kanssa arvaamatta kertaakaan | semanttuli.herokuapp.com`;
	}

	if (gaveUp) {
		return `🚫 Semanttuli #${puzzleNumber} luovutettu ${mapToEmoji(
			guess_count
		)} arvauksen ja ${mapToEmoji(
			hintCount
		)} vinkin jälkeen | semanttuli.herokuapp.com`;
	}

	if (guess_count == 1) {
		return `✅ Semanttuli #${puzzleNumber} ratkaistu ensimmäisellä yrityksellä! | semanttuli.herokuapp.com`;
	}

	let describe = function (similarity, percentile) {
		let out = `${similarity.toFixed(2)}`;
		if (percentile) {
			out += ` (${percentile}/1000)`;
		}
		return out;
	};

	const guesses_chrono = guesses.slice();
	guesses_chrono.sort(function (a, b) {
		return a[3] - b[3];
	});

	let [similarity, old_guess, percentile, guess_number, wasHint] = guesses_chrono[0];
	let wasHintText = wasHint ? " oli vinkki ja sen" : ""

	let first_guess = `▪️Ensimmäisen arvaukseni${wasHintText} samankaltaisuus oli ${describe(
		similarity,
		percentile
	)}\n`;
	let first_guess_in_top = !!percentile;

	let first_hit = "";
	if (!first_guess_in_top) {
		for (let entry of guesses_chrono) {
			[similarity, old_guess, percentile, guess_number] = entry;
			if (percentile) {
				first_hit = `▪️Arvaus #${guess_number} oli ensimmäinen arvaukseni top 1000:ssa\n`;
				break;
			}
		}
	}

	const penultimate_guess = guesses_chrono[guesses_chrono.length - 2];
	[similarity, old_guess, percentile, guess_number] = penultimate_guess;
	const penultimate_guess_msg = `▪️Toiseksi viimeisen arvaukseni samankaltaisuus oli ${describe(
		similarity,
		percentile
	)}\n\n`;

	return `✅ Semanttuli #${puzzleNumber} ratkaistu: ${mapToEmoji(
		guess_count
	)} arvausta ja ${mapToEmoji(
		hintCount
	)} vinkkiä\n\n${first_guess}${first_hit}${penultimate_guess_msg}semanttuli.herokuapp.com`;
}

let Semanttuli = (function () {
	async function getSimilarityStory(secret) {
		const url = "/similarity/" + secret;
		const response = await fetch(url);
		try {
			return await response.json();
		} catch (e) {
			return null;
		}
	}

	async function getModel(word) {
		if (cache.hasOwnProperty(word)) {
			return cache[word];
		}

		const url = "/model/" + secret + "/" + word.replace(/\ /gi, "_");

		const response = await fetch(url);
		try {
			return await response.json();
		} catch (e) {
			return null;
		}
	}

	async function getSecret(secret) {
		const url = "/getSecret/" + secret;

		const response = await fetch(url);
		try {
			return await response.json();
		} catch (e) {
			return null;
		}
	}

	async function getHint(secret, percentile) {
		$("#error").textContent = "";
		const url = "/hint/" + secret + "/" + percentile;

		const response = await fetch(url);
		try {
			return await response.json();
		} catch (e) {
			return null;
		}
	}

	async function getNearby(word) {
		const url = "/nearby/" + word;
		const response = await fetch(url);
		try {
			return await response.json();
		} catch (e) {
			return null;
		}
	}

	async function init() {
		secret = secretWordsEncoded[puzzleNumber];

		const yesterday = decodeB64(secretWordsEncoded[yesterdayPuzzleNumber]);

		$(
			"#yesterday"
		).innerHTML = `<span style="font-weight: 400;">"${yesterday}"</span>`;

		$("#lower").checked = storage.getItem("lower") == "true";

		$("#lower").onchange = (e) => {
			storage.setItem("lower", "" + $("#lower").checked);
		};

		try {
			const yesterdayNearby = await getNearby(yesterday);
			const quoteYesterdayNearby = yesterdayNearby.map((e) => `"${e}"`);
			const yesterdayBase64 = btoa(
				unescape(encodeURIComponent(yesterday))
			);
			$("#nearbyYesterday").innerHTML = `${quoteYesterdayNearby.join(
				", "
			)}, lähimmästä kauimpaan. Lisää lähimpiä sanoja näet <a href="nearby_1k/${yesterdayBase64}">täältä</a>.`;
		} catch (e) {
			$("#nearbyYesterday").innerHTML = `[JOTAIN MENI VIKAAN]`;
		}
		// updateLocalTime(); // LEAVE HERE FOR NOW

		try {
			similarityStory = await getSimilarityStory(secret);

			const closestSimilarity = (similarityStory.top * 100).toFixed(2);
			const top10Similarity = (similarityStory.top10 * 100).toFixed(2);
			const top1000Similarity = (similarityStory.top1000 * 100).toFixed(
				2
			);

			$("#similarity-story").innerHTML = `
				Tämä on <b>${puzzleNumber}.</b> Semanttuli-peli. Lähimmän sanan samankaltaisuus on <b>${closestSimilarity}</b>, kymmenenneksi lähimmän ${top10Similarity} ja tuhannenneksi lähimmän ${top1000Similarity}.`;
		} catch {
			$("#similarity-story").innerHTML =
				"Pelin metatietojen noutaminen ei onnistunut. Yritä myöhemmin uudestaan.";
		}

		const storagePuzzleNumber = storage.getItem("puzzleNumber");
		if (storagePuzzleNumber != puzzleNumber) {
			storage.removeItem("guesses");
			storage.removeItem("hintsUsed");
			storage.removeItem("winState");
			storage.setItem("puzzleNumber", puzzleNumber);
		}

		document.querySelectorAll(".dialog-close").forEach((el) => {
			el.innerHTML = "";
			el.appendChild($("#x-icon").content.cloneNode(true));
		});

		if (!storage.getItem("readRules")) {
			openRules();
		}

		$("#rules-button").addEventListener("click", openRules);

		document
			.querySelectorAll(
				".dialog-underlay, .dialog-close, #capitalized-link"
			)
			.forEach((el) => {
				el.addEventListener("click", () => {
					document.body.classList.remove(
						"dialog-open",
						"rules-open",
						"settings-open"
					);
				});
			});

		document.querySelectorAll(".dialog").forEach((el) => {
			el.addEventListener("click", (event) => {
				// prevents click from propagating to the underlay, which closes the rules
				event.stopPropagation();
			});
		});

		$("#dark-mode").addEventListener("click", function (event) {
			storage.setItem("prefersDarkColorScheme", event.target.checked);
			darkMode = event.target.checked;
			toggleDarkMode(darkMode);
			updateGuesses();
		});

		// theme-button
		$("#theme-button").addEventListener("click", function (event) {
			storage.setItem("prefersDarkColorScheme", !darkMode);

			toggleDarkMode(!darkMode);
			darkMode = !darkMode;
			updateGuesses();
		});

		toggleDarkMode(darkMode);

		if (storage.getItem("prefersDarkColorScheme") === null) {
			$("#dark-mode").checked = false;
			$("#dark-mode").indeterminate = true;
		}

		$("#give-up-btn").addEventListener("click", function (event) {
			if (!gameOver) {
				if (confirm("Haluatko varmasti luovuttaa?")) {
					endGame(false, true);
					if (window.scrollY != 0) {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
				}
			}
		});

		$("#hint-btn").addEventListener("click", async function (event) {
			if (!gameOver) {
				if (secretVec === null) {
					// secretVec = (await getModel(secret)).vec;
					secretVec = (await getSecret(secret)).vec;
				}

				let guessPercentiles = guesses.map((e) => e[2]);
				let filteredPercentiles = guessPercentiles.filter(
					(e) => !isNaN(e)
				);
				let biggestPercentile = Math.max(...filteredPercentiles);

				let reqPercentile = 1;
				if (biggestPercentile >= 1) {
					reqPercentile = biggestPercentile + 100;
				}

				if (biggestPercentile >= 850) {
					reqPercentile = biggestPercentile + 50;
				}

				if (biggestPercentile >= 950) {
					reqPercentile = biggestPercentile + 25;
				}

				if (biggestPercentile >= 965) {
					reqPercentile = biggestPercentile + 15;
				}

				if (biggestPercentile >= 984) {
					reqPercentile = biggestPercentile + 5;
				}

				if (biggestPercentile >= 990) {
					reqPercentile = biggestPercentile + 1;
				}

				let hint = await getHint(secret, reqPercentile);

				let hintWord = hint.neighbor;
				const hintSimilarity = hint.similarity * 100;
				const hintPercentile = hint.percentile;
				const wasHint = true;

				guessCount += 1;
				hintCount += 1;

				const newEntry = [
					hintSimilarity,
					hintWord,
					hintPercentile,
					guessCount,
					wasHint,
				];

				guesses.push(newEntry);
				guessed.add(hintWord);

				if (handleStats) {
					const stats = getStats();
					if (!gameOver) {
						stats["totalGuesses"] += 1;
					}
					storage.setItem("stats", JSON.stringify(stats));
				}

				guesses.sort(function (a, b) {
					return b[0] - a[0];
				});

				if (!gameOver) {
					saveGame(-1, -1);
				}

				chrono_forward = 1;

				latestGuess = hintWord;
				updateGuesses();

				firstGuess = false;
				if (window.scrollY != 0) {
					window.scrollTo({ top: 0, behavior: "smooth" });
				}
			}
		});

		$("#form").addEventListener("submit", async function (event) {
			event.preventDefault();
			if (secretVec === null) {
				// secretVec = (await getModel(secret)).vec;
				secretVec = (await getSecret(secret)).vec;
			}
			$("#guess").focus();
			$("#error").textContent = "";

			let guess = $("#guess")
				.value.trim()
				.replace("!", "")
				.replace("*", "");

			if (!guess) {
				return false;
			}

			if ($("#lower").checked) {
				guess = guess.toLowerCase();
			}

			if (guess[0].toLowerCase() != guess[0]) {
				caps += 1;
			}
			// if (caps >= 2 && caps / guesses.length > 0.4 && !warnedCaps) { // TEMPORARILY DISABLED
			// 	warnedCaps = true;
			// 	$("#lower").checked = confirm(
			// 		'Näytät syöttävän useita isolla kirjaimella alkavia sanoja. Se ei luultavasti ole tarkoituksellista ja saattaa johtua siitä, että puhelimesi näppäimistö syöttää ensimmäinen kirjaimen oletuksena isolla. Do you want me to downcase your guesses for you?'
			// 	);
			// 	storage.setItem("lower", "true");
			// }

			$("#guess").value = "";

			const guessData = await getModel(guess);
			if (!guessData) {
				$("#error").textContent = `En tunnista sanaa "${guess}".`;
				return false;
			}

			let percentile = guessData.percentile;
			let similarity = -1000;

			if (guessData.vec) {
				const guessVec = guessData.vec.map((vec) => parseFloat(vec));
				cache[guess] = guessData;
				similarity = getCosSim(guessVec, secretVec) * 100.0;
			} else {
				similarity = guessData.similarity * 100.0;
			}

			if (!guessed.has(guess)) {
				if (!gameOver) {
					guessCount += 1;
				}
				guessed.add(guess);
				let wasHint = false;

				const newEntry = [
					similarity,
					guess,
					percentile,
					guessCount,
					wasHint,
				];
				guesses.push(newEntry);

				if (handleStats) {
					const stats = getStats();
					if (!gameOver) {
						stats["totalGuesses"] += 1;
					}
					storage.setItem("stats", JSON.stringify(stats));
				}
			}
			guesses.sort(function (a, b) {
				return b[0] - a[0];
			});

			if (!gameOver) {
				saveGame(-1, -1);
			}

			chrono_forward = 1;

			latestGuess = guess;
			updateGuesses();

			firstGuess = false;
			// if (guess.toLowerCase() === secret && !gameOver) {
			if (guess === decodeB64(secret) && !gameOver) {
				endGame(true, true);
			}
			return false;
		});

		hintCount = JSON.parse(storage.getItem("hintsUsed"));
		if (!hintCount) hintCount = 0;

		$("#hint-btn").value = `Vinkki #${hintCount + 1}/${MAX_HINT_AMOUNT}`;

		const winState = storage.getItem("winState");
		if (winState != null) {
			guesses = JSON.parse(storage.getItem("guesses"));
			for (let guess of guesses) {
				guessed.add(guess[1]);
			}
			guessCount = guessed.size;

			latestGuess = "";
			updateGuesses();
			if (winState != -1) {
				endGame(winState > 0, false);
			}
		}
	}

	function openRules() {
		document.body.classList.add("dialog-open", "rules-open");
		storage.setItem("readRules", true);
		$("#rules-close").focus();
	}

	function openSettings() {
		document.body.classList.add("dialog-open", "settings-open");
		$("#settings-close").focus();
	}

	function updateGuesses() {
		let inner = `<tr>
						<th id="chronoOrder">
							#
						</th>
						<th id="alphaOrder">
							Arvaus
						</th>
						<th id="similarityOrder">
							Pisteet
						</th>
						<th id="gettingClose">
							<div class="getting-close-row">Joko polttaa?
								<span class="weirdWord">
									<svg style="height: 1.2em;" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
									</svg>
									<span class="tooltiptext">
										Kun arvaamasi sana on tuhannen lähimmän joukossa, vihreä palkki kertoo, kuinka lähellä se on. Mitä suurempi luku/palkki, sitä lähempänä.
									</span>
								</span></div></th></tr>`;
		/* This is dumb: first we find the most-recent word, and put
           it at the top.  Then we do the rest. */
		for (let entry of guesses) {
			let [similarity, oldGuess, percentile, guessNumber, wasHint] =
				entry;
			if (oldGuess == latestGuess) {
				inner += guessRow(
					similarity,
					oldGuess,
					percentile,
					guessNumber,
					latestGuess,
					wasHint
				);
			}
		}
		inner += "<tr><td colspan=4><hr></td></tr>";
		for (let entry of guesses) {
			let [similarity, oldGuess, percentile, guessNumber, wasHint] =
				entry;
			if (oldGuess != latestGuess) {
				inner += guessRow(
					similarity,
					oldGuess,
					percentile,
					guessNumber,
					null,
					wasHint
				);
			}
		}
		$("#guesses").innerHTML = inner;
		$("#hint-btn").value = `Vinkki #${hintCount + 1}/${MAX_HINT_AMOUNT}`;

		$("#chronoOrder").addEventListener("click", (event) => {
			guesses.sort(function (a, b) {
				return chrono_forward * (a[3] - b[3]);
			});
			chrono_forward *= -1;
			updateGuesses();
		});
		$("#alphaOrder").addEventListener("click", (event) => {
			guesses.sort(function (a, b) {
				return a[1].localeCompare(b[1]);
			});
			chrono_forward = 1;
			updateGuesses();
		});
		$("#similarityOrder").addEventListener("click", (event) => {
			guesses.sort(function (a, b) {
				return b[0] - a[0];
			});
			chrono_forward = 1;
			updateGuesses();
		});

		let guessPercentiles = guesses.map((e) => e[2]);
		let filteredPercentiles = guessPercentiles.filter((e) => !isNaN(e));
		let biggestPercentile = Math.max(...filteredPercentiles);

		if (biggestPercentile == 999) {
			$("#hint-btn").style = "display:none;";
		}

		if (hintCount >= MAX_HINT_AMOUNT) {
			$("#hint-btn").disabled = true;
			$("#hint-btn").value = `Vinkki #${hintCount}/${MAX_HINT_AMOUNT}`;
		}
	}

	function toggleDarkMode(on) {
		document.body.classList[on ? "add" : "remove"]("dark");
		const darkModeCheckbox = $("#dark-mode");

		// this runs before the DOM is ready, so we need to check

		if (darkModeCheckbox) {
			darkModeCheckbox.checked = on;
		}

		if (on && $("#icon-path")) {
			$("#icon-path").setAttribute(
				"d",
				"M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
			);
		}

		if (!on && $("#icon-path")) {
			$("#icon-path").setAttribute(
				"d",
				"M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
			);
		}
	}

	function checkMedia() {
		const storagePrefersDarkColorScheme = storage.getItem(
			"prefersDarkColorScheme"
		);

		if (
			storagePrefersDarkColorScheme === "true" ||
			storagePrefersDarkColorScheme === "false"
		) {
			darkMode = storagePrefersDarkColorScheme === "true";
		} else {
			darkMode = true;
		}

		toggleDarkMode(darkMode);
	}

	function saveGame(guessCount, winState) {
		// If we are in a tab still open from yesterday, we're done here.
		// Don't save anything because we may overwrite today's game!
		let savedPuzzleNumber = storage.getItem("puzzleNumber");
		if (savedPuzzleNumber != puzzleNumber) {
			return;
		}

		storage.setItem("winState", winState);
		storage.setItem("guesses", JSON.stringify(guesses));
		storage.setItem("hintsUsed", JSON.stringify(hintCount));
	}

	function getStats() {
		const oldStats = storage.getItem("stats");
		if (oldStats == null) {
			const stats = {
				firstPlay: puzzleNumber,
				lastEnd: puzzleNumber - 1,
				lastPlay: puzzleNumber,
				winStreak: 0,
				playStreak: 0,
				totalGuesses: 0,
				wins: 0,
				giveups: 0,
				abandons: 0,
				totalPlays: 0,
			};
			storage.setItem("stats", JSON.stringify(stats));
			return stats;
		} else {
			const stats = JSON.parse(oldStats);
			if (stats["lastPlay"] != puzzleNumber) {
				const onStreak = stats["lastPlay"] == puzzleNumber - 1;
				if (onStreak) {
					stats["playStreak"] += 1;
				}
				stats["totalPlays"] += 1;
				if (stats["lastEnd"] != puzzleNumber - 1) {
					stats["abandons"] += 1;
				}
				stats["lastPlay"] = puzzleNumber;
			}
			return stats;
		}
	}

	function endGame(won, countStats) {
		let stats;
		if (handleStats) {
			stats = getStats();
			if (countStats) {
				const onStreak = stats["lastEnd"] == puzzleNumber - 1;

				stats["lastEnd"] = puzzleNumber;
				if (won) {
					if (onStreak) {
						stats["winStreak"] += 1;
					} else {
						stats["winStreak"] = 1;
					}
					stats["wins"] += 1;
				} else {
					stats["winStreak"] = 0;
					stats["giveups"] += 1;
				}
				storage.setItem("stats", JSON.stringify(stats));
			}
		}

		$("#give-up-btn").style = "display:none;";
		$("#hint-btn").style = "display:none;";
		$("#response").classList.add("end-message");

		gameOver = true;
		const secretBase64 = btoa(unescape(encodeURIComponent(secret)));
		let response;
		let decodedSecret = decodeB64(secret);
		if (won) {
			response = `<p>
							<span style="font-weight: 500"> Löysit sanan ${guesses.length}. yrityksellä! </span>Salainen sana on <span style="font-weight: 500">"${decodedSecret}"</span>. Käytit yhteensä ${hintCount} vinkkiä. Voit halutessasi yhä jatkaa sanojen syöttämistä. Listan tuhannesta sanaa "${decodedSecret}" lähimmästä sanasta löydät <a href="nearby_1k/${secret}">täältä</a>.
							<br/><br/>
							Semanttuli-sovellus on nyt myös ladattavissa Android-laitteille <a target="_blank" rel="noopener noreferrer" href="https://play.google.com/store/apps/details?id=com.herokuapp.semanttuli.twa">Google Play
							Kaupasta</a>!
							<br/>
							<div class="share-and-toggle-stats">
								<span style="align-self: center">
									Klikkaa <a href="javascript:share();">tästä</a> jakaaksesi tuloksesi.
								</span>
								<button onclick="toggleStatVisibility()" id="toggle-stats-btn">Näytä tilastot</button>
							</div>
						</p>`;
		} else {
			response = `<p>
							Luovutit! Salainen sana olisi ollut <span style="font-weight: 500">"${decodedSecret}"</span>. Voit jatkaa sanojen syöttämistä, jos haluat yhä tutkia sanojen samankaltaisuutta. Näet salaista sanaa lähimmät sanat <a href="nearby_1k/${secret}">täällä</a>.
							<br/><br/>
							Klikkaa <a href="javascript:share(true);">tästä</a> jakaaksesi silti tuloksesi.</span>
						</p>`;
		}

		if (handleStats) {
			const totalGames =
				stats["wins"] + stats["giveups"] + stats["abandons"];

			let guessesAvg = (stats["totalGuesses"] / totalGames).toFixed(2);

			// <tr> // Ensimmäisen pelin järjestysnumero
			// 	<th>Ensimmäinen peli:</th>
			// 	<td>${stats["firstPlay"]}</td></tr>
			// <tr></tr>

			response += `<div id="stats">
						<div><hr/></div>
						<table>
							<tr>
								<th>Pelipäiviä yhteensä:</th>
								<td>${totalGames}</td>
							</tr>
							<tr>
								<th>Voittoja:</th>
								<td>${stats["wins"]}</td>
							</tr>
							<tr>
								<th>Voittoputki:</th>
								<td>${stats["winStreak"]}</td>
							</tr>
							<tr>
								<th>Luovutuksia:</th>
								<td>${stats["giveups"]}</td>
							</tr>
							<tr>
								<th>Pelejä jäänyt kesken:</th>
								<td>${stats["abandons"]}</td>
							</tr>
							<tr>
								<th>Arvauksia kaikissa peleissä:</th>
								<td>${stats["totalGuesses"]}</td></tr>
							<tr>
								<th>Pelien keskimääräinen arvausmäärä:</th>
								<td>${guessesAvg}</td>
							</tr>
						</table></div>`;
		}
		$("#response").innerHTML = response;

		if (countStats) {
			saveGame(guesses.length, won ? 1 : 0);
		}
	}

	return {
		init: init,
		checkMedia: checkMedia,
	};
})();

// do this when the file loads instead of waiting for DOM to be ready to avoid
// a flash of unstyled content
Semanttuli.checkMedia();

window.addEventListener("load", async () => {
	Semanttuli.init();
});
