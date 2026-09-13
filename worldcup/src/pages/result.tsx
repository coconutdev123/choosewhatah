import { ArrowLeft, RotateCcw, Sparkles, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTournament } from "@/pages/tournament-context"
import { BracketTree } from "@/components/bracket-tree"

export function ResultPage() {
	const { champion, photos, finalWinners, bracketRounds, startTournament, resetTournament } = useTournament()
	if (!champion) return null

	return <main aria-live="polite" className="winner-state"><div className="winner-confetti"><Sparkles size={31} /></div><p className="section-kicker">Best for social media stories and posts</p><h2>Your picks are ready.</h2><div className="winner-grid">{finalWinners.map((winner, index) => <div className="champion-card" key={winner.id}><img alt={`Winner ${index + 1}`} src={winner.url} /><div><span>WINNER {index + 1}</span><h3>{winner.name}</h3><p>Selected from {photos.length} photos</p></div><Trophy size={21} /></div>)}</div><Button onClick={startTournament}><RotateCcw size={15} /> Run it again</Button><button className="text-button" onClick={resetTournament} type="button"><ArrowLeft size={14} /> Upload a new collection</button><BracketTree rounds={bracketRounds} activeRound={bracketRounds.length - 1} activePair={[]} winners={[]} champion={champion} /></main>
}
