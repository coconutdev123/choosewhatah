import { Link } from "react-router-dom"

type LegalPageProps = {
  type: "privacy" | "terms"
}

const updatedDate = "September 13, 2026"

export function LegalPage({ type }: LegalPageProps) {
  const isPrivacy = type === "privacy"

  return <main className="legal-page">
    <Link className="legal-back" to="/upload">Back to ChooseWhat Ah</Link>
    <p className="eyebrow">ChooseWhat Ah</p>
    <h1>{isPrivacy ? "Privacy notice" : "Terms of use"}</h1>
    <p className="legal-updated">Last updated {updatedDate}</p>

    {isPrivacy ? <PrivacyContent /> : <TermsContent />}
  </main>
}

function PrivacyContent() {
  return <div className="legal-content">
    <p>This is an independent side project. ChooseWhat Ah lets you compare photos in your browser and does not require an account.</p>
    <h2>What the app processes</h2>
    <p>When you select photos, the app creates temporary browser object URLs so it can show previews. The selected image files are not uploaded by this application or stored on its server. The photos are released when you remove them, reset the app, or leave the page.</p>
    <h2>Hosting and technical logs</h2>
    <p>The website is delivered through its hosting and network providers. Those providers may receive standard request information such as an IP address, browser details, timestamps, requested URLs, and security logs. Their own privacy policies and retention periods apply to that infrastructure.</p>
    <h2>Browser storage</h2>
    <p>The app may use browser local storage for the theme preference. Tournament photos and tournament progress are held in memory and are not intentionally persisted by the app.</p>
    <h2>Your choices</h2>
    <p>You can remove selected photos at any time, reset the tournament, or close the page. For privacy questions or requests, contact <a href="mailto:coconut.dev123@gmail.com">coconut.dev123@gmail.com</a>.</p>
    <h2>Children</h2>
    <p>This side project is not directed at children. Do not upload photos of children or other identifiable people unless you have the appropriate permission.</p>
    <h2>Updates</h2>
    <p>This notice may be updated as the project or its hosting changes. The date above identifies the latest version.</p>
  </div>
}

function TermsContent() {
  return <div className="legal-content">
    <p>By using ChooseWhat Ah, you agree to use this side project responsibly and in accordance with applicable law.</p>
    <h2>Your photos and permissions</h2>
    <p>You are responsible for the photos you select. Only use photos you own or have permission to use. Do not upload confidential information, unlawful content, or images that violate another person&apos;s privacy, publicity, or intellectual-property rights.</p>
    <h2>Local processing</h2>
    <p>The photo comparison happens in your browser. The app does not publish, transmit, or provide a public gallery for your selected photos. You remain responsible for any images you later share elsewhere.</p>
    <h2>Availability</h2>
    <p>This is a personal portfolio project provided on an as-is basis. Features may change, become unavailable, or contain errors. No guarantee is made that the service will always be available or suitable for a particular purpose.</p>
    <h2>Reports and contact</h2>
    <p>To report a problem, privacy concern, or rights issue, contact <a href="mailto:coconut.dev123@gmail.com">coconut.dev123@gmail.com</a> with enough detail to investigate.</p>
    <h2>Changes</h2>
    <p>These terms may change as the project evolves. Continued use after an update means you accept the updated terms.</p>
  </div>
}
