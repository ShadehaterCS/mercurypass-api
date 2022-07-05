import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Country } from '../entities/Country';
//JSON DATA
import countriesData from '../seedersPremadeJSON/countriesData.json';

/*
The purpose of the class is to seed the database if it's empty
Main Seeding includes the Countries and the news itemsx 
*/
export class DatabaseSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        for (const country of countriesData) {
            const c = new Country(country.name, country.abbreviation, country.cities, country.image, country.repeat, country.weekly, country.semester);
            em.persistAndFlush(c)
        }
        console.log("Seeding Completed")
    }
}