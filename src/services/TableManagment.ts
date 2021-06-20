import { Group } from "./Group";
import { GroupWithPossibleTables } from "./GroupWithPossibleTables";
import { Player } from "./Player";
import { Table } from "./Table";

const BASE_TABLE_WEIGHT = 100;

export class TableManagment {
    tables: Table[];
    private tablePlayersMap: Map<string, Player[]> = new Map;
    private tableWeightMap: Map<string, number> = new Map;
    private currentRoundLockedTables: Table[] = [];

    constructor(tables: Table[]) {
        this.tables = tables;
    }

    x(groups: Group[]) {
        this.tablePlayersMap.set('a', [groups[0].players[0], groups[1].players[0],  groups[2].players[1], groups[1].players[1], groups[0].players[1]]);
        this.tablePlayersMap.set('b', [groups[0].players[1], groups[2].players[1]]);
        this.tablePlayersMap.set('c', [groups[2].players[0], groups[1].players[1], groups[0].players[1]]);
    }

    manage(groups: Group[]): Group[] {
        this.currentRoundLockedTables = [];
        const groupsWithFreeTables: GroupWithPossibleTables[] = [];
        const allFreeTables: Table[] = [];
        const groupWithoutFreeTables: Group[] = [];
        for(const group of groups) {
            const freeTables = this.getFreeTables(group);
            allFreeTables.push(...freeTables);
            const groupWithPossibleTables: GroupWithPossibleTables = new GroupWithPossibleTables(group.players);
            groupWithPossibleTables.freeTables = freeTables;
            groupsWithFreeTables.push(groupWithPossibleTables);
        }
        while(groupsWithFreeTables.length > 0) {
            this.y(groupsWithFreeTables, allFreeTables, groupWithoutFreeTables);
        }
        this.managePartial(groupWithoutFreeTables);
        
        
        return groupsWithFreeTables;
    }

    protected managePartial(groups: Group[]) {
        const groupsWithFreeTables: GroupWithPossibleTables[] = [];
        const allFreeTables: Table[] = [];
        const groupWithoutFreeTables: Group[] = [];
        for(const group of groups) {
            const freeTables = this.getPartialyFreeTables(group).filter(table => !this.currentRoundLockedTables.includes(table));
            if(freeTables.length > 0) {
                allFreeTables.push(...freeTables);
                const groupWithPossibleTables: GroupWithPossibleTables = new GroupWithPossibleTables(group.players);
                groupWithPossibleTables.freeTables = freeTables;
                groupsWithFreeTables.push(groupWithPossibleTables);
            }
        }
        while(groupsWithFreeTables.length > 0) {
            this.y(groupsWithFreeTables, allFreeTables, groupWithoutFreeTables);
        }
        this.manageRest(groupWithoutFreeTables);
    }

    manageRest(groups: Group[]) {
        const groupsWithFreeTables: GroupWithPossibleTables[] = [];
        const freeTables = this.tables.filter(table => !this.currentRoundLockedTables.includes(table));
        for(const group of groups) {
            const groupWithPossibleTables: GroupWithPossibleTables = new GroupWithPossibleTables(group.players);
            groupWithPossibleTables.freeTables = freeTables;
            groupsWithFreeTables.push(groupWithPossibleTables);
        }
        while(groupsWithFreeTables.length > 0) {
            this.y(groupsWithFreeTables, freeTables);
        }
    }

    y(groupsWithPossibleTables: GroupWithPossibleTables[], allFreeTables: Table[], groupWithoutFreeTables?: Group[]) {
        groupsWithPossibleTables.sort((a, b) => {
            if(a.freeTables.length > b.freeTables.length) {
                return -1;
            }
            if(a.freeTables.length < b.freeTables.length) {
                return 1;
            }
            return 0;
        });
        const choisenGroup = groupsWithPossibleTables.pop();
        if(choisenGroup?.freeTables.length === 0) {
            groupWithoutFreeTables?.push(choisenGroup);
            return;
        }
        this.setTableWeight(allFreeTables);
        choisenGroup!.freeTables.sort((a, b) => {
            return this.tableWeightMap.get(a.name)! - this.tableWeightMap.get(b.name)!;
        });
        const choisenTable = choisenGroup!.freeTables[0];
        this.addPlayersGroupToTable(choisenGroup!, choisenTable);
        allFreeTables = allFreeTables.filter(table => table.name !== choisenTable.name);
        this.removeChoisenTableFromFree(groupsWithPossibleTables, choisenTable);
        this.currentRoundLockedTables.push(choisenTable);
        console.log(choisenGroup!, choisenTable);
    }

    removeChoisenTableFromFree(groups: GroupWithPossibleTables[], choisenTable: Table) {
        for(const group of groups) {
            group.freeTables = group.freeTables.filter(table => table.name !== choisenTable.name);
        }
    }

    protected addPlayersGroupToTable(group: GroupWithPossibleTables, table: Table) {
        const players = group.players;
        if(!this.tablePlayersMap.has(table.name)) {
            this.tablePlayersMap.set(table.name, [...players]);
        } else {
            const alreadyPlayedPlayers = this.tablePlayersMap.get(table.name);
            alreadyPlayedPlayers!.push(...players);
            this.tablePlayersMap.set(table.name, alreadyPlayedPlayers!);
        }
    }

    protected getFreeTables(group: Group): Table[] {
        return this.tables.filter(table => {
            const playersPlayedOnThisTable = this.tablePlayersMap.get(table.name) || [];
            return !group.players.some(player => playersPlayedOnThisTable.includes(player));
        });
    }

    protected getPartialyFreeTables(group: Group): Table[] {
        return this.tables.filter(table => {
            const playersPlayedOnThisTable = this.tablePlayersMap.get(table.name) || [];
            return !group.players.every(player => playersPlayedOnThisTable.includes(player));
        });
    }

    private setTableWeight(tables: Table[]) {
        this.tableWeightMap = new Map;
        for(const table of tables) {
            if(!this.tableWeightMap.has(table.name)) {
                this.tableWeightMap.set(table.name, BASE_TABLE_WEIGHT);
            } else {
                const weight = this.tableWeightMap.get(table.name);
                this.tableWeightMap.set(table.name, weight! + 1);
            }
        }
    }
}