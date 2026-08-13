export type Channel = 'instagram' | 'whatsapp' | 'messenger' | 'telegram' | 'email' | 'sms'

export type FlowNodeType =
  | 'trigger'
  | 'message'
  | 'buttons'
  | 'condition'
  | 'action'
  | 'delay'
  | 'ai'

export interface FlowNode {
  id: string
  type: FlowNodeType
  x: number
  y: number
  title: string
  content: string
  options?: string[]
  nextIds: string[]
}

export interface Flow {
  id: string
  name: string
  description: string
  channel: Channel
  status: 'active' | 'draft' | 'paused'
  trigger: string
  nodes: FlowNode[]
  stats: { sent: number; opened: number; clicked: number }
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  avatar: string
  channel: Channel
  tags: string[]
  email?: string
  phone?: string
  status: 'active' | 'blocked' | 'unsubscribed'
  lastSeen: string
  customFields: Record<string, string>
}

export interface Message {
  id: string
  conversationId: string
  from: 'contact' | 'agent' | 'bot'
  text: string
  at: string
  read: boolean
}

export interface Conversation {
  id: string
  contactId: string
  channel: Channel
  unread: number
  assignedTo?: string
  status: 'open' | 'pending' | 'closed'
  lastMessageAt: string
  preview: string
}

export interface Automation {
  id: string
  name: string
  type: 'keyword' | 'comment' | 'story' | 'welcome' | 'sequence'
  trigger: string
  flowId: string
  channel: Channel
  active: boolean
  matches: number
  /** DM text used by Instagram live Private Reply */
  replyText?: string
}

export interface Broadcast {
  id: string
  name: string
  channel: Channel
  audience: string
  status: 'draft' | 'scheduled' | 'sent' | 'sending'
  message: string
  scheduledAt?: string
  sentAt?: string
  stats: { sent: number; delivered: number; opened: number; clicked: number }
}

export interface ChannelConnection {
  channel: Channel
  connected: boolean
  accountName?: string
  followers?: number
}

export interface GrowthTool {
  id: string
  type: 'widget' | 'qr' | 'link' | 'ref'
  name: string
  url: string
  clicks: number
  active: boolean
}

export interface UserAccount {
  id: string
  name: string
  email: string
  company: string
  plan: 'free' | 'pro' | 'business'
}

export interface AppState {
  user: UserAccount | null
  contacts: Contact[]
  conversations: Conversation[]
  messages: Message[]
  flows: Flow[]
  automations: Automation[]
  broadcasts: Broadcast[]
  channels: ChannelConnection[]
  growthTools: GrowthTool[]
}
