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

// total value of items expiring this calendar month
function getFinancialRiskThisMonth(data) {
  const items = data.profiles[data.activeProfile];
  const today = new Date();
  let total = 0;

  items.forEach(function (item) {
    const expiry = new Date(item.expiryDate);
    if (expiry.getMonth() === today.getMonth() && expiry.getFullYear() === today.getFullYear()) {
      total += Number(item.value) || 0;
    }
  });

  return total;
}