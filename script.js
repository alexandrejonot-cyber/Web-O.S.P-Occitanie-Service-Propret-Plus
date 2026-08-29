// ==========================================
// 🌐 DÉTECTION GLOBALE DE LA LANGUE
// ==========================================
const siteLang = document.documentElement.lang ? document.documentElement.lang.toLowerCase() : 'fr';

// Dictionnaire des messages pour le moteur de code promo
const TRANSLATIONS = {
    fr: {
        codeVide: "Code vide.",
        expire: "Ce code promotionnel a expiré ou a déjà été utilisé.",
        securiteDate: "Structure de sécurité de la date compromise.",
        valideExcept: (montant) => `Remise Exceptionnelle validée avec succès (-${montant}%) !`,
        valideBase: (remise) => `Code validé depuis la base de données (-${remise}%) !`,
        formatOsp: "Format OSP invalide (longueur incorrecte).",
        structOsp: "Structure OSP incorrecte.",
        lettresOsp: "Lettres de sécurité absentes ou date invalide.",
        montantInvalide: "Montant de remise invalide.",
        ospFutur: "Code OSP pas encore actif.",
        ospOk: (montant) => `Code Promo appliqué (-${montant}%) !`,
        vipInvalide: "Lettres de sécurité absentes ou dates VIP invalides.",
        vipClient: "Ce code VIP ne correspond pas à votre compte client.",
        vipFutur: "Code VIP pas encore actif.",
        vipExpire: "Code VIP expiré.",
        vipOk: (montant) => `Code VIP Fidélité appliqué (-${montant}%) !`,
        inconnu: "Code inconnu, expiré ou mal orthographié.",
        saisirCode: "Veuillez saisir un code.",
        securitePrompt: "🔒 SÉCURITÉ VIP : Veuillez renseigner votre Identifiant Client pour déverrouiller ce code (ex : client123) :",
        annulePrompt: "✗ Validation annulée : Identifiant requis."
    },
    en: {
        codeVide: "Empty code.",
        expire: "This promotional code has expired or has already been used.",
        securiteDate: "Date security structure compromised.",
        valideExcept: (montant) => `Exceptional discount successfully validated (-${montant}%) !`,
        valideBase: (remise) => `Code validated from the database (-${remise}%) !`,
        formatOsp: "Invalid OSP format (incorrect length).",
        structOsp: "Incorrect OSP structure.",
        lettresOsp: "Security letters missing or invalid date.",
        montantInvalide: "Invalid discount amount.",
        ospFutur: "OSP code not active yet.",
        ospOk: (montant) => `Promo Code applied (-${montant}%) !`,
        vipInvalide: "Security letters missing or invalid VIP dates.",
        vipClient: "This VIP code does not match your client account.",
        vipFutur: "VIP code not active yet.",
        vipExpire: "VIP code expired.",
        vipOk: (montant) => `VIP Loyalty Code applied (-${montant}%) !`,
        inconnu: "Unknown, expired, or misspelled code.",
        saisirCode: "Please enter a code.",
        securitePrompt: "🔒 VIP SECURITY: Please enter your Client ID to unlock this code (e.g., client123):",
        annulePrompt: "✗ Validation cancelled: ID required."
    },
    vi: {
        codeVide: "Mã trống.",
        expire: "Mã khuyến mãi này đã hết hạn hoặc đã được sử dụng.",
        securiteDate: "Cấu trúc bảo mật ngày bị xâm phạm.",
        valideExcept: (montant) => `Giảm giá đặc biệt đã được xác nhận (-${montant}%) !`,
        valideBase: (remise) => `Mã đã được xác minh từ cơ sở dữ liệu (-${remise}%) !`,
        formatOsp: "Định dạng OSP không hợp lệ (độ dài không chính xác).",
        structOsp: "Cấu trúc OSP không chính xác.",
        lettresOsp: "Thiếu chữ cái bảo mật hoặc ngày không hợp lệ.",
        montantInvalide: "Số tiền giảm giá không hợp lệ.",
        ospFutur: "Mã OSP chưa được kích hoạt.",
        ospOk: (montant) => `Đã áp dụng mã giảm giá (-${montant}%) !`,
        vipInvalide: "Thiếu chữ cái bảo mật hoặc ngày VIP không hợp lệ.",
        vipClient: "Mã VIP này không khớp với tài khoản khách hàng của bạn.",
        vipFutur: "Mã VIP chưa được kích hoạt.",
        vipExpire: "Mã VIP đã hết hạn.",
        vipOk: (montant) => `Đã áp dụng mã VIP Thân thiết (-${montant}%) !`,
        inconnu: "Mã không xác định, đã hết hạn hoặc viết sai chính tả.",
        saisirCode: "Vui lòng nhập mã.",
        securitePrompt: "🔒 BẢO MẬT VIP: Vui lòng nhập Mã khách hàng của bạn để mở khóa mã này (ví dụ: client123):",
        annulePrompt: "✗ Hủy xác minh: Bắt buộc phải có mã định danh."
    }
};

const langKey = TRANSLATIONS[siteLang] ? siteLang : 'fr';
const msgLang = TRANSLATIONS[langKey];

const mappingDisplay = {
    'Bureau': { fr: '💼 Bureau', en: '💼 Office', vi: '💼 Văn phòng' },
    'Salle de réunion': { fr: '🗣️ Réunion', en: '🗣️ Meeting Room', vi: '🗣️ Phòng họp' },
    'Sanitaires': { fr: '🚻 Sanitaires', en: '🚻 Restrooms', vi: '🚻 Nhà vệ sinh' },
    'Douche': { fr: '🚿 Douches', en: '🚿 Showers', vi: '🚿 Phòng tắm' },
    'Vestiaire': { fr: '🧳 Vestiaires', en: '🧳 Locker Room', vi: '🧳 Phòng thay đồ' },
    'Accueil': { fr: '🛎️ Accueil', en: '🛎️ Reception', vi: '🛎️ Sảnh tiếp tân' },
    'Cuisine': { fr: '🍳 Cuisine', en: '🍳 Kitchen', vi: '🍳 Nhà bếp' },
    'Restauration': { fr: '🍽️ Restauration', en: '🍽️ Dining Area', vi: '🍽️ Khu ăn uống' },
    'Salle de repos': { fr: '☕ Repos', en: '☕ Breakroom', vi: '☕ Phòng nghỉ' },
    'Salle de sport': { fr: '🏋️ Sport', en: '🏋️ Gym Space', vi: '🏋️ Phòng thể thao' },
    'Couloir': { fr: '🚶 Couloir', en: '🚶 Hallway', vi: '🚶 Hành lang' },
    'Ascenseur principal': { fr: '🛗 Asc. Princ.', en: '🛗 Main Elevator', vi: '🛗 Thang máy chính' },
    'Ascenseur secondaire': { fr: '🛗 Asc. Sec.', en: '🛗 Service Elevator', vi: '🛗 Thang máy phụ' },
    'Escalier principal': { fr: '📶 Esc. Princ.', en: '📶 Main Stairs', vi: '📶 Cầu thang chính' },
    'Escalier secondaire': { fr: '📶 Esc. Sec.', en: '📶 Service Stairs', vi: '📶 Cầu thang phụ' },
    'Palier': { fr: '🚪 Palier', en: '🚪 Landing', vi: '🚪 Chiếu nghỉ' },
    'Terrasse': { fr: '☀️ Terrasse', en: '☀️ Terrace', vi: '☀️ Sân thượng' },
    'Parking': { fr: '🚗 Parking', en: '🚗 Parking Lot', vi: '🚗 Bãi đậu xe' },
    'Local technique': { fr: '🔧 Local tech.', en: '🔧 Technical Room', vi: '🔧 Phòng kỹ thuật' },
    'Autre': { fr: '➕ Autre', en: '➕ Other', vi: '➕ Khác' }
};

const taskTranslations = {
    'Aspiration / Lavage': { fr: 'Aspiration / Lavage', vi: 'Hút bụi / Lau sàn', en: 'Vacuuming / Mopping' },
    'Dépoussiérage bureaux': { fr: 'Dépoussiérage bureaux', vi: 'Quét bụi bàn làm việc', en: 'Dusting desks' },
    'Vidage poubelles': { fr: 'Vidage poubelles', vi: 'Đổ rác', en: 'Emptying bins' },
    'Désinfection points contact': { fr: 'Désinfection points contact', vi: 'Khử trùng các điểm tiếp xúc', en: 'Disinfecting contact points' },
    'Dépoussiérage': { fr: 'Dépoussiérage', vi: 'Quét bụi', en: 'Dusting' },
    'Remise en place chaises': { fr: 'Remise en place chaises', vi: 'Sắp xếp lại ghế', en: 'Rearranging chairs' },
    'Nettoyage cuvettes / urinoirs': { fr: 'Nettoyage cuvettes / urinoirs', vi: 'Làm sạch bồn cầu / bồn tiểu', en: 'Cleaning bowls / urinals' },
    'Lavage Sols': { fr: 'Lavage Sols', vi: 'Lau sàn', en: 'Floor mopping' },
    'Détartrage & Désinfection': { fr: 'Détartrage & Désinfection', vi: 'Tẩy cặn & Khử trùng', en: 'Descaling & Disinfection' },
    'Miroirs & Lavabos': { fr: 'Miroirs & Lavabos', vi: 'Gương & Bồn rửa mặt', en: 'Mirrors & Sinks' },
    'Mise en place consommables': { fr: 'Mise en place consommables', vi: 'Đặt vật tư tiêu hao', en: 'Replacing supplies' },
    'Détartrage & Désinfection cabines': { fr: 'Détartrage & Désinfection cabines', vi: 'Tẩy cặn & Khử trùng phòng tắm', en: 'Descaling & Disinfecting cubicles' },
    'Nettoyage siphons': { fr: 'Nettoyage siphons', vi: 'Làm sạch ống thoát nước', en: 'Cleaning siphons' },
    'Désinfection bancs/casiers': { fr: 'Désinfection bancs/casiers', vi: 'Khử trùng ghế băng/tủ đồ', en: 'Disinfecting benches/lockers' },
    'Nettoyage miroirs': { fr: 'Nettoyage miroirs', vi: 'Làm sạch gương', en: 'Cleaning mirrors' },
    'Dépoussiérage casiers ext.': { fr: 'Dépoussiérage casiers ext.', vi: 'Quét bụi bên ngoài tủ đồ', en: 'Dusting exterior lockers' },
    'Nettoyage banque d\'accueil': { fr: 'Nettoyage banque d\'accueil', vi: 'Làm sạch quầy tiếp tân', en: 'Cleaning reception desk' },
    'Traces vitrages': { fr: 'Traces vitrages', vi: 'Lau vết bẩn trên kính', en: 'Window smudges' },
    'Désinfection tables': { fr: 'Désinfection tables', vi: 'Khử trùng bàn', en: 'Disinfecting tables' },
    'Désinfection plans de travail': { fr: 'Désinfection plans de travail', vi: 'Khử trùng mặt bàn bếp', en: 'Disinfecting countertops' },
    'Nettoyage éviers': { fr: 'Nettoyage éviers', vi: 'Làm sạch bồn rửa chén', en: 'Cleaning sinks' },
    'Nettoyage micro-ondes': { fr: 'Nettoyage micro-ondes', vi: 'Làm sạch lò vi sóng', en: 'Cleaning microwave' },
    'Nettoyage frigo': { fr: 'Nettoyage frigo', vi: 'Làm sạch tủ lạnh', en: 'Cleaning fridge' },
    'Nettoyage tables': { fr: 'Nettoyage tables', vi: 'Làm sạch bàn', en: 'Cleaning tables' },
    'Nettoyage machines à café': { fr: 'Nettoyage machines à café', vi: 'Làm sạch máy pha cà phê', en: 'Cleaning coffee machines' },
    'Aération': { fr: 'Aération', vi: 'Thông gió', en: 'Airing out' },
    'Désinfection machines': { fr: 'Désinfection machines', vi: 'Khử trùng máy móc', en: 'Disinfecting machines' },
    'Miroirs': { fr: 'Miroirs', vi: 'Gương', en: 'Mirrors' },
    'Désinfection boutons': { fr: 'Désinfection boutons', vi: 'Khử trùng nút bấm', en: 'Disinfecting buttons' },
    'Traces portes int/ext': { fr: 'Traces portes int/ext', vi: 'Lau vết bẩn cửa trong/ngoài', en: 'Door marks int/ext' },
    'Dépoussiérage plinthes': { fr: 'Dépoussiérage plinthes', vi: 'Quét bụi len chân tường', en: 'Dusting baseboards' },
    'Nettoyage main courante': { fr: 'Nettoyage main courante', vi: 'Làm sạch tay vịn cầu thang', en: 'Cleaning handrails' },
    'Plinthes': { fr: 'Plinthes', vi: 'Len chân tường', en: 'Baseboards' },
    'Ramassage déchets': { fr: 'Ramassage déchets', vi: 'Thu gom rác thải', en: 'Picking up trash' },
    'Balayage': { fr: 'Balayage', vi: 'Quét dọn', en: 'Sweeping' },
    'Toiles d\'araignées': { fr: 'Toiles d\'araignées', vi: 'Quét màng nhện', en: 'Cobwebs' },
    'Nettoyage mobilier ext.': { fr: 'Nettoyage mobilier ext.', vi: 'Làm sạch nội thất ngoài trời', en: 'Cleaning outdoor furniture' }
};

// ==========================================
// 🚀 GESTION DE LA VERSION DU SCRIPT
// ==========================================
const APP_VERSION = "v4.36-DEPLACEMENT-INTELLIGENT-30KM"; 

function afficherVersion() {
    console.log("🚀 OSP+ Script Chargé - " + APP_VERSION + " [Langue : " + langKey.toUpperCase() + "]");
}
window.addEventListener('DOMContentLoaded', afficherVersion);

// ==========================================
// 💡 BULLES D'INFORMATION DES CARTES (HERO)
// ==========================================
function toggleCardBubble(event, bubbleId) {
    event.stopPropagation();
    const targetBubble = document.getElementById(bubbleId);
    const isAlreadyOpen = targetBubble ? targetBubble.classList.contains('active') : false;

    document.querySelectorAll('.card-info-bubble').forEach(b => {
        b.classList.remove('active');
        const parentCard = b.closest('.hero-service-card');
        if (parentCard) parentCard.style.zIndex = '';
    });

    if (!isAlreadyOpen && targetBubble) {
        targetBubble.classList.add('active');
        const activeCard = targetBubble.closest('.hero-service-card');
        if (activeCard) {
            activeCard.style.zIndex = '200';
        }
    }
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.card-info-bubble') && !e.target.closest('.card-info-btn')) {
        document.querySelectorAll('.card-info-bubble').forEach(b => {
            b.classList.remove('active');
            const parentCard = b.closest('.hero-service-card');
            if (parentCard) parentCard.style.zIndex = '';
        });
    }
});

// ==========================================
// 👑 MOTEUR DE SIMULATION DATE & MODE ADMIN
// ==========================================

function getSimulatedDate() {
    const simDate = localStorage.getItem('osp_simulated_date');
    const simTimestamp = localStorage.getItem('osp_simulated_timestamp');

    if (simDate && simTimestamp) {
        const now = Date.now();
        const dixMinutes = 10 * 60 * 1000; 

        if (now - parseInt(simTimestamp, 10) > dixMinutes) {
            localStorage.removeItem('osp_simulated_date');
            localStorage.removeItem('osp_simulated_timestamp');
            console.log("🔄 Reset automatique du mode simulation après 10 minutes.");
            return new Date(); 
        }

        const parts = simDate.split('-');
        if (parts.length === 3) {
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        }
    }
    return new Date(); 
}

function initAdminModalUI() {
    if (document.getElementById('adminModal')) return;

    const modalHtml = `
    <div id="adminModal" class="modal" style="display:none; z-index: 100000;">
        <div class="modal-content small" style="border: 3px solid var(--vert); background: white; padding: 20px; border-radius: 15px; text-align: center;">
            <div style="background: var(--bleu); color: white; padding: 10px; border-radius: 8px; margin-bottom: 15px; font-weight: bold;">
                👑 MODE ADMINISTRATEUR - SIMULATION JOUR FÉRIÉ
            </div>
            
            <div style="font-size: 0.85rem; margin-bottom: 15px; background: #f4f8fb; padding: 10px; border-radius: 8px; text-align: left;">
                📅 <strong>Date réelle :</strong> <span id="adminRealDateDisplay"></span><br>
                📍 <strong>Date active (site) :</strong> <span id="adminSimDateDisplay" style="color: var(--vert); font-weight: bold;"></span>
            </div>

            <div class="input-group" style="margin-bottom: 20px;">
                <label for="adminDateInput">Choisir une date de simulation :</label>
                <input type="date" id="adminDateInput" style="padding: 10px; border-radius: 8px; border: 2px solid var(--bleu); width: 100%; box-sizing: border-box; text-align: center; font-weight: bold;">
            </div>

            <div style="display: flex; gap: 10px; justify-content: center;">
                <button type="button" onclick="validerSimulationAdmin()" style="background: var(--vert); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; flex: 1;">Valider</button>
                <button type="button" onclick="resetSimulationAdmin()" style="background: #e74c3c; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; flex: 1;">Reset (Normal)</button>
            </div>
            
            <button type="button" onclick="closeAdminModal()" style="margin-top: 15px; background: transparent; border: none; color: #888; text-decoration: underline; cursor: pointer; font-size: 0.8rem;">Fermer la fenêtre</button>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function openAdminModal() {
    initAdminModalUI();
    const now = new Date();
    const simDate = getSimulatedDate();

    document.getElementById('adminRealDateDisplay').innerText = now.toLocaleDateString('fr-FR');
    document.getElementById('adminSimDateDisplay').innerText = simDate.toLocaleDateString('fr-FR') + (localStorage.getItem('osp_simulated_date') ? ' (Simulée)' : ' (Réelle)');
    
    const year = simDate.getFullYear();
    const month = String(simDate.getMonth() + 1).padStart(2, '0');
    const day = String(simDate.getDate()).padStart(2, '0');
    document.getElementById('adminDateInput').value = `${year}-${month}-${day}`;

    document.getElementById('adminModal').style.display = 'flex';
}

function closeAdminModal() {
    const m = document.getElementById('adminModal');
    if (m) m.style.display = 'none';
}

function validerSimulationAdmin() {
    const val = document.getElementById('adminDateInput').value;
    if (val) {
        localStorage.setItem('osp_simulated_date', val);
        localStorage.setItem('osp_simulated_timestamp', Date.now()); 
        closeAdminModal();
        alert("✅ Mode Simulation activé à la date du : " + val + "\n\nLa page va se recharger pour appliquer les événements automatiquement.");
        window.location.reload(); 
    }
}

function resetSimulationAdmin() {
    localStorage.removeItem('osp_simulated_date');
    localStorage.removeItem('osp_simulated_timestamp'); 
    closeAdminModal();
    alert("🔄 Mode normal réactivé (Date du jour système).\n\nLa page va se recharger.");
    window.location.reload(); 
}

window.addEventListener('DOMContentLoaded', initAdminModalUI);

// ==========================================
// ⚙️ MOTEUR DE VALIDATION DE CODES (HYBRIDE)
// ==========================================

function parserEtValiderDate(dateStr, lettre1, lettre2) {
    if (!dateStr || dateStr.length !== 8) return null;
    if (dateStr[2] !== lettre1 || dateStr[5] !== lettre2) return null;
    const jour = parseInt(dateStr.substring(0, 2), 10);
    const mois = parseInt(dateStr.substring(3, 5), 10) - 1; 
    const annee = parseInt("20" + dateStr.substring(6, 8), 10); 
    const dateObj = new Date(annee, mois, jour);
    if (dateObj.getDate() !== jour || dateObj.getMonth() !== mois || dateObj.getFullYear() !== annee) return null;
    return dateObj;
}

function validerCodeRemise(code, idClientActuel = null) {
    if (!code) return { valide: false, statut: "REJETE", remise: null, message: msgLang.codeVide };
    const segments = code.split('-');
    const prefixe = segments[0];
    const now = getSimulatedDate();
    const DATE_REFERENCE = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (window.mesCodesFideles) {
        if (window.mesCodesFideles.includes(code + "-FIN") || window.mesCodesFideles.includes(code + " (FIN)")) {
            return { valide: false, statut: "REJETE", remise: null, message: msgLang.expire };
        }
        if (window.mesCodesFideles.includes(code)) {
            if (prefixe === 'PROMO' || prefixe === 'PROMO-EXCEPT') {
                const montantRemise = parseInt(segments[segments.length - 1], 10);
                const dateSegment = segments[segments.length - 2];
                const dateValidation = parserEtValiderDate(dateSegment, 'X', 'Z');
                if (!dateValidation) {
                    return { valide: false, statut: "REJETE", remise: null, message: msgLang.securiteDate };
                }
                return { valide: true, statut: "VALIDE", remise: montantRemise, message: msgLang.valideExcept(montantRemise) };
            }
            let remise = code.endsWith("-5") ? 5 : 10;
            return { valide: true, statut: "VALIDE", remise: remise, message: msgLang.valideBase(remise) };
        }
    }

    if (prefixe === 'OSP') {
        if (code.length !== 14 && code.length !== 15) return { valide: false, statut: "REJETE", remise: null, message: msgLang.formatOsp };
        if (segments.length !== 3) return { valide: false, statut: "REJETE", remise: null, message: msgLang.structOsp };
        const dateCode = parserEtValiderDate(segments[1], 'X', 'Z');
        if (!dateCode) return { valide: false, statut: "REJETE", remise: null, message: msgLang.lettresOsp };
        const montantRemise = parseInt(segments[2], 10);
        if (montantRemise !== 5 && montantRemise !== 10) return { valide: false, statut: "REJETE", remise: null, message: msgLang.montantInvalide };
        if (dateCode > DATE_REFERENCE) return { valide: false, statut: "EN_ATTENTE", remise: null, message: msgLang.ospFutur };
        return { valide: true, statut: "VALIDE", remise: montantRemise, message: msgLang.ospOk(montantRemise) };
    }
    else if (prefixe === 'VIP' && segments.length === 5) {
        const dateDebut = parserEtValiderDate(segments[1], 'X', 'Z');
        const dateFin = parserEtValiderDate(segments[2], 'W', 'Q');
        if (!dateDebut || !dateFin) return { valide: false, statut: "REJETE", remise: null, message: msgLang.vipInvalide };
        const codeClient = segments[3];
        if (!idClientActuel || codeClient !== idClientActuel) return { valide: false, statut: "REJETE", remise: null, message: msgLang.vipClient };
        const montantRemise = parseInt(segments[4], 10);
        if (montantRemise !== 5 && montantRemise !== 10) return { valide: false, statut: "REJETE", remise: null, message: msgLang.montantInvalide };
        if (DATE_REFERENCE < dateDebut) return { valide: false, statut: "EN_ATTENTE", remise: null, message: msgLang.vipFutur };
        else if (DATE_REFERENCE > dateFin) return { valide: false, statut: "REJETE", remise: null, message: msgLang.vipExpire };
        else return { valide: true, statut: "VALIDE", remise: montantRemise, message: msgLang.vipOk(montantRemise) };
    }
    return { valide: false, statut: "REJETE", remise: null, message: msgLang.inconnu };
}

// ==========================================
// VARIABLES GLOBALES
// ==========================================
let planData = {}; 
let vitrerieVisibleCount = {}; 
let vitrerieIndexCount = {};   
let customVisibleCount = 0;    
let customIndexCount = 0;      
let currentPlanId = null;
let roomCounter = 0;
let activeServices = [];

let defaultFloors = { global: {}, levels: {} };

window.clientDiscount = 0; 
window.activeClientCode = "";
window.promoDiscountDevis = 0;
window.activePromoCodeDevis = "";
window.currentTotalValue = 0;
window.originalTotalValue = 0; 

// Stockage des frais kilométriques de déplacement
window.fraisDeplacementKilometrique = 0;
window.fraisDeplacementBase = 0; // Ajout pour le calcul intelligent

// Stockage de la décomposition des heures "Pendant l'événement"
window.evtPendantData = { totalCost: 0, totalHours: 0, dayHours: 0, nightHours: 0, dayCost: 0, nightCost: 0 };

function openClientModal() { document.getElementById('clientModal').style.display = 'flex'; }
function closeClientModal() { document.getElementById('clientModal').style.display = 'none'; }

// ==========================================
// 🚗 TESTEUR D'ÉLIGIBILITÉ (BOUTON RAPIDE)
// ==========================================
async function testerEligibiliteRapide() {
    const ville = prompt("📍 Entrez votre ville ou code postal (ex: Balma, 31200...) :");
    if (!ville) return;

    const latOsp = 43.60446;
    const lonOsp = 1.44594;

    try {
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(ville + ', France')}`;
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            alert("❌ Ville introuvable. Essayez avec un code postal complet.");
            return;
        }

        const latClient = parseFloat(data[0].lat);
        const lonClient = parseFloat(data[0].lon);

        const R = 6371; 
        const dLat = (latClient - latOsp) * Math.PI / 180;
        const dLon = (lonClient - lonOsp) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(latOsp * Math.PI / 180) * Math.cos(latClient * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        const distanceAllerSimple = Math.round((R * c * 1.3) * 10) / 10;
        const distanceAllerRetour = Math.round((distanceAllerSimple * 2) * 10) / 10;

        if (distanceAllerRetour <= 30) {
            alert(`✅ BONNE NOUVELLE !\n\nVotre ville (${ville}) est dans notre zone (Dist A/R: ${distanceAllerRetour} km).\nLe déplacement sera 100% OFFERT !`);
        } else {
            const kmSupplementaires = Math.round((distanceAllerRetour - 30) * 10) / 10;
            const surcout = Math.round((kmSupplementaires * 0.50) * 100) / 100;
            alert(`📍 HORS AGGLOMÉRATION\n\nDistance A/R estimée : ${distanceAllerRetour} km.\nFrais de route prévus : +${surcout.toFixed(2)} €.\n\n🎁 ASTUCE : Ces frais seront TOTALEMENT OFFERTS si votre devis de nettoyage dépasse 150 € !`);
        }
    } catch (err) {
        alert("⚠️ Erreur réseau, veuillez réessayer plus tard.");
    }
}

