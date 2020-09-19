const Telegraf = require('telegraf')
const got = require('got')
const fs = require('fs')
const { gzip, ungzip } = require('node-gzip')
const zlib = require('zlib');
const layers = {}
const promises = []


// const dir = fs.readdirSync(DIR_TGS)

const bot = new Telegraf(process.env.BOT_TOKEN)

// const compressed = await gzip('Hello World');

// const decompressed = await ungzip(compressed);

bot.on('sticker', async (ctx) => {
  if (!ctx.message.sticker.is_animated) return

  console.log(ctx.message.sticker.file_i)
  const fileId = ctx.message.sticker.file_id

  const fileLink = await bot.telegram.getFileLink(fileId)
  const sticker = await got(fileLink).buffer()

  const done = await prepare(sticker)

  ctx.replyWithSticker({
    source: done,
    filename: 'qwerty.tgs'
  })
    .catch((err) => console.log(err))
})


bot.launch().then(() => console.log('Bot launch'))


async function prepare(steaker) {
  let file = await ungzip(steaker).catch((err) => console.log(err))
  file = JSON.parse(file)

  file.layers.shift()

  file = JSON.stringify(file)
  file = await gzip(file)

  return file
}
