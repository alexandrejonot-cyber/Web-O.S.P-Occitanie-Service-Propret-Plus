// ==========================================
// 🚀 GESTION DE LA VERSION DU SCRIPT
// ==========================================
const APP_VERSION = "v1.7"; // 👈 Numéro de version mis à jour (Calcul dynamique des consommables)

function afficherVersion() {
    let versionBadge = document.createElement('div');
    versionBadge.innerHTML = APP_VERSION;
    versionBadge.style.cssText = "position: fixed; top: 5px; left: 5px; background: rgba(0, 0, 0, 0.6); color: white; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; z-index: 10000; pointer-events: none; font-weight: bold; font-family: sans-serif;";
    document.body.appendChild(versionBadge);
    console.log("🚀 OSP+ Script Chargé - " + APP_VERSION);
}
window.addEventListener('DOMContentLoaded', afficherVersion);
// ==========================================

let planData = {}; 
let vitrerieVisibleCount = {}; 
let vitrerieIndexCount = {};   
let customVisibleCount = 0;    
let customIndexCount = 0;      
let currentPlanId = null;
let roomCounter = 0;

let activeServices = [];

// --- GESTION DU CODE CLIENT (VIA FICHIER EXTERNE CODES.JS) ---
window.clientDiscount = 0; 
window.activeClientCode = "";

function openClientModal() { document.getElementById('clientModal').style.display = 'flex'; }
function closeClientModal() { document.getElementById('clientModal').style.display = 'none'; }

function applyClientCode() {
    const code = document.getElementById('clientCodeInput').value.trim().toUpperCase();
    const msg = document.getElementById('clientCodeMsg');
    
    const listeCodes = window.mesCodesFideles || [];
    
    if(listeCodes.includes(code)) {
        window.clientDiscount = 0.10; // Remise VIP de 10%
        window.activeClientCode = code;
        
        msg.style.color = 'var(--vert)';
        msg.innerText = "✓ Code client VIP reconnu ! Votre remise fidélité de 10% a été activée.";
        
        calculatePrice(); 
        setTimeout(closeClientModal, 3000);
    } else {
        window.clientDiscount = 0;
        window.activeClientCode = "";
        msg.style.color = 'red';
        msg.innerText = "✗ Code introuvable ou expiré. Veuillez vérifier votre saisie.";
        calculatePrice();
    }
}

// --- GESTION DU CODE PROMO DYNAMIQUE DANS LE DEVIS (-10% et -5%) ---
window.promoDiscountDevis = 0;
window.activePromoCodeDevis = "";

function applyPromoCodeDevis() {
    const inputCode = document.getElementById('promoCodeInputDevis').value.trim().toUpperCase();
    const msg = document.getElementById('promoCodeMsgDevis');
    
    const aujourdhui = new Date();
    const jour = String(aujourdhui.getDate()).padStart(2, '0');
    const mois = String(aujourdhui.getMonth() + 1).padStart(2, '0');

    const codeDynamique10 = "OSP-" + jour + "X" + mois + "Z-10";
    const codeDynamique5 = "OSP-" + jour + "X" + mois + "Z-5";
    
    const validPromoCodes = {
        [codeDynamique10]: 0.10, 
        [codeDynamique5]: 0.05,  
        'OSPLUS-10%': 0.10,      
        'OSPLUS-5%': 0.05        
    };
    
    if (validPromoCodes[inputCode]) {
        let selectedDiscount = validPromoCodes[inputCode];
        window.promoDiscountDevis = selectedDiscount;
        window.activePromoCodeDevis = inputCode;
        msg.style.color = 'var(--vert)';
        msg.innerText = "✓ Code promo enregistré avec succès.";
    } else if (inputCode === "") {
        window.promoDiscountDevis = 0;
        window.activePromoCodeDevis = "";
        msg.innerText = "";
    } else {
        window.promoDiscountDevis = 0;
        window.activePromoCodeDevis = "";
        msg.style.color = 'red';
        msg.innerText = "✗ Ce code est invalide ou expiré.";
    }
    calculatePrice();
}

// --- GESTION DES JOURS FÉRIÉS AUTOMATIQUES (-10%) ---
window.holidayPromoActive = false;

