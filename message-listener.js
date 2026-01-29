// ==UserScript==
// @name         ai-chat-compare
// @namespace    http://tampermonkey.net/
// @version      2026-01-23
// @description  add message listener to page
// @author       wzshuang
// @match        https://chat.deepseek.com/*
// @match        https://aistudio.xiaomimimo.com/*
// @match        https://chat.qwen.ai/*
// @match        https://chat.z.ai/*
// @match        https://www.doubao.com/chat/*
// @match        https://chatgpt.com/*
// @match        https://yiyan.baidu.com/*
// @match        https://aistudio.google.com/prompts/new_chat/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const listenerScript = `
        (function() {
            const siteConfig = {
                'chat.deepseek.com': {
                    textareaFindFn: () => {
                        const textareaList = document.querySelectorAll('textarea');
                        return textareaList[textareaList.length - 1];
                    },
                    submitButtonFindFn: () => {
                        const buttonList = document.querySelectorAll("[role='button']");
                        return buttonList[buttonList.length - 1];
                    },
                    newChatFindFn: () => {
                        return Array.from(document.querySelectorAll('span')).find(span => span.textContent.trim() === '开启新对话')
                    }
                },
                'aistudio.xiaomimimo.com': {
                    textareaFindFn: () => {
                        const textareaList = document.querySelectorAll('textarea');
                        return textareaList[textareaList.length - 1];
                    },
                    submitButtonFindFn: () => {
                        const buttonList = document.querySelectorAll("button");
                        return buttonList[buttonList.length - 1];
                    },
                    newChatFindFn: () => {
                        return document.querySelector('button[aria-label="开始新对话"]');
                    }
                },
                'chat.qwen.ai': {
                    textareaFindFn: () => {
                        const textareaList = document.querySelectorAll('textarea');
                        return textareaList[textareaList.length - 1];
                    },
                    submitButtonFindFn: () => {
                        const buttonList = document.querySelectorAll("button");
                        return buttonList[buttonList.length - 1];
                    },
                    newChatFindFn: () => {
                        return document.querySelector('.sidebar-entry-list-content');
                    }
                },
                'chat.z.ai': {
                    textareaFindFn: () => {
                        const textareaList = document.querySelectorAll('textarea');
                        return textareaList[textareaList.length - 1];
                    },
                    submitButtonFindFn: () => {
                        const buttonList = document.querySelectorAll("button");
                        return buttonList[buttonList.length - 1];
                    },
                    newChatFindFn: () => {
                        return document.querySelector('#new-chat-button');
                    }
                },
                'www.doubao.com': {
                    textareaFindFn: () => {
                        const textareaList = document.querySelectorAll('textarea');
                        return textareaList[0];
                    },
                    submitButtonFindFn: () => {
                        return document.querySelector("#flow-end-msg-send");
                    },
                    newChatFindFn: () => {
                        return document.querySelector('[data-testid="create_conversation_button"');
                    }
                }
            };

            const config = siteConfig[window.location.hostname];
            if (!config) {
                console.error('[Tampermonkey] 不支持的站点:', window.location.hostname);
                return;
            }

            const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;

            function clickElement(element, elementName) {
                if (!element) {
                    console.error('[Tampermonkey] 未找到 ' + elementName + ' 元素');
                    return false;
                }
                element.click();
                return true;
            }

            function setTextareaValue(textarea, value) {
                if (!textarea) {
                    console.error('[Tampermonkey] 未找到 textarea 元素');
                    return false;
                }
                try {
                    valueSetter.call(textarea, value);
                    ['input', 'change'].forEach(e => textarea.dispatchEvent(new Event(e, { bubbles: true, cancelable: true })));
                    return true;
                } catch (err) {
                    console.error('[Tampermonkey] 设置值失败:', err);
                    return false;
                }
            }

            window.addEventListener('message', function(event) {
                if (event.data.type === 'SET_TEXT') {
                    if (setTextareaValue(config.textareaFindFn(), event.data.value)) {
                        setTimeout(() => clickElement(config.submitButtonFindFn()), 100);
                    }
                }
                if (event.data.type === 'NEW_CHAT') {
                    clickElement(config.newChatFindFn());
                }
            });
        })();
    `;

    const script = document.createElement('script');
    script.textContent = listenerScript;
    document.documentElement.appendChild(script);
    script.remove();

})();