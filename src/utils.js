import { unlink } from 'fs/promises'

const MAX_CONVERSATION_LENGTH = 10

export function normalize() {
  return function (ctx, next) {
    normalizeSession(ctx)
    return next()
  }
}

export async function removeFile(filepath) {
  try {
    await unlink(filepath)
  } catch (e) {
    console.log(`Error while unlinking file: `, e.message)
  }
}

export const gptMessage = (content, role = 'user') => ({
  content,
  role,
})

export const emptySession = () => ({
  messages: [],
  conversations: [],
})

export function initCommand(message) {
  return async function (ctx) {
    ctx.session = emptySession()
    await ctx.reply(message)
  }
}

function normalizeSession(ctx) {
  ctx.session ??= emptySession()
  if (ctx.session.messages.length > MAX_CONVERSATION_LENGTH) {
    ctx.session = emptySession()
  }
}
