"use strict";

const fs = require("fs");
// TODO: replace with node-fetch
const request = require("request-promise-native");
const cheerio = require("cheerio");
const { batch } = require("./batch");

const url = "https://ultimateframedata.com";

async function scrape() {
  const characterUrls = await collectCharacterUrls();

  let frameData = [];

  const batches = batch(characterUrls, 4);
  for (const b of batches) {
    const r = await Promise.all(b.map(url => collectFrameData(url)));
    frameData = frameData.concat(r);
  }
  fs.writeFileSync("./smash.json", JSON.stringify(frameData, undefined, 2));
}

async function collectCharacterUrls() {
  const res = await request(url);
  const $ = cheerio.load(res);

  const result = [];
  $("#charList a[href]").each((i, linkElement) => {
    // Skip 'Stats'
    if (i === 0) {
      return;
    }

    const characterUrl = url + linkElement.attribs["href"];
    result.push(characterUrl);
  });
  return result;
}

async function collectFrameData(url) {
  const res = await request(url);
  console.log(`Visited ${url}`);
  const $ = cheerio.load(res);
  const character = $("h1")
    .text()
    .replace(/\n/g, "");

  const categories = [];
  // Select all categories from a character i.e. 'Ground Attacks' or 'Aerial Attacks'
  $(".movecategory").each((_, categoryElement) => {
    // Extract the ID of the category as a unique identifier
    const category = categoryElement.attribs["id"];
    if (category === "misc") {
      return;
    }
    console.log("Scraping category:", category);

    const moves = [];
    // Select all cards from the category
    $(categoryElement)
      .next("")
      .children(".movecontainer")
      .each((_, cardElement) => {
        const move = makeMoveFromCard($, cardElement);
        moves.push(move);
      });

    categories.push({
      category,
      moves
    });
  });

  return {
    character,
    categories
  };
}

scrape();

function makeMoveFromCard($, cardElement) {
  const moveName = $(".movename", cardElement)
    .text()
    .trim();
  const startUp = $(".startup", cardElement)
    .text()
    .trim();
  const advantage = $(".advantage", cardElement)
    .text()
    .trim();
  const activeFrames = $(".activeFrames", cardElement)
    .text()
    .trim();
  const totalFrames = $(".totalframes", cardElement)
    .text()
    .trim();
  const landingLag = $(".landinglag", cardElement)
    .text()
    .trim();
  const notes = $(".notes", cardElement)
    .text()
    .trim();
  const baseDamage = $(".basedamage", cardElement)
    .text()
    .trim();
  const shieldLag = $(".shieldlag", cardElement)
    .text()
    .trim();
  const shieldStun = $(".shieldStun", cardElement)
    .text()
    .trim();
  const whichHitbox = $(".whichhitbox", cardElement)
    .text()
    .trim();

  return {
    moveName,
    startUp,
    advantage,
    activeFrames,
    totalFrames,
    landingLag,
    notes,
    baseDamage,
    shieldLag,
    shieldStun,
    whichHitbox
  };
}
