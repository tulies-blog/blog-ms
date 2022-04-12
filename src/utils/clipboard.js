import Vue from "vue";
import Clipboard from "clipboard";

function clipboardSuccess(options) {
  Vue.prototype.$message({
    message: options.successMsg || "Copy successfully",
    type: "success",
    duration: 1500,
  });
}

function clipboardError(options) {
  Vue.prototype.$message({
    message: options.errorMsg || "Copy failed",
    type: "error",
  });
}

export default function handleClipboard(text, event, options = {}) {
  const clipboard = new Clipboard(event.target, {
    text: () => text,
  });
  clipboard.on("success", () => {
    clipboardSuccess(options);
    clipboard.off("error");
    clipboard.off("success");
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    clipboardError(options);
    clipboard.off("error");
    clipboard.off("success");
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
