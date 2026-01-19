import TicketUserDetailComponent from '@/components/ticket/TicketUserDetailComponent'
import React from 'react'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    return (<TicketUserDetailComponent ticketId={id} />
    )
}

export default Page
