import { defineRailway, github, project, service } from 'railway/iac'

export default defineRailway(() => {
  // Railway builds the root Dockerfile and redeploys on every push to main.
  const web = service('web', {
    source: github('frixaco/inza', { branch: 'main' }),
    build: { builder: 'DOCKERFILE', dockerfilePath: 'Dockerfile' },
    start: 'node .output/server/index.mjs',
    healthcheck: '/',
  })

  return project('inza', {
    resources: [web],
  })
})
