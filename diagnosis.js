document.addEventListener("DOMContentLoaded", () => {
  const quizContainer = document.getElementById("quiz-container");

  const questions = [
    {
      q: "あなたは価格変動が激しい投資に抵抗はありますか？",
      a: { yes: "証券", no: "FX" }
    },
    {
      q: "スマホアプリで気軽に取引したい？",
      a: { yes: "仮想通貨", no: "証券" }
    },
    {
      q: "為替ニュースを日常的にチェックする？",
      a: { yes: "FX", no: "証券" }
    },
    {
      q: "短期で売買するより長期保有が好き？",
      a: { yes: "証券", no: "FX" }
    },
    {
      q: "取扱銘柄の種類が多いほうが安心？",
      a: { yes: "証券", no: "仮想通貨" }
    }
  ];

  let index = 0;
  const answers = { 証券: 0, FX: 0, 仮想通貨: 0 };

  function showQuestion() {
    if (index < questions.length) {
      const q = questions[index];
      quizContainer.innerHTML = `
        <p class="question">${q.q}</p>
        <div class="btn-group">
          <button class="ans-btn" data-choice="yes">はい</button>
          <button class="ans-btn" data-choice="no">いいえ</button>
        </div>
      `;
      document.querySelectorAll(".ans-btn").forEach(btn =>
        btn.addEventListener("click", () => {
          const choice = btn.dataset.choice;
          const type = q.a[choice];
          answers[type]++;
          index++;
          showQuestion();
        })
      );
    } else {
      const result = Object.entries(answers).sort((a, b) => b[1] - a[1])[0][0];
      showResult(result);
    }
  }

  function showResult(result) {
    let link = "";
    if (result === "証券") link = "syoukensyoukai.html";
    else if (result === "FX") link = "FX-syoukai.html";
    else link = "kasoutuuka-hikaku.html";

    quizContainer.innerHTML = `
      <h3>診断結果：あなたは<strong>${result}</strong>タイプです！</h3>
      <p><a href="${link}" class="diagnosis-link">おすすめの${result}口座を見る</a></p>
    `;
  }

  document.getElementById("start-btn").addEventListener("click", showQuestion);
});
