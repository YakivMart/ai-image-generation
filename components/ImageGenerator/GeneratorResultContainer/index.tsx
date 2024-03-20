'use client';
import {
  Flex,
  Image,
  Button,
  AspectRatio,
  Input,
  Box,
} from '@chakra-ui/react';
import { GeneratorPresetTextData, GeneratorStyleData } from "../../../utils/constants";
import { useDappContext } from '../../../utils/Context'
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { sleep } from '../../../utils/interface';
import { mintAddressess, bscTestnetChainId, bscMainnetChainId} from '../../../utils/config';
import mintContractAbi from '../../../assets/abis/mintContract-abi.json'
import { useRouter } from 'next/router';

const GeneratorResultContainer = () => {
  const {
    styleId, setStyleId,
    shapeId, setShapeId,
    styleText, setStyleText,
    prediction,
  } = useDappContext();
  const { chain } = useNetwork();
  const router = useRouter();
  const chainId = chain?.id ?? (process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId);

  const imageDownload = async (url: any) => {
    //@ts-ignore*
    const imageSrc = url;
    let params = { imageSrc: imageSrc };
    fetch('/api/image_fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
      .then(response => response.blob())
      .then(imageBlob => {
        const imageUrl = URL.createObjectURL(imageBlob);
        const element = document.createElement("a");
        element.href = imageUrl;
        element.download = "CSDOGE_Image";
        element.click();
      })
      .catch(error => {
        console.error(error);
      });

  }

  const mintNFT = async () => {
    window.open('https://nftartland.xyz/mint', '_blank');
  }

  return (
    <Flex
      direction={['column', 'column' , 'row', 'row', 'row']}
        alignItems='center'
      width={['100%', '100%', '85%', '100%', '100%']}
    >
      <Flex
        direction='column'
        alignItems='center'
        width={['100%', '100%', '85%', '100%', '100%']}

        padding={['10px', '10px', '10px', '10px', '15px']}
      >
        

        <Flex
          direction='column'
          alignItems='center'
          width={['100%', '100%', '100%', '100%', '50%']}
          // height={['100%', '100%', '100%', '100%', '100%']}
          marginTop={'30px'}
          border={'1.5px solid #A0AEC0'}
          borderRadius={'12px'}
          padding={'10px'}
        >
          <AspectRatio
            // width={getResultImageSize(shapeId).width}
            // ratio={getResultImageSize(shapeId).ratio}
            width={'100%'}
            ratio={1}

          >
            {
              //@ts-ignore*
              (prediction.status === "processing" || prediction.status === "starting") ?
                (

                  <Flex
                  >
                    <Flex
                      fontSize={'24px'}
                      textAlign={'left'}
                      background={'rgb(5, 0, 35)'}
                      animation={'blinking 1s linear infinite'}
                      letterSpacing={'0.1em'}
                      fontWeight={'700'}
                      backgroundClip={'text'}
                      color={'transparent'}
                    >
                      Generating...
                    </Flex>
                  </Flex>
                ) :
                (<Image
                  borderRadius={'10px'}
                  //@ts-ignore*
                  src={prediction && prediction.output ? prediction.output[0] : GeneratorStyleData[styleId].src} />)
            }
          </AspectRatio>
        </Flex>
        <Flex
          direction='column'
          alignItems={'center'}
          mt={'20px'}
        >
          {/*@ts-ignore*/}
          {prediction && prediction.output ? (
            <Flex gap={2}>
              <button
                className={'default-btn'}
                onClick={()=>imageDownload(prediction.output![0])}
              >
                Download
              </button>
              <button
                className={'default-btn'}
                onClick={()=>mintNFT()}
              >
                Mint
              </button>
            </Flex>
          ) :
            (<></>)
          }
        </Flex>
      </Flex>
    </Flex>
  )
}

export default GeneratorResultContainer;