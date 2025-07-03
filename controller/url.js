const shortid = require("shortid");
const Url = require("../models/url");

async function handleGenerateShortUrl(req, res) {
  const body = req.body;

  if (!body.redirectUrl) {
    return res.status(400).json({ error: "Missing long URL" });
  }
  const shortId = shortid();

  await Url.create({
    shortId: shortId,
    redirectUrl: body.redirectUrl,
    visitHistory: [],
  });

  return res.render("home", {
    shortId: shortId,
  });
}

async function handleRedirect(req, res) {
  const shortId = req.params.shortId;

  try {
    const entry = await Url.findOne(
      { shortId }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    entry.visitHistory.push({ timeStamp: Date.now() });
    await entry.save();

    res.redirect(entry.redirectUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await Url.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateShortUrl,
  handleRedirect,
  handleGetAnalytics,
};
