//Destroy.....
//personalizado por Emmax-kun 
const roles = {
    '*Chibi Aventurero/a V*🪷': 0,
  '*Chibi Aventurero/a IV*🪷': 2,
  '*Chibi Aventurero/a III*🪷': 4,
  '*Chibi Aventurero/a II*🪷': 6,
  '*Chibi Aventurero/a I*🪷': 8,
  '*Aprendiz de Maria V*🌸': 10,
  '*Aprendiz de Maria IV*🌸': 12,
  '*Aprendiz de Maria III*🌸': 14,
  '*Aprendiz de Maria II*🌸': 16,
  '*Aprendiz de Maria I*🌸': 18,
  '*Mejor Amigo(a) de Maria V*': 20,
  '*Mejor Amigo(a) de Maria IV*': 22,
  '*Mejor Amigo(a) de Maria III*': 24,
  '*Mejor Amigo(a) de Maria II*': 26,
  '*Mejor Amigo(a) de Maria I*': 28,
  '*Héroe/ina del Chat V*🦸': 30,
  '*Héroe/ina del Chat IV*🦸': 32,
  '*Héroe/ina del Chat III*🦸': 34,
  '*Héroe/ina del Chat II*🦸': 36,
  '*Héroe/ina del Chat I*🦸': 38,
  '*Otaku Supremo/a V* 🔱': 40,
  '*Otaku Supremo/a IV* 🔱': 42,
  '*Otaku Supremo/a III* 🔱': 44,
  '*Otaku Supremo/a II* 🔱': 46,
  '*Otaku Supremo/a I* 🔱': 48,
  '*Protagonista de Arco V*🍜': 50,
  '*Protagonista de Arco IV*🍜': 52,
  '*Protagonista de Arco III*🍜': 54,
  '*Protagonista de Arco II*🍜': 56,
  '*Protagonista de Arco I*🍜': 58,
  '*Ruby Master V*♦️': 60,
  '*Ruby Master IV*♦️': 62,
  '*Ruby Master III*♦️': 64,
  '*Ruby Master II*♦️': 66,
  '*Ruby Master I*♦️': 68,
  '*Onii-chan Legendario V*💞': 70,
  '*Onii-chan Legendario IV*💞': 72,
  '*Onii-chan Legendario III*💞': 74,
  '*Onii-chan Legendario II*💞': 76,
  '*Onii-chan Legendario I*💞': 78,
  '*Maestro/a del Fanservice V*🎋': 80,
  '*Maestro/a del Fanservice IV*🎋': 85,
  '*Maestro/a del Fanservice III*🎋': 90,
  '*Maestro/a del Fanservice II*🎋': 95,
  '*Maestro/a del Fanservice I*🎋': 99,
  '*Tsundere de Élite V*💢': 100,
  '*Tsundere de Élite IV*💢': 110,
  '*Tsundere de Élite III*💢': 120,
  '*Tsundere de Élite II*💢': 130,
  '*Tsundere de Élite I*💢': 140,
  '*Yandere Supremo/a V*🩸🔪': 150,
  '*Yandere Supremo/a IV*🩸🔪': 160,
  '*Yandere Supremo/a III*🩸🔪': 170,
  '*Yandere Supremo/a II*🩸🔪': 180,
  '*Yandere Supremo/a I*🩸🔪': 199,
  '*Kami-sama del Waifuverso V*🏵️': 200,
  '*Kami-sama del Waifuverso IV*🏵️': 225,
  '*Kami-sama del Waifuverso III*🏵️': 250,
  '*Kami-sama del Waifuverso II*🏵️': 275,
  '*Kami-sama del Waifuverso I*🏵️': 299,
  '*Dios/a de la Magia Anime V*🌺': 300,
  '*Dios/a de la Magia Anime IV*🌺': 325,
  '*Dios/a de la Magia Anime III*🌺': 350,
  '*Dios/a de la Magia Anime II*🌺': 375,
  '*Dios/a de la Magia Anime I*🌺': 399,
  '*Ultra Idol Celestial V*🍬': 400,
  '*Ultra Idol Celestial IV*🍬': 425,
  '*Ultra Idol Celestial III*🍬': 450,
  '*Ultra Idol Celestial II*🍬': 475,
  '*Ultra Idol Celestial I*🍬': 499,
  '*Senpai Inmortal V*🍭': 500,
  '*Senpai Inmortal IV*🍭': 525,
  '*Senpai Inmortal III*🍭': 550,
  '*Senpai Inmortal II*🍭': 575,
  '*Senpai Inmortal I*🍭': 599,
  '*Deidad Moe V*👾': 600,
  '*Deidad Moe IV*👾': 625,
  '*Deidad Moe III*👾': 650,
  '*Deidad Moe II*👾': 675,
  '*Deidad Moe I*👾': 699,
  '*Kyodai Otaku V*💥': 700,
  '*Kyodai Otaku IV*💥': 725,
  '*Kyodai Otaku III*💥': 750,
  '*Kyodai Otaku II*💥': 775,
  '*Kyodai Otaku I*💥': 799,
  '*Sabio/a del Multiverso Kawaii V*🗿': 800,
  '*Sabio/a del Multiverso Kawaii IV*🗿': 825,
  '*Sabio/a del Multiverso Kawaii III*🗿': 850,
  '*Sabio/a del Multiverso Kawaii II*🗿': 875,
  '*Sabio/a del Multiverso Kawaii I*🗿': 899,
  '*Viajero/a Otaku Dimensional V*🌟': 900,
  '*Viajero/a Otaku Dimensional IV*🌟': 925,
  '*Viajero/a Otaku Dimensional III*🌟': 950,
  '*Viajero/a Otaku Dimensional II*🌟': 975,
  '*Viajero/a Otaku Dimensional I*🌟': 999,
  '*🌟 Deidad Suprema del Anime 🌟*': 1000,
  '*🌟 Deidad Suprema II 🌟*': 2000,
  '*🌟 Deidad Suprema III 🌟*': 3000,
  '*🌟 Deidad Suprema IV 🌟*': 4000,
  '*🌟 Deidad Suprema V 🌟*': 5000,
  '*👑 Dios del anime  👑*': 10000
}

let handler = m => m
handler.before = async function (m, { conn }) {
  let user = db.data.users[m.sender]
  if (!user) return
  let level = user.level
  let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
  user.role = role
  return true
}
export default handler
