# Missão 05 — Leads

**Status:** COMPLETE  
**Depends-on:** Missions 01–04

## Key deliverables

- Models `Lead`, `LeadInteraction` (tenant-scoped)
- CRUD + search + filters + pagination
- Interaction history (NOTE, CALL, WHATSAPP, EMAIL, MEETING, OTHER)
- Optional Partner assignment with tenant validation
- API: `/api/leads`, `/api/leads/:id`, `/api/leads/:id/interactions`
- Frontend: `/app/leads`, `/app/leads/new`, `/app/leads/[id]`
- Permissions: `lead.read`, `lead.create`, `lead.update`, `lead.interaction.read`, `lead.interaction.create`

## Out of scope

Opportunity, CRM, pipeline, Customer, Sale — Mission 06+
