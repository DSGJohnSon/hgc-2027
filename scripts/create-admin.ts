import 'dotenv/config'
import { getPayload } from 'payload'

import config from '../payload.config'

/**
 * Création du premier compte administrateur.
 *
 *   npm run create:admin -- --email=… --password=… --name=…
 *
 * Utile en production, où l'écran de création du premier utilisateur n'est
 * accessible que tant que la collection `users` est vide.
 */
const arg = (name: string): string | undefined => {
  const found = process.argv.find((value) => value.startsWith(`--${name}=`))
  return found?.slice(name.length + 3)
}

const run = async () => {
  const email = arg('email')
  const password = arg('password')
  const name = arg('name') ?? 'Administrateur'

  if (!email || !password) {
    console.error('Usage : npm run create:admin -- --email=… --password=… [--name=…]')
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`Le compte ${email} existe déjà — aucune modification.`)
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: { email, password, name, role: 'admin' },
  })

  console.log(`✔ Compte administrateur créé : ${email}`)
  process.exit(0)
}

void run().catch((error) => {
  console.error('✖ Échec :', error)
  process.exit(1)
})
