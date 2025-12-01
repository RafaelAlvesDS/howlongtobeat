const hltb = require('./dist/main/howlongtobeat');
const hltbService = new hltb.HowLongToBeatService();

console.log('Buscando por "The Witcher 3"...');

hltbService.search('The Witcher 3').then(result => {
    console.log('Resultados encontrados:', result.length);
    if (result.length > 0) {
        console.log('Primeiro resultado:', result[0]);
    }
}).catch(e => {
    console.error('Erro:', e);
});
