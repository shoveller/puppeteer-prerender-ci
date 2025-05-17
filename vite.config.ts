import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerender from "@prerenderer/rollup-plugin";
import PuppeteerRenderer from "@prerenderer/renderer-puppeteer";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      // 이 부분은 수동으로 작성해야 한다.
      routes: ["/", "/hello"],
      renderer: PuppeteerRenderer,
      server: {
        port: 3000,
        host: "localhost",
      },
      rendererOptions: {
        maxConcurrentRoutes: 1,
        renderAfterTime: 500,
        executablePath:
          process.env.PUPPETEER_EXECUTABLE_PATH ||
          path.join(process.cwd(), "chrome-linux", "chrome"),
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
      postProcess(renderedRoute) {
        // 빌드 결과물에 http 또는 127.0.0.1, localhost 가 명시되어 있다면 다른 값으로 치환한다.

        renderedRoute.html = renderedRoute.html
          .replace(/http:/i, "https:")
          .replace(
            /(https:\/\/)?(localhost|127\.0\.0\.1):\d*/i,
            "shoveller.github.io"
          );
      },
    }),
  ],
  base: "/puppeteer-prerender-ci/",
});
