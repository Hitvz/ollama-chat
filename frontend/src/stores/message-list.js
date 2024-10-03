import {defineStore} from 'pinia'

const useMessageListStore = defineStore('messageList', {
  state: () => {
    return {
      messageList: [],
      lastMessage: null
    }
  },
  actions: {
    addMessage(state, message) {
      state.messageList.push(message);
      state.lastMessage = message;
    },
    appendLastContent(state, appendContent) {
      state.lastMessage.content += appendContent;
    },
    updateLastMessageDone(state) {
      state.lastMessage.isDone = true;
    },
    lastMessageIsDone(state) {
      return state.lastMessage.isDone
    }
  },
})

export default useMessageListStore
