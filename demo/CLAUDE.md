# COUNCIL Game - Project Guide

## Environment Setup

**IMPORTANT: This project uses a dedicated conda environment. Always activate it before running any Python commands.**

```bash
conda activate council
```

- **Conda env name**: `council`
- **Python version**: 3.12
- **Env path**: `/opt/anaconda3/envs/council`
- **Python binary**: `/opt/anaconda3/envs/council/bin/python`
- **Pip binary**: `/opt/anaconda3/envs/council/bin/pip`

### Running the backend

```bash
conda activate council
python run.py
# or directly:
/opt/anaconda3/envs/council/bin/python run.py
```

### Installing new dependencies

```bash
conda activate council
pip install <package>
# Then add to requirements.txt
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
mistral-hackathon/
  backend/          # FastAPI backend (Python)
    game/           # Game logic (orchestrator, agents, models)
    server.py       # FastAPI app entry point
  frontend/         # Next.js frontend (TypeScript)
    hooks/          # React hooks (useGameState, etc.)
    lib/            # API client, utilities
  requirements.txt  # Python dependencies
  run.py            # Backend entry point
```

## Key Dependencies

- **Backend**: FastAPI, Mistral AI SDK, Pydantic v2, ElevenLabs, redis (Upstash), supabase
- **Frontend**: Next.js, React, TypeScript

## 3D 场景白屏/WebGL Context Loss 修复记录（重要）

此 bug 曾反复出现多次，以下是最终定位到的根因和修复方案，**请勿回退这些修改**。

### 问题现象
进入游戏 3D 场景（`GameBoard` → `RoundtableScene`）时白屏或黑屏，控制台报 `THREE.WebGLRenderer: Context Lost`。原生 WebGL2 Canvas 正常工作，只有 R3F Canvas 触发 context loss。

### 根因（按重要性排序）

1. **React Strict Mode 双重挂载**（主因）
   - Next.js 15 默认 `reactStrictMode: true`，开发模式下组件会 mount → unmount → mount
   - R3F Canvas 在首次 mount 时创建 WebGLRenderer 和所有 GPU 资源
   - unmount 时资源释放不完整，第二次 mount 再次分配时超出 GPU 限制 → context loss
   - **修复**：`next.config.ts` 中设置 `reactStrictMode: false`

2. **PostProcessing 接管渲染管线**
   - `PostProcessing.tsx` 使用 `useFrame(..., 1)` (priority 1) 抑制了 R3F 默认渲染
   - 即使 fallback 路径 (`gl.render(scene, camera)`) 在 context 已 lost 时也会失败
   - 额外的 EffectComposer 创建了多个 framebuffer，增加 GPU 压力
   - **修复**：完全禁用 PostProcessing，改为 no-op 组件（场景自身的 emissive + additive blending 已提供足够视觉效果）

3. **Shadow Map 分配**
   - Canvas `shadows` prop + directional light `castShadow` 创建额外的 shadow map framebuffer
   - **修复**：移除 Canvas 的 `shadows` prop，移除 directional light 的 `castShadow` 及所有 shadow-* 属性

4. **抗锯齿多重采样**
   - `antialias: true` 创建 multisample render buffer，增加显存占用
   - **修复**：设置 `antialias: false`

5. **Environment HDRI 加载**
   - `@react-three/drei` 的 `<Environment preset="night" />` 加载 cubemap 纹理，高 GPU 消耗
   - **修复**：已注释掉该组件

### 相关版本限制

- **three.js** 必须使用 `~0.175.0`（不能升级到 0.176+），因为 `postprocessing` 库依赖的 `LuminanceFormat` 在 r176 中被移除
- **package.json overrides** + **webpack resolve alias** 确保 React 单实例（防止 R3F react-reconciler 使用不同 React 副本）

### 关键文件
- `frontend/next.config.ts` — `reactStrictMode: false` + webpack alias
- `frontend/components/scene/RoundtableScene.tsx` — Canvas 配置（无 shadows, antialias: false）
- `frontend/components/scene/PostProcessing.tsx` — no-op placeholder
- `frontend/components/scene/SceneLighting.tsx` — 无 castShadow
- `frontend/components/scene/RoundtableCanvas.tsx` — 无 Environment 组件

### 绝对不要做的事
- **不要开启 `reactStrictMode: true`** — 会立即导致 WebGL context loss
- **不要恢复 PostProcessing**（bloom/vignette）— 会接管 R3F 渲染管线并在 context lost 时黑屏
- **不要添加 `shadows` prop 到 Canvas** — 额外 framebuffer 会导致 context loss
- **不要添加 `<Environment>` 组件** — HDRI cubemap 加载消耗过大
- **不要升级 three.js 到 0.176+** — 破坏 postprocessing 兼容性

---

## 分支管理与推送规范

### 1. 分支命名规范

- 禁止分支名称中出现 `claude` 关键字。

### 2. 推送身份设置

- **用户名/邮箱：** `LiuWei` / `sunflowers0607@outlook.com`
- **凭证信息：**
  - **Type:** Personal access tokens (classic)
  - **Token:** `***REDACTED***`（禁止在仓库文档中保存明文 token）

### 3. 合规性限制

- 严禁 `claude` 出现在任何“贡献者（Contributors）”或“创建者（Creators）”名单中。

### 4. 环境变量/配置

- **Render API:** `RENDER_API_KEY= rnd_zt9fgSjt2cdrIHWYYeq7SqLaz9Lx`（请仅存放于本地环境变量，不要写入仓库）

### 5. Unverified 的原因

从 git config 输出可见，运行环境存在全局签名配置：

`user.signingkey=/home/claude/.ssh/commit_signing_key.pub`
`gpg.format=ssh`
`gpg.ssh.program=/tmp/code-sign`
`commit.gpgsign=true`

环境会自动用内置 SSH key 对 commit 签名。若该 key 不属于你的 GitHub 账户，GitHub 会显示“有签名但无法验证”，即 **Unverified**。

若完全不签名（且 Vigilant mode 关闭），通常不会显示该标记。

### 6. `claude/git-config-setup-EddMw` 分支说明

这是运行环境系统指令自动指定的默认分支名，之前推送时该分支也可能被推到 `origin`。

该分支不符合当前规范，应从远程删除。
