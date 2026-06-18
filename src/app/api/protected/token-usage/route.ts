import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'
import { withApiAuth } from '@/middlewares/api-auth'
import { Pagination } from '@/types/Pagination'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api/protected/token-usage')

app.use('*', withApiAuth)

type TokenUsageItem = {
    AiTokenUsageId: string
    UserId: string | null
    Feature: string
    FeatureGroup: string | null
    Page: string | null
    Route: string | null
    Method: string | null
    RequestId: string | null
    SessionId: string | null
    ReferenceType: string | null
    ReferenceId: string | null
    SdkProvider: string | null
    LlmProvider: string | null
    LlmModel: string
    LlmModelVersion: string | null
    LlmModelSlug: string
    Temperature: number | null
    TopP: number | null
    MaxOutputTokens: number | null
    InputTokens: number
    OutputTokens: number
    TotalTokens: number
    ReasoningTokens: number | null
    CachedInputTokens: number | null
    PromptCharCount: number | null
    CompletionCharCount: number | null
    PromptMessageCount: number | null
    CompletionMessageCount: number | null
    DurationMs: number | null
    FirstTokenMs: number | null
    Streaming: boolean
    Status: string
    ErrorCode: string | null
    ErrorMessage: string | null
    InputCostUsd: string | null
    OutputCostUsd: string | null
    TotalCostUsd: string | null
    Currency: string | null
    PriceSource: string | null
    UsageRaw: Prisma.JsonValue | null
    ProviderMetadata: Prisma.JsonValue | null
    Metadata: Prisma.JsonValue | null
    CreatedAt: string
    UpdatedAt: string | null
    User: {
        UserId: string
        Nama: string
        Email: string
    } | null
}

type TokenUsageSummary = {
    totalRecords: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    reasoningTokens: number
    cachedInputTokens: number
    totalCostUsd: string | null
}

type TokenUsageFilters = {
    features: string[]
    featureGroups: string[]
    statuses: string[]
    models: string[]
}

type TokenUsageResponse = Pagination<TokenUsageItem[]> & {
    summary: TokenUsageSummary
    filters: TokenUsageFilters
}

