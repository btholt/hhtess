const NORMALIZING_DENOMINATOR = 2.76;

const questions = [
  {
    text: "How often do you TYPICALLY have nose bleeding?",
    options: [
      { text: "Less than once per month", weight: 0 },
      { text: "Once per month", weight: 1 },
      { text: "Once per week", weight: 2 },
      { text: "Several per week", weight: 3 },
      { text: "Once per day", weight: 4 },
      { text: "Several per day", weight: 5 },
    ],
    numerator: 0.14,
    denominator: 0.7,
  },
  {
    text: "How long does your TYPICAL nose bleeding last?",
    options: [
      { text: "< 1 minute", weight: 0 },
      { text: "1-5 minutes", weight: 0 },
      { text: "6-15 minutes", weight: 0 },
      { text: "16-30 minutes", weight: 0 },
      { text: "> 30 minutes", weight: 0 },
    ],
    numerator: 0.25,
    denominator: 1,
  },
  {
    text: "How would you describe your TYPICAL nose bleeding intensity?",
    options: [
      { text: "Not Typically Gushing or Pouring", weight: 0 },
      { text: "Typically Gushing or Pouring", weight: 0 },
    ],
    numerator: 0.25,
    denominator: 0.25,
  },
  {
    text: "Have you sought medical attention for your nose bleeding?",
    options: [
      { text: "No", weight: 0 },
      { text: "Yes", weight: 0 },
    ],
    numerator: 0.3,
    denominator: 0.3,
  },
  {
    text: "Are you anemic (low blood counts) currently?",
    options: [
      { text: "No", weight: 0 },
      { text: "Yes", weight: 0 },
      { text: "I don't know", weight: 0 },
    ],
    numerator: 0.2,
    denominator: 0.2,
  },
  {
    text:
      "Have you received a red blood cell transfusion SPECIFICALLY for nose bleeding?",
    options: [
      { text: "No", weight: 0 },
      { text: "Yes", weight: 0 },
    ],
    numerator: 0.31,
    denominator: 0.31,
  },
];

const templateQuestion = ({ text, options }, id) => `
  <div id="epistaxis-${id}">
  <p>
    ${text}
  </p>
  ${options
    .map(
      ({ text }, index) => `
      <label for="epistaxis-${id}-${index}">
      <input type="radio" id="epistaxis-${id}-${index}" name="epistaxis-${id}" value="${index}" />
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
    <button type="submit">Calculate Score</button>
    <div>
      <p>Calculated Score</p>
      <div id="epistaxis-score"> — </div>
    </div>
  </div>
`;

const templateApp = () => `
  <form id="epistaxis-form">
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

  document.getElementById("epistaxis-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Array.from(new FormData(e.target).entries());

    if (data.length !== questions.length) {
      alert("please answer all the questions");
      return;
    }

    const value = calculateScore(data.map(([_, val]) => val));

    document.getElementById("epistaxis-score").innerText = value;
  });
};
