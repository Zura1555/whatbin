import { createServer } from './application.mjs'

const port = Number(process.env.PORT || 3000)
createServer().listen(port, () => console.log(`WhatBin server listening on http://localhost:${port}`))
