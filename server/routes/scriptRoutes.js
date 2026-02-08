import express from 'express';
import Script from '../models/Script.js';

const router = express.Router();

// Get all scripts for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const scripts = await Script.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json(scripts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Community Scripts (Public)
router.get('/community', async (req, res) => {
    try {
        const scripts = await Script.find({ isPublic: true }).sort({ likes: -1, createdAt: -1 }).limit(50);
        res.json(scripts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Toggle Public/Private
router.put('/:id/public', async (req, res) => {
    try {
        const script = await Script.findById(req.params.id);
        if (!script) return res.status(404).json({ message: 'Script not found' });

        script.isPublic = !script.isPublic;
        await script.save();
        res.json(script);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Like a Script
router.put('/:id/like', async (req, res) => {
    try {
        const script = await Script.findById(req.params.id);
        if (!script) return res.status(404).json({ message: 'Script not found' });

        script.likes += 1;
        await script.save();
        res.json(script);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
