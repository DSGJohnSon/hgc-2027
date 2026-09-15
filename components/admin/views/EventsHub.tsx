import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { SetStepNav } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { resolveImage } from '@/lib/content/mappers/common'
import { relationId } from '@/payload/utils'

/**
 * Page intermédiaire « Événements », derrière la card du même nom du tableau de bord.
 *
 * Elle reflète le fonctionnement des contenus : un événement est ponctuel, ou
 * rattaché à une série dont il devient une étape (voir
 * `payload/collections/EventSeries.ts`). On y retrouve les trois collections,
 * des raccourcis, et chaque série avec l'état de ses étapes.
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

type StepDoc = {
  startDate?: string | null
  endDate?: string | null
  _status?: string | null
}

type Bounds = { start: number; end: number }

const DAY = 24 * 60 * 60 * 1000

/** Jour calendaire d'une date Payload (`2026-06-30T12:00:00.000Z`), en millisecondes UTC. */
const toDay = (value: string) => Date.parse(`${value.slice(0, 10)}T00:00:00Z`)

/** Première et dernière journée couvertes par les étapes d'une série. */
const boundsOf = (steps: StepDoc[]): Bounds | undefined => {
  const starts = steps.flatMap((step) => (step.startDate ? [toDay(step.startDate)] : []))
  if (starts.length === 0) return undefined
  const ends = steps.flatMap((step) => {
    const end = step.endDate || step.startDate
    return end ? [toDay(end)] : []
  })
  return { start: Math.min(...starts), end: Math.max(...ends) }
}

/**
 * Éloignement d'une série dans le temps, en jours : nul si elle est en cours,
 * sinon l'écart jusqu'à sa première étape (à venir) ou depuis sa dernière (passée).
 */
