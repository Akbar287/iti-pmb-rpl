"use client"

import React, { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

import { ChevronDown, Maximize2, Minimize2, Send, Sparkles, Square, X } from 'lucide-react'
import { ChatMessageDTO, streamChatbot } from '@/services/Ai/AiServices'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

type WindowSize = 'medium' | 'large' | 'fullscreen'

export function AIChatbot() {
  const [open, setOpen] = useState(false)

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = React.useState(true);
  const [showScrollDown, setShowScrollDown] = React.useState(false);
  const [messagesAi, setMessagesAi] = React.useState<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }[]>([])
  const [inputAi, setInputAi] = React.useState<string>('')
  const [windowSize, setWindowSize] = React.useState<WindowSize>('large')
  const [isLoadingAi, setIsLoadingAi] = React.useState<boolean>(false)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }
  const handleSubmit = async () => {
    if (!inputAi.trim() || isLoadingAi) return

    const now = new Date()
    const userMessage = {
      id: now.getTime().toString(),
      role: 'user' as const,
      content: inputAi.trim(),
      timestamp: now,
    }

    const historyWithUser = [...messagesAi, userMessage]

    setMessagesAi(historyWithUser)
    setInputAi('')
    setIsLoadingAi(true)

    const assistantId = (now.getTime() + 1).toString()
    const assistantMessage = {
      id: assistantId,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
    }

    setMessagesAi((prev) => [...prev, assistantMessage])

    try {
      const dtoMessages: ChatMessageDTO[] = historyWithUser.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      await streamChatbot(dtoMessages, (chunk) => {
        setMessagesAi((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + chunk.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1") }
              : msg,
          ),
        )
      })
    } catch (err) {
      console.error('Chat error', err)
      setMessagesAi((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
              ...msg,
              content:
                msg.content ||
                'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
            }
            : msg,
        ),
      )
    } finally {
      setIsLoadingAi(false)
    }
  }
  const toggleWindowSize = () => {
    const sizes: WindowSize[] = ['medium', 'large', 'fullscreen']
    const currentIndex = sizes.indexOf(windowSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setWindowSize(sizes[nextIndex])
  }
  const getWindowSizeClasses = () => {
    switch (windowSize) {
      case 'medium':
        return 'max-w-2xl max-h-[600px] w-full h-[70vh]'
      case 'large':
        return 'max-w-5xl  max-h-[700px] w-full h-[80vh]'
      case 'fullscreen':
        return 'max-w-[85vw] max-h-[85vh] w-full h-full md:max-w-full md:max-h-full md:w-screen md:h-screen sm:max-w-full sm:max-h-full sm:w-screen sm:h-screen p-0 gap-0 border-0 overflow-hidden'
      default:
        return 'max-w-5xl max-h-[700px] w-full h-[70vh]'
    }
  }
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isAtBottom = distanceFromBottom < 60;

    setShouldAutoScroll(isAtBottom);
    setShowScrollDown(!isAtBottom);
  };
  const handleScrollToBottom = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setShouldAutoScroll(true);
    setShowScrollDown(false);
  };
  // End Ai

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI Chat"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 blur-md opacity-75 group-hover:opacity-100 animate-spin-slow"></div>
          <div className="relative w-16 h-16 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-linear">
            <span className="text-white font-bold text-lg">AI</span>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`${getWindowSizeClasses()} p-0 gap-0 border-0 overflow-hidden transition-all duration-300 flex flex-col`}>
          <VisuallyHidden>
            <DialogTitle>RPL Chatbot</DialogTitle>
            <DialogDescription>
              AI Chatbot untuk sistem RPL.
            </DialogDescription>
          </VisuallyHidden>
          <div className="relative w-full h-full flex flex-1 flex-col">
            <div className="absolute inset-0 rounded-lg bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-px bg-background rounded-lg"></div>

            <div className="relative z-10 flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between gap-3 p-4 border-b bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                      <span className="text-white font-bold">AI</span>
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                    AI Asessment
                  </h2>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-secondary"
                    onClick={toggleWindowSize}
                    title={`Switch to ${windowSize === 'medium' ? 'large' : windowSize === 'large' ? 'fullscreen' : 'medium'} size`}
                  >
                    {windowSize === 'fullscreen' ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : windowSize === 'large' ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-secondary"
                    onClick={() => setOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6 overflow-y-auto" >
                <div className='h-full max-h-[90vh]' ref={scrollRef} onScroll={handleScroll}>
                  <div className="space-y-4 pb-10">
                    {messagesAi.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                            <Sparkles className="w-10 h-10 text-white animate-pulse" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-semibold bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                          Halo, Ada yang bisa AI bantu?
                        </h3>
                        <p className="text-muted-foreground max-w-md">
                          Tanyakan apa saja mengenai RPL di ITI kepada AI Asessmen. Saya siap membantu Anda!
                        </p>
                      </div>
                    )}

                    {messagesAi.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                            ? 'bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 text-white'
                            : 'bg-secondary text-secondary-foreground'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}

                    {isLoadingAi && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-secondary">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-linear-to-r from-pink-500 to-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-linear-to-r from-purple-500 to-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-linear-to-r from-cyan-500 to-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {showScrollDown && (
                    <button
                      type="button"
                      onClick={handleScrollToBottom}
                      className="absolute right-4 bottom-4 flex items-center gap-1 rounded-full bg-background/95 border shadow-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-background hover:text-foreground transition"
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span>Scroll ke bawah</span>
                    </button>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={inputAi}
                    onChange={(e) => setInputAi(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan Anda..."
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                    disabled={isLoadingAi}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!inputAi.trim() || isLoadingAi}
                    size="icon"
                    className="h-[60px] w-[60px] bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all hover:scale-105"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