// ==========================================
// 🚗 SIMULATEUR D'ÉLIGIBILITÉ (DANS LE DEVIS)
// ==========================================
function resetDistanceCalc() {
    const msgBox = document.getElementById('distanceResultMsg');
    if (msgBox) {
        msgBox.style.display = 'none';
        msgBox.className = 'distance-result-msg';
        msgBox.innerHTML = '';
    }
    window.fraisDeplacementKilometrique = 0;
    window.fraisDeplacementBase = 0;
    if (typeof calculatePrice === "function") calculatePrice();
}

async function calculerEligibilite() {
    const rue = document.getElementById('inputAdresseRue')?.value.trim();
    const ville = document.getElementById('inputAdresseVille')?.value.trim();
    const msgBox = document.getElementById('distanceResultMsg');

    if (!rue || !ville) {
        msgBox.className = 'distance-result-msg error';
        msgBox.innerHTML = '⚠️ Veuillez renseigner votre rue et votre ville/code postal.';
        msgBox.style.display = 'block';
        return;
    }

    msgBox.className = 'distance-result-msg';
    msgBox.style.display = 'block';
    msgBox.style.color = 'var(--bleu)';
    msgBox.innerHTML = '⏳ Calcul du trajet en cours...';

    // Coordonnées de départ : Place Wilson, 31000 Toulouse (Siège O.S.P+)
    const latOsp = 43.60446;
    const lonOsp = 1.44594;

    try {
        const adresseComplete = `${rue}, ${ville}`;
        const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(adresseComplete)}`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            msgBox.className = 'distance-result-msg error';
            msgBox.innerHTML = '❌ Adresse introuvable. Vérifiez la saisie.';
            return;
        }

        const latClient = parseFloat(data[0].lat);
        const lonClient = parseFloat(data[0].lon);

        const R = 6371; 
        const dLat = (latClient - latOsp) * Math.PI / 180;
        const dLon = (lonClient - lonOsp) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(latOsp * Math.PI / 180) * Math.cos(latClient * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        const distanceAllerSimple = Math.round((R * c * 1.3) * 10) / 10;
        const distanceAllerRetour = Math.round((distanceAllerSimple * 2) * 10) / 10;

        if (distanceAllerRetour <= 30) {
            msgBox.className = 'distance-result-msg success';
            msgBox.innerHTML = `✅ <strong>Agglomération Toulousaine !</strong> (Dist. A/R : <strong>${distanceAllerRetour} km</strong>).<br>🎉 Déplacement 100 % GRATUIT.`;
            window.fraisDeplacementBase = 0;
        } else {
            const kmSupplementaires = Math.round((distanceAllerRetour - 30) * 10) / 10;
            const surcout = Math.round((kmSupplementaires * 0.50) * 100) / 100;
            window.fraisDeplacementBase = surcout;

            msgBox.className = 'distance-result-msg warning';
            msgBox.innerHTML = `📍 Hors Agglomération (Dist. A/R : <strong>${distanceAllerRetour} km</strong>).<br>Frais de route : +${surcout.toFixed(2)} € (<em>Sauf si devis > 150 €</em>).`;
        }

        if (typeof calculatePrice === "function") calculatePrice();

    } catch (err) {
        msgBox.className = 'distance-result-msg error';
        msgBox.innerHTML = '⚠️ Service de calcul temporairement indisponible.';
    }
}

// ==========================================
// 📢 BANNER PUBLICITAIRE ROTATIF DYNAMIQUE
// ==========================================

// Liste des messages 100% en une seule ligne avec actions au clic intégrées
const MES_PUBLICITES = [
    { text: '<span class="badge-promo-top">VENTE FLASH</span> <strong>-10% SUR VOTRE FACTURE !</strong> <em>(Cliquez ici)</em>', action: "document.getElementById('section-promo').scrollIntoView({behavior: 'smooth'});" },
    { text: '🛋️ <strong>NETTOYAGE CANAPÉS & TEXTILES</strong> : ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('shampouinage')" },
    { text: '🏢 <strong>LOCAUX & BUREAUX</strong> : Dès 5h du matin ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('bureaux')" },
    { text: '🪟 <strong>VITRERIE PRO</strong> : Fenêtres, baies, vérandas ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('vitrerie')" },
    { text: '🚗 <strong>PACK VÉHICULES</strong> : Intérieur complet ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('vehicule')" },
    { text: '🪦 <strong>SÉPULTURES</strong> : Nettoyage et fleurissement ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('sepulture')" },
    { text: '🎉 <strong>REMISE EN ÉTAT SALLE</strong> : Événements ➡️ <em>Cliquez pour faire votre devis</em>', action: "openQuote('evenements')" },
    { text: '✅ <strong>ASSURANCE RC PRO</strong> & <strong>20 ANS D\'EXPERTISE</strong> ➡️ <em>Découvrir OSP+</em>', action: "document.getElementById('qui-suis-je').scrollIntoView({behavior: 'smooth'});" },
    { text: '📞 <strong>CONTACT : 07 45 02 76 24</strong> | 🕒 Lun-Sam 5h-22h ➡️ <em>Être rappelé</em>', action: "openCallbackModal()" },
    { text: '🚗 <strong>DÉPLACEMENT OFFERT</strong> : Toulouse et son agglomération !', action: "document.getElementById('services').scrollIntoView({behavior: 'smooth'});" }
];

const DELAI_ROTATION = 15000; // 15 secondes
let indexPubActuelle = 0;

function lancerPanneauPub() {
    const promoBanner = document.getElementById('promo-banner');
    if (!promoBanner || MES_PUBLICITES.length === 0) return;

    // Fonction pour appliquer le texte ET l'action de clic dynamiquement
    function setPub(index) {
        promoBanner.innerHTML = MES_PUBLICITES[index].text;
        promoBanner.setAttribute('onclick', MES_PUBLICITES[index].action);
    }

    setPub(0);

    if (MES_PUBLICITES.length === 1) return;

    setInterval(() => {
        indexPubActuelle = (indexPubActuelle + 1) % MES_PUBLICITES.length;
        promoBanner.style.opacity = 0;
        
        setTimeout(() => {
            setPub(indexPubActuelle);
            promoBanner.style.opacity = 1;
        }, 300);

    }, DELAI_ROTATION);
}

window.addEventListener('DOMContentLoaded', lancerPanneauPub);
// ==========================================
// 🛠️ MOTEUR DE FENÊTRES SUR-MESURE OSP+
// ==========================================
function askCustomQuestion(title, message, buttons, showInput = false) {
    return new Promise((resolve) => {
        document.getElementById('customConfirmTitle').innerText = title;
        document.getElementById('customConfirmMessage').innerHTML = message;
        
        let existingInput = document.getElementById('customConfirmInput');
        if(!existingInput) {
            existingInput = document.createElement('input');
            existingInput.id = 'customConfirmInput';
            existingInput.type = 'text';
            existingInput.style.cssText = "display:none; padding: 12px; width: 80%; margin: 0 auto 20px auto; border-radius: 8px; border: 2px solid #e1e8ef; font-size:1rem; text-align:center; font-weight:bold;";
            document.getElementById('customConfirmMessage').after(existingInput);
        }
        
        if (showInput) {
            existingInput.style.display = 'block';
            existingInput.value = '';
            setTimeout(() => existingInput.focus(), 100);
        } else {
            existingInput.style.display = 'none';
        }

        const btnContainer = document.getElementById('customConfirmButtons');
        btnContainer.innerHTML = ''; 

        buttons.forEach(btn => {
            let buttonEl = document.createElement('button');
            buttonEl.style.cssText = `padding: 10px 15px; border-radius: 5px; border: none; font-weight: bold; cursor: pointer; transition: 0.3s; font-size: 0.85rem; flex: 1; min-width: 120px; max-width: 250px; ${btn.style}`;
            buttonEl.innerText = btn.text;
            
            buttonEl.onmouseenter = () => buttonEl.style.opacity = "0.8";
            buttonEl.onmouseleave = () => buttonEl.style.opacity = "1";

            buttonEl.onclick = () => {
                document.getElementById('customConfirmModal').style.display = 'none';
                if (showInput && btn.value === true) {
                    resolve(existingInput.value);
                } else {
                    resolve(btn.value); 
                }
            };
            btnContainer.appendChild(buttonEl);
        });

        document.getElementById('customConfirmModal').style.display = 'flex';
    });
}

async function applyClientCode() {
    const input = document.getElementById('clientCodeInput');
    const code = input ? input.value.trim() : '';
    const msg = document.getElementById('clientCodeMsg');
    
    if (code.toLowerCase() === 'feriedate@administrateur') {
        closeClientModal();
        if (input) input.value = '';
        if (msg) msg.innerText = '';
        openAdminModal();
        return;
    }

    if (!code) { msg.style.color = 'red'; msg.innerText = msgLang.saisirCode; return; }

    let idClientActuel = null;
    if (code.startsWith('VIP') && code.split('-').length === 5) {
        document.getElementById('clientModal').style.display = 'none'; 

        let vipId = await askCustomQuestion("🔒 SÉCURITÉ VIP", msgLang.securitePrompt, [
            { text: langKey==='en'?"Unlock":"Déverrouiller", value: true, style: "background: var(--vert); color: white;" },
            { text: langKey==='en'?"Cancel":"Annuler", value: false, style: "background: #e1e8ef; color: #555;" }
        ], true);

        document.getElementById('clientModal').style.display = 'flex'; 

        if (!vipId) { msg.style.color = 'red'; msg.innerText = msgLang.annulePrompt; return; }
        idClientActuel = vipId.trim();
    }

    const resultat = validerCodeRemise(code, idClientActuel);

    if (resultat.valide && resultat.statut === "VALIDE") {
        window.clientDiscount = resultat.remise / 100;
        window.activeClientCode = code;
        msg.style.color = 'var(--vert)';
        msg.innerText = "✓ " + resultat.message;
        calculatePrice(); 
        setTimeout(closeClientModal, 3000);
    } else {
        window.clientDiscount = 0;
        window.activeClientCode = "";
        msg.style.color = 'red';
        msg.innerText = (resultat.statut === "EN_ATTENTE" ? "⏳ " : "🛑 ") + resultat.message;
        calculatePrice();
    }
}

function applyPromoCodeDevis() {
    const code = document.getElementById('promoCodeInputDevis').value.trim().toUpperCase();
    const msg = document.getElementById('promoCodeMsgDevis');
    
    if (code === "") {
        window.promoDiscountDevis = 0; window.activePromoCodeDevis = ""; msg.innerText = ""; calculatePrice(); return;
    }

    const resultat = validerCodeRemise(code);

    if (resultat.valide && resultat.statut === "VALIDE") {
        window.promoDiscountDevis = resultat.remise / 100;
        window.activePromoCodeDevis = code;
        msg.style.color = 'var(--vert)';
        msg.innerText = "✓ " + resultat.message;
    } else {
        window.promoDiscountDevis = 0;
        window.activePromoCodeDevis = "";
        msg.style.color = 'red';
        msg.innerText = (resultat.statut === "EN_ATTENTE" ? "⏳ " : "🛑 ") + resultat.message;
    }
    calculatePrice();
}

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
        let d = new Date(date); d.setDate(d.getDate() + days);
        return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    return [ addDays(easter, 1), addDays(easter, 39), addDays(easter, 50) ];
}

function checkHolidays() {
    const today = getSimulatedDate();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const currentYear = today.getFullYear();

    const fixedHolidays = ['01-01', '05-01', '05-08', '07-14', '08-15', '11-01', '11-11', '12-25'];
    const mobileHolidays = getMobileHolidays(currentYear);
    const testDates = ['06-01', '06-02', '06-03'];
    const allHolidaysStr = fixedHolidays.concat(mobileHolidays).concat(testDates);

    let isPromoActive = false;

    for (let dateStr of allHolidaysStr) {
        const parts = dateStr.split('-');
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        
        const holidayDate = new Date(currentYear, month, day);
        const endDate = new Date(holidayDate);
        endDate.setDate(endDate.getDate() + 15);

        if (todayDate >= holidayDate && todayDate <= endDate) {
            isPromoActive = true;
            break; 
        }
    }

    const banner = document.getElementById('promo-banner');
    if (isPromoActive) {
        if (banner) banner.style.display = 'block';
        window.holidayPromoActive = true;
    } else { 
        if (banner) banner.style.display = 'none';
        window.holidayPromoActive = false; 
    }
}
window.addEventListener('DOMContentLoaded', checkHolidays);

function toggleCompanyField() {
    const isEntreprise = document.querySelector('input[name="statut"][value="Entreprise"]')?.checked;
    const companyGroup = document.getElementById('companyNameGroup');
    const companyInput = document.getElementById('nomEntreprise');
    const employeeGroup = document.getElementById('employeeCountGroup');
    const employeeInput = document.getElementById('nbEmployes');

    const hasBureaux = activeServices.includes('bureaux');

    if (isEntreprise) {
        if (companyGroup) companyGroup.style.display = 'flex';
        if (companyInput) companyInput.required = true;

        if (hasBureaux) {
            if (employeeGroup) employeeGroup.style.display = 'flex';
            if (employeeInput) employeeInput.required = true;
        } else {
            if (employeeGroup) employeeGroup.style.display = 'none';
            if (employeeInput) { employeeInput.required = false; employeeInput.value = '1'; }
        }
    } else {
        if (companyGroup) companyGroup.style.display = 'none';
        if (companyInput) { companyInput.required = false; companyInput.value = ''; }
        if (employeeGroup) { employeeGroup.style.display = 'none'; }
        if (employeeInput) { employeeInput.required = false; employeeInput.value = '1'; }
    }
    calculatePrice();
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
    let textPlan = langKey === 'vi' ? '+ Lập kế hoạch' : (langKey === 'en' ? '+ Schedule' : '+ Planifier');
    return `
    <div class="quote-row-item" id="row_${id}">
        <label>${name}</label>
        <input type="number" id="qty_${id}" min="0" value="0" oninput="calculatePrice()">
        <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${name.replace(/'/g, "\\'")}')">${textPlan}</button>
    </div>`;
}

function generateSepultureFlowerRowHtml(id, name, typeFleurs) {
    let textPlan = langKey === 'vi' ? '+ Lập kế hoạch' : (langKey === 'en' ? '+ Schedule' : '+ Planifier');
    const simDate = getSimulatedDate();
    const currentMonth = simDate.getMonth() + 1; 

    let optionsFleurs = '';
    
    if (typeFleurs === 'artificielles') {
        optionsFleurs = `
            <option value="rose_art">Roses synthétiques (Toutes saisons)</option>
            <option value="lys_art">Lys artificiels (Toutes saisons)</option>
            <option value="compo_art">Composition intemporelle</option>
        `;
    } else {
        const fleursSaisons = [
            { id: 'pensees', name: 'Pensées', mois: [1, 2, 3, 10, 11, 12] },
            { id: 'chrysanthemes', name: 'Chrysanthèmes', mois: [10, 11] },
            { id: 'tulipes', name: 'Tulipes', mois: [3, 4, 5] },
            { id: 'geraniums', name: 'Géraniums', mois: [5, 6, 7, 8, 9] },
            { id: 'cyclamens', name: 'Cyclamens', mois: [9, 10, 11, 12] },
            { id: 'roses_nat', name: 'Roses naturelles', mois: [5, 6, 7, 8, 9, 10] }
        ];

        fleursSaisons.forEach(fleur => {
            const estEnSaison = fleur.mois.includes(currentMonth);
            if (estEnSaison) {
                optionsFleurs += `<option value="${fleur.id}">${fleur.name}</option>`;
            } else {
                optionsFleurs += `<option value="${fleur.id}" disabled style="color: #aaa; background-color: #f0f0f0;">${fleur.name} (pas de saison)</option>`;
            }
        });
    }

    return `
    <div class="quote-row-item" id="row_${id}" style="display: grid; grid-template-columns: 1fr 140px 50px 80px; gap: 5px; align-items: center; margin-bottom: 6px;">
        <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu);">${name}</label>
        <select id="flower_choice_${id}" onchange="calculatePrice()" style="font-size: 0.75rem; padding: 4px; border-radius: 4px; border: 1px solid #ccc;">
            ${optionsFleurs}
        </select>
        <input type="number" id="qty_${id}" min="0" value="0" oninput="calculatePrice()" style="padding: 4px; text-align: center;">
        <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${name.replace(/'/g, "\\'")}')" style="font-size: 0.65rem; padding: 4px;">${textPlan}</button>
    </div>`;
}

function generateVehiculeRowHtml(id, name, hasTapisOption, tooltip) {
    let textPlan = langKey === 'vi' ? '+ Lập KH' : (langKey === 'en' ? '+ Plan' : '+ Planifier');
    let cbHtml = '';
    let gridLayout = '1fr 45px 80px'; 
    
    if (hasTapisOption) {
        let lblTapis = langKey === 'vi' ? '+ Thảm' : (langKey === 'en' ? '+ Mat' : '+ Tapis');
        cbHtml = `
        <label style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center; justify-content:center; gap:3px; background:white; padding:4px; border-radius:4px; border:1px solid #ccc; cursor:pointer;" title="Ajouter le nettoyage du tapis associé">
            <input type="checkbox" id="cb_tapis_${id}" onchange="handleVehiculeChange('detail')" style="width:14px; height:14px; margin:0; cursor:pointer;">
            ${lblTapis}
        </label>`;
        gridLayout = '1fr 45px 65px 75px';
    }

    return `
    <div class="quote-row-item" id="row_${id}" style="grid-template-columns: ${gridLayout}; padding: 6px; gap: 5px; align-items: center; margin-bottom: 4px;">
        <label style="font-size: 0.65rem; line-height: 1.1; display:flex; align-items:center; word-wrap: break-word;">${name}${tooltip}</label>
        <input type="number" id="qty_${id}" min="0" value="0" oninput="handleVehiculeChange('detail')" style="padding: 4px; width: 100%; box-sizing: border-box; text-align:center;">
        ${cbHtml}
        <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${name.replace(/'/g, "\\'")}')" style="padding: 4px; font-size: 0.6rem; width: 100\%; box-sizing: border-box;">${textPlan}</button>
    </div>`;
}

function generateVitrerieRowHtml(id, name, dupIndex) {
    let actualId = dupIndex === 0 ? id : id + '_dup_' + dupIndex;
    let btnPlus = dupIndex === 0 
        ? `<button type="button" onclick="addVitrerieRow('${id}', '${name.replace(/'/g, "\\'")}')" style="background:var(--vert); color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer; height:100%; width:100%; padding:0; font-size:1.1rem; line-height:1;">+</button>` 
        : `<button type="button" class="btn-delete-row" onclick="removeVitrerieRow('${actualId}')" style="margin:0; width:100%; height:100%; border-radius:4px;">×</button>`;

    let optComplet = langKey === 'vi' ? 'Toàn bộ' : (langKey === 'en' ? 'Complete' : 'Complet');
    let optInterieur = langKey === 'vi' ? 'Trong nhà' : (langKey === 'en' ? 'Interior' : 'Intérieur');
    let optExterieur = langKey === 'vi' ? 'Ngoài trời' : (langKey === 'en' ? 'Exterior' : 'Extérieur');
    let btnPlanText = langKey === 'vi' ? '+ Lịch' : (langKey === 'en' ? '+ Plan' : '+ Plan');

    return `
    <div class="quote-row-item" id="row_${actualId}" style="grid-template-columns: 1fr 45px 75px 75px 25px; padding: 6px; gap: 5px; align-items: center; margin-bottom: 4px;">
        <label style="font-size: 0.65rem; line-height: 1.1; word-wrap: break-word;">${name}</label>
        <input type="number" id="qty_${actualId}" min="0" value="0" oninput="calculatePrice()" style="padding: 4px; width: 100%; box-sizing: border-box; text-align:center;">
        <select id="type_${actualId}" onchange="calculatePrice()" style="padding: 4px 0px; font-size: 0.65rem; width: 100%; box-sizing: border-box;">
            <option value="complet">${optComplet}</option>
            <option value="interieur">${optInterieur}</option>
            <option value="exterieur">${optExterieur}</option>
        </select>
        <button type="button" id="btn_plan_${actualId}" class="btn-planifier" onclick="openPlanningModal('${actualId}', '${name.replace(/'/g, "\\'")}')" style="padding: 4px; font-size: 0.6rem; width: 100%; box-sizing: border-box;">${btnPlanText}</button>${btnPlus}
    </div>`;
}

function addVitrerieRow(baseId, name) {
    if (!vitrerieVisibleCount[baseId]) vitrerieVisibleCount[baseId] = 0;
    if (!vitrerieIndexCount[baseId]) vitrerieIndexCount[baseId] = 0;
    if (vitrerieVisibleCount[baseId] >= 2) return; 
    
    vitrerieVisibleCount[baseId]++;
    vitrerieIndexCount[baseId]++;
    
    let autreSuffix = langKey === 'vi' ? ' (Khác)' : (langKey === 'en' ? ' (Other)' : ' (Autre)');
    const newHtml = generateVitrerieRowHtml(baseId, name + autreSuffix, vitrerieIndexCount[baseId]);
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
    
    document.querySelectorAll('.accordion-header').forEach(el => { 
        el.classList.remove('active'); 
        let icon = el.querySelector('.accordion-icon');
        if(icon) icon.innerText = '▼';
    });
    document.querySelectorAll('.accordion-body').forEach(el => { 
        el.classList.remove('active'); 
    });

    if (!isActive) { 
        headerElement.classList.add('active'); 
        body.classList.add('active'); 
        let icon = headerElement.querySelector('.accordion-icon');
        if(icon) icon.innerText = '▲';
    }
}

function updateLevelSummaries() {
    let roomsWord = langKey === 'vi' ? 'không gian' : (langKey === 'en' ? 'space(s)' : 'espace(s)');
    document.querySelectorAll('.level-accordion').forEach(accordion => {
        let levelName = accordion.getAttribute('data-levelname');
        let roomsContainer = accordion.querySelector('[id^="rooms_container_"]');
        let titleSpan = accordion.querySelector('.level-title-display');
        
        let roomTypesPresent = new Set(); 

        if (roomsContainer && titleSpan) {
            let roomCards = roomsContainer.querySelectorAll('.structured-room-card');
            if (roomCards.length > 0) {
                let roomNames = [];
                roomCards.forEach(card => {
                    let typeAttr = card.getAttribute('data-roomtype');
                    if (typeAttr) roomTypesPresent.add(typeAttr);

                    let nameSpan = card.querySelector('h5 span');
                    if (nameSpan) {
                        let typeText = nameSpan.innerText.split('(')[0].trim();
                        let customInput = card.querySelector('input[type="text"]');
                        if (customInput && customInput.value.trim() !== '') { typeText = customInput.value.trim(); }
                        roomNames.push(typeText);
                    }
                });
                let summaryText = roomNames.join(', ');
                if (summaryText.length > 40) summaryText = summaryText.substring(0, 37) + '...';
                titleSpan.innerHTML = `📍 ${levelName} <span style="font-size:0.75rem; color:#888; margin-left:8px; font-weight:normal; font-style:italic;">(${roomCards.length} ${roomsWord} :${summaryText})</span>`;
            } else { titleSpan.innerHTML = `📍 ${levelName}`; }
        }

        let quickAddBtns = accordion.querySelectorAll('.btn-quick-add');
        quickAddBtns.forEach(btn => {
            let onclickStr = btn.getAttribute('onclick');
            if (onclickStr) {
                let match = onclickStr.match(/'([^']+)'\)$/);
                if (match && match[1]) {
                    let typeT = match[1];
                    if (roomTypesPresent.has(typeT)) {
                        btn.style.backgroundColor = 'var(--bleu)';
                        btn.style.color = 'white';
                        btn.style.borderColor = 'var(--bleu)';
                    } else {
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                        btn.style.borderColor = '';
                    }
                }
            }
        });
    });
}

function createLevelAccordion(levelName) {
    const levelId = 'level_' + Date.now() + Math.floor(Math.random() * 1000);
    
    let subtitleText = langKey === 'vi' ? 'Thêm các không gian cho tầng này :' : (langKey === 'en' ? 'Add your spaces for this level:' : 'Ajoutez vos espaces pour ce niveau :');
    subtitleText = `<span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">2</span>` + subtitleText;

    let btnBureau = langKey === 'vi' ? '💼 Văn phòng' : (langKey === 'en' ? '💼 Office' : '💼 Bureau');
    let btnReunion = langKey === 'vi' ? '🗣️ Phòng họp' : (langKey === 'en' ? '🗣️ Meeting' : '🗣️ Réunion');
    let btnSanitaires = langKey === 'vi' ? '🚻 Vệ sinh' : (langKey === 'en' ? '🚻 Restrooms' : '🚻 Sanitaires');
    let btnDouche = langKey === 'vi' ? '🚿 Phòng tắm' : (langKey === 'en' ? '🚿 Showers' : '🚿 Douches');
    let btnVestiaire = langKey === 'vi' ? '🧳 Phòng thay đồ' : (langKey === 'en' ? '🧳 Locker R.' : '🧳 Vestiaires');
    let btnAccueil = langKey === 'vi' ? '🛎️ Tiếp tân' : (langKey === 'en' ? '🛎️ Reception' : '🛎️ Accueil');
    let btnCuisine = langKey === 'vi' ? '🍳 Nhà bếp' : (langKey === 'en' ? '🍳 Kitchen' : '🍳 Cuisine');
    let btnRestau = langKey === 'vi' ? '🍽️ Ăn uống' : (langKey === 'en' ? '🍽️ Dining' : '🍽️ Restauration');
    let btnRepos = langKey === 'vi' ? '☕ Nghỉ ngơi' : (langKey === 'en' ? '☕ Breakroom' : '☕ Repos');
    let btnCouloir = langKey === 'vi' ? '🚶 Hành lang' : (langKey === 'en' ? '🚶 Hallway' : '🚶 Couloir');
    let btnAscP = langKey === 'vi' ? '🛗 Thang máy C.' : (langKey === 'en' ? '🛗 Main Elev.' : '🛗 Asc. Princ.');
    let btnAscS = langKey === 'vi' ? '🛗 Thang máy P.' : (langKey === 'en' ? '🛗 Serv. Elev.' : '🛗 Asc. Sec.');
    let btnEscP = langKey === 'vi' ? '📶 Thang bộ C.' : (langKey === 'en' ? '📶 Main Stairs' : '📶 Esc. Princ.');
    let btnEscS = langKey === 'vi' ? '📶 Thang bộ P.' : (langKey === 'en' ? '📶 Serv. Stairs' : '📶 Esc. Sec.');
    let btnPalier = langKey === 'vi' ? '🚪 Chiếu nghỉ' : (langKey === 'en' ? '🚪 Landing' : '🚪 Palier');
    let btnTerrasse = langKey === 'vi' ? '☀️ Sân thượng' : (langKey === 'en' ? '☀️ Terrace' : '☀️ Terrasse');
    let btnTech = langKey === 'vi' ? '🔧 Phòng KT' : (langKey === 'en' ? '🔧 Tech Room' : '🔧 Local tech.');
    let btnAutre = langKey === 'vi' ? '➕ Khác' : (langKey === 'en' ? '➕ Other' : '➕ Autre');
    
    let btnClone = langKey === 'vi' ? '📄 Nhân bản' : (langKey === 'en' ? '📄 Clone floor' : '📄 Dupliquer cet étage');
    let btnDeleteLevel = langKey === 'vi' ? '🗑️ Xóa' : (langKey === 'en' ? '🗑️ Delete' : '🗑️ Supprimer');

    let html = `
    <div class="level-accordion" id="block_${levelId}" data-levelname="${levelName}">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span class="level-title-display">📍 ${levelName}</span>
            <span class="accordion-icon" style="transition: none; transform: none; font-size: 0.9rem;">▼</span>
        </div>
        <div class="accordion-body">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; flex-wrap:wrap; gap:10px;">
                <p style="font-size:0.75rem; color:#666; margin:0; display:flex; align-items:center;">${subtitleText}</p>
                <div style="display:flex; gap:10px;">
                    <button type="button" onclick="openCloneModal('${levelId}', '${levelName.replace(/'/g, "\\'")}')" style="background:#eef3f8; color:var(--bleu); border:1px solid var(--bleu); padding:4px 10px; border-radius:4px; font-size:0.7rem; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='var(--bleu)'; this.style.color='white';" onmouseout="this.style.background='#eef3f8'; this.style.color='var(--bleu)';">${btnClone}</button>
                    <button type="button" onclick="confirmDeleteLevel('${levelId}', '${levelName.replace(/'/g, "\\'")}')" style="background:#fadbd8; color:#c0392b; border:1px solid #c0392b; padding:4px 10px; border-radius:4px; font-size:0.7rem; font-weight:bold; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='#c0392b'; this.style.color='white';" onmouseout="this.style.background='#fadbd8'; this.style.color='#c0392b';">${btnDeleteLevel}</button>
                </div>
            </div>
            <div class="room-quick-adds">
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Bureau')">${btnBureau}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Salle de réunion')">${btnReunion}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Sanitaires')">${btnSanitaires}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Douche')">${btnDouche}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Vestiaire')">${btnVestiaire}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Accueil')">${btnAccueil}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Cuisine')">${btnCuisine}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Restauration')">${btnRestau}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Salle de repos')">${btnRepos}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Couloir')">${btnCouloir}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Ascenseur principal')">${btnAscP}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Ascenseur secondaire')">${btnAscS}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Escalier principal')">${btnEscP}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Escalier secondaire')">${btnEscS}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Palier')">${btnPalier}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Terrasse')">${btnTerrasse}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Local technique')">${btnTech}</button>
                <button type="button" class="btn-quick-add" onclick="addStructuredRoom('${levelId}', 'Autre')">${btnAutre}</button>
            </div>
            <div id="rooms_container_${levelId}"></div>
        </div>
    </div>`;
    document.getElementById('levelsContainer').insertAdjacentHTML('beforeend', html);
    updateLevelSummaries();
    
    return levelId;
}

function confirmDeleteLevel(levelId, levelName) {
    let txtTitle = langKey === 'vi' ? '🗑️ Xóa tầng' : (langKey === 'en' ? '🗑️ Delete floor' : '🗑️ Supprimer l\'étage');
    let txtMsg = langKey === 'vi' ? `Bạn có chắc chắn muốn xóa <strong>${levelName}</strong> và tất cả các phòng trong đó không?` : 
                 (langKey === 'en' ? `Are you sure you want to delete <strong>${levelName}</strong> and all its rooms?` : 
                 `Êtes-vous sûr de vouloir supprimer <strong>${levelName}</strong> et toutes les pièces qu'il contient ?`);
    
    let btnYes = langKey === 'vi' ? 'Có, xóa' : (langKey === 'en' ? 'Yes, delete' : 'Oui, supprimer');
    let btnNo = langKey === 'vi' ? 'Hủy' : (langKey === 'en' ? 'Cancel' : 'Annuler');

    askCustomQuestion(txtTitle, txtMsg, [
        { text: btnYes, value: true, style: "background: #e74c3c; color: white;" },
        { text: btnNo, value: false, style: "background: #e1e8ef; color: var(--bleu);" }
    ]).then(confirm => {
        if (confirm) deleteLevel(levelId);
    });
}

function deleteLevel(levelId) {
    let container = document.getElementById('rooms_container_' + levelId);
    if(container) {
        let cards = container.querySelectorAll('.structured-room-card');
        cards.forEach(card => {
            let roomId = card.id.replace('row_', '');
            if (planData[roomId]) delete planData[roomId];
        });
    }
    let accordion = document.getElementById('block_' + levelId);
    if (accordion) accordion.remove();
    
    calculatePrice();
    updateLevelSummaries();
    window.filterRooms();
}

function openLevelModal() { document.getElementById('levelModal').style.display = 'flex'; }
function closeLevelModal() { document.getElementById('levelModal').style.display = 'none'; }
function addSpecificLevel(name) { createLevelAccordion(name); closeLevelModal(); }
function addCustomLevel() {
    const val = document.getElementById('customLevelInput').value.trim();
    if(val !== '') {
        createLevelAccordion(val);
        document.getElementById('customLevelInput').value = '';
        closeLevelModal();
    }
}

window.validateBureaux = function(roomId) {
    let totInput = document.getElementById(`qty_tot_${roomId}`);
    let occInput = document.getElementById(`qty_occ_${roomId}`);
    if(totInput && occInput) {
        let tot = parseInt(totInput.value) || 0;
        let occ = parseInt(occInput.value) || 0;
        if(occ > tot) {
            occInput.value = tot;
        }
    }
};

function handleSolChange(selectElement, roomId, roomType) {
    selectElement.style.border = "1px solid #ccc";
    selectElement.style.backgroundColor = "transparent";
    let label = selectElement.parentElement.querySelector('label');
    if(label) label.style.color = "var(--bleu)";

    const selectedValue = selectElement.value;
    if (selectedValue === "non_precise") return;

    document.querySelectorAll('.popover-sol').forEach(el => el.remove());

    let solNom = selectElement.options[selectElement.selectedIndex].text;

    let msg = langKey === 'vi' ? `Áp dụng <strong>${solNom}</strong> cho tất cả <strong>${roomType}</strong>?` :
              langKey === 'en' ? `Apply <strong>${solNom}</strong> to all <strong>${roomType}</strong>?` :
              `Appliquer <strong>${solNom}</strong> pour tous vos <strong>${roomType}</strong> ?`;

    let btnTous = langKey === 'vi' ? "Tầng này và các tầng khác" : (langKey === 'en' ? "This floor and others" : "Cet étage et les autres");
    let btnNiveau = langKey === 'vi' ? "Chỉ tầng này" : (langKey === 'en' ? "This floor only" : "Cet étage uniquement");
    let btnNon = langKey === 'vi' ? "Chỉ phòng này" : (langKey === 'en' ? "Just this room" : "Juste cette pièce");

    let popover = document.createElement('div');
    popover.className = 'popover-sol';
    popover.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 5px;
        background: white;
        border: 2px solid var(--vert);
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        padding: 12px;
        z-index: 1000;
        width: 250px;
        font-size: 0.8rem;
        animation: fadeInDown 0.2s ease;
    `;

    popover.innerHTML = `
        <p style="margin-top: 0; margin-bottom: 10px; color: var(--bleu); font-weight: bold; line-height: 1.3;">${msg}</p>
        <div style="display: flex; flex-direction: column; gap: 6px;">
            <button type="button" id="pop-tous" style="background: var(--vert); color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">${btnTous}</button>
            <button type="button" id="pop-niveau" style="background: var(--bleu); color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">${btnNiveau}</button>
            <button type="button" id="pop-non" style="background: #e1e8ef; color: var(--bleu); border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold;">${btnNon}</button>
        </div>
    `;

    let boxContainer = selectElement.closest('.sol-box') || selectElement.parentElement;
    boxContainer.style.position = 'relative'; 
    boxContainer.appendChild(popover);

    let currentAccordion = selectElement.closest('.level-accordion');
    let currentLevelId = currentAccordion ? currentAccordion.id : null;

    popover.querySelector('#pop-tous').onclick = () => appliquerSol(selectedValue, roomType, "tous", currentLevelId, selectElement, popover);
    popover.querySelector('#pop-niveau').onclick = () => appliquerSol(selectedValue, roomType, "niveau", currentLevelId, selectElement, popover);
    popover.querySelector('#pop-non').onclick = () => popover.remove();

    setTimeout(() => {
        document.addEventListener('click', function closePop(e) {
            if (!popover.contains(e.target) && e.target !== selectElement) {
                popover.remove();
                document.removeEventListener('click', closePop);
            }
        });
    }, 10);
}

function appliquerSol(selectedValue, roomType, scope, currentLevelId, triggerSelect, popover) {
    if (scope === "tous") {
        defaultFloors.global[roomType] = selectedValue;
    } else if (scope === "niveau" && currentLevelId) {
        defaultFloors.levels[`${currentLevelId}_${roomType}`] = selectedValue;
    }

    let otherSimilarRooms = Array.from(document.querySelectorAll(`select[id^="sol_"][data-type="${roomType.replace(/'/g, "\\'")}"]`))
        .filter(sel => sel.id !== triggerSelect.id && sel.value !== selectedValue);

    otherSimilarRooms.forEach(otherSelect => {
        let otherAccordion = otherSelect.closest('.level-accordion');
        
        if (scope === "niveau" && currentLevelId && otherAccordion && otherAccordion.id !== currentLevelId) {
            return; 
        }

        otherSelect.value = selectedValue;
        otherSelect.style.border = "1px solid #ccc";
        otherSelect.style.backgroundColor = "transparent";
        let otherLabel = otherSelect.parentElement.querySelector('label');
        if(otherLabel) otherLabel.style.color = "var(--bleu)";
    });

    popover.remove();
}

window.filterRooms = function() {
    let input = document.getElementById('roomSearchInput');
    let filter = input ? input.value.toLowerCase().trim() : "";
    let accordions = document.querySelectorAll('.level-accordion');
    let createContainer = document.getElementById('searchCreateBtnContainer');
    let totalVisibleRooms = 0;

    if (filter.length < 3) {
        accordions.forEach(acc => {
            acc.style.display = "block";
            let roomCards = acc.querySelectorAll('.structured-room-card');
            roomCards.forEach(card => card.style.display = "block");
        });
        if (createContainer) createContainer.style.display = "none";
        return;
    }

    accordions.forEach(acc => {
        let levelName = acc.getAttribute('data-levelname').toLowerCase();
        let roomCards = acc.querySelectorAll('.structured-room-card');
        let hasVisibleRoom = false;

        roomCards.forEach(card => {
            let roomTitle = card.querySelector('h5 span').innerText.toLowerCase();
            let customInput = card.querySelector('input[type="text"]');
            if (customInput && customInput.value.trim() !== '') {
                roomTitle += ' ' + customInput.value.toLowerCase();
            }

            if (roomTitle.includes(filter) || levelName.includes(filter)) {
                card.style.display = "block";
                hasVisibleRoom = true;
                totalVisibleRooms++;
            } else {
                card.style.display = "none";
            }
        });

        if (hasVisibleRoom) {
            acc.style.display = "block";
            let header = acc.querySelector('.accordion-header');
            let body = acc.querySelector('.accordion-body');
            if (!header.classList.contains('active')) {
                header.classList.add('active');
                body.classList.add('active');
                let icon = header.querySelector('.accordion-icon');
                if(icon) icon.innerText = '▲';
            }
        } else {
            acc.style.display = "none";
        }
    });

    if (createContainer && input) {
        if (totalVisibleRooms === 0) {
            let btnText = langKey === 'vi' ? `+ Tạo "${input.value}"` : (langKey === 'en' ? `+ Create "${input.value}"` : `+ Créer l'espace "${input.value}"`);
            createContainer.innerHTML = `<button type="button" class="btn-main pulse-animation" style="padding: 10px 20px; font-size: 0.9rem;" onclick="promptCreateRoomFromSearch('${input.value.replace(/'/g, "\\'")}')">${btnText}</button>`;
            createContainer.style.display = "block";
        } else {
            createContainer.style.display = "none";
        }
    }
};

window.promptCreateRoomFromSearch = async function(roomName) {
    let msg1 = langKey === 'vi' ? `Phòng "<strong>${roomName}</strong>" chưa tồn tại.<br>Bạn có muốn tạo nó không?` : 
               (langKey === 'en' ? `The room "<strong>${roomName}</strong>" does not exist.<br>Do you want to create it?` : 
               `La pièce "<strong>${roomName}</strong>" n'existe pas.<br>Voulez-vous la créer ?`);
               
    let confirm1 = await askCustomQuestion("Création de pièce", msg1, [
        { text: langKey==='en'?"Yes, create it":"Oui, la créer", value: true, style: "background: var(--vert); color: white;" },
        { text: langKey==='en'?"No":"Non", value: false, style: "background: #e1e8ef; color: var(--bleu);" }
    ]);
    
    if (!confirm1) return;
    
    let accordions = document.querySelectorAll('.level-accordion');
    let floorButtons = [];
    accordions.forEach(acc => {
        let lvlId = acc.id.replace('block_', '');
        let lvlName = acc.getAttribute('data-levelname');
        floorButtons.push({ text: lvlName, value: lvlId, style: "background: var(--gris); color: var(--bleu); border: 1px solid var(--bleu);" });
    });
    
    floorButtons.push({ text: langKey==='en'?"+ New floor":"+ Nouvel étage", value: "NEW", style: "background: var(--bleu); color: white;" });
    floorButtons.push({ text: langKey==='en'?"Cancel":"Annuler", value: null, style: "background: transparent; color: #888; border: none; text-decoration: underline;" });
    
    let msg2 = langKey === 'vi' ? `Chọn tầng cho "<strong>${roomName}</strong>":` : 
               (langKey === 'en' ? `Choose a floor for "<strong>${roomName}</strong>":` : 
               `Choisissez l'étage pour "<strong>${roomName}</strong>" :`);
               
    let chosenLevel = await askCustomQuestion("Choix de l'étage", msg2, floorButtons);
    
    if (!chosenLevel) return;
    
    let targetLevelId = chosenLevel;
    
    if (chosenLevel === "NEW") {
        let msg3 = langKey === 'vi' ? `Tên tầng mới:` : 
                   (langKey === 'en' ? `Name of the new floor:` : 
                   `Nom du nouvel étage :`);
        let newLevelName = await askCustomQuestion("Nouvel étage", msg3, [
            { text: langKey==='en'?"Create":"Créer", value: true, style: "background: var(--vert); color: white;" },
            { text: langKey==='en'?"Cancel":"Annuler", value: false, style: "background: #e1e8ef; color: var(--bleu);" }
        ], true);
        
        if (!newLevelName || newLevelName.trim() === '') return;
        targetLevelId = createLevelAccordion(newLevelName.trim());
    }
    
    let newRoomId = addStructuredRoom(targetLevelId, 'Autre');
    
    let newRoomCard = document.getElementById('row_' + newRoomId);
    if (newRoomCard) {
        let customInput = newRoomCard.querySelector('input[type="text"]');
        if (customInput) {
            customInput.value = roomName;
            updateLevelSummaries();
        }
    }
    
    let searchInput = document.getElementById('roomSearchInput');
    if (searchInput) searchInput.value = '';
    filterRooms();
    
    if (newRoomCard) {
        setTimeout(() => {
            newRoomCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            newRoomCard.style.transition = "box-shadow 0.5s ease";
            newRoomCard.style.boxShadow = "0 0 15px 5px var(--vert)";
            setTimeout(() => newRoomCard.style.boxShadow = "none", 2000);
        }, 300);
    }
};

function addStructuredRoom(levelId, type) {
    roomCounter++;
    const roomId = 'room_detail_' + roomCounter;
    planData[roomId] = { days: [], months: [], start:'', end:'', roomType: type, comment: '' };

    let displayTitle = (mappingDisplay[type] && mappingDisplay[type][langKey]) ? mappingDisplay[type][langKey] : type;
    if (type === 'Autre') displayTitle = langKey === 'vi' ? 'Không gian mới' : (langKey === 'en' ? 'New space' : 'Nouvel espace');

    let levelName = "";
    let acc = document.getElementById('block_' + levelId);
    if(acc) levelName = acc.getAttribute('data-levelname');
    
    displayTitle = `${displayTitle} <span style="font-size: 0.75rem; color: #888; font-weight: normal; margin-left: 5px;">(${levelName})</span>`;

    let phAutre = langKey === 'vi' ? 'Ví dụ: Phòng sao chụp...' : (langKey === 'en' ? 'Ex: Copy Room...' : 'Ex: Espace Reprographie...');
    let customNameHtml = type === 'Autre' ? `<input type="text" placeholder="${phAutre}" style="font-size:0.8rem; padding:6px; margin-bottom:10px; width:100%; border:1px solid #ccc; border-radius:5px;" oninput="updateLevelSummaries(); filterRooms();">` : '';
    let qtyHtml = '';
    
    let lblHommes = langKey === 'vi' ? '🚹 Nam (số lượng) *' : (langKey === 'en' ? '🚹 Men (number) *' : '🚹 Hommes (nombre) *');
    let lblFemmes = langKey === 'vi' ? '🚺 Nữ (số lượng) *' : (langKey === 'en' ? '🚺 Women (number) *' : '🚺 Femmes (nombre) *');
    let lblMixte = langKey === 'vi' ? '🚹🚺 Hỗn hợp (SL) *' : (langKey === 'en' ? '🚹🚺 Mixed (qty) *' : '🚹🚺 Mixte (nombre) *');
    
    let lblTotalBur = langKey === 'vi' ? 'Tổng số văn phòng *' : (langKey === 'en' ? 'Total offices *' : 'Bureaux (total) *');
    let lblOccBur = langKey === 'vi' ? 'Văn phòng có người *' : (langKey === 'en' ? 'Occupied offices *' : 'Bureaux occupés *');

    let lblNbEspaces = langKey === 'vi' ? 'Số lượng khu vực *' : (langKey === 'en' ? 'Number of spaces *' : 'Nombre d\'espaces *');
    let lblNbTables = langKey === 'vi' ? 'Số lượng bàn *' : (langKey === 'en' ? 'Number of tables *' : 'Nombre de tables *');
    let lblNbChaises = langKey === 'vi' ? 'Số lượng ghế *' : (langKey === 'en' ? 'Number of chairs *' : 'Nombre de chaises *');

    if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
        qtyHtml = `
        <div class="qty-input-box"><label>${lblHommes}</label><input type="number" id="qty_h_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblFemmes}</label><input type="number" id="qty_f_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblMixte}</label><input type="number" id="qty_m_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>`;
    } else if (type === 'Bureau') {
        qtyHtml = `
        <div class="qty-input-box"><label>${lblTotalBur}</label><input type="number" id="qty_tot_${roomId}" min="0" value="0" oninput="validateBureaux('${roomId}'); calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblOccBur}</label><input type="number" id="qty_occ_${roomId}" min="0" value="0" oninput="validateBureaux('${roomId}'); calculatePrice()"></div>`;
    } else if (type === 'Restauration') {
        qtyHtml = `
        <div class="qty-input-box"><label>${lblNbEspaces}</label><input type="number" id="qty_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblNbTables}</label><input type="number" id="qty_tables_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblNbChaises}</label><input type="number" id="qty_chaises_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>`;
    } else {
        let labelQty = langKey === 'vi' ? "Số lượng phòng *" : (langKey === 'en' ? "Number of rooms *" : "Nombre de pièces *");
        if (type.includes('Ascenseur')) labelQty = langKey === 'vi' ? "Số lượng thang máy *" : (langKey === 'en' ? "Number of elevators *" : "Nombre d'ascenseurs *");
        else if (type.includes('Escalier')) labelQty = langKey === 'vi' ? "Số lượng cầu thang *" : (langKey === 'en' ? "Number of stairs *" : "Nombre d'escaliers *");
        else if (type === 'Palier') labelQty = langKey === 'vi' ? "Số lượng chiếu nghỉ *" : (langKey === 'en' ? "Number of landings *" : "Nombre de paliers *");
        else if (type === 'Terrasse') labelQty = langKey === 'vi' ? "Số lượng sân thượng *" : (langKey === 'en' ? "Number of terraces *" : "Nombre de terrasses *");
        else if (type === 'Parking') labelQty = langKey === 'vi' ? "Số lượng chỗ đậu *" : (langKey === 'en' ? "Number of spaces *" : "Nombre de places *");
        else if (type === 'Couloir') labelQty = langKey === 'vi' ? "Số lượng hành lang *" : (langKey === 'en' ? "Number of hallways *" : "Nombre de couloirs *");
        else if (type === 'Salle de réunion') labelQty = langKey === 'vi' ? "Số lượng phòng *" : (langKey === 'en' ? "Number of rooms *" : "Nombre de salles *");
        else if (type === 'Cuisine') labelQty = langKey === 'vi' ? "Số lượng nhà bếp *" : (langKey === 'en' ? "Number of kitchens *" : "Nombre de cuisines *");
        else if (type === 'Local technique') labelQty = langKey === 'vi' ? "Số lượng phòng kỹ thuật *" : (langKey === 'en' ? "Number of tech rooms *" : "Nombre de locaux *");
        else if (['Accueil', 'Salle de repos', 'Salle de sport'].includes(type)) labelQty = langKey === 'vi' ? "Số lượng khu vực *" : (langKey === 'en' ? "Number of spaces *" : "Nombre d'espaces *");
        qtyHtml = `<div class="qty-input-box"><label>${labelQty}</label><input type="number" id="qty_${roomId}" min="0" value="0" oninput="calculatePrice()"></div>`;
    }

    let defaultSol = "non_precise";
    if (defaultFloors.levels[`${levelId}_${type}`]) {
        defaultSol = defaultFloors.levels[`${levelId}_${type}`];
    } else if (defaultFloors.global[type]) {
        defaultSol = defaultFloors.global[type];
    }

    let lblSol = langKey === 'vi' ? 'Sàn *' : (langKey === 'en' ? 'Floor *' : 'Sol *');
    let optNonPrecise = langKey === 'vi' ? '-- Chọn sàn --' : (langKey === 'en' ? '-- Select floor --' : '-- Choisir le sol --');
    let optMoquette = langKey === 'vi' ? 'Thảm' : (langKey === 'en' ? 'Carpet' : 'Moquette');
    let optCarrelage = langKey === 'vi' ? 'Gạch men' : (langKey === 'en' ? 'Tiles' : 'Carrelage');
    let optLino = langKey === 'vi' ? 'Lino / PVC' : (langKey === 'en' ? 'Lino / PVC' : 'Lino / PVC');
    let optParquet = langKey === 'vi' ? 'Bê tông / Nhựa' : (langKey === 'en' ? 'Concrete / Resin' : 'Béton / Résine');
    let optAutre = langKey === 'vi' ? 'Khác' : (langKey === 'en' ? 'Other' : 'Autre');

    let colorLabelSol = defaultSol === 'non_precise' ? '#e74c3c' : 'var(--bleu)';

    let surfaceHtml = `
    <div class="qty-input-box sol-box">
        <label style="color: ${colorLabelSol}; font-weight: bold;">${lblSol}</label>
        <select id="sol_${roomId}" data-type="${type.replace(/'/g, "\\'")}" onchange="handleSolChange(this, '${roomId}', '${type.replace(/'/g, "\\'")}')" style="transition: 0.3s; outline: none; ${defaultSol !== 'non_precise' ? 'border: 1px solid #ccc; background-color: transparent;' : ''}">
            <option value="non_precise" ${defaultSol === 'non_precise' ? 'selected' : ''} disabled>${optNonPrecise}</option>
            <option value="moquette" ${defaultSol === 'moquette' ? 'selected' : ''}>${optMoquette}</option>
            <option value="carrelage" ${defaultSol === 'carrelage' ? 'selected' : ''}>${optCarrelage}</option>
            <option value="lino" ${defaultSol === 'lino' ? 'selected' : ''}>${optLino}</option>
            <option value="parquet" ${defaultSol === 'parquet' ? 'selected' : ''}>${optParquet}</option>
            <option value="autre" ${defaultSol === 'autre' ? 'selected' : ''}>${optAutre}</option>
        </select>
    </div>`;

    let consommablesHtml = '';
    const zonesConsommables = ['Sanitaires', 'Douche', 'Vestiaire', 'Cuisine', 'Restauration', 'Salle de repos', 'Salle de sport'];
    if (zonesConsommables.includes(type)) {
        let lblFourniture = langKey === 'vi' ? '🧻 Vật tư (Giấy, xà phòng...)' : (langKey === 'en' ? '🧻 Supplies (Paper, soap...)' : '🧻 Fourniture (Papier, savon...)');
        let optClient = langKey === 'vi' ? 'Bạn tự lo' : (langKey === 'en' ? 'Your responsibility' : 'À votre charge');
        let optOsp = langKey === 'vi' ? 'Cung cấp bởi O.S.P+' : (langKey === 'en' ? 'Provided by O.S.P+' : 'Fournis par O.S.P+');

        consommablesHtml = `
        <div class="qty-input-box" style="background:#eef3f8; border-color:var(--bleu);">
            <label>${lblFourniture}</label>
            <select id="cons_select_${roomId}" onchange="calculatePrice()" style="background:transparent; border:none; font-weight:700; color:var(--bleu); padding:0; outline:none;">
                <option value="client">${optClient}</option>
                <option value="osp">${optOsp}</option>
            </select>
        </div>`;
    }

    qtyHtml = `<div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:10px;">${qtyHtml}${surfaceHtml}${consommablesHtml}</div>`;

    let prets = prestationsData[type] || prestationsData['Autre'];
    let pretsHtml = `<div class="prest-pill-container">`;
    if (prets.obligatoires && prets.obligatoires.length > 0) {
        prets.obligatoires.forEach((p, i) => {
            let localizedTask = (taskTranslations[p] && taskTranslations[p][langKey]) ? taskTranslations[p][langKey] : p;
            pretsHtml += `<div class="prest-pill mandatory" title="Inclus d'office pour l'hygiène de cette zone."><input type="checkbox" id="p_ob_${roomId}_${i}" checked disabled><label for="p_ob_${roomId}_${i}">${localizedTask}</label></div>`;
        });
    }
    if (prets.optionnelles && prets.optionnelles.length > 0) {
        prets.optionnelles.forEach((p, i) => {
            let localizedTask = (taskTranslations[p] && taskTranslations[p][langKey]) ? taskTranslations[p][langKey] : p;
            pretsHtml += `<div class="prest-pill"><input type="checkbox" id="p_op_${roomId}_${i}" checked onchange="calculatePrice()"><label for="p_op_${roomId}_${i}">${localizedTask}</label></div>`;
        });
    }
    pretsHtml += `</div>`;

    let lblCleanTitle = langKey === 'vi' ? 'Các dịch vụ làm sạch' : (langKey === 'en' ? 'Cleaning services' : 'Prestations de nettoyage');
    lblCleanTitle = `<span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">3</span>` + lblCleanTitle;

    let ttClean = langKey === 'vi' ? 'Đánh dấu các hành động cụ thể cần thực hiện trong phòng này.' : (langKey === 'en' ? 'Check the specific actions to be carried out in this room.' : 'Cochez les actions spécifiques à réaliser dans cette pièce.');
    let lblHygiene = langKey === 'vi' ? 'Lưu ý: Các tác vụ có ổ khóa 🔒 là bắt buộc.' : (langKey === 'en' ? 'Note: Tasks with a padlock 🔒 are mandatory.' : 'Note : Les tâches avec un cadenas 🔒 sont incluses obligatoirement.');
    let ttHygiene = langKey === 'vi' ? 'Bao gồm mặc định để đảm bảo tiêu chuẩn vệ sinh cơ bản.' : (langKey === 'en' ? 'Included automatically to guarantee basic hygiene standards.' : 'Inclus d\'office pour garantir les normes d\'hygiène de base.');
    
    let btnPlanDaysText = langKey === 'vi' ? '+ Lập kế hoạch ngày' : (langKey === 'en' ? '+ Schedule days' : '+ Planifier les jours');
    let lblPlanTitle = langKey === 'vi' ? 'Lập kế hoạch' : (langKey === 'en' ? 'Planning' : 'Planification');

    let html = `
    <div class="structured-room-card" id="row_${roomId}" data-roomtype="${type.replace(/'/g, "\\'")}">
        <h5><span>${displayTitle}</span><button type="button" class="btn-delete-row" onclick="removeRoom('${roomId}')">×</button></h5>
        ${customNameHtml}
        ${qtyHtml}
        <div style="font-size:0.75rem; color:var(--bleu); font-weight:700; margin-top:5px; margin-bottom:8px; display:flex; align-items:center;">${lblCleanTitle} <span class="help-bubble">?<span class="tooltip-text">${ttClean}</span></span> :</div>
        ${prets.obligatoires && prets.obligatoires.length > 0 ? `<div style="font-size:0.65rem; color:#888; font-style:italic; margin-top:-5px; margin-bottom:5px; display:flex; align-items:center;">${lblHygiene} <span class="help-bubble">?<span class="tooltip-text">${ttHygiene}</span></span></div>` : ""}
        ${pretsHtml}
        <div style="font-size:0.75rem; color:var(--vert); font-weight:700; margin-top:12px; margin-bottom:5px; display:flex; align-items:center;">
            <span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">4</span> ${lblPlanTitle}
        </div>
        <div style="margin-top:2px;"><button type="button" id="btn_plan_${roomId}" class="btn-planifier" onclick="openPlanningModal('${roomId}', '${type.replace(/'/g, "\\'")}')">${btnPlanDaysText}</button></div>
    </div>`;

    document.getElementById('rooms_container_' + levelId).insertAdjacentHTML('beforeend', html);
    calculatePrice();
    updateLevelSummaries();
    if(window.filterRooms) window.filterRooms();
    
    return roomId;
}

function removeRoom(roomId) {
    const row = document.getElementById('row_' + roomId);
    if (row) row.remove();
    if (planData[roomId]) delete planData[roomId];
    calculatePrice();
    updateLevelSummaries();
    if(window.filterRooms) window.filterRooms();
}

function getRealInterventionCount(selectedDays = [], selectedMonths = [], startDate = '', endDate = '') {
    if (!selectedDays) selectedDays = [];
    if (!selectedMonths) selectedMonths = [];
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
                selectedDays.forEach(dName => { if (mapDays[dName] === d) totalInterventions++; });
                current.setDate(current.getDate() + 1);
            }
            return totalInterventions;
        }
    }

    if (selectedMonths.length > 0) {
        if (selectedDays.length === 0) return selectedMonths.length; 
        const mapMonths = {'Jan':0, 'Fév':1, 'Mar':2, 'Avr':3, 'Mai':4, 'Juin':5, 'Juil':6, 'Août':7, 'Sep':8, 'Oct':9, 'Nov':10, 'Déc':11};
        const now = getSimulatedDate();
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
    
    let displayModalName = (mappingDisplay[name] && mappingDisplay[name][langKey]) ? mappingDisplay[name][langKey] : name;
    let titleSuffix = langKey === 'vi' ? " - Lập kế hoạch" : (langKey === 'en' ? " - Scheduling" : " - Planification");
    document.getElementById('planningModalTitle').innerText = displayModalName + titleSuffix;
    
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
    let sDays = []; document.querySelectorAll('.plan-day-cb:checked').forEach(cb => sDays.push(cb.value));
    let sMonths = []; document.querySelectorAll('.plan-month-cb:checked').forEach(cb => sMonths.push(cb.value));
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
        let text = langKey === 'vi' ? "+ Lập kế hoạch" : (langKey === 'en' ? "+ Schedule" : "+ Planifier");
        if (sDate && eDate) {
            text = langKey === 'vi' ? "Giai đoạn" : (langKey === 'en' ? "Period" : "Période");
        } else if (sDays.length > 0 || sMonths.length > 0) {
            let letterJ = langKey === 'vi' ? 'N' : (langKey === 'en' ? 'D' : 'J');
            let letterM = langKey === 'vi' ? 'T' : (langKey === 'en' ? 'M' : 'M');
            let wordDays = langKey === 'vi' ? 'Ngày' : (langKey === 'en' ? 'Day(s)' : 'Jour(s)');
            if (sMonths.length > 0) text = `${sDays.length}${letterJ} | ${sMonths.length}${letterM}`;
            else text = `${sDays.length} ${wordDays}`;
        } else if (sComment.trim() !== '') {
            text = langKey === 'vi' ? "Đã ghi chú ✓" : (langKey === 'en' ? "Specified ✓" : "Précisé ✓");
        }
        
        if (text !== "+ Planifier" && text !== "+ Schedule" && text !== "+ Lập kế hoạch") { 
            btn.innerText = text; btn.classList.add('active'); 
        } else { 
            btn.innerText = text; btn.classList.remove('active'); 
        }
    }
    
    document.getElementById('planningModal').style.display = "none";
    calculatePrice();
}

