export function requireBuyerRole(req, res, next) {
  if (!req.user || !req.user.roles?.includes('buyer')) {
    return res.status(403).json({ error: "Buyer role required" })
  }
  next()
}

export function requireBuyerPro(req, res, next) {
  if (!req.user || !req.user.isPro) {
    return res.status(403).json({ error: "Buyer Pro subscription required" })
  }
  next()
}
