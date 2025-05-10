// Klasa do reprezentacji mieszkania
class Mieszkanie {
  constructor(lokalizacja, stan, cenaZakupu) {
    this.lokalizacja = lokalizacja;
    this.stan = stan; // np. "dobry", "średni", "zły"
    this.cenaZakupu = cenaZakupu;
    this.cenaSprzedazy = this.wygenerujCeneSprzedazy();
  }

  // Losowa generacja ceny sprzedaży w zależności od stanu
  wygenerujCeneSprzedazy() {
    let mnoznik;
    if (this.stan === "dobry") mnoznik = 1.2;
    else if (this.stan === "średni") mnoznik = 1.1;
    else mnoznik = 0.9;

    return Math.round(this.cenaZakupu * mnoznik);
  }
}

// Klasa do reprezentacji oferty sprzedaży
class Oferta {
  constructor(mieszkanie) {
    this.mieszkanie = mieszkanie;
    this.cena = this.wygenerujCeneOferty();
    this.czasTrwania = this.wygenerujCzasTrwania(); // Oferty wygasają po pewnym czasie
    this.timeLeft = this.czasTrwania;
  }

  // Generowanie ceny oferty w zależności od mieszkania
  wygenerujCeneOferty() {
    const popyt = Math.random() > 0.5 ? 1.1 : 0.9; // Popyt losowy, może być wyższy lub niższy
    return Math.round(this.mieszkanie.cenaSprzedazy * popyt);
  }

  // Losowanie czasu trwania oferty (w dniach)
  wygenerujCzasTrwania() {
    return Math.floor(Math.random() * 7 + 3); // Oferty trwają od 3 do 10 dni
  }

  // Decrementacja czasu oferty
  uplynalCzas() {
    this.timeLeft -= 1;
  }
}

// Funkcja do zakupu mieszkania
function kupMieszkanie() {
  const lokalizacje = ["Warszawa", "Kraków", "Gdańsk", "Wrocław"];
  const stanMieszkan = ["dobry", "średni", "zły"];

  const lokalizacja = lokalizacje[Math.floor(Math.random() * lokalizacje.length)];
  const stan = stanMieszkan[Math.floor(Math.random() * stanMieszkan.length)];
  const cenaZakupu = Math.floor(Math.random() * 100000 + 50000); // Cena w przedziale 50k - 150k

  const noweMieszkanie = new Mieszkanie(lokalizacja, stan, cenaZakupu);
  mieszkania.push(noweMieszkanie);
  wyswietlMieszkania();
}

// Funkcja do sprzedaży mieszkania
function sprzedajMieszkanie(index) {
  const mieszkanie = mieszkania[index];
  alert(`Sprzedajesz mieszkanie za ${mieszkanie.cenaSprzedazy} zł`);
  mieszkania.splice(index, 1); // Usuwamy mieszkanie z listy
  wyswietlMieszkania();
}

// Funkcja do wyświetlania mieszkań
function wyswietlMieszkania() {
  const propertiesList = document.getElementById('properties-list');
  propertiesList.innerHTML = ''; // Czyści listę przed dodaniem

  mieszkania.forEach((mieszkanie, index) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>Lokalizacja: ${mieszkanie.lokalizacja}</p>
      <p>Stan: ${mieszkanie.stan}</p>
      <p>Cena zakupu: ${mieszkanie.cenaZakupu} zł</p>
      <p>Cena sprzedaży: ${mieszkanie.cenaSprzedazy} zł</p>
      <button onclick="sprzedajMieszkanie(${index})">Sprzedaj</button>
    `;
    propertiesList.appendChild(div);
  });
}

// Funkcja do generowania oferty
function generujOferty() {
  mieszkania.forEach(mieszkanie => {
    const nowaOferta = new Oferta(mieszkanie);
    oferty.push(nowaOferta);
  });
  wyswietlOferty();
}

// Funkcja do wyświetlania ofert
function wyswietlOferty() {
  const offersList = document.getElementById('offers-list');
  offersList.innerHTML = ''; // Czyści listę przed dodaniem

  oferty.forEach((oferta, index) => {
    oferta.uplynalCzas(); // Zmniejszamy czas oferty

    if (oferta.timeLeft <= 0) {
      // Oferta wygasła
      alert(`Oferta na mieszkanie w lokalizacji ${oferta.mieszkanie.lokalizacja} wygasła.`);
      oferty.splice(index, 1); // Usuwamy wygasłą ofertę
    } else {
      const div = document.createElement('div');
      div.innerHTML = `
        <p>Oferta na mieszkanie w ${oferta.mieszkanie.lokalizacja}:</p>
        <p>Cena oferty: ${oferta.cena} zł</p>
        <p>Pozostały czas: ${oferta.timeLeft} dni</p>
        <button onclick="sprzedajZaOferte(${index})">Sprzedaj</button>
      `;
      offersList.appendChild(div);
    }
  });
}

// Funkcja do sprzedaży mieszkania za ofertę
function sprzedajZaOferte(index) {
  const oferta = oferty[index];
  alert(`Sprzedajesz mieszkanie za ${oferta.cena} zł`);
  mieszkania.splice(mieszkania.indexOf(oferta.mieszkanie), 1); // Usuwamy mieszkanie z listy
  oferty.splice(index, 1); // Usuwamy ofertę
  wyswietlMieszkania();
  wyswietlOferty();
}

// Przykładowa lista mieszkań
let mieszkania = [];
let oferty = [];

// Event do kupowania mieszkań
document.getElementById('buy-property').addEventListener('click', kupMieszkanie);

// Generowanie ofert na mieszkania co kilka sekund
setInterval(generujOferty, 15000); // Co 15 sekund

// Inicjalizowanie gry
wyswietlMieszkania();
