import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch, rmSync, promises as fsPromises } from "fs";
const fs = { ...fsPromises, existsSync };
import path, { join } from 'path';
import ws from 'ws';

let handler = async (m, { conn: _envio, command, usedPrefix, args, text, isOwner }) => {
  const isDeleteSession = /^(deletesesion|deletebot|deletesession|deletesesaion)$/i.test(command);
  const isPauseBot = /^(stop|pausarai|pausarbot)$/i.test(command);
  const isShowBots = /^(bots|sockets|socket)$/i.test(command);

  const reportError = async (e) => {
    await m.reply(`⚠️ Ocurrió un error inesperado, lo siento mucho...`)
    console.error(e);
  };

  switch (true) {
    case isDeleteSession: {
      const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
      const uniqid = `${who.split('@')[0]}`;
      const dirPath = `./${jadi}/${uniqid}`;

      if (!await fs.existsSync(dirPath)) {
        await conn.sendMessage(m.chat, {
          text: `🚫 *Sesión no encontrada*\n\n✨ No tienes una sesión activa.\n\n🔰 Puedes crear una con:\n*${usedPrefix + command}*\n\n📦 ¿Tienes un ID?\nUsa este comando seguido del ID:\n*${usedPrefix + command}* \`\`\`(ID)\`\`\``
        }, { quoted: m });
        return;
      }

      if (global.conn.user.jid !== conn.user.jid) {
        await conn.sendMessage(m.chat, {
          text: `💬 Este comando solo puede usarse desde el *Bot Principal*.\n\n🔗 Accede desde aquí:\nhttps://api.whatsapp.com/send/?phone=${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}&type=phone_number&app_absent=0`
        }, { quoted: m });
        return;
      }

      await conn.sendMessage(m.chat, {
        text: `🗑️ Tu sesión como *Sub-Bot* ha sido eliminada con éxito.`
      }, { quoted: m });

      try {
        fs.rmdir(`./${jadi}/${uniqid}`, { recursive: true, force: true });
        await conn.sendMessage(m.chat, {
          text: `🌈 ¡Todo limpio! Tu sesión y sus rastros han sido borrados por completo.`
        }, { quoted: m });
      } catch (e) {
        reportError(e);
      }
      break;
    }

    case isPauseBot: {
      if (global.conn.user.jid == conn.user.jid) {
        conn.reply(m.chat, `🚫 No puedes pausar el bot principal.\n🛟 Si deseas ser un *Sub-Bot*, contacta con el número principal.`, m);
      } else {
        await conn.reply(m.chat, `🔕 *${botname} ha sido pausada.*`, m);
        conn.ws.close();
      }
      break;
    }

    case isShowBots: {
      const users = [...new Set([...global.conns.filter(conn => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED)])];

      const convertirMsADiasHorasMinutosSegundos = (ms) => {
        let segundos = Math.floor(ms / 1000);
        let minutos = Math.floor(segundos / 60);
        let horas = Math.floor(minutos / 60);
        let días = Math.floor(horas / 24);
        segundos %= 60;
        minutos %= 60;
        horas %= 24;

        return [
          días ? `${días} día(s)` : '',
          horas ? `${horas} hora(s)` : '',
          minutos ? `${minutos} minuto(s)` : '',
          segundos ? `${segundos} segundo(s)` : '',
        ].filter(Boolean).join(', ');
      };

      const listaSubBots = users.map((v, i) => 
`🌟 *SUB-BOT #${i + 1}*
📱 Número: https://wa.me/${v.user.jid.replace(/[^0-9]/g, '')}?text=${usedPrefix}estado
👤 Nombre: ${v.user.name || 'Sub-Bot'}
🕒 En línea hace: ${v.uptime ? convertirMsADiasHorasMinutosSegundos(Date.now() - v.uptime) : 'Desconocido'}`)
      .join('\n\n───────────────\n\n');

      const finalMessage = listaSubBots.length === 0
        ? '💤 No hay Sub-Bots activos por ahora... intenta más tarde.'
        : listaSubBots;

      const msg = `
${emoji} ─────────ೋღ 🌺 ღೋ─────────
👑ᥣׁׅ֪ꪱׁׁׁׅׅׅׅ꯱tׁׅɑׁׅ ժׁׅ݊ꫀׁׅܻ݊ ׅ꯱υׁׅ֮ϐׁ-֮ϐׁᨵׁׅׅtׁׅׅ꯱ ɑׁׅᝯׁ֒tׁׅꪱׁׁׁׁׅׅׅׅ᥎ׁׅᨵׁׅׅׅ꯱🌹
───✱*.｡:｡✱*.:｡✧*.｡✰*.:｡✧*.｡:｡*.｡✱ ───
           ‧̍̊·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊‧̍̊ ♡ °̩̥˚̩̩̥͙°̩̥ ·͙*̩̩͙˚̩̥̩̥*̩̩̥͙·̩̩̥͙*̩̩̥͙˚̩̥̩̥*̩̩͙‧͙ °̩̥˚̩̩̥͙°̩̥ ♡ ‧̍̊·̊‧̥°̩̥˚̩̩̥͙°̩̥‧̥·̊‧̍̊

 ¿ℚ𝕦𝕚́𝕖𝕣𝕖𝕤 𝕥𝕖𝕟𝕖𝕣 𝕦𝕟 𝕓𝕠𝕥 𝕖𝕟 𝕥𝕦́ 𝕘𝕣𝕦𝕡𝕠?👑🫴
⍴ᥙᥱძᥱs ⍴ᥱძіr ⍴ᥱrmіs᥆ ᥲ ᥙᥒ᥆ ძᥱ ᥱs𝗍᥆s ⍴ᥲrᥲ́ ᥙᥒіrᥣ᥆ sіᥒ ⍴r᥆ᑲᥣᥱmᥲ! 
───✱*.｡:｡✱*.:｡✧*.｡✰*.:｡✧*.｡:｡*.｡✱ ───
${emoji2} ⚠️𝐀𝐃𝐕𝐄𝐑𝐓𝐄𝐍𝐂𝐈𝐀⚠️:
☝ᥱ́ᥣ ᥙs᥆́ ძᥱ ᥣ᥆s sᥙᑲ-ᑲ᥆𝗍, ᥱ́s rᥱs⍴᥆ᥒsᥲᑲіᥣіძᥲძ ძᥱ́ ᥴᥲძᥲ ᥙsᥙᥲrі᥆
❌ᥱ́ᥣ ᥒᥙ́mᥱr᥆ ⍴rіᥒᥴі⍴ᥲᥣ ᥒ᥆ sᥱ́ һᥲᥴᥱ́ rᥱs⍴᥆ᥒsᥲᑲᥣᥱ ⍴᥆r ᥱᥣ mᥲᥣ ᥙs᥆ 

✼ •• ┈┈┈┈๑⋅⋯ ୨˚୧ ⋯⋅๑┈┈┈┈ •• ✼
🌐✎𝐒𝐮𝐛-𝐛𝐨𝐭𝐬 𝐜𝐨𝐧𝐞𝐜𝐭𝐚𝐝𝐨𝐬✐♻️:
✩̣̣̣̣̣ͯ┄•͙✧⃝•͙┄✩ͯ•͙͙✧⃝•͙͙✩ͯ┄•͙✧⃝•͙┄✩̣̣̣̣̣ͯ: ${users.length || '0'}

${finalMessage}`.trim();

      await _envio.sendMessage(m.chat, {
        text: msg,
        mentions: _envio.parseMention(msg)
      }, { quoted: m });
      break;
    }
  }
};

handler.tags = ['serbot'];
handler.help = ['sockets', 'deletesesion', 'pausarai'];
handler.command = [
  'deletesesion', 'deletebot', 'deletesession', 'deletesesaion',
  'stop', 'pausarai', 'pausarbot',
  'bots', 'sockets', 'socket'
];

export default handler;
