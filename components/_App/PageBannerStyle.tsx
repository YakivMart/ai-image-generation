import React from 'react';
import Link from 'next/link';

const PageBannerStyle = ({pageTitle, homePageUrl, homePageText, activePageText} : any) => {
    return (
        <>
            <div className="page-title-area">
                <div className="container">
                    <div className="page-title-content">
                        <h2>{pageTitle}</h2>
                        <ul>
                            <li>
                                <Link href={homePageUrl}>
                                    <a>{homePageText}</a>
                                </Link>
                            </li>
                            <li>{activePageText}</li>
                        </ul>
                    </div>
                </div>
              
            </div>
        </>
    );
}

export default PageBannerStyle;