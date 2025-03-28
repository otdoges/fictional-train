import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface CreateChatParams {
  name: string
}

export interface CreateMessageParams {
  chatId: string
  content: string
  role: 'user' | 'assistant'
}

export const db = {
  // Chat operations
  async createChat(data: CreateChatParams) {
    return prisma.chat.create({
      data,
    })
  },

  async getChats() {
    return prisma.chat.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
  },

  async getChat(id: string) {
    return prisma.chat.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })
  },

  async deleteChat(id: string) {
    return prisma.chat.delete({
      where: { id },
    })
  },

  // Message operations
  async createMessage(data: CreateMessageParams) {
    const message = await prisma.message.create({
      data,
    })

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: data.chatId },
      data: { updatedAt: new Date() },
    })

    return message
  },

  async getMessages(chatId: string) {
    return prisma.message.findMany({
      where: { chatId },
      orderBy: {
        createdAt: 'asc',
      },
    })
  },
}
