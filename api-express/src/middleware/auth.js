export const requireAuth = (req, res, next) => {
  if (req.session && req.session.user_id) {
    next()
  } else {
    res.status(401).json({ error: 'Authentication required' })
  }
}

