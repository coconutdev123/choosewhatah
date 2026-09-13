import { ArrowRight, Check, ImagePlus, Trophy } from "lucide-react"
import { getRoundCount, getRoundLabel, type Photo } from "@/logic/bracket"
import { useTournament } from "@/pages/tournament-context"
import { BracketTree } from "@/components/bracket-tree"

export function MatchupPage() {
	const { photos, currentRound, bracketRounds, winners, matchIndex, roundNumber, choosePhoto } = useTournament()
	const currentPair = currentRound.slice(matchIndex, matchIndex + 2)
	const roundCount = photos.length ? getRoundCount(photos.length) : 1
	const completedMatches = Math.floor(matchIndex / 2)

	return <main className="workspace">
		<aside className="bracket-panel">
			<div className="panel-heading"><div><p className="section-kicker">The journey</p><h2>Your bracket</h2></div><span className="trophy"><Trophy size={18} /></span></div>
			<div aria-label="Round progress" aria-valuemax={Math.ceil(currentRound.length / 2)} aria-valuemin={0} aria-valuenow={completedMatches} className="progress-track" role="progressbar"><span style={{ width: `${Math.min(100, (completedMatches / Math.max(1, currentRound.length / 2)) * 100)}%` }} /></div>
			<div className="round-list">{Array.from({ length: roundCount }, (_, index) => {
				const roundSize = Math.max(2, Math.ceil(photos.length / 2 ** index))
				const isDone = index < roundNumber - 1
				return <div className={`round-row ${index === roundNumber - 1 ? "active" : ""} ${isDone ? "done" : ""}`} key={index}><span className="round-number">{isDone ? <Check size={11} /> : index + 1}</span><span>{getRoundLabel(roundSize)}</span><small>{isDone ? "Complete" : index === roundNumber - 1 ? "In progress" : "Up next"}</small></div>
			})}</div>
			<div className="bracket-note"><span className="note-line" /><p>Trust your gut.<br /><strong>There are no wrong picks.</strong></p></div>
		</aside>
		<section className="matchup-panel">
			<div className="matchup-heading"><div><p className="section-kicker">Round {roundNumber} <span className="slash">/</span> {getRoundLabel(currentRound.length)}</p><h2>Which one wins?</h2></div><span className="match-count">{Math.floor(matchIndex / 2) + 1}<small> / {Math.ceil(currentRound.length / 2)}</small></span></div>
			<div className="photo-pair">{currentPair.map((photo, index) => <PhotoChoice key={photo.id} photo={photo} label={index === 0 ? "A" : "B"} onChoose={choosePhoto} />)}</div>
			<div className="versus"><span /><b>OR</b><span /></div>
			<p className="helper-text"><ImagePlus size={14} /> Tap a photo to send it through</p>
		</section>
		<BracketTree rounds={bracketRounds} activeRound={roundNumber - 1} activePair={currentPair} winners={winners} champion={null} />
	</main>
}

function PhotoChoice({ photo, label, onChoose }: { photo: Photo; label: string; onChoose: (photo: Photo) => void }) {
	return <button className="photo-choice" onClick={() => onChoose(photo)} type="button"><div className="photo-frame"><img alt={photo.name} src={photo.url} /><span className="choice-label">{label}</span><span className="choose-overlay">Choose this one <Check size={14} /></span></div><span className="photo-caption"><span>{photo.name}</span><ArrowRight size={15} /></span></button>
}
