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
        securitePrompt: "🔒 SÉCURITÉ VIP : Veuillez renseigner votre Identifiant Client pour déverrouiller ce code (ex: client123) :",
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

// Récupération automatique du pack de langue (par défaut français si non trouvé)
const langKey = TRANSLATIONS[siteLang] ? siteLang : 'fr';
const msgLang = TRANSLATIONS[langKey];

// Mappings linguistiques pour l'interface utilisateur des pièces et espaces
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

// Mapping pour les descriptions de tâches internes des cartes d'espaces
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
const APP_VERSION = "v3.6"; 

function afficherVersion() {
    let versionBadge = document.createElement('div');
    versionBadge.innerHTML = APP_VERSION;
    versionBadge.style.cssText = "position: fixed; top: 5px; left: 5px; background: rgba(0, 0, 0, 0.6); color: white; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; z-index: 10000; pointer-events: none; font-weight: bold; font-family: sans-serif;";
    document.body.appendChild(versionBadge);
    console.log("🚀 OSP+ Script Chargé - " + APP_VERSION + " [Langue: " + langKey.toUpperCase() + "]");
}
window.addEventListener('DOMContentLoaded', afficherVersion);

// ==========================================
// ⚙️ MOTEUR DE VALIDATION DE CODES (HYBRIDE)
// ==========================================

function parserEtValiderDate(dateStr, lettre1, lettre2) {
    if (!dateStr || dateStr.length !== 8) return null;
    
    // Vérification stricte de la position des lettres de sécurité
    if (dateStr[2] !== lettre1 || dateStr[5] !== lettre2) return null;
    
    // Extraction
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

    const now = new Date();
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

        if (dateCode > DATE_REFERENCE) {
            return { valide: false, statut: "EN_ATTENTE", remise: null, message: msgLang.ospFutur };
        }
        
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

window.clientDiscount = 0; 
window.activeClientCode = "";
window.promoDiscountDevis = 0;
window.activePromoCodeDevis = "";
window.currentTotalValue = 0;
window.originalTotalValue = 0; 

function openClientModal() { document.getElementById('clientModal').style.display = 'flex'; }
function closeClientModal() { document.getElementById('clientModal').style.display = 'none'; }

function applyClientCode() {
    const code = document.getElementById('clientCodeInput').value.trim().toUpperCase();
    const msg = document.getElementById('clientCodeMsg');
    
    if (!code) {
        msg.style.color = 'red';
        msg.innerText = msgLang.saisirCode;
        return;
    }

    let idClientActuel = null;
    
    if (code.startsWith('VIP') && code.split('-').length === 5) {
        idClientActuel = prompt(msgLang.securitePrompt);
        if (!idClientActuel) {
            msg.style.color = 'red';
            msg.innerText = msgLang.annulePrompt;
            return;
        }
        idClientActuel = idClientActuel.trim();
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
        window.promoDiscountDevis = 0;
        window.activePromoCodeDevis = "";
        msg.innerText = "";
        calculatePrice();
        return;
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
        let d = new Date(date);
        d.setDate(d.getDate() + days);
        return String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    };
    return [ addDays(easter, 1), addDays(easter, 39), addDays(easter, 50) ];
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
        const banner = document.getElementById('promo-banner');
        if (banner) banner.style.display = 'block';
        window.holidayPromoActive = true;
    } else {
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
        <button type="button" id="btn_plan_${actualId}" class="btn-planifier" onclick="openPlanningModal('${actualId}', '${name.replace(/'/g, "\\'")}')" style="padding: 4px; font-size: 0.6rem; width: 100%; box-sizing: border-box;">${btnPlanText}</button>
        ${btnPlus}
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
    
    document.querySelectorAll('.accordion-header').forEach(el => { el.classList.remove('active'); });
    document.querySelectorAll('.accordion-body').forEach(el => { el.classList.remove('active'); });

    if (!isActive) {
        headerElement.classList.add('active');
        body.classList.add('active');
    }
}

function updateLevelSummaries() {
    let roomsWord = langKey === 'vi' ? 'không gian' : (langKey === 'en' ? 'space(s)' : 'espace(s)');
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
                        let customInput = card.querySelector('input[type="text"]');
                        if (customInput && customInput.value.trim() !== '') {
                            typeText = customInput.value.trim();
                        }
                        roomNames.push(typeText);
                    }
                });
                let summaryText = roomNames.join(', ');
                if (summaryText.length > 40) summaryText = summaryText.substring(0, 37) + '...';
                titleSpan.innerHTML = `📍 ${levelName} <span style="font-size:0.75rem; color:#888; margin-left:8px; font-weight:normal; font-style:italic;">(${roomCards.length} ${roomsWord} : ${summaryText})</span>`;
            } else {
                titleSpan.innerHTML = `📍 ${levelName}`;
            }
        }
    });
}

