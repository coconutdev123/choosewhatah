import { useState } from "react"
import { ArrowRight, ChevronRight, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MAX_PHOTOS, type Photo } from "@/logic/bracket"
import { useTournament } from "@/pages/tournament-context"

const MAX_FILE_SIZE = 15 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 8_000

async function isUsableImage(file: File): Promise<boolean> {
	if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > MAX_FILE_SIZE) return false

	const previewUrl = URL.createObjectURL(file)
	try {
		const image = new Image()
		const loaded = new Promise<boolean>((resolve) => {
			image.onload = () => resolve(image.naturalWidth <= MAX_IMAGE_DIMENSION && image.naturalHeight <= MAX_IMAGE_DIMENSION)
			image.onerror = () => resolve(false)
		})
		image.src = previewUrl
		return await loaded
	} finally {
		URL.revokeObjectURL(previewUrl)
	}
}

function createPhotos(files: File[]): Photo[] {
	return files.map((file, index) => ({
		id: `${file.name}-${file.lastModified}-${index}`,
		name: file.name.replace(/\.[^/.]+$/, ""),
		url: URL.createObjectURL(file),
	}))
}

export default function UploadPage() {
	const { photos, inputRef, setPhotos, winnerCount, setWinnerCount, startTournament } = useTournament()
	const [uploadMessage, setUploadMessage] = useState("")

	const handleFiles = async (fileList: FileList | null) => {
		if (!fileList) return
		const candidates = Array.from(fileList)
		const validFiles: File[] = []
		for (const file of candidates) {
			if (await isUsableImage(file)) validFiles.push(file)
		}
		const available = MAX_PHOTOS - photos.length
		const acceptedFiles = validFiles.slice(0, available)
		setPhotos([...photos, ...createPhotos(acceptedFiles)])
		const rejectedCount = candidates.length - acceptedFiles.length
		setUploadMessage(rejectedCount ? `${rejectedCount} file${rejectedCount === 1 ? " was" : "s were"} skipped. Use JPG, PNG, or WEBP images under 15 MB and 8,000 pixels per side.` : `${acceptedFiles.length} photo${acceptedFiles.length === 1 ? " is" : "s are"} ready.`)
	}

	const removePhoto = (id: string) => {
		const photo = photos.find((item) => item.id === id)
		if (photo) URL.revokeObjectURL(photo.url)
		setPhotos(photos.filter((item) => item.id !== id))
	}

	return <>
		<section className="hero">
			<div className="hero-copy">
				<p className="eyebrow">your photos, head to head</p>
				<h1>Find your<br /><em>favorites.</em></h1>
				<p className="hero-subtitle">Put your photo collection to the test. Upload up to 32 favorites, then choose your way to the winners.</p>
			</div>
			<label className="upload-zone" htmlFor="photo-upload">
				<input aria-describedby="upload-help" className="visually-hidden" id="photo-upload" ref={inputRef} accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} type="file" />
				<span className="upload-icon"><Upload size={19} /></span>
				<span><strong>{photos.length ? `${photos.length} photo${photos.length === 1 ? "" : "s"} ready` : "Choose your photos"}</strong><small id="upload-help">JPG, PNG, or WEBP / up to {MAX_PHOTOS} / 15 MB each</small></span>
				<ChevronRight className="upload-arrow" size={18} />
			</label>
		</section>
		<p aria-live="polite" className="upload-message">{uploadMessage}</p>
		{photos.length > 0 && <PhotoTray photos={photos} onRemove={removePhoto} />}
		<section className="start-panel">
			<div>
				<span className="section-kicker">Ready when you are</span>
				<h2>{photos.length < 2 ? "Add at least two photos" : `${photos.length} photos. ${winnerCount} winner${winnerCount === 1 ? "" : "s"}.`}</h2>
				{photos.length >= 2 && <label className="winner-count-control">Choose winners <select aria-label="Number of winners" value={winnerCount} onChange={(event) => setWinnerCount(Number(event.target.value))}>{Array.from({ length: Math.min(10, photos.length) }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>}
			</div>
			<Button className="start-button" disabled={photos.length < 2} onClick={startTournament}>Start choosing <ArrowRight size={16} /></Button>
		</section>
		<p className="content-note">Photos are processed locally in this browser. Only upload images you own or have permission to use, and avoid confidential or sensitive images.</p>
	</>
}

function PhotoTray({ photos, onRemove }: { photos: Photo[]; onRemove: (id: string) => void }) {
	return <section aria-label="Uploaded photo collection" className="photo-tray"><div className="tray-heading"><span className="section-kicker">Your collection</span><span aria-live="polite">{photos.length} / {MAX_PHOTOS}</span></div><div className="tray-grid">{photos.map((photo, index) => <div className="tray-photo" key={photo.id}><img alt={`Uploaded photo ${index + 1}`} src={photo.url} /><button aria-label={`Remove uploaded photo ${index + 1}`} onClick={() => onRemove(photo.id)} type="button">×</button></div>)}</div></section>
}
