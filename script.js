function switchTab (viewId, buttonElement) {
    // alle Ansichten ausblenden
    document.querySelectorAll('.view').forEach(view => {view.classList.remove('active');});
    // gewählte Ansicht aktivieren
    document.getElementById(viewId).classList.add('active');
    // alle buttons nicht hervorheben
    document.querySelectorAll('.tab-button').forEach(btn => {btn.classList.remove('active');});
    // gewählten button hervorheben
    buttonElement.classList.add('active');
}