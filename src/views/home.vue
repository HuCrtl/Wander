<template>
  <BgLayout>
    <StatusBar />
    <div class="chat-page">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="chat-avatar">
          <div class="avatar-glow"></div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
            <path d="M18 10c0 0 1 2 1 4a7 7 0 0 1-14 0c0-2 1-4 1-4"/>
            <circle cx="9" cy="7" r="0.5" fill="currentColor"/>
            <circle cx="15" cy="7" r="0.5" fill="currentColor"/>
            <path d="M10 10.5s0.5 1 2 1 2-1 2-1"/>
          </svg>
        </div>
        <div class="chat-header-info">
          <div class="chat-header-name">Travel AI</div>
          <div class="chat-header-status">
            <span class="status-dot"></span> Online
          </div>
        </div>
        <!-- 右上角按钮组 -->
        <div class="header-actions">
          <button class="action-btn" @click="createNewChat" title="新建对话">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
          <button class="action-btn" :class="{ active: showHistory }" @click="showHistory = !showHistory" title="历史对话">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 历史对话面板 -->
      <transition name="panel-slide">
        <div v-if="showHistory" class="history-panel">
          <div class="history-title">历史对话</div>
          <div class="history-list">
            <div v-for="conv in conversations" :key="conv.id"
                 :class="['history-item', { active: conv.id === currentConvId }]"
                 @click="switchConversation(conv.id)">
              <div class="history-item-info">
                <!-- 编辑模式 -->
                <input v-if="editingConvId === conv.id"
                       class="history-rename-input"
                       v-model="editingTitle"
                       @click.stop
                       @keyup.enter="confirmRename(conv.id)"
                       @keyup.escape="cancelRename"
                       @blur="confirmRename(conv.id)"
                       ref="renameInput"
                       maxlength="30" />
                <!-- 显示模式 -->
                <div v-else class="history-item-title" @dblclick.stop="startRename(conv)">{{ conv.title }}</div>
                <div class="history-item-time">{{ conv.updatedAt }}</div>
              </div>
              <div class="history-item-actions">
                <button class="history-action-btn rename-btn" @click.stop="startRename(conv)" title="重命名">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button v-if="conversations.length > 1" class="history-action-btn delete-btn" @click.stop="deleteConversation(conv.id)" title="删除">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 聊天消息 -->
      <div class="chat-messages" ref="messagesContainer">
        <div v-for="(msg, index) in messages" :key="index"
             :class="['message-row', msg.role === 'user' ? 'message-user' : 'message-ai']">
          <div v-if="msg.role === 'assistant'" class="msg-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
              <path d="M18 10c0 0 1 2 1 4a7 7 0 0 1-14 0c0-2 1-4 1-4"/>
            </svg>
          </div>
          <div class="message-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-ai'">
            <div class="message-text" v-html="renderMarkdown(msg.content)"></div>
            <div v-if="msg.time" class="message-time">{{ msg.time }}</div>
          </div>
        </div>

        <!-- AI 正在输入动画 -->
        <div v-if="isTyping" class="message-row message-ai">
          <div class="msg-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
              <path d="M18 10c0 0 1 2 1 4a7 7 0 0 1-14 0c0-2 1-4 1-4"/>
            </svg>
          </div>
          <div class="message-bubble bubble-ai typing-bubble">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 快捷提问（仅初始状态显示） -->
      <div v-if="messages.length <= 1" class="chat-suggestions">
        <div class="suggestions-title">Try asking me:</div>
        <div class="suggestions-list">
          <div class="suggestion-chip" v-for="s in suggestions" :key="s.text" @click="sendSuggestion(s)">
            <span class="suggestion-icon">{{ s.icon }}</span> {{ s.text }}
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input-area">
        <div class="chat-input-wrapper">
          <input v-model="inputText" type="text" class="chat-input" placeholder="Ask me anything about travel..." @keyup.enter="sendMessage" ref="chatInput" />
          <button class="chat-send-btn" @click="sendMessage" :disabled="!inputText.trim() || isTyping">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 新建对话命名弹窗 -->
    <transition name="modal-fade">
      <div v-if="showNewChatModal" class="modal-overlay" @click.self="cancelNewChat">
        <div class="modal-dialog">
          <div class="modal-title">新建对话</div>
          <div class="modal-body">
            <input class="modal-input"
                   v-model="newChatName"
                   placeholder="请输入对话名称"
                   @keyup.enter="confirmNewChat"
                   @keyup.escape="cancelNewChat"
                   ref="newChatInput"
                   maxlength="30" />
          </div>
          <div class="modal-actions">
            <button class="modal-btn modal-btn-cancel" @click="cancelNewChat">取消</button>
            <button class="modal-btn modal-btn-confirm" @click="confirmNewChat">确认</button>
          </div>
        </div>
      </div>
    </transition>
  </BgLayout>
