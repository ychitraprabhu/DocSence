function addItem(data, itemDetails) {
  const newItem = {
    id: Date.now(),
    profileId: data.activeProfile,
    name: itemDetails.name,
    category: itemDetails.category,
    expiryDate: itemDetails.expiryDate,
    purchaseDate: itemDetails.purchaseDate || null,
    value: itemDetails.value || 0,
    receiptImage: itemDetails.receiptImage || null,
    notes: itemDetails.notes || ""
  };

  data.profiles[data.activeProfile].push(newItem);
  return data;
}

function editItem(data, itemId, updatedFields) {
  const items = data.profiles[data.activeProfile];
  const item = items.find(function (i) { return i.id === itemId; });

  if (item) Object.assign(item, updatedFields);
  return data;
}

function deleteItem(data, itemId) {
  const items = data.profiles[data.activeProfile];
  data.profiles[data.activeProfile] = items.filter(function (i) { return i.id !== itemId; });
  return data;
}

// days left until expiry (negative = already expired)
function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((expiry - today) / msPerDay);
}

// how far through the warranty/coverage period an item is, 0 to 100
function getProgressPercent(purchaseDate, expiryDate) {
  const purchase = new Date(purchaseDate);
  const expiry = new Date(expiryDate);
  const today = new Date();

  const totalDays = (expiry - purchase) / (1000 * 60 * 60 * 24);
  const usedDays = (today - purchase) / (1000 * 60 * 60 * 24);

  if (totalDays <= 0) return 100;

  let percent = Math.round((usedDays / totalDays) * 100);
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  return percent;
}

// how many items expire this calendar month
function getExpiringCountThisMonth(data) {
  const items = data.profiles[data.activeProfile];
  const today = new Date();
  let count = 0;

  items.forEach(function (item) {
    const expiry = new Date(item.expiryDate);
    if (expiry.getMonth() === today.getMonth() && expiry.getFullYear() === today.getFullYear()) {
      count = count + 1;
    }
  });

  return count;
}