window.handleVehiculeChange = function(source) {
    const pack = document.getElementById('qty_pack_v');
    const upsell = document.getElementById('vehicule_upsell');

    const ids_detail = ['qty_siege_ag', 'qty_siege_ad', 'qty_banq_ar', 'qty_coffre_auto', 'qty_tapis_ag', 'qty_tapis_ad', 'qty_tapis_arg', 'qty_tapis_ard', 'qty_tapis_coffre'];
    const ids_cb = ['cb_tapis_siege_ag', 'cb_tapis_siege_ad', 'cb_tapis_banq_ar'];

    if (source === 'pack' && pack && parseInt(pack.value) > 0) {
        ids_detail.forEach(id => { let el = document.getElementById(id); if(el) el.value = 0; });
        ids_cb.forEach(id => { let el = document.getElementById(id); if(el) el.checked = false; });
        if(upsell) upsell.style.display = 'none';
    } else if (source === 'detail') {
        let totalDetail = 0;
        
        totalDetail += (parseInt(document.getElementById('qty_siege_ag')?.value)||0)*35;
        if(document.getElementById('cb_tapis_siege_ag')?.checked) totalDetail += (parseInt(document.getElementById('qty_siege_ag')?.value)||1)*10;
        
        totalDetail += (parseInt(document.getElementById('qty_siege_ad')?.value)||0)*35;
        if(document.getElementById('cb_tapis_siege_ad')?.checked) totalDetail += (parseInt(document.getElementById('qty_siege_ad')?.value)||1)*10;

        totalDetail += (parseInt(document.getElementById('qty_banq_ar')?.value)||0)*70;
        if(document.getElementById('cb_tapis_banq_ar')?.checked) totalDetail += (parseInt(document.getElementById('qty_banq_ar')?.value)||1)*20;

        totalDetail += (parseInt(document.getElementById('qty_coffre_auto')?.value)||0)*20;

        totalDetail += (parseInt(document.getElementById('qty_tapis_ag')?.value)||0)*10;
        totalDetail += (parseInt(document.getElementById('qty_tapis_ad')?.value)||0)*10;
        totalDetail += (parseInt(document.getElementById('qty_tapis_arg')?.value)||0)*10;
        totalDetail += (parseInt(document.getElementById('qty_tapis_ard')?.value)||0)*10;
        totalDetail += (parseInt(document.getElementById('qty_tapis_coffre')?.value)||0)*10;

        if (totalDetail > 0 && pack) pack.value = 0;
        if (upsell) upsell.style.display = totalDetail >= 130 ? 'block' : 'none';
        
        ids_cb.forEach(id => {
            let cb = document.getElementById(id);
            if (cb && cb.checked) {
                let baseId = id.replace('cb_tapis_', 'qty_');
                let input = document.getElementById(baseId);
                if (input && (parseInt(input.value)||0) === 0) input.value = 1;
            }
        });
    }
    
    calculatePrice();
};

