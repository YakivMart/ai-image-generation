import {
    Image,
} from '@chakra-ui/react';
import React from "react";
import Link from '../../utils/ActiveLink';
import Account from "./Account";
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

const NavbarStyle = () => {
    const [menu, setMenu] = React.useState(true)
    const router = useRouter()

    const toggleNavbar = () => {
        setMenu(!menu)
    }

    React.useEffect(() => {
        let elementId = document.getElementById("navbar");
        document.addEventListener("scroll", () => {
            if (elementId) {
                if (window.scrollY > 170) {
                    elementId.classList.add("is-sticky");
                } else {
                    elementId.classList.remove("is-sticky");
                }
            }
        });
    })
    const { address, } = useAccount();

    const classOne = menu ? 'collapse navbar-collapse' : 'collapse navbar-collapse show';
    const classTwo = menu ? 'navbar-toggler navbar-toggler-right collapsed' : 'navbar-toggler navbar-toggler-right';

    return (
        <>
            <div id="navbar" className="navbar-area navbar-area navbar-style-two">
                <div className="texap-nav">
                    <div className="container">
                        <nav className="navbar navbar-expand-md navbar-light bg-light">

                            <Link href="/">
                                <a className="navbar-brand">
                                    <Image src="/images/logo.png" alt="logo" opacity={(address && window.innerWidth < 540 && (router.pathname.includes('/image-ai') || router.pathname.includes('/chat-ai'))) ? '0' : '1'} />
                                </a>
                            </Link>

                            <button
                                onClick={toggleNavbar}
                                className={classTwo}
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="icon-bar top-bar"></span>
                                <span className="icon-bar middle-bar"></span>
                                <span className="icon-bar bottom-bar"></span>
                            </button>

                            <div className={classOne} id="navbarSupportedContent">
                                <ul className="navbar-nav">
                                    <li className="nav-item">
                                        <Link href="/" activeClassName="active">
                                            <a onClick={toggleNavbar} className="nav-link">
                                                Home
                                            </a>
                                        </Link>
                                    </li>

                                </ul>
                            </div>

                            {router.pathname.includes('/')  ?
                                (
                                    <div className="others-options">
                                        <Account />
                                    </div>
                                ) : (<></>)
                            }

                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
}

export default NavbarStyle;