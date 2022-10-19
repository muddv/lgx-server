import { Server } from '@logux/server'
import { delay } from 'nanodelay'
import {
	TextValue,
	createText,
	editText,
	deleteText,
	createdText,
	editedText,
	deletedText
} from '../protocol'

export const TEXT: Map<string, TextValue> = new Map()

export default (server: Server) => {

	// make channel for data
	server.channel('text', {
		access(ctx, action) {
			return ctx.userId == action.filter?.userId
		},
		filter(ctx) {
			return (otherCtx, otherAction) => {
				if (createdText.match(otherAction)) {
					return otherAction.fields?.userId == ctx.userId
				}
				else if (
					deleteText.match(otherAction) ||
					editedText.match(otherAction)
				) {
					return TEXT.get(otherAction.id)?.userId === ctx.userId
				} else {
					return otherCtx.userId == ctx.userId
				}
			}

		},
		load(ctx, action) {
			return Array.from(TEXT.values())
				.filter(text => action.filter?.userId)
				.map(text => {
					let { id, ...fields } = text
					return createdText({ id, fields })
				})
		}
	})

	server.channel<{ id: string }>('text/:id', {
		access(ctx) {
			return true
		}
	})

	// declare server actions
	server.type(createText, {
		access(ctx, action) {
			return ctx.userId == action.fields.userId
		},
		async process(ctx, action) {
			TEXT.set(action.id, { id: action.id, ...action.fields })
			await server.process(
				createdText({ id: action.id, fields: action.fields })
			)
		}
	})

	server.type(editText, {
		async access(ctx, action) {
			await delay(1)
			return ctx.userId == TEXT.get(action.id)?.userId
		},
		async process(ctx, action) {
			TEXT.set(action.id, { ...TEXT.get(action.id)!, ...action.fields })
			await server.process(
				editedText({ id: action.id, fields: action.fields })
			)
		}
	})

	server.type(editedText, {
		access() {
			return false
		},
		resend(ctx, action) {
			return ['text', `text/${action.id}`]
		}
	})

	server.type(deleteText, {
		access(ctx, action) {
			return ctx.userId == TEXT.get(action.id)?.userId
		},
		async process(ctx, action) {
			TEXT.delete(action.id)
			await server.process(deletedText({ id: action.id }))
		}
	})

	server.type(deletedText, {
		access() {
			return false
		},
		resend(ctx, action) {
			return ['tasks', `text/${action.id}`]
		}
	})
}

