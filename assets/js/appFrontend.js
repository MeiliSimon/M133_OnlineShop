getMiniCart();

async function getMiniCart() {
  const response = await fetch("/minicart", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  const responseJson = await response.json();
  const data = responseJson.data;
  console.log("GETMINICART", data);
  updateMiniCart(data.count, data.total);
}

async function addToCart(productId) {
  console.log("add", productId);
  const response = await fetch("/cart/" + productId, {
    body: JSON.stringify(null),
    headers: {
      "Content-Type": "application/json",
    },
    method: "PUT",
  });
  const responseJson = await response.json();
  const data = responseJson.data;
  console.log(window.location.pathname);
  updateMiniCart(data.count, data.total);
}
async function removeFromCart(productId) {
  console.log("remove", productId);
  const response = await fetch("/cart/" + productId, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
  const responseJson = await response.json();
  const data = responseJson.data;
  updateMiniCart(data.count, data.total);
}

function updateMiniCart(count, total) {
  const badge = document.getElementById("cartBadge");
  console.log(badge);
  badge.innerText = count;

  const text = document.getElementById("cartText");
  text.innerText = "CHF " + total.toFixed(2);
}
