export enum state{
    INVALID,
    VALID
}

export enum promo {
    EURO5,
    EURO10,
    EURO15
}

export var discountEnum = {
    "EURO5" : {
        price: 5,
        state: state.VALID
    },
    "EURO10" : {
        price: 10,
        state: state.VALID
    },
    "EURO15" : {
        price: 15,
        state: state.VALID
    }
}


//TODO ajouter une fonction qui permets d'activer/désactiver un code promo