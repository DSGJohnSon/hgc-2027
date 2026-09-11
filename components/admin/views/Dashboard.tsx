import Link from 'next/link'
import type { AdminViewServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import {
  GAMES_THUMBNAIL,
  PARTNERS_THUMBNAIL,
  SERVICES_THUMBNAIL,
  getLatestNewsImage,
  getNextEventBanner,
} from './dashboardData'

/**
 * Tableau de bord de l'administration.
 *
 * Remplace la grille de collections par défaut de Payload
 * (`admin.components.views.dashboard`). L'objectif est de présenter le site tel
 * que l'association le pense — des contenus, des pages, une navigation — plutôt
 * que la liste brute des collections.
 *
 * Composant serveur : il reçoit `payload` et interroge la Local API directement.
 * Les couleurs viennent des variables de thème Payload, l'écran suit donc le
 * sélecteur clair/sombre de l'admin.
 */

type CardProps = {
  title: string
  href: string
  linkLabel: string
  image?: string
}

const Card = ({ title, href, linkLabel, image }: CardProps) => (
  <article className="hgc-dash__card">
    <header className="hgc-dash__card-head">
      <h2 className="hgc-dash__card-title">{title}</h2>
      <Link className="hgc-dash__pill" href={href}>
        {linkLabel} <span aria-hidden="true">→</span>
      </Link>
    </header>
    <Link className="hgc-dash__card-media" href={href} tabIndex={-1} aria-hidden="true">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" loading="lazy" src={image} />
      ) : (
        <span className="hgc-dash__card-placeholder" />
      )}
    </Link>
  </article>
)

type ShortcutProps = { href: string; label: string; disabled?: boolean }

const Shortcut = ({ href, label, disabled = false }: ShortcutProps) =>
  disabled ? (
    <span aria-disabled="true" className="hgc-dash__shortcut hgc-dash__shortcut--disabled">
      {label}
    </span>
  ) : (
    <Link className="hgc-dash__shortcut" href={href}>
      {label}
    </Link>
  )

export const Dashboard = async ({ payload, user }: AdminViewServerProps) => {
  const adminRoute = payload.config.routes.admin
  const { serverURL } = payload.config

  const url = (path: `/${string}`) =>
    formatAdminURL({ adminRoute, serverURL, path, relative: true })

  const [eventBanner, newsImage] = await Promise.all([
    getNextEventBanner(payload),
    getLatestNewsImage(payload),
  ])

  const firstName = (user as { name?: string } | undefined)?.name?.split(' ')[0]

  return (
    <div className="hgc-dash">
      <header className="hgc-dash__header">
        <h1 className="hgc-dash__title">
          Bienvenue{firstName ? `, ${firstName}` : ''} !
        </h1>
        <p className="hgc-dash__subtitle">
          Ceci est votre tableau de bord Holiday Geek Cup : gérez le contenu de votre
          site web en un seul endroit.
        </p>
      </header>

      <section className="hgc-dash__cards">
        <Card
          href={url('/evenements')}
          image={eventBanner}
          linkLabel="Voir les événements"
          title="Événements"
        />
        <Card
          href={url('/collections/services')}
          image={SERVICES_THUMBNAIL}
          linkLabel="Voir les services"
          title="Services"
        />
        <Card
          href={url('/collections/actualites')}
          image={newsImage}
          linkLabel="Voir les actualités"
          title="Actualités"
        />
      </section>

      {/*
        Référentiels alimentant plusieurs contenus à la fois : les jeux servent
        aux événements et aux services, les partenaires aux événements et aux
        sections « Partenaires » des pages. Ils n'ont donc leur place ni dans les
        pages, ni dans l'administration.
      */}
      <section className="hgc-dash__section">
        <h2 className="hgc-dash__section-title">Contenus partagés</h2>
        <div className="hgc-dash__cards">
          <Card
            href={url('/collections/games')}
            image={GAMES_THUMBNAIL}
            linkLabel="Voir les jeux"
            title="Jeux HGC"
          />
          <Card
            href={url('/collections/partners')}
            image={PARTNERS_THUMBNAIL}
            linkLabel="Voir les partenaires"
            title="Partenaires"
          />
        </div>
      </section>

      {/*
        Seule page du site encore éditable : sa mise en page est fixe, seuls les
        textes et les images changent.
      */}
      <section className="hgc-dash__section">
        <h2 className="hgc-dash__section-title">Pages du site web</h2>
        <div className="hgc-dash__shortcuts">
          <Shortcut
            href={url('/globals/collectivites-page')}
            label="Page Collectivités"
          />
        </div>
      </section>

      <section className="hgc-dash__admin">
        <div>
          <h2 className="hgc-dash__admin-title">Administration</h2>
          <p className="hgc-dash__admin-subtitle">
            Gestion des accès et de la bibliothèque d’images.
          </p>
        </div>
        <div className="hgc-dash__admin-actions">
          <Shortcut
            href={url('/collections/users')}
            label="Gérer les utilisateurs du backoffice"
          />
          <Shortcut
            href={url('/collections/media')}
            label="Bibliothèque d’images du site web"
          />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
