export class MessageService {
  static async getConversation(
    currentUserId: string,
    userId: string,
    limit: number,
    skip: number
  ) {
    // DB logic here
  }

  static async markMessagesAsRead(
    receiverId: string,
    senderId: string
  ) {
    // DB logic here
  }

  static async getUnreadCount(
    userId: string,
    fromUserId: string
  ) {
    // DB logic here
  }

  static async getAllUnreadCounts(userId: string) {
    // DB logic here
  }

  static async getRecentConversations(userId: string) {
    // DB logic here
  }
}
