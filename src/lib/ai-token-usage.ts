import { Prisma } from '@/generated/prisma'
import { prisma } from '@/lib/prisma'

type AiUsage = {
    inputTokens?: number
    outputTokens?: number
    totalTokens?: number
    reasoningTokens?: number
    cachedInputTokens?: number
}

type CreateAiTokenUsageInput = {
    userId?: string | null
    feature: string
    featureGroup?: string | null
    page?: string | null
    route?: string | null
    method?: string | null
    requestId?: string | null
    sessionId?: string | null
    referenceType?: string | null
    referenceId?: string | null
    sdkProvider?: string | null
    modelSlug: string
    modelName?: string | null
    modelVersion?: string | null
    temperature?: number | null
    topP?: number | null
    maxOutputTokens?: number | null
    usage?: AiUsage | null
    promptCharCount?: number | null
    completionCharCount?: number | null
    promptMessageCount?: number | null
    completionMessageCount?: number | null
    durationMs?: number | null
    firstTokenMs?: number | null
    streaming?: boolean
    status?: string
    errorCode?: string | null
    errorMessage?: string | null
    inputCostUsd?: Prisma.Decimal.Value | null
    outputCostUsd?: Prisma.Decimal.Value | null
    totalCostUsd?: Prisma.Decimal.Value | null
    currency?: string | null
    priceSource?: string | null
    usageRaw?: unknown
    providerMetadata?: unknown
    metadata?: unknown
}

export async function createAiTokenUsage(input: CreateAiTokenUsageInput) {
    const modelInfo = parseModelSlug(input.modelSlug)
    const usage = input.usage ?? null

    try {
        return await prisma.aiTokenUsage.create({
            data: {
                UserId: input.userId ?? null,
                Feature: input.feature,
                FeatureGroup: input.featureGroup ?? null,
                Page: input.page ?? null,
                Route: input.route ?? null,
                Method: input.method ?? null,
                RequestId: input.requestId ?? null,
                SessionId: input.sessionId ?? null,
                ReferenceType: input.referenceType ?? null,
                ReferenceId: input.referenceId ?? null,
                SdkProvider: input.sdkProvider ?? 'vercel-ai-sdk',
                LlmProvider: modelInfo.provider,
                LlmModel: input.modelName ?? modelInfo.model,
                LlmModelVersion: input.modelVersion ?? modelInfo.version,
                LlmModelSlug: input.modelSlug,
                Temperature: input.temperature ?? null,
                TopP: input.topP ?? null,
                MaxOutputTokens: input.maxOutputTokens ?? null,
                InputTokens: usage?.inputTokens ?? 0,
                OutputTokens: usage?.outputTokens ?? 0,
                TotalTokens: usage?.totalTokens ?? ((usage?.inputTokens ?? 0) + (usage?.outputTokens ?? 0)),
                ReasoningTokens: usage?.reasoningTokens ?? null,
                CachedInputTokens: usage?.cachedInputTokens ?? null,
                PromptCharCount: input.promptCharCount ?? null,
                CompletionCharCount: input.completionCharCount ?? null,
                PromptMessageCount: input.promptMessageCount ?? null,
                CompletionMessageCount: input.completionMessageCount ?? null,
                DurationMs: input.durationMs ?? null,
                FirstTokenMs: input.firstTokenMs ?? null,
                Streaming: input.streaming ?? false,
                Status: input.status ?? 'SUCCESS',
                ErrorCode: input.errorCode ?? null,
                ErrorMessage: input.errorMessage ?? null,
                InputCostUsd: input.inputCostUsd ?? null,
                OutputCostUsd: input.outputCostUsd ?? null,
                TotalCostUsd: input.totalCostUsd ?? null,
                Currency: input.currency ?? 'USD',
                PriceSource: input.priceSource ?? null,
                UsageRaw: toJson(input.usageRaw ?? usage),
                ProviderMetadata: toJson(input.providerMetadata),
                Metadata: toJson(input.metadata),
            },
        })
    } catch (error) {
        console.error('Failed to create AI token usage log', error)
        return null
    }
}

export function countAiMessageCharacters(messages: unknown): number {
    return countTextCharacters(messages)
}

export function countAiMessages(messages: unknown): number {
    return Array.isArray(messages) ? messages.length : 0
}

function parseModelSlug(modelSlug: string) {
    const [provider, rawModel] = modelSlug.includes('/')
        ? splitFirst(modelSlug, '/')
        : [null, modelSlug]

    const [modelWithoutVariant, colonVariant] = rawModel.includes(':')
        ? splitFirst(rawModel, ':')
        : [rawModel, null]

    const version =
        colonVariant ??
        modelWithoutVariant.match(/(?:^|[-_])(\d+(?:\.\d+)?(?:[a-z]+)?(?:[-_][a-z0-9]+)*)$/i)?.[1] ??
        modelWithoutVariant.match(/^gpt-(\d+(?:\.\d+)?(?:-[a-z0-9]+)*)$/i)?.[1] ??
        null

    return {
        provider,
        model: modelWithoutVariant,
        version,
    }
}

function splitFirst(value: string, separator: string): [string, string] {
    const index = value.indexOf(separator)
    return [value.slice(0, index), value.slice(index + separator.length)]
}

function countTextCharacters(value: unknown): number {
    if (!value) return 0
    if (typeof value === 'string') return value.length
    if (Array.isArray(value)) {
        return value.reduce((total, item) => total + countTextCharacters(item), 0)
    }
    if (typeof value !== 'object') return 0

    return Object.entries(value).reduce((total, [key, item]) => {
        if (key === 'data') return total
        if (key === 'text' || key === 'content') {
            return total + countTextCharacters(item)
        }
        return total + countTextCharacters(item)
    }, 0)
}

function toJson(value: unknown): Prisma.InputJsonValue | undefined {
    if (value === undefined || value === null) return undefined
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue
}
