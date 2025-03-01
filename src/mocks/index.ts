async function initMocks() {
    if (typeof window === "undefined") { // 서버 환경에서 window -> undefined
      const { server } = await import("./server");
      server.listen();
    } else {
      const { worker } = await import("./browser");
      worker.start();
    }
}
  
export { initMocks };