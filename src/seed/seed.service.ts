import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';

import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios

  // constructor( private readonly pokemonService: PokemonService ){}
  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>

  ){}

  async executeSeed() {
    
    await this.pokemonModel.deleteMany({}); // es como el delete from pokemons (borra todos los registros de la bd);
    
    const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=650');
    const pokemonToInsert: { name: string, no:number }[]= [];

    data.results.forEach( ( { name, url } ) => {
      
      const segments = url.split('/')
      const no = +segments[ segments.length - 2 ];
      
      pokemonToInsert.push( { name, no } );

    });

    await this.pokemonModel.insertMany( pokemonToInsert );
    
    return 'Seed executed';
  }

}

  // -------------------------------------------------------------------------------------------
  //                                Otra Forma metodo SeedService() - menos óptima

  // "Se crean todas las promesas de inserción en paralelo y Promise.all() espera a que todas se completen antes de continuar.
  //  Las inserciones comienzan cuando se llama a create(), pero el código no continúa hasta que todas se resuelvan."
  
  // async executeSeed() {
    
  //   await this.pokemonModel.deleteMany({}); // es como el delete from pokemons (borra todos los registros de la bd);
    
  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon/?limit=10');
  //   const insertPromisesArray: any = [];

  //   data.results.forEach( ( { name, url } ) => {
      
  //     const segments = url.split('/')
  //     const no = +segments[ segments.length - 2 ];
      
  //     // aca podemos guardar en un array las promesas de cada insercion, Se crean todas las promesas de inserción en paralelo 
  //     insertPromisesArray.push(
  //       this.pokemonModel.create({ name, no })
  //     );

  //   });

  //   await Promise.all( insertPromisesArray );
  //   // nota: Promise.all() espera a que todas se completen (se resuelvan) antes de continuar. 
  //   // Las inserciones comienzan cuando se llama a create(), pero el código no continúa hasta que todas se resuelvan.
    
  //   return 'Seed executed';
  // }


