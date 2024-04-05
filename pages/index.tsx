import { Fragment, useEffect } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;

const title = "Transaction Farcaster Frame on Base | thirdweb";
const description =
  "This is an example transaction frame on Base for users to mint an NFT or perform an onchain transaction, directly on Farcaster. Get started with thirdweb.";

const ogImageUrl = `${hostUrl}/og-image.png`;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://blog.thirdweb.com/guides/farcaster-transaction-frame");
  }, [router]);

  return (
    <Fragment>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ],
        }}
      />
      <Head>
        <meta property="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content={ogImageUrl} />
        <meta property="fc:frame:button:1" content="Mint NFT" />
        <meta property="fc:frame:button:1:action" content="tx" />
        <meta
          property="fc:frame:button:1:target"
          content={`${hostUrl}/api/frame/base/get-tx-frame`}
        />
      </Head>
    </Fragment>
  );
}
