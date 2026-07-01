import {
    FormAssessmentPortraitTemplate,
    FormAssessmentTemplateResponse,
} from '@/types/FormAssessmentTemplate'
import { SkHasilTemplateVariant } from '@/lib/sk-hasil-template'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const ENDPOINT = `${BASE_URL}/api/protected/template-builder/form-sk-hasil`

async function errorMessage(response: Response): Promise<string> {
    try {
        const body = await response.json()
        return body?.message || 'Gagal memproses template SK hasil.'
    } catch {
        return 'Gagal memproses template SK hasil.'
    }
}

export async function getSkHasilTemplate(
    variant: SkHasilTemplateVariant
): Promise<FormAssessmentTemplateResponse> {
    const response = await fetch(`${ENDPOINT}?variant=${variant}`, {
        cache: 'no-store',
    })
    if (!response.ok) throw new Error(await errorMessage(response))
    return response.json()
}

export async function saveSkHasilTemplate(
    template: FormAssessmentPortraitTemplate,
    variant: SkHasilTemplateVariant
): Promise<FormAssessmentTemplateResponse> {
    const response = await fetch(`${ENDPOINT}?variant=${variant}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
    })
    if (!response.ok) throw new Error(await errorMessage(response))
    return response.json()
}
