import { Group } from "./Group";
import { Player } from "./Player";
import { Table } from "./Table";

export class GroupWithPossibleTables extends Group {
    private _freeTables: Table[] = [];

    constructor(players: Player[]) {
        super(players);
    }

    get freeTables(): Table[] {
        return this._freeTables;
    }

    set freeTables(tables: Table[]) {
        this._freeTables = tables;
    }
}