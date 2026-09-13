import { useEffect, useRef, useState } from "react"
import { CircleHelp, Mail, Sparkles, X } from "lucide-react"
import { Outlet, useNavigate } from "react-router-dom"
import { type Photo } from "@/logic/bracket"
import { shuffle } from "@/logic/shuffle"
import { TournamentContext } from "@/pages/tournament-context"

export function LandingPage() {
	const navigate = useNavigate()
	const inputRef = useRef<HTMLInputElement>(null)
	const [photos, setPhotos] = useState<Photo[]>([])
	const [currentRound, setCurrentRound] = useState<Photo[]>([])
	const [bracketRounds, setBracketRounds] = useState<Photo[][]>([])
	const [winners, setWinners] = useState<Photo[]>([])
	const [matchIndex, setMatchIndex] = useState(0)
	const [roundNumber, setRoundNumber] = useState(1)
	const [champion, setChampion] = useState<Photo | null>(null)
	const [finalWinners, setFinalWinners] = useState<Photo[]>([])
	const [winnerCount, setWinnerCount] = useState(1)
	const [helpOpen, setHelpOpen] = useState(false)
	const initialPath = useRef(window.location.pathname)

	useEffect(() => {
		const openedTournamentRoute = initialPath.current.endsWith("/matchup") || initialPath.current.endsWith("/result")
		if (openedTournamentRoute && photos.length === 0) {
			navigate("/upload", { replace: true })
		}
	}, [navigate, photos.length])

	useEffect(() => {
		if (!helpOpen) return
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setHelpOpen(false)
		}
		window.addEventListener("keydown", closeOnEscape)
		return () => window.removeEventListener("keydown", closeOnEscape)
	}, [helpOpen])

	const startTournament = () => {
		if (photos.length < 2) return
		const shuffledPhotos = shuffle(photos)
		setCurrentRound(shuffledPhotos)
		setBracketRounds([shuffledPhotos])
		setWinners([])
		setMatchIndex(0)
		setRoundNumber(1)
		setChampion(null)
		setFinalWinners([])
		navigate("/matchup")
	}

	const choosePhoto = (photo: Photo) => {
		const completed = [...winners, photo]
		const remaining = currentRound.slice(matchIndex + 2)

		if (remaining.length >= 2) {
			setWinners(completed)
			setMatchIndex(matchIndex + 2)
			return
		}

		const nextRound = remaining.length === 1 ? [...completed, remaining[0]] : completed
		if (nextRound.length === 1) {
			const nextWinner = nextRound[0]
			const rankedWinners = [...finalWinners, nextWinner]
			setFinalWinners(rankedWinners)
			setChampion(nextWinner)

			if (rankedWinners.length >= winnerCount || rankedWinners.length >= photos.length - 1) {
				navigate("/result")
				return
			}

			const remainingPhotos = photos.filter((photo) => !rankedWinners.some((winner) => winner.id === photo.id))
			if (remainingPhotos.length === 1) {
				const allWinners = [...rankedWinners, remainingPhotos[0]]
				setFinalWinners(allWinners)
				setChampion(remainingPhotos[0])
				navigate("/result")
				return
			}
			const nextBracket = shuffle(remainingPhotos)
			setCurrentRound(nextBracket)
			setBracketRounds([nextBracket])
			setWinners([])
			setMatchIndex(0)
			setRoundNumber(1)
			return
		}

		setCurrentRound(nextRound)
		setBracketRounds((rounds) => [...rounds, nextRound])
		setWinners([])
		setMatchIndex(0)
		setRoundNumber((current) => current + 1)
	}

	const resetTournament = () => {
		photos.forEach((photo) => URL.revokeObjectURL(photo.url))
		setPhotos([])
		setCurrentRound([])
		setBracketRounds([])
		setWinners([])
		setChampion(null)
		setFinalWinners([])
		setWinnerCount(1)
		setMatchIndex(0)
		setRoundNumber(1)
		if (inputRef.current) inputRef.current.value = ""
		navigate("/upload")
	}

	const value = {
		photos,
		inputRef,
		currentRound,
		bracketRounds,
		winners,
		matchIndex,
		roundNumber,
		champion,
		finalWinners,
		winnerCount,
		setPhotos,
		setWinnerCount,
		startTournament,
		choosePhoto,
		resetTournament,
	}

	return <TournamentContext.Provider value={value}>
		<div className="app-shell">
			<header className="topbar">
				<button className="brand" onClick={resetTournament} type="button">
					<span className="brand-mark"><Sparkles size={15} /></span>
					    Choose<span className="brand-accent">What</span> Ah
				</button>
				<div className="top-actions">
					{champion && <span className="round-pill"><span className="live-dot" />client-side only</span>}
					<button aria-label="How it works and privacy information" className="icon-button" onClick={() => setHelpOpen(true)} title="How it works" type="button"><CircleHelp size={18} /></button>
				</div>
			</header>
			<Outlet />
			<footer>
				<span className="footer-note"><span className="tiny-spark">*</span> made for impossible decisions</span>
				<a className="footer-contact" href="mailto:coconut.dev123@gmail.com"><Mail size={13} /> Contact for feedback or issues</a>
				<span className="footer-privacy"><span>Photos stay in your browser</span><i /><a className="footer-link" href="/privacy">Privacy</a><i /><a className="footer-link" href="/terms">Terms</a></span>
			</footer>
        
			{helpOpen && <div aria-labelledby="help-title" aria-modal="true" className="dialog-backdrop" role="dialog"><div className="info-dialog"><button aria-label="Close information dialog" className="dialog-close" onClick={() => setHelpOpen(false)} type="button"><X size={17} /></button><p className="section-kicker">How it works</p><h2 id="help-title">Your photos stay in this browser.</h2><p>Choose up to 32 JPG, PNG, or WEBP images. They are previewed and compared locally using temporary browser object URLs. This app does not upload the image files or store them on a server.</p><p>Your hosting provider may still receive standard web request logs such as your IP address, browser, and requested page. The theme preference may be stored in your browser&apos;s local storage.</p><p>Only upload images you own or have permission to use. Avoid confidential, sensitive, or identifying images unless you have the appropriate consent. Read the <a className="footer-link" href="/privacy">privacy notice</a> and <a className="footer-link" href="/terms">terms</a> for more detail.</p><button className="dialog-action" onClick={() => setHelpOpen(false)} type="button">Got it</button></div></div>}
		</div>
	</TournamentContext.Provider>
}