function createLevelAccordion(levelName) {
    const levelId = 'level_' + Date.now() + Math.floor(Math.random() * 1000);
    
    let subtitleText = langKey === 'vi' ? 'Thêm các không gian cho tầng này :' : (langKey === 'en' ? 'Add your spaces for this level:' : 'Ajoutez vos espaces pour ce niveau :');
    
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
    
    let html = `
    <div class="level-accordion" id="block_${levelId}" data-levelname="${levelName}">
        <div class="accordion-header" onclick="toggleAccordion(this)">
            <span class="level-title-display">📍 ${levelName}</span>
            <span class="accordion-icon">+</span>
        </div>
        <div class="accordion-body">
            <p style="font-size:0.75rem; color:#666; margin-bottom:8px;">${subtitleText}</p>
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

function addStructuredRoom(levelId, type) {
    roomCounter++;
    const roomId = 'room_detail_' + roomCounter;
    planData[roomId] = { days: [], months: [], start:'', end:'', roomType: type, comment: '' };

    let displayTitle = (mappingDisplay[type] && mappingDisplay[type][langKey]) ? mappingDisplay[type][langKey] : type;
    if (type === 'Autre') displayTitle = langKey === 'vi' ? 'Không gian mới' : (langKey === 'en' ? 'New space' : 'Nouvel espace');

    let phAutre = langKey === 'vi' ? 'Ví dụ: Phòng sao chụp...' : (langKey === 'en' ? 'Ex: Copy Room...' : 'Ex: Espace Reprographie...');
    let customNameHtml = type === 'Autre' ? `<input type="text" placeholder="${phAutre}" style="font-size:0.8rem; padding:6px; margin-bottom:10px; width:100%; border:1px solid #ccc; border-radius:5px;" oninput="updateLevelSummaries()">` : '';
    let qtyHtml = '';
    
    let lblHommes = langKey === 'vi' ? '🚹 Nam (số lượng)' : (langKey === 'en' ? '🚹 Men (number)' : '🚹 Hommes (nombre)');
    let lblFemmes = langKey === 'vi' ? '🚺 Nữ (số lượng)' : (langKey === 'en' ? '🚺 Women (number)' : '🚺 Femmes (nombre)');
    let lblNbEspaces = langKey === 'vi' ? 'Số lượng khu vực' : (langKey === 'en' ? 'Number of spaces' : 'Nombre d\'espaces');
    let lblNbTables = langKey === 'vi' ? 'Số lượng bàn' : (langKey === 'en' ? 'Number of tables' : 'Nombre de tables');
    let lblNbChaises = langKey === 'vi' ? 'Số lượng ghế' : (langKey === 'en' ? 'Number of chairs' : 'Nombre de chaises');

    if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
        qtyHtml = `
        <div class="qty-input-box"><label>${lblHommes}</label><input type="number" id="qty_h_${roomId}" min="0" value="1" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblFemmes}</label><input type="number" id="qty_f_${roomId}" min="0" value="1" oninput="calculatePrice()"></div>`;
    } else if (type === 'Restauration') {
        qtyHtml = `
        <div class="qty-input-box"><label>${lblNbEspaces}</label><input type="number" id="qty_${roomId}" min="1" value="1" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblNbTables}</label><input type="number" id="qty_tables_${roomId}" min="0" value="5" oninput="calculatePrice()"></div>
        <div class="qty-input-box"><label>${lblNbChaises}</label><input type="number" id="qty_chaises_${roomId}" min="0" value="10" oninput="calculatePrice()"></div>`;
    } else {
        let labelQty = langKey === 'vi' ? "Số lượng phòng" : (langKey === 'en' ? "Number of rooms" : "Nombre de pièces");
        if (type === 'Bureau') labelQty = langKey === 'vi' ? "Số lượng văn phòng" : (langKey === 'en' ? "Number of offices" : "Nombre de bureaux");
        else if (type.includes('Ascenseur')) labelQty = langKey === 'vi' ? "Số lượng thang máy" : (langKey === 'en' ? "Number of elevators" : "Nombre d'ascenseurs");
        else if (type.includes('Escalier')) labelQty = langKey === 'vi' ? "Số lượng cầu thang" : (langKey === 'en' ? "Number of stairs" : "Nombre d'escaliers");
        else if (type === 'Palier') labelQty = langKey === 'vi' ? "Số lượng chiếu nghỉ" : (langKey === 'en' ? "Number of landings" : "Nombre de paliers");
        else if (type === 'Terrasse') labelQty = langKey === 'vi' ? "Số lượng sân thượng" : (langKey === 'en' ? "Number of terraces" : "Nombre de terrasses");
        else if (type === 'Parking') labelQty = langKey === 'vi' ? "Số lượng chỗ đậu" : (langKey === 'en' ? "Number of spaces" : "Nombre de places");
        else if (type === 'Couloir') labelQty = langKey === 'vi' ? "Số lượng hành lang" : (langKey === 'en' ? "Number of hallways" : "Nombre de couloirs");
        else if (type === 'Salle de réunion') labelQty = langKey === 'vi' ? "Số lượng phòng" : (langKey === 'en' ? "Number of rooms" : "Nombre de salles");
        else if (type === 'Cuisine') labelQty = langKey === 'vi' ? "Số lượng nhà bếp" : (langKey === 'en' ? "Number of kitchens" : "Nombre de cuisines");
        else if (type === 'Local technique') labelQty = langKey === 'vi' ? "Số lượng phòng kỹ thuật" : (langKey === 'en' ? "Number of tech rooms" : "Nombre de locaux");
        else if (['Accueil', 'Salle de repos', 'Salle de sport'].includes(type)) labelQty = langKey === 'vi' ? "Số lượng khu vực" : (langKey === 'en' ? "Number of spaces" : "Nombre d'espaces");
        qtyHtml = `<div class="qty-input-box"><label>${labelQty}</label><input type="number" id="qty_${roomId}" min="1" value="1" oninput="calculatePrice()"></div>`;
    }

    let lblSol = langKey === 'vi' ? 'Sàn' : (langKey === 'en' ? 'Floor' : 'Sol');
    let optNonPrecise = langKey === 'vi' ? 'Chưa xác định' : (langKey === 'en' ? 'Not specified' : 'Non précisé');
    let optMoquette = langKey === 'vi' ? 'Thảm' : (langKey === 'en' ? 'Carpet' : 'Moquette');
    let optCarrelage = langKey === 'vi' ? 'Gạch men' : (langKey === 'en' ? 'Tiles' : 'Carrelage');
    let optLino = langKey === 'vi' ? 'Lino / PVC' : (langKey === 'en' ? 'Lino / PVC' : 'Lino / PVC');
    let optParquet = langKey === 'vi' ? 'Bê tông / Nhựa' : (langKey === 'en' ? 'Concrete / Resin' : 'Béton / Résine');
    let optAutre = langKey === 'vi' ? 'Khác' : (langKey === 'en' ? 'Other' : 'Autre');

    let surfaceHtml = `
    <div class="qty-input-box">
        <label>${lblSol}</label>
        <select>
            <option value="non_precise">${optNonPrecise}</option>
            <option value="moquette">${optMoquette}</option>
            <option value="carrelage">${optCarrelage}</option>
            <option value="lino">${optLino}</option>
            <option value="parquet">${optParquet}</option>
            <option value="autre">${optAutre}</option>
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
    let ttClean = langKey === 'vi' ? 'Đánh dấu các hành động cụ thể cần thực hiện trong phòng này.' : (langKey === 'en' ? 'Check the specific actions to be carried out in this room.' : 'Cochez les actions spécifiques à réaliser dans cette pièce.');
    let lblHygiene = langKey === 'vi' ? 'Lưu ý: Các tác vụ có ổ khóa 🔒 là bắt buộc.' : (langKey === 'en' ? 'Note: Tasks with a padlock 🔒 are mandatory.' : 'Note : Les tâches avec un cadenas 🔒 sont incluses obligatoirement.');
    let ttHygiene = langKey === 'vi' ? 'Bao gồm mặc định để đảm bảo tiêu chuẩn vệ sinh cơ bản.' : (langKey === 'en' ? 'Included automatically to guarantee basic hygiene standards.' : 'Inclus d\'office pour garantir les normes d\'hygiène de base.');
    let btnPlanDaysText = langKey === 'vi' ? '+ Lập kế hoạch ngày' : (langKey === 'en' ? '+ Schedule days' : '+ Planifier les jours');

    let html = `
    <div class="structured-room-card" id="row_${roomId}">
        <h5><span>${displayTitle}</span><button type="button" class="btn-delete-row" onclick="removeRoom('${roomId}')">×</button></h5>
        ${customNameHtml}
        ${qtyHtml}
        <div style="font-size:0.75rem; color:var(--bleu); font-weight:700; margin-top:5px; margin-bottom:8px; display:flex; align-items:center;">${lblCleanTitle} <span class="help-bubble">?<span class="tooltip-text">${ttClean}</span></span> :</div>
        ${prets.obligatoires && prets.obligatoires.length > 0 ? `<div style="font-size:0.65rem; color:#888; font-style:italic; margin-top:-5px; margin-bottom:5px; display:flex; align-items:center;">${lblHygiene} <span class="help-bubble">?<span class="tooltip-text">${ttHygiene}</span></span></div>` : ""}
        ${pretsHtml}
        <div style="margin-top:10px;"><button type="button" id="btn_plan_${roomId}" class="btn-planifier" onclick="openPlanningModal('${roomId}', '${type.replace(/'/g, "\\'")}')">${btnPlanDaysText}</button></div>
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
                selectedDays.forEach(dName => { if (mapDays[dName] === d) totalInterventions++; });
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
            if (consSelect && consSelect.value === 'osp') hasOspConsommables = true;

            let tempsMinutes = 0, nbEspaces = 1;

            if (type === 'Sanitaires' || type === 'Douche' || type === 'Vestiaire') {
                let inputH = document.getElementById(`qty_h_${roomId}`);
                let inputF = document.getElementById(`qty_f_${roomId}`);
                nbEspaces = (inputH ? parseInt(inputH.value) || 0 : 0) + (inputF ? parseInt(inputF.value) || 0 : 0);
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
                if (['Bureau', 'Salle de réunion', 'Accueil', 'Cuisine', 'Salle de repos', 'Salle de sport', 'Local technique'].includes(type)) tempsMinutes = 20; 
                else if (['Ascenseur principal', 'Ascenseur secondaire', 'Palier', 'Couloir'].includes(type)) tempsMinutes = 15; 
                else if (['Escalier principal', 'Escalier secondaire'].includes(type)) tempsMinutes = 25; 
                else if (['Parking', 'Terrasse'].includes(type)) tempsMinutes = 30; 
                else tempsMinutes = 20;
            }
            total += nbEspaces * ((tempsMinutes / 60) * TAUX_HORAIRE) * exactMultiplier;
        }
    }
    
    if (hasOspConsommables) {
        let nbEmployes = 1;
        let isEntreprise = document.querySelector('input[name="statut"][value="Entreprise"]')?.checked;
        if (isEntreprise) {
            let inputEmployes = document.getElementById('nbEmployes');
            if (inputEmployes && inputEmployes.value > 0) nbEmployes = parseInt(inputEmployes.value);
        }
        total += (nbEmployes * 7.00);
    }

    let originalTotal = total;
    window.originalTotalValue = originalTotal;
    let discountText = "";
    let totalDiscountPercent = 0;
    
    let appliedPromoDevis = window.promoDiscountDevis;
    let appliedClientDiscount = window.clientDiscount;
    let appliedHoliday = window.holidayPromoActive ? 0.05 : 0; 
    let conflict10 = false;

    let count10 = 0;
    if (appliedPromoDevis === 0.10) count10++;
    if (appliedClientDiscount === 0.10) count10++;
    if (count10 >= 2) { conflict10 = true; appliedPromoDevis = 0; }

    if (appliedClientDiscount > 0) totalDiscountPercent += appliedClientDiscount;
    if (appliedPromoDevis > 0) totalDiscountPercent += appliedPromoDevis;
    if (appliedHoliday > 0) totalDiscountPercent += appliedHoliday;

    let txtVip = langKey === 'vi' ? "✓ Mã VIP Thân thiết" : (langKey === 'en' ? "✓ VIP Loyalty Code" : "✓ Code VIP Fidélité");
    let txtHoliday = langKey === 'vi' ? "✓ Ưu đãi Ngày lễ" : (langKey === 'en' ? "✓ Holiday Offer" : "✓ Offre Jour Férié");
    let txtPromo = langKey === 'vi' ? "✓ Mã giảm giá" : (langKey === 'en' ? "✓ Promo Code" : "✓ Code Promo");
    let txtConflict = langKey === 'vi' ? "⚠️ Không thể cộng dồn hai mức giảm giá 10%." : (langKey === 'en' ? "⚠️ Two 10% discounts cannot be combined." : "⚠️ Deux réductions de 10% ne sont pas cumulables.");
    let txtSuper = (pct) => langKey === 'vi' ? `🎉 TUYỆT VỜI! Bạn nhận được tổng giảm giá ${pct}%!` : (langKey === 'en' ? `🎉 SUPER! You get a total discount of ${pct}%!` : `🎉 SUPER ! Vous bénéficiez de ${pct}% de remise totale !`);
    let txtOffre = (pct) => langKey === 'vi' ? `🎉 ƯU ĐÃI HIỆN TẠI: Giảm tổng cộng ${pct}%!` : (langKey === 'en' ? `🎉 CURRENT OFFER: Total discount of ${pct}%!` : `🎉 OFFRE EN COURS : ${pct}% de remise totale !`);

    if (totalDiscountPercent > 0) {
        total -= (originalTotal * totalDiscountPercent);
        if (appliedClientDiscount > 0) discountText += `<div class="price-discount-text">${txtVip} (-${appliedClientDiscount * 100}%)</div>`;
        if (appliedHoliday > 0) discountText += `<div class="price-discount-text">${txtHoliday} (-5%)</div>`;
        if (appliedPromoDevis > 0) discountText += `<div class="price-discount-text">${txtPromo} (-${appliedPromoDevis * 100}%)</div>`;
        if (conflict10) discountText += `<div class="price-min-alert" style="color: #e67e22; margin-top: 5px;">${txtConflict}</div>`;

        let pctTotalRounded = Math.round(totalDiscountPercent * 100);
        if (totalDiscountPercent >= 0.15) discountText += `<div class="price-discount-text" style="font-weight: 800; color: var(--vert); margin-top: 5px; font-size: 0.85rem;">${txtSuper(pctTotalRounded)}</div>`;
        else discountText += `<div class="price-discount-text" style="font-weight: 800; color: var(--vert); margin-top: 5px; font-size: 0.85rem;">${txtOffre(pctTotalRounded)}</div>`;
    }

    window.currentTotalValue = total;
    let txtAstuce = langKey === 'vi' ? "💡 Mẹo: Áp dụng mức tối thiểu hóa đơn 60,00 €. Hãy thêm dịch vụ khác." : (langKey === 'en' ? "💡 Tip: A minimum billing of 60.00 € applies. Add other services." : "💡 Astuce : Un minimum de facturation de 60,00 € s'applique. Ajoutez d'autres prestations.");
    let mentionMinimum = (total > 0 && total < 60.00) ? `<div class="price-min-alert" style="margin-top:8px;">${txtAstuce}</div>` : "";
    
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
    
    window.promoDiscountDevis = 0;
    window.activePromoCodeDevis = "";
    if (document.getElementById('promoCodeInputDevis')) document.getElementById('promoCodeInputDevis').value = "";
    if (document.getElementById('promoCodeMsgDevis')) document.getElementById('promoCodeMsgDevis').innerText = "";
    
    document.getElementById('topPriceBanner').style.display = "flex";
    document.getElementById('estimatedAmount').innerHTML = `<div class="price-left-main">0.00 €*</div>`;
    
    const fields = document.getElementById('dynamicFields');
    if (document.getElementById('customRowsContainer')) document.getElementById('customRowsContainer').innerHTML = '';
    
    let guideHtml = '';
    
    // Génération du guide dynamique selon le service sélectionné et la langue
    if (baseService === 'bureaux') {
        if (langKey === 'vi') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Hướng dẫn điền báo giá của bạn ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Các tầng:</b> Thêm các tầng cho cơ sở của bạn (Tầng trệt, tầng 1...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Các phòng:</b> Chi tiết các phòng cấu thành mỗi tầng.</li>
                    <li style="margin-bottom: 5px;"><b>3. Bảo dưỡng:</b> Chỉ định nội dung công việc cho từng phòng.</li>
                    <li style="margin-bottom: 5px;"><b>4. Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch" để xác định tần suất.</li>
                </ul>
            </div>`;
        } else if (langKey === 'en') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ How to fill out your quote?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Your levels:</b> Add the floors of your premises (Ground floor, 1st floor...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Your rooms:</b> Detail what makes up each level.</li>
                    <li style="margin-bottom: 5px;"><b>3. Maintenance:</b> Specify the tasks for each room.</li>
                    <li style="margin-bottom: 5px;"><b>4. Planning:</b> Click "+ Schedule" to define the frequency.</li>
                </ul>
            </div>`;
        } else {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Comment remplir votre devis ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Vos niveaux :</b> Ajoutez les étages de vos locaux (RDC, 1er étage...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Vos pièces :</b> Détaillez ce qui compose chaque niveau.</li>
                    <li style="margin-bottom: 5px;"><b>3. L'entretien :</b> Précisez le contenu de chaque pièce.</li>
                    <li style="margin-bottom: 5px;"><b>4. La planification :</b> Cliquez sur "+ Planifier" pour définir la fréquence.</li>
                </ul>
            </div>`;
        }
    } else if (baseService === 'vitrerie') {
        if (langKey === 'vi') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Hướng dẫn điền báo giá của bạn ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Cửa kính:</b> Chọn loại cửa sổ của bạn.</li>
                    <li style="margin-bottom: 5px;"><b>2. Số lượng:</b> Cho biết số lượng cửa.</li>
                    <li style="margin-bottom: 5px;"><b>3. Bảo dưỡng:</b> Chọn làm sạch Trong, Ngoài hoặc Toàn bộ.</li>
                    <li style="margin-bottom: 5px;"><b>4. Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch" để xác định ngày.</li>
                </ul>
            </div>`;
        } else if (langKey === 'en') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ How to fill out your quote?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Your windows:</b> Choose your window type.</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantity:</b> Indicate the number.</li>
                    <li style="margin-bottom: 5px;"><b>3. Maintenance:</b> Choose Interior, Exterior, or Complete.</li>
                    <li style="margin-bottom: 5px;"><b>4. Planning:</b> Click "+ Schedule" to define the frequency.</li>
                </ul>
            </div>`;
        } else {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Comment remplir votre devis ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Vos vitrages :</b> Choisissez le type de fenêtre.</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantité :</b> Indiquez le nombre.</li>
                    <li style="margin-bottom: 5px;"><b>3. Entretien :</b> Intérieur, Extérieur ou Complet.</li>
                    <li style="margin-bottom: 5px;"><b>4. Planification :</b> Cliquez sur "+ Planifier".</li>
                </ul>
            </div>`;
        }
    } else if (baseService === 'shampouinage') {
        if (langKey === 'vi') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Hướng dẫn điền báo giá của bạn ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Đồ vải:</b> Chọn loại (Sô pha, thảm...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Số lượng:</b> Cho biết số lượng cần làm sạch.</li>
                    <li style="margin-bottom: 5px;"><b>3. Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch" để chỉ định ngày mong muốn.</li>
                </ul>
            </div>`;
        } else if (langKey === 'en') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ How to fill out your quote?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Your textiles:</b> Select the type (Sofa, Rug...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantity:</b> Indicate the number to clean.</li>
                    <li style="margin-bottom: 5px;"><b>3. Planning:</b> Click "+ Schedule" to specify the desired date.</li>
                </ul>
            </div>`;
        } else {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Comment remplir votre devis ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Vos textiles :</b> Sélectionnez le type (Canapé, Tapis...).</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantité :</b> Indiquez le nombre à nettoyer.</li>
                    <li style="margin-bottom: 5px;"><b>3. Planification :</b> Cliquez sur "+ Planifier" pour préciser la date.</li>
                </ul>
            </div>`;
        }
    } else if (baseService === 'vehicule') {
        if (langKey === 'vi') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Hướng dẫn điền báo giá của bạn ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Xe của bạn:</b> Gói trọn gói đã được chọn.</li>
                    <li style="margin-bottom: 5px;"><b>2. Số lượng:</b> Cho biết số lượng xe.</li>
                    <li style="margin-bottom: 5px;"><b>3. Lập kế hoạch:</b> Nhấp vào "+ Lập kế hoạch" để chọn ngày can thiệp.</li>
                </ul>
            </div>`;
        } else if (langKey === 'en') {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ How to fill out your quote?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Your vehicle:</b> The full pack is selected.</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantity:</b> Indicate the number of vehicles.</li>
                    <li style="margin-bottom: 5px;"><b>3. Planning:</b> Click "+ Schedule" to choose an intervention date.</li>
                </ul>
            </div>`;
        } else {
            guideHtml = `
            <div class="guide-remplissage">
                <strong>ℹ️ Comment remplir votre devis ?</strong>
                <ul style="margin-top: 10px; padding-left: 20px; color: #444;">
                    <li style="margin-bottom: 5px;"><b>1. Votre véhicule :</b> Le pack complet est sélectionné.</li>
                    <li style="margin-bottom: 5px;"><b>2. Quantité :</b> Indiquez le nombre de véhicules.</li>
                    <li style="margin-bottom: 5px;"><b>3. Planification :</b> Cliquez sur "+ Planifier" pour choisir la date d'intervention.</li>
                </ul>
            </div>`;
        }
    }

    fields.innerHTML = guideHtml + `
        <div id="allServicesContainer" style="display:flex; flex-direction:column; gap:20px;"></div>
        <div id="crossSellContainer" style="margin-top:25px; padding-top:20px; border-top:2px dashed #e1e8ef; text-align:center;"></div>
    `;

    if (document.getElementById('btnAddCustomRow')) document.getElementById('btnAddCustomRow').style.display = 'flex';
    document.getElementById('interactiveForm').style.display = "block";
    document.getElementById('postSubmitChoice').style.display = "none";
    
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
        html += `<div style="display: grid; grid-template-columns: 1fr 45px 75px 75px 25px; gap: 5px; padding: 0 6px; margin-bottom: 8px; align-items: center;"><span style="font-size:0.60rem; font-weight:800; color:var(--bleu);">${lblPrest}</span><span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center;">${lblQte}</span><span style="font-size:0.60rem; font-weight:800; color:var(--bleu); text-align:center; display:flex; align-items:center; justify-content:center;">${lblType} <span class="help-bubble">?<span class="tooltip-text">${ttType}</span></span></span><span style="font-size:0.60rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span></span><span></span></div>`;
        
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
        html += `<div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;"><span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">${lblPrest}</span><span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">${lblQte}</span><span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span></span></div>`;
        
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
        let packName = langKey === 'vi' ? 'Gói trọn gói' : (langKey === 'en' ? 'Full Pack' : 'Pack Complet');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tVehicule}</h3>`;
        html += `<div style="display: grid; grid-template-columns: 1fr 60px 140px; gap: 10px; padding: 0 10px; margin-bottom: 8px;"><span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">${lblPrest}</span><span style="font-size:0.65rem; font-weight:800; color:var(--bleu);">${lblQte}</span><span style="font-size:0.65rem; font-weight:800; color:var(--vert); text-align:center; display:flex; align-items:center; justify-content:center;">${lblPlan} <span class="help-bubble">?<span class="tooltip-text">${ttPlan}</span></span></span></div>`;
        html += generateRowHtml('pack_v', packName);
    } else if(service === 'bureaux') {
        let tBureaux = langKey === 'vi' ? '🏢 Văn phòng & Cơ sở' : (langKey === 'en' ? '🏢 Offices & Premises' : '🏢 Bureaux & Locaux');
        let pText = langKey === 'vi' ? '<strong>Cấu trúc không gian của bạn:</strong> Chọn một tầng, sau đó thêm các phòng. <span class="help-bubble">?<span class="tooltip-text">Bước này giúp chúng tôi hiểu rõ sơ đồ bố trí chính xác cơ sở của bạn.</span></span>' : (langKey === 'en' ? '<strong>Structure your spaces:</strong> Choose a level, then add the rooms. <span class="help-bubble">?<span class="tooltip-text">This step allows us to understand the exact layout of your premises.</span></span>' : '<strong>Structurez vos espaces :</strong> Choisissez un niveau, puis ajoutez les pièces. <span class="help-bubble">?<span class="tooltip-text">Cette étape nous permet de comprendre l\'agencement exact de vos locaux.</span></span>');
        let btnAddLevel = langKey === 'vi' ? '<span>+</span> Thêm tầng hoặc khu vực ngoại cảnh' : (langKey === 'en' ? '<span>+</span> Add a level or outdoor area' : '<span>+</span> Ajouter un niveau ou espace extérieur');

        html += `<h3 style="color:var(--bleu); font-size:1.1rem; margin-bottom:15px; border-bottom:2px solid var(--vert); padding-bottom:5px;">${tBureaux}</h3>`;
        html += `<p style="font-size:0.85rem; color:var(--bleu); margin-bottom:15px; background:#eef3f8; padding:10px; border-radius:8px; border-left:4px solid var(--bleu);">${pText}</p><div id="levelsContainer"></div><button type="button" class="btn-add-row" onclick="openLevelModal()" style="margin-top: 15px;">${btnAddLevel}</button>`;
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

    updateCrossSellButtons(); calculatePrice();
    const newBlock = document.getElementById('block_' + service);
    if(newBlock) newBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCrossSellButtons() {
    const csContainer = document.getElementById('crossSellContainer');
    
    const availableServices = [ 
        { id: 'vitrerie', name_fr: '🪟 Vitrerie', name_en: '🪟 Windows', name_vi: '🪟 Lau kính' }, 
        { id: 'shampouinage', name_fr: '🛋️ Textiles', name_en: '🛋️ Textiles', name_vi: '🛋️ Giặt vải' }, 
        { id: 'vehicule', name_fr: '🚗 Véhicule', name_en: '🚗 Vehicle', name_vi: '🚗 Xe hơi' }, 
        { id: 'bureaux', name_fr: '🏢 Locaux', name_en: '🏢 Offices', name_vi: '🏢 Văn phòng' } 
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

function submitInteractiveForm() {
    try {
        const form = document.getElementById('interactiveForm');
        if (form.checkValidity()) {
            let elAmountText = document.getElementById('estimatedAmount').innerText.split('\n');
            let prixFinalAEnvoyer = elAmountText[elAmountText.length - 1]; 
            let majorationAppliquee = false;
            
            if (window.currentTotalValue > 0 && window.currentTotalValue < 60) {
                let messageAlerte = "";
                if (langKey === 'vi') {
                    messageAlerte = "⚠️ Ước tính chi tiết của bạn là " + window.currentTotalValue.toFixed(2) + " €.\n\n" +
                                    "Tuy nhiên, các dịch vụ của chúng tôi áp dụng mức tối thiểu hóa đơn là 60,00 € (để chi trả chi phí di chuyển và thiết bị).\n\n" +
                                    "💡 MẸO: Bạn có thể hủy và thêm các dịch vụ khác (Lau kính, Sô pha...) để đạt mốc 60 € này và tối ưu hóa chi phí bưu giá!\n\n" +
                                    "Bạn có muốn gửi yêu cầu với mức giá trọn gói tối thiểu là 60,00 € không?";
                } else if (langKey === 'en') {
                    messageAlerte = "⚠️ Your detailed estimate is " + window.currentTotalValue.toFixed(2) + " €.\n\n" +
                                    "However, our interventions are subject to a minimum billing of 60.00 € (to cover travel and equipment expenses).\n\n" +
                                    "💡 TIP: You can cancel and add other services (Windows, Sofas...) to reach this 60 € mark and get full value!\n\n" +
                                    "Do you still want to send the request at the flat rate of 60.00 €?";
                } else {
                    messageAlerte = "⚠️ Votre estimation détaillée s'élève à " + window.currentTotalValue.toFixed(2) + " €.\n\n" +
                                    "Cependant, nos interventions sont soumises à un minimum de facturation de 60,00 € (pour couvrir le déplacement et le matériel).\n\n" +
                                    "💡 ASTUCE : Vous pouvez annuler et ajouter d'autres prestations (Vitres, Canapés...) pour atteindre ces 60 € et rentabiliser votre devis !\n\n" +
                                    "Voulez-vous quand même envoyer la demande au prix forfaitaire de 60,00 € ?";
                }
                
                let clientAccepte = confirm(messageAlerte);
                if (!clientAccepte) return;
                majorationAppliquee = true;
                prixFinalAEnvoyer = langKey === 'vi' ? "60.00 € (Áp dụng mức tối thiểu trọn gói)" : (langKey === 'en' ? "60.00 € (Minimum flat rate applied)" : "60.00 € (Forfait minimum appliqué)");
            }

            let statut = "";
            const radios = document.getElementsByName('statut');
            for (let i = 0; i < radios.length; i++) { if (radios[i].checked) { statut = radios[i].value; break; } }

            const formDataPayload = {
                SessionID: "WEB_" + Date.now(),
                Statut: "En attente (Site Web)",
                NomClient: (statut === "Entreprise" && document.getElementById('nomEntreprise').value) ? document.getElementById('nomEntreprise').value : form.nom.value + " " + form.prenom.value,
                Email: form.email.value,
                Telephone: "Non renseigné sur le site",
                Adresse: form.adresse.value + ", " + form.ville.value,
                TypePrestation: activeServices.join(', '),
                Prix: prixFinalAEnvoyer,
                DataJSON: JSON.stringify({ activeServices: activeServices, planData: planData, interlocuteur: form.interlocuteur.value })
            };

            const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxu65v97Rz9WkgO3njSoxhbZ4cRV_Z8mRBCBwii_jS8YuS0uQCbJVBoUS5Bef_6j54F/exec";
            
            fetch(GOOGLE_API_URL, { 
                method: 'POST', 
                headers: { "Content-Type": "text/plain;charset=utf-8" }, 
                body: JSON.stringify(formDataPayload) 
            })
            .then(res => console.log("✅ Devis envoyé vers Google Sheets avec succès"))
            .catch(e => console.error("Erreur d'envoi vers Sheets:", e));

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
                    recap += `  - ${label} : ${q} (Nettoyage : ${typeVitrage})\n    Planning : ${getPlanningRecap(planData[idFull])}\n`;
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
                    recap += `  - ${fixesIds[id]} : ${q}\n    Planning : ${getPlanningRecap(planData[id])}\n`;
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
                    if (consSelect) recap += `    Consommables : ${consSelect.value === 'osp' ? 'Fournis par O.S.P+' : 'À la charge du client'}\n`;
                    
                    let prestCochees = [];
                    if (card) {
                        card.querySelectorAll('.prest-pill input[type="checkbox"]:checked').forEach(p => { prestCochees.push(p.parentElement.querySelector('label').innerText); });
                    }
                    recap += `    Prestations demandées : [${prestCochees.join(', ')}]\n    Planning de l'espace : ${getPlanningRecap(roomInfo)}\n`;
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
                        recap += `  - Description : "${textTextarea}" (Quantité/Répétition : x${qtyCustom})\n    Planning associé : ${getPlanningRecap(planData[id])}\n`;
                    }
                }
            }

            recap += `\n--- INFORMATIONS FINANCIÈRES ---\nBase de calcul initiale : ${window.originalTotalValue.toFixed(2)} €\n`;
            
            let conflict10 = false;
            let finalPromoDevis = window.promoDiscountDevis;
            let finalClientDiscount = window.clientDiscount;
            let countEmail10 = 0;
            if (finalPromoDevis === 0.10) countEmail10++;
            if (finalClientDiscount === 0.10) countEmail10++;
            if (countEmail10 >= 2) { finalPromoDevis = 0; conflict10 = true; }

            if (finalClientDiscount > 0) recap += `🎁 Remise Client VIP Fidélité (${finalClientDiscount * 100}%) active via Code : ${window.activeClientCode}\n`;
            if (finalPromoDevis > 0) recap += `🎁 Code Promo de validation (${finalPromoDevis * 100}%) appliqué avec le code : ${window.activePromoCodeDevis}\n`;
            if (window.holidayPromoActive) recap += `🎁 Promo Jour Férié (5%) appliquée (Contrat final à signer sous 15 jours)\n`;
            if (conflict10) recap += `⚠️ Un cumul de deux offres à 10% a été détecté et bloqué conformément à la politique tarifaire.\n`;
            
            let totalPercent = finalClientDiscount + finalPromoDevis + (window.holidayPromoActive ? 0.05 : 0);
            if (totalPercent > 0) recap += `✅ TOTAL DES REMISES CUMULÉES EXTRAITES : ${Math.round(totalPercent * 100)}%\n`;
            recap += `Prix final proposé au client : ${prixFinalAEnvoyer}\n`;
            if (majorationAppliquee) recap += `⚠️ Le client a validé et accepté la majoration forfaitaire à 60,00 € car son panier initial était trop faible.\n`;

            const btn = document.getElementById('btnSubmitForm');
            btn.innerText = "Envoi en cours..."; btn.disabled = true;
            
            emailjs.send('service_wfrbr4e', 'template_oncrl1l', {
                statut: statut, nom: form.nom.value, prenom: form.prenom.value, email: form.email.value, email_client: form.email.value,
                adresse: form.adresse.value, ville: form.ville.value, interlocuteur: form.interlocuteur.value, prix: prixFinalAEnvoyer, recapitulatif: recap
            }).then(() => {
                if (window.activeClientCode || window.activePromoCodeDevis) {
                    let codeUtilise = window.activeClientCode || window.activePromoCodeDevis;
                    let messageAlerte = `⚠️ ALERTE IMPORTANTE :\n\nLe code de remise "${codeUtilise}" vient d'être utilisé par ${form.nom.value} ${form.prenom.value} (Email: ${form.email.value}).\n\nSi ce code est à usage unique, n'oubliez pas d'ajouter la mention "-FIN" à côté du code dans votre fichier codes.js pour le désactiver.`;
                    
                    emailjs.send('service_wfrbr4e', 'template_alerte_code', {
                        alerte_message: messageAlerte,
                        code_utilise: codeUtilise
                    }).then(() => {
                        console.log("Email d'alerte code envoyé !");
                    }).catch((error) => {
                         console.error("Erreur lors de l'envoi de l'alerte code :", error);
                    });
                }

                form.style.display = "none"; document.getElementById('postSubmitChoice').style.display = "block";
            }).catch((error) => {
                console.error("Erreur détaillée EmailJS :", error);
                form.style.display = "none";
                let surchargeMessage = document.createElement('div');
                surchargeMessage.innerHTML = `
                    <div style="background: #fdf8e4; border-left: 5px solid var(--vert); padding: 25px; border-radius: 8px; text-align: center; margin-top: 20px; animation: fadeInDown 0.5s ease; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        <h3 style="color: var(--bleu); margin-bottom: 15px; font-size: 1.4rem;">🔥 Victime de notre succès !</h3>
                        <p style="color: #444; font-size: 1rem; margin-bottom: 15px; line-height: 1.5;">En raison d'un <strong>très grand nombre de demandes de devis</strong> aujourd'hui, notre systeme automatique est temporairement saturé.</p>
                        <p style="color: #444; font-size: 1rem; margin-bottom: 20px;">Pas d'inquiétude, votre estimation (<strong>${prixFinalAEnvoyer}</strong>) a bien été calculée ! Pour ne pas perdre votre demande et la traiter en priorité, contactez-moi directement :</p>
                        <a href="mailto:alexandre.jonot@ospplus.com?subject=Validation devis prioritaire OSP+ - ${prixFinalAEnvoyer}" style="display: inline-block; background: var(--vert); color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size: 1.1rem; margin-bottom: 15px; transition: transform 0.2s;">✉️ alexandre.jonot@ospplus.com</a>
                        <p style="color: var(--bleu); font-weight: 800; font-size: 1.1rem; margin-top: 5px;">📞 Ou par téléphone au 07 45 02 76 24</p>
                    </div>`;
                form.parentNode.insertBefore(surchargeMessage, form);
            });
        } else { form.reportValidity(); }
    } catch (erreurGlobale) {
        console.error("Erreur inattendue dans le script :", erreurGlobale);
        alert("Une erreur inattendue empêche l'envoi. Rechargez la page ou contactez-moi au 07 45 02 76 24.");
        document.getElementById('btnSubmitForm').innerText = "ENVOYER MON DEVIS"; document.getElementById('btnSubmitForm').disabled = false;
    }
}

