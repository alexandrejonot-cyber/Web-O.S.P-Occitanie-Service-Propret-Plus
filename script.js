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

            // 1. CRÉATION DU RÉCAPITULATIF COMPLET
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

            // 2. ENVOI DES DONNÉES ET DU RÉCAPITULATIF À GOOGLE DRIVE POUR LE PDF
            const formDataPayload = {
                "Date": new Date().toLocaleString('fr-FR'),
                "Session ID": "WEB_" + Date.now(),
                "Nom Client": (statut === "Entreprise" && document.getElementById('nomEntreprise').value) ? document.getElementById('nomEntreprise').value : form.nom.value,
                "Prénom Client": form.prenom.value,
                "Email": form.email.value,
                "Téléphone": form.telephone ? form.telephone.value : "Non renseigné",
                "Adresse": form.adresse.value + ", " + form.ville.value,
                "Statut": statut,
                "Type Prestation": activeServices.join(', '), 
                "Prix": prixFinalAEnvoyer,
                "Recapitulatif": recap // <-- C'est ici que l'on envoie le texte au Google Doc !
            };

            const GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbw5jZjmo7OcFUZG4BOZtqgE_zpY0wSn-eoep-jmoSKGfsfK1ud-DjHd0pMcSsinSqbu/exec";
            
            fetch(GOOGLE_API_URL, { 
                method: 'POST', 
                headers: { "Content-Type": "text/plain;charset=utf-8" }, 
                body: JSON.stringify(formDataPayload) 
            })
            .then(res => console.log("✅ Données envoyées vers Google Drive pour création du PDF"))
            .catch(e => console.error("Erreur d'envoi vers Google:", e));

            // 3. ENVOI DE L'EMAIL VIA EMAILJS
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