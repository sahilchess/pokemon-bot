//--------------------setup-----------------------------------------------------------
const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});
//-------------------------help------------------------------------------------------
app.command("/pb-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/ pb-pokemonfact [pokemon name or id] - Get a fun fact about a Pokémon. Example: /pb-pokemonfact pikachu
/ pb-berrydeets [berry name] - Get a fun fact about a Berry. Example: /pb-berrydeets oran
/ pb-list-berries - List all the berries you can ask about with /pb-berrydeets
/ pb-ping - Check the bot's latency`
  });
});
//----------------------------------pokemon fact---------------------------------------------
app.command("/pb-pokemonfact", async ({ command, ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${command.text}`);
    const conv_height = response.data.height/10 
    const conv_weight = response.data.weight/10
    const cry_url = response.data.cries.latest
    const onesDigit = response.data.id % 10
    if (onesDigit === 1 && response.data.id !== 11) {
      const numberEnding = "st"
    }
    else if (onesDigit === 2 && response.data.id !== 12){
      const numberEnding = "nd"
    }
    else if (onesDigit === 3 && response.data.id !== 13){
      const numberEnding = "rd"
    }
    else {
      const numberEnding = "th"
    }
    await respond({text:`${response.data.name} is the ${response.data.id}${numberEnding} Pokémon in the Pokédex has a height of ${conv_height} meters, a weight of ${conv_weight} kilograms. You can hear its cry <${cry_url}|here>.`});

  } catch (err) {
    await respond({ text: "Failed to fetch a Pokémon info." });
  }
});


//--------------------------------list berries------------------------------------------------
app.command("/pb-list-berries", async ({ ack, respond }) => {
  await ack();
  await respond({
    text: `Here are the berries you can ask about with /pb-berrydeets:
- Cheri
- Chesto
- Pecha
- Rawst
- Aspear
- Leppa
- Oran
- Persim
- Lum
- Sitrus
- Figy
- Wiki
- Mago
- Aguav
- Iapapa
- Razz
- Bluk
- Nanab
- Wepear
- Pinap`,
  });
});

//-----------------------------berry facts--------------------------------------------------
app.command("/pb-berrydeets", async ({ command, ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/berry/${command.text}/`);
    await respond({text:`The ${response.data.name} berry has a size of ${response.data.size} millimeters and a growth time of ${response.data.growth_time} hours.`});

  } catch (err) {
    await respond({ text: "Failed to fetch a Berry fact. Maybe your berry spelling is wrong?" });
  }
});
//-------------------------ping------------------------------------------------------
app.command("/pb-ping", async ({ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
//---------------------startup  ----------------------------------------------------------

app.command("/pb-joke", async ({ack, respond }) => {
  await ack();
  const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
  await respond({ text: `${response.data.setup}\n${response.data.punchline}` });
});

//---------------------startup  ----------------------------------------------------------
(async () => {
  await app.start();
  console.log("bot is running!");
})();
