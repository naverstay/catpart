import React from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import Ripples from 'react-ripples';

function Share({ setOpenFunc, notificationFunc, shareUrl, shareText }) {
  const shareRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenFunc(false);
    },
  });

  let successCopy = text => {
    notificationFunc('success', `URL страницы скопирован в буфер обмена`, text);
  };

  let failCopy = () => {
    notificationFunc('success', `Ошибка копирования в буфер обмена`, ':(');
  };

  let fallbackCopyTextToClipboard = text => {
    let textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      let successful = document.execCommand('copy');

      if (successful) {
        successCopy(text);
      } else {
        failCopy();
      }
    } catch (err) {
      failCopy();
    }

    document.body.removeChild(textArea);
  };

  let dropdownAction = action => {
    if (action === 'copy') {
      copyTextToClipboard(window.location.href);
    }

    setOpenFunc(false);
  };

  let copyTextToClipboard = text => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function() {
        successCopy(text);
      },
      function(err) {
        failCopy();
      },
    );
  };

  let links = [
    {
      href: 'whatsapp://send?text=' + shareText + '%20' + shareUrl,
      name: 'WhatsApp',
    },
    {
      href: 'whatsapp://send?text=' + shareText + '%20' + shareUrl,
      name: 'WhatsApp Business',
    },
    {
      href: 'https://telegram.me/share/url?text=' + shareText + '&amp;url=' + shareUrl,
      name: 'Telegram',
    },
    {
      href: 'http://vk.com/share.php?title=' + shareText + '&amp;url=' + shareUrl,
      name: 'Вконтакте',
    },
    {
      href: 'mailto:?subject=' + shareText + '&amp;body=' + shareUrl,
      name: 'Email',
    },
    {
      action: 'copy',
      name: 'Копировать ссылку',
    },
  ];

  return (
    <div ref={shareRef} className="dropdown-container">
      <ul className="dropdown-list">
        {links.map((l, li) => (
          <li key={li}>
            {l.action ? (
              <Ripples
                onClick={() => {
                  dropdownAction(l.action);
                }}
                className="dropdown-link"
                during={1000}
              >
                {l.name}
              </Ripples>
            ) : (
              <Ripples className="dropdown-link" during={1000}>
                <a target={'_blank'} className={'dropdown-link-inner'} href={l.href}>
                  {l.name}
                </a>
              </Ripples>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Share;
