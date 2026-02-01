// Content script for DeepSeek page
// 监听来自background的消息，自动填充输入框

(function() {
  let pendingText = null;
  
  // 查找并填充输入框的函数
  function fillInput(text) {
    // 尝试多种可能的输入框选择器（按优先级排序）
    const selectors = [
      // DeepSeek特定的选择器
      'textarea[placeholder*="输入"]',
      'textarea[placeholder*="输入消息"]',
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="Message"]',
      // 通用选择器
      'textarea[autocomplete="off"]',
      'textarea:not([disabled]):not([readonly])',
      '[contenteditable="true"][role="textbox"]',
      '[contenteditable="true"]',
      'textarea',
      '[role="textbox"]',
      'input[type="text"]'
    ];
    
    let inputElement = null;
    
    // 查找输入框
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        // 检查元素是否可见且可编辑
        const style = window.getComputedStyle(el);
        if (el.offsetParent !== null && 
            el.offsetWidth > 0 && 
            el.offsetHeight > 0 &&
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            !el.disabled &&
            !el.readOnly) {
          inputElement = el;
          break;
        }
      }
      if (inputElement) break;
    }
    
    if (inputElement) {
      try {
        // 聚焦输入框
        inputElement.focus();
        inputElement.click();
        
        // 设置值
        if (inputElement.tagName === 'TEXTAREA' || inputElement.tagName === 'INPUT') {
          // 清空现有内容
          inputElement.value = '';
          inputElement.value = text;
          
          // 触发各种事件以确保React/Vue等框架能检测到变化
          const events = ['input', 'change', 'keyup', 'keydown'];
          events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true, cancelable: true });
            inputElement.dispatchEvent(event);
          });
          
          // 对于React，可能需要设置内部值
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            'value'
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(inputElement, text);
            const reactEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(reactEvent);
          }
        } else if (inputElement.contentEditable === 'true') {
          inputElement.textContent = text;
          inputElement.innerText = text;
          
          // 触发input事件
          const event = new Event('input', { bubbles: true });
          inputElement.dispatchEvent(event);
        }
        
        return { success: true, message: '文本已填充到输入框' };
      } catch (error) {
        console.error('填充输入框时出错:', error);
        return { success: false, message: '填充失败: ' + error.message };
      }
    } else {
      // 如果找不到输入框，使用剪贴板作为备用方案
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          console.log('文本已复制到剪贴板');
        }).catch(() => {
          console.log('无法复制到剪贴板');
        });
        return { success: true, message: '文本已复制到剪贴板，请手动粘贴（Ctrl+V）' };
      }
      return { success: false, message: '无法找到输入框' };
    }
  }
  
  // 监听来自background的消息
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillInput' && request.text) {
      pendingText = request.text;
      
      // 尝试立即填充
      let result = fillInput(request.text);
      
      // 如果失败，等待一段时间后重试（DeepSeek可能是SPA，需要时间加载）
      if (!result.success) {
        let retries = 0;
        const maxRetries = 10;
        
        const retryInterval = setInterval(() => {
          retries++;
          result = fillInput(request.text);
          
          if (result.success || retries >= maxRetries) {
            clearInterval(retryInterval);
            sendResponse(result);
          }
        }, 500);
      } else {
        sendResponse(result);
      }
      
      return true; // 保持消息通道开放以支持异步响应
    }
  });
  
  // 页面加载完成后，如果有待填充的文本，尝试填充
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (pendingText) {
        setTimeout(() => fillInput(pendingText), 1000);
      }
    });
  } else {
    if (pendingText) {
      setTimeout(() => fillInput(pendingText), 1000);
    }
  }
  
  // 监听DOM变化，如果输入框是动态添加的
  const observer = new MutationObserver(() => {
    if (pendingText) {
      const result = fillInput(pendingText);
      if (result.success) {
        pendingText = null;
      }
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();