import { Card, ThreeCardSet, FourCardRun, HandlerResponsesQueue, Meld } from '@cards-ts/core';
import { Handler } from '../handler';
import { HandlerData } from '../handler-data';
import { TurnResponseMessage, WantCardResponseMessage } from '../messages/response';
import { find } from '../util/find';

export class LocalMaximumHandler implements Handler {
    public message() {
    }

    public waitingFor() {
    }

    public wantCard({hand, played, position, round, deckCard, wouldBeTurn, gameParams: {rounds}}: HandlerData, responsesQueue: HandlerResponsesQueue<WantCardResponseMessage>): void {
        const currentRound = rounds[round];
        if(played[position].length > 0) {
            responsesQueue.push(new WantCardResponseMessage(false));
            return;
        }
        if(deckCard.isWild()) {
            // console.log(position, 'want wild', card.toString());
            responsesQueue.push(new WantCardResponseMessage(true));
            return;
        }
        const oldFound = find([...hand], currentRound);
        const newFound = find([deckCard, ...hand], currentRound);
        const advantage = newFound[0] - oldFound[0];
        if(oldFound[0] === 0 && newFound[0] === 0 && wouldBeTurn && newFound[1] <= oldFound[1]) {
            // pickup card if it is our turn, we have already completed, and it doesn't add value to us
            // console.log(position, 'want card', card.toString());
            // console.log(oldFound.toString());
            // console.log(newFound.toString());
            responsesQueue.push(new WantCardResponseMessage(true));
            return;
        }
        if(round !== rounds.length - 1) {
            if(advantage < 0) {
                // if not last round and card would benefit us, grab it
                responsesQueue.push(new WantCardResponseMessage(true));
                return;
            }
        } else {
            if(advantage < 0) {
                // if last round and card would benefit us
                // grab only if we are lacking many cards or it will be our turn
                if(oldFound[0] > 3 || wouldBeTurn) {
                    // console.log(position, 'want card', card.toString());
                    // console.log(oldFound.toString());
                    // console.log(newFound.toString());
                    responsesQueue.push(new WantCardResponseMessage(true));
                    return;
                }
            }
        }
        responsesQueue.push(new WantCardResponseMessage(false));
        return;
    }

    public turn({hand, played, position, round, gameParams: {rounds}}: HandlerData, responsesQueue: HandlerResponsesQueue<TurnResponseMessage>) {
        const currentRound = rounds[round];
        let result: { toDiscard: Card, toPlay: Meld[][] };
        if(played[position].length === 0) {
            const found = find([...hand], currentRound);
            // console.log(currentRound.toString(), position, found.toString());
            // console.log(position, found.toString());
            const without = (arr: Card[], card: Card) => {const result = arr.slice(); result.splice(arr.indexOf(card), 1); return result;};
            let toDiscard;
            const toPlay = played;
            if(found[0] === 0 && (rounds.length - 1 !== round || found[1] === 0)) {
                // TODO with handling of no discard on all down move this up
                // console.log(position, 'can play', found[2].toString());
                toPlay[position] = found[2].map((cards, i) => currentRound[i] === 3 ? new ThreeCardSet(cards) : new FourCardRun(cards));
                found[2].forEach(run => run.forEach(card => hand.splice(hand.findIndex(c => card.equals(c)), 1)));
                for(let i = 0; i < hand.length; i++) {
                    const card = hand[i];
                    for(const run of played.reduce((a, b) => { a.push(...b); return a; }, [])) {
                        if(run.isLive(card)) {
                            run.add(card);
                            hand.splice(i, 1);
                            i--;
                            break;
                        }
                    }
                }
                toDiscard = hand[0] || null; // TODO better
            } else {
                let nonlive = [];
                if(found[0] === 0) {
                    nonlive.push(...found[3].filter(card => !played.some(player => player.some(play => play.isLive(card)))));
                }
                if(!nonlive.length) {
                    nonlive.push(...hand.filter(card => !played.some(player => player.some(play => play.isLive(card)))));
                }
                if(nonlive.some(card => !card.isWild())) {
                    // otherwise has a tendency to discard wilds which normally benefits other players more than us
                    nonlive = nonlive.filter(card => !card.isWild());
                }
                const finds = nonlive.map(card => find(without(hand, card), currentRound) );
                let worst = 0;
                for(let i = 0; i < finds.length; i++) {
                    // TODO can even add logic about discarding cards others don't desire
                    if(finds[i][0] === finds[worst][0]) {
                        if(finds[i][1] < finds[worst][1]) {
                            worst = i;
                        }
                    } else {
                        if(finds[i][0] < finds[worst][0]) {
                            worst = i;
                        }
                    }
                }
                toDiscard = nonlive[worst];
            }
            result = { toDiscard, toPlay };
        } else {
            for(let i = 0; i < hand.length; i++) {
                const card = hand[i];
                for(const run of played.reduce((a, b) => { a.push(...b); return a; }, [])) {
                    if(run.isLive(card)) {
                        run.add(card);
                        hand.splice(i, 1);
                        i--;
                        break;
                    }
                }
            }
            result = { toDiscard: hand[0], toPlay: played };
        }

        responsesQueue.push(new TurnResponseMessage(result.toDiscard, result.toPlay));
        return;
    }
}