window.updateEvtPendantCalculations = function() {
    let startVal = document.getElementById('evt_start_time')?.value;
    let endVal = document.getElementById('evt_end_time')?.value;
    let box = document.getElementById('evt_pendant_result_box');

    if (!startVal || !endVal) {
        if (box) { box.style.display = 'none'; box.innerHTML = ''; }
        window.evtPendantData = { totalCost: 0, totalHours: 0, dayHours: 0, nightHours: 0, dayCost: 0, nightCost: 0 };
        calculatePrice();
        return;
    }

    let [sH, sM] = startVal.split(':').map(Number);
    let [eH, eM] = endVal.split(':').map(Number);
    
    let start = sH + (sM / 60);
    let end = eH + (eM / 60);
    
    if (end <= start) {
        end += 24; 
    }
    
    let totalMinutes = Math.round((end - start) * 60);
    let startMin = Math.round(start * 60);
    
    let dayMins = 0;
    let nightMins = 0;
    
    for (let m = 0; m < totalMinutes; m++) {
        let currentMinOfDay = (startMin + m) % (24 * 60);
        if (currentMinOfDay >= 360 && currentMinOfDay < 1260) {
            dayMins++;
        } else {
            nightMins++;
        }
    }
    
    let dayHours = dayMins / 60;
    let nightHours = nightMins / 60;
    
    let dayCost = dayHours * 25;
    let nightCost = nightHours * 30; 
    let totalCost = dayCost + nightCost;

    window.evtPendantData = {
        totalHours: totalMinutes / 60,
        dayHours: dayHours,
        nightHours: nightHours,
        dayCost: dayCost,
        nightCost: nightCost,
        totalCost: totalCost
    };

    if (box) {
        box.style.display = 'block';
        let dayStr = dayHours > 0 ? `☀️ <strong>${dayHours.toFixed(2).replace(/\.00$/,'')}h Jour</strong> (06h-21h à 25 €/h) : ${dayCost.toFixed(2)} €` : '';
        let nightStr = nightHours > 0 ? `🌙 <strong>${nightHours.toFixed(2).replace(/\.00$/,'')}h Nuit (+20%)</strong> (21h-06h à 30 €/h) : ${nightCost.toFixed(2)} €` : '';
        
        let parts = [dayStr, nightStr].filter(Boolean).join('<br>');

        box.innerHTML = `
            <strong>⏱️ Durée totale : ${(totalMinutes/60).toFixed(2).replace(/\.00$/,'')} heure(s) (de ${startVal} à ${endVal})</strong><br>
            ${parts}
            <div style="margin-top:6px; font-weight:800; font-size:0.85rem; border-top:1px dashed #e67e22; padding-top:4px;">
                Sous-total Présence : ${totalCost.toFixed(2)} €
            </div>
        `;
    }

    calculatePrice();
};

