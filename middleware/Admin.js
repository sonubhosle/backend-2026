const admin = (role) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: No user information found' });
        }

        if (user.role !== role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
};

module.exports= admin;