function getEaster(year) {
    let a = year % 19, b = Math.floor(year / 100), c = year % 100;
    let d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    let g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    let i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    let m = Math.floor((a + 11 * h + 22 * l) / 451);
    let month = Math.floor((h + l - 7 * m + 114) / 31);
    let day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function getMobileHolidays(year) {
    const easter = getEaster(year);
    const addDays = (date, days) => {
        let d = new Date(date);
        d.setDate(d.getDate() + days);
        return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    return [
        addDays(easter, 1), 
        addDays(easter, 39), 
        addDays(easter, 50)  
    ];
}

function checkHolidays() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
    const currentDay = String(today.getDate()).padStart(2, '0');
    const formattedDate = currentMonth + '-' + currentDay;

    const fixedHolidays = ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25'];
    const mobileHolidays = getMobileHolidays(currentYear);
    const testDates = ['06-01', '06-02', '06-03'];

    const allHolidays = fixedHolidays.concat(mobileHolidays).concat(testDates);

    if (allHolidays.includes(formattedDate)) {
        document.getElementById('promo-banner').style.display = 'block';
        window.holidayPromoActive = true;
    } else {
        window.holidayPromoActive = false;
    }
}

window.addEventListener('DOMContentLoaded', checkHolidays);

// 🟢 Gestion du champ "Nombre d'employés"
function toggleCompanyField() {
    const isEntreprise = document.querySelector('input[name="statut"][value="Entreprise"]')?.checked;
    const companyGroup = document.getElementById('companyNameGroup');
    const companyInput = document.getElementById('nomEntreprise');
    const employeeGroup = document.getElementById('employeeCountGroup');
    const employeeInput = document.getElementById('nbEmployes');

    if (isEntreprise) {
        if (companyGroup) companyGroup.style.display = 'flex';
        if (companyInput) companyInput.required = true;
        if (employeeGroup) employeeGroup.style.display = 'flex';
        if (employeeInput) employeeInput.required = true;
    } else {
        if (companyGroup) companyGroup.style.display = 'none';
        if (companyInput) { companyInput.required = false; companyInput.value = ''; }
        if (employeeGroup) employeeGroup.style.display = 'none';
        if (employeeInput) { employeeInput.required = false; employeeInput.value = '1'; }
    }
    calculatePrice(); // On recalcule le prix car le nombre d'employés a pu changer
}

const prestationsData = {
    'Bureau': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage bureaux', 'Vidage poubelles', 'Désinfection points contact'] },
    'Salle de réunion': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage', 'Remise en place chaises', 'Vidage poubelles'] },
    'Sanitaires': { obligatoires: ['Nettoyage cuvettes / urinoirs', 'Lavage Sols', 'Détartrage & Désinfection', 'Miroirs & Lavabos', 'Mise en place consommables'], optionnelles: [] },
    'Douche': { obligatoires: ['Lavage Sols', 'Détartrage & Désinfection cabines', 'Nettoyage siphons', 'Mise en place consommables'], optionnelles: [] },
    'Vestiaire': { obligatoires: ['Lavage Sols', 'Désinfection bancs/casiers', 'Vidage poubelles'], optionnelles: ['Nettoyage miroirs', 'Dépoussiérage casiers ext.'] },
    'Accueil': { obligatoires: ['Vidage poubelles'], optionnelles: ['Aspiration / Lavage', 'Nettoyage banque d\'accueil', 'Traces vitrages'] },
    'Restauration': { obligatoires: ['Vidage poubelles', 'Lavage Sols', 'Désinfection tables'], optionnelles: ['Mise en place consommables'] },
    'Cuisine': { obligatoires: ['Vidage poubelles', 'Lavage Sols', 'Désinfection plans de travail', 'Nettoyage éviers', 'Mise en place consommables'], optionnelles: ['Nettoyage micro-ondes', 'Nettoyage frigo'] },
    'Salle de repos': { obligatoires: ['Vidage poubelles'], optionnelles: ['Lavage Sols', 'Nettoyage tables', 'Nettoyage machines à café', 'Mise en place consommables'] },
    'Salle de sport': { obligatoires: ['Vidage poubelles', 'Aération'], optionnelles: ['Aspiration / Lavage', 'Désinfection machines', 'Miroirs', 'Mise en place consommables'] },
    'Ascenseur principal': { obligatoires: ['Désinfection boutons', 'Aspiration / Lavage'], optionnelles: ['Nettoyage miroir', 'Traces portes int/ext'] },
    'Ascenseur secondaire': { obligatoires: ['Désinfection boutons', 'Aspiration / Lavage'], optionnelles: ['Nettoyage miroir', 'Traces portes int/ext'] },
    'Escalier principal': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage plinthes', 'Nettoyage main courante'] },
    'Escalier secondaire': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage plinthes', 'Nettoyage main courante'] },
    'Palier': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage', 'Plinthes'] },
    'Couloir': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage plinthes'] },
    'Parking': { obligatoires: [], optionnelles: ['Ramassage déchets', 'Balayage', 'Toiles d\'araignées'] },
    'Terrasse': { obligatoires: [], optionnelles: ['Balayage', 'Nettoyage mobilier ext.', 'Vidage poubelles'] },
    'Local technique': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage'] },
    'Autre': { obligatoires: [], optionnelles: ['Aspiration / Lavage', 'Dépoussiérage', 'Vidage poubelles'] }
};

function generateRowHtml(id, name) {
    return `
    <div class="quote-row-item" id="row_${id}">
        <label>${name}</label>
        <input type="number" id="qty_${id}" min="0" value="0" oninput="calculatePrice()">
        <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${name}')">+ Planifier</button>
    </div>`;
}

function generateVitrerieRowHtml(id, name, dupIndex) {
    let actualId = dupIndex === 0 ? id : id + '_dup_' + dupIndex;
    let btnPlus = dupIndex === 0 
        ? `<button type="button" onclick="addVitrerieRow('${id}', '${name}')" style="background:var(--vert); color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer; height:100%; width:100%; padding:0; font-size:1.1rem; line-height:1;">+</button>` 
        : `<button type="button" class="btn-delete-row" onclick="removeVitrerieRow('${actualId}')" style="margin:0; width:100%; height:100%; border-radius:4px;">×</button>`;

    return `
    <div class="quote-row-item" id="row_${actualId}" style="grid-template-columns: 1fr 45px 75px 75px 25px; padding: 6px; gap: 5px; align-items: center; margin-bottom: 4px;">
        <label style="font-size: 0.65rem; line-height: 1.1; word-wrap: break-word;">${name}</label>
        <input type="number" id="qty_${actualId}" min="0" value="0" oninput="calculatePrice()" style="padding: 4px; width: 100%; box-sizing: border-box; text-align:center;">
        <select id="type_${actualId}" onchange="calculatePrice()" style="padding: 4px 0px; font-size: 0.65rem; width: 100%; box-sizing: border-box;">
            <option value="complet">Complet</option>
            <option value="interieur">Intérieur</option>
            <option value="exterieur">Extérieur</option>
        </select>
        <button type="button" id="btn_plan_${actualId}" class="btn-planifier" onclick="openPlanningModal('${actualId}', '${name}')" style="padding: 4px; font-size: 0.6rem; width: 100%; box-sizing: border-box;">+ Plan</button>
        ${btnPlus}
    </div>`;
}

function addVitrerieRow(baseId, name) {
    if (!vitrerieVisibleCount[baseId]) vitrerieVisibleCount[baseId] = 0;
    if (!vitrerieIndexCount[baseId]) vitrerieIndexCount[baseId] = 0;
    
    if (vitrerieVisibleCount[baseId] >= 2) return; 
    
    vitrerieVisibleCount[baseId]++;
    vitrerieIndexCount[baseId]++;
    
    const newHtml = generateVitrerieRowHtml(baseId, name + ' (Autre)', vitrerieIndexCount[baseId]);
    document.getElementById('wrapper_' + baseId).insertAdjacentHTML('beforeend', newHtml);
}

function removeVitrerieRow(actualId) {
    let baseId = actualId.split('_dup_')[0];
    const row = document.getElementById('row_' + actualId);
    if (row) row.remove();
    
    if (vitrerieVisibleCount[baseId]) vitrerieVisibleCount[baseId]--;
    if (planData[actualId]) delete planData[actualId];
    
    calculatePrice();
}

function openMentions() { document.getElementById('mentionsModal').style.display = 'flex'; }
function closeMentions() { document.getElementById('mentionsModal').style.display = 'none'; }
function togglePlay(id) { const vid = document.getElementById(id); if (vid.paused) vid.play(); else vid.pause(); }
function toggleMute(id) { const vid = document.getElementById(id); vid.muted = !vid.muted; }
function restartVideo(id) { const vid = document.getElementById(id); vid.currentTime = 0; vid.play(); }
function toggleFullScreen(id) { const vid = document.getElementById(id); if (vid.requestFullscreen) vid.requestFullscreen(); else if (vid.webkitRequestFullscreen) vid.webkitRequestFullscreen(); }
function moveSlider(e) { const container = e.parentElement; container.querySelector('.before').style.width = e.value + '%'; }

function toggleAccordion(headerElement) {
    const body = headerElement.nextElementSibling;
    const isActive = headerElement.classList.contains('active');
    
    document.querySelectorAll('.accordion-header').forEach(el => { el.classList.remove('active'); });
    document.querySelectorAll('.accordion-body').forEach(el => { el.classList.remove('active'); });

    if (!isActive) {
        headerElement.classList.add('active');
        body.classList.add('active');
    }
}

function updateLevelSummaries() {
    document.querySelectorAll('.level-accordion').forEach(accordion => {
        let levelName = accordion.getAttribute('data-levelname');
        let roomsContainer = accordion.querySelector('[id^="rooms_container_"]');
        let titleSpan = accordion.querySelector('.level-title-display');
        
        if (roomsContainer && titleSpan) {
            let roomCards = roomsContainer.querySelectorAll('.structured-room-card');
            if (roomCards.length > 0) {
                let roomNames = [];
                roomCards.forEach(card => {
                    let nameSpan = card.querySelector('h5 span');
                    if (nameSpan) {
                        let typeText = nameSpan.innerText;
                        if (typeText === 'Nouvel espace') {
                            let customInput = card.querySelector('input[type="text"]');
                            if (customInput && customInput.value.trim() !== '') {
                                typeText = customInput.value.trim();
                            } else {
                                typeText = 'Autre';
                            }
                        }
                        roomNames.push(typeText);
                    }
                });
                
                let summaryText = roomNames.join(', ');
                if (summaryText.length > 40) summaryText = summaryText.substring(0, 37) + '...';
                
                titleSpan.innerHTML = `📍 ${levelName} <span style="font-size:0.75rem; color:#888; margin-left:8px; font-weight:normal; font-style:italic;">(${roomCards.length} espace(s) : ${summaryText})</span>`;
            } else {
                titleSpan.innerHTML = `📍 ${levelName}`;
            }
        }
    });
}

function createLevelAccordion(levelName) {
    const levelId = 'level_' + Date.now() + Math.floor(Math.random() * 1000);
    
    let html = `
    <div class="level-accordion" id="block_${levelId}" data-levelname="${levelName}">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span class="level-title-display">📍 ${levelName}</span>
            <span class="accordion-icon">+</span>
        </div>
        <div class="accordion-body">
            <p style="font-size:0.75rem; color:#666; margin-bottom:8px;">Ajoutez vos espaces pour ce niveau :</p>
            <div class="room-quick-adds">
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Bureau')">💼 Bureau</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Salle de réunion')">🗣️ Réunion</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Sanitaires')">🚻 Sanitaires</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Douche')">🚿 Douches</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Vestiaire')">🧳 Vestiaires</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Accueil')">🛎️ Accueil</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Cuisine')">🍳 Cuisine</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Restauration')">🍽️ Restauration</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Salle de repos')">☕ Repos</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Couloir')">🚶 Couloir</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Ascenseur principal')">🛗 Asc. Princ.</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Ascenseur secondaire')">🛗 Asc. Sec.</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Escalier principal')">📶 Esc. Princ.</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Escalier secondaire')">📶 Esc. Sec.</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Palier')">🚪 Palier</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Terrasse')">☀️ Terrasse</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Local technique')">🔧 Local tech.</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Autre')">➕ Autre</button>
            </div>
            <div id="rooms_container_${levelId}"></div>
        </div>
    </div>`;
    
    document.getElementById('levelsContainer').insertAdjacentHTML('beforeend', html);
}

function openLevelModal() { document.getElementById('levelModal').style.display = 'flex'; }
function closeLevelModal() { document.getElementById('levelModal').style.display = 'none'; }

function addSpecificLevel(name) {
    createLevelAccordion(name);
    closeLevelModal();
}
function addCustomLevel() {
    const val = document.getElementById('customLevelInput').value.trim();
    if(val !== '') {
        createLevelAccordion(val);
        document.getElementById('customLevelInput').value = '';
        closeLevelModal();
    }
}

function addStructuredRoom(levelId, type) {
    roomCounter++;
    const roomId = 'room_detail_' + roomCounter;
    
    planData[roomId] = { days: [], months: [], start:'', end:'', roomType: type, comment: '' };

    let customNameHtml = type === 'Autre' ? `<input type="text" placeholder="Ex: Espace Reprographie..." style="font-size:0.8rem; padding:6px; margin-bottom:10px; width:100%; border:1px solid #ccc; border-radius:5px;" oninput="updateLevelSummaries()">` : '';

    let qtyHtml = '';
    if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
        qtyHtml = `
        <div class="qty-input-box"><label>🚹 Hommes (nombre)</label><input type="number" id="qty_h_${roomId}" min="0" value="1" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>🚺 Femmes (nombre)</label><input type="number" id="qty_f_${roomId}" min="0" value="1" oninput="calculatePrice()"></div>`;
    } else if (type === 'Restauration') {
        qtyHtml = `
        <div class="qty-input-box"><label>Nombre d'espaces</label><input type="number" id="qty_${roomId}" min="1" value="1" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>Nombre de tables</label><input type="number" id="qty_tables_${roomId}" min="0" value="5" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>Nombre de chaises</label><input type="number" id="qty_chaises_${roomId}" min="0" value="10" oninput="calculatePrice()"></div>`;
    } else {
        let labelQty = "Nombre de pièces";
        if (type === 'Bureau') labelQty = "Nombre de bureaux";
        else if (type.includes('Ascenseur')) labelQty = "Nombre d'ascenseurs";
        else if (type.includes('Escalier')) labelQty = "Nombre d'escaliers";
        else if (type === 'Palier') labelQty = "Nombre de paliers";
        else if (type === 'Terrasse') labelQty = "Nombre de terrasses";
        else if (type === 'Parking') labelQty = "Nombre de places";
        else if (type === 'Couloir') labelQty = "Nombre de couloirs";
        else if (type === 'Salle de réunion') labelQty = "Nombre de salles";
        else if (type === 'Cuisine') labelQty = "Nombre de cuisines";
        else if (type === 'Local technique') labelQty = "Nombre de locaux";
        else if (type === 'Accueil' || type === 'Salle de repos' || type === 'Salle de sport') labelQty = "Nombre d'espaces";

        qtyHtml = `<div class="qty-input-box"><label>${labelQty}</label><input type="number" id="qty_${roomId}" min="1" value="1" oninput="calculatePrice()"></div>`;
    }

    let surfaceHtml = `
    <div class="qty-input-box">
        <label>Sol</label>
        <select>
            <option value="non_precise">Non précisé</option>
            <option value="moquette">Moquette</option>
            <option value="carrelage">Carrelage</option>
            <option value="lino">Lino / PVC</option>
            <option value="parquet">Béton / Résine</option>
            <option value="autre">Autre</option>
        </select>
    </div>`;

    let consommablesHtml = '';
    const zonesConsommables = ['Sanitaires', 'Douche', 'Vestiaire', 'Cuisine', 'Restauration', 'Salle de repos', 'Salle de sport'];
    if (zonesConsommables.includes(type)) {
        consommablesHtml = `
        <div class="qty-input-box" style="background:#eef3f8; border-color:var(--bleu);">
            <label>🧻 Fourniture (Papier, savon...)</label>
            <select id="cons_select_${roomId}" onchange="calculatePrice()" style="background:transparent; border:none; font-weight:700; color:var(--bleu); padding:0; outline:none;">
                <option value="client">À votre charge</option>
                <option value="osp">Fournis par O.S.P+</option>
            </select>
        </div>`;
    }

    qtyHtml = `<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px;">${qtyHtml}${surfaceHtml}${consommablesHtml}</div>`;

    let prets = prestationsData[type] || prestationsData['Autre'];
    let pretsHtml = `<div class="prest-pill-container">`;
    
    if (prets.obligatoires && prets.obligatoires.length > 0) {
        prets.obligatoires.forEach((p, i) => {
            let pid = `p_ob_${roomId}_${i}`;
            pretsHtml += `
            <div class="prest-pill mandatory" title="Inclus d'office pour l'hygiène de cette zone.">
                <input type="checkbox" id="${pid}" checked disabled>
                <label for="${pid}">${p}</label>
            </div>`;
        });
    }

    if (prets.optionnelles && prets.optionnelles.length > 0) {
        prets.optionnelles.forEach((p, i) => {
            let pid = `p_op_${roomId}_${i}`;
            pretsHtml += `
            <div class="prest-pill">
                <input type="checkbox" id="${pid}" checked onchange="calculatePrice()">
                <label for="${pid}">${p}</label>
            </div>`;
        });
    }
    pretsHtml += `</div>`;

    let hygieneNotice = "";
    if (prets.obligatoires && prets.obligatoires.length > 0) {
        hygieneNotice = `<div style="font-size:0.65rem; color:#888; font-style:italic; margin-top:-5px; margin-bottom:5px; display:flex; align-items:center;">Note : Les tâches avec un cadenas 🔒 sont incluses obligatoirement. <span class="help-bubble">?<span class="tooltip-text">Inclus d'office pour garantir les normes d'hygiène de base.</span></span></div>`;
    }

    let html = `
    <div class="structured-room-card" id="row_${roomId}">
        <h5>
            <span>${type !== 'Autre' ? type : 'Nouvel espace'}</span>
            <button type="button" class="btn-delete-row" onclick="removeRoom('${roomId}')">×</button>
        </h5>
        ${customNameHtml}
        ${qtyHtml}
        <div style="font-size:0.75rem; color:var(--bleu); font-weight:700; margin-top:5px; margin-bottom:8px; display:flex; align-items:center;">Prestations de nettoyage <span class="help-bubble">?<span class="tooltip-text">Cochez les actions spécifiques à réaliser dans cette pièce.</span></span> :</div>
        ${hygieneNotice}
        ${pretsHtml}
        <div style="margin-top:10px;">
            <button type="button" id="btn_plan_${roomId}" class="btn-planifier" onclick="openPlanningModal('${roomId}', '${type}')">+ Planifier les jours</button>
        </div>
    </div>`;

    document.getElementById('rooms_container_' + levelId).insertAdjacentHTML('beforeend', html);
    calculatePrice();
    updateLevelSummaries();
}

