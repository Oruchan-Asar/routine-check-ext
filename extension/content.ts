// Listen for messages from the web app
window.addEventListener("message", async (event) => {
  // Make sure the message is from our web app
  if (event.source !== window || event.origin !== window.location.origin)
    return;

  const message = event.data;

  // Verify message source
  if (message.source !== "routine-check-ext") return;

  if (message.type === "CLOSE_MATCHING_TABS" && message.url) {
    try {
      await new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
          {
            type: "CLOSE_MATCHING_TABS",
            url: message.url,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Chrome runtime error:", chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            } else {
              resolve(response);
            }
          }
        );
      });
    } catch (error: unknown) {
      console.error("Failed to send message to background script:", error);
      // Check if error is an object with a message property
      if (error && typeof error === "object" && "message" in error) {
        if (
          typeof error.message === "string" &&
          error.message.includes("Extension context invalidated")
        ) {
          window.location.reload();
        }
      }
    }
  }
});
