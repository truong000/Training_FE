let currentDay = new Date();
const dayTable = document.getElementById("daytable");
const datetimeBtn = document.getElementById("datetime-btn");
const datetimeBtnContent = document.getElementById("datetime-btn-content");
const monthSelectElement = document.getElementById("month");
const yearSelectElement = document.getElementById("year");
const doubleBackBtn = document.getElementById("doubleBack");
const backBtn = document.getElementById("back");
const nextBtn = document.getElementById("next");
const doubleNextBtn = document.getElementById("doubleNext");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

months.forEach((m, i) => {
  const newmon = document.createElement("option");
  newmon.innerHTML = m;
  newmon.setAttribute("value", i);
  monthSelectElement.appendChild(newmon);
});

for (let i = 1900; i < 2100; i++) {
  const newyear = document.createElement("option");
  newyear.innerHTML = "" + i;
  newyear.setAttribute("value", i);
  yearSelectElement.appendChild(newyear);
}

/**
 * 
 * @return {HTMLLIElement}
 */
const createBlankDay = () => {
  const blankDay = document.createElement("li");
  blankDay.setAttribute("class", "calendar__daynum--item blank");
  return blankDay;
};

/**
 * 
 * @param {number} num 
 * @return {HTMLLIElement} 
 */
const createNormalDayContent = (num) => {
  const li = document.createElement("p");
  li.textContent = num;
  li.addEventListener("click", () => handleChangeDay(num))
  return li;
};

const createNormalDay = (daynum, isActive = false) => {
  const normalDay = document.createElement("li");
  normalDay.setAttribute("class", "calendar__daynum--item");

  if (isActive) {
    normalDay.classList.add("active");
  } else {
    normalDay.addEventListener("mouseenter", () => {
      normalDay.classList.add("active");
    });
    normalDay.addEventListener("mouseleave", () => {
      normalDay.classList.remove("active");
    });
  }

  normalDay.appendChild(createNormalDayContent(daynum));
  return normalDay;
};

/**
 * rerenderControllers
 */
const rerenderControllers = (curDay) => {
  datetimeBtnContent.innerHTML =
    curDay.getDate() +
    "/" +
    (curDay.getMonth() + 1) +
    "/" +
    curDay.getFullYear();
  monthSelectElement.value = curDay.getMonth();
  yearSelectElement.value = curDay.getFullYear();
};

/**
 * @param {Date} curDay
 */
const renderDayOfMonth = (curDay = currentDay) => {
  dayTable.innerHTML = "";
  const firstDay = new Date(curDay.getFullYear(), curDay.getMonth(), 0);
  const lastDay = new Date(curDay.getFullYear(), curDay.getMonth() + 1, 0);
  const dow = firstDay.getDay() + 1;
  const tt = lastDay.getDate();

  for (let blank = 0; blank < dow % 7; blank++) {
    dayTable.appendChild(createBlankDay());
  }

  for (let day = 1; day <= tt; day++) {
    dayTable.appendChild(createNormalDay(day, day === curDay.getDate()));
  }

  for (let blank = dayTable.childElementCount; blank < 42; blank++) {
    dayTable.appendChild(createBlankDay());
  }

  rerenderControllers(curDay);
};

const handleChangeInputDay = (e) => {
  const value = new Date(e.target.value);
  currentDay = value;
  renderDayOfMonth();
};

/**
 *
 * @param {number} e
 */
const handleChangeOptionMonth = (e) => {
  if (e.target.value) {
    currentDay.setMonth(e.target.value);
    renderDayOfMonth();
  }
};

/**
 *
 * @param {number} e
 */
const handleChangeOptionYear = (e) => {
  if (e.target.value) {
    currentDay.setFullYear(e.target.value);
    renderDayOfMonth();
  }
};

/**
 * 
 * @param {number} newDay 
 */
const handleChangeDay = (newDay) => {
  currentDay.setDate(newDay);
  renderDayOfMonth();
}

/**
 * @param {number} nMonth
 */
const handleClickControllerBtn = (nMonth) => {
  currentDay.setMonth(currentDay.getMonth() + nMonth);
  renderDayOfMonth();
};

monthSelectElement.addEventListener("change", handleChangeOptionMonth);
yearSelectElement.addEventListener("change", handleChangeOptionYear);
doubleBackBtn.addEventListener("click", () => handleClickControllerBtn(-2));
backBtn.addEventListener("click", () => handleClickControllerBtn(-1));
doubleNextBtn.addEventListener("click", () => handleClickControllerBtn(1));
nextBtn.addEventListener("click", () => handleClickControllerBtn(2));
renderDayOfMonth();
