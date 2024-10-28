const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Register for the airdrop (first 1 million users)
router.post('/register', async (req, res) => {
    const { telegramId, username, referrerId } = req.body;
    try {
        // Check if the airdrop limit is reached
        const totalUsers = await User.countDocuments();
        if (totalUsers >= 1000000) {
            return res.status(400).json({ message: 'Airdrop limit reached' });
        }

        // Check if user already registered
        const existingUser = await User.findOne({ telegramId });
        if (existingUser) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Create new user
        const newUser = new User({ telegramId, username, referrerId });
        await newUser.save();

        // Increment referrer's referral count if referrerId is provided
        if (referrerId) {
            await User.findOneAndUpdate({ _id: referrerId }, { $inc: { referralCount: 1 } });
        }

        res.status(201).json({ message: 'Successfully registered for the airdrop' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Complete a task
router.post('/complete_task', async (req, res) => {
    const { telegramId, taskName } = req.body;
    try {
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the task is already completed
        if (user.tasksCompleted.includes(taskName)) {
            return res.status(400).json({ message: 'Task already completed' });
        }

        // Add task to completed tasks and update balance
        user.tasksCompleted.push(taskName);
        user.balance += 10; // Each task gives 10 coins (example)
        await user.save();

        res.status(200).json({ message: 'Task completed successfully', balance: user.balance });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find().sort({ referralCount: -1 }).limit(10);
        res.json(topUsers);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