function closeQuote() { document.getElementById('quoteModal').style.display = "none"; }

window.onclick = function(e) { 
    if(e.target.id === 'quoteModal') closeQuote(); 
    if(e.target.id === 'clientModal') closeClientModal(); 
    if(e.target.id === 'mentionsModal') closeMentions(); 
    if(e.target.id === 'levelModal') closeLevelModal();
    if(e.target.id === 'planningModal') document.getElementById('planningModal').style.display = "none";
    if(e.target.id === 'carteModal') closeCarteModal();
    if(e.target.id === 'imageModal') closeImageModal(); 
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
    const badges = document.querySelectorAll('.dynamic-badge');
    if (badges.length === 0) return;
    const dateActuelle = new Date(), anneeEnCours = dateActuelle.getFullYear(), dateLancement = new Date(anneeEnCours, 7, 15); 
    badges.forEach(badge => { badge.innerText = (dateActuelle >= dateLancement) ? "Nouveau service" : "Dispo le 15 Août"; });
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
// ⌨️ ACCESSIBILITÉ : NAVIGATION AU CLAVIER (ENTRÉE / ESPACE)
// ==========================================
document.addEventListener('keydown', function(event) {
    // Vérifie si la touche pressée est "Entrée" ou "Espace"
    if (event.key === 'Enter' || event.key === ' ') {
        // Récupère l'élément actuellement surligné (en focus jaune)
        let elementActif = document.activeElement;
        
        // Si cet élément est défini comme un bouton accessible
        if (elementActif && elementActif.getAttribute('role') === 'button') {
            event.preventDefault(); // Empêche la page de scroller si on appuie sur Espace
            elementActif.click();   // Simule un clic de souris virtuel
        }
    }
});