const menu = [
  {
    name: "Americano Iced",
    price: 10000,
    qty: 0,
  },
  {
    name: "Koffea Bapack Iced",
    price: 12000,
    qty: 0,
  },
  {
    name: "Koffea Bapack Hot",
    price: 10000,
    qty: 0,
  },
  {
    name: "Koffea Amber Iced",
    price: 13000,
    qty: 0,
  },
  {
    name: "Koffea Island Iced",
    price: 13000,
    qty: 0,
  },
  {
    name: "Koffea Island Hot",
    price: 11000,
    qty: 0,
  },
  {
    name: "Koffea Susu Iced",
    price: 13000,
    qty: 0,
  },
  {
    name: "Koffea Susu Hot",
    price: 11000,
    qty: 0,
  },
  {
    name: "Koffea Gula Doloe Iced",
    price: 13000,
    qty: 0,
  },
  {
    name: "Koffea Gula Doloe Hot",
    price: 11000,
    qty: 0,
  },
  {
    name: "Koffea Mocha Iced",
    price: 13000,
    qty: 0,
  },
  {
    name: "Strawberry Milk Iced",
    price: 11000,
    qty: 0,
  },
  {
    name: "Leaftea Lemon Iced",
    price: 10000,
    qty: 0,
  },
  {
    name: "Lychee Bloom Iced",
    price: 10000,
    qty: 0,
  },
  {
    name: "Chokis and Cream Iced",
    price: 11000,
    qty: 0,
  },
  {
    name: "Green Tea Iced",
    price: 12000,
    qty: 0,
  },
  {
    name: "Thai Tea Iced",
    price: 12000,
    qty: 0,
  },
  {
    name: "Boba ChocoLate Iced",
    price: 12000,
    qty: 0,
  },
  {
    name: "Boba Red Velvede Iced",
    price: 12000,
    qty: 0,
  },
  {
    name: "Boba Gula Doloe Iced ",
    price: 12000,
    qty: 0,
  },
  {
    name: "Boba TaroLatte Iced",
    price: 12000,
    qty: 0,
  },
];

function renderOrders() {
  const container = document.getElementById("orderList");
  container.innerHTML = "";
  let totalItems = 0;
  let totalPrice = 0;

  menu.forEach((item, index) => {
    totalItems += item.qty;
    totalPrice += item.qty * item.price;

    container.innerHTML += `
      <div class="order-card">
        <div class="info">
          <strong>${item.name}</strong><br>
          Rp. ${item.price.toLocaleString()}
          <div class="qty">
            <button onclick="updateQty(${index}, -1)">-</button>
            ${item.qty}
            <button onclick="updateQty(${index}, 1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("totalItems").innerText = totalItems;
  document.getElementById("totalPrice").innerText = totalPrice.toLocaleString();
}

function updateQty(index, change) {
  menu[index].qty += change;
  if (menu[index].qty < 0) menu[index].qty = 0;
  renderOrders();
}

function checkout() {
  const atasNama = document.querySelector(".order-info input").value.trim();
  const catatan = document.querySelector(".order-info textarea").value.trim();

  if (!atasNama) {
    alert("Silakan isi nama terlebih dahulu.");
    return;
  }

  const items = menu.filter((item) => item.qty > 0);
  if (items.length === 0) {
    alert("Belum ada pesanan yang dipilih.");
    return;
  }

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const history = JSON.parse(localStorage.getItem("history") || "[]");

  history.unshift({
    nama: atasNama,
    catatan: catatan,
    waktu: new Date().toLocaleString(),
    totalItems,
    totalPrice,
    items,
  });

  localStorage.setItem("history", JSON.stringify(history));

  alert("Pesanan berhasil disimpan!");

  // Reset
  menu.forEach((item) => (item.qty = 0));
  document.querySelector(".order-info input").value = "";
  document.querySelector(".order-info textarea").value = "";
  renderOrders();
  showHistory();
}

function exportToExcel() {
  const atasNama = document.querySelector(".order-info input").value.trim();
  const catatan = document.querySelector(".order-info textarea").value.trim();

  let table = `
    <table border="1">
      <tr><th colspan="5" style="text-align:left">Atas Nama: ${
        atasNama || "-"
      } </th></tr>
      <tr><th colspan="5" style="text-align:left">Catatan: ${
        catatan || "-"
      } </th></tr>
      <tr></tr>
      <tr>
        <th>No</th>
        <th>Nama Menu</th>
        <th>Harga</th>
        <th>Jumlah</th>
        <th>Subtotal</th>
      </tr>
  `;

  let no = 1;
  let total = 0;

  menu.forEach((item) => {
    if (item.qty > 0) {
      let subtotal = item.qty * item.price;
      total += subtotal;
      table += `
        <tr>
          <td>${no++}</td>
          <td>${item.name}</td>
          <td>${item.price}</td>
          <td>${item.qty}</td>
          <td>${subtotal}</td>
        </tr>
      `;
    }
  });

  table += `
      <tr>
        <td colspan="4"><strong>Total</strong></td>
        <td><strong>${total}</strong></td>
      </tr>
    </table>
  `;

  const blob = new Blob(["\ufeff" + table], {
    type: "application/vnd.ms-excel",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pesanan_${atasNama || "pelanggan"}.xls`;
  a.click();
}

function exportHistoryToExcel() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  if (history.length === 0) {
    alert("Tidak ada data untuk diekspor.");
    return;
  }

  let table = `
    <table border="1">
      <tr>
        <th>No</th>
        <th>Nama</th>
        <th>Waktu</th>
        <th>Total Item</th>
        <th>Total Harga</th>
        <th>Detail Pesanan</th>
        <th>Catatan</th>
      </tr>
  `;

  history.forEach((order, index) => {
    const detail = order.items
      .map((item) => `${item.name} x ${item.qty}`)
      .join(", ");
    table += `
      <tr>
        <td>${index + 1}</td>
        <td>${order.nama}</td>
        <td>${order.waktu}</td>
        <td>${order.totalItems}</td>
        <td>${order.totalPrice}</td>
        <td>${detail}</td>
        <td>${order.catatan || "-"}</td>
      </tr>
    `;
  });

  table += "</table>";

  const blob = new Blob(["\ufeff" + table], {
    type: "application/vnd.ms-excel",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "riwayat_pemesanan.xls";
  a.click();
}

function showHistory() {
  const list = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("history") || "[]");

  if (history.length === 0) {
    list.innerHTML = "<p>Belum ada riwayat pemesanan.</p>";
    return;
  }

  list.innerHTML = history
    .map(
      (order, i) => `
    <div class="history-card">
      <p><strong>${order.nama}</strong> (${order.waktu})</p>
      <p>Total Item: ${
        order.totalItems
      } | Total Harga: Rp ${order.totalPrice.toLocaleString()}</p>
      <details>
        <summary>Detail Pesanan</summary>
        <ul>
          ${order.items
            .map((item) => `<li>${item.name} x ${item.qty}</li>`)
            .join("")}
        </ul>
        <p>Catatan: ${order.catatan || "-"}</p>
      </details>
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();
  showHistory();
});
