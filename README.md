<p>
<a href="https://github.com/fish2lab/fish2lab/tree/main/art">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream.svg" />
    <img width="100%" alt="fish²lab. An engraved stream: each day with GitHub contributions in the last year is a ripple, laid out like the contribution calendar. The whale from the fish²lab logo is drawn only by the weight of the water lines; the fish leaps from its spout. A fisherman at the right end holds his line over today." src="https://raw.githubusercontent.com/fish2lab/fish2lab/output/stream.svg" />
  </picture>
</a>
</p>

PhD student at Beijing Jiaotong University, working on **LLM agent security at the harness layer**: where the security boundary belongs once an agent holds real logins, runs code and remembers things, and how a harness that rewrites itself stays inside that boundary. I also shoot medium-format film, study mathematics, and write about the systems that shape learning and everyday life.

北京交通大学博士生，做 **agent harness 层的 LLM 安全**：agent 拿着真实登录态、能执行代码、会写记忆之后，安全边界该放在哪里；会自我改写的 harness 怎样不越过这条边界。也拍中画幅胶片、学数学，记录技术、学习与日常生活里的系统性问题。

[fish2lab.com](https://fish2lab.com) · [x.com/fish2lab](https://x.com/fish2lab) · [fish2lab@gmail.com](mailto:fish2lab@gmail.com)

## Now · 2026‑10

<table>
  <tr>
    <td width="110" valign="top"><sub><b>RESEARCHING</b></sub></td>
    <td>The harness as a reference monitor. Indirect prompt injection gets a larger blast radius every time an agent inherits a real browser session or installs a third‑party Skill or MCP server, and the model cannot be trusted to refuse. So the boundary goes outside the model: a harness that mediates every action, that the model cannot tamper with, and whose policy can be checked, with credentials kept out of it entirely. Two places this gets hard: Code Mode and general executors move permission from the granularity of a tool to the granularity of an execution, where sandboxes, network allowlists and information‑flow tracking have to take over; and stateful agents need control over what they <em>write</em> to memory as well as what they say. A passphrase echo before an irreversible action catches context drift but stops no adversary.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>SELF‑IMPROVING</b></sub></td>
    <td>Harnesses that improve themselves, with constraints. How a self‑made change is accepted or rolled back without overfitting to the benchmark it was scored on; why an agent may accumulate facts on its own while new behaviour rules can only be proposed for a human to review; and retrodiction, predicting outcomes that are already known from earlier state, as the training signal for the loop.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>INSIDE THE MODEL</b></sub></td>
    <td>Refusal robustness at the representation level: refusal directions and SAE features as detectors in multi‑turn and agent settings; whether a semantics‑preserving position shift under compressed attention is enough to slip past refusal; and latent or KV‑cache channels between agents that leave token‑level audits and chain‑of‑thought monitoring with nothing to read.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>WRITING</b></sub></td>
    <td>A position paper arguing the agent harness does not disappear under scaling, it shrinks to a kernel: four operations on context structure (<code>execute</code>, <code>cut</code>, <code>fork</code>, <code>partition</code>) and not one line of prompt. Everything a harness does by <em>saying</em> gets absorbed into the weights; what it does by <em>placing</em> cannot be.</td>
  </tr>
  <tr>
    <td valign="top"><sub><b>SHIPPING</b></sub></td>
    <td><a href="https://github.com/fish2lab/touhou-code-video-template">touhou-code-video-template</a>, the engine behind the Patchouli Lecture series pulled out as a template: a voiced Touhou explainer in pure Canvas 2D, six episodes so far (<a href="https://github.com/fish2lab/patchouli-lecture-5">optogenetics and mental health</a>, <a href="https://github.com/fish2lab/patchouli-lecture-6">cooking as engineering</a>). <a href="https://github.com/fish2lab/os-lab-mcp">os-lab-mcp</a>, a lab for the undergraduate OS interfaces course where students watch an agent reach the file system through MCP and write the sandbox rule that stops it. <a href="https://github.com/fish2lab/DSCodex">DSCodex</a> v1.4.0.</td>
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
      <b><a href="https://github.com/fish2lab/touhou-code-video-template">touhou-code-video-template</a></b><br>
      A fully voiced Touhou fan explainer in nothing but JavaScript and Canvas 2D: 14 procedural paper‑cut chibi characters, Yukkuri voice, music‑box BGM, and a deterministic renderer where every frame is a function of time. Zero image assets; ships with AGENTS.md and llms.txt.<br>
      <sub>纯代码做一集东方科普视频，帕秋莉讲座系列的引擎。<code>JavaScript&nbsp;·&nbsp;Canvas&nbsp;·&nbsp;MIT</code></sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <b><a href="https://github.com/fish2lab/os-lab-mcp">os-lab-mcp</a></b><br>
      Template repo for an OS interfaces course lab: an agent driver on pi plus an MCP bridge, packet recorder and process‑tree observer. Students write the tool handlers, a realpath check and one sandbox rule, then catch a path‑traversal attempt in the logs.<br>
      <sub>《操作系统接口技术》验证实验：Agent 经 MCP 访问 OS 资源。<code>TypeScript</code></sub>
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