app.get('/', async (c) => {
    const page = Math.max(Number(c.req.query('page') ?? '1'), 1)
    const limit = Math.min(Math.max(Number(c.req.query('limit') ?? '10'), 5), 100)
    const search = c.req.query('search')?.trim() ?? ''
    const feature = c.req.query('feature') ?? ''
    const featureGroup = c.req.query('featureGroup') ?? ''
    const status = c.req.query('status') ?? ''
    const model = c.req.query('model') ?? ''
    const from = c.req.query('from') ?? ''
    const to = c.req.query('to') ?? ''

    const where = buildWhere({
        search,
        feature,
        featureGroup,
        status,
        model,
        from,
        to,
    })

    const [rows, total, summary, filters] = await Promise.all([
        prisma.aiTokenUsage.findMany({
            where,
            include: {
                User: {
                    select: {
                        UserId: true,
                        Nama: true,
                        Email: true,
                    },
                },
            },
            orderBy: { CreatedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.aiTokenUsage.count({ where }),
        getSummary(where),
        getFilters(),
    ])

    const totalPage = Math.ceil(total / limit)

    return c.json<TokenUsageResponse>({
        page,
        limit,
        data: rows.map((row) => ({
            ...row,
            InputCostUsd: row.InputCostUsd?.toString() ?? null,
            OutputCostUsd: row.OutputCostUsd?.toString() ?? null,
            TotalCostUsd: row.TotalCostUsd?.toString() ?? null,
            CreatedAt: row.CreatedAt.toISOString(),
            UpdatedAt: row.UpdatedAt?.toISOString() ?? null,
        })),
        totalElement: total,
        totalPage,
        isFirst: page === 1,
        isLast: page === totalPage || totalPage === 0,
        hasNext: page < totalPage,
        hasPrevious: page > 1,
        summary,
        filters,
    })
})

export const GET = handle(app)

function buildWhere(params: {
    search: string
    feature: string
    featureGroup: string
    status: string
    model: string
    from: string
    to: string
}): Prisma.AiTokenUsageWhereInput {
    const AND: Prisma.AiTokenUsageWhereInput[] = []

    if (params.search) {
        AND.push({
            OR: [
                { Feature: { contains: params.search, mode: 'insensitive' } },
                { FeatureGroup: { contains: params.search, mode: 'insensitive' } },
                { Page: { contains: params.search, mode: 'insensitive' } },
                { Route: { contains: params.search, mode: 'insensitive' } },
                { RequestId: { contains: params.search, mode: 'insensitive' } },
                { SessionId: { contains: params.search, mode: 'insensitive' } },
                { ReferenceType: { contains: params.search, mode: 'insensitive' } },
                { ReferenceId: { contains: params.search, mode: 'insensitive' } },
                { LlmProvider: { contains: params.search, mode: 'insensitive' } },
                { LlmModel: { contains: params.search, mode: 'insensitive' } },
                { LlmModelSlug: { contains: params.search, mode: 'insensitive' } },
                { User: { Nama: { contains: params.search, mode: 'insensitive' } } },
                { User: { Email: { contains: params.search, mode: 'insensitive' } } },
            ],
        })
    }

    if (params.feature && params.feature !== 'ALL') {
        AND.push({ Feature: params.feature })
    }

    if (params.featureGroup && params.featureGroup !== 'ALL') {
        AND.push({ FeatureGroup: params.featureGroup })
    }

    if (params.status && params.status !== 'ALL') {
        AND.push({ Status: params.status })
    }

    if (params.model && params.model !== 'ALL') {
        AND.push({ LlmModelSlug: params.model })
    }

    if (params.from || params.to) {
        AND.push({
            CreatedAt: {
                ...(params.from ? { gte: startOfDay(params.from) } : {}),
                ...(params.to ? { lte: endOfDay(params.to) } : {}),
            },
        })
    }

    return AND.length ? { AND } : {}
}

async function getSummary(where: Prisma.AiTokenUsageWhereInput): Promise<TokenUsageSummary> {
    const result = await prisma.aiTokenUsage.aggregate({
        where,
        _count: { _all: true },
        _sum: {
            InputTokens: true,
            OutputTokens: true,
            TotalTokens: true,
            ReasoningTokens: true,
            CachedInputTokens: true,
            TotalCostUsd: true,
        },
    })

    return {
        totalRecords: result._count._all,
        inputTokens: result._sum.InputTokens ?? 0,
        outputTokens: result._sum.OutputTokens ?? 0,
        totalTokens: result._sum.TotalTokens ?? 0,
        reasoningTokens: result._sum.ReasoningTokens ?? 0,
        cachedInputTokens: result._sum.CachedInputTokens ?? 0,
        totalCostUsd: result._sum.TotalCostUsd?.toString() ?? null,
    }
}

async function getFilters(): Promise<TokenUsageFilters> {
    const [features, featureGroups, statuses, models] = await Promise.all([
        prisma.aiTokenUsage.findMany({
            distinct: ['Feature'],
            select: { Feature: true },
            orderBy: { Feature: 'asc' },
        }),
        prisma.aiTokenUsage.findMany({
            distinct: ['FeatureGroup'],
            where: { FeatureGroup: { not: null } },
            select: { FeatureGroup: true },
            orderBy: { FeatureGroup: 'asc' },
        }),
        prisma.aiTokenUsage.findMany({
            distinct: ['Status'],
            select: { Status: true },
            orderBy: { Status: 'asc' },
        }),
        prisma.aiTokenUsage.findMany({
            distinct: ['LlmModelSlug'],
            select: { LlmModelSlug: true },
            orderBy: { LlmModelSlug: 'asc' },
        }),
    ])

    return {
        features: features.map((item) => item.Feature),
        featureGroups: featureGroups
            .map((item) => item.FeatureGroup)
            .filter((item): item is string => Boolean(item)),
        statuses: statuses.map((item) => item.Status),
        models: models.map((item) => item.LlmModelSlug),
    }
}

function startOfDay(value: string) {
    return new Date(`${value}T00:00:00.000`)
}

function endOfDay(value: string) {
    return new Date(`${value}T23:59:59.999`)
}
