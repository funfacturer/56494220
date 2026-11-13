// Wechsel zwischen "Spieltage" und "Tabelle" innerhalb der Bundesliga
function switchBundesligaSubView(subViewId, buttonElement) {
  // Unteransichten umschalten
  document.querySelectorAll('#view-b1 .sub-view').forEach(view => {
    view.classList.remove('active');
  });
  document.getElementById(subViewId).classList.add('active');

  // Segment-Button aktiv schalten
  document.querySelectorAll('#view-b1 .segment-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  buttonElement.classList.add('active');
}
