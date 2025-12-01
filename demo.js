const hltb = require('./dist/main/howlongtobeat');
const readline = require('readline');

const hltbService = new hltb.HowLongToBeatService();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Qual jogo você quer buscar? ', (gameName) => {
    console.log(`Buscando por "${gameName}"...`);

    hltbService.search(gameName).then(result => {
        console.log('Resultados encontrados:', result.length);
        if (result.length > 0) {
            console.log('Primeiro resultado:', result[0]);
        }
        rl.close();
    }).catch(e => {
        console.error('Erro:', e);
        rl.close();
    });
});
