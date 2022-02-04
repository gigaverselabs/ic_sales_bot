# Info 
This is sales bot, created for uploading collection sales info to given Discord Channel

# Intallation
Run

`yarn` 

to download all necessary packages
# Configuration

Create discord BOT on a developers portal: https://discord.com/developers/applications. Get BOT TOKEN

Create dedicated channel in your discord server for publishing sales messages. Get channel id (you need to enable developer mode in discord).

Get your EXT canister ID (you can lookup in Entrepot source code, or dab.ooo)

Copy `.env.example` to `.env` and fill 

DISCORD_BOT_TOKEN - bot token from developers portal, DISCORD_CHANNEL_ID - channel id copied from discord cliet
ADDRESS - ext token canister address
NAME - Your collection name eg. 'ICPunk #'
IMAGE_URL - Url to your images without token id part. Eg. https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/ . Token 1 address: https://qcg3w-tyaaa-aaaah-qakea-cai.raw.ic0.app/Token/1

If you have NRI calculated insert them into nri.js file. You can see the filled example in nri.example.js. If not leave empty array.

# Run

To run in foreground use:

`node ic_sales_bot.js`

In order to run in background use 
`pm2 start ic_sales_bot.js`