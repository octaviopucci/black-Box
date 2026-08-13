import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_USER, createSeedState } from '@/data/seed'
import { STORAGE_KEY, uid } from '@/lib/utils'
import type {
  AppState,
  Automation,
  Broadcast,
  Contact,
  Conversation,
  Flow,
  FlowNode,
  GrowthTool,
  Message,
  UserAccount,
} from '@/types'

interface ChamaContextValue {
  state: AppState
  login: (email: string, name?: string) => void
  logout: () => void
  resetDemo: () => void
  sendMessage: (conversationId: string, text: string, from?: Message['from']) => void
  markConversationRead: (conversationId: string) => void
  setConversationStatus: (conversationId: string, status: Conversation['status']) => void
  upsertContact: (contact: Contact) => void
  deleteContact: (id: string) => void
  upsertFlow: (flow: Flow) => void
  deleteFlow: (id: string) => void
  setFlowStatus: (id: string, status: Flow['status']) => void
  updateFlowNodes: (id: string, nodes: FlowNode[]) => void
  toggleAutomation: (id: string) => void
  upsertAutomation: (automation: Automation) => void
  upsertBroadcast: (broadcast: Broadcast) => void
  sendBroadcast: (id: string) => void
  toggleChannel: (channel: AppState['channels'][number]['channel']) => void
  toggleGrowth: (id: string) => void
  addGrowthTool: (tool: Omit<GrowthTool, 'id' | 'clicks'>) => void
  simulateIncoming: (contactId: string, text: string) => void
  runKeywordTrigger: (keyword: string) => { matched: boolean; flowName?: string }
}

const ChamaContext = createContext<ChamaContextValue | null>(null)

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as AppState
    return { ...createSeedState(), ...parsed }
  } catch {
    return createSeedState()
  }
}

