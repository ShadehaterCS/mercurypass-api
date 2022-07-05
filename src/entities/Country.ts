import { Entity, PrimaryKey, Property } from "@mikro-orm/core"
@Entity()
export class Country {

    @PrimaryKey()
    id!: number;

    @Property()
    createdAt: Date = new Date(Date.now());

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date(Date.now());

    @Property()
    name: string;

    @Property()
    abbreviation: string;

    @Property()
    cities: string;

    @Property()
    image: string;

    @Property()
    repeat!: number;

    @Property()
    weekly!: number;

    @Property()
    semester!: number;

    constructor(name: string, abbreviation: string, cities: string, image: string, repeat: number, weekly: number, semester: number) {
        this.name = name;
        this.abbreviation = abbreviation;
        this.cities = cities;
        this.image = image;
        this.repeat = repeat;
        this.weekly = weekly;
        this.semester = semester;
    }
}   