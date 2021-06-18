import React from 'react';

import {
  FacebookShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,
  HatenaShareCount,
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,
  PocketShareButton,
  InstapaperShareButton,
  HatenaShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
  PocketIcon,
  InstapaperIcon,
  WeiboIcon,
  HatenaIcon,
} from 'react-share';

function Share() {
  const shareUrl = 'http://github.com';
  const title = 'GitHub';

  return (
    <div className="share-container">
      <div className="share-some-network">
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className="share-some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <div>
          <FacebookShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          >
            {count => count}
          </FacebookShareCount>
        </div>
      </div>

      <div className="share-some-network">
        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="share-some-network__share-button"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>

      <div className="share-some-network">
        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <div className="share-some-network__share-count">&nbsp;</div>
      </div>

      <div className="share-some-network">
        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <div className="share-some-network__share-count">&nbsp;</div>
      </div>

      <div className="share-some-network">
        <WhatsappShareButton
          url={shareUrl}
          title={title}
          separator=":: "
          className="share-some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        <div className="share-some-network__share-count">&nbsp;</div>
      </div>

      <div className="share-some-network">
        <LinkedinShareButton
          url={shareUrl}
          className="share-some-network__share-button"
        >
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>

      <div className="share-some-network">
        <PinterestShareButton
          url={String(window.location)}
          media={`${String(window.location)}/${exampleImage}`}
          className="share-some-network__share-button"
        >
          <PinterestIcon size={32} round />
        </PinterestShareButton>

        <div>
          <PinterestShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>

      <div className="share-some-network">
        <VKShareButton
          url={shareUrl}
          image={`${String(window.location)}/${exampleImage}`}
          className="share-some-network__share-button"
        >
          <VKIcon size={32} round />
        </VKShareButton>

        <div>
          <VKShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>

      <div className="share-some-network">
        <OKShareButton
          url={shareUrl}
          image={`${String(window.location)}/${exampleImage}`}
          className="share-some-network__share-button"
        >
          <OKIcon size={32} round />
        </OKShareButton>

        <div>
          <OKShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>

      <div className="share-some-network">
        <RedditShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="share-some-network__share-button"
        >
          <RedditIcon size={32} round />
        </RedditShareButton>

        <div>
          <RedditShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>

      <div className="share-some-network">
        <TumblrShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <TumblrIcon size={32} round />
        </TumblrShareButton>

        <div>
          <TumblrShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>

      <div className="share-some-network">
        <LivejournalShareButton
          url={shareUrl}
          title={title}
          description={shareUrl}
          className="share-some-network__share-button"
        >
          <LivejournalIcon size={32} round />
        </LivejournalShareButton>
      </div>

      <div className="share-some-network">
        <MailruShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <MailruIcon size={32} round />
        </MailruShareButton>
      </div>

      <div className="share-some-network">
        <EmailShareButton
          url={shareUrl}
          subject={title}
          body="body"
          className="share-some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
      <div className="share-some-network">
        <ViberShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <ViberIcon size={32} round />
        </ViberShareButton>
      </div>

      <div className="share-some-network">
        <WorkplaceShareButton
          url={shareUrl}
          quote={title}
          className="share-some-network__share-button"
        >
          <WorkplaceIcon size={32} round />
        </WorkplaceShareButton>
      </div>

      <div className="share-some-network">
        <LineShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <LineIcon size={32} round />
        </LineShareButton>
      </div>

      <div className="share-some-network">
        <WeiboShareButton
          url={shareUrl}
          title={title}
          image={`${String(window.location)}/${exampleImage}`}
          className="share-some-network__share-button"
        >
          <WeiboIcon size={32} round />
        </WeiboShareButton>
      </div>

      <div className="share-some-network">
        <PocketShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <PocketIcon size={32} round />
        </PocketShareButton>
      </div>

      <div className="share-some-network">
        <InstapaperShareButton
          url={shareUrl}
          title={title}
          className="share-some-network__share-button"
        >
          <InstapaperIcon size={32} round />
        </InstapaperShareButton>
      </div>

      <div className="share-some-network">
        <HatenaShareButton
          url={shareUrl}
          title={title}
          windowWidth={660}
          windowHeight={460}
          className="share-some-network__share-button"
        >
          <HatenaIcon size={32} round />
        </HatenaShareButton>

        <div>
          <HatenaShareCount
            url={shareUrl}
            className="share-some-network__share-count"
          />
        </div>
      </div>
    </div>
  );
}

export default Share;
