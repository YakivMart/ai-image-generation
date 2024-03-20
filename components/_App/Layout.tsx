import React from 'react'
import Script from 'next/script'
import GoTop from './GoTop'
import Preloader from './Preloader'
import ContextProvider from "../../utils/ContextProvider";

const Layout = ({ children }: any) => {

    // Preloader
    const [loader, setLoader] = React.useState(true);
    React.useEffect(() => {
        setTimeout(() => setLoader(false), 1500);
    }, [])

    return (
        <>
            <ContextProvider>
                {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-Y9NRTYX60L"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){window.dataLayer.push(arguments);}
                        gtag('js', new Date());

                        gtag('config', 'G-Y9NRTYX60L');
                    `}
                </Script>

                {children}

                {loader ? <Preloader /> : null}

                <GoTop scrollStepInPx="100" delayInMs="10.50" />
            </ContextProvider>
        </>
    );
}

export default Layout;