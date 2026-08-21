
const { Readable } = require("stream");
const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile({ buffer, fileName, folder = "" }) {
  try {
    const file = await client.files.upload({
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
