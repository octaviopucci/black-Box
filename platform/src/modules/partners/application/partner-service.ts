import type { Partner, PartnerStatus, Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import {
  conflictError,
  notFoundError,
  validationError,
} from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { assertValidStatusTransition } from '@/modules/partners/domain/partner-status'
import {
  normalizeDocument,
  normalizeOptionalText,
  normalizePartnerEmail,
  normalizePartnerName,
} from '@/modules/partners/domain/normalize'
import type { CreatePartnerInput, UpdatePartnerInput } from '@/modules/partners/application/partner-schemas'

export type PartnerDto = {
  id: string
  organizationId: string
  userId: string | null
  name: string
  legalName: string | null
  document: string | null
  email: string | null
  phone: string | null
  status: PartnerStatus
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

const partnerSelect = {
  id: true,
  organizationId: true,
  userId: true,
  name: true,
  legalName: true,
  document: true,
  email: true,
  phone: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PartnerSelect

function toPartnerDto(partner: Partner): PartnerDto {
  return {
    id: partner.id,
    organizationId: partner.organizationId,
    userId: partner.userId,
    name: partner.name,
    legalName: partner.legalName,
    document: partner.document,
    email: partner.email,
    phone: partner.phone,
    status: partner.status,
    notes: partner.notes,
    createdAt: partner.createdAt,
    updatedAt: partner.updatedAt,
  }
}

async function assertUserLinkAllowed(
  organizationId: string,
  userId: string,
  excludePartnerId?: string,
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.status !== 'ACTIVE') {
    throw notFoundError()
  }

  const membership = await prisma.organizationMembership.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
  })

  if (!membership || membership.status !== 'ACTIVE') {
    throw validationError('User must have an active membership in this organization')
  }

  const existing = await prisma.partner.findFirst({
    where: {
      organizationId,
      userId,
      ...(excludePartnerId ? { NOT: { id: excludePartnerId } } : {}),
    },
  })

  if (existing) {
    throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'User is already linked to a partner in this organization')
  }
}

async function findPartnerInTenant(partnerId: string, organizationId: string) {
  return prisma.partner.findFirst({
    where: { id: partnerId, organizationId },
  })
}

function handleUniqueViolation(error: unknown): never {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  ) {
    throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Partner with this identifier already exists in the organization')
  }
  throw error
}

export async function listPartners(
  ctx: AuthorizationContext,
  filters?: { status?: PartnerStatus },
): Promise<PartnerDto[]> {
  const partners = await prisma.partner.findMany({
    where: {
      organizationId: ctx.organization.id,
      ...(filters?.status ? { status: filters.status } : {}),
    },
    orderBy: [{ status: 'asc' }, { name: 'asc' }],
    select: partnerSelect,
  })

  return partners.map(toPartnerDto)
}

export async function getPartnerById(
  ctx: AuthorizationContext,
  partnerId: string,
): Promise<PartnerDto> {
  const partner = await findPartnerInTenant(partnerId, ctx.organization.id)
  if (!partner) throw notFoundError()
  return toPartnerDto(partner)
}

export async function createPartner(
  ctx: AuthorizationContext,
  input: CreatePartnerInput,
): Promise<PartnerDto> {
  const name = normalizePartnerName(input.name)
  if (!name) throw validationError('Name is required')

  if (input.userId) {
    await assertUserLinkAllowed(ctx.organization.id, input.userId)
  }

  try {
    const partner = await prisma.partner.create({
      data: {
        organizationId: ctx.organization.id,
        name,
        legalName: normalizeOptionalText(input.legalName),
        document: normalizeDocument(input.document),
        email: normalizePartnerEmail(input.email),
        phone: normalizeOptionalText(input.phone),
        notes: normalizeOptionalText(input.notes),
        userId: input.userId ?? null,
        status: 'PENDING',
      },
      select: partnerSelect,
    })

    return toPartnerDto(partner)
  } catch (error) {
    handleUniqueViolation(error)
  }
}

export async function updatePartner(
  ctx: AuthorizationContext,
  partnerId: string,
  input: UpdatePartnerInput,
): Promise<PartnerDto> {
  const existing = await findPartnerInTenant(partnerId, ctx.organization.id)
  if (!existing) throw notFoundError()

  if (input.userId) {
    await assertUserLinkAllowed(ctx.organization.id, input.userId, partnerId)
  }

  const data: Prisma.PartnerUpdateInput = {}

  if (input.name !== undefined) {
    const name = normalizePartnerName(input.name)
    if (!name) throw validationError('Name is required')
    data.name = name
  }
  if (input.legalName !== undefined) {
    data.legalName = input.legalName === null ? null : normalizeOptionalText(input.legalName)
  }
  if (input.document !== undefined) {
    data.document = input.document === null ? null : normalizeDocument(input.document)
  }
  if (input.email !== undefined) {
    data.email = input.email === null ? null : normalizePartnerEmail(input.email)
  }
  if (input.phone !== undefined) {
    data.phone = input.phone === null ? null : normalizeOptionalText(input.phone)
  }
  if (input.notes !== undefined) {
    data.notes = input.notes === null ? null : normalizeOptionalText(input.notes)
  }
  if (input.userId !== undefined) {
    data.user = input.userId
      ? { connect: { id: input.userId } }
      : { disconnect: true }
  }

  try {
    const partner = await prisma.partner.update({
      where: { id: partnerId },
      data,
      select: partnerSelect,
    })
    return toPartnerDto(partner)
  } catch (error) {
    handleUniqueViolation(error)
  }
}

export async function activatePartner(
  ctx: AuthorizationContext,
  partnerId: string,
): Promise<PartnerDto> {
  const existing = await findPartnerInTenant(partnerId, ctx.organization.id)
  if (!existing) throw notFoundError()

  assertValidStatusTransition(existing.status, 'ACTIVE')

  const partner = await prisma.partner.update({
    where: { id: partnerId },
    data: { status: 'ACTIVE' },
    select: partnerSelect,
  })

  return toPartnerDto(partner)
}

export async function deactivatePartner(
  ctx: AuthorizationContext,
  partnerId: string,
): Promise<PartnerDto> {
  const existing = await findPartnerInTenant(partnerId, ctx.organization.id)
  if (!existing) throw notFoundError()

  assertValidStatusTransition(existing.status, 'INACTIVE')

  const partner = await prisma.partner.update({
    where: { id: partnerId },
    data: { status: 'INACTIVE' },
    select: partnerSelect,
  })

  return toPartnerDto(partner)
}