function calculatePrice() {
    let total = 0;
    let subTotals = { vitrerie: 0, shampouinage: 0, vehicule: 0, bureaux: 0, sepulture: 0, evenements: 0, chantier: 0 };
    let hasOspConsommables = false; 
    const TAUX_HORAIRE = 35.00; 
    
    // --- 1. VITRERIE ---
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
        if (vPrices[baseId]) subTotals.vitrerie += q * (vPrices[baseId] * priceRatio) * exactMultiplier;
    });

    // --- 2. PRIX FIXES ---
    const pricesFixed = { 
        'can23': 89, 'can45': 139, 'canAng': 159, 'tapis': 49, 'moq': 7, 
        'pack_v': 150, 'siege_ag': 35, 'siege_ad': 35, 'banq_ar': 70, 'coffre_auto': 20,
        'tapis_ag': 10, 'tapis_ad': 10, 'tapis_arg': 10, 'tapis_ard': 10, 'tapis_coffre': 10,
        'sep_simple': 45, 'sep_double': 65, 'sep_caveau': 85, 'sep_columbarium': 25, 'sep_terre': 40,
        'sep_fleurs_art': 15, 'sep_fleurs_vrai': 25, 'sep_pots_acc': 10,
        'sep_sub_4': 69, 'sep_sub_6': 59, 'sep_sub_12': 89, 'sep_sub_24': 119,
        'evt_salle_petite': 149, 'evt_salle_grande': 289
    };

    for (let id in pricesFixed) {
        const qtyInput = document.getElementById('qty_' + id);
        if (qtyInput) {
            let q = parseFloat(qtyInput.value) || 0;
            let data = planData[id] || {days:[], months:[], start:'', end:''};
            let exactMultiplier = getRealInterventionCount(data.days, data.months, data.start, data.end);
            let cost = q * pricesFixed[id] * exactMultiplier;
            
            if (['can23','can45','canAng','tapis','moq'].includes(id)) subTotals.shampouinage += cost;
            else if (id.startsWith('pack_v') || id.startsWith('siege_') || id.startsWith('banq_') || id.startsWith('coffre_') || id.startsWith('tapis_')) subTotals.vehicule += cost;
            else if (id.startsWith('sep_')) subTotals.sepulture += cost;
            else if (id.startsWith('evt_')) subTotals.evenements += cost;
        }
    }

    // --- 3. ÉVÉNEMENTS (Checkboxes & Consommables & Pendant) ---
    if (document.getElementById('cb_evt_nettoyage_avant')?.checked) subTotals.evenements += 70;
    if (document.getElementById('cb_evt_ext_terrasse')?.checked) subTotals.evenements += 70;
    if (document.getElementById('cb_evt_poubelles')?.checked) subTotals.evenements += 70;

    let consSelectEvt = document.getElementById('cons_select_evt');
    if (consSelectEvt && consSelectEvt.value === 'osp') subTotals.evenements += 29;

    if (window.evtPendantData && window.evtPendantData.totalCost) {
        subTotals.evenements += window.evtPendantData.totalCost;
    }

    // --- 4. VÉHICULE (Checkboxes Tapis liés aux sièges) ---
    if (document.getElementById('cb_tapis_siege_ag')?.checked) subTotals.vehicule += (parseInt(document.getElementById('qty_siege_ag')?.value)||1) * 10 * getRealInterventionCount(planData['siege_ag']?.days||[], planData['siege_ag']?.months||[], planData['siege_ag']?.start, planData['siege_ag']?.end);
    if (document.getElementById('cb_tapis_siege_ad')?.checked) subTotals.vehicule += (parseInt(document.getElementById('qty_siege_ad')?.value)||1) * 10 * getRealInterventionCount(planData['siege_ad']?.days||[], planData['siege_ad']?.months||[], planData['siege_ad']?.start, planData['siege_ad']?.end);
    if (document.getElementById('cb_tapis_banq_ar')?.checked) subTotals.vehicule += (parseInt(document.getElementById('qty_banq_ar')?.value)||1) * 20 * getRealInterventionCount(planData['banq_ar']?.days||[], planData['banq_ar']?.months||[], planData['banq_ar']?.start, planData['banq_ar']?.end);
    
    if (activeServices.includes('vehicule')) {
        let qLarge = parseInt(document.getElementById('qty_veh_large')?.value) || 0;
        let qPl = parseInt(document.getElementById('qty_veh_pl')?.value) || 0;
        subTotals.vehicule += (qLarge * 30) + (qPl * 50);
    }

    // --- 5. BUREAUX / LOCAUX ---
    for (let roomId in planData) {
        if (roomId.startsWith('room_detail_')) {
            let roomInfo = planData[roomId];
            let type = roomInfo.roomType;
            let exactMultiplier = getRealInterventionCount(roomInfo.days, roomInfo.months, roomInfo.start, roomInfo.end);
            let consSelect = document.getElementById(`cons_select_${roomId}`);
            if (consSelect && consSelect.value === 'osp') hasOspConsommables = true;

            let tempsMinutes = 0, nbEspaces = 1;
            if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
                let inputH = document.getElementById(`qty_h_${roomId}`);
                let inputF = document.getElementById(`qty_f_${roomId}`);
                let inputM = document.getElementById(`qty_m_${roomId}`);
                nbEspaces = (inputH ? parseInt(inputH.value) || 0 : 0) + (inputF ? parseInt(inputF.value) || 0 : 0) + (inputM ? parseInt(inputM.value) || 0 : 0);
                tempsMinutes = 20; 
            } else if (type === 'Bureau') {
                let inputOcc = document.getElementById(`qty_occ_${roomId}`);
                nbEspaces = inputOcc ? parseInt(inputOcc.value) || 0 : 0;
                tempsMinutes = 20; 
            } else if (type === 'Restauration') {
                let esp = document.getElementById(`qty_${roomId}`) ? parseInt(document.getElementById(`qty_${roomId}`).value) || 0 : 1;
                let tab = document.getElementById(`qty_tables_${roomId}`) ? parseInt(document.getElementById(`qty_tables_${roomId}`).value) || 0 : 0;
                let cha = document.getElementById(`qty_chaises_${roomId}`) ? parseInt(document.getElementById(`qty_chaises_${roomId}`).value) || 0 : 0;
                tempsMinutes = (15 + (tab * 2) + (cha * 1) + 5) * esp;
                nbEspaces = 1; 
            } else {
                let inputQty = document.getElementById(`qty_${roomId}`);
                nbEspaces = inputQty ? parseInt(inputQty.value) || 0 : 0;
                if (['Salle de réunion', 'Accueil', 'Cuisine', 'Salle de repos', 'Salle de sport', 'Local technique'].includes(type)) tempsMinutes = 20; 
                else if (['Ascenseur principal', 'Ascenseur secondaire', 'Palier', 'Couloir'].includes(type)) tempsMinutes = 15; 
                else if (['Escalier principal', 'Escalier secondaire'].includes(type)) tempsMinutes = 25; 
                else if (['Parking', 'Terrasse'].includes(type)) tempsMinutes = 30; 
                else tempsMinutes = 20;
            }
            subTotals.bureaux += nbEspaces * ((tempsMinutes / 60) * TAUX_HORAIRE) * exactMultiplier;
        }
    }
    
    if (hasOspConsommables) {
        let nbEmployes = 1;
        let isEntreprise = document.querySelector('input[name="statut"][value="Entreprise"]')?.checked;
        if (isEntreprise) {
            let inputEmployes = document.getElementById('nbEmployes');
            if (inputEmployes && inputEmployes.value > 0) nbEmployes = parseInt(inputEmployes.value);
        }
        subTotals.bureaux += (nbEmployes * 7.00);
    }

    // --- 6. FIN DE CHANTIER ---
    if (activeServices.includes('chantier')) {
        let m2 = parseFloat(document.getElementById('qty_chantier_m2')?.value) || 0;
        let typeChantier = document.getElementById('type_chantier')?.value || 'moyen';
        let rate = 5.00;
        if (typeChantier === 'leger') rate = 3.50;
        if (typeChantier === 'lourd') rate = 7.50;
        
        let costChantier = m2 * rate;
        if (document.getElementById('cb_chantier_monobrosse')?.checked) costChantier += (m2 * 2.00);
        if (document.getElementById('cb_chantier_dechets')?.checked) costChantier += 80;
        
        let dataPlanning = planData['chantier_m2'] || {days:[], months:[], start:'', end:''};
        let exactMultiplier = getRealInterventionCount(dataPlanning.days, dataPlanning.months, dataPlanning.start, dataPlanning.end);
        subTotals.chantier += (costChantier * exactMultiplier);
    }

    // --- 7. REGROUPEMENT ET TOTAL ---
    let totalPrestations = subTotals.vitrerie + subTotals.shampouinage + subTotals.vehicule + subTotals.bureaux + subTotals.sepulture + subTotals.evenements + subTotals.chantier;
    
    let discountText = "";

    // --- GESTION INTELLIGENTE DU DÉPLACEMENT ---
    if (window.fraisDeplacementBase > 0 && totalPrestations >= 150) {
        window.fraisDeplacementKilometrique = 0; // On offre les frais !
        discountText += `<div class="price-discount-text" style="color: #e67e22;">🎁 Frais de route offerts (Devis > 150 €)</div>`;
    } else {
        window.fraisDeplacementKilometrique = window.fraisDeplacementBase || 0;
    }

    total = totalPrestations + window.fraisDeplacementKilometrique;
    let originalTotal = total;
    window.originalTotalValue = originalTotal;
    
    // --- 8. LOGIQUE DU SERVICE VEDETTE & REMISES ---
    let totalDiscountAmount = 0;
    let conflict10 = false;

    let vedetteServiceId = null;
    let vedetteDiscount = 0;
    let resteDiscount = window.holidayPromoActive ? 0.10 : 0; 

    // Détection du mois en cours pour le Service Vedette dans calculatePrice()
    if (window.holidayPromoActive) {
        const currentMonth = getSimulatedDate().getMonth();
        if (currentMonth === 5) { vedetteServiceId = 'vehicule'; vedetteDiscount = 0.30; } 
        else if (currentMonth === 4) { vedetteServiceId = 'shampouinage'; vedetteDiscount = 0.30; } 
        else if (currentMonth === 7 || currentMonth === 8) { vedetteServiceId = 'bureaux'; vedetteDiscount = 0.30; } // <-- AOÛT & SEPTEMBRE (Opération Rentrée)
        else if (currentMonth === 2 || currentMonth === 3) { vedetteServiceId = 'vitrerie'; vedetteDiscount = 0.25; } 
        else if (currentMonth === 9 || currentMonth === 10) { vedetteServiceId = 'sepulture'; vedetteDiscount = 0.25; } 
        else if (currentMonth === 11 || currentMonth === 0) { vedetteServiceId = 'shampouinage'; vedetteDiscount = 0.25; } 
        else { vedetteServiceId = null; vedetteDiscount = 0.10; }
    }

    let appliedPromoDevis = window.promoDiscountDevis;
    let appliedClientDiscount = window.clientDiscount;

    let count10 = 0;
    if (appliedPromoDevis === 0.10) count10++;
    if (appliedClientDiscount === 0.10) count10++;
    if (resteDiscount === 0.10) count10++; 

    if (count10 >= 2) { 
        conflict10 = true; 
        appliedPromoDevis = 0; 
    }

    if (window.holidayPromoActive && vedetteServiceId && activeServices.includes(vedetteServiceId)) {
        let vedetteAmount = subTotals[vedetteServiceId];
        let resteAmount = originalTotal - vedetteAmount - window.fraisDeplacementKilometrique;

        totalDiscountAmount += (vedetteAmount * vedetteDiscount);
        totalDiscountAmount += (resteAmount * resteDiscount);

        if (appliedClientDiscount > 0) totalDiscountAmount += (originalTotal * appliedClientDiscount);
        if (appliedPromoDevis > 0) totalDiscountAmount += (originalTotal * appliedPromoDevis);

        total -= totalDiscountAmount;

        discountText += `<div class="price-discount-text">🌟 Service Vedette (-${vedetteDiscount*100}%)</div>`;
        if(resteAmount > 0) discountText += `<div class="price-discount-text">✓ Reste de la commande (-${resteDiscount*100}%)</div>`;
        
    } else {
        let totalDiscountPercent = 0;
        if (appliedClientDiscount > 0) totalDiscountPercent += appliedClientDiscount;
        if (appliedPromoDevis > 0) totalDiscountPercent += appliedPromoDevis;
        if (resteDiscount > 0) totalDiscountPercent += resteDiscount;

        if (totalDiscountPercent > 0) {
            totalDiscountAmount = (originalTotal * totalDiscountPercent);
            total -= totalDiscountAmount;

            if (appliedClientDiscount > 0) discountText += `<div class="price-discount-text">✓ Code VIP Fidélité (-${appliedClientDiscount * 100}%)</div>`;
            if (resteDiscount > 0) discountText += `<div class="price-discount-text">✓ Offre Jour Férié (-10%)</div>`;
            if (appliedPromoDevis > 0) discountText += `<div class="price-discount-text">✓ Code Promo (-${appliedPromoDevis * 100}%)</div>`;
        }
    }

    if (conflict10) discountText += `<div class="price-min-alert" style="color: #e67e22; margin-top: 5px;">⚠️ Deux réductions de 10% ne sont pas cumulables.</div>`;

    if (totalDiscountAmount > 0) {
        let pctTotalRounded = Math.round((totalDiscountAmount / originalTotal) * 100) || 0;
        discountText += `<div class="price-discount-text" style="font-weight: 800; color: var(--vert); margin-top: 5px; font-size: 0.85rem;">🎉 SUPER ! Vous bénéficiez de ${pctTotalRounded}% de remise totale !</div>`;
    }

    window.currentTotalValue = total;
    let mentionMinimum = (total > 0 && total < 35.00) ? `<div class="price-min-alert" style="margin-top:8px;">💡 Astuce : Un minimum de facturation de 35,00 € s'applique. Ajoutez d'autres prestations.</div>` : "";
    
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
    vitrerieVisibleCount = {}; vitrerieIndexCount = {}; customVisibleCount = 0; customIndexCount = 0;
    planData = {}; activeServices = []; roomCounter = 0;
    window.evtPendantData = { totalCost: 0, totalHours: 0, dayHours: 0, nightHours: 0, dayCost: 0, nightCost: 0 };
    window.fraisDeplacementKilometrique = 0;
    window.fraisDeplacementBase = 0;
    
    window.promoDiscountDevis = 0;
    window.activePromoCodeDevis = "";
    if (document.getElementById('promoCodeInputDevis')) document.getElementById('promoCodeInputDevis').value = "";
    if (document.getElementById('promoCodeMsgDevis')) document.getElementById('promoCodeMsgDevis').innerText = "";
    
    document.getElementById('topPriceBanner').style.display = "flex";
    document.getElementById('estimatedAmount').innerHTML = `<div class="price-left-main">0.00 €*</div>`;
    
    const fields = document.getElementById('dynamicFields');
    if (document.getElementById('customRowsContainer')) document.getElementById('customRowsContainer').innerHTML = '';
    
    let guideTitle = langKey === 'vi' ? 'ℹ️ Hướng dẫn điền báo giá của bạn ?' : (langKey === 'en' ? 'ℹ️ How to fill out your quote?' : 'ℹ️ Comment remplir votre devis ?');
    let steps = [];

    if (baseService === 'bureaux') {
        if (langKey === 'vi') steps = ['<b>Các tầng:</b> Thêm các tầng cho cơ sở của bạn.', '<b>Các phòng:</b> Chi tiết các phòng cấu thành mỗi tầng.', '<b>Bảo dưỡng:</b> Chỉ định nội dung công việc cho từng phòng.', '<b>Lập kế hoạch:</b> Xác định tần suất mong muốn.'];
        else if (langKey === 'en') steps = ['<b>Your levels:</b> Add the floors of your premises.', '<b>Your rooms:</b> Detail what makes up each level.', '<b>Maintenance:</b> Specify the tasks for each room.', '<b>Planning:</b> Define the frequency.'];
        else steps = ['<b>Vos niveaux :</b> Ajoutez les étages de vos locaux.', '<b>Vos pièces :</b> Détaillez ce qui compose chaque niveau.', '<b>L\'entretien :</b> Précisez le contenu de chaque pièce.', '<b>La planification :</b> Définissez la fréquence d\'intervention.'];
    } else if (baseService === 'vitrerie') {
        if (langKey === 'vi') steps = ['<b>Cửa kính:</b> Chọn loại cửa sổ của bạn.', '<b>Số lượng:</b> Cho biết số lượng cửa.', '<b>Bảo dưỡng:</b> Chọn làm sạch Trong, Ngoài hoặc Toàn bộ.', '<b>Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch".'];
        else if (langKey === 'en') steps = ['<b>Your windows:</b> Choose your window type.', '<b>Quantity:</b> Indicate the number.', '<b>Maintenance:</b> Choose Interior, Exterior, or Complete.', '<b>Planning:</b> Click "+ Schedule".'];
        else steps = ['<b>Vos vitrages :</b> Choisissez le type de fenêtre.', '<b>Quantité :</b> Indiquez le nombre exact.', '<b>Entretien :</b> Intérieur, Extérieur ou Complet.', '<b>Planification :</b> Définissez la fréquence.'];
    } else if (baseService === 'shampouinage') {
        if (langKey === 'vi') steps = ['<b>Đồ vải:</b> Chọn loại (Sô pha, thảm...).', '<b>Số lượng:</b> Cho biết số lượng cần làm sạch.', '<b>Lập kế hoạch:</b> Chỉ định ngày mong muốn.'];
        else if (langKey === 'en') steps = ['<b>Your textiles:</b> Select the type (Sofa, Rug...).', '<b>Quantity:</b> Indicate the number to clean.', '<b>Planning:</b> Specify the desired date.'];
        else steps = ['<b>Vos textiles :</b> Sélectionnez le type (Canapé, Tapis...).', '<b>Quantité :</b> Indiquez le nombre à nettoyer.', '<b>Planification :</b> Précisez la date souhaitée.'];
    } else if (baseService === 'vehicule') {
        if (langKey === 'vi') steps = ['<b>Số lượng xe:</b> Nhập số lượng theo kích thước.', '<b>Gói cước:</b> Chọn dịch vụ của bạn.', '<b>Lập kế hoạch:</b> Chọn ngày can thiệp.'];
        else if (langKey === 'en') steps = ['<b>Vehicle quantity:</b> Enter the number of vehicles.', '<b>Services:</b> Select your options.', '<b>Planning:</b> Choose an intervention date.'];
        else steps = ['<b>Vos véhicules :</b> Indiquez le nombre pour chaque gabarit.', '<b>Prestations :</b> Choisissez vos options (Pack ou À la carte).', '<b>Planification :</b> Choisissez la date d\'intervention.'];
    } 
    else if (baseService === 'sepulture') {
        if (langKey === 'vi') steps = ['<b>Mộ:</b> Chọn loại mộ của bạn.', '<b>Số lượng:</b> Cho biết số lượng.', '<b>Dịch vụ:</b> Làm sạch, hoa...', '<b>Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch".'];
        else if (langKey === 'en') steps = ['<b>Graves:</b> Choose your grave type.', '<b>Quantity:</b> Indicate the number.', '<b>Services:</b> Cleaning, flowers...', '<b>Planning:</b> Click "+ Schedule".'];
        else steps = ['<b>Sépultures :</b> Choisissez le type de monument.', '<b>Quantité :</b> Indiquez le nombre.', '<b>Options :</b> Nettoyage, fleurissement...', '<b>Planification :</b> Définissez la fréquence.'];
    }
    else if (baseService === 'evenements') {
        if (langKey === 'vi') steps = ['<b>Quy mô:</b> Chọn diện tích phòng.', '<b>Tùy chọn:</b> Thêm vệ sinh Trước/Trong sự kiện hoặc vật tư tiêu hao.', '<b>Lập kế hoạch:</b> Chọn ngày can thiệp.'];
        else if (langKey === 'en') steps = ['<b>Hall size:</b> Choose the formula according to area.', '<b>Options:</b> Add cleaning BEFORE/DURING event or hygiene consumables.', '<b>Planning:</b> Choose intervention dates.'];
        else steps = ['<b>Surface :</b> Choisissez la formule selon la taille de votre salle.', '<b>Options :</b> Ajoutez le nettoyage AVANT/PENDANT ou la fourniture de consommables.', '<b>Planification :</b> Choisissez vos dates d\'intervention.'];
    }

    let guideHtml = `<div class="guide-remplissage"><strong>${guideTitle}</strong><div style="margin-top: 15px; display: flex; flex-direction: column; gap: 12px; color: #444;">`;
    steps.forEach((step, index) => {
        guideHtml += `<div style="display: flex; align-items: flex-start; gap: 10px;">
                        <span style="background: var(--vert); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.85rem; flex-shrink: 0; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">${index + 1}</span>
                        <span style="line-height: 1.4; margin-top: 2px;">${step}</span>
                    </div>`;
    });
    guideHtml += `</div></div>`;

    fields.innerHTML = guideHtml + `
        <div id="allServicesContainer" style="display:flex; flex-direction:column; gap:20px;"></div>
        <div id="crossSellContainer" style="margin-top:25px; padding-top:20px; border-top:2px dashed #e1e8ef; text-align:center;"></div>
    `;

    if (document.getElementById('btnAddCustomRow')) document.getElementById('btnAddCustomRow').style.display = 'flex';
    document.getElementById('interactiveForm').style.display = "block";
    document.getElementById('postSubmitChoice').style.display = "none";
    
    if (document.getElementById('quotePreviewContainer')) document.getElementById('quotePreviewContainer').style.display = 'none';

    let submitText = langKey === 'vi' ? "GỬI YÊU CẦU BÁO GIÁ" : (langKey === 'en' ? "SEND MY QUOTE REQUEST" : "ENVOYER MON DEVIS");
    document.getElementById('btnSubmitForm').innerText = submitText;
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
        let tVitres = langKey === 'vi' ? '🪟 Lau kính' : (langKey === 'en' ? '🪟 Window Cleaning' : '🪟 Vitrerie');
        let lblPrest = langKey === 'vi' ? 'DỊCH VỤ' : (langKey === 'en' ? 'SERVICE' : 'PREST.');
        let lblQte = langKey === 'vi' ? 'SL' : (langKey === 'en' ? 'QTY' : 'QTÉ');
        let lblType = langKey === 'vi' ? 'LOẠI' : (langKey === 'en' ? 'TYPE' : 'TYPE');
        let lblPlan = langKey === 'vi' ? 'LỊCH' : (langKey === 'en' ? 'PLAN' : 'PLAN');
        let ttType = langKey === 'vi' ? 'Trọn gói (Trong/Ngoài) hoặc cụ thể. Ảnh hưởng đến giá.' : (langKey === 'en' ? 'Complete (Int/Ext) or targeted. Affects the price.' : 'Complet (Int/Ext) ou ciblé. Influe sur le prix.');
        let ttPlan = langKey === 'vi' ? 'Xác định tần suất can thiệp.' : (langKey === 'en' ? 'Define the frequency of intervention.' : 'Définissez la fréquence d\'intervention.');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tVitres}</h3>`;
        html += `<div style="display: grid; grid-template-columns: 1fr 45px 75px 75px 25px; gap: 5px; padding: 0 6px; margin-bottom: 8px; align-items: center;">
                    <span style="font-size:0.60rem; font-weight:800; color:var(--bleu); display:flex; align-items:center;">
                        <span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 4px;">1</span>${lblPrest}
                    </span>
                    <span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center; display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 4px;">2</span>${lblQte}
                    </span>
                    <span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center; display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 4px;">3</span>${lblType} <span class="help-bubble">?<span class="tooltip-text">${ttType}</span></span>
                    </span>
                    <span style="font-size:0.60rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 16px; height: 16px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; margin-right: 4px;">4</span>${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span>
                    </span>
                    <span></span>
                </div>`;
        
        const rows = [
            {id:'vit_fen', n: langKey==='vi'?'Cửa sổ':(langKey==='en'?'Windows':'Fenêtres')},
            {id:'vit_baie', n: langKey==='vi'?'Cửa kính lớn':(langKey==='en'?'Sliding Doors':'Baies')},
            {id:'vit_velux', n: langKey==='vi'?'Cửa mái Velux':(langKey==='en'?'Skylights':'Velux')},
            {id:'vit_ver', n: langKey==='vi'?'Nhà kính':(langKey==='en'?'Veranda':'Véranda')},
            {id:'vit_porte', n: langKey==='vi'?'Cửa ra vào kính':(langKey==='en'?'Glass Doors':'Porte-Fenêtre')},
            {id:'vit_com', n: langKey==='vi'?'Tủ kính trưng bày':(langKey==='en'?'Shop Window':'Vitrine')}
        ];
        rows.forEach(r => { html += `<div id="wrapper_${r.id}" style="margin-bottom:8px;">${generateVitrerieRowHtml(r.id, r.n, 0)}</div>`; });
    } else if(service === 'shampouinage') {
        let tTextiles = langKey === 'vi' ? '🛋️ Giặt Vải & Thảm' : (langKey === 'en' ? '🛋️ Textiles & Carpets' : '🛋️ Textiles & Moquettes');
        let lblPrest = langKey === 'vi' ? 'DỊCH VỤ' : (langKey === 'en' ? 'PRESTATION' : 'PRESTATION');
        let lblQte = langKey === 'vi' ? 'SL' : (langKey === 'en' ? 'QTY' : 'QTÉ');
        let lblPlan = langKey === 'vi' ? 'LẬP KẾ HOẠCH' : (langKey === 'en' ? 'PLANNING' : 'PLANIFICATION');
        let ttPlan = langKey === 'vi' ? 'Ngày cụ thể hoặc định kỳ.' : (langKey === 'en' ? 'Specific or recurring date.' : 'Date précise ou récurrente.');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tTextiles}</h3>`;
        html += `<div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;">
                    <span style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">1</span>${lblPrest}
                    </span>
                    <span style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">2</span>${lblQte}
                    </span>
                    <span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">3</span>${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span>
                    </span>
                </div>`;
        
        const rows = [
            {id:'can23', n: langKey==='vi'?'Sô pha 2-3 chỗ':(langKey==='en'?'Sofa 2-3 str':'Canapé 2-3pl')},
            {id:'can45', n: langKey==='vi'?'Sô pha 4-5 chỗ':(langKey==='en'?'Sofa 4-5 str':'Canapé 4-5pl')},
            {id:'canAng', n: langKey==='vi'?'Sô pha góc':(langKey==='en'?'Corner Sofa':'Angle')},
            {id:'tapis', n: langKey==='vi'?'Thảm trang trí':(langKey==='en'?'Rug':'Tapis')},
            {id:'moq', n: langKey==='vi'?'Thảm sàn lớn (m²)':(langKey==='en'?'Carpet (m²)':'Moquette (m²)')}
        ];
        rows.forEach(r => html += generateRowHtml(r.id, r.n));
    } else if(service === 'vehicule') {
        let tVehicule = langKey === 'vi' ? '🚗 Vệ sinh Xe hơi' : (langKey === 'en' ? '🚗 Vehicle Cleaning' : '🚗 Nettoyage Véhicule');
        let lblPrest = langKey === 'vi' ? 'DỊCH VỤ' : (langKey === 'en' ? 'PRESTATION' : 'PRESTATION');
        let lblQte = langKey === 'vi' ? 'SL' : (langKey === 'en' ? 'QTY' : 'QTÉ');
        let lblPlan = langKey === 'vi' ? 'LẬP KẾ HOẠCH' : (langKey === 'en' ? 'PLANNING' : 'PLANIFICATION');
        let ttPlan = langKey === 'vi' ? 'Ngày bạn muốn thực hiện vệ sinh.' : (langKey === 'en' ? 'Date on which you want the cleaning.' : 'Date à laquelle vous souhaitez le nettoyage.');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tVehicule}</h3>`;

        html += `
        <div style="margin-bottom: 15px; background: #eef3f8; padding: 15px; border-radius: 8px; border: 1px solid var(--bleu);">
            <label style="font-size: 0.85rem; font-weight: bold; color: var(--bleu); display: flex; align-items: center; margin-bottom: 10px;">
                <span style="background: var(--vert); color: white; min-width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.8rem; margin-right: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">1</span>
                Gabarits de vos véhicules <span style="color:#e74c3c; margin-left: 4px;">*</span>
            </label>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div class="qty-input-box" style="width: 100%; justify-content: space-between; background: white;">
                    <label style="font-size: 0.8rem;">Standard (Auto, SUV)</label>
                    <input type="number" id="qty_veh_std" min="0" value="0" oninput="handleVehiculeChange('gabarit')" style="width: 60px;">
                </div>
                <div class="qty-input-box" style="width: 100%; justify-content: space-between; background: white;">
                    <label style="font-size: 0.8rem;">Gros Volume (Fourgon)</label>
                    <input type="number" id="qty_veh_large" min="0" value="0" oninput="handleVehiculeChange('gabarit')" style="width: 60px;">
                </div>
                <div class="qty-input-box" style="width: 100%; justify-content: space-between; background: white;">
                    <label style="font-size: 0.8rem;">Poids Lourd (> 3.5t)</label>
                    <input type="number" id="qty_veh_pl" min="0" value="0" oninput="handleVehiculeChange('gabarit')" style="width: 60px;">
                </div>
            </div>

            <p style="font-size: 0.7rem; color: #666; margin-top: 10px; font-style: italic; line-height: 1.3;">
                ℹ️ <strong>Pourquoi cette majoration ?</strong> Les véhicules grand format ou poids lourds nécessitent plus de temps et de produits professionnels. Indiquez la quantité pour chaque type.
            </p>
        </div>
        
        <div id="vehicule_upsell" style="display:none; background: #fff8e1; border-left: 4px solid #ffc107; padding: 12px; margin-bottom: 15px; border-radius: 5px; font-size: 0.8rem; color: #555; animation: fadeInDown 0.3s ease;">
            💡 <strong>Conseil :</strong> Le total de vos éléments séparés est élevé. Prenez le <strong>Pack Complet</strong> pour faire des économies !
        </div>
        `;

        html += `
        <div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;">
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center;">
                <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">2</span>${lblPrest}
            </span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">${lblQte}</span>
            <span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">
                <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">3</span>${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span>
            </span>
        </div>`;
        
        html += generateRowHtml('pack_v', 'Pack Complet').replace('calculatePrice()', "handleVehiculeChange('pack')");
        
        html += `<div style="text-align: center; margin: 15px 0; font-size: 0.8rem; font-weight: bold; color: #888; text-transform: uppercase;">Ou À la carte</div>`;
        
        let ttSiege = ` <span class="help-bubble" style="margin-left:5px;">?<span class="tooltip-text">Inclus : l'assise, le dossier et l'appui-tête.</span></span>`;
        
        let txtTapisAG = langKey === 'vi' ? 'Ghế trước trái' : (langKey === 'en' ? 'Front left seat' : 'Siège avant gauche');
        let txtTapisAD = langKey === 'vi' ? 'Ghế trước phải' : (langKey === 'en' ? 'Front right seat' : 'Siège avant droit');
        let txtBanqAR = langKey === 'vi' ? 'Băng ghế sau' : (langKey === 'en' ? 'Rear bench' : 'Banquette arrière');
        let txtCoffre = langKey === 'vi' ? 'Cốp / Malle' : (langKey === 'en' ? 'Trunk' : 'Coffre / Malle');

        html += generateVehiculeRowHtml('siege_ag', txtTapisAG, true, ttSiege);
        html += generateVehiculeRowHtml('siege_ad', txtTapisAD, true, ttSiege);
        html += generateVehiculeRowHtml('banq_ar', txtBanqAR, true, ttSiege);
        html += generateVehiculeRowHtml('coffre_auto', txtCoffre, false, '');

        let txtSep = langKey === 'vi' ? 'Thảm (nếu không chọn ghế) :' : (langKey === 'en' ? 'Mats alone :' : 'Tapis seuls (si sièges non sélectionnés) :');
        html += `<div style="margin: 15px 0 10px 0; font-size: 0.75rem; font-weight: bold; color: var(--bleu); border-bottom: 1px dashed #ccc; padding-bottom: 5px;">${txtSep}</div>`;
        
        let txtTapAG = langKey === 'vi' ? 'Thảm trước trái' : (langKey === 'en' ? 'Front left mat' : 'Tapis avant gauche');
        let txtTapAD = langKey === 'vi' ? 'Thảm trước phải' : (langKey === 'en' ? 'Front right mat' : 'Tapis avant droit');
        let txtTapARG = langKey === 'vi' ? 'Thảm sau trái' : (langKey === 'en' ? 'Rear left mat' : 'Tapis arrière gauche');
        let txtTapARD = langKey === 'vi' ? 'Thảm sau phải' : (langKey === 'en' ? 'Rear right mat' : 'Tapis arrière droit');
        let txtTapCoffre = langKey === 'vi' ? 'Thảm cốp' : (langKey === 'en' ? 'Trunk mat' : 'Tapis de coffre');

        html += generateVehiculeRowHtml('tapis_ag', txtTapAG, false, '');
        html += generateVehiculeRowHtml('tapis_ad', txtTapAD, false, '');
        html += generateVehiculeRowHtml('tapis_arg', txtTapARG, false, '');
        html += generateVehiculeRowHtml('tapis_ard', txtTapARD, false, '');
        html += generateVehiculeRowHtml('tapis_coffre', txtTapCoffre, false, '');

        let btnAddVehicule = langKey === 'vi' ? '<span>+</span> Thêm xe khác' : (langKey === 'en' ? '<span>+</span> Add another vehicle' : '<span>+</span> Ajouter un autre véhicule');
        html += `<div id="vehiculesSupplementairesContainer"></div>`;
        html += `<button type="button" class="btn-add-row" onclick="addCustomRowVehicule()" style="margin-top: 15px;">${btnAddVehicule}</button>`;

    } else if(service === 'sepulture') {
        let tSepulture = langKey === 'vi' ? '🪦 Bảo trì mộ' : (langKey === 'en' ? '🪦 Grave Maintenance' : '🪦 Entretien Sépultures');
        let lblPrest = langKey === 'vi' ? 'DỊCH VỤ' : (langKey === 'en' ? 'SERVICE' : 'PRESTATION');
        let lblQte = langKey === 'vi' ? 'SL' : (langKey === 'en' ? 'QTY' : 'QTÉ');
        let lblPlan = langKey === 'vi' ? 'LỊCH' : (langKey === 'en' ? 'PLAN' : 'PLANIFICATION');
        let ttPlan = langKey === 'vi' ? 'Ngày cụ thể hoặc định kỳ.' : (langKey === 'en' ? 'Specific or recurring date.' : 'Date précise ou récurrente.');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tSepulture}</h3>`;
        
        html += `
        <div style="background-color: #eef3f8; border-left: 4px solid var(--bleu); padding: 10px 15px; margin-bottom: 15px; border-radius: 5px; font-size: 0.8rem; color: #333;">
            ℹ️ <strong>Le prix comprend :</strong> Le désherbage, le nettoyage complet de la sépulture et des plaques. Le fleurissement est en option.
        </div>
        `;

        html += `<div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;">
                    <span style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">1</span>${lblPrest}
                    </span>
                    <span style="font-size:0.65rem; font-weight:800; color:var(--bleu); display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">2</span>${lblQte}
                    </span>
                    <span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">
                        <span style="background: var(--vert); color: white; min-width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.65rem; margin-right: 5px;">3</span>${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span>
                    </span>
                </div>`;
        
        let txtSpontane = langKey === 'vi' ? 'Can thiệp tự phát :' : (langKey === 'en' ? 'Spontaneous intervention:' : 'Entretien Spontané (interventions ponctuelles) :');
        html += `<div style="margin: 15px 0 10px 0; font-size: 0.85rem; font-weight: 900; color: var(--bleu); border-bottom: 2px solid var(--vert); padding-bottom: 5px; text-transform: uppercase;">${txtSpontane}</div>`;

        const rows = [
            {id:'sep_simple', n: langKey==='vi'?'Mộ đơn':(langKey==='en'?'Single grave':'Sépulture simple')},
            {id:'sep_double', n: langKey==='vi'?'Mộ đôi':(langKey==='en'?'Double grave':'Sépulture double')},
            {id:'sep_caveau', n: langKey==='vi'?'Hầm mộ / Nhà nguyện':(langKey==='en'?'Vault / Chapel':'Caveau / Chapelle')},
            {id:'sep_columbarium', n: langKey==='vi'?'Hộc lưu tro cốt':(langKey==='en'?'Columbarium':'Columbarium')},
            {id:'sep_terre', n: langKey==='vi'?'Mộ đất':(langKey==='en'?'Soil grave':'Tombe pleine terre')}
        ];
        rows.forEach(r => html += generateRowHtml(r.id, r.n));

        let txtOptions = langKey === 'vi' ? 'Tùy chọn bổ sung :' : (langKey === 'en' ? 'Additional options:' : 'Options supplémentaires (personnalisation) :');
        html += `<div style="margin: 20px 0 10px 0; font-size: 0.85rem; font-weight: 900; color: var(--bleu); border-bottom: 2px solid var(--vert); padding-bottom: 5px; text-transform: uppercase;">${txtOptions}</div>`;

        html += generateSepultureFlowerRowHtml('sep_fleurs_art', 'Fleurissement (Fleurs artificielles)', 'artificielles');
        html += generateSepultureFlowerRowHtml('sep_fleurs_vrai', 'Fleurissement (Vraies fleurs)', 'vraies');
        html += generateRowHtml('sep_pots_acc', 'Nettoyage pots et accessoires plaque ect... supp.');

        let txtAbo = langKey === 'vi' ? 'Đăng ký (Giá mỗi tháng) :' : (langKey === 'en' ? 'Subscriptions (Price per month):' : 'Abonnements (contrats réguliers) :');
        html += `<div style="margin: 25px 0 10px 0; font-size: 0.85rem; font-weight: 900; color: var(--bleu); border-bottom: 2px solid var(--vert); padding-bottom: 5px; text-transform: uppercase;">${txtAbo}</div>`;
        
        const abos = [
            {id:'sep_sub_4', n: langKey==='vi'?'4 lần/năm (69 €/tháng)':(langKey==='en'?'4 interventions (69 €/mo)':'Abonnement 4 interventions (69 €/mois)')},
            {id:'sep_sub_6', n: langKey==='vi'?'6 lần/năm (59 €/tháng)':(langKey==='en'?'6 interventions (59 €/mo)':'Abonnement 6 interventions (59 €/mois)')},
            {id:'sep_sub_12', n: langKey==='vi'?'12 lần/năm (89 €/tháng)':(langKey==='en'?'12 interventions (89 €/mo)':'Abonnement 12 interventions (89 €/mois)')},
            {id:'sep_sub_24', n: langKey==='vi'?'24 lần/năm (119 €/tháng)':(langKey==='en'?'24 interventions (119 €/mo)':'Abonnement 24 interventions (119 €/mois)')}
        ];
        abos.forEach(r => html += generateRowHtml(r.id, r.n));

    } else if(service === 'evenements') {
        let tEvt = langKey === 'vi' ? '🎉 Dọn dẹp sau sự kiện' : (langKey === 'en' ? '🎉 Post-Event Cleaning' : '🎉 Remise en État de Salle & Événements');
        let infoTxt = langKey === 'vi' ? '🔒 <strong>Bao gồm:</strong> Kiểm tra hình ảnh trước/sau sự kiện (Bảo vệ tiền đặt cọc) + Dọn dẹp toàn bộ SƠ SỰ KIỆN. Thiết bị, sản phẩm & túi rác được CUNG CẤP. Giấy vệ sinh/xà phòng không bao gồm mặc định.' :
                      (langKey === 'en' ? '🔒 <strong>Included:</strong> Pre/Post event photo inventory (Deposit protection) + Full AFTER-EVENT cleaning. Pro equipment, products & trash bags PROVIDED. Toilet paper/soap not included by default.' :
                      '🔒 <strong>INCLUS D\'OFFICE :</strong><br>• 📸 <strong>États des lieux photo AVANT et APRÈS</strong> (pour vous protéger et garantir votre caution contre tout litige).<br>• 🧹 <strong>Nettoyage complet APRÈS l\'événement</strong> (sols, sanitaires, dégraissage zone traiteur/cuisine).<br>• 🧼 <strong>Matériel & Produits INCLUS :</strong> Sacs poubelles, produits professionnels et matériel pro fournis.<br>• 🧻 <em>Note : Les consommables d\'hygiène (papier toilette, savon, essuie-mains) sont à la charge du client sauf si option souscrite ci-dessous.</em>');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tEvt}</h3>`;
        html += `<div style="background-color: #eef3f8; border-left: 4px solid var(--vert); padding: 12px 15px; margin-bottom: 15px; border-radius: 5px; font-size: 0.8rem; color: #333; line-height: 1.5;">${infoTxt}</div>`;

        let txtCatSalle = langKey === 'vi' ? '1. Quy mô phòng (Đã bao gồm Dọn dẹp SAU sự kiện) *' : (langKey === 'en' ? '1. Hall Size (AFTER Cleaning Included) *' : '1. Taille de la salle (Nettoyage APRÈS inclus) *');
        let txtPetite = langKey === 'vi' ? 'Phòng < 100 m² (Sinh nhật, Lễ rửa tội, Cousinade)' : (langKey === 'en' ? 'Hall < 100 m² (Birthday, Baptism, Family reunion)' : 'Salle < 100 m² (Anniversaire, Baptême, Cousinade)');
        let txtGrande = langKey === 'vi' ? 'Phòng lớn / Khu nghỉ dưỡng > 100 m² (Đám cưới, Bữa ăn công ty)' : (langKey === 'en' ? 'Large Hall / Estate > 100 m² (Wedding, Corporate meal)' : 'Grande Salle / Domaine > 100 m² (Mariage, Repas pro)');

        html += `<div style="font-size:0.85rem; font-weight:900; color:var(--bleu); margin-bottom:10px; text-transform:uppercase;">${txtCatSalle}</div>`;
        html += generateRowHtml('evt_salle_petite', txtPetite);
        html += generateRowHtml('evt_salle_grande', txtGrande);

        let txtCatOptions = langKey === 'vi' ? '2. Tùy chọn bổ sung' : (langKey === 'en' ? '2. Additional Options' : '2. Options Supplémentaires');
        let txtAvant = langKey === 'vi' ? 'Tùy chọn Dọn dẹp & Chuẩn bị TRƯỚC sự kiện (70 €)' : (langKey === 'en' ? 'Cleaning & Preparation BEFORE event option (€70)' : 'Option Nettoyage & Préparation AVANT l\'événement (70 €)');
        let txtConsommablesOpt = langKey === 'vi' ? 'Option Cung cấp vật tư tiêu hao (Giấy vệ sinh, xà phòng, khăn lau tay)' : (langKey === 'en' ? 'Hygiene consumables supply option (Toilet paper, soap, paper towels)' : 'Option Fourniture des consommables hygiène (Papier toilette, savon, essuie-mains)');
        let txtPendantTitle = langKey === 'vi' ? 'Tùy chọn Có mặt & Dọn dẹp TRONG KHI diễn ra sự kiện' : (langKey === 'en' ? 'Presence & Cleaning DURING the event option' : 'Option Présence & Nettoyage PENDANT l\'événement');
        let txtExt = langKey === 'vi' ? 'Vệ sinh sân thượng & ngoài trời (70 €)' : (langKey === 'en' ? 'Terrace & outdoor cleaning (€70)' : 'Nettoyage terrasse & extérieurs (70 €)');
        let txtPoubelles = langKey === 'vi' ? 'Quản lý & vận chuyển rác thải (70 €)' : (langKey === 'en' ? 'Waste management & disposal (€70)' : 'Gestion & évacuation des déchets (70 €)');

        html += `<div style="font-size:0.85rem; font-weight:900; color:var(--bleu); margin:15px 0 10px 0; text-transform:uppercase; border-top:1px dashed #ccc; padding-top:10px;">${txtCatOptions}</div>`;
        
        // Option Avant (Checkbox + message 2h)
        html += `
        <div class="quote-row-item" style="display:flex; flex-direction:column; align-items:flex-start; gap:6px; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu); cursor:pointer;" for="cb_evt_nettoyage_avant">${txtAvant}</label>
                <input type="checkbox" id="cb_evt_nettoyage_avant" onchange="calculatePrice()" style="width:20px; height:20px; cursor:pointer;">
            </div>
            <p style="font-size:0.7rem; color:#e67e22; margin:0; font-weight:bold;">
                ⚠️ Espace dégagé requis au minimum 2h avant le début de l'événement.
            </p>
        </div>
        `;

        // Consommables
        html += `
        <div class="quote-row-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu);">🧻 Fourniture (Papier toilette, savon mains, essuie-mains)</label>
            <select id="cons_select_evt" onchange="calculatePrice()" style="padding:6px; border-radius:5px; border:1px solid #ccc; font-weight:bold; color:var(--bleu);">
                <option value="client">À votre charge</option>
                <option value="osp">Fournis par O.S.P+ (+29 €)</option>
            </select>
        </div>
        `;

        // Option Pendant (Saisie Heure Début + Heure Fin avec décomposition dynamique Jour/Nuit)
        html += `
        <div class="quote-row-item" id="row_evt_pendant_box" style="display:flex; flex-direction:column; align-items:flex-start; gap:10px; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu);">${txtPendantTitle}</label>
            
            <div style="background:#eef3f8; padding:8px 12px; border-radius:6px; font-size:0.7rem; color:#444; width:100%; border-left:3px solid var(--bleu); box-sizing:border-box;">
                📌 <strong>Barème d'intervention :</strong><br>
                • ☀️ <strong>JOUR (06h00 - 21h00) :</strong> 25 €/h<br>
                • 🌙 <strong>NUIT (21h00 - 06h00) :</strong> 30 €/h (+20% majoré)
            </div>

            <div style="display:flex; gap:10px; align-items:center; width:100%; flex-wrap:wrap;">
                <div style="flex:1; min-width:120px;">
                    <label style="font-size:0.7rem; color:#666; font-weight:bold;">Heure de début :</label>
                    <input type="time" id="evt_start_time" onchange="updateEvtPendantCalculations()" style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; font-size:0.8rem;">
                </div>
                <div style="flex:1; min-width:120px;">
                    <label style="font-size:0.7rem; color:#666; font-weight:bold;">Heure de fin :</label>
                    <input type="time" id="evt_end_time" onchange="updateEvtPendantCalculations()" style="width:100%; padding:6px; border-radius:4px; border:1px solid #ccc; font-size:0.8rem;">
                </div>
            </div>

            <!-- Encadré résultat dynamique -->
            <div id="evt_pendant_result_box" style="display:none; background:#fff8e1; border:1px solid #ffc107; padding:10px 12px; border-radius:6px; font-size:0.75rem; color:#d35400; width:100%; box-sizing:border-box; line-height:1.4;"></div>

            <p style="font-size:0.7rem; color:#666; margin:0; font-style:italic;">
                ℹ️ Maintien de propreté (sanitaires, poubelles, verres) pendant votre soirée. ⚠️ <em>En cas de dépassement sur place, toute heure commencée supplémentaire sera facturée 12 €.</em>
            </p>
        </div>
        `;

        // Option Terrasse (Checkbox)
        html += `
        <div class="quote-row-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu); cursor:pointer;" for="cb_evt_ext_terrasse">${txtExt}</label>
            <input type="checkbox" id="cb_evt_ext_terrasse" onchange="calculatePrice()" style="width:20px; height:20px; cursor:pointer;">
        </div>
        `;

        // Option Poubelles (Checkbox)
        html += `
        <div class="quote-row-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu); cursor:pointer;" for="cb_evt_poubelles">${txtPoubelles}</label>
            <input type="checkbox" id="cb_evt_poubelles" onchange="calculatePrice()" style="width:20px; height:20px; cursor:pointer;">
        </div>
        `;

    } else if(service === 'chantier') {
        let tChantier = langKey === 'vi' ? '🚧 Dọn dẹp sau xây dựng' : (langKey === 'en' ? '🚧 Post-Construction Cleaning' : '🚧 Nettoyage Fin de Chantier');
        
        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tChantier}</h3>`;
        
        html += `<div style="background-color: #eef3f8; border-left: 4px solid var(--vert); padding: 12px 15px; margin-bottom: 15px; border-radius: 5px; font-size: 0.8rem; color: #333; line-height: 1.5;">
            ℹ️ <strong>Inclus :</strong> Dépoussiérage approfondi (murs, plafonds, plinthes), grattage des traces (peinture, ciment, colle), lessivage des sols et désinfection.<br>⚠️ <em>La vitrerie doit être ajoutée séparément via le module Vitrerie.</em>
        </div>`;

        let txtM2 = langKey === 'vi' ? 'Tổng diện tích cần làm sạch (m²)' : (langKey === 'en' ? 'Total surface to clean (m²)' : 'Surface totale à nettoyer (en m²) *');
        html += generateRowHtml('chantier_m2', txtM2);

        let txtType = langKey === 'vi' ? 'Loại công trường' : (langKey === 'en' ? 'Type of construction site' : 'Type de chantier *');
        html += `
        <div class="quote-row-item" style="display:flex; flex-direction:column; align-items:flex-start; gap:8px; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu);">${txtType}</label>
            <select id="type_chantier" onchange="calculatePrice()" style="width:100%; box-sizing:border-box; padding:8px; border-radius:5px; border:1px solid #ccc; font-weight:bold; color:var(--bleu); font-size:0.8rem;">
                <option value="leger">Léger (Rénovation, peinture) - 3.50€/m²</option>
                <option value="moyen" selected>Moyen (Gros œuvre partiel) - 5.00€/m²</option>
                <option value="lourd">Lourd (Gravats, forte poussière) - 7.50€/m²</option>
            </select>
        </div>`;

        let txtMono = langKey === 'vi' ? 'Rửa sàn bằng máy cơ giới (+2€/m²)' : (langKey === 'en' ? 'Mechanical floor washing (+2€/m²)' : 'Lavage mécanique des sols (Monobrosse) +2€/m²');
        html += `
        <div class="quote-row-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu); cursor:pointer;" for="cb_chantier_monobrosse">${txtMono}</label>
            <input type="checkbox" id="cb_chantier_monobrosse" onchange="calculatePrice()" style="width:20px; height:20px; cursor:pointer;">
        </div>`;
        
        let txtDechets = langKey === 'vi' ? 'Thu gom rác thải nhẹ (80€)' : (langKey === 'en' ? 'Light debris removal (80€)' : 'Évacuation de gravats / déchets légers (Forfait 80€)');
        html += `
        <div class="quote-row-item" style="display:flex; justify-content:space-between; align-items:center; background:var(--gris); padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #e1e8ef;">
            <label style="font-size:0.8rem; font-weight:bold; color:var(--bleu); cursor:pointer;" for="cb_chantier_dechets">${txtDechets}</label>
            <input type="checkbox" id="cb_chantier_dechets" onchange="calculatePrice()" style="width:20px; height:20px; cursor:pointer;">
        </div>`;
    } else if(service === 'bureaux') {
        let tBureaux = langKey === 'vi' ? '🏢 Văn phòng & Cơ sở' : (langKey === 'en' ? '🏢 Offices & Premises' : '🏢 Bureaux & Locaux');
        let pText = langKey === 'vi' ? '<strong>Cấu trúc không gian của bạn:</strong> Chọn một tầng, sau đó thêm các phòng. <span class="help-bubble">?<span class="tooltip-text">Bước này giúp chúng tôi hiểu rõ sơ đồ bố trí chính xác cơ sở của bạn.</span></span>' : (langKey === 'en' ? '<strong>Structure your spaces:</strong> Choose a level, then add the rooms. <span class="help-bubble">?<span class="tooltip-text">This step allows us to understand the exact layout of your premises.</span></span>' : '<strong>Structurez vos espaces :</strong> Choisissez un niveau, puis ajoutez les pièces. <span class="help-bubble">?<span class="tooltip-text">Cette étape nous permet de comprendre l\'agencement exact de vos locaux.</span></span>');
        
        pText = `<span style="background: var(--vert); color: white; min-width: 20px; height: 20px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; margin-right: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">1</span>` + pText;
        
        let btnAddLevel = langKey === 'vi' ? '<span>+</span> Thêm tầng hoặc khu vực ngoại cảnh' : (langKey === 'en' ? '<span>+</span> Add a level or outdoor area' : '<span>+</span> Ajouter un niveau ou espace extérieur');
        let searchPlaceholder = langKey === 'vi' ? '🔍 Tìm kiếm một phòng (Ví dụ: Nhà vệ sinh, Tầng 3...)' : (langKey === 'en' ? '🔍 Search for a room (Ex: Toilet, Floor 3...)' : '🔍 Rechercher une pièce (ex: Toilette, Bureau, Étage 3...)');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tBureaux}</h3>`;
        html += `<p style="font-size:0.85rem; color:var(--bleu); margin-bottom:15px; background:#eef3f8; padding:10px; border-radius:8px; border-left:4px solid var(--bleu); display:flex; align-items:center;">${pText}</p>`;
        
        html += `<div id="searchContainer" style="margin-bottom: 15px;">
            <input type="text" id="roomSearchInput" placeholder="${searchPlaceholder}" style="width: 100%; padding: 12px; border-radius: 8px; border: 2px solid #e1e8ef; font-size: 0.9rem; outline: none; transition: 0.3s;" onfocus="this.style.borderColor='var(--vert)'" onblur="this.style.borderColor='#e1e8ef'" oninput="filterRooms()">
            <div id="searchCreateBtnContainer" style="margin-top:10px; display:none; text-align:center;"></div>
        </div>`;

        html += `<div id="levelsContainer"></div><button type="button" class="btn-add-row" onclick="openLevelModal()" style="margin-top: 15px;">${btnAddLevel}</button>`;
    }
    
    html += `</div>`;
    container.insertAdjacentHTML('beforeend', html);

    if(service === 'bureaux') {
        if (langKey === 'vi') {
            createLevelAccordion('Bãi đậu xe'); createLevelAccordion('Tầng lửng'); createLevelAccordion('Tầng trệt (RDC)');
            createLevelAccordion('Tầng 1'); createLevelAccordion('Tầng 2'); createLevelAccordion('Tầng 3'); createLevelAccordion('Tầng 4');
        } else if (langKey === 'en') {
            createLevelAccordion('Parking Lot'); createLevelAccordion('Mezzanine'); createLevelAccordion('Ground Floor (RDC)');
            createLevelAccordion('Floor 1'); createLevelAccordion('Floor 2'); createLevelAccordion('Floor 3'); createLevelAccordion('Floor 4');
        } else {
            createLevelAccordion('Parking'); createLevelAccordion('Entresol'); createLevelAccordion('Rez-de-chaussée (RDC)');
            createLevelAccordion('Étage 1'); createLevelAccordion('Étage 2'); createLevelAccordion('Étage 3'); createLevelAccordion('Étage 4');
        }
    }

    updateCrossSellButtons(); 
    calculatePrice();
    toggleCompanyField(); 
    const newBlock = document.getElementById('block_' + service);
    if(newBlock) newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCrossSellButtons() {
    const csContainer = document.getElementById('crossSellContainer');
    
    const availableServices = [ 
    { id: 'vitrerie', name_fr: '🪟 Vitrerie', name_en: '🪟 Windows', name_vi: '🪟 Lau kính' }, 
    { id: 'shampouinage', name_fr: '🛋️ Textiles', name_en: '🛋️ Textiles', name_vi: '🛋️ Giặt vải' }, 
    { id: 'vehicule', name_fr: '🚗 Véhicule', name_en: '🚗 Vehicle', name_vi: '🚗 Xe hơi' }, 
    { id: 'bureaux', name_fr: '🏢 Locaux', name_en: '🏢 Offices', name_vi: '🏢 Văn phòng' },
    { id: 'sepulture', name_fr: '🪦 Sépultures', name_en: '🪦 Graves', name_vi: '🪦 Mộ' },
    { id: 'evenements', name_fr: '🎉 Salle/Fêtes', name_en: '🎉 Events', name_vi: '🎉 Sự kiện' },
    { id: 'chantier', name_fr: '🚧 Fin Chantier', name_en: '🚧 Post-build', name_vi: '🚧 Sau xây dựng' } 
];
    
    let missingServices = availableServices.filter(s => !activeServices.includes(s.id));

    if (missingServices.length === 0) { csContainer.style.display = 'none'; return; }

    csContainer.style.display = 'block';
    let csText = langKey === 'vi' ? "💡 Bạn có thể kết hợp dịch vụ này với :" : (langKey === 'en' ? "💡 You can combine this service with:" : "💡 Vous pouvez cumuler cette prestation avec :");
    
    let html = `<p style="font-size:0.85rem; font-weight:800; color:var(--vert); margin-bottom:15px;">${csText}</p><div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">`;
    missingServices.forEach(s => { 
        let localizedName = langKey === 'vi' ? s.name_vi : (langKey === 'en' ? s.name_en : s.name_fr);
        let btnText = langKey === 'vi' ? `+ Thêm ${localizedName}` : (langKey === 'en' ? `+ Add ${localizedName}` : `+ Ajouter ${localizedName}`);
        html += `<button type="button" class="btn-cross-sell" onclick="addServiceToQuote('${s.id}')">${btnText}</button>`; 
    });
    html += `</div>`;
    csContainer.innerHTML = html;
}

