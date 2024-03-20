import {
    Flex,
    Text,
    Image,
    Button,
    Input,
    Box,
    Select,
} from '@chakra-ui/react';
import axios from 'axios';
import { GeneratorStyleData, UnlimitedTokenAmount, GeneratorPresetTextData } from "../../../utils/constants";
import { useDappContext } from '../../../utils/Context'
import { lockIcon, shapeIcon } from '../../../utils/images'
import { sleep } from '../../../utils/interface';
import { toast } from 'react-toastify'
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { useState, useEffect } from 'react'
import { now } from 'moment';
import { polygonMainnetChainId, polygonTestnetChainId, tokenAddresses, bscMainnetChainId } from '../../../utils/config';
import { Prediction } from '../../../utils/Context';
const GeneratorStyleContainer = () => {
    const {
        styleId, setStyleId,
        shapeId, setShapeId,
        sizeOption, setSizeOption,
        styleText, setStyleText,
        prediction, setPrediction,
        isBuy, setIsBuy,
        status, setStatus
    } = useDappContext();
    const { address, } = useAccount();
    const [freeImageAmount, setFreeImageAmount] = useState(0);
    const [paidImageAmount, setPaidImageAmount] = useState(0);
    const [expireDate, setExpireDate] = useState(now());
    const { chain } = useNetwork();
    const chainId = chain?.id != undefined ? chain.id :
        process.env.NEXT_PUBLIC_MAINNET_OR_TESTNET == "mainnet" ? bscMainnetChainId : polygonTestnetChainId;

    const { data: balanceOfToken, isError, isLoading } = useBalance({
        address: address,
        // @ts-ignore
        token: tokenAddresses[chainId],
    })

    useEffect(() => {
        if (address) {
            getInfoData();
        }
    }, []);

    useEffect(() => {
        if (address) {
            getInfoData();
        }
    }, [address, isBuy]);

    const getExpireDate = () => {
        let expire_date = new Date(now());
        let days = 1;
        expire_date.setDate(expire_date.getDate() + days);
        let UTC_date = expire_date.toISOString();
        return UTC_date;
    }

    useEffect(() => {
        if (address) {
            checkUser()
        }
        if (address && Number(balanceOfToken?.formatted) >= UnlimitedTokenAmount) {
            setStatus("Unlimited Access");
            setExpireDate(Date.parse(getExpireDate()));
          
        }
    }, [address]);

    const checkUser = async () => {
        let params = { wallet_address: address };
        const response = await axios.post("/api/account_info/get", params);
        if (!(response.data.free_image_amount >= 0)) {
            await axios.post("/api/account_info/signup", params);
        }
    }

    const minsToTimeInfo = (mins: number) => {
        return "Left " + Math.floor(mins / 60) + " hours: " + mins % 60 + " mins";
    }

    const getInfoData = async () => {
        let params = { wallet_address: address };
        await axios.post("/api/account_info/get", params)
            .then(response => {
                setFreeImageAmount(response.data.free_image_amount);
                setPaidImageAmount(response.data.paid_image_amount);
                setExpireDate(Date.parse(response.data.expire_date));

                if (address && Number(balanceOfToken?.formatted) >= UnlimitedTokenAmount) {
                    setStatus("Unlimited Access");
                    setExpireDate(Date.parse(getExpireDate()));
                } else if (Date.parse(response.data.expire_date) > now()) {
                    setStatus(minsToTimeInfo(Math.floor((Date.parse(response.data.expire_date) - now()) / 60000)));
                } else if (response.data.paid_image_amount > 0) {
                    setStatus(response.data.paid_image_amount + " images left");
                } else if (response.data.free_image_amount >= 0) {
                    setStatus(response.data.free_image_amount + " images left");
                }
            })
            .catch(error => {
                console.log(error);
            });
        if (isBuy) {
            setIsBuy(false);
        }
    };

    const imageGenerate = async () => {
        // e.preventDefault();
        // axios.post()
        if (address) {
   
            if (freeImageAmount > 0 || paidImageAmount > 0 || expireDate >= now()) {
                let params = { prompt: styleText, size: sizeOption == "" ? "medium" : sizeOption };
                try {
                    let inititalPrediction: Prediction = { status: 'processing' };
                    setPrediction(inititalPrediction);
                    const response = await axios.post("/api/openAI_predictions", params);
                    let tempPrediction = response.data;
                    tempPrediction.output = tempPrediction.imageUrl;
                    setPrediction(tempPrediction);
                    // removeSpinner();
                    if (expireDate >= now()) {

                    } else if (freeImageAmount > 0) {
                        let params = { wallet_address: address, type: 1 };
                        await axios.post("/api/account_info/generated", params);
                        getInfoData();
                    } else if (paidImageAmount > 0) {
                        let params = { wallet_address: address, type: 2 };
                        await axios.post("/api/account_info/generated", params);
                        getInfoData();
                    }

                } catch (error) {
                    // removeSpinner();
                    console.log(error);
                    //@ts-ignore*
                    toast.error(error.response.data.message)
                }
            } else {
                toast.error("Please buy images with CSDOGE token.")
            }
            // }
        } else {
            toast.error("Please connect wallet to generate the image.")
        }
    };

    const addStyleText = (index: number) => {
        let tempStyleText = styleText;
        if (styleText != "") tempStyleText += " ";
        tempStyleText += GeneratorPresetTextData[index].text + " ";
        setStyleText(tempStyleText);
    }

    return (
        <Flex
            direction='column'
            width={['100%', '100%', '100%', '100%', '100%']}
            padding={['15px', '15px', '15px', '15px', '15px']}
        // margin={'auto'}
        >
           
            

            <Flex
                marginTop={'25px'}
                marginBottom={'10px'}
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
                    Choose a style.
                </Flex>
            </Flex>

            <Flex
                // maxWidth={'945px'}
                // margin={'auto'}
                flexWrap={'wrap'}
                justifyContent={'center'}
            >
                {
                    GeneratorStyleData.map((item, index) => (
                        <Flex
                            key={index}
                            position={'relative'}
                            width={'fit-content'}
                            onClick={() => setStyleId(index)}
                            cursor={styleId == index ? 'default' : 'pointer'}
                            padding={'10px'}
                            direction={'column'}
                            alignItems={'center'}

                        >
                            <Image
                                src={item.src}
                                minWidth={'100px'}
                                width={'100px'}
                                height={'auto'}
                                borderRadius={'12px'}
                                filter={item.isLocked && (paidImageAmount <= 0 && expireDate <= now()) ? 'blur(2px)' : 'none'}
                                boxShadow={styleId == index ? '0px 0px 7px 3px #ED2775' : ''}
                                transform={styleId == index ? 'scale(1.1)' : ''}
                                transition={'.3s'}
                                _hover={{
                                    transform: 'scale(1.1)'
                                }}
                            />

                            {
                                (item.isLocked && (paidImageAmount <= 0 && expireDate <= now())) ?
                                    (
                                        <Image
                                            src={lockIcon}
                                            width={'30px'}
                                            height={'30px'}
                                            position={'absolute'}
                                            top={'72px'}
                                            left={'75px'}
                                        />) : (<></>)
                            }
                            <Text
                                color={'#262A37'}
                                fontSize={'16px'}
                                fontWeight={'600'}
                                maxWidth={'110px'}
                                textAlign={'center'}
                                paddingTop={'10px'}
                            >
                                {item.description}
                            </Text>

                        </Flex>
                    ))
                }

            </Flex>

            <Flex
                direction='column'
            >
                <Flex
                marginTop={'25px'}
                marginBottom={'15px'}
                >
                
                </Flex>

                <Flex gap={4}>
                {/* <Input variant='outline' width={'calc(100% - 90px)'} value={styleText}
                                onChange={e => { setStyleText(e.currentTarget.value); }}
                            /> */}
                    <Box flex="1">
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
                            Type your text.
                        </Flex>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Prompt Text"
                            color={'#262A37'}
                            width={'calc(100% - 100px)'}
                            value={styleText}
                            border={'1px solid #eeeeee !important'}
                            boxShadow={'unset !important'}
                            onChange={e => { setStyleText(e.currentTarget.value); }}
                            required
                            _focus={{
                            border: '1px solid #ED2775 !important',
                            }}
                        />
                        <Button
                            marginLeft={'10px'}
                            width={'90px'}
                            onClick={() => setStyleText("")}
                            background={'#050023'}
                            color={'white'}
                            _hover={{
                            background: '#262A37'
                            }}
                            _active={{
                            background: '#262A37'
                            }}
                        >
                            Clear
                        </Button>
                    </Box>
                    <Box
                      flex="1"
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
                                Choose a size
                        </Flex>
                        <Flex>
                            <Select
                                variant='outline'
                                // placeholder='Size Option'
                                boxShadow={'unset !important'}
                                cursor={'pointer'}
                                width={'80%'}
                                _focus={{
                                    border: '1px solid #ED2775 !important',
                                }}
                                color={'#262A37'}
                                onChange={e => { setSizeOption(e.currentTarget.value); }}
                            >
                                <option value='small'>Small (256px) </option>
                                <option value='medium'>Medium (512px) </option>
                                <option value='large'>Large (1024px)</option>
                                {/* <option value='option4'>Large (1024)</option> */}
                            </Select>
                        </Flex>
                    </Box>
                  
                </Flex>

            </Flex>
            <Flex
                direction='column'
            >
                <Flex
                marginTop={'25px'}
                marginBottom={'15px'}
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
                    Or use sample words below
                </Flex>
                </Flex>

                <Flex
                flexWrap={'wrap'}
                >
                {
                    GeneratorPresetTextData.map((item, index) => (
                    <Button
                        key={index}
                        width={'100px'}
                        margin={'5px'}
                        color={'white'}
                        onClick={() => addStyleText(index)}
                        background={'rgb(153, 183, 255)'}
                        transition={'.3s'}
                        _hover={{
                        background: 'rgb(153, 183, 255)',
                        transform: 'translateY(-3px)'
                        }}
                        _active={{
                        background: 'rgb(153, 183, 255)'
                        }}
                    >
                        {item.text}
                    </Button>
                    ))
                }
                </Flex>
            </Flex>
            <Flex
                direction={'column'}
                alignItems={'center'}
                mt={'20px'}
            >
                <button
                    className={'default-btn'}
                    onClick={imageGenerate}
                >
                    Generate
                </button>
            </Flex>
        </Flex >
    )
}

export default GeneratorStyleContainer;