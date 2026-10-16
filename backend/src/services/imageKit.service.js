
const { Readable } = require("stream");
const ImageKit = require("@imagekit/nodejs");

// Created lazily so the server can boot (and show a clear error) even if the key is missing
let client = null;
const getClient = () => {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not set on the server");
  }
  if (!client) client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY });
  return client;
};

async function uploadFile({ buffer, fileName, folder = "" }) {
  try {
    const file = await getClient().files.upload({
      file: Readable.from(buffer),
      // file: buffer.toString("base64"),
      fileName,
      folder,
    });

    
    return file;
  } catch (error) {
    console.error("IMAGEKIT ERROR:");
    console.error(error);
    throw error;
  }
}
module.exports = { uploadFile };
