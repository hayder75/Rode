const User = require('../models/User');
const Question = require('../models/Question');
const TestAttempt = require('../models/TestAttempt');
const jwt = require('jsonwebtoken');

// User Registration
const registerUser = async (req, res) => {
    const { name, phoneNumber, password, role, school } = req.body; // Removed state from destructuring
    try {
        // Create a new user with default values for hasPaid and state
        const newUser = new User({
            name,
            phoneNumber,
            password,
            role,
            school,
            hasPaid: false, // Default to false if payment not made
            state: "Not Verified" // Default state is 'Not Verified'
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// User Login
const loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get Questions
// Get Questions
const getQuestions = async (req, res) => {
    const { stream, subject, year } = req.query; // Accept year as query parameter
    try {
        const questions = await Question.find({ stream, subject, year }); // Filter by year
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching questions', error });
    }
};

// Get List of Subjects Based on User Role
const getSubjects = async (req, res) => {
    const { role } = req.query; // Expecting role as a query parameter

    let subjects;

    if (role === 'Natural') {
        subjects = ['Math', 'English', 'Biology', 'Chemistry']; // Natural subjects
    } else if (role === 'Social') {
        subjects = ['Math', 'History', 'Geography']; // Social subjects
    } else {
        return res.status(400).json({ message: 'Invalid role' });
    }

    res.json({ subjects });
};


const getTestYearsBySubject = async (req, res) => {
    const { subject } = req.query; // Expecting subject as a query parameter

    try {
        // Find distinct years for the specified subject
        const years = await Question.distinct('year', { subject });

        if (years.length === 0) {
            return res.status(404).json({ message: 'Tests not uploaded yet for this subject.' });
        }

        res.json({ years });
    } catch (error) {
        console.error('Error fetching test years:', error);
        res.status(500).json({ message: 'Error fetching test years', error: error.message });
    }
};


// Submit Test Attempt
const submitTestAttempt = async (req, res) => {
    const { userId, questions } = req.body;
    
    try {
        let score = 0;
        const totalQuestions = questions.length;

        for (let question of questions) {
            const correctQuestion = await Question.findById(question.questionId);
            if (correctQuestion.correctAnswer === question.userAnswer) {
                score++;
            }
        }

        const testAttempt = new TestAttempt({
            userId,
            questions,
            score,
            totalQuestions,
        });

        await testAttempt.save();
        res.status(201).json({ message: 'Test attempt submitted successfully', score });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting test attempt', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getQuestions,
    submitTestAttempt,
    getSubjects,
    getTestYearsBySubject,
};
