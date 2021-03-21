/*
  On a travaille les boucles, les conditions, les priorites
  maintenant on va faire tout en meme temps
*/

// echauffement:

// qu'affiche les console.log ? 

const chats = ['piteau', 'terton', 'lumeau', 'badabada'];
for(let i=0;i< chats.length; i++){
  console.log(chats[i])
}

for(let i in chats){
  console.log(chats[i])
}

for(let chat of chats){
  console.log(chat)
}
/*
  Le chiffre Infinity represente le plus grand nombre possible
  Le chiffre -Infinity lel plus petit nombre possible
  Il sert surtout pour les comparaisons
*/

// 1) utilises un for of pour trouver le minimum du tableau
const nombres = [5,3,6,7,9,1,10];
let minimum = Infinity;
/*code*/
console.log(minimum)

// 2) utilises un for in pour trouver le maximum du tableau
let maximum = -Infinity;
/*code*/
console.log(maximum)


// 3) La fonction Math.min() donne(on dit retourne dans le jargon) 
// le minimum entre deux nombres
//on l'utilise comme ca: minimum = Math.min(1,2) 
// utilises la fonction Math.min et un for of pour trouver le minimum
// tu n'as pas le droit d'utiliser de if

minimum = Infinity;
/*code*/
console.log(minimum)

// 4) utilises un for in et la fonction Math.max pour trouver le maximum
// tu n'as pas le droit au if non plus

maximum = Infinity;
/*code*/
console.log(maximum)


/* 
 Rappel: l'operateur % donne le reste de la division 
 example:
 const a = 11;
 const b = 5;

 const division = a/b; 
 division est egal a 2.2, ca ne nous aide pas beaucoup pour savoir
 si a est divisble par b.
 On pourrait dire que si il n'y a rien deriere la virgule alors a est divisible par b.
 On pourrait utiliser Math.floor qui donne l'arrondi du nombre et voir si c'est le 
 meme resultat 
  
 if((a/b) === Math.round(a/b)){
   console.log('divisible')
 }else{
   console.log('non divisible)
 }

 Mais il y a beaucoup plus simple: l'operateur % 

 reste = a%b;
 ici reste est egal a 1, et donc a n'est pas divisible par b.
 Si on a c = 15, alors c%b est egal a 0 et donc c est disible par b.

 */

//  5) trouves le chiffre dans le tableau qui est impair et divisible par trois

let impairDivisible;
/*code*/
console.log(impairDivisible);

//  6) trouves le chiffre dans le tableau 
//  qui est inferieur a 5 ET pair OU superieur a 5 et pair
let res;
/*code*/
console.log(res);

// 7) Additionnes tous les chiffres du tableau
// si le chiffre est pair affiches 'pair'
// sinon affiches 'impair' 
let addition;
/*code*/

// 8) utilises la fonction push et une boucle pour remplir le tableau
// avec la table de multiplication du 7: 
const tableDeSept = [];
/*code*/
console.log(tableDeSept);
// tableDeSept doit etre [0,7,14,21,28,35,42,49,56,63,70];
