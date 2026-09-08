/**
 * Mission 01 — no business seed data.
 * Future missions may add technical seeds here when required.
 */
export async function seed(): Promise<void> {
  // Intentionally empty — no fake admin/partner/lead data in Mission 01.
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => {
      console.info(JSON.stringify({ level: 'info', message: 'Seed completed (no-op)' }))
    })
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