const proximityOf = (bounds: Bounds | undefined, today: number) => {
  if (!bounds) return { days: Number.POSITIVE_INFINITY, past: true }
  if (today < bounds.start) return { days: (bounds.start - today) / DAY, past: false }
  if (today > bounds.end) return { days: (today - bounds.end) / DAY, past: true }
  return { days: 0, past: false }
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** « Du 30 juin 2026 au 13 juillet 2026 », ou une seule date. */
const formatSpan = ({ start, end }: Bounds): string => {
  const first = dateFormatter.format(start)
  const last = dateFormatter.format(end)
  return first === last ? first : `Du ${first} au ${last}`
}

/** Vignette d'une série : la déclinaison `thumbnail` du média, plus légère, sinon l'image d'origine. */
const thumbnailOf = (field: unknown): string | undefined => {
  const media = (field as { media?: unknown } | undefined)?.media
  const small =
    media && typeof media === 'object'
      ? (media as { sizes?: { thumbnail?: { url?: string | null } } }).sizes?.thumbnail?.url
      : undefined
  return small || resolveImage(field as never)
}

const plural = (count: number, singular: string, pluralForm = `${singular}s`) =>
  `${count} ${count > 1 ? pluralForm : singular}`

/** Liste des événements filtrée, au format de requête produit par les filtres de Payload. */
const eventsWhere = (condition: string): `/${string}` =>
  `/collections/events?where[or][0][and][0]${condition}`

export const EventsHub = async ({
  initPageResult,
  params,
  payload,
  searchParams,
}: AdminViewServerProps) => {
  const adminRoute = payload.config.routes.admin
  const { serverURL } = payload.config

  const url = (path: `/${string}`) =>
    formatAdminURL({ adminRoute, serverURL, path, relative: true })

  // Payload ne protège pas les vues personnalisées (`isCustomAdminView`, dans
  // `@payloadcms/next/dist/views/Root`) : sans ce contrôle, la page — séries et
  // étapes en brouillon comprises — s'afficherait sans être connecté. Même
  // redirection que pour les vues natives (`handleAuthRedirect`, non exportée).
  if (!initPageResult.permissions.canAccessAdmin) {
    const { login, unauthorized } = payload.config.admin.routes
    const target = url(initPageResult.req.user ? unauthorized : login)
    redirect(`${target}?redirect=${encodeURIComponent(url('/evenements'))}`)
  }

  const [events, standalone, series, steps, categories] = await Promise.all([
    payload.count({ collection: 'events' }),
    payload.count({ collection: 'events', where: { series: { exists: false } } }),
    payload.find({
      collection: 'event-series',
      // Profondeur 1 : le média de la vignette est peuplé, son URL disponible.
      depth: 1,
      pagination: false,
      sort: 'title',
      select: { title: true, isCancelled: true, _status: true, cardThumbnail: true },
    }),
    payload.find({
      collection: 'events',
      where: { series: { exists: true } },
      depth: 0,
      pagination: false,
      select: { series: true, startDate: true, endDate: true, _status: true },
    }),
    payload.count({ collection: 'categories' }),
  ])

  const stepsBySeries = new Map<string, StepDoc[]>()
  for (const step of steps.docs) {
    const seriesId = relationId(step.series)
    if (!seriesId) continue
    stepsBySeries.set(seriesId, [...(stepsBySeries.get(seriesId) ?? []), step])
  }

  // Séries de la plus proche à la plus éloignée dans le temps : celle en cours,
  // puis les autres selon l'écart avec aujourd'hui (à écart égal, une série à
  // venir avant une série passée) ; les séries sans étape ferment la liste.
  const today = toDay(new Date().toISOString())
  const seriesRows = series.docs
    .map((doc) => {
      const seriesSteps = stepsBySeries.get(String(doc.id)) ?? []
      const bounds = boundsOf(seriesSteps)
      return { bounds, doc, proximity: proximityOf(bounds, today), seriesSteps }
    })
    .sort(
      (a, b) =>
        a.proximity.days - b.proximity.days ||
        Number(a.proximity.past) - Number(b.proximity.past) ||
        (a.bounds?.start ?? 0) - (b.bounds?.start ?? 0),
    )

  return (
    // Vue ajoutée (et non remplacée) : Payload la rend sans gabarit. On reprend
    // celui des vues natives — menu latéral, en-tête — avec les mêmes props
    // que `@payloadcms/next/dist/views/Root`.
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={payload}
      permissions={initPageResult.permissions}
      req={initPageResult.req}
      searchParams={searchParams}
      user={initPageResult.req.user ?? undefined}
      visibleEntities={{
        // Copie volontaire : passer l'objet d'origine déclenche une erreur
        // « read only » sous React 19 (même contournement que Payload).
        collections: initPageResult.visibleEntities?.collections,
        globals: initPageResult.visibleEntities?.globals,
      }}
    >
      <SetStepNav nav={[{ label: 'Événements' }]} />

      <div className="hgc-hub">
        <header className="hgc-hub__header">
          <Link className="hgc-hub__back" href={url('/')}>
            ← Tableau de bord
          </Link>
          <h1 className="hgc-hub__heading">Événements</h1>
          <p className="hgc-hub__intro">
            Un événement est soit ponctuel, soit rattaché à une série — une tournée — dont il
            devient une étape. La série porte ce qui est commun à ses étapes (visuels,
            description, jeux, partenaires) : chaque étape ne renseigne que ce qui lui est
            propre, et reprend le reste de sa série.
          </p>
        </header>

        <div className="hgc-hub__grid">
          <EntryCard
            count={events.totalDocs}
            description={`${plural(standalone.totalDocs, 'ponctuel')} et ${plural(steps.docs.length, 'étape')} de séries.`}
            href={url('/collections/events')}
            title="Événements"
          />
          <EntryCard
            count={series.docs.length}
            description="Tournées regroupant plusieurs événements, leurs étapes."
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

        <section className="hgc-dash__section">
          <h2 className="hgc-dash__section-title">Raccourcis</h2>
          <div className="hgc-dash__shortcuts">
            <Link className="hgc-dash__shortcut" href={url('/collections/events/create')}>
              Nouvel événement
            </Link>
            <Link className="hgc-dash__shortcut" href={url('/collections/event-series/create')}>
              Nouvelle série
            </Link>
            <Link className="hgc-dash__shortcut" href={url(eventsWhere('[series][exists]=false'))}>
              Événements ponctuels
            </Link>
            <Link className="hgc-dash__shortcut" href={url(eventsWhere('[series][exists]=true'))}>
              Toutes les étapes de séries
            </Link>
          </div>
          <p className="hgc-hub__hint">
            Pour ajouter une étape à une série, créez un événement puis choisissez la série dans
            son champ « Série ».
          </p>
        </section>

        <section className="hgc-dash__section">
          <h2 className="hgc-dash__section-title">Séries et étapes</h2>
          {seriesRows.length === 0 ? (
            <p className="hgc-hub__hint">Aucune série pour le moment.</p>
          ) : (
            <ul className="hgc-hub__series">
              {seriesRows.map(({ bounds, doc, seriesSteps }) => {
                const drafts = seriesSteps.filter((step) => step._status === 'draft').length
                const published = seriesSteps.length - drafts
                const seriesHref = url(`/collections/event-series/${doc.id}`)
                const thumbnail = thumbnailOf(doc.cardThumbnail)

                const meta = [
                  seriesSteps.length > 0 ? plural(seriesSteps.length, 'étape') : 'Aucune étape',
                  drafts > 0 ? `dont ${plural(drafts, 'brouillon')}` : undefined,
                  bounds ? formatSpan(bounds) : undefined,
                  doc._status === 'draft' ? 'Série en brouillon' : undefined,
                  doc.isCancelled ? 'Série annulée' : undefined,
                ].filter(Boolean)

                return (
                  <li className="hgc-hub__series-row" key={doc.id}>
                    <Link
                      aria-hidden="true"
                      className="hgc-hub__series-media"
                      href={seriesHref}
                      tabIndex={-1}
                    >
                      {thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" loading="lazy" src={thumbnail} />
                      ) : null}
                    </Link>
                    <div className="hgc-hub__series-info">
                      <Link className="hgc-hub__series-title" href={seriesHref}>
                        {doc.title || 'Sans titre'}
                      </Link>
                      <span className="hgc-hub__series-meta">{meta.join(' · ')}</span>
                      {published === 0 ? (
                        <span className="hgc-hub__series-warning">
                          Absente du site tant qu’aucune étape n’est publiée.
                        </span>
                      ) : null}
                    </div>
                    <div className="hgc-hub__series-actions">
                      <Link className="hgc-dash__pill" href={seriesHref}>
                        Modifier la série
                      </Link>
                      <Link
                        className="hgc-dash__pill"
                        href={url(eventsWhere(`[series][equals]=${doc.id}`))}
                      >
                        Voir les étapes <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </DefaultTemplate>
  )
}

export default EventsHub
