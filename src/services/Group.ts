import { Player } from "./Player";

export class Group {
    private _players: Player[];

    constructor(players: Player[]) {
        this._players = players;
    }

    get players(): Player[] {
        return this._players;
    }
}