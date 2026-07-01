export type FormAssessmentTextAlign = 'left' | 'center' | 'right' | 'justify'
export type FormAssessmentTableCellAlign = 'left' | 'center' | 'right'
export type DocumentTemplatePlacement =
    | 'before_landscape'
    | 'after_landscape'
    | 'before_table'
    | 'after_table'
    | 'document'

interface FormAssessmentBlockBase {
    id: string
    marginBottom: number
}

export interface FormAssessmentTextBlock extends FormAssessmentBlockBase {
    type: 'text'
    content: string
    fontSize: number
    bold: boolean
    italic: boolean
    uppercase: boolean
    align: FormAssessmentTextAlign
    lineHeight: number
}

export interface FormAssessmentLogoBlock extends FormAssessmentBlockBase {
    type: 'logo'
    width: number
    height: number
    align: Exclude<FormAssessmentTextAlign, 'justify'>
}

export interface FormAssessmentSpacerBlock extends FormAssessmentBlockBase {
    type: 'spacer'
    height: number
}

export interface FormAssessmentKeyValueBlock extends FormAssessmentBlockBase {
    type: 'key_value'
    rows: Array<{
        label: string
        value: string
    }>
    fontSize: number
    labelWidth: number
}

export interface FormAssessmentListBlock extends FormAssessmentBlockBase {
    type: 'list'
    items: string[]
    ordered: boolean
    fontSize: number
    lineHeight: number
}

export interface FormAssessmentTableBlock extends FormAssessmentBlockBase {
    type: 'table'
    showBorders: boolean
    headers: string[]
    headerAlignments: FormAssessmentTableCellAlign[]
    rows: Array<{
        values: string[]
        alignments: FormAssessmentTableCellAlign[]
        /** @deprecated Compatibility only; templates are normalized to values. */
        label?: string
        /** @deprecated Compatibility only; templates are normalized to values. */
        value?: string
    }>
    fontSize: number
    columnWidths: number[]
    /** @deprecated Compatibility only; use columnWidths. */
    firstColumnWidth?: number
}

export type FormAssessmentTemplateBlock =
    | FormAssessmentTextBlock
    | FormAssessmentLogoBlock
    | FormAssessmentSpacerBlock
    | FormAssessmentKeyValueBlock
    | FormAssessmentListBlock
    | FormAssessmentTableBlock

export interface FormAssessmentTemplatePage {
    id: string
    name: string
    placement: DocumentTemplatePlacement
    blocks: FormAssessmentTemplateBlock[]
}

export interface FormAssessmentPortraitTemplate {
    version: 1
    pages: FormAssessmentTemplatePage[]
}

export interface FormAssessmentTemplateResponse {
    template: FormAssessmentPortraitTemplate
    updatedAt: string | null
}
