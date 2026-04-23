const STORAGE_KEY = "lcm-content";
const FEEDBACK_KEY = "lcm-feedback";
const ADMIN_CODE = "mosque-admin";

const defaultData = {
  prayerTimes: [
    { name: "Fajr", time: "05:00" },
    { name: "Dhuhr", time: "14:00" },
    { name: "Asr", time: "18:30" },
    { name: "Maghrib", time: "20:30" },
    { name: "Isha", time: "22:15" },
    { name: "Jumu'ah", time: "13:30" }
  ],
  events: [
    { title: "Food Bank", details: "Every Wednesday at 1:00 PM till 2:30 PM" },
    { title: "Thursday Gathering", details: "Every Thursday at 7:30 PM" },
    { title: "Weekly Litter Pick", details: "Every Saturday at 11 AM" },
    { title: "Daily Quran Classes", details: "Every Weekday from 4:30 to 7:30 PM" },
    { title: "Daily Islamic Studies Classes", details: "Every Weekday from 7:30 to 8:30 PM" },
    { title: "Upcoming Summer Youth scheme", details: "Will begin in the second week of the summer holidays, taking place across a 4 week period, more details to be released soon" },

  ],
  announcements: [
    {
      title: "Prayer Timetable update",
      details: "Updated timetable will be released next week."
    },
    {
    title: "Parking restrictions",
    details: "Please avoid blocking residential driveways during prayer times, JazakAllah."
  },
    {
    title: "Donation appeal",
    details: "Support the mosque expansion project with your generousity. Donations can be made online or in person."
  },
    {
    title: "Masjid maintenance notice",
    details: "The mosque will undergo cleaning on Sunday after Fajr. Some areas may be temporarily closed for use."
  },
   {
    title: "New Quran class enrollment",
    details: "Registrations are now open for children’s Quran classes."
  },
  ],
funerals: [
  { 
    title: "Janazah notice", 
    details: "Brother Ahmed, Janazah after Dhuhr prayer." 
  },
  { 
    title: "Burial notice", 
    details: "Uncle Raja Naseer, burial at Handsworth Cemetery at 4:00 PM." 
  },
  { 
    title: "Ghusl notice for sisters", 
    details: "Ghusl for a sister will take place at 1:00 PM." 
  }
],
  sermons: [
    { title: "Friday Khutbah at 1:00", details: "Urdu speech" },
    { title: "Friday Khutbah at 2:15", details: "English speech" },
    { title: "Friday Khutbah at 3:45", details: "English speech" },
  ]
};

const singularLabels = {
  events: "event",
  announcements: "announcement",
  funerals: "funeral notice",
  sermons: "sermon"
};