function addCustomRow() {
    if (customVisibleCount >= 2) return; 
    customVisibleCount++; customIndexCount++;
    const id = 'custom_' + customIndexCount;
    planData[id] = { days: [], months: [], start:'', end:'', comment:'' };
    
    let placeholderText = langKey === 'vi' ? "Mô tả yêu cầu..." : (langKey === 'en' ? "Description of your request..." : "Description de la demande...");
    let btnPlanText = langKey === 'vi' ? "+ Lập kế hoạch" : (langKey === 'en' ? "+ Schedule" : "+ Planifier");
    let btnDeleteTitle = langKey === 'vi' ? "Xóa yêu cầu này" : (langKey === 'en' ? "Delete this request" : "Supprimer cette demande");
    let specificRequestTitle = langKey === 'vi' ? "Yêu cầu cụ thể" : (langKey === 'en' ? "Specific request" : "Demande spécifique");

    const html = `
    <div class="quote-row-item custom-row" id="row_${id}" style="display: flex; flex-direction: column; gap: 10px; border: 1px dashed var(--vert); background: #eef3f8; padding: 12px; border-radius: 8px; margin-top: 15px;">
        <textarea id="name_${id}" placeholder="${placeholderText}" style="width:100%; text-align:left; padding:10px; font-size:0.85rem; border: 1px solid #ccc; border-radius: 5px; resize: vertical; min-height: 80px; font-family: inherit; box-sizing: border-box;"></textarea>
        <div style="display: grid; grid-template-columns: 60px 1fr 30px; gap: 10px; align-items: center;">
            <input type="number" id="qty_${id}" min="0" value="1" oninput="calculatePrice()" style="padding: 8px; width: 100%; box-sizing: border-box;">
            <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${specificRequestTitle}')" style="padding: 8px; height: 100%;">${btnPlanText}</button>
            <button type="button" class="btn-delete-row" onclick="removeRow('${id}')" title="${btnDeleteTitle}" style="margin: 0; width: 100%; height: 100%; border-radius: 5px;">×</button>
        </div>
    </div>`;
    document.getElementById('customRowsContainer').insertAdjacentHTML('beforeend', html);
    if (customVisibleCount >= 2) document.getElementById('btnAddCustomRow').style.display = 'flex';
}

function removeRow(id) {
    const row = document.getElementById('row_' + id);
    if (row) row.remove();
    if (planData[id]) delete planData[id];
    customVisibleCount--;
    if (customVisibleCount < 2) document.getElementById('btnAddCustomRow').style.display = 'flex';
    calculatePrice();
    updateLevelSummaries();
}

window.addCustomRowVehicule = function() {
    customIndexCount++;
    const id = 'custom_' + customIndexCount; 
    planData[id] = { days: [], months: [], start:'', end:'', comment:'' };
    
    let placeholderText = langKey === 'vi' ? "Ví dụ: Xe tải nhỏ, Xe buýt (ghi rõ yêu cầu)..." : (langKey === 'en' ? "Ex: Utility vehicle, Tractor (specify needs)..." : "Ex: Véhicule utilitaire supplémentaire, Moto (précisez marque, modèle et vos besoins)...");
    let btnPlanText = langKey === 'vi' ? "+ Lập kế hoạch" : (langKey === 'en' ? "+ Schedule" : "+ Planifier");
    let specificRequestTitle = langKey === 'vi' ? "Xe khác" : (langKey === 'en' ? "Other vehicle" : "Autre véhicule");

    const html = `
    <div class="quote-row-item custom-row" id="row_${id}" style="display: flex; flex-direction: column; gap: 10px; border: 1px dashed var(--vert); background: #eef3f8; padding: 12px; border-radius: 8px; margin-top: 15px; animation: fadeInDown 0.3s ease;">
        <label style="color:var(--bleu); font-weight:bold; font-size:0.9rem;">${specificRequestTitle}</label>
        <textarea id="name_${id}" placeholder="${placeholderText}" style="width:100%; text-align:left; padding:10px; font-size:0.85rem; border: 1px solid #ccc; border-radius: 5px; resize: vertical; min-height: 60px; font-family: inherit; box-sizing: border-box;"></textarea>
        <div style="display: grid; grid-template-columns: 60px 1fr 30px; gap: 10px; align-items: center;">
            <input type="number" id="qty_${id}" min="0" value="1" oninput="calculatePrice()" style="padding: 8px; width: 100%; box-sizing: border-box;">
            <button type="button" id="btn_plan_${id}" class="btn-planifier" onclick="openPlanningModal('${id}', '${specificRequestTitle}')" style="padding: 8px; height: 100%;">${btnPlanText}</button>
            <button type="button" class="btn-delete-row" onclick="removeRow('${id}')" title="Supprimer ce véhicule" style="margin: 0; width: 100%; height: 100%; border-radius: 5px;">×</button>
        </div>
    </div>`;
    
    document.getElementById('vehiculesSupplementairesContainer').insertAdjacentHTML('beforeend', html);
};

let pendingGooglePayload = null;
let pendingEmailParams = null;
let pendingClientCodeAlert = null;

