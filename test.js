const winner = 1019.4;
const loser = 995.2;
const K = 10;
const elo = K * (1 - (1 / (1 + (Math.pow(10, (loser - winner) / 400)))).toFixed(2));
console.log(elo);
console.log('1', 1 / (1 + (Math.pow(10, (loser - winner) / 400))));
console.log('2', 1 / (1 + (Math.pow(10, (loser - winner) / 400))));
console.log('3', 1 - (1 / (1 + (Math.pow(10, (loser - winner) / 400)))));
console.log('4', (K * (1 - (1 / (1 + (Math.pow(10, (loser - winner) / 400)))))).toFixed(1));
