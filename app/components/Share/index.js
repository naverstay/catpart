import React from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import Ripples from 'react-ripples';

function Share({ setOpenFunc }) {
  const shareRef = useDetectClickOutside({
    onTriggered: () => {
      setOpenFunc(false);
    },
  });

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
      let msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
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
        console.log('Async: Copying to clipboard was successful!');
      },
      function(err) {
        console.error('Async: Could not copy text: ', err);
      },
    );
  };

  let links = [
    {
      href: '#',
      name: 'вацап',
    },
    {
      href: '#',
      name: 'вацап бизнес',
    },
    {
      href: '#',
      name: 'телеграм',
    },
    {
      href: '#',
      name: 'вконтакте',
    },
    {
      href: '#',
      name: 'почта',
    },
    {
      action: 'copy',
      href: '#',
      name: 'копировать ссылку',
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
                <a className={'dropdown-link-inner'} href={l.href}>
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
