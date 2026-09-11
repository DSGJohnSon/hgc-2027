/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Payload } from 'payload'

import gamesData from '@/data/games.json'
import categoriesData from '@/data/categories.json'

import { toImage, upsert } from './lib'

/** Jeux et catégories — `data/games.json`, `data/categories.json`. */
export const seedReferentials = async (payload: Payload) => {
  const games = (gamesData as any).games as any[]
  for (const game of games) {
    await upsert(payload, 'games', game.id, {
      name: game.name,
      blockType: game.blockType === 'block' ? 'block' : 'text',
      bgType: game.bgType || undefined,
      color1: game.color1 || undefined,
      color2: game.color2 || undefined,
      logo: toImage(game.logo),
      img: toImage(game.img),
      bgImg: toImage(game.bgImg),
    })
  }
  console.log(`  ${games.length} jeux`)

  const categories = (categoriesData as any).categories as any[]
  for (const category of categories) {
    await upsert(payload, 'categories', category.id, {
      name: category.name,
      color: category.color || undefined,
    })
  }
  console.log(`  ${categories.length} catégories`)
}
