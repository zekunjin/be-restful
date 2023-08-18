#! /usr/bin/env node

import { readConf } from '@be-restful/shared'

const main = async () => {
  const conf = await readConf()
  console.log(conf)
}

main()
