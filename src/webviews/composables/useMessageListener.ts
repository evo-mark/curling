import { onMounted, onUnmounted, ref } from "vue";

export const useMessageListener = (subscribedActions: string[] = []) => {
  const action = ref(null);
  const data = ref(null);

  const callback = (event: MessageEvent) => {
    const message = event.data;
    action.value = message.action;
    console.log("Callback for ", message);

    if (
      !action.value ||
      (subscribedActions.length > 0 &&
        subscribedActions.includes(action.value) === false)
    ) {
      return;
    }

    switch (action.value) {
      case "collection":
        data.value = message;
        break;
    }
  };

  onMounted(() => window.addEventListener("message", callback));
  onUnmounted(() => window.removeEventListener("message", callback));

  return {
    data,
    action,
  };
};
