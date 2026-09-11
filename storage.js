const STORAGE_KEY = "docsence_data";

// get saved data, or default empty structure if none exists
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      profiles: { "Me": [] },
      activeProfile: "Me"
    };
  }

  return JSON.parse(raw);
}

// save data back to localStorage
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}