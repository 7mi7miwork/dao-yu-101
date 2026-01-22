import { MinecraftButton } from '@/components/ui/MinecraftButton'
import { MinecraftCard } from '@/components/ui/MinecraftCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-minecraft-world">
      {/* Header */}
      <header className="minecraft-stone p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white pixel-text">
            Dao Yu 101
          </h1>
          <nav className="flex gap-4">
            <MinecraftButton variant="secondary" size="sm">
              Login
            </MinecraftButton>
            <MinecraftButton variant="primary" size="sm">
              Registrieren
            </MinecraftButton>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white pixel-text mb-4 animate-float">
            Willkommen in der Lernwelt
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entdecke eine neue Art des Lernens im Minecraft-Stil. 
            Baue dein Wissen Block für Block auf!
          </p>
          <div className="flex gap-4 justify-center">
            <MinecraftButton variant="primary" size="lg">
              Jetzt Starten
            </MinecraftButton>
            <MinecraftButton variant="secondary" size="lg">
              Mehr Erfahren
            </MinecraftButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <MinecraftCard className="text-center">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Gamified Learning</h3>
            <p className="text-gray-600">
              Lerne spielerisch mit Minecraft-Elementen und sammle Erfolge.
            </p>
          </MinecraftCard>
          
          <MinecraftCard className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold mb-2">Kurse für Alle</h3>
            <p className="text-gray-600">
              Von Programmierung bis Kunst - finde deinen perfekten Kurs.
            </p>
          </MinecraftCard>
          
          <MinecraftCard className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Gemeinschaft</h3>
            <p className="text-gray-600">
              Lerne mit anderen und tausche dich in unserer Community aus.
            </p>
          </MinecraftCard>
        </div>

        {/* Stats Section */}
        <div className="minecraft-dirt p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold text-white mb-8 pixel-text">
            Unsere Community in Zahlen
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-white pixel-text">1,234</div>
              <div className="text-white/80">Lernende</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white pixel-text">56</div>
              <div className="text-white/80">Kurse</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white pixel-text">89%</div>
              <div className="text-white/80">Erfolgsquote</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white pixel-text">4.8</div>
              <div className="text-white/80">Bewertung</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="minecraft-obsidian p-8 text-white">
        <div className="container mx-auto text-center">
          <p className="pixel-text mb-2">Dao Yu 101 - Minecraft Learning Platform</p>
          <p className="text-white/70">© 2024 Alle Rechte vorbehalten</p>
        </div>
      </footer>
    </div>
  )
}
