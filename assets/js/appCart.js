class Cart {
    constructor(){
        this.cartItems = new Array();
    }
    Count() {
        let count = 0;
        this.cartItems.forEach((item)=>count += item.count
        );
        return count;
    }
    Total() {
        let total = 0;
        this.cartItems.forEach((item)=>total += (item.product.specialOffer == null ? item.product.normalPrice : item.product.specialOffer) * item.count
        );
        return total;
    }
}
async function loadCart() {
    let cart = new Cart();
    let cartItems = await getCartItems();
    cart.cartItems = cartItems;
    console.log(cart.Count(), cart.Total());
    displayCart(cartItems);
}
async function getCartItems() {
    const response = await fetch("/getCartItems", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "GET"
    });
    const responseJson = await response.json();
    const data = responseJson.data;
    return data.cartItems;
}
function displayCart(cartItems) {
    console.log(cartItems);
    const cart = new Cart();
    cart.cartItems = cartItems;
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";
    cart.cartItems.forEach((cartItem)=>{
        let row = createRow();
        let colName = createCol(cartItem.product.productName, 5);
        let colPrice = createCol(cartItem.product.specialOffer == null ? cartItem.product.normalPrice.toFixed(2) : cartItem.product.specialOffer.toFixed(2), 2);
        let colCount = createCount(cartItem.count, cartItem.product.id);
        let colTotal = createCol(((cartItem.product.specialOffer == null ? cartItem.product.normalPrice.toFixed(2) : cartItem.product.specialOffer.toFixed(2)) * cartItem.count).toFixed(2), 2);
        row.appendChild(colName);
        row.appendChild(colPrice);
        row.appendChild(colCount);
        row.appendChild(colTotal);
        cartDiv.appendChild(row);
    });
    let totalRow = createRow();
    let titleCol = createCol("Total", 10);
    let totalCol = createCol(cart.Total().toFixed(2).toString(), 2);
    totalCol.id = "total";
    totalRow.appendChild(titleCol);
    totalRow.appendChild(totalCol);
    cartDiv.appendChild(totalRow);
    setEventListeners();
}
function setEventListeners() {
    let buttons = document.querySelectorAll("button");
    buttons.forEach((element)=>element.addEventListener("click", ()=>{
            "refresh";
            loadCart();
            getMiniCart();
        })
    );
}
function createRow() {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    return row;
}
function createCol(value, size) {
    let col = document.createElement("div");
    col.setAttribute("class", `col-${size}`);
    col.innerHTML = value;
    return col;
}
function createCount(count, id) {
    let col = document.createElement("div");
    col.setAttribute("class", "col-3");
    let btnRemove = document.createElement("button");
    btnRemove.textContent = "-";
    btnRemove.className = "btn btn-danger countBtn";
    btnRemove.setAttribute("onclick", `removeFromCart('${id}')`);
    let textCount = document.createElement("span");
    textCount.className = "countText";
    textCount.textContent = count.toString();
    let btnAdd = document.createElement("button");
    btnAdd.textContent = "+";
    btnAdd.className = "btn btn-primary countBtn";
    btnAdd.setAttribute("onclick", `addToCart('${id}')`);
    col.appendChild(btnRemove);
    col.appendChild(textCount);
    col.appendChild(btnAdd);
    return col;
}
export { loadCart };
