import React from "react"
import ReactDOM from "react-dom/client"
import DispatchApp from "./dispatch/DispatchApp"

// Entry เฉพาะดีไซน์ใหม่แนว Dispatch (สาขา dispatch-design)
// ไม่ลงทะเบียน service worker และไม่โหลด index.css ของดีไซน์เดิม
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DispatchApp />
  </React.StrictMode>
)
