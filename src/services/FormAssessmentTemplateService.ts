import { FormAssessmentPortraitTemplate, FormAssessmentTemplateResponse } from '@/types/FormAssessmentTemplate'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''
const ENDPOINT = `${BASE_URL}/api/protected/template-builder/form-asessmen`

async function errorMessage(response: Response): Promise<string> {
    try {
        const body = await response.json()
        return body?.message || 'Gagal memproses template formulir asesmen.'
    } catch {
        return 'Gagal memproses template formulir asesmen.'
    }
}

export async function getFormAssessmentTemplate(): Promise<FormAssessmentTemplateResponse> {
    const response = await fetch(ENDPOINT, { cache: 'no-store' })
    if (!response.ok) throw new Error(await errorMessage(response))
    return response.json()
}

export async function saveFormAssessmentTemplate(
    template: FormAssessmentPortraitTemplate
): Promise<FormAssessmentTemplateResponse> {
    const response = await fetch(ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
    })
    if (!response.ok) throw new Error(await errorMessage(response))
    return response.json()
}
