import { TwitterApi } from 'twitter-api-v2';
import { promises as fs } from "fs";
import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_SECRET
});


const downloadImage = async (url, path) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(path, buffer);
}

await downloadImage("https://sabe.io/images/saturn.png", "images/saturn.png");


const mediaId = await Promise.all([
  // file path
  client.v1.uploadMedia('images/saturn.png'),
]);

await client.v1.tweet('Quack', { media_ids: mediaId });
console.log("image/tweet posted");