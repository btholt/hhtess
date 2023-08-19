const NORMALIZING_DENOMINATOR = 0.276;

const questions = [
  {
    text: "How often do you TYPICALLY have nose bleeding?",
    options: [
      { text: "Less than once per month" },
      { text: "Once per month" },
      { text: "Once per week" },
      { text: "Several per week" },
      { text: "Once per day" },
      { text: "Several per day" },
    ],
    numerator: 0.14,
  },
  {
    text: "How long does your TYPICAL nose bleeding last?",
    options: [
      { text: "< 1 minute" },
      { text: "1-5 minutes" },
      { text: "6-15 minutes" },
      { text: "16-30 minutes" },
      { text: "> 30 minutes" },
    ],
    numerator: 0.25,
  },
  {
    text: "How would you describe your TYPICAL nose bleeding intensity?",
    options: [
      { text: "Not Typically Gushing or Pouring" },
      { text: "Typically Gushing or Pouring" },
    ],
    numerator: 0.25,
  },
  {
    text: "Have you sought medical attention for your nose bleeding?",
    options: [{ text: "No" }, { text: "Yes" }],
    numerator: 0.3,
  },
  {
    text: "Are you anemic (low blood counts) currently?",
    options: [
      { text: "No" },
      { text: "Yes" },
      { text: "I don't know", override: "0" },
    ],
    numerator: 0.2,
  },
  {
    text: "Have you received a red blood cell transfusion SPECIFICALLY for nose bleeding?",
    options: [{ text: "No" }, { text: "Yes" }],
    numerator: 0.31,
  },
];

const templateQuestion = ({ text, options }, id) => `
  <div id="epistaxis-${id}" class="epistaxis-question">
  <p>
    ${text}
  </p>
  ${options
    .map(
      ({ text, override }, index) => `
      <input type="radio" id="epistaxis-${id}-${index}" name="epistaxis-${id}" value="${
        override ? override : index
      }" />
      <label for="epistaxis-${id}-${index}">
      ${text}
      </label>
  `
    )
    .join("\n")}
  </select>
</div>
`;

const templateControls = () => `
  <div>
    <div>
      <p>Normalized Epistaxis Severity Score</p>
      <div id="epistaxis-score"> — </div>
      <img class="hidden" id="scale" src="./scale.png" alt="scale of severity of scores. 0 through 1 are none, 1 through 4 are mild, 4 through 7 are moderate, and 7 through 10 are severe" />
      <div>
        <button id="print" type="button" disabled="disabled">Print</button>
      </div>
    </div>
  </div>
`;

const templateApp = () => `
  <form id="epistaxis-form">
    <img src="./logo.png" alt="cure htt logo" class="cure-htt-logo" />
    <p class="instructions">Answer each question about your symptoms as they have occurred over the past three months.</p>
    ${questions.map(templateQuestion).join("\n")}
    ${templateControls()}
  </form>
`;

const calculateScore = (values) => {
  let numerator = 0;
  for (let i = 0; i < values.length; i++) {
    numerator += values[i] * questions[i].numerator;
  }

  return numerator / NORMALIZING_DENOMINATOR;
};

window.epistaxisRenderTo = (targetId = "target") => {
  const node = document.getElementById(targetId);
  node.innerHTML = templateApp();
  const form = document.getElementById("epistaxis-form");
  const printBtn = document.getElementById("print");
  const scale = document.getElementById("scale");
  const score = document.getElementById("epistaxis-score");

  form.addEventListener("click", (e) => {
    const data = Array.from(new FormData(form).entries());
    if (data.length !== questions.length) {
      return;
    }

    const value = calculateScore(data.map(([_, val]) => val));
    score.innerText = value.toFixed(2);
    scale.classList.remove("hidden");
    printBtn.removeAttribute("disabled");
  });

  printBtn.addEventListener("click", () => window.print());
};
