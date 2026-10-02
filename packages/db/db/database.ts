import {db} from "@/db/index";
import {DbTransaction} from "@/db/transactions";

export function getDatabase(tx?: DbTransaction) {
    return tx ?? db;
}