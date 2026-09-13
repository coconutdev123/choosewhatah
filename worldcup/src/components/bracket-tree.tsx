import { Check, Crown } from "lucide-react"
import { getRoundLabel, type Photo } from "@/logic/bracket"

type BracketTreeProps = {
  rounds: Photo[][]
  activeRound: number
  activePair: Photo[]
  winners: Photo[]
  champion: Photo | null
}

export function BracketTree({ rounds, activeRound, activePair, winners, champion }: BracketTreeProps) {
  if (!rounds.length) return null

  return <section className="bracket-tree-section">
    <div className="bracket-tree-heading">
      <div><p className="section-kicker">The full picture</p><h2>Your bracket</h2></div>
      <span>Scroll to explore</span>
    </div>
    <div className="bracket-tree-scroll">
      <div className="bracket-tree">
        {rounds.map((round, roundIndex) => <div className={`bracket-column bracket-column-${roundIndex}`} key={`${roundIndex}-${round.length}`}>
          <p className="bracket-column-label">{getRoundLabel(round.length)}</p>
          <div className="bracket-column-matches">
            {round.map((photo, photoIndex) => {
              const isActive = roundIndex === activeRound && activePair.some((item) => item.id === photo.id)
              const isChosen = roundIndex === activeRound && winners.some((item) => item.id === photo.id)
              const isChampion = champion?.id === photo.id
              return <div className={`bracket-node ${isActive ? "is-active" : ""} ${isChosen ? "is-chosen" : ""} ${isChampion ? "is-champion" : ""}`} key={photo.id}>
                <img alt="" src={photo.url} />
                <span>{photo.name}</span>
                {isChampion && <Crown size={12} />}
                {isChosen && !isChampion && <Check size={12} />}
                {photoIndex % 2 === 0 && roundIndex < rounds.length - 1 && <i className="bracket-connector" />}
              </div>
            })}
          </div>
        </div>)}
      </div>
    </div>
  </section>
}
