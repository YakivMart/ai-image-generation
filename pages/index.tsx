import {
    Box, Flex, Text, Image, Grid, Button
  } from '@chakra-ui/react'
  import type { NextPage } from 'next'
  import { useRouter } from 'next/router'
  import { useEffect } from 'react'
  import ImageGenerator from '../components/ImageGenerator'
  import NavbarStyle from '../components/_App/NavbarStyle'
  import PageBannerStyle from '../components/_App/PageBannerStyle'
  
  const Home: NextPage = () => {
    const router = useRouter()
  
    // route to the disclaimer page when user arrives to the site for the first time and only once
    useEffect(() => {
  
    }, [])
  
    return (
      <>
        <NavbarStyle />
  
        <PageBannerStyle
          pageTitle="AI Image Generator"
          homePageUrl="/"
          homePageText="DApp"
          activePageText="AI Image Generator"
        />
        <Flex
          direction={'column'}
          width={'100%'}
        >
          <ImageGenerator />
        </Flex>
      </>
    )
  }
  
  export default Home
  