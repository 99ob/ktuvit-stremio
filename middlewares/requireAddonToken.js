const crypto = require("crypto");

const token = process.env.ADDON_TOKEN;
if (!token || token.length < 32) {
  throw new Error("ADDON_TOKEN must contain at least 32 characters");
}
const expected = crypto.createHash("sha256").update(token).digest();

module.exports = (req, res, next) => {
  const supplied = req.params.token;
  if (typeof supplied !== "string") {
    return res.status(403).json({ error: "Forbidden" });
  }
  const actual = crypto.createHash("sha256").update(supplied).digest();
  if (!crypto.timingSafeEqual(actual, expected)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.set("Cache-Control", "no-store");
  res.set("Referrer-Policy", "no-referrer");
  next();
};
