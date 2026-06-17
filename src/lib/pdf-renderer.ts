import path from 'path'
import { renderToStream } from '@react-pdf/renderer'

type ReactElementLike = {
    $$typeof: symbol
    type: any
    key: string | null
    props: Record<string, any> | null
}

// Next route handlers alias `react` to a canary runtime whose transitional
// elements are not accepted by react-pdf, so load the app's React package.
const nodeRequire = eval('require') as NodeRequire
const pdfReact = nodeRequire(path.join(process.cwd(), 'node_modules/react/index.js')) as typeof import('react')
const reactFragmentType = Symbol.for('react.fragment')

function isReactElementLike(value: unknown): value is ReactElementLike {
    return (
        typeof value === 'object' &&
        value !== null &&
        '$$typeof' in value &&
        'type' in value &&
        'props' in value
    )
}

function toPdfReactNode(node: any): any {
    if (Array.isArray(node)) {
        return node.map((child) => toPdfReactNode(child))
    }

    if (!isReactElementLike(node)) {
        return node
    }

    if (typeof node.type === 'function') {
        return toPdfReactNode(node.type(node.props ?? {}))
    }

    const props = node.props ?? {}
    const { children, ...restProps } = props
    const convertedChildren = toPdfReactNode(children)
    const nextProps = node.key === null ? restProps : { ...restProps, key: node.key }
    const type = node.type === reactFragmentType ? pdfReact.Fragment : node.type

    if (Array.isArray(convertedChildren)) {
        return pdfReact.createElement(type, nextProps, ...convertedChildren)
    }

    return pdfReact.createElement(type, nextProps, convertedChildren)
}

export function renderPdfToStream(document: any) {
    return renderToStream(toPdfReactNode(document))
}
