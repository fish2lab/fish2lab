<p>
<a href="https://github.com/fish2lab/fish2lab/tree/main/art">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream.svg" />
    <img width="100%" alt="fish²lab. An engraved stream: each day with GitHub contributions in the last year is a ripple, laid out like the contribution calendar. The whale from the fish²lab logo is drawn only by the weight of the water lines; the fish leaps from its spout. A fisherman at the right end holds his line over today." src="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream.svg" />
  </picture>
</a>
</p>

PhD student at Beijing Jiaotong University, working on **LLM security and agent harnesses**: how an agent system tells the model *who said what*, and what breaks when it cannot. I also shoot medium-format film, study mathematics, and write about the systems that shape learning and everyday life.

北京交通大学博士生，做 **LLM 安全与 agent harness**：系统怎样告诉模型「这段话是谁说的」，这件事失灵时会发生什么。也拍中画幅胶片、学数学，记录技术、学习与日常生活里的系统性问题。

[fish2lab.com](https://fish2lab.com) · [x.com/fish2lab](https://x.com/fish2lab) · [fish2lab@gmail.com](mailto:fish2lab@gmail.com)

## Now · 2026‑09

<table>
  <tr>
    <td width="110" valign="top"><sub><b>RESEARCHING</b></sub></td>
    <td>Provenance inside the context window. A model decides whom to trust with two systems: role tokens it cannot forge but that only split <em>mine</em> from <em>theirs</em>, and text shapes it learned from harnesses in post‑training, fine‑grained but forgeable by anyone. Prompt injection lives in the gap between them. Probing this on open weights of <a href="https://api-docs.deepseek.com/">DeepSeek V4.1 Flash</a>: does a role header change what the model reads, and is a successful injection always one that got selected?</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>WRITING</b></sub></td>
    <td>A position paper arguing the agent harness does not disappear under scaling, it shrinks to a kernel: four operations on context structure (<code>execute</code>, <code>cut</code>, <code>fork</code>, <code>partition</code>) and not one line of prompt. Everything a harness does by <em>saying</em> gets absorbed into the weights; what it does by <em>placing</em> cannot be.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>SHIPPING</b></sub></td>
    <td><a href="https://github.com/fish2lab/DSCodex">DSCodex</a> v1.3.0, a local router that puts DeepSeek V4.1 Flash into the stock Codex / ChatGPT desktop app. <a href="https://github.com/fish2lab/bjtu-touhou-booth">A 140‑second woodcut loop</a> for the BJTU Touhou booth, every frame drawn on Canvas by code. A macOS Dock‑reopen fix merged upstream into <a href="https://github.com/l0ng-ai/tty7/pull/880">tty7</a>.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>ELSEWHERE</b></sub></td>
    <td>Film scans going up at <a href="https://portfolio.fish2lab.com">portfolio.fish2lab.com</a>; a Touhou fan‑game side project about a perishable flow and four storable stocks.</td>
  </tr>
</table>

## Building

<table>
  <tr>
    <td width="50%" valign="top">
      <b><a href="https://github.com/fish2lab/DSCodex">DSCodex</a></b><br>
      DeepSeek V4.1 Flash inside the unmodified ChatGPT desktop app, Codex CLI and IDE. Local loopback router, native Responses API, full tool loops, GPT OAuth kept side by side. No fork, no patch.<br>
      <sub>在原版 Codex / ChatGPT 桌面端同时使用 DeepSeek 与 GPT。<code>JavaScript&nbsp;·&nbsp;MIT</code></sub>
    </td>
    <td width="50%" valign="top">
      <b><a href="https://github.com/fish2lab/bjtu-touhou-booth">bjtu-touhou-booth</a></b><br>
      A silent 4K loop in seven parts for a university Touhou booth. Woodcut ink blocks, scratched white lines and handwritten type, all drawn frame by frame on Canvas in JavaScript; no image model touched it.<br>
      <sub>北交东方摊位 4K 循环短片，七段木刻风动画。<code>JavaScript&nbsp;·&nbsp;Canvas&nbsp;·&nbsp;MIT</code></sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <b><a href="https://github.com/fish2lab/bjtu-cli">bjtu-cli</a></b> · <b><a href="https://github.com/fish2lab/BJTUselfService-macOS">BJTUselfService‑macOS</a></b><br>
      The campus MIS, AA and course platforms as a command‑line client built for coding agents to drive, and as a native SwiftUI app with Liquid Glass and course grabbing.<br>
      <sub>北交大校园系统的 CLI 与 macOS 原生版。<code>Swift</code></sub>
    </td>
    <td valign="top">
      <b><a href="https://github.com/fish2lab/sukima-ml">sukima-ml</a></b><br>
      Website for 隙间月影 Sukima Moonlight, a doujin circle pairing classic paintings with Touhou Project. Dual‑frame gallery, a Galgame‑style guide, museum‑grade CSS matting.<br>
      <sub>名画与东方 Project 的邂逅。<code>TypeScript&nbsp;·&nbsp;Docusaurus</code></sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <b><a href="https://github.com/l0ng-ai/tty7">tty7</a></b> <sub>upstream</sub><br>
      A pure‑Rust terminal workbench on Zed's gpui with persistent sessions and coding‑agent awareness. My <a href="https://github.com/l0ng-ai/tty7/pull/880">#880</a> answers the macOS Dock's reopen event, so a tty7 whose last window was closed comes back instead of staying retired.<br>
      <sub>给 tty7 补上 macOS Dock 重新打开窗口的行为。<code>Rust&nbsp;·&nbsp;merged&nbsp;2026‑09‑14</code></sub>
    </td>
    <td valign="top">
      <b><a href="https://github.com/typex-ink/Typex">Typex</a></b> <sub>upstream</sub><br>
      An open‑source desktop voice input tool. My <a href="https://github.com/typex-ink/Typex/pull/2">#2</a> adds Xiaomi MiMo ASR and explicit hotkey trigger modes.<br>
      <sub>给 Typex 接入小米 MiMo 语音识别与显式快捷键触发。<code>Rust&nbsp;·&nbsp;merged&nbsp;2026‑07‑30</code></sub>
    </td>
  </tr>
</table>

## Where things live · 内容入口

<table>
  <tr>
    <td width="33%" valign="top">
      <b>Portfolio · 作品集</b><br>
      Medium‑format documentary, landscape, street and conceptual series.<br>
      <a href="https://portfolio.fish2lab.com">portfolio.fish2lab.com →</a>
    </td>
    <td width="33%" valign="top">
      <b>Research · 研究</b><br>
      Field notes, probes and work in progress on LLM security and agent systems.<br>
      <a href="https://research.fish2lab.com">research.fish2lab.com →</a>
    </td>
    <td width="33%" valign="top">
      <b>Blog · 文章</b><br>
      Essays on cognitive science, learning, health and everyday systems.<br>
      <a href="https://blog.fish2lab.com">blog.fish2lab.com →</a>
    </td>
  </tr>
</table>

<sub>The header is redrawn every night from the contribution calendar by <a href="https://github.com/fish2lab/fish2lab/blob/main/art/render.mjs"><code>art/render.mjs</code></a>: one ripple per active day, weeks left to right, Sunday on the far row. <a href="https://github.com/fish2lab/fish2lab/tree/main/art">How it is drawn →</a></sub>
