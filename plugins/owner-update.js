import { exec } from 'child_process';

let handler = async (m, { conn }) => {
  const emoji = '🏵️';
  const emoji2 = '🌷';
  const emoji4 = '💞';
  const msm = '💗';

  m.reply(`${emoji2} Actualizando a la bot...`);

  exec('git pull', (err, stdout, stderr) => {
    if (err) {
      conn.reply(m.chat, `${msm} Error al reforzar normalmente. Forzando el ingreso de poder...`, m);
      exec('git reset --hard origin/main && git pull', (err2, stdout2, stderr2) => {
        if (err2) {
          conn.reply(m.chat, `${msm} No se pudo forzar el reforzamiento.\nRazón: ${err2.message}`, m);
          return;
        }

        if (stderr2) console.warn(stderr2);

        conn.reply(m.chat, `${emoji} Reforzamiento forzado realizada con éxito.\n\n${stdout2}`, m);
      });
      return;
    }

    if (stderr) console.warn(stderr);

    if (stdout.includes('Already up to date.')) {
      conn.reply(m.chat, `${emoji4} El pecador ya tiene suficiente poder.`, m);
    } else {
      conn.reply(m.chat, `${emoji} Reforzamiento de poder éxitoso.\n\n${stdout}`, m);
    }
  });
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update'];
handler.rowner = true;

export default handler;