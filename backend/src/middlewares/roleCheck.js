const roleCheck = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            return res.status(401).json({ message: 'Unauthorized: No user role found' });
        }
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }
        next();
    };
};

export default roleCheck;