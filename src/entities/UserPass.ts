import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core"
import { randomUUID } from "crypto";

import { Country } from "./Country";
import { UserTrip } from "./UserTrip";

@Entity()
export class UserPass {
    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Date = new Date(Date.now());

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date(Date.now());

    @Property()
    passId: string = randomUUID().replaceAll('-', '');

    @Property()
    ownerId!: string;

    @ManyToOne('Country', 'id')
    country!: Country;

    @Property()
    type!: number;

    @Property()
    expirationDate!: Date;

    @OneToMany({ entity: () => UserTrip, mappedBy: 'pass', cascade: [Cascade.ALL] })
    trips = new Collection<UserTrip>(this);

    constructor(ownerId: string, country: Country, passId: string, type: number, expirationDate: Date) {
        this.ownerId = ownerId;
        this.country = country;
        this.type = type;
        this.expirationDate = expirationDate;
        this.passId = passId;
    }

}