'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, HelpCircle, Search } from 'lucide-react'
import { getQnAMasterData } from '@/services/QnAServices'
import { QuestionAndAsk } from '@/types/QuestionAndAskTypes'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '../ui/accordion'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../ui/card'

export default function QnAComponent() {
    const [dataQnA, setDataQnA] = React.useState<QuestionAndAsk[]>([])
    const [paginationState, setPaginationState] = React.useState<{
        page: number
        limit: number
        totalElement: number
        totalPage: number
        hasNext: boolean
        hasPrevious: boolean
    }>({
        page: 1,
        limit: 10,
        totalElement: 0,
        totalPage: 0,
        hasNext: false,
        hasPrevious: false,
    })
    const [search, setSearch] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        setLoading(true)
        getQnAMasterData(paginationState.page, paginationState.limit, search)
            .then((res) => {
                setDataQnA(res.data)
                setLoading(false)
                setPaginationState({
                    page: res.page,
                    limit: res.limit,
                    totalElement: res.totalElement,
                    totalPage: res.totalPage,
                    hasNext: res.hasNext,
                    hasPrevious: res.hasPrevious,
                })
            })
            .catch(() => {
                setLoading(false)
            })
    }, [paginationState.page, search, paginationState.limit])

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <Card className="bg-linear-to-br from-gray-50 to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl border-0">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-linear-to-br from-primary to-secondary rounded-full shadow-lg">
                            <HelpCircle className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <CardTitle>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h1>
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        Temukan jawaban untuk pertanyaan yang sering diajukan
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    {/* Search Bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Cari pertanyaan..."
                            value={search}
                            onChange={(e) => {
                                setPaginationState({
                                    ...paginationState,
                                    page: 1,
                                })
                                setSearch(e.target.value)
                            }}
                            className="pl-12 py-6 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary transition-all shadow-sm"
                        />
                    </div>

                    {/* QnA List */}
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm"
                                >
                                    <Skeleton className="h-6 w-3/4 mb-3" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3 mt-2" />
                                </div>
                            ))}
                        </div>
                    ) : dataQnA.length === 0 ? (
                        <div className="text-center py-12">
                            <HelpCircle className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                                Tidak ada pertanyaan ditemukan
                            </h3>
                            <p className="text-gray-400 dark:text-gray-500 mt-2">
                                Coba kata kunci lain atau hubungi kami untuk
                                bantuan lebih lanjut
                            </p>
                        </div>
                    ) : (
                        <Accordion
                            type="single"
                            collapsible
                            className="space-y-3"
                        >
                            {dataQnA.map((qna, index) => (
                                <AccordionItem
                                    key={qna.QuestionAndAskId}
                                    value={qna.QuestionAndAskId}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden px-0 transition-all hover:shadow-md"
                                >
                                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-start gap-4 text-left">
                                            <span className="shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                {(paginationState.page - 1) *
                                                    paginationState.limit +
                                                    index +
                                                    1}
                                            </span>
                                            <span className="text-base font-medium text-gray-800 dark:text-gray-200">
                                                {qna.Question}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4">
                                        <div className="pl-12 pr-2">
                                            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-lg border-l-4 border-blue-500">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                                    {qna.Answer}
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {/* Pagination */}
                    {!loading && dataQnA.length > 0 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {(paginationState.page - 1) *
                                        paginationState.limit +
                                        1}
                                </span>{' '}
                                -{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {Math.min(
                                        paginationState.page *
                                        paginationState.limit,
                                        paginationState.totalElement
                                    )}
                                </span>{' '}
                                dari{' '}
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                    {paginationState.totalElement}
                                </span>{' '}
                                pertanyaan
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPaginationState({
                                            ...paginationState,
                                            page: paginationState.page - 1,
                                        })
                                    }
                                    disabled={!paginationState.hasPrevious}
                                    className="rounded-lg"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Sebelumnya
                                </Button>
                                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium">
                                    {paginationState.page} /{' '}
                                    {paginationState.totalPage || 1}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setPaginationState({
                                            ...paginationState,
                                            page: paginationState.page + 1,
                                        })
                                    }
                                    disabled={!paginationState.hasNext}
                                    className="rounded-lg"
                                >
                                    Selanjutnya
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
