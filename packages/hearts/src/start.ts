#!/usr/bin/env ts-node

import yargs from "yargs";
import { IntermediaryHandler } from "./handlers/intermediary-handler";
import { HeuristicHandler } from "./handlers/heuristic-handler";
import { GameStateIterator } from "./game-state-iterator";
import { defaultParams } from "./game-params";
import { GameDriver, HandlerChain, IncrementalIntermediary, InquirerPresenter } from "@cards-ts/core";
import { StateTransformer } from "./state-transformer";
import { GameHandler } from "./game-handler";
import { ResponseValidator } from "./response-validator";

yargs.command(['start', '$0'], 'begin a new game', yargs => {
    yargs.option('players', {
        alias: 'p',
        type: 'number',
        description: 'Number of opponents to play against',
        default: 3
    }).option('name', {
        alias: 'n',
        type: 'string',
        description: 'Player\'s name'
    });
}, async argv => {
    const mainPlayerIntermediary = new IncrementalIntermediary(new InquirerPresenter());
    let names: string[] = [];
    let name: string = argv.name as string;
    if(!argv.name) {        
        // await mainPlayer.askForName();
        name = 'Jerome';
    }
    names.push(name);
    names.push('Greg', 'Hugh', 'Leah');

    const players: any[] = Array(argv.players as number + 1);
    players[0] = new HandlerChain().append(new IntermediarySystemHandler(mainPlayerIntermediary)).append(new IntermediaryHandler(mainPlayerIntermediary));
    for(let i = 1; i < players.length; i++) {
        players[i] = new HandlerChain().append(new HeuristicHandler());
    }

    const stateTransformer = new StateTransformer();
    const responseValidator = new ResponseValidator();
    const gameStateIterator = new GameStateIterator();

    const driver = new GameDriver(players, stateTransformer.initialState({ names: names, gameParams: defaultParams }), gameStateIterator, stateTransformer, responseValidator);

    await driver.start();
})
.help()
.argv
