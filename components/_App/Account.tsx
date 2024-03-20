import {
  Button,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { bscMainnetChainId, bscTestnetChainId, tokenAddresses } from '../../utils/config';
import BuyModal from '../Modal/BuyModal'
import { useDappContext } from '../../utils/Context';

const Account = () => {
  const {
    isOpen: isOpen,
    onOpen: onOpen,
    onClose: onClose,
  } = useDisclosure();
  const { chain } = useNetwork();
  const { address, } = useAccount();
  const chainId = chain?.id != undefined ? chain.id :
    process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : bscTestnetChainId;

  const { data: balanceOfToken, isError, isLoading } = useBalance({
    address: address,
    // @ts-ignore
    chainId: chainId,
    token: tokenAddresses[chainId],
  })

  const {
    status, setStatus
  } = useDappContext();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                userSelect: 'none',
                pointerEvents: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    variant={'solid'}
                    width={['150px', '150px', '150x', '180px']}
                    height={['35px', '35px', '35px', '41px']}
                    borderRadius={['10px']}
                    backgroundColor={'transparent'}
                    color={'white'}
                    border="1px solid #ED2775"
                    fontSize={['14px', '14px', '16px', '18px']}
                    fontWeight="500px"
                    lineHeight={'25px'}
                    className={'sticky-font'}
                    _hover={{
                      backgroundColor: '#ED2775',
                    }}
                    _active={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    Connect Wallet

                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    variant={'solid'}
                    width={['150px', '150px', '150x', '180px']}
                    height={['35px', '35px', '35px', '41px']}
                    borderRadius={['35px', '35px', '35px', '35px']}
                    border="1px solid #FC541C"
                    backgroundColor={'red'}
                    color={'white'}
                    className={'sticky-font'}
                    fontSize={['12px', '14px', '16px', '18px']}
                    fontWeight="500px"
                    _hover={{
                      backgroundColor: '#E18833',
                    }}
                    _active={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <Flex
                  gap={['5px', '10px', '20px', '20px', '20px', '20px']}
                  alignItems={'center'}
                >
                  <Flex
                    color={'white'}
                    fontSize={['12px', '14px', '16px', '18px']}
                    fontWeight="500px"
                    lineHeight={'25px'}
                    textAlign={'center'}
                    className={'sticky-font'}
                  >

                    {status}
                  </Flex>
                  <Button
                    onClick={onOpen}
                    fontWeight="500px"
                    width={['50px', '80px', '80px', '80px']}
                    borderRadius={'35px'}
                    fontSize={['12px', '14px', '16px', '18px']}
                    height={['35px', '35px', '35px', '41px']}
                    color={'white'}
                    border="1px solid #99b7ff"
                    backgroundColor={'#2e2e49'}
                    className={'sticky-font'}
                    _hover={{
                      backgroundColor: '#99b7ff',
                    }}
                    _active={{
                      backgroundColor: 'transparent',
                    }}
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={openAccountModal}
                    variant={'solid'}
                    width={['160px', '200px', '200x', '250px']}
                    height={['35px', '35px', '35px', '41px']}
                    borderRadius={['35px', '35px', '35px', '35px']}
                    color={'white'}
                    border="1px solid #99b7ff"
                    fontSize={['12px', '14px', '16px', '18px']}
                    fontWeight="500px"
                    lineHeight={'25px'}
                    className={'sticky-font'}
                    backgroundColor={'#2e2e49'}
                    _hover={{
                      backgroundColor: '#99b7ff',
                    }}
                    _active={{
                      backgroundColor: 'transparent',
                    }}
                  >

                    {account.displayName}
                    {balanceOfToken?.formatted
                      ? ` ${Number(balanceOfToken?.formatted).toPrecision(2)}(${balanceOfToken?.symbol})`
                      : ''}
                  </Button>
                  <BuyModal
                    isOpenBuyModal={isOpen}
                    onCloseBuyModal={onClose}
                  />
                </Flex>
              );
            })()}
          </div>
        );
      }}

    </ConnectButton.Custom>
  );
};

export default Account;