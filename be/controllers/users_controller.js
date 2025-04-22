const users = require('../database/users.json');

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        if (user.password === password) {
            res.json({ success: true, user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }});
        } else {
            res.status(401).json({ success: false, message: 'Incorrect password' });
        }
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
}; 