function removeRoom(roomId) {
    const row = document.getElementById('row_' + roomId);
    if (row) row.remove();
    if (planData[roomId]) delete planData[roomId];
    calculatePrice();
    updateLevelSummaries();
}

function getRealInterventionCount(selectedDays, selectedMonths, startDate, endDate) {
    if (selectedDays.length === 0 && selectedMonths.length === 0 && !startDate && !endDate) return 1;
    const mapDays = {'Dim':0, 'Lun':1, 'Mar':2, 'Mer':3, 'Jeu':4, 'Ven':5, 'Sam':6};
    let totalInterventions = 0;

    if (startDate && endDate) {
        let start = new Date(startDate);
        let end = new Date(endDate);
        if (start <= end) {
            if (selectedDays.length === 0) return 1; 
            let current = new Date(start);
            while (current <= end) {
                let d = current.getDay();
                selectedDays.forEach(dName => {
                    if (mapDays[dName] === d) totalInterventions++;
                });
                current.setDate(current.getDate() + 1);
            }
            return totalInterventions;
        }
    }

    if (selectedMonths.length > 0) {
        if (selectedDays.length === 0) return selectedMonths.length; 
        const mapMonths = {'Jan':0, 'Fév':1, 'Mar':2, 'Avr':3, 'Mai':4, 'Juin':5, 'Juil':6, 'Août':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Déc':11};
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        selectedMonths.forEach(mName => {
            let m = mapMonths[mName];
            let targetYear = (m < currentMonth) ? currentYear + 1 : currentYear;
            selectedDays.forEach(dName => {
                let targetDay = mapDays[dName];
                let date = new Date(targetYear, m, 1);
                while (date.getMonth() === m) {
                    if (date.getDay() === targetDay) totalInterventions++;
                    date.setDate(date.getDate() + 1);
                }
            });
        });
        return totalInterventions;
    }
    if (selectedDays.length > 0) return selectedDays.length;
    return 1;
}

function openPlanningModal(id, name) {
    currentPlanId = id;
    document.getElementById('planningModalTitle').innerText = name + " - Planification";
    
    if(!planData[id]) planData[id] = { days: [], months: [], start:'', end:'', comment:'' };
    const data = planData[id];
    
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let dHtml = '';
    days.forEach(d => {
        let checked = data.days.includes(d) ? 'checked' : '';
        dHtml += `<label class="checkbox-item"><input type="checkbox" value="${d}" class="plan-day-cb" ${checked}> ${d}</label>`;
    });
    document.getElementById('planDaysGrid').innerHTML = dHtml;

    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    let mHtml = '';
    months.forEach(m => {
        let checked = data.months.includes(m) ? 'checked' : '';
        mHtml += `<label class="checkbox-item"><input type="checkbox" value="${m}" class="plan-month-cb" ${checked}> ${m}</label>`;
    });
    document.getElementById('planMonthsGrid').innerHTML = mHtml;

    document.getElementById('planStartDate').value = data.start || '';
    document.getElementById('planEndDate').value = data.end || '';
    
    document.getElementById('planComment').value = data.comment || '';

    document.getElementById('planningModal').style.display = "flex";
}

function savePlanning() {
    let sDays = [];
    document.querySelectorAll('.plan-day-cb:checked').forEach(cb => sDays.push(cb.value));
    let sMonths = [];
    document.querySelectorAll('.plan-month-cb:checked').forEach(cb => sMonths.push(cb.value));
    
    let sDate = document.getElementById('planStartDate').value;
    let eDate = document.getElementById('planEndDate').value;
    let sComment = document.getElementById('planComment').value;
    
    planData[currentPlanId].days = sDays;
    planData[currentPlanId].months = sMonths;
    planData[currentPlanId].start = sDate;
    planData[currentPlanId].end = eDate;
    planData[currentPlanId].comment = sComment;
    
    const btn = document.getElementById('btn_plan_' + currentPlanId);
    if (btn) {
        let text = "+ Planifier";
        if (sDate && eDate) text = "Période";
        else if (sDays.length > 0 || sMonths.length > 0) {
            if (sMonths.length > 0) text = `${sDays.length}J | ${sMonths.length}M`;
            else text = `${sDays.length} Jour(s)`;
        } else if (sComment.trim() !== '') {
            text = "Précisé ✓"; 
        }
        
        if (text !== "+ Planifier") {
            btn.innerText = text;
            btn.classList.add('active');
        } else {
            btn.innerText = "+ Planifier";
            btn.classList.remove('active');
        }
    }
    
    document.getElementById('planningModal').style.display = "none";
    calculatePrice();
}

window.currentTotalValue = 0;
window.originalTotalValue = 0; 

function calculatePrice() {
    let total = 0;
    let hasOspConsommables = false; 
    
    const TAUX_HORAIRE = 45.00; 

    const vPrices = { vit_fen: 10, vit_baie: 19, vit_velux: 15, vit_ver: 29, vit_porte: 12, vit_com: 39 };
    
    document.querySelectorAll('input[id^="qty_vit_"]').forEach(input => {
        let idFull = input.id.replace('qty_', ''); 
        let baseId = idFull.split('_dup_')[0]; 
        let q = parseFloat(input.value) || 0;
        let data = planData[idFull] || {days:[], months:[], start:'', end:''};
        let exactMultiplier = getRealInterventionCount(data.days, data.months, data.start, data.end);
        let priceRatio = 1; 
        let typeSelect = document.getElementById('type_' + idFull);
        if (typeSelect && (typeSelect.value === 'interieur' || typeSelect.value === 'exterieur')) priceRatio = 0.6; 
        if (vPrices[baseId]) total += q * (vPrices[baseId] * priceRatio) * exactMultiplier;
    });

    const pricesFixed = { 'can23': 89, 'can45': 139, 'canAng': 159, 'tapis': 49, 'moq': 7, 'pack_v': 259 };
    
    for (let id in pricesFixed) {
        const qtyInput = document.getElementById('qty_' + id);
        if (qtyInput) {
            let q = parseFloat(qtyInput.value) || 0;
            let data = planData[id] || {days:[], months:[], start:'', end:''};
            let exactMultiplier = getRealInterventionCount(data.days, data.months, data.start, data.end);
            total += q * pricesFixed[id] * exactMultiplier;
        }
    }

    for (let roomId in planData) {
        if (roomId.startsWith('room_detail_')) {
            let roomInfo = planData[roomId];
            let type = roomInfo.roomType;
            let exactMultiplier = getRealInterventionCount(roomInfo.days, roomInfo.months, roomInfo.start, roomInfo.end);
            
            let consSelect = document.getElementById(`cons_select_${roomId}`);
            if (consSelect && consSelect.value === 'osp') {
                hasOspConsommables = true;
            }

            let tempsMinutes = 0;
            let nbEspaces = 1;

            if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
                let inputH = document.getElementById(`qty_h_${roomId}`);
                let inputF = document.getElementById(`qty_f_${roomId}`);
                let nbH = inputH ? parseInt(inputH.value) || 0 : 0;
                let nbF = inputF ? parseInt(inputF.value) || 0 : 0;
                nbEspaces = nbH + nbF;
                tempsMinutes = 15 + 5; 
            } else if (type === 'Restauration') {
                let inputEsp = document.getElementById(`qty_${roomId}`);
                let inputTab = document.getElementById(`qty_tables_${roomId}`);
                let inputCha = document.getElementById(`qty_chaises_${roomId}`);
                
                let esp = inputEsp ? parseInt(inputEsp.value) || 0 : 1;
                let tab = inputTab ? parseInt(inputTab.value) || 0 : 0;
                let cha = inputCha ? parseInt(inputCha.value) || 0 : 0;
                
                tempsMinutes = (15 + (tab * 2) + (cha * 1) + 5) * esp;
                nbEspaces = 1; 
            } else {
                let inputQty = document.getElementById(`qty_${roomId}`);
                nbEspaces = inputQty ? parseInt(inputQty.value) || 0 : 0;
                
                if (['Bureau', 'Salle de réunion', 'Accueil', 'Cuisine', 'Salle de repos', 'Salle de sport', 'Local technique'].includes(type)) {
                    tempsMinutes = 15 + 5; 
                } else if (['Ascenseur principal', 'Ascenseur secondaire', 'Palier', 'Couloir'].includes(type)) {
                    tempsMinutes = 10 + 5; 
                } else if (['Escalier principal', 'Escalier secondaire'].includes(type)) {
                    tempsMinutes = 20 + 5; 
                } else if (['Parking', 'Terrasse'].includes(type)) {
                    tempsMinutes = 25 + 5; 
                } else {
                    tempsMinutes = 15 + 5;
                }
            }

            let prixParInterventionUnitaire = (tempsMinutes / 60) * TAUX_HORAIRE;
            total += nbEspaces * prixParInterventionUnitaire * exactMultiplier;
        }
    }
    
    // 🟢 Calcul dynamique du forfait consommables selon le nombre d'employés !
    if (hasOspConsommables) {
        let nbEmployes = 1;
        // On récupère la valeur saisie dans le nouveau champ
        let isEntreprise = document.querySelector('input[name="statut"][value="Entreprise"]')?.checked;
        if (isEntreprise) {
            let inputEmployes = document.getElementById('nbEmployes');
            if (inputEmployes && inputEmployes.value > 0) {
                nbEmployes = parseInt(inputEmployes.value);
            }
        }
        total += (nbEmployes * 7.00);
    }

    let originalTotal = total;
    window.originalTotalValue = originalTotal;
    let discountText = "";
    
    let totalDiscountPercent = 0;
    let appliedPromoDevis = window.promoDiscountDevis;
    let appliedClientDiscount = window.clientDiscount;
    let appliedHoliday = window.holidayPromoActive ? 0.10 : 0;
    let conflict10 = false;

    let count10 = 0;
    if (appliedHoliday === 0.10) count10++;
    if (appliedPromoDevis === 0.10) count10++;
    if (appliedClientDiscount === 0.10) count10++;

    if (count10 >= 2) {
        conflict10 = true;
        if (appliedPromoDevis === 0.10) {
            appliedPromoDevis = 0;
        } else if (appliedHoliday === 0.10 && appliedClientDiscount === 0.10) {
            appliedClientDiscount = 0; 
        }
    }

    if (appliedClientDiscount > 0) totalDiscountPercent += appliedClientDiscount;
    if (appliedPromoDevis > 0) totalDiscountPercent += appliedPromoDevis;
    if (appliedHoliday > 0) totalDiscountPercent += appliedHoliday;

    if (totalDiscountPercent > 0) {
        let totalDiscountAmount = originalTotal * totalDiscountPercent;
        total -= totalDiscountAmount;

        if (appliedClientDiscount > 0) discountText += `<div class="price-discount-text">✓ Code VIP Fidélité (-10%)</div>`;
        if (appliedHoliday > 0) discountText += `<div class="price-discount-text">✓ Offre Jour Férié (-10%)</div>`;
        if (appliedPromoDevis > 0) discountText += `<div class="price-discount-text">✓ Code Promo Devis (-${appliedPromoDevis * 100}%)</div>`;

        if (conflict10) discountText += `<div class="price-min-alert" style="color: #e67e22; margin-top: 5px;">⚠️ Deux réductions de 10% ne sont pas cumulables.</div>`;

        if (totalDiscountPercent === 0.15) {
            discountText += `<div class="price-discount-text" style="font-weight: 800; color: var(--vert); margin-top: 5px; font-size: 0.85rem;">🎉 SUPER ! Vos offres se cumulent (10% + 5%) : Vous bénéficiez de 15% de remise totale !</div>`;
        } else if (totalDiscountPercent === 0.10 && (window.clientDiscount > 0 || appliedPromoDevis === 0.05 || window.holidayPromoActive)) {
            discountText += `<div class="price-discount-text" style="font-weight: 800; color: var(--vert); margin-top: 5px; font-size: 0.85rem;">🎉 OFFRE EN COURS : 10% de remise totale !</div>`;
        } else {
            discountText += `<div class="price-discount-text" style="font-weight: 800; margin-top: 5px;">Économie totale : -${totalDiscountAmount.toFixed(2)} €</div>`;
        }
    }

    window.currentTotalValue = total;
    
    const MINIMUM_INTERVENTION = 60.00;
    let mentionMinimum = "";
    
    if (total > 0 && total < MINIMUM_INTERVENTION) {
        mentionMinimum = `<div class="price-min-alert" style="margin-top:8px;">💡 Astuce : Un minimum de facturation de 60,00 € s'applique. Ajoutez d'autres prestations.</div>`;
    }
    
    const elAmount = document.getElementById('estimatedAmount');
    if (elAmount) {
        let mainPrice = `<div class="price-left-main">`;
        if (originalTotal > total) mainPrice += `<span class="price-left-old">${originalTotal.toFixed(2)} €</span> `;
        mainPrice += `${total.toFixed(2)} €*</div>`;
        
        if (originalTotal === 0) elAmount.innerHTML = `<div class="price-left-main">0.00 €*</div>`;
        else elAmount.innerHTML = mainPrice + discountText + mentionMinimum;
    }
}