</template>

<script setup lang="ts">
import BgLayout from '@/components/BgLayout.vue'
import StatusBar from '@/components/StatusBar.vue'
defineOptions({ name: 'HomePage' })
import { ref, nextTick, onMounted, watch, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}

interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: string
}

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/chat`

const STORAGE_KEY = 'wander_conversations'

function getCurrentTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

function getDateStr(): string {
  const now = new Date()
  return `${now.getMonth() + 1}/${now.getDate()} ${getCurrentTime()}`
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function createDefaultMessages(): ChatMessage[] {
  return [{
    role: 'assistant',
    content: "Hi there! 👋 I'm your Travel AI assistant.",
    time: getCurrentTime(),
  }]
}

function createConversation(): Conversation {
  return {
    id: generateId(),
    title: '新对话',
    messages: createDefaultMessages(),
    updatedAt: getDateStr(),
  }
}

// 从 localStorage 加载所有对话
function loadConversations(): { convs: Conversation[], currentId: string } {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.conversations?.length > 0) {
        return { convs: data.conversations, currentId: data.currentId || data.conversations[0].id }
      }
    }
  } catch (e) {
    console.error('加载对话失败:', e)
  }
  const first = createConversation()
  return { convs: [first], currentId: first.id }
}

const loaded = loadConversations()
const conversations = ref<Conversation[]>(loaded.convs)
const currentConvId = ref(loaded.currentId)
const showHistory = ref(false)

const messages = computed<ChatMessage[]>({
  get() {
    const conv = conversations.value.find(c => c.id === currentConvId.value)
    return conv ? conv.messages : []
  },
  set(val: ChatMessage[]) {
    const conv = conversations.value.find(c => c.id === currentConvId.value)
    if (conv) conv.messages = val
  }
})

function saveConversations() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      conversations: conversations.value,
      currentId: currentConvId.value,
    }))
  } catch (e) {
    console.error('保存对话失败:', e)
  }
}

// 监听变化自动保存
watch(conversations, saveConversations, { deep: true })
watch(currentConvId, saveConversations)

// 新建对话弹窗相关
const showNewChatModal = ref(false)
const newChatName = ref('')
const newChatInput = ref<HTMLInputElement | null>(null)

function createNewChat() {
  newChatName.value = ''
  showNewChatModal.value = true
  nextTick(() => {
    newChatInput.value?.focus()
  })
}

function confirmNewChat() {
  const title = newChatName.value.trim() || '新对话'
  const conv = createConversation()
  conv.title = title
  conversations.value.unshift(conv)
  currentConvId.value = conv.id
  showNewChatModal.value = false
  showHistory.value = false
  nextTick(() => scrollToBottom())
}

function cancelNewChat() {
  showNewChatModal.value = false
}

// 重命名相关
const editingConvId = ref<string | null>(null)
const editingTitle = ref('')
const renameInput = ref<HTMLInputElement[] | null>(null)

function startRename(conv: Conversation) {
  editingConvId.value = conv.id
  editingTitle.value = conv.title
  nextTick(() => {
    const el = renameInput.value?.[0]
    if (el) {
      el.focus()
      el.select()
    }
  })
}

function confirmRename(id: string) {
  if (!editingConvId.value) return
  const conv = conversations.value.find(c => c.id === id)
  if (conv) {
    const newTitle = editingTitle.value.trim()
    conv.title = newTitle || '新对话'
  }
  editingConvId.value = null
  editingTitle.value = ''
}

function cancelRename() {
  editingConvId.value = null
  editingTitle.value = ''
}

function switchConversation(id: string) {
  currentConvId.value = id
  showHistory.value = false
  nextTick(() => scrollToBottom())
}

function deleteConversation(id: string) {
  const idx = conversations.value.findIndex(c => c.id === id)
  if (idx === -1 || conversations.value.length <= 1) return
  conversations.value.splice(idx, 1)
  if (currentConvId.value === id) {
    const first = conversations.value[0]
    if (first) currentConvId.value = first.id
  }
}

const inputText = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const chatInput = ref<HTMLInputElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const suggestions = [
  { icon: '🗼', text: 'Best time to visit Paris?' },
  { icon: '🌸', text: 'Plan a trip to Japan' },
  { icon: '💰', text: 'Budget travel tips' },
  { icon: '🏖️', text: 'Top beach destinations' },
]

const renderMarkdown = (text: string) => {
  if (!text) return ''
  const raw = marked.parse(text, { async: false }) as string
  return DOMPurify.sanitize(raw)
}

const sendSuggestion = (s: { icon: string; text: string }) => {
  if (isTyping.value) return
  inputText.value = s.text
  sendMessage()
}

const sendMessage = async () => {
  const text = inputText.value.trim()
  if (!text || isTyping.value) return

  const conv = conversations.value.find(c => c.id === currentConvId.value)
  if (!conv) return

  conv.messages.push({
    role: 'user',
    content: text,
    time: getCurrentTime(),
  })

  // 自动设置对话标题（取第一条用户消息前20个字符）
  if (conv.title === '新对话') {
    conv.title = text.length > 20 ? text.slice(0, 20) + '...' : text
  }
  conv.updatedAt = getDateStr()

  inputText.value = ''
  await scrollToBottom()
  isTyping.value = true

  const aiMsg = ref<ChatMessage>({
    role: 'assistant',
    content: '',
    time: '',
  })
  
  let buffer = ''

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        messages: conv.messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No stream')

    // 先推入空消息
    conv.messages.push(aiMsg.value)
    isTyping.value = false

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const jsonStr = trimmed.slice(5).trim()
        if (jsonStr === '[DONE]') continue

        try {
          const data = JSON.parse(jsonStr)
          const content = data.choices?.[0]?.delta?.content

          if (content) {
            aiMsg.value.content += content
            
            const idx = conv.messages.length - 1
            conv.messages[idx] = { ...aiMsg.value }
            
            await nextTick()
            scrollToBottom()
          }
        } catch (e) {
          console.error('Parse error:', e)
        }
      }
    }
  } catch (err) {
    console.error(err)
    conv.messages.push({
      role: 'assistant',
      content: '❌ Error occurred',
      time: getCurrentTime(),
    })
  } finally {
    const idx = conv.messages.length - 1
    if (conv.messages[idx]?.role === 'assistant') {
      conv.messages[idx] = {
        ...conv.messages[idx],
        time: getCurrentTime()
      }
    }
    conv.updatedAt = getDateStr()
    isTyping.value = false
    await scrollToBottom()
    chatInput.value?.focus()
  }
}

onMounted(() => {
  scrollToBottom()
  chatInput.value?.focus()
})
</script>

<style scoped>
/* ===== Page Layout ===== */
.chat-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  z-index: 1;
}

/* ===== Header ===== */
.chat-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 52px 20px 16px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.chat-avatar {
  position: relative;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-avatar svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.avatar-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  opacity: 0.3;
  filter: blur(6px);
  animation: glow-pulse 3s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.08); }
}

.chat-header-name {
  font-size: 18px;
  font-weight: 700;
  color: #253c5c;
}

.chat-header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #34c759;
  box-shadow: 0 0 6px rgba(52, 199, 89, 0.5);
  animation: dot-blink 2s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== Header Actions ===== */
.header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.action-btn svg {
  width: 18px;
  height: 18px;
  color: #4a3d6e;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.55);
  transform: scale(1.08);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.active {
  background: linear-gradient(135deg, rgba(155, 109, 255, 0.3), rgba(255, 109, 171, 0.3));
  border-color: rgba(155, 109, 255, 0.4);
}

.action-btn.active svg {
  color: #7c5ce9;
}

/* ===== History Panel ===== */
.history-panel {
  position: absolute;
  top: 100px;
  right: 12px;
  left: 12px;
  max-height: 50vh;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  z-index: 10;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.history-title {
  padding: 14px 18px 10px;
  font-size: 15px;
  font-weight: 700;
  color: #253c5c;
  border-bottom: 1px solid rgba(155, 109, 255, 0.1);
  flex-shrink: 0;
}

.history-list {
  overflow-y: auto;
  padding: 6px 8px 8px;
  flex: 1;
}

.history-list::-webkit-scrollbar {
  width: 3px;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(155, 109, 255, 0.2);
  border-radius: 3px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.history-item:hover {
  background: rgba(155, 109, 255, 0.08);
}

.history-item.active {
  background: linear-gradient(135deg, rgba(155, 109, 255, 0.15), rgba(255, 109, 171, 0.1));
}

.history-item-info {
  flex: 1;
  min-width: 0;
}

.history-item-title {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-item.active .history-item-title {
  color: #7c5ce9;
  font-weight: 600;
}

.history-item-time {
  font-size: 11px;
  color: #9CA3AF;
  margin-top: 2px;
}

/* Rename input */
.history-rename-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid rgba(155, 109, 255, 0.4);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  color: #374151;
  outline: none;
  font-family: inherit;
}

.history-rename-input:focus {
  border-color: #9b6dff;
  box-shadow: 0 0 0 2px rgba(155, 109, 255, 0.15);
}

/* Action buttons group */
.history-item-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 6px;
}

.history-action-btn {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-action-btn svg {
  color: #9CA3AF;
}

.rename-btn:hover {
  background: rgba(155, 109, 255, 0.1);
}

.rename-btn:hover svg {
  color: #7c5ce9;
}

.delete-btn:hover {
  background: rgba(255, 100, 100, 0.1);
}

.delete-btn:hover svg {
  color: #ef4444;
}

/* Panel slide transition */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.96);
}

/* ===== New Chat Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-dialog {
  width: 85%;
  max-width: 320px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 24px;
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #253c5c;
  margin-bottom: 18px;
  text-align: center;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(155, 109, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 15px;
  color: #374151;
  outline: none;
  font-family: inherit;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #9b6dff;
  box-shadow: 0 0 0 3px rgba(155, 109, 255, 0.12);
}

.modal-input::placeholder {
  color: #9CA3AF;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-btn {
  flex: 1;
  padding: 10px 0;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.modal-btn-cancel {
  background: rgba(0, 0, 0, 0.06);
  color: #6B7280;
}

.modal-btn-cancel:hover {
  background: rgba(0, 0, 0, 0.1);
}

.modal-btn-confirm {
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  color: #fff;
  box-shadow: 0 4px 12px rgba(155, 109, 255, 0.3);
}

.modal-btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(155, 109, 255, 0.4);
}

.modal-btn-confirm:active {
  transform: scale(0.97);
}

/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-active .modal-dialog,
.modal-fade-leave-active .modal-dialog {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-dialog {
  transform: scale(0.9) translateY(10px);
}

.modal-fade-leave-to .modal-dialog {
  transform: scale(0.95);
}

/* ===== Messages Area ===== */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px 8px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: rgba(155, 109, 255, 0.2);
  border-radius: 4px;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  animation: msg-appear 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes msg-appear {
  from { opacity: 0; transform: translateY(12px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.message-user {
  flex-direction: row-reverse;
}

.msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-avatar svg {
  width: 16px;
  height: 16px;
  color: #fff;
}

/* ===== Message Bubbles ===== */
.message-bubble {
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 20px;
  position: relative;
  word-wrap: break-word;
  line-height: 1.5;
}

.bubble-ai {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(155, 109, 255, 0.08);
  color: #374151;
}

.bubble-user {
  background: linear-gradient(135deg, #9b6dff, #7c5ce9);
  border-radius: 20px 20px 6px 20px;
  color: #fff;
  box-shadow: 0 4px 20px rgba(155, 109, 255, 0.25);
}

/* Markdown 渲染后的文本样式 */
.message-text {
  font-size: 15px;
  line-height: 1.6;
  white-space: normal;
  word-break: break-word;
}

.message-text :deep(p) {
  margin: 0 0 0.5em 0;
}
.message-text :deep(p:last-child) {
  margin-bottom: 0;
}
.message-text :deep(ul), .message-text :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}
.message-text :deep(li) {
  margin: 0.2em 0;
}
.message-text :deep(code) {
  background: rgba(0,0,0,0.08);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}
.message-text :deep(pre) {
  background: rgba(0,0,0,0.05);
  padding: 0.75em;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.5em 0;
}
.message-text :deep(pre code) {
  background: none;
  padding: 0;
}
.message-text :deep(strong) {
  font-weight: 700;
}
.message-text :deep(a) {
  color: #9b6dff;
  text-decoration: underline;
}
.bubble-user .message-text :deep(a) {
  color: #fff;
  text-decoration: underline;
}

.message-time {
  font-size: 11px;
  text-align: right;
  margin-top: 4px;
}

.bubble-ai .message-time {
  color: #9CA3AF;
}

.bubble-user .message-time {
  color: rgba(255, 255, 255, 0.65);
}

/* ===== Typing Indicator ===== */
.typing-bubble {
  padding: 14px 20px;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  animation: typing-pulse 1.2s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing-pulse {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
  40% { transform: scale(1.2); opacity: 1; }
}

/* ===== Suggestions ===== */
.chat-suggestions {
  padding: 0 16px 8px;
  flex-shrink: 0;
}

.suggestions-title {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 10px;
  padding-left: 4px;
  font-weight: 500;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  font-size: 13px;
  color: #4a3d6e;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestion-chip:hover {
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(155, 109, 255, 0.12);
}

.suggestion-chip:active {
  transform: scale(0.95);
}

/* ===== Input Area ===== */
.chat-input-area {
  padding: 8px 12px;
  padding-bottom: calc(64px + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.chat-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 25px;
  padding: 6px 6px 6px 18px;
  transition: all 0.3s ease;
}

.chat-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(155, 109, 255, 0.3);
  box-shadow: 0 4px 24px rgba(155, 109, 255, 0.12);
}

.chat-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: #374151;
  padding: 8px 0;
  font-family: inherit;
}

.chat-input::placeholder {
  color: #9CA3AF;
}

.chat-send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(155, 109, 255, 0.3);
}

.chat-send-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(155, 109, 255, 0.4);
}

.chat-send-btn:active {
  transform: scale(0.92);
}

.chat-send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.chat-send-btn svg {
  width: 18px;
  height: 18px;
  color: #fff;
}
</style>
