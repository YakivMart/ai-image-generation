import {
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  RadioGroup,
  Radio,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { useCallback, useState, useEffect } from 'react'
import { useAccount, useNetwork, useSigner } from 'wagmi';
import axios from 'axios';
import { now } from 'moment';
import { toast } from 'react-toastify';
import { PriceData } from '../../utils/constants';
import { BigNumber, ethers } from 'ethers';
import { useDappContext } from '../../utils/Context';
import { contractAddresses, polygonMainnetChainId, bscTestnetChainId, tokenAddresses, decimals, bscMainnetChainId } from '../../utils/config';
import tokenContractAbi from '../../assets/abis/Token-abi.json';
import contractAbi from '../../assets/abis/CSDOGEPayment-abi.json';

export type BuyModalProps = {
  isOpenBuyModal: boolean,
  onCloseBuyModal(): void,
  // announceText: string,
  // announceLogo: string,
}

const BuyModal = ({
  isOpenBuyModal,
  onCloseBuyModal,
  // announceText,
  // announceLogo,
}: BuyModalProps) => {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const [payOption, setPayOption] = useState('4');
  const [imageNum, setImageNum] = useState(5);
  const [chatTime, setChatTime] = useState(1);
  const [price, setPrice] = useState(100);
  const { address, } = useAccount();
  const [isApproved, setIsApproved] = useState(false);
  const {
    isBuy,
    setIsBuy
  } = useDappContext();

  useEffect(() => {
    if (isOpenBuyModal) {
      toast.success('Please click approve button after selecting proper plan');
    }
  }, [isOpenBuyModal])

  useEffect(() => {
    if (payOption == '4') {
      setPrice(imageNum * PriceData[4]);
    } else if (payOption == '5') {
      setPrice(chatTime * PriceData[5]);
    } else {
      setPrice(PriceData[Number(payOption)]);
    }
  }, [payOption, imageNum, chatTime])

  useEffect(() => {
    getExpireDate();
  }, [])

  const getExpireDate = async () => {
    let params = { wallet_address: address };
    const response = (await axios.post("/api/account_info/get", params)).data;
    //console.log("response: ", response);

    let expire_date = new Date(now());
    let days = 0;
    if (payOption == '1') {
      days = 1;
    } else if (payOption == '2') {
      days = 7;
    } else if (payOption == '3') {
      days = 30;
    }

    expire_date.setDate(expire_date.getDate() + days);
    let UTC_date = expire_date.toISOString();
    return UTC_date;
  }

  const handleApprove = async () => {
    if (chain?.id == undefined || chain?.id !=
      (process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId)) {
      toast.error('Please switch your chain');
      return;
    }

    const chainId = chain?.id ?? (process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId);
    try {
      const tokenContractAddress = (tokenAddresses as any)[chainId];
      const contractAddress = (contractAddresses as any)[chainId];

      //console.log("tokenContractAddress: ", tokenContractAddress);
      //console.log("contractAddress: ", contractAddress);
      //console.log("price: ", ethers.BigNumber.from(price).mul((ethers.BigNumber.from(10)).pow(9)).toString())

      // approve
      const tokenContract = new ethers.Contract(
        tokenContractAddress,
        tokenContractAbi,
        (signer?.provider as any)?.getSigner()
      );
      let tx = await tokenContract.approve(
        contractAddress,
        ethers.BigNumber.from(price).mul((ethers.BigNumber.from(10)).pow(9)).toString(),
      );
      await tx.wait();
      //console.log('Approve success');
      setIsApproved(true);
      toast.success('Approve success. Please click Buy Button');
    } catch (e) {
      //console.log("error happened in approve: ", e);
    }
  }

  const handleBuy = async () => {
    if (chain?.id == undefined || chain?.id !=
      (process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId)) {
      toast.error('Please switch your chain');
      return;
    }
    if (!isApproved) {
      toast.error('Please click approve button at first');
      return;
    }

    const chainId = chain?.id ?? (process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId);
    try {
      // buy
      const contractAddress = (contractAddresses as any)[chainId];

      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        (signer?.provider as any)?.getSigner()
      );
      let tx = await contract.sendToken(
        ethers.BigNumber.from(price).mul((ethers.BigNumber.from(10)).pow(9)).toString()
      );
      await tx.wait();
      //console.log('Transfer success')

      await writeBuyDataToDB();

    } catch (e) {
      //console.log("error happened: ", e);
    }
  }

  const writeBuyDataToDB = async () => {

    //console.log("expired date: ", await getExpireDate());

    let params = {
      type: Number(payOption),
      wallet_address: address,
      expire_date: await getExpireDate(),
      price: price
    };
    debugger
    const response = await axios.post("/api/account_info/buy", params);

    if (response.data == "success") {
      toast.success("Buy Success!");
      setIsBuy(true);
    } else {
      toast.error("Buy Failed!");
    }
    onCloseBuyModal();
    setIsApproved(false);
  };

  return (
    <Modal isOpen={isOpenBuyModal} onClose={onCloseBuyModal}>
      {' '}
      <ModalOverlay
        bg='blackAlpha.10'

        backdropFilter='blur(10px) hue-rotate(10deg)'
      />
      <ModalContent
        bg="gray.100"
        border="1px solid #ED2775"
        borderRadius={'15px'}
        color={'black'}
      >
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            direction={'column'}
            alignItems={'center'}
            mt={'30px'}
          >
            <Flex
              fontSize={'20px'}
              textAlign={'left'}
              background={'rgb(5, 0, 35)'}
              marginBottom={'20px'}
              letterSpacing={'0.1em'}
              fontWeight={'600'}
              backgroundClip={'text'}
              color={'transparent'}
            >
              Please select pay option.
            </Flex>
            <Flex
              direction={'column'}
              borderTop="1px solid #ED2775"
              padding={'20px'}
            >
              <Flex
                fontSize={'18px'}
                textAlign={'left'}
                background={'rgb(5, 0, 35)'}
                marginBottom={'20px'}
                letterSpacing={'0.1em'}
                fontWeight={'600'}
                backgroundClip={'text'}
                color={'transparent'}
              >
                For Image
              </Flex>
              <RadioGroup onChange={setPayOption} value={payOption}>
                <Stack direction='column'>
                  <Radio value='1' size='lg'>One Day access</Radio>
                  <Radio value='2' size='lg'>One Week access</Radio>
                  <Radio value='3' size='lg'>One Month access</Radio>
                  <Radio value='4' size='lg'>Custom</Radio>
                </Stack>
                {/* <Radio value='4'>Third</Radio> */}
              </RadioGroup>
              <Flex
                direction={'row'}
                alignItems={'center'}
                opacity={payOption != '4' ? '0.5' : '1'}
              >

                AI Image Count
                <NumberInput
                  // defaultValue={10}
                  // max={10}
                  // keepWithinRange={false}
                  // clampValueOnBlur={false}
                  min={5}
                  //@ts-ignore
                  onChange={setImageNum}
                  isDisabled={payOption != '4' ? true : false}
                  width={'100px'}
                  marginLeft={'10px'}
                  value={imageNum}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>

            </Flex>
            {/* <Flex
              direction={'column'}
              borderTop="1px solid #ED2775"
              borderBottom="1px solid #ED2775"
              // borderRadius={'15px'}
              padding={'10px'}
            >
              <Flex
                fontSize={'18px'}
                textAlign={'left'}
                background={'rgb(5, 0, 35)'}
                marginBottom={'10px'}
                letterSpacing={'0.1em'}
                fontWeight={'600'}
                backgroundClip={'text'}
                color={'transparent'}

              >
                For Chat
              </Flex>
              <RadioGroup onChange={setPayOption} value={payOption}>
                <Stack direction='column'>
                  <Radio value='5' size='lg'>Custom</Radio>
                </Stack>
              </RadioGroup>
              <Flex
                direction={'row'}
                alignItems={'center'}
                opacity={payOption != '5' ? '0.5' : '1'}
              >

                Chat CSDOGE Hours
                <NumberInput
                  // defaultValue={10}
                  // max={10}
                  // keepWithinRange={false}
                  // clampValueOnBlur={false}
                  min={1}
                  //@ts-ignore
                  onChange={setChatTime}
                  isDisabled={payOption != '5' ? true : false}
                  width={'100px'}
                  marginLeft={'10px'}
                  value={chatTime}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Flex>

            </Flex> */}
            <Text
              marginTop={'10px'}
              fontSize={'20px'}
              fontWeight={'500'}
            >
              Price : {price} CSDOGE
            </Text>
            <Flex
              direction={'row'}
              alignItems={'center'}
              margin={'10px 0'}
              gap={'20px'}
            >
              <button
                className={'default-btn'}
                onClick={handleApprove}
              >
                Approve
              </button>
              <button
                className={'default-btn'}
                onClick={handleBuy}
                disabled={!isApproved}
                style={{
                  opacity: isApproved ? 1 : 0.6
                }}
              >
                Buy
              </button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default BuyModal
