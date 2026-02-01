// 打开DeepSeek的函数
function openDeepSeek(text, action = 'search') {
  let prompt = text;
  
  // 根据操作类型添加不同的提示词
  switch(action) {
    case 'translate':
      prompt = `请翻译以下内容：${text}`;
      break;
    case 'explain':
      prompt = `请解释以下内容：${text}`;
      break;
    case 'code':
      prompt = `请解释以下代码：${text}`;
      break;
    case 'improve':
      prompt = `请改进以下文本：${text}`;
      break;
    default:
      prompt = text;
  }
  
  const deepSeekUrl = 'https://chat.deepseek.com/';
  
  // 创建新标签页
  chrome.tabs.create({
    url: deepSeekUrl,
    active: true
  }, (tab) => {
    // 等待页面加载后发送消息填充输入框
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        
        // 延迟一下确保页面完全加载
        setTimeout(() => {
          chrome.tabs.sendMessage(tab.id, {
            action: 'fillInput',
            text: prompt
          }).catch(() => {
            // 如果发送失败，可能是content script还没加载，再试一次
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'fillInput',
                text: prompt
              }).catch(() => {
                console.log('无法自动填充，请手动输入');
              });
            }, 1000);
          });
        }, 500);
      }
    });
  });
}

// 创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 创建主菜单项
  chrome.contextMenus.create({
    id: 'deepseekMain',
    title: 'DeepSeek: "%s"',
    contexts: ['selection']
  });
  
  // 创建子菜单项
  chrome.contextMenus.create({
    id: 'deepseekSearch',
    parentId: 'deepseekMain',
    title: '🔍 搜索',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'deepseekTranslate',
    parentId: 'deepseekMain',
    title: '🌐 翻译',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'deepseekExplain',
    parentId: 'deepseekMain',
    title: '💡 解释',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'deepseekCode',
    parentId: 'deepseekMain',
    title: '💻 解释代码',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'deepseekImprove',
    parentId: 'deepseekMain',
    title: '✨ 改进文本',
    contexts: ['selection']
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText) return;
  
  const selectedText = info.selectionText.trim();
  if (!selectedText) return;
  
  // 根据菜单ID执行不同操作
  switch(info.menuItemId) {
    case 'deepseekSearch':
      openDeepSeek(selectedText, 'search');
      break;
    case 'deepseekTranslate':
      openDeepSeek(selectedText, 'translate');
      break;
    case 'deepseekExplain':
      openDeepSeek(selectedText, 'explain');
      break;
    case 'deepseekCode':
      openDeepSeek(selectedText, 'code');
      break;
    case 'deepseekImprove':
      openDeepSeek(selectedText, 'improve');
      break;
  }
});

// 监听快捷键命令
chrome.commands.onCommand.addListener((command) => {
  if (command === 'search-selected') {
    // 获取当前活动标签页
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        // 注入脚本获取选中的文本
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: () => {
            return window.getSelection().toString().trim();
          }
        }, (results) => {
          if (results && results[0] && results[0].result) {
            const selectedText = results[0].result;
            if (selectedText) {
              openDeepSeek(selectedText, 'search');
            }
          }
        });
      }
    });
  }
});