function openQuote(baseService) {
    vitrerieVisibleCount = {};
    vitrerieIndexCount = {};
    customVisibleCount = 0;
    customIndexCount = 0;
    planData = {}; 
    activeServices = [];
    roomCounter = 0;
    
    window.promoDiscountDevis = 0;
    window.activePromoCodeDevis = "";
    const inputPromo = document.getElementById('promoCodeInputDevis');
    const msgPromo = document.getElementById('promoCodeMsgDevis');
    if (inputPromo) inputPromo.value = "";
    if (msgPromo) msgPromo.innerText = "";
    
    document.getElementById('topPriceBanner').style.display = "flex";
    document.getElementById('estimatedAmount').innerHTML = `<div class="price-left-main">0.00 €*</div>`;
    
    const fields = document.getElementById('dynamicFields');
    const crContainer = document.getElementById('customRowsContainer');
    if(crContainer) crContainer.innerHTML = '';
    
    fields.innerHTML = `
        <div class="guide-remplissage">
            <strong>ℹ️ Comment remplir votre devis ?</strong>
            <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                <li style="margin-bottom: 5px;"><b>1. Vos niveaux :</b> Ajoutez les étages de vos locaux (RDC, 1er étage...).</li>
                <li style="margin-bottom: 5px;"><b>2. Vos pièces :</b> Détaillez ce qui compose chaque niveau (Accueil, Sanitaires, Bureaux...).</li>
                <li style="margin-bottom: 5px;"><b>3. L'entretien :</b> Précisez le contenu de chaque pièce (surface au sol, nombre de corbeilles, toilettes...).</li>
                <li style="margin-bottom: 5px;"><b>4. La planification :</b> Cliquez sur "+ Planifier" pour définir la fréquence, et validez avec vos coordonnées en bas de page.</li>
            </ul>
        </div>
        <div id="allServicesContainer" style="display:flex; flex-direction:column; gap:20px;"></div>
        <div id="crossSellContainer" style="margin-top:25px; padding-top:20px; border-top:2px dashed #e1e8ef; text-align:center;"></div>
    `;

    const customBtn = document.getElementById('btnAddCustomRow');
    if (customBtn) customBtn.style.display = 'flex';
    
    document.getElementById('interactiveForm').style.display = "block";
    document.getElementById('postSubmitChoice').style.display = "none";
    document.getElementById('btnSubmitForm').innerText = "ENVOYER MON DEVIS";
    document.getElementById('btnSubmitForm').disabled = false;
    
    document.getElementById('quoteModal').style.display = "flex";
    
    addServiceToQuote(baseService);
}

