import { Pagination } from '@/types/Pagination'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type AiTokenUsageUser = {
    UserId: string
    Nama: string
    Email: string
}

export type AiTokenUsageItem = {
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
    UsageRaw: unknown
    ProviderMetadata: unknown
    Metadata: unknown
    CreatedAt: string
    UpdatedAt: string | null
    User: AiTokenUsageUser | null
}

export type AiTokenUsageSummary = {
    totalRecords: number
    inputTokens: number
    outputTokens: number
    totalTokens: number
    reasoningTokens: number
    cachedInputTokens: number
    totalCostUsd: string | null
}

export type AiTokenUsageFilters = {
    features: string[]
    featureGroups: string[]
    statuses: string[]
    models: string[]
}

export type AiTokenUsageResponse = Pagination<AiTokenUsageItem[]> & {
    summary: AiTokenUsageSummary
    filters: AiTokenUsageFilters
}

export type GetAiTokenUsageParams = {
    page: number
    limit: number
    search?: string
    feature?: string
    featureGroup?: string
    status?: string
    model?: string
    from?: string
    to?: string
}

export async function getAiTokenUsage(
    params: GetAiTokenUsageParams
): Promise<AiTokenUsageResponse> {
    const searchParams = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
    })

    if (params.search) searchParams.set('search', params.search)
    if (params.feature) searchParams.set('feature', params.feature)
    if (params.featureGroup) searchParams.set('featureGroup', params.featureGroup)
    if (params.status) searchParams.set('status', params.status)
    if (params.model) searchParams.set('model', params.model)
    if (params.from) searchParams.set('from', params.from)
    if (params.to) searchParams.set('to', params.to)

    const res = await fetch(
        `${BASE_URL}/api/protected/token-usage?${searchParams.toString()}`
    )

    if (!res.ok) {
        throw new Error('Failed to fetch AI token usage')
    }

    return res.json()
}
