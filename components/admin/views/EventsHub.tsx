import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

/**
 * Page intermédiaire « Événements ».
 *
 * La maquette du tableau de bord ne prévoit pas d'entrée pour les séries
 * d'événements ni pour les catégories : cet écran les regroupe derrière la card
 * « Événements ». Volontairement minimal — la page Événements doit être refondue
 * plus tard et absorbera ces contenus.
 */

type Entry = {
  title: string
  description: string
  href: string
  count: number
}

const EntryCard = ({ title, description, href, count }: Entry) => (
  <Link className="hgc-hub__card" href={href}>
    <span className="hgc-hub__count">{count}</span>
    <span className="hgc-hub__title">{title}</span>
    <span className="hgc-hub__description">{description}</span>
  </Link>
)

export const EventsHub = async ({ payload }: AdminViewServerProps) => {
  const adminRoute = payload.config.routes.admin
  const { serverURL } = payload.config

  const url = (path: `/${string}`) =>
    formatAdminURL({ adminRoute, serverURL, path, relative: true })

  const [events, series, categories] = await Promise.all([
    payload.count({ collection: 'events' }),
    payload.count({ collection: 'event-series' }),
    payload.count({ collection: 'categories' }),
  ])

  return (
    <div className="hgc-hub">
      <header className="hgc-hub__header">
        <Link className="hgc-hub__back" href={url('/')}>
          ← Tableau de bord
        </Link>
        <h1 className="hgc-hub__heading">Événements</h1>
        <p className="hgc-hub__intro">
          Gérez les événements ponctuels, les tournées déclinées en plusieurs étapes
          et les catégories qui servent à les filtrer sur le site.
        </p>
      </header>

      <div className="hgc-hub__grid">
        <EntryCard
          count={events.totalDocs}
          description="Événements et tournois ponctuels."
          href={url('/collections/events')}
          title="Événements"
        />
        <EntryCard
          count={series.totalDocs}
          description="Tournées déclinées en plusieurs étapes."
          href={url('/collections/event-series')}
          title="Séries d’événements"
        />
        <EntryCard
          count={categories.totalDocs}
          description="Familles d’événements utilisées par les filtres."
          href={url('/collections/categories')}
          title="Catégories"
        />
      </div>
    </div>
  )
}

export default EventsHub
