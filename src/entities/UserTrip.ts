import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { UserPass } from "./UserPass";

@Entity()
export class UserTrip {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Date = new Date(Date.now());

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date(Date.now());

    @ManyToOne(() => UserPass)
    pass!: UserPass;

    @Property()
    city!: string;

    @Property()
    transport!: string;

    constructor(city: string, pass: UserPass, transport: string) {
        this.city = city;
        this.pass = pass;
        this.transport = transport;
    }
}
