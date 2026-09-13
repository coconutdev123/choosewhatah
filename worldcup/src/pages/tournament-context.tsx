import { createContext, useContext } from "react"
import type { RefObject } from "react"
import type { Photo } from "@/logic/bracket"

export type TournamentContextValue = {
  photos: Photo[]
  inputRef: RefObject<HTMLInputElement | null>
  currentRound: Photo[]
  bracketRounds: Photo[][]
  winners: Photo[]
  matchIndex: number
  roundNumber: number
  champion: Photo | null
  finalWinners: Photo[]
  winnerCount: number
  setPhotos: (photos: Photo[]) => void
  setWinnerCount: (count: number) => void
  startTournament: () => void
  choosePhoto: (photo: Photo) => void
  resetTournament: () => void
}

export const TournamentContext = createContext<TournamentContextValue | null>(null)

export function useTournament() {
  const context = useContext(TournamentContext)
  if (!context) throw new Error("useTournament must be used inside LandingPage")
  return context
}
