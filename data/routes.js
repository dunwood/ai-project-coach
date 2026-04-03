// 7 条 AI 编程路线数据
// 每条路线包含：id, name, tag, summary, fitFor, requirement, difficulty, steps(3个)

var ROUTES = [
  {
    id: "deepseek-opencode",
    name: "DeepSeek + OpenCode",
    tag: "新手优先",
    summary: "适合想先在国内环境中跑通 AI 编程流程的新手",
    fitFor: "零基础、小白、先求成功体验的人",
    requirement: "需要能完成基础安装，并愿意跟着步骤配置一次工具",
    difficulty: "中等",
    steps: [
      {
        title: "准备 DeepSeek 账号与 API Key",
        content: "访问 chat.deepseek.com 注册账号。如需通过 OpenCode 接入，还需在 platform.deepseek.com 的「API Keys」页面创建一个 API Key，复制保存好。",
        successHint: "能在 chat.deepseek.com 正常登录，并在平台找到 API Key 页面，看到可复制的密钥即可。",
        troubleshootingHint: "如果注册需要手机验证，用国内手机号即可。API Key 在「控制台 → API Keys」页面获取，注意只显示一次，需立即复制保存。"
      },
      {
        title: "安装 Node.js",
        content: "访问 nodejs.org，点击「LTS」版本下载安装包。安装时勾选「Add to PATH」。安装完成后打开 PowerShell（Windows）或终端（Mac），输入：node -v，验证安装是否成功。",
        successHint: "命令行输入 node -v 后显示版本号（如 v20.x.x）说明安装成功。",
        troubleshootingHint: "Windows 用户安装后如果 node 命令不识别，关闭当前 PowerShell 窗口重新打开，或重启电脑再试。"
      },
      {
        title: "安装 OpenCode 并连接 DeepSeek",
        content: "打开 PowerShell/终端，输入：npm install -g opencode-ai，等待安装完成。然后进入你的项目文件夹，输入：opencode，按照提示选择 DeepSeek 作为模型提供商，填入刚才保存的 API Key。",
        successHint: "输入 opencode 后能进入交互界面，发送一条消息后收到 AI 回复，说明连接成功。",
        troubleshootingHint: "如果 API Key 错误提示，检查是否完整复制（开头结尾不要有空格）。如果网络超时，检查 DeepSeek API 服务状态。如果 npm 安装失败，Windows 用户尝试以管理员身份运行 PowerShell。"
      }
    ]
  },
  {
    id: "qwen-lingma",
    name: "通义千问 + 通义灵码",
    tag: "国内优先",
    summary: "国内生态友好，适合希望界面友好、上手路径清晰的人",
    fitFor: "更喜欢图形界面、中文说明的入门用户",
    requirement: "需要注册阿里云账号并完成实名认证",
    difficulty: "简单",
    steps: [
      {
        title: "注册阿里云账号并开通通义千问",
        content: "访问 aliyun.com 注册账号，按提示完成实名认证（需要身份证）。认证通过后，访问 tongyi.aliyun.com 开通通义千问服务，确认可以正常对话。",
        successHint: "能在通义千问（tongyi.aliyun.com）页面正常发消息并收到 AI 回复，说明账号可用。",
        troubleshootingHint: "实名认证通常几分钟内完成，个人用户选择「个人实名认证」，准备好身份证号码和手机号。"
      },
      {
        title: "安装 VS Code",
        content: "访问 code.visualstudio.com，点击下载对应系统版本（Windows/Mac）安装。VS Code 是免费的代码编辑器，是安装通义灵码插件的前提。",
        successHint: "能正常打开 VS Code 并看到欢迎界面，说明安装成功。",
        troubleshootingHint: "如果下载速度慢，可以搜索「VS Code 国内镜像下载」找到更快的下载源。如果已有 Cursor 或其他编辑器，也可尝试在其中安装通义灵码。"
      },
      {
        title: "安装通义灵码插件并登录",
        content: "打开 VS Code，点击左侧扩展图标（或按 Ctrl+Shift+X），搜索「通义灵码」，点击安装。安装后点击左侧通义灵码图标，使用阿里云账号扫码登录，即可开始使用。",
        successHint: "侧边栏出现通义灵码面板，能看到 AI 对话界面，发消息有回复，说明安装配置成功。",
        troubleshootingHint: "如果搜索不到插件，可以访问通义灵码官网（lingma.aliyun.com）下载 .vsix 文件，在 VS Code 中手动安装。"
      }
    ]
  },
  {
    id: "doubao-trae",
    name: "豆包 / 火山方舟 + TRAE",
    tag: "平台生态",
    summary: "适合想尝试国内路线，希望保留扩展空间的人",
    fitFor: "愿意比较不同方案、希望图形界面操作的用户",
    requirement: "需要完成账户注册与工具设置",
    difficulty: "中等",
    steps: [
      {
        title: "注册并登录 TRAE 账号",
        content: "访问 trae.ai，点击「下载」按钮前先注册账号（可用手机号或字节系账号）。记住登录用的账号和密码，后续安装 TRAE 后需要登录。",
        successHint: "能在 trae.ai 官网正常登录，看到下载按钮，说明账号创建成功。",
        troubleshootingHint: "如果扫码登录失败，尝试用手机号+验证码的方式注册新账号。"
      },
      {
        title: "下载并安装 TRAE",
        content: "在 trae.ai 页面点击下载对应系统版本（Windows/Mac）。TRAE 是一个完整的 AI 代码编辑器，内置 AI 对话功能，不需要额外安装编辑器。按提示完成安装后打开，用账号登录。",
        successHint: "能正常打开 TRAE 并用账号登录，看到主界面，说明安装成功。",
        troubleshootingHint: "Windows 安装时如有安全提示，选择「仍要运行」或「允许」。Mac 用户可能需要在「系统设置 → 隐私与安全性」中允许运行。"
      },
      {
        title: "配置豆包模型并测试",
        content: "打开 TRAE，进入设置（齿轮图标），在 AI 模型配置中选择豆包（Doubao）。然后打开你的项目文件夹（文件 → 打开文件夹），在 AI 对话面板中发一条测试消息，确认连接正常。",
        successHint: "在 TRAE 的 AI 对话框中发一条消息，收到豆包模型的回复，说明配置成功。",
        troubleshootingHint: "如果模型列表中找不到豆包选项，检查 TRAE 版本是否最新，或尝试重新登录账号。"
      }
    ]
  },
  {
    id: "qianfan-wenxin-kuaima",
    name: "百度千帆 / 文心 + 文心快码",
    tag: "官方路线",
    summary: "适合已在百度云生态，想走熟悉平台的人",
    fitFor: "偏向国内百度系产品的用户",
    requirement: "需要注册百度智能云账号并完成实名认证",
    difficulty: "中等",
    steps: [
      {
        title: "注册百度智能云账号并开通服务",
        content: "访问 cloud.baidu.com，注册百度智能云账号并完成实名认证。认证完成后，进入控制台，开通「文心千帆」或「文心一言」服务。",
        successHint: "能在百度智能云控制台正常登录，并找到文心相关服务的入口，说明账号可用。",
        troubleshootingHint: "个人实名认证一般几分钟内完成，准备好身份证信息。如审核较慢，等待当天内完成即可。"
      },
      {
        title: "安装 VS Code",
        content: "访问 code.visualstudio.com，下载 VS Code 安装。这是使用文心快码插件的前提。安装后打开 VS Code，确认可以正常运行。",
        successHint: "能正常打开 VS Code，看到欢迎界面，说明安装成功。",
        troubleshootingHint: "如果下载慢，搜索「VS Code 国内镜像」找到更快的下载地址。"
      },
      {
        title: "安装文心快码插件并登录",
        content: "打开 VS Code，在扩展市场（Ctrl+Shift+X）搜索「文心快码」或「Comate」，安装该插件。安装完成后点击左侧文心快码图标，使用百度账号登录即可开始使用。",
        successHint: "插件面板出现 AI 对话界面，能发送消息并收到文心模型回复，说明配置成功。",
        troubleshootingHint: "如果在扩展市场找不到，访问 comate.baidu.com 获取官方安装说明，或直接下载 .vsix 文件手动安装。"
      }
    ]
  },
  {
    id: "chatgpt-codex-cli",
    name: "ChatGPT + Codex CLI",
    tag: "能力优先",
    summary: "成熟强力，适合愿意配置国际路线的用户",
    fitFor: "接受英文界面，愿意学命令行，能访问国际网络的用户",
    requirement: "需要能访问国际网络，需要国际信用卡充值 API 余额",
    difficulty: "中高",
    steps: [
      {
        title: "准备 OpenAI 账号和 API Key",
        content: "访问 platform.openai.com，注册 OpenAI 开发者账号（需要能访问国际网络）。在「Billing」充值一些余额（最低 $5 起），然后在「API Keys」页面创建新的 API Key，复制保存好。",
        successHint: "能在 platform.openai.com 看到有效的 API Key，且账号有余额，说明账号可用。",
        troubleshootingHint: "需要国际信用卡充值，可以使用 Visa/Mastercard。如果无法注册，考虑通过其他方式获取 OpenAI 访问权限，或切换到其他路线。"
      },
      {
        title: "安装 Node.js",
        content: "访问 nodejs.org，下载 LTS 版本安装。安装时勾选「Add to PATH」。完成后打开终端，输入 node -v 验证安装。",
        successHint: "终端输入 node -v 显示版本号（如 v20.x.x），说明安装成功。",
        troubleshootingHint: "安装后如命令不识别，关闭终端重新打开，或重启电脑。"
      },
      {
        title: "安装 Codex CLI 并配置",
        content: "打开终端，输入：npm install -g @openai/codex。安装后配置 API Key：Mac/Linux 输入 export OPENAI_API_KEY=你的密钥；Windows 在「系统属性 → 环境变量」中新建 OPENAI_API_KEY 变量。然后进入项目文件夹，输入 codex 启动。",
        successHint: "输入 codex 后进入交互界面，发送消息能收到 AI 回复，说明配置成功。",
        troubleshootingHint: "如果 API 请求失败（401 错误），检查 API Key 是否正确且有余额。如果连接超时，检查网络是否能访问 OpenAI。"
      }
    ]
  },
  {
    id: "claude-claude-code",
    name: "Claude + Claude Code",
    tag: "工程体验强",
    summary: "适合重视代码质量和协作体验的人",
    fitFor: "愿意接受终端工作流、追求最强 AI 编程能力的用户",
    requirement: "需要 Claude Pro 订阅（$20/月），需要能访问国际网络",
    difficulty: "中高",
    steps: [
      {
        title: "订阅 Claude Pro 并准备账号",
        content: "访问 claude.ai，注册账号后升级到 Claude Pro（每月 $20，需要国际信用卡）。Claude Pro 包含 Claude Code 的使用权限，无需额外 API Key。",
        successHint: "在 claude.ai 能正常登录，账号页面显示 Pro 状态，说明订阅成功。",
        troubleshootingHint: "需要国际信用卡支付。如果支付失败，可以尝试使用 Depay 等虚拟信用卡工具，或通过其他合规方式订阅。"
      },
      {
        title: "安装 Node.js",
        content: "访问 nodejs.org，下载 LTS 版本（v18 或以上）安装。Claude Code 需要 Node.js 运行环境。安装后在终端输入 node -v 验证。",
        successHint: "终端输入 node -v 显示 v18 或以上版本号，说明安装正确。",
        troubleshootingHint: "如果已安装旧版本（v16 以下），建议先卸载再安装新版。Windows 用户可从「控制面板 → 卸载程序」中移除旧版 Node.js。"
      },
      {
        title: "安装 Claude Code 并登录",
        content: "打开 PowerShell（Windows，建议管理员运行）或终端（Mac），输入：npm install -g @anthropic-ai/claude-code，等待安装完成。然后进入你的项目文件夹，输入：claude，首次启动会打开浏览器让你授权登录 Claude 账号。",
        successHint: "终端出现 Claude Code 的交互界面（有 > 提示符），发送一条消息能收到 AI 回复，说明配置成功。",
        troubleshootingHint: "如果 npm 安装失败，Mac/Linux 用户在命令前加 sudo，Windows 用户以管理员身份运行 PowerShell。如果浏览器授权后仍无法连接，检查网络是否能访问 Anthropic 服务。"
      }
    ]
  },
  {
    id: "gemini-gemini-cli",
    name: "Gemini + Gemini CLI",
    tag: "国际路线",
    summary: "适合想体验 Google AI 路线的用户",
    fitFor: "愿意对比不同国际模型、能访问 Google 服务的用户",
    requirement: "需要 Google 账号，需要能访问 Google 服务（国际网络）",
    difficulty: "中高",
    steps: [
      {
        title: "准备 Google 账号并获取 API Key",
        content: "使用 Google 账号访问 aistudio.google.com（需要能访问 Google 服务），在「Get API Key」页面创建一个免费的 Gemini API Key（有一定免费额度）。复制 API Key 保存好。",
        successHint: "能在 Google AI Studio 看到已创建的 API Key，可以复制，说明准备完成。",
        troubleshootingHint: "如果 AI Studio 无法访问，检查网络设置，确认能正常访问 Google 服务。部分地区对 Google 服务有访问限制，需要使用合规的访问工具。"
      },
      {
        title: "安装 Node.js",
        content: "访问 nodejs.org，下载 LTS 版本安装。Gemini CLI 需要 Node.js 运行环境。安装后在终端输入 node -v 验证。",
        successHint: "终端输入 node -v 显示版本号，说明安装成功。",
        troubleshootingHint: "建议安装最新 LTS 版本（v20+）。安装后如命令不识别，重新打开终端窗口。"
      },
      {
        title: "安装 Gemini CLI 并配置 API Key",
        content: "打开终端，输入：npm install -g @google/gemini-cli，等待安装完成。然后配置 API Key：Mac/Linux 输入 export GEMINI_API_KEY=你的密钥；Windows 在系统环境变量中新建 GEMINI_API_KEY。进入项目文件夹，输入 gemini 启动。",
        successHint: "输入 gemini 后进入交互界面，发消息能收到 AI 回复，说明配置成功。",
        troubleshootingHint: "如果连接超时，检查网络是否能访问 Google 服务。免费额度有请求频率限制（RPM），遇到限速错误稍等片刻再试。如果 npm 安装失败，Mac/Linux 用户尝试加 sudo。"
      }
    ]
  }
];