async function submitInteractiveForm() {
    try {
        const form = document.getElementById('interactiveForm');
        if (form.checkValidity()) {

            if (activeServices.includes('vitrerie')) {
                let totalVitres = 0;
                let vitresInputs = document.querySelectorAll('input[id^="qty_vit_"]');
                vitresInputs.forEach(input => totalVitres += (parseInt(input.value) || 0));
                if (totalVitres === 0) {
                    vitresInputs.forEach(input => {
                        input.style.border = "2px solid #e74c3c";
                        input.style.backgroundColor = "#fadbd8";
                    });
                    if(vitresInputs.length > 0) {
                        vitresInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setTimeout(() => vitresInputs[0].focus(), 500);
                    }
                    return;
                } else {
                    vitresInputs.forEach(input => {
                        input.style.border = "1px solid #ccc";
                        input.style.backgroundColor = "white";
                    });
                }
            }

            if (activeServices.includes('shampouinage')) {
                let totalShamp = 0;
                let ids = ['qty_can23', 'qty_can45', 'qty_canAng', 'qty_tapis', 'qty_moq'];
                let shampInputs = [];
                ids.forEach(id => {
                    let el = document.getElementById(id);
                    if (el) { shampInputs.push(el); totalShamp += (parseFloat(el.value) || 0); }
                });
                if (totalShamp === 0 && shampInputs.length > 0) {
                    shampInputs.forEach(input => {
                        input.style.border = "2px solid #e74c3c";
                        input.style.backgroundColor = "#fadbd8";
                    });
                    shampInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => shampInputs[0].focus(), 500);
                    return;
                } else {
                    shampInputs.forEach(input => {
                        input.style.border = "1px solid #ccc";
                        input.style.backgroundColor = "white";
                    });
                }
            }

            if (activeServices.includes('vehicule')) {
                let vehIds = ['qty_pack_v', 'qty_siege_ag', 'qty_siege_ad', 'qty_banq_ar', 'qty_coffre_auto', 'qty_tapis_ag', 'qty_tapis_ad', 'qty_tapis_arg', 'qty_tapis_ard', 'qty_tapis_coffre'];
                let totalVehItems = 0;
                let vehInputs = [];
                
                vehIds.forEach(id => {
                    let el = document.getElementById(id);
                    if (el) { vehInputs.push(el); totalVehItems += (parseInt(el.value) || 0); }
                });
                
                ['cb_tapis_siege_ag', 'cb_tapis_siege_ad', 'cb_tapis_banq_ar'].forEach(id => {
                    if (document.getElementById(id)?.checked) totalVehItems++;
                });

                let qStd = parseInt(document.getElementById('qty_veh_std')?.value) || 0;
                let qLarge = parseInt(document.getElementById('qty_veh_large')?.value) || 0;
                let qPl = parseInt(document.getElementById('qty_veh_pl')?.value) || 0;
                let totalGabarits = qStd + qLarge + qPl;

                if (totalVehItems > 0 && totalGabarits === 0) {
                    ['qty_veh_std', 'qty_veh_large', 'qty_veh_pl'].forEach(id => {
                        let el = document.getElementById(id);
                        if(el) { el.style.border = "2px solid #e74c3c"; el.style.backgroundColor = "#fadbd8"; }
                    });
                    document.getElementById('qty_veh_std')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                } else {
                    ['qty_veh_std', 'qty_veh_large', 'qty_veh_pl'].forEach(id => {
                        let el = document.getElementById(id);
                        if(el) { el.style.border = "1px solid #ccc"; el.style.backgroundColor = "white"; }
                    });
                }

                if (totalVehItems === 0) {
                    vehInputs.forEach(input => {
                        input.style.border = "2px solid #e74c3c";
                        input.style.backgroundColor = "#fadbd8";
                    });
                    vehInputs[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                } else {
                    vehInputs.forEach(input => {
                        input.style.border = "1px solid #ccc";
                        input.style.backgroundColor = "white";
                    });
                }
            }

            if (activeServices.includes('sepulture')) {
                let totalSep = 0;
                let ids = ['qty_sep_simple', 'qty_sep_double', 'qty_sep_caveau', 'qty_sep_columbarium', 'qty_sep_terre', 'qty_sep_fleurs_art', 'qty_sep_fleurs_vrai', 'qty_sep_pots_acc', 'qty_sep_sub_4', 'qty_sep_sub_6', 'qty_sep_sub_12', 'qty_sep_sub_24'];
                let sepInputs = [];
                ids.forEach(id => {
                    let el = document.getElementById(id);
                    if (el) { sepInputs.push(el); totalSep += (parseFloat(el.value) || 0); }
                });
                if (totalSep === 0 && sepInputs.length > 0) {
                    sepInputs.forEach(input => {
                        input.style.border = "2px solid #e74c3c";
                        input.style.backgroundColor = "#fadbd8";
                    });
                    sepInputs[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => sepInputs[0].focus(), 500);
                    return;
                } else {
                    sepInputs.forEach(input => {
                        input.style.border = "1px solid #ccc";
                        input.style.backgroundColor = "white";
                    });
                }
            }

            if (activeServices.includes('evenements')) {
                let totalEvt = 0;
                let qPetite = parseInt(document.getElementById('qty_evt_salle_petite')?.value) || 0;
                let qGrande = parseInt(document.getElementById('qty_evt_salle_grande')?.value) || 0;
                let cbAvant = document.getElementById('cb_evt_nettoyage_avant')?.checked;
                let cbTerrasse = document.getElementById('cb_evt_ext_terrasse')?.checked;
                let cbPoubelles = document.getElementById('cb_evt_poubelles')?.checked;
                let consEvt = document.getElementById('cons_select_evt')?.value === 'osp';
                let pendantCost = window.evtPendantData ? window.evtPendantData.totalCost : 0;

                totalEvt = qPetite + qGrande + (cbAvant?1:0) + (cbTerrasse?1:0) + (cbPoubelles?1:0) + (consEvt?1:0) + pendantCost;

                if (totalEvt === 0) {
                    let pInput = document.getElementById('qty_evt_salle_petite');
                    if (pInput) {
                        pInput.style.border = "2px solid #e74c3c";
                        pInput.style.backgroundColor = "#fadbd8";
                        pInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    return;
                } else {
                    let pInput = document.getElementById('qty_evt_salle_petite');
                    if(pInput) {
                        pInput.style.border = "1px solid #ccc";
                        pInput.style.backgroundColor = "white";
                    }
                }
            }

            // ---> VÉRIFICATION M² CHANTIER AJOUTÉE ICI <---
            if (activeServices.includes('chantier')) {
                let inputM2 = document.getElementById('qty_chantier_m2');
                if (inputM2 && (parseInt(inputM2.value) || 0) === 0) {
                    inputM2.style.border = "2px solid #e74c3c";
                    inputM2.style.backgroundColor = "#fadbd8";
                    inputM2.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                } else if (inputM2) {
                    inputM2.style.border = "1px solid #ccc";
                    inputM2.style.backgroundColor = "white";
                }
            }

            let missingQty = false;
            let firstMissingQtyElement = null;

            document.querySelectorAll('.structured-room-card').forEach(card => {
                let isSanitaire = card.querySelector('input[id^="qty_h_"]');
                let isBureau = card.querySelector('input[id^="qty_tot_"]');
                let isRestauration = card.querySelector('input[id^="qty_tables_"]');

                if (isSanitaire) {
                    let h = card.querySelector('input[id^="qty_h_"]');
                    let f = card.querySelector('input[id^="qty_f_"]');
                    let m = card.querySelector('input[id^="qty_m_"]');
                    let total = (parseInt(h.value)||0) + (parseInt(f.value)||0) + (parseInt(m.value)||0);
                    if (total === 0) {
                        missingQty = true;
                        [h, f, m].forEach(i => { if(i){ i.style.border = "2px solid #e74c3c"; i.style.backgroundColor = "#fadbd8"; }});
                        if (!firstMissingQtyElement) firstMissingQtyElement = h;
                    } else {
                        [h, f, m].forEach(i => { if(i){ i.style.border = "1px solid #ccc"; i.style.backgroundColor = "white"; }});
                    }
                } else if (isBureau) {
                    let tot = card.querySelector('input[id^="qty_tot_"]');
                    let occ = card.querySelector('input[id^="qty_occ_"]');
                    if ((parseInt(occ.value)||0) === 0) {
                        missingQty = true;
                        if(occ) { occ.style.border = "2px solid #e74c3c"; occ.style.backgroundColor = "#fadbd8"; }
                        if (!firstMissingQtyElement) firstMissingQtyElement = occ;
                    } else {
                        if(occ) { occ.style.border = "1px solid #ccc"; occ.style.backgroundColor = "white"; }
                    }
                } else if (isRestauration) {
                    let esp = card.querySelector('input[id^="qty_room_detail_"]');
                    if (esp && (parseInt(esp.value)||0) === 0) {
                        missingQty = true;
                        esp.style.border = "2px solid #e74c3c"; esp.style.backgroundColor = "#fadbd8";
                        if (!firstMissingQtyElement) firstMissingQtyElement = esp;
                    } else if (esp) {
                        esp.style.border = "1px solid #ccc"; esp.style.backgroundColor = "white";
                    }
                } else {
                    let input = card.querySelector('input[type="number"][id^="qty_"]');
                    if (input && (parseInt(input.value)||0) === 0) {
                        missingQty = true;
                        input.style.border = "2px solid #e74c3c"; input.style.backgroundColor = "#fadbd8";
                        if (!firstMissingQtyElement) firstMissingQtyElement = input;
                    } else if (input) {
                        input.style.border = "1px solid #ccc"; input.style.backgroundColor = "white";
                    }
                }
            });

            if (missingQty) {
                if(firstMissingQtyElement) {
                    firstMissingQtyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => firstMissingQtyElement.focus(), 500);
                }
                return;
            }

            let missingSol = false;
            let firstMissingElement = null;

            document.querySelectorAll('select[id^="sol_"]').forEach(select => {
                if (select.value === "non_precise") {
                    missingSol = true;
                    select.style.border = "2px solid #e74c3c"; 
                    select.style.backgroundColor = "#fadbd8"; 
                    
                    if (!firstMissingElement) {
                        firstMissingElement = select; 
                    }
                } else {
                    select.style.border = "1px solid #ccc";
                    select.style.backgroundColor = "transparent";
                }
            });

            if (missingSol) {
                firstMissingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => firstMissingElement.focus(), 500);
                return; 
            }

            let elAmountText = document.getElementById('estimatedAmount').innerText.split('\n');
            let prixFinalAEnvoyer = elAmountText[elAmountText.length - 1]; 
            let majorationAppliquee = false;
            
            if (window.currentTotalValue > 0 && window.currentTotalValue < 35) {
                let messageAlerte = "";
                if (langKey === 'vi') {
                    messageAlerte = "⚠️ Ước tính chi tiết của bạn là " + window.currentTotalValue.toFixed(2) + " €.<br><br>Tuy nhiên, các dịch vụ của chúng tôi áp dụng mức tối thiểu hóa đơn là 35,00 € (để chi trả chi phí di chuyển và thiết bị).<br><br>💡 MẸO: Bạn có thể hủy và thêm các dịch vụ khác (Lau kính, Sô pha...) để đạt mốc 35 € này và tối ưu hóa chi phí bưu giá!<br><br>Bạn có muốn gửi yêu cầu với mức giá trọn gói tối thiểu là 35,00 € không?";
                } else if (langKey === 'en') {
                    messageAlerte = "⚠️ Your detailed estimate is " + window.currentTotalValue.toFixed(2) + " €.<br><br>However, our interventions are subject to a minimum billing of 35.00 € (to cover travel and equipment expenses).<br><br>💡 TIP: You can cancel and add other services (Windows, Sofas...) to reach this 35 € mark and get full value!<br><br>Do you still want to send the request at the flat rate of 35.00 €?";
                } else {
                    messageAlerte = "⚠️ Votre estimation détaillée s'élève à " + window.currentTotalValue.toFixed(2) + " €.<br><br>Cependant, nos interventions sont soumises à un minimum de facturation de 35,00 € (pour couvrir le déplacement et le matériel).<br><br>💡 ASTUCE : Vous pouvez annuler et ajouter d'autres prestations (Vitres, Canapés...) pour atteindre ces 35 € et rentabiliser votre devis !<br><br>Voulez-vous quand même envoyer la demande au prix forfaitaire de 35,00 € ?";
                }
                
                let clientAccepte = await askCustomQuestion("⚠️ Minimum de facturation", messageAlerte, [
                    { text: langKey==='en'?"Yes, apply flat rate (35€)":"Oui, appliquer le forfait (35€)", value: true, style: "background: var(--vert); color: white;" },
                    { text: langKey==='en'?"No, add options":"Non, ajouter des options", value: false, style: "background: #e1e8ef; color: var(--bleu);" }
                ]);

                if (!clientAccepte) return;
                majorationAppliquee = true;
                prixFinalAEnvoyer = langKey === 'vi' ? "35.00 € (Áp dụng mức tối thiểu trọn gói)" : (langKey === 'en' ? "35.00 € (Minimum flat rate applied)" : "35.00 € (Forfait minimum appliqué)");
            }

            let statut = "";
            const radios = document.getElementsByName('statut');
            for (let i = 0; i < radios.length; i++) { if (radios[i].checked) { statut = radios[i].value; break; } }

            function getPlanningRecap(data) {
                if (!data || (data.days.length === 0 && data.months.length === 0 && !data.start && !data.end && (!data.comment || data.comment.trim() === ''))) return "Détails de planification à voir ensemble";
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
            if (statut === "Entreprise") {
                recap += `🏢 STRUCTURE : ${document.getElementById('nomEntreprise').value}\n`;
                if (activeServices.includes('bureaux')) {
                    let eff = document.getElementById('nbEmployes')?.value || "Non précisé";
                    recap += `👥 EFFECTIF : ${eff} collaborateur(s) sur site\n\n`;
                } else {
                    recap += `\n`;
                }
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
                    recap += `  - ${label} : ${q} (Nettoyage : ${typeVitrage})\n    Planning : ${getPlanningRecap(planData[idFull])}\n`;
                }
            });
            if (aDesVitres) recap += "\n";

            let aDesTextiles = false;
            const fixesIds = { 
                'can23': 'Canapé 2-3 places', 'can45': 'Canapé 4-5 places', 'canAng': 'Canapé d\'angle', 
                'tapis': 'Tapis de salon', 'moq': 'Moquette (m²)', 
                'pack_v': 'Pack Véhicule Complet', 
                'siege_ag': 'Siège avant gauche', 
                'siege_ad': 'Siège avant droit', 
                'banq_ar': 'Banquette arrière', 
                'coffre_auto': 'Coffre / Malle',
                'tapis_ag': 'Tapis avant gauche',
                'tapis_ad': 'Tapis avant droit',
                'tapis_arg': 'Tapis arrière gauche',
                'tapis_ard': 'Tapis arrière droit',
                'tapis_coffre': 'Tapis de coffre'
            };

            for (let id in fixesIds) {
                let input = document.getElementById('qty_' + id);
                let q = parseInt(input ? input.value : 0) || 0;
                let cb = document.getElementById('cb_tapis_' + id);
                let isCbChecked = cb ? cb.checked : false;

                if (q > 0 || isCbChecked) {
                    if (!aDesTextiles) { recap += "🛋️ TEXTILES / VÉHICULES :\n"; aDesTextiles = true; }
                    let nameStr = fixesIds[id];
                    if (isCbChecked) {
                        nameStr += (id === 'banq_ar') ? " (+ Tapis AR)" : " (+ Tapis)";
                    }
                    let finalQ = q > 0 ? q : 1;
                    recap += `  - ${nameStr} : ${finalQ}\n    Planning : ${getPlanningRecap(planData[id])}\n`;
                }
            }
            if (aDesTextiles) recap += "\n";
            
            let hasVehiculeChoisi = ['pack_v', 'siege_ag', 'siege_ad', 'banq_ar', 'coffre_auto', 'tapis_ag', 'tapis_ad', 'tapis_arg', 'tapis_ard', 'tapis_coffre'].some(id => (parseInt(document.getElementById('qty_'+id)?.value) || 0) > 0 || document.getElementById('cb_tapis_'+id)?.checked);
            if (hasVehiculeChoisi) {
                let qStd = parseInt(document.getElementById('qty_veh_std')?.value) || 0;
                let qLarge = parseInt(document.getElementById('qty_veh_large')?.value) || 0;
                let qPl = parseInt(document.getElementById('qty_veh_pl')?.value) || 0;

                let gabaritsText = [];
                if(qStd > 0) gabaritsText.push(`${qStd} Standard(s)`);
                if(qLarge > 0) gabaritsText.push(`${qLarge} Gros Volume(s) [+30€/u]`);
                if(qPl > 0) gabaritsText.push(`${qPl} Poids Lourd(s) [+50€/u]`);

                if(gabaritsText.length > 0) {
                    recap += `  ▶ Gabarits déclarés : ${gabaritsText.join(' | ')}\n\n`;
                } else {
                    recap += `  ▶ Gabarits déclarés : Aucun renseigné\n\n`;
                }
            }

            let aDesSepultures = false;
            const fixesIdsSep = {
                'sep_simple': 'Sépulture simple',
                'sep_double': 'Sépulture double',
                'sep_caveau': 'Caveau / Chapelle',
                'sep_columbarium': 'Columbarium',
                'sep_terre': 'Tombe pleine terre',
                'sep_fleurs_art': 'Fleurissement (Fleurs artificielles)',
                'sep_fleurs_vrai': 'Fleurissement (Vraies fleurs)',
                'sep_pots_acc': 'Nettoyage pots et accessoires plaque ect... supp.',
                'sep_sub_4': 'Abonnement 4 interventions (69 €/mois)',
                'sep_sub_6': 'Abonnement 6 interventions (59 €/mois)',
                'sep_sub_12': 'Abonnement 12 interventions (89 €/mois)',
                'sep_sub_24': 'Abonnement 24 interventions (119 €/mois)'
            };

            for (let id in fixesIdsSep) {
                let input = document.getElementById('qty_' + id);
                let q = parseInt(input ? input.value : 0) || 0;
                if (q > 0) {
                    if (!aDesSepultures) { recap += "🪦 ENTRETIEN SÉPULTURES :\n"; aDesSepultures = true; }
                    let detailFleurs = "";
                    if (id === 'sep_fleurs_art' || id === 'sep_fleurs_vrai') {
                        let selectFleur = document.getElementById('flower_choice_' + id);
                        if (selectFleur) {
                            detailFleurs = ` (Variété choisie : ${selectFleur.options[selectFleur.selectedIndex].text})`;
                        }
                    }
                    recap += `  - ${fixesIdsSep[id]}${detailFleurs} : ${q}\n    Planning : ${getPlanningRecap(planData[id])}\n`;
                }
            }
            if (aDesSepultures) recap += "\n";

            let aDesEvts = false;
            let qPetite = parseInt(document.getElementById('qty_evt_salle_petite')?.value) || 0;
            let qGrande = parseInt(document.getElementById('qty_evt_salle_grande')?.value) || 0;
            let cbAvant = document.getElementById('cb_evt_nettoyage_avant')?.checked;
            let cbTerrasse = document.getElementById('cb_evt_ext_terrasse')?.checked;
            let cbPoubelles = document.getElementById('cb_evt_poubelles')?.checked;
            let consEvt = document.getElementById('cons_select_evt');

            if (qPetite > 0 || qGrande > 0 || cbAvant || cbTerrasse || cbPoubelles || (consEvt && consEvt.value === 'osp') || (window.evtPendantData && window.evtPendantData.totalCost > 0)) {
                recap += "🎉 REMISE EN ÉTAT DE SALLE & ÉVÉNEMENTS :\n  ✔ INCLUS D'OFFICE : États des lieux photo AVANT/APRÈS + Matériel, produits et sacs poubelles.\n";
                aDesEvts = true;
                
                if (qPetite > 0) recap += `  - Remise en état Salle < 100 m² (Nettoyage APRÈS inclus) : x${qPetite}\n`;
                if (qGrande > 0) recap += `  - Remise en état Grande Salle / Domaine > 100 m² (Nettoyage APRÈS inclus) : x${qGrande}\n`;
                if (cbAvant) recap += `  - Option Nettoyage & Préparation AVANT l'événement (70 €) : OUI\n    ⚠️ Espace dégagé requis 2h avant le début.\n`;
                if (consEvt && consEvt.value === 'osp') recap += `  - Option Fourniture des consommables hygiène (Papier toilette, savon, essuie-mains) : OUI (+29 €)\n`;

                if (window.evtPendantData && window.evtPendantData.totalCost > 0) {
                    let bd = window.evtPendantData;
                    let startVal = document.getElementById('evt_start_time')?.value;
                    let endVal = document.getElementById('evt_end_time')?.value;
                    recap += `  - Option Présence & Nettoyage PENDANT l'événement : Durée ${bd.totalHours.toFixed(2).replace(/\.00$/,'')}h (de ${startVal} à ${endVal})\n`;
                    if (bd.dayHours > 0) recap += `    • ${bd.dayHours.toFixed(2).replace(/\.00$/,'')}h Jour (06h-21h à 25€/h) = ${bd.dayCost.toFixed(2)} €\n`;
                    if (bd.nightHours > 0) recap += `    • ${bd.nightHours.toFixed(2).replace(/\.00$/,'')}h Nuit (21h-06h à 30€/h [+20%]) = ${bd.nightCost.toFixed(2)} €\n`;
                    recap += `    ⚠️ Clause dépassement : +12 € par heure commencée supplémentaire si dépassement sur place.\n`;
                }

                if (cbTerrasse) recap += `  - Option Nettoyage terrasse & extérieurs (70 €) : OUI\n`;
                if (cbPoubelles) recap += `  - Option Gestion & évacuation des déchets (70 €) : OUI\n`;
                recap += "\n";
            }

            // ---> RÉCAPITULATIF CHANTIER AJOUTÉ ICI <---
            if (activeServices.includes('chantier')) {
                let m2 = parseInt(document.getElementById('qty_chantier_m2')?.value) || 0;
                let typeChantier = document.getElementById('type_chantier')?.value || 'moyen';
                let cbMono = document.getElementById('cb_chantier_monobrosse')?.checked;
                let cbDechets = document.getElementById('cb_chantier_dechets')?.checked;

                if (m2 > 0) {
                    recap += "🚧 NETTOYAGE FIN DE CHANTIER :\n";
                    recap += `  - Surface totale : ${m2} m²\n`;
                    recap += `  - Type d'intervention : ${typeChantier.toUpperCase()}\n`;
                    if (cbMono) recap += `  - Option : Lavage mécanique des sols (Monobrosse)\n`;
                    if (cbDechets) recap += `  - Option : Évacuation de gravats / déchets\n`;
                    recap += `    Planning : ${getPlanningRecap(planData['chantier_m2'])}\n\n`;
                }
            }

            let aDesLocaux = false;
            let recapParNiveau = {}; 

            for (let roomId in planData) {
                if (roomId.startsWith('room_detail_')) {
                    aDesLocaux = true;
                    let roomInfo = planData[roomId];
                    let card = document.getElementById('row_' + roomId);
                    
                    let levelName = "Non précisé";
                    if (card) {
                        let accordion = card.closest('.level-accordion');
                        if (accordion) levelName = accordion.getAttribute('data-levelname');
                    }

                    let qty = 0;
                    let detailSupp = "";

                    if (roomInfo.roomType === 'Sanitaires' || roomInfo.roomType === 'Douche' || roomInfo.roomType === 'Vestiaire') {
                        let h = parseInt(document.getElementById(`qty_h_${roomId}`)?.value) || 0;
                        let f = parseInt(document.getElementById(`qty_f_${roomId}`)?.value) || 0;
                        let m = parseInt(document.getElementById(`qty_m_${roomId}`)?.value) || 0;
                        qty = 1; 
                        let s=[];
                        if(h>0)s.push(h+"H"); if(f>0)s.push(f+"F"); if(m>0)s.push(m+"M");
                        detailSupp = ` [${s.join(', ')}]`;
                    } else if (roomInfo.roomType === 'Bureau') {
                        let t = parseInt(document.getElementById(`qty_tot_${roomId}`)?.value) || 0;
                        let o = parseInt(document.getElementById(`qty_occ_${roomId}`)?.value) || 0;
                        qty = 1; 
                        detailSupp = ` (Tot:${t}, Occ:${o})`;
                    } else if (roomInfo.roomType === 'Restauration') {
                        let esp = parseInt(document.getElementById(`qty_${roomId}`)?.value) || 1;
                        qty = esp;
                    } else {
                        qty = parseInt(document.getElementById(`qty_${roomId}`)?.value) || 1;
                    }

                    let planningText = getPlanningRecap(roomInfo);
                    if (planningText === "Détails de planification à voir ensemble") {
                        planningText = "À définir";
                    } else {
                        planningText = planningText.replace('Jours [', '').replace(']', '');
                    }

                    let selectSol = document.getElementById('sol_' + roomId);
                    let solValue = selectSol ? selectSol.options[selectSol.selectedIndex].text : "Non précisé";

                    if (!recapParNiveau[levelName]) recapParNiveau[levelName] = {};
                    let cleRegroupement = `${roomInfo.roomType}${detailSupp} (Sol: ${solValue}) === ${planningText}`;
                    if (!recapParNiveau[levelName][cleRegroupement]) recapParNiveau[levelName][cleRegroupement] = 0;
                    recapParNiveau[levelName][cleRegroupement] += qty;
                }
            }

            if (aDesLocaux) {
                let lignesEtages = [];
                for (let niveau in recapParNiveau) {
                    let piecesDeLetage = [];
                    for (let cle in recapParNiveau[niveau]) {
                        let details = cle.split(' === ');
                        let typePieceSol = details[0]; 
                        let planning = details[1];
                        let quantiteTotale = recapParNiveau[niveau][cle];
                        if (quantiteTotale > 0) piecesDeLetage.push(`${typePieceSol} x${quantiteTotale} (${planning})`);
                    }
                    lignesEtages.push(`📍 ${niveau} ➔ ` + piecesDeLetage.join(' | '));
                }
                recap += `🏢 LOCAUX : ` + lignesEtages.join(' /// ') + `\n\n`;
            }

            let aDesDemandesParticulieres = false;
            for (let id in planData) {
                if (id.startsWith('custom_')) {
                    let textTextarea = document.getElementById('name_' + id)?.value || '';
                    let qtyCustom = document.getElementById('qty_' + id)?.value || 1;
                    if (textTextarea.trim() !== '') {
                        if (!aDesDemandesParticulieres) { recap += "✨ DEMANDES PARTICULIÈRES :\n"; aDesDemandesParticulieres = true; }
                        recap += `  - Description : "${textTextarea}" (Quantité/Répétition : x${qtyCustom})\n    Planning associé : ${getPlanningRecap(planData[id])}\n`;
                    }
                }
            }

            recap += `\n--- INFORMATIONS FINANCIÈRES ---\nBase de calcul initiale : ${window.originalTotalValue.toFixed(2)} €\n`;
            if (window.fraisDeplacementBase > 0) {
                if (window.fraisDeplacementKilometrique === 0) {
                    recap += `🚗 Frais de route de ${window.fraisDeplacementBase.toFixed(2)} € TOTALEMENT OFFERTS (Devis > 150 €)\n`;
                } else {
                    recap += `🚗 Frais de route ajoutés : +${window.fraisDeplacementKilometrique.toFixed(2)} € (Surcoût hors Agglomération)\n`;
                }
            }
            
            let conflict10 = false;
            let finalPromoDevis = window.promoDiscountDevis;
            let finalClientDiscount = window.clientDiscount;
            let resteDiscountEmail = window.holidayPromoActive ? 0.10 : 0;

            let countEmail10 = 0;
            if (finalPromoDevis === 0.10) countEmail10++;
            if (finalClientDiscount === 0.10) countEmail10++;
            if (resteDiscountEmail === 0.10) countEmail10++;
            if (countEmail10 >= 2) { finalPromoDevis = 0; conflict10 = true; }

            if (finalClientDiscount > 0) recap += `🎁 Remise Client VIP Fidélité (${finalClientDiscount * 100}%) active via Code : ${window.activeClientCode}\n`;
            if (finalPromoDevis > 0) recap += `🎁 Code Promo de validation (${finalPromoDevis * 100}%) appliqué avec le code : ${window.activePromoCodeDevis}\n`;
            
            // Synchronisation du nom de l'Opération pour l'e-mail
            if (window.holidayPromoActive) {
                const currentMonth = getSimulatedDate().getMonth();
                let vedetteServiceId = null;
                let vedetteDiscount = 0;
                let nomOperation = "PROPRETÉ";

                if (currentMonth === 5) { vedetteServiceId = 'vehicule'; vedetteDiscount = 0.30; nomOperation = "ÉTÉ"; }
                else if (currentMonth === 4) { vedetteServiceId = 'shampouinage'; vedetteDiscount = 0.30; nomOperation = "PRINTEMPS"; }
                else if (currentMonth === 7 || currentMonth === 8) { vedetteServiceId = 'bureaux'; vedetteDiscount = 0.30; nomOperation = "RENTRÉE"; }
                else if (currentMonth === 2 || currentMonth === 3) { vedetteServiceId = 'vitrerie'; vedetteDiscount = 0.25; nomOperation = "PRINTEMPS"; }
                else if (currentMonth === 9 || currentMonth === 10) { vedetteServiceId = 'sepulture'; vedetteDiscount = 0.25; nomOperation = "TOUSSAINT"; }
                else if (currentMonth === 11 || currentMonth === 0) { vedetteServiceId = 'shampouinage'; vedetteDiscount = 0.25; nomOperation = "NOËL"; }

                if (vedetteServiceId && activeServices.includes(vedetteServiceId)) {
                    recap += `🎁 OPÉRATION EXCLUSIVE ${nomOperation} : Remise Vedette (-${vedetteDiscount * 100}%) appliquée.\n`;
                    recap += `🎁 OPÉRATION SPÉCIALE ${nomOperation} : Remise globale (-10%) appliquée sur le reste.\n`;
                } else {
                    recap += `🎁 OPÉRATION SPÉCIALE ${nomOperation} : Remise globale (-10%) appliquée.\n`;
                }
            }

            if (conflict10) recap += `⚠️ Un cumul de deux offres à 10% a été détecté et bloqué conformément à la politique tarifaire.\n`;
            
            // Calcul exact du pourcentage moyen de remise
            let totalDiscountMontant = window.originalTotalValue - window.currentTotalValue;
            if (totalDiscountMontant > 0 && window.originalTotalValue > 0) {
                let pctTotalRounded = Math.round((totalDiscountMontant / window.originalTotalValue) * 100) || 0;
                recap += `✅ TOTAL DES REMISES CUMULÉES EXTRAITES : ~${pctTotalRounded}%\n`;
            }
            
            recap += `Prix final proposé au client : ${prixFinalAEnvoyer}\n`;
            if (majorationAppliquee) recap += `⚠️ Le client a validé et accepté la majoration forfaitaire à 35,00 € car son panier initial était trop faible.\n`;

            pendingGooglePayload = {
                "Date": getSimulatedDate().toLocaleString('fr-FR'),
                "Session ID": "WEB_" + Date.now(),
                "Nom Client": (statut === "Entreprise" && document.getElementById('nomEntreprise').value) ? document.getElementById('nomEntreprise').value : form.nom.value,
                "Prénom Client": form.prenom.value,
                "Email": form.email.value,
                "Téléphone": form.telephone ? form.telephone.value : "Non renseigné",
                "Adresse": form.adresse.value + ", " + form.ville.value,
                "Statut": statut,
                "Type Prestation": activeServices.join(', '), 
                "Prix": prixFinalAEnvoyer,
                "Recapitulatif": recap
            };

            pendingEmailParams = {
                statut: statut, 
                nom: form.nom.value, 
                prenom: form.prenom.value, 
                email: form.email.value, 
                telephone: form.telephone ? form.telephone.value : "Non renseigné",
                email_client: form.email.value,
                adresse: form.adresse.value, 
                ville: form.ville.value, 
                interlocuteur: form.interlocuteur.value, 
                prix: prixFinalAEnvoyer, 
                recapitulatif: recap
            };

            if (window.activeClientCode || window.activePromoCodeDevis) {
                let codeUti = window.activeClientCode || window.activePromoCodeDevis;
                pendingClientCodeAlert = {
                    alerte_message: `⚠️ ALERTE IMPORTANTE :\n\nLe code de remise "${codeUti}" vient d'être utilisé par ${form.nom.value} ${form.prenom.value} (Email : ${form.email.value}, Tél : ${form.telephone ? form.telephone.value : "Non renseigné"}).\n\nSi ce code est à usage unique, n'oubliez pas d'ajouter la mention "-FIN" à côté du code dans votre fichier codes.js.`,
                    code_utilise: codeUti
                };
            } else {
                pendingClientCodeAlert = null;
            }

            let textPreviewTitle = langKey === 'vi' ? "🔍 Kiểm tra yêu cầu của bạn" : (langKey === 'en' ? "🔍 Review your request" : "🔍 Vérifiez votre demande");
            let textPreviewSub = langKey === 'vi' ? "Vui lòng xem lại thông tin của bạn trước khi xác nhận gửi." : (langKey === 'en' ? "Please review your information before final submission." : "Veuillez relire vos informations avant de valider l'envoi définitif.");
            let textBtnEdit = langKey === 'vi' ? "⬅️ Sửa" : (langKey === 'en' ? "⬅️ Edit" : "⬅️ Modifier");
            let textBtnConfirm = langKey === 'vi' ? "✅ Xác nhận và Gửi" : (langKey === 'en' ? "✅ Confirm and Send" : "✅ Confirmer et Envoyer");

            let previewText = `👤 VOS COORDONNÉES :\nNom : ${form.nom.value} ${form.prenom.value}\nEmail : ${form.email.value}\nTéléphone : ${form.telephone ? form.telephone.value : "Non renseigné"}\nAdresse : ${form.adresse.value}, ${form.ville.value}\n\n`;
            previewText += recap;

            let previewContainer = document.getElementById('quotePreviewContainer');
            if (!previewContainer) {
                previewContainer = document.createElement('div');
                previewContainer.id = 'quotePreviewContainer';
                previewContainer.style.padding = '20px';
                form.parentNode.insertBefore(previewContainer, form.nextSibling);
            }

            previewContainer.innerHTML = `
                <h3 style="color: var(--bleu); font-size: 1.5rem; margin-bottom: 10px; border-bottom: 2px solid var(--vert); padding-bottom: 10px; text-align: center;">${textPreviewTitle}</h3>
                <p style="text-align: center; font-size: 0.9rem; color: #555; margin-bottom: 15px;">${textPreviewSub}</p>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 15px;">
                    <button type="button" class="btn-validate" onclick="editQuote()" style="background: #e1e8ef; color: var(--bleu); border: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.3s; flex: 1; max-width: 250px;">${textBtnEdit}</button>
                    <button type="button" class="btn-submit-form btn-confirm-send" onclick="confirmAndSendQuote()" style="margin: 0; padding: 12px 20px; flex: 1; max-width: 250px;">${textBtnConfirm}</button>
                </div>

                <div id="previewContent" style="background: #fdfdfd; padding: 15px; border-radius: 8px; font-size: 0.85rem; color: #333; line-height: 1.6; max-height: 35vh; overflow-y: auto; white-space: pre-wrap; margin-bottom: 15px; border: 1px solid #ccc; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);"></div>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button type="button" class="btn-validate" onclick="editQuote()" style="background: #e1e8ef; color: var(--bleu); border: none; padding: 12px 20px; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.3s; flex: 1; max-width: 250px;">${textBtnEdit}</button>
                    <button type="button" class="btn-submit-form btn-confirm-send" onclick="confirmAndSendQuote()" style="margin: 0; padding: 12px 20px; flex: 1; max-width: 250px;">${textBtnConfirm}</button>
                </div>
            `;
            
            document.getElementById('previewContent').textContent = previewText;

            form.style.display = 'none';
            document.getElementById('postSubmitChoice').style.display = 'none';
            previewContainer.style.display = 'block';
            
            document.querySelector('.modal-content.large').scrollTo({ top: 0, behavior: 'smooth' });

        } else { form.reportValidity(); }
    } catch (erreurGlobale) {
        console.error("Erreur inattendue dans le script :", erreurGlobale);
        let errorMsg = langKey === 'vi' ? "Có lỗi xảy ra. Vui lòng thử lại hoặc gọi 07 45 02 76 24." :
                       langKey === 'en' ? "An error occurred. Please try again or call 07 45 02 76 24." :
                       "Une erreur inattendue empêche l'envoi. Rechargez la page ou contactez-moi au 07 45 02 76 24.";
        await askCustomQuestion("Erreur technique", errorMsg, [{text: "Fermer", value: "ok", style: "background: var(--bleu); color: white;"}]);
        document.getElementById('btnSubmitForm').innerText = "ENVOYER MON DEVIS"; document.getElementById('btnSubmitForm').disabled = false;
    }
}

