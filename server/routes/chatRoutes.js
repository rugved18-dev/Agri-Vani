const express = require('express');
const { getAgriResponse } = require('../controllers/chatController');
const router = express.Router();

/**
 * POST /api/chat
 * Body: { question: string, language?: string }
 * Public route — no auth required for chat
 */
router.post('/', (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({ success: false, message: 'Question is required' });
        }

        console.log(`💬 Chat question: "${question}"`);
        const answer = getAgriResponse(question);
        console.log(`🤖 Answer: ${answer.substring(0, 60)}...`);

        res.status(200).json({ success: true, answer });
    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
