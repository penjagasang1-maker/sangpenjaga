import { drizzle } from 'drizzle-orm/tidb-serverless'
import { connect } from '@tidbcloud/serverless'
import * as schema from './schema'

const VALID_DATABASE_URL =
  'mysql://xZKZV6u5smaPqcs.root:Wyx9aJYjxnUWPTbR@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/sangpenjaga?ssl={"rejectUnauthorized":true}'

let dbUrl = process.env.DATABASE_URL || VALID_DATABASE_URL

// Fallback if DATABASE_URL is corrupted, truncated, or missing host in Cloudflare Dashboard
if (!dbUrl.includes('@') || !dbUrl.includes('tidbcloud.com')) {
  dbUrl = VALID_DATABASE_URL
}

export const client = connect({ url: dbUrl })
export const db = drizzle(client, { schema })

export type Database = typeof db
