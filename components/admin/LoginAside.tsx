/**
 * Mention de pied de l'écran de connexion.
 *
 * Injectée via `admin.components.afterLogin`, donc rendue après le formulaire
 * mais toujours à l'intérieur de `.template-minimal__wrap` ; le CSS la sort sous
 * la carte (`position: absolute; top: 100%`).
 *
 * Le visuel de droite n'est pas ici : il est posé en CSS (`::after` sur la carte)
 * afin d'apparaître sur **tous** les écrans d'authentification — mot de passe
 * oublié, réinitialisation, déconnexion… — qui n'offrent aucun point d'injection.
 * Ce message-ci reste spécifique au login : il parle d'obtenir un compte.
 */
export const LoginAside = () => (
  <p className="hgc-login__notice">
    Ce backoffice possède un accès privé. Pour obtenir un compte, contactez
    l’administration de{' '}
    <a href="https://holidaygeekcup.fr" rel="noreferrer" target="_blank">
      Holiday Geek Cup
    </a>
    .
  </p>
)

export default LoginAside
