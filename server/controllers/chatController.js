/**
 * Agricultural Knowledge Base Chatbot
 * Handles /api/chat with keyword-matching + domain knowledge
 */

const AGRI_KNOWLEDGE = [
    // === CROPS ===
    {
        keywords: ['tomato', 'tamatar'],
        response: '🍅 Tomato Tips:\n• Best season: Oct–Feb (Rabi) and June–Aug (Kharif)\n• Water every 2–3 days\n• Common diseases: Early blight, Late blight\n• Current avg. price: ₹20–45/kg at APMC\n• Use drip irrigation for best results'
    },
    {
        keywords: ['onion', 'pyaaz', 'kanda'],
        response: '🧅 Onion Farming:\n• Sowing time: Oct–Nov (Rabi), May–June (Kharif)\n• Requires well-drained loamy soil\n• Harvest in 90–120 days\n• Current avg. price: ₹15–30/kg\n• Store in cool, dry place to prevent rotting'
    },
    {
        keywords: ['wheat', 'gehu', 'gehun'],
        response: '🌾 Wheat Farming:\n• Best sown: Nov–Dec (Rabi crop)\n• Needs 5–6 irrigations\n• Harvest: Mar–Apr\n• MSP: ₹2,275/quintal (2024–25)\n• Use certified seeds like GW-496, HD-3086'
    },
    {
        keywords: ['rice', 'paddy', 'dhan', 'chawal'],
        response: '🌾 Rice/Paddy Farming:\n• Kharif crop: June–November\n• Transplanting: 25–30 day old seedlings\n• Water standing: 5–7cm depth\n• MSP: ₹2,300/quintal (2024–25)\n• Common varieties: IR-64, Basmati, Pusa-1121'
    },
    {
        keywords: ['cotton', 'kapas', 'kapas'],
        response: '🌿 Cotton Farming:\n• Sow: April–June\n• Needs 60–75cm rainfall\n• Harvest: Oct–Jan\n• MSP (medium): ₹7,121/quintal\n• Watch for bollworm — use pheromone traps'
    },
    {
        keywords: ['potato', 'aloo', 'batata'],
        response: '🥔 Potato Farming:\n• Best sown: Oct–Nov (Rabi)\n• Cool weather crop (15–25°C)\n• Ready in 70–120 days\n• Common disease: Late blight — spray mancozeb\n• Current price: ₹10–20/kg'
    },
    {
        keywords: ['sugarcane', 'ganna', 'sarkand'],
        response: '🎋 Sugarcane:\n• Plant: Feb–Mar or Oct–Nov\n• Takes 10–12 months to mature\n• Needs 1500–2500mm water yearly\n• FRP: ₹340/quintal (2024–25)\n• Use inter-cropping with legumes'
    },
    {
        keywords: ['soybean', 'soya'],
        response: '🌱 Soybean:\n• Kharif crop — sow Jun–Jul\n• Deep, well-drained soil needed\n• Harvest: Sep–Oct\n• MSP: ₹4,892/quintal\n• Boosts soil nitrogen naturally'
    },

    // === DISEASES ===
    {
        keywords: ['blight', 'jhulsa', 'disease', 'bimaari'],
        response: '🦠 Crop Disease Alert:\n• Early Blight: Brown spots on lower leaves → spray Mancozeb 75WP\n• Late Blight: Water-soaked patches → spray Metalaxyl + Mancozeb\n• Bacterial Spot: Dark lesions → copper-based spray\n• Prevention: Crop rotation, remove infected plants early\n• Use our Camera scan for AI diagnosis!'
    },
    {
        keywords: ['pest', 'keede', 'insect', 'keet'],
        response: '🐛 Pest Management:\n• Bollworm: Use Bt spray or pheromone traps\n• Aphids: Neem oil spray (5ml/liter)\n• Whitefly: Yellow sticky traps\n• Spider mites: Increase humidity, miticide spray\n• Always spray in morning or evening, not midday'
    },
    {
        keywords: ['fertilizer', 'khad', 'urea', 'npk'],
        response: '🌿 Fertilizer Guide:\n• Urea (N): Apply in 2 splits — basal + 30 days\n• DAP (P+N): Best applied at sowing\n• MOP (K): Improves drought resistance\n• Organic: Vermicompost gives best long-term results\n• Soil test before applying to avoid over-fertilization'
    },
    {
        keywords: ['spray', 'fungicide', 'pesticide', 'dawa'],
        response: '💊 Spraying Tips:\n• Spray in early morning (6–9am) or evening (4–7pm)\n• Avoid spraying before rain\n• Use proper safety gear (mask, gloves)\n• Common fungicides: Mancozeb, Carbendazim, Propiconazole\n• Don\'t spray in hot sun — reduces effectiveness'
    },

    // === WEATHER ===
    {
        keywords: ['weather', 'mausam', 'rain', 'barish', 'temperature'],
        response: '🌤️ Weather Advice:\n• Check IMD (mausam.imd.gov.in) for daily forecasts\n• Before monsoon: prepare field bunding, drainage\n• During heavy rain: avoid spraying chemicals\n• Drought tips: mulching, drip irrigation\n• Frost protection: smoke pots, cover plants at night'
    },
    {
        keywords: ['monsoon', 'kharif', 'sawan', 'barsaat'],
        response: '🌧️ Monsoon Farming:\n• Kharif season: June–October\n• Best crops: Paddy, Cotton, Soybean, Maize\n• Ensure field drainage to prevent waterlogging\n• Apply fungicides preventively in wet conditions\n• Start soil preparation 15 days before rains'
    },

    // === MARKET PRICES ===
    {
        keywords: ['price', 'rate', 'cost', 'bhaav', 'daam', 'apmc', 'mandi'],
        response: '💰 Market Price Info:\n• Check real-time prices at agmarknet.gov.in\n• Tomato: ₹20–45/kg\n• Onion: ₹15–30/kg\n• Potato: ₹10–20/kg\n• Wheat: ₹22–28/kg\n• Rice: ₹25–40/kg\n• Tip: Sell 2–3 weeks after harvest when glut passes'
    },
    {
        keywords: ['msp', 'minimum support', 'support price'],
        response: '📊 MSP 2024–25:\n• Wheat: ₹2,275/quintal\n• Paddy (Common): ₹2,300/quintal\n• Cotton (Medium): ₹7,121/quintal\n• Soybean: ₹4,892/quintal\n• Maize: ₹2,090/quintal\n• Groundnut: ₹6,783/quintal\n• Source: CACP, Govt. of India'
    },

    // === GOVERNMENT SCHEMES ===
    {
        keywords: ['scheme', 'yojana', 'subsidy', 'loan', 'credit', 'kisan', 'pm'],
        response: '🏛️ Govt Schemes for Farmers:\n• PM-KISAN: ₹6,000/year direct transfer\n• PM Fasal Bima: Crop insurance scheme\n• Kisan Credit Card: Low-interest farm loans\n• eNAM: Online mandi platform\n• PM Kusum: Solar pump subsidy\n• Apply at your nearest CSC center or pmkisan.gov.in'
    },
    {
        keywords: ['insurance', 'bima', 'fasal'],
        response: '🛡️ Crop Insurance (PMFBY):\n• Covers: Natural calamities, pests, diseases\n• Premium: 2% for Kharif, 1.5% for Rabi\n• Enroll through your bank or CSC before cutoff date\n• Claim online at pmfby.gov.in\n• Documents needed: Land record, Aadhaar, Bank passbook'
    },

    // === SOIL ===
    {
        keywords: ['soil', 'mitti', 'ph', 'test'],
        response: '🌱 Soil Health Tips:\n• Test soil every 3 years at Soil Testing Lab (free/subsidized)\n• Ideal pH for most crops: 6.0–7.5\n• Low pH (acid): Add lime\n• High pH (alkaline): Add gypsum or sulfur\n• Organic matter target: >1%\n• Get your Soil Health Card from local agriculture office'
    },
    {
        keywords: ['irrigation', 'paani', 'water', 'drip', 'sprinkler'],
        response: '💧 Irrigation Guide:\n• Drip irrigation saves 40–50% water — get subsidy under PMKSY\n• Sprinkler: Best for wheat, vegetables\n• Furrow irrigation: Rice, sugarcane\n• Water in early morning to reduce evaporation\n• Signs of over-watering: yellowing, root rot'
    },

    // === GREETINGS ===
    {
        keywords: ['hello', 'hi', 'namaste', 'namaskar', 'hey'],
        response: '🙏 Namaste! I am Agri-Vani, your farming assistant.\n\nI can help you with:\n• 🌾 Crop advice & planting tips\n• 🦠 Disease identification & treatment\n• 💰 Market prices & MSP rates\n• 🏛️ Government schemes & subsidies\n• 💧 Irrigation & fertilizer guidance\n\nAsk me anything about farming!'
    },
    {
        keywords: ['help', 'madad', 'kya', 'what can'],
        response: '🤖 I can answer questions about:\n\n1. Crop selection & timing\n2. Disease & pest control\n3. Fertilizers & soil health\n4. Market prices & MSP\n5. Government schemes\n6. Irrigation methods\n\nJust type or speak your question!'
    },
    {
        keywords: ['thank', 'shukriya', 'dhanyawad'],
        response: '🙏 You\'re welcome! Happy farming! 🌱\n\nRemember: For AI plant disease detection, use the Camera feature in Agri-Vani!'
    },
];

const DEFAULT_RESPONSE = '🌾 I don\'t have specific info on that yet. Try asking about:\n• Specific crops (tomato, wheat, rice, onion)\n• Diseases or pests\n• Market prices or MSP\n• Government schemes\n• Fertilizers or irrigation\n\nOr use the Camera to scan your plant for disease detection!';

/**
 * Find the best matching response for a given question
 */
function getAgriResponse(question) {
    const q = question.toLowerCase().trim();

    // Find all matching topics and pick the one with most keyword matches
    let bestMatch = null;
    let bestScore = 0;

    for (const topic of AGRI_KNOWLEDGE) {
        const score = topic.keywords.filter(kw => q.includes(kw.toLowerCase())).length;
        if (score > bestScore) {
            bestScore = score;
            bestMatch = topic;
        }
    }

    return bestMatch ? bestMatch.response : DEFAULT_RESPONSE;
}

module.exports = { getAgriResponse };
