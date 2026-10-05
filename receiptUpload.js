let currentReceiptImage = null;

function initReceiptUpload() {
  const input = document.getElementById("itemReceipt");
  const preview = document.getElementById("receiptPreview");
  if (!input) return;

  input.addEventListener("change", function () {
    const file = input.files[0];

    if (!file) {
      currentReceiptImage = null;
      preview.style.display = "none";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      currentReceiptImage = e.target.result;
      preview.src = currentReceiptImage;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  });
}

function getReceiptImage() {
  return currentReceiptImage;
}

function clearReceiptImage() {
  currentReceiptImage = null;
  const preview = document.getElementById("receiptPreview");
  const input = document.getElementById("itemReceipt");
  if (preview) {
    preview.style.display = "none";
    preview.src = "";
  }
  if (input) input.value = "";
}
