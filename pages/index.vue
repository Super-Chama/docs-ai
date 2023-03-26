<template>
  <OxdSheet class="chat">
    <OxdText type="card-title" class="chat-title">Documents AI</OxdText>
    <OxdGrid class="chat-roller">
      <OxdGridItem
        v-for="chat in chatHistory"
        :key="chat.id"
        :class="{
          'chat-bubble': true,
          '--question': chat.type === 'q',
        }"
      >
        <OxdText tag="pre">{{ chat.data }}</OxdText>
      </OxdGridItem>
      <OxdGridItem v-if="isLoading" class="chat-bubble">
        <div class="typing">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </OxdGridItem>
    </OxdGrid>
    <OxdForm class="chat-form" @submitValid="onSubmitForm">
      <OxdBuzzPostInput v-model="userInput" :rules="rules">
        <OxdButton label="Ask!" type="submit" :disabled="isLoading" />
      </OxdBuzzPostInput>
    </OxdForm>
  </OxdSheet>
</template>

<script setup lang="ts">
import {
  OxdForm,
  OxdGrid,
  OxdText,
  OxdSheet,
  OxdButton,
  OxdGridItem,
  OxdBuzzPostInput,
} from "@ohrm/oxd";

const chatHistory = ref<
  Array<{
    id: number;
    type: string;
    data: string;
  }>
>([]);

const rules = [
  (v: string) => (!!v && v.trim() !== "") || "Required",
  (v: string) => (v && v.length <= 500) || "Should be less than 500 characters",
];

const isLoading = shallowRef<boolean>(false);
const userInput = shallowRef<string | null>(null);

const onSubmitForm = async ($e: SubmitEvent) => {
  if (isLoading.value || !userInput.value) return;

  const prompt = userInput.value;
  chatHistory.value.push({
    id: chatHistory.value.length + 1,
    type: "q",
    data: prompt,
  });

  isLoading.value = true;
  ($e.target as HTMLFormElement).reset();
  const rawResponse = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      history: chatHistory.value.slice(-5).map((chat) => {
        return `${chat.type === "q" ? "Human" : "Documents AI"}: ${chat.data}`;
      }),
    }),
  });

  const { response } = await rawResponse.json();
  response &&
    chatHistory.value.push({
      id: chatHistory.value.length + 1,
      type: "a",
      data: response,
    });

  isLoading.value = false;
};

onBeforeMount(() => {
  isLoading.value = true;
  chatHistory.value.push({ id: 1, type: "a", data: "Hello!" });
  setTimeout(() => {
    isLoading.value = false;
    chatHistory.value.push({
      id: 2,
      type: "a",
      data: "You can ask any questions related to documentation from me.",
    });
  }, 720);
});
</script>

<style lang="css" scoped>
.chat {
  height: 85vh;
  display: flex;
  flex-direction: column;
}
.chat-form {
  margin-top: 10px;
}
.chat-title {
  text-align: center;
}
.chat-bubble {
  padding: 1rem;
  max-width: 65%;
  font-weight: 600;
  width: fit-content;
  border-radius: 1rem;
  margin-bottom: 0.25rem;
  background-color: #ffb549;
}
.chat-bubble pre {
  color: white;
  white-space: pre-wrap;
}
.chat-bubble.--question {
  margin-left: auto;
  background-color: #f6f5fb;
}
.chat-bubble.--question pre {
  color: #64728c;
}

.chat-bubble:last-of-type {
  scroll-snap-align: end;
}
.chat-roller {
  margin: unset;
  overflow: auto;
  max-height: 70vh;
  margin-top: auto;
  overscroll-behavior-y: contain;
  scroll-snap-type: y proximity;
}

.typing {
  align-items: center;
  display: flex;
  height: 17px;
}
.typing .dot {
  animation: typingAnimation 1.8s infinite ease-in-out;
  background-color: #fcfcfc;
  border-radius: 50%;
  height: 7px;
  margin-right: 4px;
  vertical-align: middle;
  width: 7px;
  display: inline-block;
}
.typing .dot:nth-child(1) {
  animation-delay: 200ms;
}
.typing .dot:nth-child(2) {
  animation-delay: 300ms;
}
.typing .dot:nth-child(3) {
  animation-delay: 400ms;
}
.typing .dot:last-child {
  margin-right: 0;
}

@keyframes typingAnimation {
  0% {
    transform: translateY(0px);
    background-color: #b1b1b1;
  }
  28% {
    transform: translateY(-7px);
    background-color: #cccccc;
  }
  44% {
    transform: translateY(0px);
    background-color: #f3f3f3;
  }
}
</style>
