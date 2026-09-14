<div align="center">
  <img width="640" alt="fish²lab" src="./assets/fish2lab-readme-logo.png" />
  <p>
    <a href="https://fish2lab.com"><img alt="fish2lab.com" src="https://img.shields.io/badge/fish2lab.com-111111?style=flat-square&logo=googlechrome&logoColor=white" /></a>
    <a href="https://portfolio.fish2lab.com"><img alt="Portfolio" src="https://img.shields.io/badge/Portfolio-3E8E9E?style=flat-square&logo=hasselblad&logoColor=white" /></a>
    <a href="https://research.fish2lab.com"><img alt="Research" src="https://img.shields.io/badge/Research-2F5D8A?style=flat-square&logo=arxiv&logoColor=white" /></a>
    <a href="https://blog.fish2lab.com"><img alt="Blog" src="https://img.shields.io/badge/Blog-6B4C9A?style=flat-square&logo=rss&logoColor=white" /></a>
    <a href="https://x.com/fish2lab"><img alt="X" src="https://img.shields.io/badge/@fish2lab-000000?style=flat-square&logo=x&logoColor=white" /></a>
    <a href="mailto:fish2lab@gmail.com"><img alt="Email" src="https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white" /></a>
  </p>
</div>

## Silas Su · 苏心贤

PhD student at Beijing Jiaotong University, working on **LLM security and agent harnesses**: how an agent system tells the model *who said what*, and what breaks when it cannot. I also shoot medium-format film, study mathematics, and write about the systems that shape learning and everyday life.

北京交通大学博士生，做 **LLM 安全与 agent harness**：系统怎样告诉模型「这段话是谁说的」，这件事失灵时会发生什么。也拍中画幅胶片、学数学，记录技术、学习与日常生活里的系统性问题。

## Now · 2026‑09

<table>
  <tr>
    <td width="130" valign="top"><strong>🔬 Researching</strong></td>
    <td>Provenance inside the context window. A model decides whom to trust with two systems: role tokens it cannot forge but that only split <em>mine</em> from <em>theirs</em>, and text shapes it learned from harnesses in post‑training, fine‑grained but forgeable by anyone. Prompt injection lives in the gap between them. Probing this on open weights of <a href="https://api-docs.deepseek.com/">DeepSeek V4.1 Flash</a>: does a role header change what the model reads, and is a successful injection always one that got selected?</td>
  </tr>
  <tr>
    <td valign="top"><strong>✍️ Writing</strong></td>
    <td>A position paper arguing the agent harness does not disappear under scaling, it shrinks to a kernel: four operations on context structure (<code>execute</code>, <code>cut</code>, <code>fork</code>, <code>partition</code>) and not one line of prompt. Everything a harness does by <em>saying</em> gets absorbed into the weights; what it does by <em>placing</em> cannot be.</td>
  </tr>
  <tr>
    <td valign="top"><strong>🚢 Shipping</strong></td>
    <td><a href="https://github.com/fish2lab/DSCodex">DSCodex</a> v1.2.1, a local router that puts DeepSeek V4.1 Flash into the stock Codex / ChatGPT desktop app. A macOS Dock‑reopen fix merged upstream into <a href="https://github.com/l0ng-ai/tty7/pull/880">tty7</a>.</td>
  </tr>
  <tr>
    <td valign="top"><strong>📷 Elsewhere</strong></td>
    <td>Film scans going up at <a href="https://portfolio.fish2lab.com">portfolio.fish2lab.com</a>; a Touhou fan‑game side project about a perishable flow and four storable stocks.</td>
  </tr>
</table>

## Building