function addServiceToQuote(service) {
    if (activeServices.includes(service)) return; 
    activeServices.push(service);

    const container = document.getElementById('allServicesContainer');
    let html = `<div id="block_${service}" style="background: white; border: 1px solid #e1e8ef; border-radius: 10px; padding: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); animation: fadeInDown 0.4s ease;">`;
    
    if(service === 'vitrerie') {
        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">🪟 Vitrerie</h3>`;
        html += `
        <div style="display: grid; grid-template-columns: 1fr 45px 75px 75px 25px; gap: 5px; padding: 0 6px; margin-bottom: 8px; align-items: center;">
            <span style="font-size:0.60rem; font-weight:800; color:var(--bleu);">PREST.</span>
            <span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center;">QTÉ</span>
            <span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center; display:flex; align-items:center; justify-content:center;">TYPE <span class="help-bubble">?<span class="tooltip-text">Complet (Int/Ext) ou ciblé. Influe sur le prix.</span></span></span>
            <span style="font-size:0.60rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">PLAN <span class="help-bubble">?<span class="tooltip-text">Définissez la fréquence d'intervention.</span></span></span>
            <span></span>
        </div>`;
        const rows = [{id:'vit_fen', n:'Fenêtres'}, {id:'vit_baie', n:'Baies'}, {id:'vit_velux', n:'Velux'}, {id:'vit_ver', n:'Véranda'}, {id:'vit_porte', n:'Porte-Fenêtre'}, {id:'vit_com', n:'Vitrine'}];
        rows.forEach(r => { html += `<div id="wrapper_${r.id}" style="margin-bottom:8px;">${generateVitrerieRowHtml(r.id, r.n, 0)}</div>`; });
    } 
    else if(service === 'shampouinage') {
        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">🛋️ Textiles & Moquettes</h3>`;
        html += `
        <div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;">
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">PRESTATION</span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">QTÉ</span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">PLANIFICATION <span class="help-bubble">?<span class="tooltip-text">Date précise ou récurrente.</span></span></span>
        </div>`;
        const rows = [{id:'can23', n:'Canapé 2-3pl'}, {id:'can45', n:'Canapé 4-5pl'}, {id:'canAng', n:'Angle'}, {id:'tapis', n:'Tapis'}, {id:'moq', n:'Moquette (m²)'}];
        rows.forEach(r => html += generateRowHtml(r.id, r.n));
    } 
    else if(service === 'vehicule') {
        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">🚗 Nettoyage Véhicule</h3>`;
        html += `
        <div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;">
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">PRESTATION</span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">QTÉ</span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">PLANIFICATION <span class="help-bubble">?<span class="tooltip-text">Date à laquelle vous souhaitez le nettoyage.</span></span></span>
        </div>`;
        html += generateRowHtml('pack_v', 'Pack Complet');
    } 
    else if(service === 'bureaux') {
        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">🏢 Bureaux & Locaux</h3>`;
        html += `
        <p style="font-size:0.85rem; color:var(--bleu); margin-bottom:15px; background:#eef3f8; padding:10px; border-radius:8px; border-left:4px solid var(--bleu);">
            <strong>Structurez vos espaces :</strong> Choisissez un niveau, puis ajoutez les pièces. <span class="help-bubble">?<span class="tooltip-text">Cette étape nous permet de comprendre l'agencement exact de vos locaux.</span></span>
        </p>
        <div id="levelsContainer"></div>
        <button type="button" class="btn-add-row" onclick="openLevelModal()" style="margin-top: 15px;">
            <span>+</span> Ajouter un niveau ou espace extérieur
        </button>`;
    }
    
    html += `</div>`;
    container.insertAdjacentHTML('beforeend', html);

    if(service === 'bureaux') {
        createLevelAccordion('Parking');
        createLevelAccordion('Entresol');
        createLevelAccordion('Rez-de-chaussée (RDC)');
        createLevelAccordion('Étage 1');
        createLevelAccordion('Étage 2');
        createLevelAccordion('Étage 3');
        createLevelAccordion('Étage 4');
    }

    updateCrossSellButtons();
    calculatePrice();
    
    const newBlock = document.getElementById('block_' + service);
    if(newBlock) { newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function updateCrossSellButtons() {
    const csContainer = document.getElementById('crossSellContainer');
    const availableServices = [
        { id: 'vitrerie', name: '🪟 Vitrerie' },
        { id: 'shampouinage', name: '🛋️ Textiles' },
        { id: 'vehicule', name: '🚗 Véhicule' },
        { id: 'bureaux', name: '🏢 Locaux' }
    ];

    let missingServices = availableServices.filter(s => !activeServices.includes(s.id));

    if (missingServices.length === 0) {
        csContainer.style.display = 'none'; 
        return;
    }

    csContainer.style.display = 'block';
    let html = `<p style="font-size:0.85rem; font-weight:800; color:var(--vert); margin-bottom:15px;">💡 Vous pouvez cumuler cette prestation avec :</p>`;
    html += `<div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">`;
    
    missingServices.forEach(s => {
        html += `<button type="button" class="btn-cross-sell" onclick="addServiceToQuote('${s.id}')">+ Ajouter ${s.name}</button>`;
    });
    
    html += `</div>`;
    csContainer.innerHTML = html;
}

function addCustomRow() {
    if (customVisibleCount >= 2) return; 

    customVisibleCount++;
    customIndexCount++;
    const id = 'custom_' + customIndexCount;
    planData[id] = { days: [], months: [], start:'', end:'', comment:'' };
    
    const html = `
    <div class="quote-row-item custom-row" id="row_${id}" style="display: flex; flex-direction: column; gap: 10px; border: 1px dashed var(--vert); background: #eef3f8; padding: 12px; border-radius: 8px; margin-top: 15px;">
        <textarea id="name_${id}" placeholder="Description de la demande..." style="width:100%; text-align:left; padding:10px; font-size:0.85rem; border: 1px solid #ccc; border-radius: 5px; resize: vertical; min-height: 80px; font-family: inherit; box-sizing: border-box;"></textarea>
        <div style="display: grid; grid-template-columns: 60px 1fr 30px; gap: 10px; align-items: center;">
            <input type="number" id="qty_${id}" min="0" value="1" oninput="calculatePrice()" style="padding: 8px; width: 100%; box-sizing: border-box;">
            <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', 'Demande spécifique')" style="padding: 8px; height: 100%;">+ Planifier</button>
            <button type="button" class="btn-delete-row" onclick="removeRow('${id}')" title="Supprimer cette demande" style="margin: 0; width: 100%; height: 100%; border-radius: 5px;">×</button>
        </div>
    </div>`;
    
    document.getElementById('customRowsContainer').insertAdjacentHTML('beforeend', html);
    
    if (customVisibleCount >= 2) {
        document.getElementById('btnAddCustomRow').style.display = 'none';
    }
}

function removeRow(id) {
    const row = document.getElementById('row_' + id);
    if (row) row.remove();
    if (planData[id]) delete planData[id];
    
    customVisibleCount--;
    
    if (customVisibleCount < 2) document.getElementById('btnAddCustomRow').style.display = 'flex';
    
    calculatePrice();
}

// =========================================================================
// 🚀 NOUVELLE FONCTION D'ENVOI HYBRIDE (GOOGLE SHEETS + EMAILJS)
// =========================================================================
function submitInteractiveForm() {
    try {
        const form = document.getElementById('interactiveForm');
        if (form.checkValidity()) {
            
            let elAmountText = document.getElementById('estimatedAmount').innerText.split('\n');
            let prixFinalAEnvoyer = elAmountText[elAmountText.length - 1]; 
            let majorationAppliquee = false;
            
            if (window.currentTotalValue > 0 && window.currentTotalValue < 60) {
                let messageAlerte = "⚠️ Votre estimation détaillée s'élève à " + window.currentTotalValue.toFixed(2) + " €.\n\n" +
                                    "Cependant, nos interventions sont soumises à un minimum de facturation de 60,00 € (pour couvrir le déplacement et le matériel).\n\n" +
                                    "💡 ASTUCE : Vous pouvez annuler et ajouter d'autres prestations (Vitres, Canapés...) pour atteindre ces 60 € et rentabiliser votre devis !\n\n" +
                                    "Voulez-vous quand même envoyer la demande au prix forfaitaire de 60,00 € ?";
                
                let clientAccepte = confirm(messageAlerte);
                
                if (!clientAccepte) return;
                majorationAppliquee = true;
                prixFinalAEnvoyer = "60.00 € (Forfait minimum appliqué)";
            }

            let statut = "";
            const radios = document.getElementsByName('statut');
            for (let i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    statut = radios[i].value;
                    break;
                }
            }

            // --- 1. PRÉPARATION DU PAQUET POUR GOOGLE SHEETS (Et App Terrain) ---
            const formDataPayload = {
                SessionID: "WEB_" + Date.now(),
                Statut: "En attente (Site Web)",
                NomClient: (statut === "Entreprise" && document.getElementById('nomEntreprise').value) ? document.getElementById('nomEntreprise').value : form.nom.value + " " + form.prenom.value,
                Email: form.email.value,
                Telephone: "Non renseigné sur le site",
                Adresse: form.adresse.value + ", " + form.ville.value,
                TypePrestation: activeServices.join(', '),
                Prix: prixFinalAEnvoyer,
                DataJSON: {
                    activeServices: activeServices,
                    planData: planData,
                    interlocuteur: form.interlocuteur.value
                }
            };

            // --- 2. ENVOI SILENCIEUX VERS GOOGLE SHEETS ---
            const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbyLrV60s2b8veFwqk4Rw0WMXqrEQ_WkRrs2WDfidGt1eaRoh70htg8Lu477Sc4jafAA/exec";
            
            fetch(GOOGLE_API_URL, {
                method: 'POST',
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(formDataPayload)
            })
            .then(res => console.log("✅ Devis envoyé vers Google Sheets avec succès"))
            .catch(e => console.error("Erreur d'envoi vers Sheets:", e));

            // --- 3. PRÉPARATION DU RÉCAPITULATIF TEXTE POUR L'EMAIL ---
            function getPlanningRecap(data) {
                if (!data || (data.days.length === 0 && data.months.length === 0 && !data.start && !data.end && (!data.comment || data.comment.trim() === ''))) {
                    return "Détails de planification à voir ensemble";
                }
                
                const fullDays = { 'Lun':'Lundi', 'Mar':'Mardi', 'Mer':'Mercredi', 'Jeu':'Jeudi', 'Ven':'Vendredi', 'Sam':'Samedi', 'Dim':'Dimanche' };
                const fullMonths = { 'Jan':'Janvier', 'Fév':'Février', 'Mar':'Mars', 'Avr':'Avril', 'Mai':'Mai', 'Juin':'Juin', 'Juil':'Juillet', 'Août':'Août', 'Sep':'Septembre', 'Oct':'Octobre', 'Nov':'Novembre', 'Déc':'Décembre' };
                
                let parts = [];
                if (data.days && data.days.length > 0) parts.push(`Jours [${data.days.map(d => fullDays[d]).join(', ')}]`);
                if (data.months && data.months.length > 0) parts.push(`Mois [${data.months.map(m => fullMonths[m]).join(', ')}]`);
                if (data.start && data.end) parts.push(`Période du ${data.start} au ${data.end}`);
                else if (data.start || data.end) parts.push(`Date : ${data.start || data.end}`); 
                
                let recapStr = parts.length > 0 ? parts.join(' | ') : "Dates à voir ensemble";
                if (data.comment && data.comment.trim() !== '') recapStr += `\n      📌 Remarque client : "${data.comment.trim()}"`;
                
                return recapStr;
            }

            let recap = "--- RÉCAPITULATIF DU DEVIS ---\n\n";

            // 🟢 L'information de l'effectif figure bien ici pour le mail
            if (statut === "Entreprise") {
                recap += `🏢 STRUCTURE : ${document.getElementById('nomEntreprise').value}\n`;
                let eff = document.getElementById('nbEmployes')?.value || "Non précisé";
                recap += `👥 EFFECTIF : ${eff} collaborateur(s) sur site\n\n`;
            }

            let aDesVitres = false;
            document.querySelectorAll('input[id^="qty_vit_"]').forEach(input => {
                let q = parseInt(input.value) || 0;
                if (q > 0) {
                    if (!aDesVitres) { recap += "🪟 VITRERIE :\n"; aDesVitres = true; }
                    let idFull = input.id.replace('qty_', '');
                    let typeSelect = document.getElementById('type_' + idFull);
                    let typeVitrage = typeSelect ? typeSelect.value : 'complet';
                    let label = input.parentElement.querySelector('label').innerText;
                    
                    recap += `  - ${label} : ${q} (Nettoyage : ${typeVitrage})\n`;
                    recap += `    Planning : ${getPlanningRecap(planData[idFull])}\n`;
                }
            });
            if (aDesVitres) recap += "\n";

            let aDesTextiles = false;
            const fixesIds = { 'can23': 'Canapé 2-3 places', 'can45': 'Canapé 4-5 places', 'canAng': 'Canapé d\'angle', 'tapis': 'Tapis', 'moq': 'Moquette (m²)', 'pack_v': 'Pack Véhicule Complet' };
            for (let id in fixesIds) {
                let input = document.getElementById('qty_' + id);
                let q = parseInt(input ? input.value : 0) || 0;
                if (q > 0) {
                    if (!aDesTextiles) { recap += "🛋️ TEXTILES / VÉHICULES :\n"; aDesTextiles = true; }
                    recap += `  - ${fixesIds[id]} : ${q}\n`;
                    recap += `    Planning : ${getPlanningRecap(planData[id])}\n`;
                }
            }
            if (aDesTextiles) recap += "\n";

            let aDesLocaux = false;
            for (let roomId in planData) {
                if (roomId.startsWith('room_detail_')) {
                    if (!aDesLocaux) { recap += "🏢 BUREAUX & LOCAUX EXTRAITS :\n"; aDesLocaux = true; }
                    let roomInfo = planData[roomId];
                    let card = document.getElementById('row_' + roomId);
                    let solSelect = card ? card.querySelector('select') : null;
                    let typeSol = solSelect ? solSelect.value : 'Non précisé';
                    
                    recap += `  - Espace : ${roomInfo.roomType} (Type de sol : ${typeSol})\n`;
                    
                    if (roomInfo.roomType === 'Sanitaires' || roomInfo.roomType === 'Douche' || roomInfo.roomType === 'Vestiaire') {
                        let h = document.getElementById(`qty_h_${roomId}`)?.value || 0;
                        let f = document.getElementById(`qty_f_${roomId}`)?.value || 0;
                        recap += `    Quantité : Homme(s) x${h} / Femme(s) x${f}\n`;
                    } else if (roomInfo.roomType === 'Restauration') {
                        let esp = document.getElementById(`qty_${roomId}`)?.value || 1;
                        let tab = document.getElementById(`qty_tables_${roomId}`)?.value || 0;
                        let cha = document.getElementById(`qty_chaises_${roomId}`)?.value || 0;
                        recap += `    Quantité : Espace(s) x${esp} (${tab} tables, ${cha} chaises)\n`;
                    } else {
                        let qty = document.getElementById(`qty_${roomId}`)?.value || 1;
                        recap += `    Quantité : x${qty}\n`;
                    }

                    let consSelect = document.getElementById(`cons_select_${roomId}`);
                    if (consSelect) {
                        let consText = consSelect.value === 'osp' ? 'Fournis par O.S.P+' : 'À la charge du client';
                        recap += `    Consommables : ${consText}\n`;
                    }

                    let prestCochees = [];
                    card.querySelectorAll('.prest-pill input[type="checkbox"]:checked').forEach(p => {
                        let labelPrest = p.parentElement.querySelector('label').innerText;
                        prestCochees.push(labelPrest);
                    });
                    recap += `    Prestations demandées : [${prestCochees.join(', ')}]\n`;
                    recap += `    Planning de l'espace : ${getPlanningRecap(roomInfo)}\n`;
                }
            }
            if (aDesLocaux) recap += "\n";

            let aDesDemandesParticulieres = false;
            for (let id in planData) {
                if (id.startsWith('custom_')) {
                    let textTextarea = document.getElementById('name_' + id)?.value || '';
                    let qtyCustom = document.getElementById('qty_' + id)?.value || 1;
                    if (textTextarea.trim() !== '') {
                        if (!aDesDemandesParticulieres) { recap += "✨ DEMANDES PARTICULIÈRES :\n"; aDesDemandesParticulieres = true; }
                        recap += `  - Description : "${textTextarea}" (Quantité/Répétition : x${qtyCustom})\n`;
                        recap += `    Planning associé : ${getPlanningRecap(planData[id])}\n`;
                    }
                }
            }

            recap += `\n--- INFORMATIONS FINANCIÈRES ---\n`;
            recap += `Base de calcul initiale : ${window.originalTotalValue.toFixed(2)} €\n`;
            
            let conflict10 = false;
            let finalPromoDevis = window.promoDiscountDevis;
            let finalClientDiscount = window.clientDiscount;

            if (window.holidayPromoActive && window.promoDiscountDevis === 0.10) {
                finalPromoDevis = 0;
                conflict10 = true;
            } else if (window.holidayPromoActive && window.clientDiscount === 0.10) {
                finalClientDiscount = 0;
                conflict10 = true;
            }

            if (finalClientDiscount > 0) recap += `🎁 Remise Client VIP Fidélité (10%) active via Code : ${window.activeClientCode}\n`;
            if (finalPromoDevis > 0) recap += `🎁 Code Promo de validation (${finalPromoDevis * 100}%) appliqué avec le code : ${window.activePromoCodeDevis}\n`;
            if (window.holidayPromoActive) recap += `🎁 Promo Jour Férié (10%) appliquée (Contrat final à signer sous 15 jours)\n`;
            if (conflict10) recap += `⚠️ Un cumul de deux offres à 10% a été détecté et bloqué conformément à la politique tarifaire.\n`;
            
            let totalPercent = finalClientDiscount + finalPromoDevis + (window.holidayPromoActive ? 0.10 : 0);
            if (totalPercent > 0) recap += `✅ TOTAL DES REMISES CUMULÉES EXTRAITES : ${Math.round(totalPercent * 100)}%\n`;

            recap += `Prix final proposé au client : ${prixFinalAEnvoyer}\n`;
            if (majorationAppliquee) recap += `⚠️ Le client a validé et accepté la majoration forfaitaire à 60,00 € car son panier initial était trop faible.\n`;

            const btn = document.getElementById('btnSubmitForm');
            btn.innerText = "Envoi en cours..."; 
            btn.disabled = true;
            
            // --- 4. ENVOI CLASSIQUE PAR EMAILJS ---
            emailjs.send('service_wfrbr4e', 'template_oncrl1l', {
                statut: statut,
                nom: form.nom.value, 
                prenom: form.prenom.value, 
                email: form.email.value, 
                email_client: form.email.value,
                adresse: form.adresse.value,
                ville: form.ville.value, 
                interlocuteur: form.interlocuteur.value,
                prix: prixFinalAEnvoyer,
                recapitulatif: recap
            })
            .then(() => {
                form.style.display = "none";
                document.getElementById('postSubmitChoice').style.display = "block";
            })
            .catch((error) => {
                console.error("Erreur détaillée EmailJS :", error);
                
                form.style.display = "none";
                
                let surchargeMessage = document.createElement('div');
                surchargeMessage.innerHTML = `
                    <div style="background: #fdf8e4; border-left: 5px solid var(--vert); padding: 25px; border-radius: 8px; text-align: center; margin-top: 20px; animation: fadeInDown 0.5s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        <h3 style="color: var(--bleu); margin-bottom: 15px; font-size: 1.4rem;">🔥 Victime de notre succès !</h3>
                        <p style="color: #444; font-size: 1rem; margin-bottom: 15px; line-height: 1.5;">
                            En raison d'un <strong>très grand nombre de demandes de devis</strong> aujourd'hui, notre système automatique est temporairement saturé.
                        </p>
                        <p style="color: #444; font-size: 1rem; margin-bottom: 20px;">
                            Pas d'inquiétude, votre estimation (<strong>${prixFinalAEnvoyer}</strong>) a bien été calculée ! Pour ne pas perdre votre demande et la traiter en priorité, contactez-moi directement :
                        </p>
                        <a href="mailto:alexandre.jonot@ospplus.com?subject=Validation devis prioritaire OSP+ - ${prixFinalAEnvoyer}" 
                           style="display: inline-block; background: var(--vert); color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 1.1rem; margin-bottom: 15px; transition: transform 0.2s;">
                           ✉️ alexandre.jonot@ospplus.com
                        </a>
                        <p style="color: var(--bleu); font-weight: 800; font-size: 1.1rem; margin-top: 5px;">
                            📞 Ou par téléphone au 07 45 02 76 24
                        </p>
                    </div>
                `;
                
                form.parentNode.insertBefore(surchargeMessage, form);
            });
            
        } else { 
            form.reportValidity(); 
        }
    } catch (erreurGlobale) {
        console.error("Erreur inattendue dans le script :", erreurGlobale);
        alert("Une erreur inattendue empêche l'envoi. Rechargez la page ou contactez-moi au 07 45 02 76 24.");
        document.getElementById('btnSubmitForm').innerText = "ENVOYER MON DEVIS";
        document.getElementById('btnSubmitForm').disabled = false;
    }
}

function closeQuote() { document.getElementById('quoteModal').style.display = "none"; }

// --- GESTION DU CLIC À L'EXTÉRIEUR POUR FERMER TOUTES LES FENÊTRES MODALES ---
window.onclick = function(e) { 
    if(e.target.id === 'quoteModal') closeQuote(); 
    if(e.target.id === 'clientModal') closeClientModal(); 
    if(e.target.id === 'mentionsModal') closeMentions(); 
    if(e.target.id === 'levelModal') closeLevelModal();
    if(e.target.id === 'planningModal') document.getElementById('planningModal').style.display = "none";
    if(e.target.id === 'carteModal') closeCarteModal();
    if(e.target.id === 'imageModal') closeImageModal(); // Permet de fermer l'image en cliquant à côté
}

function initDynamicSliders() {
    document.querySelectorAll('.faq-card, .review-card').forEach(container => {
        const slides = container.querySelectorAll('.dynamic-slide');
        if (slides.length <= 1) return;
        let i = 0; setInterval(() => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); }, 10000);
    });
}
window.addEventListener('DOMContentLoaded', initDynamicSliders);

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-animate').forEach(section => {
    animationObserver.observe(section);
});

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

