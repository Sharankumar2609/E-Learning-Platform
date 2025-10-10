const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");

// Generates a short-lived SAS URL to upload a blob directly from browser
router.get("/sas", auth("teacher"), async (req, res) => {
  try {
    const { filename, contentType } = req.query;
    if (!filename) return res.status(400).json({ error: "filename is required" });
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    const containerName = process.env.AZURE_STORAGE_CONTAINER || "uploads";
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const now = new Date();
    const expiry = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    const sas = generateBlobSASQueryParameters({
      containerName,
      blobName: filename,
      startsOn: now,
      expiresOn: expiry,
      permissions: BlobSASPermissions.parse("cw"), // create, write
      contentType: contentType || undefined,
    }, sharedKeyCredential).toString();

    const uploadUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(filename)}?${sas}`;
    const blobUrl = `https://${accountName}.blob.core.windows.net/${containerName}/${encodeURIComponent(filename)}`;
    res.json({ uploadUrl, blobUrl, expiresOn: expiry.toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;


