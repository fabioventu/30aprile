
export class Icon { //Classe per modificare la scala delle icone
    public scaledSize:ScaledSize;
    constructor(public url: string, size: number){
        this.scaledSize = new ScaledSize(size,size);
    }

    setSize(size: number) { // serve per settare il size
        this.scaledSize = new ScaledSize(size,size);
    }
}

export class ScaledSize { // dice quali sono altezza e larghezza della icona
    constructor(
    public width:  number,
    public height: number){}
}