// --- GESTION DE LA CARTE DE VISITE VIRTUELLE ---

function openCarteModal() {
    document.getElementById('carteModal').style.display = 'flex';
}

function closeCarteModal() {
    document.getElementById('carteModal').style.display = 'none';
    const flipCard = document.querySelector('.flip-card');
    if (flipCard) flipCard.classList.remove('flipped');
}

function toggleFlipCard() {
    const flipCard = document.querySelector('.flip-card');
    if (flipCard) flipCard.classList.toggle('flipped');
}

function downloadCarte() {
    let linkA = document.createElement('a');
    linkA.href = 'Carte visite A.jpg?v=12';
    linkA.download = 'OSP_Plus_Carte_Recto.jpg';
    document.body.appendChild(linkA);
    linkA.click();
    document.body.removeChild(linkA);

    setTimeout(() => {
        let linkB = document.createElement('a');
        linkB.href = 'Carte visite B.jpg?v=12';
        linkB.download = 'OSP_Plus_Carte_Verso.jpg';
        document.body.appendChild(linkB);
        linkB.click();
        document.body.removeChild(linkB);
    }, 500);
}

function printCarte() {
    let printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Imprimer - Carte de Visite O.S.P+</title>
            <style>
                body { text-align: center; font-family: sans-serif; padding: 20px; }
                img { max-width: 100%; width: 400px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 5px; }
                p { color: #1a3c6c; font-weight: bold; }
            </style>
        </head>
        <body>
            <p>Découpez le long des bords :</p>
            <img src="Carte visite A.jpg?v=12" alt="Recto">
            <br>
            <img src="Carte visite B.jpg?v=12" alt="Verso">
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// ==========================================
// 🚀 GESTION DYNAMIQUE DES ÉTIQUETTES DE SERVICES
// ==========================================
function gererEtiquettesNouveautes() {
    const badges = document.querySelectorAll('.dynamic-badge');
    if (badges.length === 0) return;

    // Date actuelle
    const dateActuelle = new Date();
    
    // Date cible : 15 Août de l'année en cours (Attention: en JS, les mois commencent à 0, donc 7 = Août)
    const anneeEnCours = dateActuelle.getFullYear();
    const dateLancement = new Date(anneeEnCours, 7, 15); // 15 Août

    badges.forEach(badge => {
        if (dateActuelle >= dateLancement) {
            // À partir du 15 août
            badge.innerText = "Nouveau service";
        } else {
            // Avant le 15 août
            badge.innerText = "Dispo le 15 Août"; // Texte raccourci pour mieux tenir dans le badge
        }
    });
}

// Lancement de la vérification au chargement de la page
window.addEventListener('DOMContentLoaded', gererEtiquettesNouveautes);

// --- FONCTIONS POUR LA MODALE DES IMAGES EN GRAND ---

// Ouvrir l'image
function openImageModal(imageSource) {
    var modal = document.getElementById("imageModal");
    var fullImg = document.getElementById("fullSizeImage");
    
    // On donne la source de la photo cliquée à la grande photo
    fullImg.src = imageSource; 
    
    // On affiche la modale
    modal.style.display = "flex";
    
    // Empêcher la page de défiler derrière
    document.body.style.overflow = "hidden"; 
}

// Fermer l'image
function closeImageModal() {
    var modal = document.getElementById("imageModal");
    modal.style.display = "none";
    
    // Réactiver le défilement de la page
    document.body.style.overflow = "auto"; 
}