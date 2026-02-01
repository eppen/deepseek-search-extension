// 打开DeepSeek的函数
function openDeepSeek(text, action = 'search') {
  let prompt = text;
  
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
  
  // 关闭popup窗口
  window.close();
}

// 获取当前标签页选中的文本
async function getSelectedText() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        return window.getSelection().toString().trim();
      }
    });
    
    return results[0]?.result || '';
  } catch (error) {
    console.error('获取选中文本失败:', error);
    return '';
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
  const searchBtn = document.getElementById('searchBtn');
  const translateBtn = document.getElementById('translateBtn');
  const explainBtn = document.getElementById('explainBtn');
  const customSearchBtn = document.getElementById('customSearchBtn');
  const customText = document.getElementById('customText');
  
  // 获取当前选中的文本
  const selectedText = await getSelectedText();
  if (selectedText) {
    customText.value = selectedText;
    customText.placeholder = `已选中: ${selectedText.substring(0, 30)}${selectedText.length > 30 ? '...' : ''}`;
  }
  
  // 搜索按钮
  searchBtn.addEventListener('click', async () => {
    const text = await getSelectedText() || customText.value.trim();
    if (text) {
      openDeepSeek(text, 'search');
    } else {
      alert('请先选中文本或输入要搜索的内容');
    }
  });
  
  // 翻译按钮
  translateBtn.addEventListener('click', async () => {
    const text = await getSelectedText() || customText.value.trim();
    if (text) {
      openDeepSeek(text, 'translate');
    } else {
      alert('请先选中文本或输入要翻译的内容');
    }
  });
  
  // 解释按钮
  explainBtn.addEventListener('click', async () => {
    const text = await getSelectedText() || customText.value.trim();
    if (text) {
      openDeepSeek(text, 'explain');
    } else {
      alert('请先选中文本或输入要解释的内容');
    }
  });
  
  // 自定义搜索按钮
  customSearchBtn.addEventListener('click', () => {
    const text = customText.value.trim();
    if (text) {
      openDeepSeek(text, 'search');
    } else {
      alert('请输入要搜索的内容');
    }
  });
  
  // 回车键搜索
  customText.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      customSearchBtn.click();
    }
  });
});