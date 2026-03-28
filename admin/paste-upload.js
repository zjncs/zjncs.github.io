(() => {
  const EDITOR_SELECTOR = '[data-slate-editor="true"], textarea';
  const TOAST_ID = 'paste-upload-toast';
  const HELPER_CLASS = 'paste-upload-helper';
  const SELECTED_IMAGE_CLASS = 'decap-editor-image-selected';

  const extByType = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg'
  };

  const normalizeErrorMessage = message => {
    const text = String(message || '').trim();

    if (!text) return '图片上传失败';
    if (/TYPORAPIC_TOKEN/i.test(text)) {
      return '图床还没有完成密钥配置，请先在 Netlify 环境变量里添加 TYPORAPIC_TOKEN。';
    }
    if (/Unauthorized/i.test(text)) {
      return '登录状态已失效，请刷新后台后重新登录。';
    }
    if (/GitHub upload failed/i.test(text)) {
      return '图床上传失败，请检查 TyporaPic 仓库权限和 Token 配置。';
    }

    return text;
  };

  const showToast = (message, type = 'info', sticky = false) => {
    let toast = document.getElementById(TOAST_ID);

    if (!toast) {
      toast = document.createElement('div');
      toast.id = TOAST_ID;
      toast.className = 'paste-upload-toast';
      document.body.appendChild(toast);
    }

    toast.dataset.type = type;
    toast.textContent = message;

    if (!sticky) {
      window.clearTimeout(showToast.timer);
      showToast.timer = window.setTimeout(() => {
        toast.remove();
      }, type === 'success' ? 2600 : 3400);
    }
  };

  const toDataUrl = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('无法读取剪贴板图片'));
    reader.readAsDataURL(file);
  });

  const safeName = (name, fallbackExt) => {
    const base = (name || `paste-${Date.now()}.${fallbackExt}`)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9._-]/g, '');

    return base || `paste-${Date.now()}.${fallbackExt}`;
  };

  const formatBytes = size => {
    if (!Number.isFinite(size) || size <= 0) return '0 B';
    const units = ['B', 'KB', 'MB'];
    let value = size;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }

    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  };

  const isEditableTarget = target => {
    if (!(target instanceof Element)) return null;
    return target.closest(EDITOR_SELECTOR);
  };

  const insertTextIntoTextarea = (textarea, text) => {
    const start = textarea.selectionStart ?? textarea.value.length;
    const end = textarea.selectionEnd ?? textarea.value.length;
    textarea.setRangeText(text, start, end, 'end');
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.focus();
    return true;
  };

  const insertIntoContentEditable = (editable, url) => {
    const markdown = `\n\n![](${url})\n\n`;

    if (document.queryCommandSupported && document.queryCommandSupported('insertImage')) {
      try {
        if (document.execCommand('insertImage', false, url)) {
          editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromPaste' }));
          editable.focus();
          return true;
        }
      } catch (error) {
        console.warn('insertImage failed', error);
      }
    }

    if (document.queryCommandSupported && document.queryCommandSupported('insertText')) {
      try {
        if (document.execCommand('insertText', false, markdown)) {
          editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: markdown }));
          editable.focus();
          return true;
        }
      } catch (error) {
        console.warn('insertText failed', error);
      }
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const node = document.createTextNode(markdown);
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editable.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: markdown }));
    editable.focus();
    return true;
  };

  const insertUploadedImage = (editor, url) => {
    if (editor instanceof HTMLTextAreaElement || editor instanceof HTMLInputElement) {
      return insertTextIntoTextarea(editor, `\n\n![](${url})\n\n`);
    }

    if (editor instanceof HTMLElement) {
      return insertIntoContentEditable(editor, url);
    }

    return false;
  };

  const stopNativeHandling = event => {
    event.preventDefault();
    event.stopPropagation();

    if (typeof event.stopImmediatePropagation === 'function') {
      event.stopImmediatePropagation();
    }
  };

  const isRichTextEditor = editor =>
    editor instanceof HTMLElement &&
    editor.matches('[data-slate-editor="true"]');

  const dispatchEditorInput = (editor, inputType, data = '') => {
    if (!(editor instanceof HTMLElement)) return;

    try {
      editor.dispatchEvent(new InputEvent('input', { bubbles: true, inputType, data }));
    } catch (error) {
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    editor.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const clearSelectedEditorImages = scope => {
    const root = scope instanceof Element ? scope : document;
    root.querySelectorAll(`img.${SELECTED_IMAGE_CLASS}`).forEach(image => {
      image.classList.remove(SELECTED_IMAGE_CLASS);
    });
  };

  const placeCaretNearNode = (editor, node, preferAfter = true) => {
    if (!(editor instanceof HTMLElement)) return;

    const selection = window.getSelection();
    if (!selection) return;

    const range = document.createRange();

    if (node instanceof Text) {
      const offset = preferAfter ? node.textContent.length : 0;
      range.setStart(node, offset);
      range.collapse(true);
    } else if (node instanceof Element && node !== editor) {
      if (preferAfter) {
        range.setStartAfter(node);
      } else {
        range.setStartBefore(node);
      }
      range.collapse(true);
    } else {
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    selection.removeAllRanges();
    selection.addRange(range);
    editor.focus();
  };

  const selectEditorImage = image => {
    const editor = image?.closest?.('[data-slate-editor="true"]');
    if (!(editor instanceof HTMLElement) || !(image instanceof HTMLImageElement)) return false;

    clearSelectedEditorImages(editor);
    image.classList.add(SELECTED_IMAGE_CLASS);
    image.setAttribute('tabindex', '-1');
    placeCaretNearNode(editor, image, true);
    return true;
  };

  const removeSelectedEditorImage = (editor, direction = 'backward') => {
    if (!(editor instanceof HTMLElement)) return false;

    const image = editor.querySelector(`img.${SELECTED_IMAGE_CLASS}`);
    if (!(image instanceof HTMLImageElement)) return false;

    const focusNode = direction === 'forward'
      ? image.nextSibling || image.previousSibling || editor
      : image.previousSibling || image.nextSibling || editor;

    image.remove();
    clearSelectedEditorImages(editor);
    placeCaretNearNode(editor, focusNode, direction !== 'forward');
    dispatchEditorInput(editor, direction === 'forward' ? 'deleteContentForward' : 'deleteContentBackward');
    return true;
  };

  const decorateEditorImages = scope => {
    const root = scope instanceof Element ? scope : document;
    root.querySelectorAll('[data-slate-editor="true"] img').forEach(image => {
      image.classList.add('decap-editor-inline-image');
      image.setAttribute('draggable', 'false');
    });
  };

  const getIdentityToken = async () => {
    if (!window.netlifyIdentity) throw new Error('Netlify Identity 未就绪');
    const user = window.netlifyIdentity.currentUser();
    if (!user) throw new Error('请先登录后台，再粘贴图片');
    return user.jwt();
  };

  const uploadImage = async file => {
    const jwt = await getIdentityToken();
    const contentType = file.type || 'image/png';
    const ext = extByType[contentType] || 'png';
    const payload = {
      imageBase64: await toDataUrl(file),
      contentType,
      originalName: safeName(file.name, ext)
    };

    const response = await fetch('/.netlify/functions/upload-typorapic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(normalizeErrorMessage(result.error || '图片上传失败'));
    }

    return result;
  };

  const inlineImage = async (editor, file) => {
    const dataUrl = await toDataUrl(file);
    const inserted = insertUploadedImage(editor, dataUrl);

    if (!inserted) {
      throw new Error('图片已转为内联数据，但没有插入成功，请手动重试。');
    }

    return {
      ok: true,
      mode: 'inline',
      url: dataUrl
    };
  };

  const handleImageFiles = async (editor, files) => {
    const image = files.find(file => file && file.type && file.type.startsWith('image/'));
    if (!image) return;

    showToast('正在上传图片到 TyporaPic...', 'info', true);

    try {
      const result = await uploadImage(image);
      const inserted = insertUploadedImage(editor, result.url);

      if (!inserted) {
        showToast('图片已上传，但没有插入成功，请手动粘贴链接', 'error', true);
        return;
      }

      showToast('图片已上传并插入正文', 'success');
    } catch (error) {
      const size = image.size || 0;

      if (size > 5 * 1024 * 1024) {
        showToast(`${normalizeErrorMessage(error.message)} 当前图片 ${formatBytes(size)}，不适合转成内联图片。请压缩后重试。`, 'error', true);
        return;
      }

      showToast('图床不可用，正在改为内联图片插入正文...', 'info', true);

      try {
        await inlineImage(editor, image);
        showToast(`图床不可用，已以内联图片写入正文 (${formatBytes(size)})`, 'success', true);
      } catch (fallbackError) {
        showToast(normalizeErrorMessage(fallbackError.message || error.message), 'error', true);
      }
    }
  };

  const bindPasteUpload = () => {
    if (document.body.dataset.pasteUploadBound === 'true') return;
    document.body.dataset.pasteUploadBound = 'true';

    document.addEventListener('paste', event => {
      const editor = isEditableTarget(event.target);
      if (!editor) return;

      const items = Array.from(event.clipboardData?.items || []);
      const imageItem = items.find(item => item.type && item.type.startsWith('image/'));

      if (!imageItem) return;

      const file = imageItem.getAsFile();
      if (!file) return;

      stopNativeHandling(event);

      if (isRichTextEditor(editor)) {
        showToast('检测到 Rich Text 模式，已接管图片粘贴并改为直传 TyporaPic。', 'info');
      }

      void handleImageFiles(editor, [file]);
    }, true);

    document.addEventListener('dragover', event => {
      const editor = isEditableTarget(event.target);
      if (!editor) return;

      const hasImage = Array.from(event.dataTransfer?.items || []).some(
        item => item.kind === 'file' && item.type.startsWith('image/')
      );

      if (!hasImage) return;

      stopNativeHandling(event);
      editor.classList.add('paste-upload-dropzone');
    }, true);

    document.addEventListener('dragleave', event => {
      const editor = isEditableTarget(event.target);
      if (editor) editor.classList.remove('paste-upload-dropzone');
    }, true);

    document.addEventListener('drop', event => {
      const editor = isEditableTarget(event.target);
      if (!editor) return;

      const files = Array.from(event.dataTransfer?.files || []).filter(
        file => file.type && file.type.startsWith('image/')
      );

      editor.classList.remove('paste-upload-dropzone');
      if (!files.length) return;

      stopNativeHandling(event);

      if (isRichTextEditor(editor)) {
        showToast('检测到 Rich Text 模式，已接管图片拖拽并改为直传 TyporaPic。', 'info');
      }

      void handleImageFiles(editor, files);
    }, true);

    document.addEventListener('click', event => {
      const image = event.target instanceof Element
        ? event.target.closest('[data-slate-editor="true"] img')
        : null;

      if (image instanceof HTMLImageElement) {
        stopNativeHandling(event);
        selectEditorImage(image);
        showToast('已选中图片，按 Delete 或 Backspace 删除。', 'info');
        return;
      }

      if (!(event.target instanceof Element)) return;
      const editor = event.target.closest('[data-slate-editor="true"]');
      clearSelectedEditorImages(editor || document);
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;

      const active = document.activeElement instanceof Element ? document.activeElement : null;
      const editor = isEditableTarget(event.target) || active?.closest?.('[data-slate-editor="true"]');
      if (!(editor instanceof HTMLElement) || !isRichTextEditor(editor)) return;

      const removed = removeSelectedEditorImage(editor, event.key === 'Delete' ? 'forward' : 'backward');
      if (!removed) return;

      stopNativeHandling(event);
    }, true);
  };

  const decorateEditors = () => {
    document.body.classList.add('decap-enhanced');
    decorateEditorImages();

    document.querySelectorAll(EDITOR_SELECTOR).forEach(editor => {
      const host = editor.closest('div');
      if (!host || host.querySelector(`.${HELPER_CLASS}`)) return;

      const rect = editor.getBoundingClientRect();
      if (rect.height < 160) return;

      const helper = document.createElement('div');
      helper.className = HELPER_CLASS;
      helper.innerHTML = '<strong>截图直传已启用</strong>：直接粘贴或拖拽图片会优先上传到 <code>zjncs/TyporaPic</code>；失败时自动转内联图片。富文本模式下可单击图片后按 <code>Delete</code>/<code>Backspace</code> 删除。';

      host.insertBefore(helper, editor);
    });
  };

  const boot = () => {
    bindPasteUpload();
    decorateEditors();

    const observer = new MutationObserver(() => {
      decorateEditors();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
