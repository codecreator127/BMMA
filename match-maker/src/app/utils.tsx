export class Player {
    constructor(
        public name:string = name,
        public level: number
    ){}
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array: Player[]) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}