<table>
  <tr>
    <td width="50%" valign="top">
      <strong><a href="https://github.com/fish2lab/DSCodex">DSCodex</a></strong>
      &nbsp;<a href="https://github.com/fish2lab/DSCodex/releases/latest"><img alt="release" src="https://img.shields.io/github/v/release/fish2lab/DSCodex?style=flat-square&label=&color=4D6BFE" /></a>
      <a href="https://github.com/fish2lab/DSCodex/stargazers"><img alt="stars" src="https://img.shields.io/github/stars/fish2lab/DSCodex?style=flat-square&label=&color=F5A623" /></a><br>
      DeepSeek V4.1 Flash inside the unmodified ChatGPT desktop app, Codex CLI and IDE. Local loopback router, native Responses API, full tool loops, GPT OAuth kept side by side. No fork, no patch.<br>
      <sub>在原版 Codex / ChatGPT 桌面端同时使用 DeepSeek 与 GPT。<code>JavaScript · MIT</code></sub>
    </td>
    <td width="50%" valign="top">
      <strong><a href="https://github.com/l0ng-ai/tty7">tty7</a></strong>
      &nbsp;<a href="https://github.com/l0ng-ai/tty7/pull/880"><img alt="PR #880 merged" src="https://img.shields.io/badge/PR_%23880-merged-8250DF?style=flat-square&logo=github&logoColor=white" /></a><br>
      A pure‑Rust terminal workbench on Zed's gpui with persistent sessions and coding‑agent awareness. My contribution answers the macOS Dock's reopen event, so a tty7 whose last window was closed comes back instead of staying retired.<br>
      <sub>给 tty7 补上 macOS Dock 重新打开窗口的行为。<code>Rust</code></sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <strong><a href="https://github.com/fish2lab/bjtu-cli">bjtu-cli</a></strong> · <strong><a href="https://github.com/fish2lab/BJTUselfService-macOS">BJTUselfService‑macOS</a></strong><br>
      The campus MIS, AA and course platforms as a command‑line client built for coding agents to drive, and as a native SwiftUI app with Liquid Glass and course grabbing.<br>
      <sub>北交大校园系统的 CLI 与 macOS 原生版。<code>Swift</code></sub>
    </td>
    <td valign="top">
      <strong><a href="https://github.com/fish2lab/sukima-ml">sukima-ml</a></strong><br>
      Website for 隙间月影 Sukima Moonlight, a doujin circle pairing classic paintings with Touhou Project. Dual‑frame gallery, a Galgame‑style guide, museum‑grade CSS matting.<br>
      <sub>名画与东方 Project 的邂逅。<code>TypeScript · Docusaurus</code></sub>
    </td>
  </tr>
</table>

**Upstream** · [typex-ink/Typex #2](https://github.com/typex-ink/Typex/pull/2) adds Xiaomi MiMo ASR and explicit hotkey trigger modes.

## Where things live · 内容入口

<table>
  <tr>
    <td width="33%" valign="top">
      <strong>Portfolio · 作品集</strong><br>
      Medium‑format documentary, landscape, street and conceptual series.<br>
      <a href="https://portfolio.fish2lab.com">portfolio.fish2lab.com →</a>
    </td>
    <td width="33%" valign="top">
      <strong>Research · 研究</strong><br>
      Field notes, probes and work in progress on LLM security and agent systems.<br>
      <a href="https://research.fish2lab.com">research.fish2lab.com →</a>
    </td>
    <td width="33%" valign="top">
      <strong>Blog · 文章</strong><br>
      Essays on cognitive science, learning, health and everyday systems.<br>
      <a href="https://blog.fish2lab.com">blog.fish2lab.com →</a>
    </td>
  </tr>
</table>

## Activity

<p align="center">
  <a href="https://github.com/fish2lab">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://ghchart.rshah.org/26a641/fish2lab" />
      <img width="100%" alt="fish2lab contribution heatmap" src="https://ghchart.rshah.org/40c463/fish2lab" />
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://github.com/fish2lab">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-activity-graph.vercel.app/graph?username=fish2lab&bg_color=0d1117&color=8b949e&line=26a641&point=3fb950&area_color=0e4429&area=true&hide_border=true&hide_title=true&radius=0&height=300&days=31&grid=false" />
      <img width="100%" alt="fish2lab activity over the past 31 days" src="https://github-readme-activity-graph.vercel.app/graph?username=fish2lab&bg_color=ffffff&color=57606a&line=40c463&point=216e39&area_color=9be9a8&area=true&hide_border=true&hide_title=true&radius=0&height=300&days=31&grid=false" />
    </picture>
  </a>
</p>

<p align="center"><sub>闲来垂钓碧溪上，忽复乘舟梦日边</sub></p>