export function ChamaProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = useCallback((email: string, name?: string) => {
    const user: UserAccount = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      name: name || DEMO_USER.name,
    }
    setState((s) => ({ ...s, user }))
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }))
  }, [])

  const resetDemo = useCallback(() => {
    const fresh = createSeedState()
    fresh.user = state.user
    setState(fresh)
  }, [state.user])

  const sendMessage = useCallback(
    (conversationId: string, text: string, from: Message['from'] = 'agent') => {
      const trimmed = text.trim()
      if (!trimmed) return
      const msg: Message = {
        id: uid('m'),
        conversationId,
        from,
        text: trimmed,
        at: new Date().toISOString(),
        read: from !== 'contact',
      }
      setState((s) => ({
        ...s,
        messages: [...s.messages, msg],
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                preview: trimmed,
                lastMessageAt: msg.at,
                unread: from === 'contact' ? c.unread + 1 : 0,
                status: c.status === 'closed' ? 'open' : c.status,
              }
            : c,
        ),
      }))
    },
    [],
  )

  const markConversationRead = useCallback((conversationId: string) => {
    setState((s) => ({
      ...s,
      conversations: s.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: 0 } : c,
      ),
      messages: s.messages.map((m) =>
        m.conversationId === conversationId ? { ...m, read: true } : m,
      ),
    }))
  }, [])

  const setConversationStatus = useCallback(
    (conversationId: string, status: Conversation['status']) => {
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === conversationId ? { ...c, status } : c,
        ),
      }))
    },
    [],
  )

  const upsertContact = useCallback((contact: Contact) => {
    setState((s) => {
      const exists = s.contacts.some((c) => c.id === contact.id)
      return {
        ...s,
        contacts: exists
          ? s.contacts.map((c) => (c.id === contact.id ? contact : c))
          : [contact, ...s.contacts],
      }
    })
  }, [])

  const deleteContact = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      contacts: s.contacts.filter((c) => c.id !== id),
    }))
  }, [])

  const upsertFlow = useCallback((flow: Flow) => {
    setState((s) => {
      const exists = s.flows.some((f) => f.id === flow.id)
      return {
        ...s,
        flows: exists
          ? s.flows.map((f) => (f.id === flow.id ? flow : f))
          : [flow, ...s.flows],
      }
    })
  }, [])

  const deleteFlow = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      flows: s.flows.filter((f) => f.id !== id),
      automations: s.automations.filter((a) => a.flowId !== id),
    }))
  }, [])

  const setFlowStatus = useCallback((id: string, status: Flow['status']) => {
    setState((s) => ({
      ...s,
      flows: s.flows.map((f) =>
        f.id === id ? { ...f, status, updatedAt: new Date().toISOString() } : f,
      ),
    }))
  }, [])

  const updateFlowNodes = useCallback((id: string, nodes: FlowNode[]) => {
    setState((s) => ({
      ...s,
      flows: s.flows.map((f) =>
        f.id === id ? { ...f, nodes, updatedAt: new Date().toISOString() } : f,
      ),
    }))
  }, [])

  const toggleAutomation = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      automations: s.automations.map((a) =>
        a.id === id ? { ...a, active: !a.active } : a,
      ),
    }))
  }, [])

  const upsertAutomation = useCallback((automation: Automation) => {
    setState((s) => {
      const exists = s.automations.some((a) => a.id === automation.id)
      return {
        ...s,
        automations: exists
          ? s.automations.map((a) => (a.id === automation.id ? automation : a))
          : [automation, ...s.automations],
      }
    })
  }, [])

  const upsertBroadcast = useCallback((broadcast: Broadcast) => {
    setState((s) => {
      const exists = s.broadcasts.some((b) => b.id === broadcast.id)
      return {
        ...s,
        broadcasts: exists
          ? s.broadcasts.map((b) => (b.id === broadcast.id ? broadcast : b))
          : [broadcast, ...s.broadcasts],
      }
    })
  }, [])

  const sendBroadcast = useCallback((id: string) => {
    setState((s) => {
      const audienceSize = s.contacts.filter((c) => c.status === 'active').length
      return {
        ...s,
        broadcasts: s.broadcasts.map((b) =>
          b.id === id
            ? {
                ...b,
                status: 'sent',
                sentAt: new Date().toISOString(),
                stats: {
                  sent: audienceSize,
                  delivered: Math.round(audienceSize * 0.94),
                  opened: Math.round(audienceSize * 0.62),
                  clicked: Math.round(audienceSize * 0.21),
                },
              }
            : b,
        ),
      }
    })
  }, [])

  const toggleChannel = useCallback((channel: AppState['channels'][number]['channel']) => {
    setState((s) => ({
      ...s,
      channels: s.channels.map((c) =>
        c.channel === channel
          ? {
              ...c,
              connected: !c.connected,
              accountName: !c.connected
                ? c.accountName || `Conta ${c.channel}`
                : c.accountName,
              followers: !c.connected ? c.followers || 0 : c.followers,
            }
          : c,
      ),
    }))
  }, [])

  const toggleGrowth = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      growthTools: s.growthTools.map((g) =>
        g.id === id ? { ...g, active: !g.active } : g,
      ),
    }))
  }, [])

  const addGrowthTool = useCallback((tool: Omit<GrowthTool, 'id' | 'clicks'>) => {
    setState((s) => ({
      ...s,
      growthTools: [
        { ...tool, id: uid('g'), clicks: 0 },
        ...s.growthTools,
      ],
    }))
  }, [])

  const simulateIncoming = useCallback((contactId: string, text: string) => {
    setState((s) => {
      let conversation = s.conversations.find((c) => c.contactId === contactId)
      let conversations = s.conversations
      if (!conversation) {
        const contact = s.contacts.find((c) => c.id === contactId)
        conversation = {
          id: uid('cv'),
          contactId,
          channel: contact?.channel || 'instagram',
          unread: 1,
          status: 'open',
          lastMessageAt: new Date().toISOString(),
          preview: text,
        }
        conversations = [conversation, ...conversations]
      } else {
        conversations = conversations.map((c) =>
          c.id === conversation!.id
            ? {
                ...c,
                unread: c.unread + 1,
                preview: text,
                lastMessageAt: new Date().toISOString(),
                status: 'open' as const,
              }
            : c,
        )
      }
      const msg: Message = {
        id: uid('m'),
        conversationId: conversation.id,
        from: 'contact',
        text,
        at: new Date().toISOString(),
        read: false,
      }
      return { ...s, conversations, messages: [...s.messages, msg] }
    })
  }, [])

  const runKeywordTrigger = useCallback(
    (keyword: string) => {
      const needle = keyword.trim().toLowerCase()
      if (!needle) return { matched: false }
      const auto = state.automations.find(
        (a) =>
          a.active &&
          a.trigger
            .toLowerCase()
            .split(/[,/|]/)
            .some((t) => needle.includes(t.trim()) && t.trim().length > 0),
      )
      if (!auto) return { matched: false }
      const flow = state.flows.find((f) => f.id === auto.flowId)
      setState((s) => ({
        ...s,
        automations: s.automations.map((a) =>
          a.id === auto.id ? { ...a, matches: a.matches + 1 } : a,
        ),
        flows: s.flows.map((f) =>
          f.id === auto.flowId
            ? {
                ...f,
                stats: {
                  ...f.stats,
                  sent: f.stats.sent + 1,
                  opened: f.stats.opened + 1,
                },
              }
            : f,
        ),
      }))
      const contact = state.contacts[0]
      if (contact && flow) {
        const firstMsg = flow.nodes.find((n) => n.type === 'message')
        simulateIncoming(contact.id, `[simulou gatilho] ${keyword}`)
        setTimeout(() => {
          setState((s) => {
            const conv = s.conversations.find((c) => c.contactId === contact.id)
            if (!conv || !firstMsg) return s
            const botMsg: Message = {
              id: uid('m'),
              conversationId: conv.id,
              from: 'bot',
              text: firstMsg.content.replace('{{first_name}}', contact.name.split(' ')[0]),
              at: new Date().toISOString(),
              read: true,
            }
            return {
              ...s,
              messages: [...s.messages, botMsg],
              conversations: s.conversations.map((c) =>
                c.id === conv.id
                  ? { ...c, preview: botMsg.text, lastMessageAt: botMsg.at }
                  : c,
              ),
            }
          })
        }, 600)
      }
      return { matched: true, flowName: flow?.name }
    },
    [simulateIncoming, state.automations, state.contacts, state.flows],
  )

  const value = useMemo(
    () => ({
      state,
      login,
      logout,
      resetDemo,
      sendMessage,
      markConversationRead,
      setConversationStatus,
      upsertContact,
      deleteContact,
      upsertFlow,
      deleteFlow,
      setFlowStatus,
      updateFlowNodes,
      toggleAutomation,
      upsertAutomation,
      upsertBroadcast,
      sendBroadcast,
      toggleChannel,
      toggleGrowth,
      addGrowthTool,
      simulateIncoming,
      runKeywordTrigger,
    }),
    [
      state,
      login,
      logout,
      resetDemo,
      sendMessage,
      markConversationRead,
      setConversationStatus,
      upsertContact,
      deleteContact,
      upsertFlow,
      deleteFlow,
      setFlowStatus,
      updateFlowNodes,
      toggleAutomation,
      upsertAutomation,
      upsertBroadcast,
      sendBroadcast,
      toggleChannel,
      toggleGrowth,
      addGrowthTool,
      simulateIncoming,
      runKeywordTrigger,
    ],
  )

  return <ChamaContext.Provider value={value}>{children}</ChamaContext.Provider>
}

export function useChama() {
  const ctx = useContext(ChamaContext)
  if (!ctx) throw new Error('useChama must be used within ChamaProvider')
  return ctx
}
