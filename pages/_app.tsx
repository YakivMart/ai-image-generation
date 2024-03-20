import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { connectorsForWallets, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import '@rainbow-me/rainbowkit/styles.css';
import { configureChains, createClient, goerli, mainnet, WagmiConfig } from 'wagmi';
import {
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  fantomTestnet,
  polygon,
  polygonMumbai,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import sal from 'sal.js'
import './../node_modules/sal.js/dist/sal.css'
import Head from 'next/head'

import '../public/css/bootstrap.min.css'
import '../public/css/remixicon.css'
import '../public/css/styles.css'
import Layout from '../components/_App/Layout';

const { chains, provider, webSocketProvider } = configureChains(
  [
    ...(process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? [
      // mainnet,
      bsc,
      // polygon,
      // avalanche,
    ] : [
      // goerli,
      bscTestnet,
      //polygonMumbai,
      // avalancheFuji,
    ])
  ],
  [
  publicProvider()]
);

// const { connectors } = getDefaultWallets({
//   appName: 'RainbowKit demo',
//   chains,
// });

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ /*projectId,*/ chains }),
      walletConnectWallet({ /*projectId,*/ chains }),
      metaMaskWallet({ chains }),
      trustWallet({ chains }),
    ],
  },
]);
//console.log(provider)
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sal({ threshold: 0.1, once: true } as any)
  }, [router.asPath])

  useEffect(() => {
    sal()
    setReady(true);
  }, [])

  return (
    <>
      <Head>
        <link rel="shortcut icon" href="images/logo.png" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter&family=Nunito&display=swap');
        </style>

        <title>CSDOGE | Image </title>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CSDOGE Image Generation Website" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:image:url" content="/images/logo.png" />
        <meta property="og:image:alt" content="Visit CSDOGE Website" />
        <meta property="og:title" content="CSDOGE Website" />
        <meta property="og:description" content="Integrate AI to The Blockchain. Integrating and synchronizing OpenAI, GPT3, GPT4, Bing, text to AI imaging generation engine on OpenAI Low cost API and website where CSDOGE token owners able to generate AI Images for free and mint them as high quality NFT as an exclusive owners. CSDOGE image generation Dapp developed by Nikolay Zohyi" />

      </Head>
      {
        ready ? (
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider chains={chains}>
              <ChakraProvider>
                <Layout>
                  <Component {...pageProps} />
                  <ToastContainer position="top-center" />
                </Layout>
              </ChakraProvider>
            </RainbowKitProvider>
          </WagmiConfig>
        ) : null
      }
    </>
  )
}

export default MyApp
