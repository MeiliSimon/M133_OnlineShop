const validateInputs = document.querySelectorAll(".validate input");
console.log(validateInputs);
validateInputs.forEach((element) => {
  console.log(element);
  element.addEventListener("input", () => {
    validateForm();
  });
});
function validateForm() {
  const form = document.querySelector("#checkoutForm");
  const submitButton = document.querySelector("#submitButton");
  if (form.checkValidity()) {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "");
  }
}

async function checkout() {
  event.preventDefault();
  let alerts = document.querySelector("#alert");
  alerts.innerHTML = "";
  if (document.querySelector("#cartBadge").innerText == "0") {
    let alert = document.createElement("div");
    alert.className = "alert alert-warning";
    alert.setAttribute("role", "alert");
    alert.innerText = "Ihr Warenkorb ist leer, kein Checkout möglich";
    let link = document.createElement("a");
    link.setAttribute("href", "/");
    link.innerText = " weiter einkaufen";
    alert.appendChild(link);
    document.querySelector("#alert").appendChild(alert);
    alerts.appendChild(alert);
  } else {
    const checkoutForm = {
      email: document.querySelector("#email").value,
      vorname: document.querySelector("#vorname").value,
      nachname: document.querySelector("#nachname").value,
    };
    const response = await fetch("/checkout", {
      body: JSON.stringify(checkoutForm),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(response);
    const responseJson = await response.json();
    const data = responseJson.data;
    if (responseJson.code == 1) {
      let alert = document.createElement("div");
      alert.className = "alert alert-danger";
      alert.setAttribute("role", "alert");
      let title = document.createElement("h4");
      title.innerText = responseJson.message;
      alert.appendChild(title);
      let errors = responseJson.data.errorList;
      errors.forEach((error) => {
        let errorText = document.createElement("p");
        errorText.innerText = error;
        alert.appendChild(errorText);
      });
      alerts.appendChild(alert);
    } else if (responseJson.code == 0) {
      let alert = document.createElement("div");
      alert.className = "alert alert-success";
      alert.setAttribute("role", "alert");
      alert.innerText = responseJson.message;
      let link = document.createElement("a");
      link.setAttribute("href", "/");
      link.innerText = " weiter einkaufen";
      alert.appendChild(link);
      document.querySelector("#alert").appendChild(alert);
      alerts.appendChild(alert);
      getMiniCart();
    }
  }
}
