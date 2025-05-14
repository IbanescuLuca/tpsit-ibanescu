<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>Clicca il Rosso!</title>
  <style>
    #square {
      width: 150px;
      height: 150px;
      background-color: grey;
      margin: 100px auto;
      display: none;
      cursor: pointer;
    }
    body {
      text-align: center;
      font-family: sans-serif;
    }
    #downloadBtn {
      display: none;
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 16px;
    }
  </style>
</head>
<body>

<h1>🟥 Clicca il Quadrato Rosso!</h1>
<div id="square"></div>
<p id="info"></p>
<button id="downloadBtn">📥 Scarica risultati JSON</button>

<script>
  const square = document.getElementById("square");
  const info = document.getElementById("info");
  const downloadBtn = document.getElementById("downloadBtn");

  let reactionTimes = [];
  let startTime;
  let rounds = 0;
  const maxRounds = 10;

  function startRound() {
    square.style.display = "none";
    info.textContent = "Attendi che diventi rosso...";

    const delay = Math.random() * 2000 + 1000;

    setTimeout(() => {
      square.style.backgroundColor = "red";
      square.style.display = "block";
      startTime = Date.now();
    }, delay);
  }

  square.addEventListener("click", () => {
    const reaction = Date.now() - startTime;
    reactionTimes.push(reaction);
    rounds++;

    info.textContent = `⏱ Tempo di reazione: ${reaction} ms`;

    if (rounds < maxRounds) {
      setTimeout(startRound, 1000);
    } else {
      const avg = Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length);
      info.textContent = `🎉 Gioco finito! Media: ${avg} ms\n\nTempi di reazione per ogni round:`;
      reactionTimes.forEach((time, index) => {
        info.textContent += `\nRound ${index + 1}: ${time} ms`;
      });
      square.style.display = "none";
      downloadBtn.style.display = "inline-block";
    }
  });

  const intervalId = setInterval(() => {
    if (rounds < maxRounds) {
      startRound();
    } else {
      clearInterval(intervalId);
    }
  }, 4000);

  // Avvio iniziale
  startRound();

  // Funzione per scaricare i dati in formato JSON
  downloadBtn.addEventListener("click", () => {
    const result = {
      data: reactionTimes.map((time, index) => ({
        round: index + 1,
        reactionTimeMs: time
      })),
      averageMs: Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length)
    };

    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "risultati_tempi_reazione.json";
    a.click();

    URL.revokeObjectURL(url);
  });
</script>

</body>
</html>
