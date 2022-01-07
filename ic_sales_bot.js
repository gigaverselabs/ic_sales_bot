require('dotenv').config();
const fs = require('fs');
const { Client, Intents, MessageEmbed } = require('discord.js');
const { Actor, HttpAgent } = require('@dfinity/agent');
const moment = require('moment');
global.fetch = require('node-fetch').default;

const { Principal } = require('@dfinity/principal');

const discordBot = new Client({ intents: [Intents.FLAGS.GUILDS] });
const discordSetup = async () => {
  return new Promise((resolve, reject) => {
    ['DISCORD_BOT_TOKEN', 'DISCORD_CHANNEL_ID'].forEach((envVar) => {
      if (!process.env[envVar]) reject(`${envVar} not set`)
    })

    discordBot.login(process.env.DISCORD_BOT_TOKEN);
    discordBot.on('ready', async () => {
      console.log("Discord bot is ready")
      const channel = await discordBot.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      resolve(channel);
    });
  })
}

const wrap_idl = require('./wrap.idl');
const { getEnvironmentData } = require('worker_threads');
const ic_agent = new HttpAgent({ host: process.env.ENDPOINT });
const ic_vault = Actor.createActor(wrap_idl.IDL, {
  agent: ic_agent,
  canisterId: process.env.ADDRESS,
});
const nri = require('./nri').NRI;
const { start } = require('repl');

const getNri = (id) => {
  return nri[id] * 100 + "%";
}

const formatDate = (date) => {
  return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate() + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + ":" + date.getUTCSeconds();
}

const buildMessage = (sale) => {
  // if (sale.asset === null) return null;

  let date = moment(sale.created_date);

  return new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('ICPunk #' + sale.id + ' sold!')
    .setURL('https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/' + sale.id)
    .setThumbnail('https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/' + sale.id)
    .addFields(
      { name: 'Name', value: 'ICPunk #' + sale.id },
      { name: 'Amount', value: sale.total_price + " ICP" },
      { name: 'NRI', value: getNri(sale.id) },
      { name: 'Date', value: date.format("yyyy-MM-DD HH:mm:ss") }
      // { name: 'Buyer', value: sale?.winner_account?.address, },
      // { name: 'Seller', value: sale?.seller?.address, },
    )
    .setImage('https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/' + sale.id)
    .setTimestamp(sale.created_date)
    .setFooter('Sold on Entrepot', 'https://entrepot.app/favicon.png')
}

const tokenIdentifier = (principal, index) => {
  const padding = Buffer("\x0Atid");
  const array = new Uint8Array([
    ...padding,
    ...Principal.fromText(principal).toUint8Array(),
    ...to32bits(index),
  ]);
  return Principal.fromUint8Array(array).toText();
};
const from32bits = ba => {
  var value;
  for (var i = 0; i < 4; i++) {
    value = (value << 8) | ba[i];
  }
  return value;
};
const toHexString = (byteArray) => {
  return Array.from(byteArray, function (byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
};
const decodeTokenId = (tid) => {
  var p = [...Principal.fromText(tid).toUint8Array()];
  var padding = p.splice(0, 4);
  if (toHexString(padding) !== toHexString(Buffer("\x0Atid"))) {
    return {
      index: 0,
      canister: tid,
      token: tokenIdentifier(tid, 0)
    };
  } else {
    return {
      index: from32bits(p.splice(-4)),
      canister: Principal.fromUint8Array(p).toText(),
      token: tid
    };
  }
};


const showListingPrice = n => {
  n = Number(n) / 100000000;
  return n.toFixed(8).replace(/0{1,6}$/, '');
};

async function fetchSalesSince() {
  let txs = await ic_vault.transactions();
  // let tokens = await ic_vault.getTokens();

  // for (no in txs) {
  let no = txs.length - 1;
  let tx = txs[no];

  let sale = decodeMsg(tx);
  let msg = buildMessage(sale);

  const channel = await discordSetup();
  await channel.send(msg);
}

function decodeMsg(tx) {
  let tid = decodeTokenId(tx.token);

  let token_id = tid.index;
  let price = tx.price;
  let time = tx.time; //in nanoseconds

  let sale = {
    id: token_id,
    total_price: showListingPrice(price),
    created_date: new Date(Number(time) / 1000000)
  };

  return sale;
}

let channel = null;
let working = false;
async function main() {
  if (working) return false;

  working = true;

  try {

    var lastUpdate = 0;

    // console.log("Checking for sales updates")

    if (fs.existsSync('last_update.txt')) {
      let raw_data = fs.readFileSync('last_update.txt');
      lastUpdate = parseInt(raw_data.toString());
    }


    let raw_txs = await ic_vault.transactions();
    let txs = raw_txs.filter(x => Number(x.time) > lastUpdate)

    if (txs.length > 20) {
      txs.splice(0, txs.length - 20);
    }

    for (var i = 0; i < txs.length; i++) {
      let sale = decodeMsg(txs[i]);
      let msg = buildMessage(sale);
      fs.writeFileSync('last_update.txt', txs[i].time.toString())

      console.log("Sending sale: " + sale.id);

      // await channel.send(msg);
    }
  } catch (e) {
    console.error(e)
  }

  working = false;
}


async function startup() {
  channel = await discordSetup();

  console.log("Starting bot!");
  setInterval(main, 1500);
}

startup();

// main();

// main().then((res) =>{ 
//   // if (!res.length) console.log("No recent sales")
//   process.exit(0)
// })
// .catch(error => {
//   console.error(error);
//   process.exit(1);
// });