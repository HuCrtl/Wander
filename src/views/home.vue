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
      </div>

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
  </BgLayout>
</template>

<script setup lang="ts">
import BgLayout from '@/components/BgLayout.vue'
import StatusBar from '@/components/StatusBar.vue'
import { ref, nextTick, onMounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const API_URL = 'https://api.deepseek.com/chat/completions'

const messages = ref<ChatMessage[]>([
  {
    role: 'assistant',
    content: "Hi there! 👋 I'm your Travel AI assistant.",
    time: getCurrentTime(),
  },
])

const inputText = ref('')
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const chatInput = ref<HTMLInputElement | null>(null)

function getCurrentTime(): string {
  const now = new Date()
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

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

  messages.value.push({
    role: 'user',
    content: text,
    time: getCurrentTime(),
  })

  inputText.value = ''
  await scrollToBottom()
  isTyping.value = true

  // 🔥 用 ref 存储当前 AI 消息，确保响应式
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
        Authorization: `Bearer ${API_KEY}`,
        Accept: 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        stream: true,
        messages: messages.value.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) throw new Error('No stream')

    // 先推入空消息
    messages.value.push(aiMsg.value)
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
            // 🔥 直接修改 ref 的值
            aiMsg.value.content += content
            
            // 强制触发 messages 更新
            const idx = messages.value.length - 1
            messages.value[idx] = { ...aiMsg.value }
            
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
    messages.value.push({
      role: 'assistant',
      content: '❌ Error occurred',
      time: getCurrentTime(),
    })
  } finally {
    // 最后更新时间
    const idx = messages.value.length - 1
    if (messages.value[idx]?.role === 'assistant') {
      messages.value[idx] = {
        ...messages.value[idx],
        time: getCurrentTime()
      }
    }
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