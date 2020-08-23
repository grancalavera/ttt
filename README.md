# ttt

## Join a match

```mermaid
sequenceDiagram
  participant C as ttt-client
  participant S as ttt-server

  C->>+S: join()
  note right of S: Find first <br/>Match.state = Challenge<br/> If nothing found then create<br/>Match.state = NewMatch
  S-->>-C: Match

  note left of C: We already have the <br />state of the Match,<br />so no need to query it.
  C->>C: redirect to /match/:Match.id
```

## Resume a match

```mermaid
sequenceDiagram
  participant C as ttt-client
  participant S as ttt-server

  C->>+S: query all (Match, User)
  S-->>-C: List of Match

  C->>C: select(Match)
  activate C
  C->>+S: query(Match.id)
  S-->>-C: Match | WorflowError
  C->>C: redirect to /match/:Match.id
  deactivate C
```

## Gameplay

```mermaid
sequenceDiagram
  participant C as ttt-client
  participant S as ttt-server

  C->>+S: subscribe(Match.id)
  activate C
  S--xC: MatchState | WorkflowError

  C->>+S: mutate(Match)
  S-->>-C: void

  C->>S: unsubscribe(Match)
  S-->>-C: void
  deactivate C
```
## References

- [Wlaschin, Scott. Domain Modelling Made Functional](https://fsharpforfunandprofit.com/books/)
- [Harel, David. Statecharts: A visual formalism for complex systems](http://www.inf.ed.ac.uk/teaching/courses/seoc/2004_2005/resources/statecharts.pdf)