function byId(id) {
  return document.getElementById(id);
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : structuredClone(defaultData);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function applyDeviceClass() {
  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const isTouchDevice = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
  const isMobile = isSmallScreen || isTouchDevice;

  document.body.classList.toggle("is-mobile", isMobile);
  document.body.dataset.device = isMobile ? "mobile" : "desktop";
}

function renderDynamicSections() {
  const data = loadData();
  renderPrayerTimes(data);
  renderList("events-list", data.events);
  renderList("announcements-list", data.announcements);
  renderList("funerals-list", data.funerals);
  renderList("sermons-list", data.sermons);
}

function wireStorageSync() {
  window.addEventListener("storage", (event) => {
    if (event.key === STORAGE_KEY) {
      renderDynamicSections();
    }

    if (event.key === FEEDBACK_KEY) {
      const feedbackList = byId("feedback-list");
      if (!feedbackList) return;

      feedbackList.innerHTML = "";
      const freshFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
      freshFeedback.forEach((entry) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${entry.name}:</strong> ${entry.message}`;
        feedbackList.appendChild(li);
      });
    }
  });
}

function parseTimeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getPrayerStatus(prayerTimes) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = prayerTimes
    .map((prayer) => ({ ...prayer, total: parseTimeToMinutes(prayer.time) }))
    .sort((a, b) => a.total - b.total);

  let currentPrayer = sorted[sorted.length - 1];
  let nextPrayer = sorted[0];

  for (let i = 0; i < sorted.length; i += 1) {
    if (nowMinutes < sorted[i].total) {
      nextPrayer = sorted[i];
      currentPrayer = sorted[(i - 1 + sorted.length) % sorted.length];
      break;
    }
  }

  return { currentPrayer, nextPrayer };
}

function renderList(listId, items = []) {
  const list = byId(listId);
  if (!list) return;

  list.innerHTML = "";

  const listItems = [...items];
  if (!listItems.length) {
    const empty = document.createElement("li");
    empty.textContent = "No updates available yet.";
    list.appendChild(empty);
    return;
  }

  listItems.forEach((item) => {
    const li = document.createElement("li");
    const title = document.createElement("strong");

    title.textContent = item.title;
    li.appendChild(title);
    li.appendChild(document.createElement("br"));
    li.append(document.createTextNode(item.details));

    list.appendChild(li);
  });
}

function renderPrayerTimes(data) {
  const tableBody = byId("prayer-table");
  const status = byId("prayer-status");
  if (!tableBody || !status) return;

  const { currentPrayer, nextPrayer } = getPrayerStatus(data.prayerTimes);
  status.textContent = `Now: ${currentPrayer.name}. Next: ${nextPrayer.name} at ${nextPrayer.time}.`;

  tableBody.innerHTML = "";
  data.prayerTimes.forEach((prayer) => {
    const row = document.createElement("tr");
    if (prayer.name === currentPrayer.name) row.classList.add("active-prayer");

    const prayerCell = document.createElement("td");
    prayerCell.textContent = prayer.name;

    const timeCell = document.createElement("td");
    timeCell.textContent = prayer.time;

    row.append(prayerCell, timeCell);
    tableBody.appendChild(row);
  });
}

function wireDonationForm() {
  const donationForm = byId("donation-form");
  const donationStatus = byId("donation-status");
  if (!donationForm || !donationStatus) return;

  donationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = byId("donation-type")?.value;
    const amount = byId("donation-amount")?.value;

    if (!type || !amount) {
      donationStatus.textContent = "Please choose a fund and amount before continuing.";
      return;
    }

    donationStatus.textContent = `Thanks — we would now send you to secure checkout for £${amount} (${type}).`;
    donationForm.reset();
  });
}

function wireFeedbackForm() {
  const feedbackForm = byId("feedback-form");
  const feedbackList = byId("feedback-list");
  if (!feedbackForm || !feedbackList) return;

  const existingFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
  existingFeedback.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.name}:</strong> ${entry.message}`;
    feedbackList.appendChild(li);
  });

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = byId("feedback-name")?.value.trim();
    const message = byId("feedback-message")?.value.trim();
    if (!name || !message) return;

    const feedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || "[]");
    const newEntry = { name, message };
    feedback.push(newEntry);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));

    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}:</strong> ${message}`;
    feedbackList.appendChild(li);

    feedbackForm.reset();
  });
}

function renderHomePage() {
  renderDynamicSections();
  wireDonationForm();
  wireFeedbackForm();
  wireStorageSync();

  const year = byId("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function wireAdminPage() {
  const authForm = byId("auth-form");
  const authStatus = byId("auth-status");
  const adminTools = byId("admin-tools");
  const prayerEditor = byId("prayer-editor");
  const adminForm = byId("admin-form");
  const prayerForm = byId("prayer-form");

  if (!authForm || !authStatus || !adminTools || !prayerEditor || !adminForm || !prayerForm) return;

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = byId("admin-code")?.value;

    if (code === ADMIN_CODE) {
      adminTools.hidden = false;
      prayerEditor.hidden = false;
      authStatus.textContent = "Welcome back. Admin tools are unlocked.";
      return;
    }

    authStatus.textContent = "That code was not recognised. Please try again.";
  });

  adminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = loadData();

    const type = byId("content-type")?.value;
    const title = byId("content-title")?.value.trim();
    const details = byId("content-details")?.value.trim();

    if (!type || !data[type] || !title || !details) {
      authStatus.textContent = "Please fill in all fields before publishing.";
      return;
    }

    data[type].push({ title, details });
    saveData(data);
    adminForm.reset();

    const singular = singularLabels[type] || "update";
    authStatus.textContent = `New ${singular} published.`;
  });

  prayerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = loadData();

    const prayerName = byId("prayer-name")?.value;
    const prayerTime = byId("prayer-time")?.value;
    if (!prayerName || !prayerTime) return;

    const prayer = data.prayerTimes.find((item) => item.name === prayerName);
    if (!prayer) return;

    prayer.time = prayerTime;
    saveData(data);
    prayerForm.reset();
    authStatus.textContent = `${prayerName} updated to ${prayerTime}.`;
  });
}

applyDeviceClass();
window.addEventListener("resize", applyDeviceClass);
window.addEventListener("orientationchange", applyDeviceClass);

if (window.location.pathname.endsWith("admin.html")) {
  wireAdminPage();
} else {
  renderHomePage();
}