function editQuote() {
    document.getElementById('quotePreviewContainer').style.display = 'none';
    document.getElementById('interactiveForm').style.display = 'block';
}

function confirmAndSendQuote() {
    let textSending = langKey === 'vi' ? "Đang gửi..." : (langKey === 'en' ? "Sending..." : "Envoi en cours...");
    
    const btns = document.querySelectorAll('.btn-confirm-send');
    btns.forEach(btn => {
        btn.innerText = textSending; 
        btn.disabled = true;
    });

    const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbwgsHmaXX1a33a2lY4IenMp83_BSBpLw88u5uPkPMBQC7iXQG5QLn5w-IYl9uR0EQ4/exec";
    fetch(GOOGLE_API_URL, { 
        method: 'POST', 
        headers: { "Content-Type": "text/plain;charset=utf-8" }, 
        body: JSON.stringify(pendingGooglePayload) 
    })
    .then(res => console.log("✅ Données envoyées vers Google Drive pour création du PDF"))
    .catch(e => console.error("Erreur d'envoi vers Google :", e));

    emailjs.send('service_wfrbr4e', 'template_oncrl1l', pendingEmailParams)
    .then(() => {
        if (pendingClientCodeAlert) {
            emailjs.send('service_wfrbr4e', 'template_alerte_code', pendingClientCodeAlert)
            .then(() => console.log("Email d'alerte code envoyé !"))
            .catch((error) => console.error("Erreur lors de l'envoi de l'alerte code :", error));
        }

        document.getElementById('quotePreviewContainer').style.display = "none"; 
        document.getElementById('postSubmitChoice').style.display = "block";
    }).catch((error) => {
        console.error("Erreur détaillée EmailJS :", error);
        document.getElementById('quotePreviewContainer').style.display = "none";
        let form = document.getElementById('interactiveForm');
        let surchargeMessage = document.createElement('div');
        surchargeMessage.innerHTML = `
            <div style="background: #fdf8e4; border-left: 5px solid var(--vert); padding: 25px; border-radius: 8px; text-align: center; margin-top: 20px; animation: fadeInDown 0.5s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                <h3 style="color: var(--bleu); margin-bottom: 15px; font-size: 1.4rem;">🔥 Victime de notre succès !</h3>
                <p style="color: #444; font-size: 1rem; margin-bottom: 15px; line-height: 1.5;">En raison d'un <strong>très grand nombre de demandes de devis</strong> aujourd'hui, notre système automatique est temporairement saturé.</p>
                <p style="color: #444; font-size: 1rem; margin-bottom: 20px;">Pas d'inquiétude, votre estimation (<strong>${pendingEmailParams.prix}</strong>) a bien été calculée ! Pour ne pas perdre votre demande et la traiter en priorité, contactez-moi directement :</p>
                <a href="mailto:alexandre.jonot@ospplus.com?subject=Validation devis prioritaire OSP+ - ${pendingEmailParams.prix}" style="display: inline-block; background: var(--vert); color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 1.1rem; margin-bottom: 15px; transition: transform 0.2s;">✉️ alexandre.jonot@ospplus.com</a>
                <p style="color: var(--bleu); font-weight: 800; font-size: 1.1rem; margin-top: 5px;">📞 Ou par téléphone au 07 45 02 76 24</p>
            </div>`;
        form.parentNode.insertBefore(surchargeMessage, form);
    });
}

function closeQuote() { document.getElementById('quoteModal').style.display = "none"; }

function initDynamicSliders() {
    document.querySelectorAll('.faq-card, .review-card').forEach(container => {
        const slides = container.querySelectorAll('.dynamic-slide');
        if (slides.length <= 1) return;
        let i = 0; setInterval(() => { slides[i].classList.remove('active'); i = (i + 1) % slides.length; slides[i].classList.add('active'); }, 10000);
    });
}
window.addEventListener('DOMContentLoaded', initDynamicSliders);

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.scroll-animate').forEach(section => { animationObserver.observe(section); });

document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => { hamburgerBtn.classList.toggle('active'); navLinks.classList.toggle('active'); });
        navLinks.querySelectorAll('a').forEach(link => { link.addEventListener('click', () => { hamburgerBtn.classList.remove('active'); navLinks.classList.remove('active'); }); });
    }
});

function openCarteModal() { document.getElementById('carteModal').style.display = 'flex'; }
function closeCarteModal() {
    document.getElementById('carteModal').style.display = 'none';
    const flipCard = document.querySelector('.flip-card');
    if (flipCard) flipCard.classList.remove('flipped');
}
function toggleFlipCard() { const flipCard = document.querySelector('.flip-card'); if (flipCard) flipCard.classList.toggle('flipped'); }

function downloadCarte() {
    let linkA = document.createElement('a'); linkA.href = 'Carte visite A.jpg?v=12'; linkA.download = 'OSP_Plus_Carte_Recto.jpg'; document.body.appendChild(linkA); linkA.click(); document.body.removeChild(linkA);
    setTimeout(() => { let linkB = document.createElement('a'); linkB.href = 'Carte visite B.jpg?v=12'; linkB.download = 'OSP_Plus_Carte_Verso.jpg'; document.body.appendChild(linkB); linkB.click(); document.body.removeChild(linkB); }, 500);
}

function printCarte() {
    let printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`<html><head><title>Imprimer - Carte de Visite O.S.P+</title><style>body { text-align: center; font-family: sans-serif; padding: 20px; } img { max-width: 100%; width: 400px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 5px; } p { color: #1a3c6c; font-weight: bold; }</style></head><body><p>Découpez le long des bords :</p><img src="Carte visite A.jpg?v=12" alt="Recto"><br><img src="Carte visite B.jpg?v=12" alt="Verso"></body></html>`);
        printWindow.document.close(); printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    }
}

function gererEtiquettesNouveautes() {
    const dateActuelle = getSimulatedDate();
    const anneeEnCours = dateActuelle.getFullYear();

    const badgesAout = document.querySelectorAll('.dynamic-badge');
    if (badgesAout.length > 0) {
        const dateLancementAout = new Date(anneeEnCours, 7, 15); 
        badgesAout.forEach(badge => { 
            badge.innerText = (dateActuelle >= dateLancementAout) ? "Nouveau service" : "Dispo le 15 Août"; 
        });
    }

    const badgesSept = document.querySelectorAll('.dynamic-badge-sept');
    if (badgesSept.length > 0) {
        const dateLancementSept = new Date(anneeEnCours, 8, 1); 
        badgesSept.forEach(badge => { 
            if (dateActuelle >= dateLancementSept) {
                badge.innerText = "Nouveau service";
                badge.style.backgroundColor = ""; 
            } else {
                badge.innerText = "Dispo 1er septembre";
                badge.style.backgroundColor = "var(--bleu)"; 
            }
        });
    }
}
window.addEventListener('DOMContentLoaded', gererEtiquettesNouveautes);

function toggleFullScreenComp(btn) {
    const container = btn.closest('.comparison-container');
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) container.requestFullscreen();
        else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
        else if (container.msRequestFullscreen) container.msRequestFullscreen();
        btn.innerHTML = "✖ Quitter le plein écran";
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        btn.innerHTML = "🔍 Plein écran";
    }
}
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) document.querySelectorAll('.btn-fullscreen-comp').forEach(b => b.innerHTML = "🔍 Plein écran"); });

function openImageModal(imageSource) {
    document.getElementById("fullSizeImage").src = imageSource; 
    document.getElementById("imageModal").style.display = "flex"; 
}
function closeImageModal() { document.getElementById("imageModal").style.display = "none"; }

// ==========================================
// ⌨️ ACCESSIBILITÉ : NAVIGATION AU CLAVIER
// ==========================================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        let elementActif = document.activeElement;
        if (elementActif && elementActif.getAttribute('role') === 'button') {
            event.preventDefault();
            elementActif.click();
        }
    }
});

// ==========================================
// 📄 MOTEUR DE CLONAGE D'ÉTAGES
// ==========================================

window.currentCloneList = [];

function openCloneModal(sourceLevelId, sourceName) {
    let existingModal = document.getElementById('cloneFloorModal');
    if (existingModal) existingModal.remove();

    let txtTitle = langKey === 'vi' ? 'Nhân bản: ' + sourceName : (langKey === 'en' ? 'Clone: ' + sourceName : 'Dupliquer : ' + sourceName);
    let txtPredef = langKey === 'vi' ? 'Chọn tầng có sẵn để tạo:' : (langKey === 'en' ? 'Select predefined floors:' : 'Ajouter des étages rapides :');
    let txtCustom = langKey === 'vi' ? 'Hoặc nhập tên tùy chỉnh:' : (langKey === 'en' ? 'Or enter a custom name:' : 'Ou ajouter un nom sur-mesure :');
    let txtList = langKey === 'vi' ? 'Các tầng sẽ được nhân bản:' : (langKey === 'en' ? 'Floors to be created:' : 'Liste des étages qui seront créés :');
    let btnAdd = langKey === 'vi' ? 'Thêm' : (langKey === 'en' ? 'Add' : 'Ajouter');
    let btnConfirm = langKey === 'vi' ? 'Xác nhận & Nhân bản' : (langKey === 'en' ? 'Confirm & Clone' : 'Confirmer & Cloner');
    let btnCancel = langKey === 'vi' ? 'Hủy' : (langKey === 'en' ? 'Cancel' : 'Annuler');

    let predefFloors = [];
    if (langKey === 'vi') predefFloors = ['Tầng trệt (RDC)', 'Tầng 1', 'Tầng 2', 'Tầng 3', 'Tầng 4', 'Tầng lửng', 'Bãi đậu xe'];
    else if (langKey === 'en') predefFloors = ['Ground Floor (RDC)', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Mezzanine', 'Parking Lot'];
    else predefFloors = ['RDC', 'Étage 1', 'Étage 2', 'Étage 3', 'Étage 4', 'Entresol', 'Parking'];

    window.currentCloneList = [];

    let predefHtml = predefFloors.map(f => `<button type="button" onclick="addFloorToCloneList('${f.replace(/'/g, "\\'")}')" style="margin:2px; padding:6px 12px; font-size:0.85rem; background:#eef3f8; border:1px solid var(--bleu); border-radius:4px; cursor:pointer; color:var(--bleu); transition:0.2s;" onmouseover="this.style.background='var(--bleu)'; this.style.color='white';" onmouseout="this.style.background='#eef3f8'; this.style.color='var(--bleu)';">${f} +</button>`).join('');

    let modalHtml = `
    <div id="cloneFloorModal" style="display:flex; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:99999; justify-content:center; align-items:center;">
        <div style="background:white; padding:25px; border-radius:10px; width:90%; max-width:550px; box-shadow:0 4px 15px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto; font-family:sans-serif;">
            <h3 style="color:var(--bleu); margin-top:0; border-bottom:2px solid var(--vert); padding-bottom:10px;">📄 ${txtTitle}</h3>
            
            <div style="margin-bottom:20px; margin-top:15px;">
                <label style="font-size:0.9rem; font-weight:bold; color:#444;">${txtPredef}</label>
                <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:8px;">${predefHtml}</div>
            </div>

            <div style="margin-bottom:20px;">
                <label style="font-size:0.9rem; font-weight:bold; color:#444;">${txtCustom}</label>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <input type="text" id="cloneCustomInput" placeholder="${langKey==='en'?"Ex: Annex building":"Ex: Bâtiment Annexe"}" style="flex:1; padding:10px; border:1px solid #ccc; border-radius:4px; font-size:0.9rem;">
                    <button type="button" onclick="addCustomFloorToCloneList()" style="background:var(--vert); color:white; border:none; padding:10px 20px; border-radius:4px; font-weight:bold; cursor:pointer; transition:0.2s;">${btnAdd}</button>
                </div>
            </div>

            <div style="margin-bottom:25px; background:#f9f9f9; padding:15px; border-radius:8px; border:1px dashed #ccc;">
                <label style="font-size:0.9rem; font-weight:bold; color:var(--bleu); display:block; margin-bottom:10px;">${txtList}</label>
                <div id="cloneListContainer" style="min-height:50px; display:flex; flex-direction:column; gap:8px;"></div>
            </div>

            <div style="display:flex; gap:10px;">
                <button type="button" onclick="confirmCloneAction('${sourceLevelId}')" style="flex:1; background:var(--vert); color:white; border:none; padding:14px; border-radius:5px; font-weight:bold; font-size:1rem; cursor:pointer;">${btnConfirm}</button>
                <button type="button" onclick="closeCloneModal()" style="flex:1; background:#e1e8ef; color:var(--bleu); border:none; padding:14px; border-radius:5px; font-weight:bold; font-size:1rem; cursor:pointer;">${btnCancel}</button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    renderCloneList();
}

window.addFloorToCloneList = function(name) {
    if(!window.currentCloneList.includes(name)) {
        window.currentCloneList.push(name);
        renderCloneList();
    }
};

window.addCustomFloorToCloneList = function() {
    let input = document.getElementById('cloneCustomInput');
    let val = input.value.trim();
    if(val !== '' && !window.currentCloneList.includes(val)) {
        window.currentCloneList.push(val);
        input.value = '';
        renderCloneList();
    }
};

window.removeFloorFromCloneList = function(index) {
    window.currentCloneList.splice(index, 1);
    renderCloneList();
};

window.renderCloneList = function() {
    let container = document.getElementById('cloneListContainer');
    if(!container) return;
    if(window.currentCloneList.length === 0) {
        container.innerHTML = `<span style="font-size:0.85rem; color:#888; font-style:italic;">${langKey==='en'?"No floor added yet.":"Aucun étage ajouté pour le moment."}</span>`;
        return;
    }
    container.innerHTML = window.currentCloneList.map((f, i) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:8px 12px; border:1px solid #e1e8ef; border-radius:4px; font-size:0.9rem; font-weight:bold; color:var(--bleu); box-shadow:0 2px 5px rgba(0,0,0,0.02);">
            <span>📍 ${f}</span>
            <button type="button" onclick="removeFloorFromCloneList(${i})" style="background:#e74c3c; color:white; border:none; border-radius:4px; width:25px; height:25px; display:flex; justify-content:center; align-items:center; cursor:pointer; font-weight:bold; font-size:1rem;" title="${langKey==='en'?"Remove":"Supprimer"}">×</button>
        </div>
    `).join('');
};

window.closeCloneModal = function() {
    let existingModal = document.getElementById('cloneFloorModal');
    if (existingModal) existingModal.remove();
};

window.confirmCloneAction = function(sourceLevelId) {
    if(window.currentCloneList.length === 0) {
        alert(langKey==='en'?"Please add at least one floor to clone to.":"Veuillez ajouter au moins un étage à cloner.");
        return;
    }
    executeFloorClone(sourceLevelId, window.currentCloneList);
    closeCloneModal();
};

function executeFloorClone(sourceLevelId, newNames) {
    let sourceRoomsContainer = document.getElementById('rooms_container_' + sourceLevelId);
    if(!sourceRoomsContainer) return;
    let sourceRoomCards = sourceRoomsContainer.querySelectorAll('.structured-room-card');
    
    let sourceRoomIds = [];
    sourceRoomCards.forEach(card => {
        sourceRoomIds.push(card.id.replace('row_', ''));
    });

    newNames.forEach(newName => {
        let targetLevelId = createLevelAccordion(newName);

        sourceRoomIds.forEach(srcRoomId => {
            let srcPlan = planData[srcRoomId];
            if(!srcPlan) return;
            
            let roomType = srcPlan.roomType;
            let targetRoomId = addStructuredRoom(targetLevelId, roomType); 
            
            let srcCard = document.getElementById('row_' + srcRoomId);
            let tgtCard = document.getElementById('row_' + targetRoomId);
            
            if(srcCard && tgtCard) {
                let srcInputs = srcCard.querySelectorAll('input[type="number"], input[type="text"]');
                srcInputs.forEach((sInp) => {
                    let tInpId = sInp.id.replace(srcRoomId, targetRoomId);
                    let tInp = document.getElementById(tInpId);
                    if(tInp) {
                        tInp.value = sInp.value;
                        tInp.style.backgroundColor = sInp.style.backgroundColor;
                        tInp.style.border = sInp.style.border;
                    }
                });
                
                let srcSelects = srcCard.querySelectorAll('select');
                srcSelects.forEach(sSel => {
                    let tSelId = sSel.id.replace(srcRoomId, targetRoomId);
                    let tSel = document.getElementById(tSelId);
                    if(tSel) {
                        tSel.value = sSel.value;
                        tSel.style.backgroundColor = sSel.style.backgroundColor;
                        tSel.style.border = sSel.style.border;
                        let srcLabel = sSel.parentElement.querySelector('label');
                        let tgtLabel = tSel.parentElement.querySelector('label');
                        if (srcLabel && tgtLabel) tgtLabel.style.color = srcLabel.style.color;
                    }
                });
                
                let srcChecks = srcCard.querySelectorAll('input[type="checkbox"]');
                srcChecks.forEach(sChk => {
                    let tChkId = sChk.id.replace(srcRoomId, targetRoomId);
                    let tChk = document.getElementById(tChkId);
                    if(tChk && !tChk.disabled) tChk.checked = sChk.checked;
                });
                
                planData[targetRoomId].days = [...srcPlan.days];
                planData[targetRoomId].months = [...srcPlan.months];
                planData[targetRoomId].start = srcPlan.start;
                planData[targetRoomId].end = srcPlan.end;
                planData[targetRoomId].comment = srcPlan.comment;
                
                let srcBtnPlan = document.getElementById('btn_plan_' + srcRoomId);
                let tgtBtnPlan = document.getElementById('btn_plan_' + targetRoomId);
                if(srcBtnPlan && tgtBtnPlan) {
                    tgtBtnPlan.innerText = srcBtnPlan.innerText;
                    tgtBtnPlan.className = srcBtnPlan.className; 
                }
            }
        });
    });
    
    calculatePrice();
    updateLevelSummaries();
}
// ==========================================
// 🤝 GESTION DE L'ESPACE PARTENAIRES B2B
// ==========================================

function openB2bModal() {
    document.getElementById('b2bForm').style.display = 'flex';
    document.getElementById('b2bSuccessMsg').style.display = 'none';
    document.getElementById('b2bModal').style.display = 'flex';
}

function closeB2bModal() {
    document.getElementById('b2bModal').style.display = 'none';
}

function submitB2bForm() {
    const form = document.getElementById('b2bForm');
    
    // Vérification native du formulaire
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const btn = document.getElementById('btnSubmitB2b');
    btn.innerText = "ENVOI EN COURS...";
    btn.disabled = true;

    // Récupération des données
    const paramsB2B = {
        secteur: document.getElementById('b2bSecteur').value,
        entreprise: document.getElementById('b2bEntreprise').value,
        siret: document.getElementById('b2bSiret').value || "Non renseigné",
        nom: document.getElementById('b2bNom').value,
        telephone: document.getElementById('b2bPhone').value,
        email_client: document.getElementById('b2bEmail').value,
        message: document.getElementById('b2bMessage').value || "Aucun détail supplémentaire."
    };

    // Création du résumé lisible pour ton e-mail
    const recapB2B = `
--- NOUVELLE DEMANDE DE PARTENARIAT B2B ---

Secteur souhaité : ${paramsB2B.secteur}
Entreprise : ${paramsB2B.entreprise} (SIRET : ${paramsB2B.siret})
Contact : ${paramsB2B.nom}
Téléphone : ${paramsB2B.telephone}
Email : ${paramsB2B.email_client}

Message / Besoins :
"${paramsB2B.message}"
    `;

    // Utilisation de ton template email existant pour t'envoyer la demande
    const emailData = {
        nom: paramsB2B.entreprise,
        prenom: paramsB2B.nom,
        email: paramsB2B.email_client,
        telephone: paramsB2B.telephone,
        email_client: paramsB2B.email_client,
        adresse: "Demande Partenariat B2B",
        ville: "-",
        interlocuteur: paramsB2B.nom,
        prix: "À définir (Grille B2B)",
        recapitulatif: recapB2B
    };

    emailjs.send('service_wfrbr4e', 'template_oncrl1l', emailData)
        .then(() => {
            document.getElementById('b2bForm').style.display = 'none';
            document.getElementById('b2bSuccessMsg').style.display = 'block';
            form.reset();
            btn.innerText = "SOUMETTRE MA DEMANDE";
            btn.disabled = false;
        })
        .catch((error) => {
            console.error("Erreur EmailJS B2B:", error);
            alert("Une erreur est survenue lors de l'envoi. Veuillez nous contacter directement par téléphone.");
            btn.innerText = "SOUMETTRE MA DEMANDE";
            btn.disabled = false;
        });
}