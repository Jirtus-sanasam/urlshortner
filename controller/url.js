const shortid = require('shortid');
const Url = require('../models/url');

async function handleGenerateShortUrl(req, res){
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: "Missing long URL" });
    }
    const shortId = shortid.generate();

    await Url.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: []
    });

    return res.json ({ id: shortId});
}

async function handleRedirect(req, res) {
    const { shortId } = req.params;
    try {
        const entry = await Url.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timeStamp: Date.now() } } },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        return res.redirect(entry.redirectUrl);
    } catch (error) {
        console.error("Error handling redirect:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


async function handleGetAnalytics (req, res) {
    const shortId = req.params.shortId;
    const result = await Url.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory });
}



module.exports = {
    handleGenerateShortUrl,
    handleRedirect,
    handleGetAnalytics
}