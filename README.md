# ttt

## Domain model

- [ttt-domain/src/domain/model.ts](./ttt-domain/src/domain/model.ts)

## Workflows

- [Create match](./ttt-domain/src/workflows/create-match/workflow.ts)
- [Create game](./ttt-domain/src/workflows/create-game/workflow.ts)
- [Create challenge](./ttt-domain/src/workflows/create-challenge/workflow.ts)
- [Accept challenge](./ttt-domain/src/workflows/accept-challenge/workflow.ts)
- [Play move](./ttt-domain/src/workflows/play-move/workflow.ts)

```mermaid
sequenceDiagram
  participant c as ttt-client
  participant s as ttt-server
  participant d as ttt-domain

  note over c,d: joining matches <br />(workflows: create match, accept challenge)

  c->>+s: join(Player)

    alt firstChallenge = None
      s->>+d: createMatch(Player)
      d-->>-s: Match | WorkflowError

    else firstChallenge = Some<Match>
      s->>+d: acceptChallenge(Match, Player)

      d-->>-s: Match | WorkflowError
    end
      note right of d: these state transitions <br /> DON'T create moves

  s-->>-c: Match | WorkflowError

  c->>c: redirect to /match/:Match.id

  note over c,d: playing moves <br />(workflows: create challenge, create game, play move)

  c->>+s: subscribe(Match.id)
  activate c

  c->>+s: playMove(Match.id, Move)
  activate s
  s-->>-c: void

  s->>+d: resolveMove(Match.id, Move)
  d-->>-s: Result = MoveType | WorkflowError


  alt Result = WorkflowError
    s->>s: publish(WorkflowError)

  else Result = CreateChallenge
    s->>+d: createChallenge(Match, Move)
    d-->>-s: Match | WorkflowError
    s->>s: publish(Match.MatchState | WorkflowError)


  else Result = AcceptChallenge
    s->>+d: createGame(Match, Move)
    d-->>-s: Match | WorkflowError
    s->>s: publish(Match.MatchState | WorkflowError)


  else Result = PlayMove
    s->>+d: playMove(Match, Move)
    d-->>-s: Match | WorkflowError
    s->>s: publish(Match.MatchState | WorkflowError)

  end

  note right of d: these state transitions <br /> DO create moves

  deactivate s

  s--xc: MatchState | WorkflowError
  c->>s: unsubscribe(Match)
  s-->>-c: void
  deactivate c

  note over c,d: resuming matches

  c->>+s: findActiveMatches(Player)
  s-->>-c: Match[]

  c->>c: select(Match)
  activate c
  c->>+s: query(Match.id)
  s-->>-c: Match | WorflowError
  c->>c: redirect to /match/:Match.id
  deactivate c
```

## References

- [Harel, David. Statecharts: A visual formalism for complex systems](http://www.inf.ed.ac.uk/teaching/courses/seoc/2004_2005/resources/statecharts.pdf)
- [Wlaschin, Scott. Domain Modelling Made Functional](https://fsharpforfunandprofit.com/books/)
