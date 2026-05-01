import { getRequestListener } from '@hono/node-server'
import app from './boot'

/**
 * Vercel Serverless Function entry point.
 * 
 * getRequestListener converts Hono's Web-standard fetch handler
 * into Node.js's (req, res) callback format that Vercel expects.
 */
export default getRequestListener(app.fetch)
