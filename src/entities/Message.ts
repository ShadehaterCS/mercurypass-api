import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Message {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Date = new Date(Date.now());

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date(Date.now());

    @Property()
    sender!: string;

    @Property()
    message!: string;

    constructor(sender: string, message: string) {
        this.sender = sender;
        this.message = message;
    }
}