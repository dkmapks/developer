let money = 100000;
let debt = 0;
let apartments = [];
let turn = 1;
let level = 1;
let xp = 0;
let inflation = 1.0;
let taxRate = 0.05;
let employees = [];
let log = [];

const apartmentTypes = [
  { type: "Kawalerka", multiplier: 0.9 },
  { type: "Mieszkanie", multiplier: 1.0 },
  { type: "Apartament", multiplier: 1.5 },
  { type: "Loft", multiplier: 1.8 },
  { type: "Dom", multiplier: 2.2 }
];

function getRandomApartment() {
  let size = Math.floor(Math.random() * 50 + 30); // 30–80 m²
  let basePrice = Math.floor(Math.random() * 5000 + 5000); // 5k–10k
  let typeObj = apartmentTypes[Math.floor(Math.random() * apartmentTypes.length)];
  let price = Math.floor(size * basePrice * inflation * typeObj.multiplier);
  return {
    size,
    value: price,
    type: typeObj.type,
    rented: false,
    quality: 1.0
  };
}

function updateStats() {
  let apartmentHTML = apartments.map((a, i) =>
    `#${i + 1}: ${a.type}, ${a.size}m², ${a.value} zł, wynajęte: ${a.rented ? "tak" : "nie"}`
  ).join("<br>");

  document.getElementById("stats").innerHTML = `
    <strong>Tura:</strong> ${turn}<br>
    <strong>Pieniądze:</strong> ${money} zł<br>
    <strong>Dług:</strong> ${debt} zł<br>
    <strong>Poziom:</strong> ${level} (XP: ${xp}/100)<br>
    <strong>Inflacja:</strong> ${(inflation * 100).toFixed(1)}%<br>
    <strong>Pracownicy:</strong> ${employees.join(", ") || "brak"}<br><br>
    <strong>Mieszkania:</strong><br>${apartmentHTML || "brak"}<br>
  `;
}

function gainXP(amount) {
  xp += amount;
  if (xp >= 100) {
    level++;
    xp = 0;
    log.push("Awansowałeś na poziom " + level + "!");
    alert("Awans! Nowy poziom: " + level);
  }
}

function buyApartment() {
  let apt = getRandomApartment();
  if (money >= apt.value) {
    apartments.push(apt);
    money -= apt.value;
    gainXP(10);
    log.push(`Kupiono ${apt.type} (${apt.size}m²) za ${apt.value} zł.`);
  } else {
    alert("Nie masz wystarczająco pieniędzy!");
  }
  updateStats();
}

function sellApartment() {
  if (apartments.length === 0) return alert("Brak mieszkań.");

  let list = apartments.map((a, i) => `#${i + 1}: ${a.type} - ${a.value} zł`).join("\n");
  let index = prompt("Wybierz mieszkanie do sprzedaży:\n" + list);
  if (!index || isNaN(index)) return;
  index = parseInt(index) - 1;
  if (index < 0 || index >= apartments.length) return;

  let apt = apartments[index];
  let r = Math.random();
  let multiplier = r < 0.05 ? 3 + Math.random() * 1.5 : r < 0.3 ? 0.7 : 1 + Math.random() * 1.5;
  let offer = Math.floor(apt.value * multiplier);

  if (confirm(`Klient oferuje ${offer} zł za ${apt.type} (${apt.size}m²).\nPrzyjąć ofertę?`)) {
    money += offer;
    apartments.splice(index, 1);
    gainXP(15);
    let tax = Math.floor(offer * taxRate);
    money -= tax;
    log.push(`Sprzedano mieszkanie za ${offer} zł (podatek: ${tax} zł).`);
  }

  updateStats();
}

function upgradeApartment() {
  if (apartments.length === 0) return alert("Brak mieszkań.");
  let index = Math.floor(Math.random() * apartments.length);
  let cost = 15000;

  if (money >= cost) {
    money -= cost;
    apartments[index].value = Math.floor(apartments[index].value * 1.25);
    apartments[index].quality += 0.1;
    gainXP(10);
    log.push(`Ulepszono mieszkanie #${index + 1}`);
  } else {
    alert("Za mało pieniędzy.");
  }
  updateStats();
}

function rentApartment() {
  let available = apartments.find(a => !a.rented);
  if (!available) return alert("Brak mieszkań do wynajęcia.");
  available.rented = true;
  log.push(`Wynajęto ${available.type} za ${(available.value * 0.01).toFixed(0)} zł/mies.`);
  updateStats();
}

function earnMoney() {
  let earned = Math.floor(Math.random() * 15000 + 5000);
  money += earned;
  gainXP(5);
  log.push("Zarobiono " + earned + " zł.");
  updateStats();
}

function takeLoan() {
  let amount = 100000;
  money += amount;
  debt += amount * 3;
  alert(`Wzięto kredyt 100k zł. Do spłaty: ${amount * 3} zł`);
  log.push("Wzięto kredyt.");
  updateStats();
}

function repayLoan() {
  if (debt <= 0) return alert("Brak zadłużenia.");
  let payment = Math.min(debt, 25000);
  if (money >= payment) {
    money -= payment;
    debt -= payment;
    log.push("Spłacono kredyt: " + payment + " zł");
  } else {
    alert("Za mało pieniędzy.");
  }
  updateStats();
}

function randomEvent() {
  let r = Math.random();
  if (r < 0.1) {
    let loss = Math.floor(money * 0.3);
    money -= loss;
    alert("Kryzys! Straciłeś " + loss + " zł");
    log.push("Kryzys gospodarczy!");
  } else if (r < 0.2) {
    inflation *= 1.05;
    alert("Wzrost inflacji!");
    log.push("Inflacja rośnie!");
  } else if (r < 0.3) {
    let boost = Math.floor(Math.random() * 30000);
    money += boost;
    alert("Dotacja: +" + boost + " zł");
    log.push("Dostałeś dotację!");
  }
}

function hireEmployee() {
  const types = ["Agent", "Doradca", "Prawnik"];
  let choice = prompt("Zatrudnij pracownika:\n1. Agent\n2. Doradca\n3. Prawnik");
  let selected = types[parseInt(choice) - 1];
  if (selected && !employees.includes(selected)) {
    employees.push(selected);
    log.push("Zatrudniono: " + selected);
  }
  updateStats();
}

function nextTurn() {
  turn++;
  apartments.forEach(apt => {
    if (apt.rented) {
      let rent = Math.floor(apt.value * 0.01);
      money += rent;
    }
  });

  if (turn % 5 === 0) randomEvent();
  if (turn % 3 === 0 && Math.random() < 0.3) hireEmployee();

  inflation *= 1 + Math.random() * 0.01;
  updateStats();
}
