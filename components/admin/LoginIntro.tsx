/**
 * Panneau d'accueil de l'écran de connexion.
 *
 * Injecté via `admin.components.beforeLogin` : Payload le rend entre le logo
 * (`.login__brand`) et le formulaire (`.login__form`), tous deux enfants directs
 * de `.template-minimal__wrap`. La mise en page en deux colonnes est faite en CSS
 * sur ce conteneur (voir `app/(payload)/custom.scss`).
 */
export const LoginIntro = () => (
  <div className="hgc-login__intro">
    <h1 className="hgc-login__title">Bienvenue</h1>
    <p className="hgc-login__subtitle">
      Connectez-vous pour accéder à l’espace
      <br />
      d’administration du site
    </p>
  </div>
)

export default LoginIntro
