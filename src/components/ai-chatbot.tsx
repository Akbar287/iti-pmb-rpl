"use client"

import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

import { Send, Sparkles, X } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Halo! Saya adalah AI assistant. Bagaimana saya bisa membantu Anda hari ini?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Open AI Chat"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-md opacity-75 group-hover:opacity-100 animate-spin-slow"></div>
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-gradient">
            <span className="text-white font-bold text-lg">AI</span>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-300 animate-pulse" />
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[85vw] max-h-[85vh] w-full h-full md:max-w-full md:max-h-full md:w-screen md:h-screen sm:max-w-full sm:max-h-full sm:w-screen sm:h-screen p-0 gap-0 border-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>RPL Chatbot</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-spin-slow pointer-events-none"></div>
            <div className="absolute inset-[1px] bg-background rounded-lg"></div>

            <DialogClose asChild>
              <button
                className="absolute right-4 top-4 z-20 rounded-full p-2 bg-background/80 hover:scale-110 duration-110 teansform transition bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-md border"

              >
                <X className="w-4 h-4" />
              </button>
            </DialogClose>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-3 p-6 border-b">
                <div className="relative cursor-pointer" onClick={() => setOpen(false)}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                    <span className="text-white font-bold">AI</span>
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
                <h2 className="text-xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-gradient">
                  RPL Chatbot
                </h2>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center animate-gradient">
                          <Sparkles className="w-10 h-10 text-white animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
                        Halo! Ada yang bisa saya bantu?
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        Tanyakan apa saja kepada AI assistant. Saya siap membantu Anda!
                      </p>
                    </div>
                  )}

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                            ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white'
                            : 'bg-secondary text-secondary-foreground'
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-secondary">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan Anda..."
                    className="min-h-[60px] resize-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="h-[60px] w-[60px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:opacity-90 transition-all hover:scale-105"
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
