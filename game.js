function obliczLokate() {
  const kwota = parseFloat(document.getElementById("lokataKwota").value);
  const oprocentowanie = parseFloat(document.getElementById("lokataOprocentowanie").value) / 100;
  const okres = parseInt(document.getElementById("lokataOkres").value);

  const zysk = kwota * Math.pow(1 + oprocentowanie / 12, okres);
  document.getElementById("wynikLokaty").textContent =
    `Po ${okres} miesiącach otrzymasz: ${zysk.toFixed(2)} PLN`;
}

function obliczKredyt() {
  const kwota = parseFloat(document.getElementById("kredytKwota").value);
  const oprocentowanie = parseFloat(document.getElementById("kredytOprocentowanie").value) / 100 / 12;
  const okres = parseInt(document.getElementById("kredytOkres").value);

  const rata = kwota * (oprocentowanie * Math.pow(1 + oprocentowanie, okres)) / (Math.pow(1 + oprocentowanie, okres) - 1);
  document.getElementById("wynikKredytu").textContent =
    `Miesięczna rata: ${rata.toFixed(2)} PLN`;
}
