import React, { useState, useContext, useEffect, useRef } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { makeStyles } from '@material-ui/core/styles';

import { ThemeContext } from '../../contexts/ThemeContext';
import './BackToTop.css';

function BackToTop() {
    const [visible, setVisible] = useState(false);
    const { theme } = useContext(ThemeContext);
    const containerRef = useRef(null);
    const lastAlignRef = useRef('');

    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;
            setVisible(scrolled > 300);
        };

        window.addEventListener('scroll', toggleVisible);
        toggleVisible();

        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    useEffect(() => {
        if (!visible) {
            return undefined;
        }

        let cancelled = false;
        let resizeTimer;

        const alignWithCoffee = () => {
            if (cancelled) {
                return;
            }

            const el = containerRef.current;
            const bmc = document.getElementById('bmc-wbtn');
            if (!el || !bmc) {
                return;
            }

            const rect = bmc.getBoundingClientRect();
            if (!rect.height) {
                return;
            }

            const bottom = Math.round(window.innerHeight - rect.bottom);
            const height = Math.round(rect.height);
            const alignKey = `${bottom}-${height}`;

            if (lastAlignRef.current === alignKey) {
                return;
            }

            lastAlignRef.current = alignKey;
            el.style.top = 'auto';
            el.style.transform = 'none';
            el.style.bottom = `${bottom}px`;
            el.style.height = `${height}px`;
        };

        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                lastAlignRef.current = '';
                alignWithCoffee();
            }, 200);
        };

        alignWithCoffee();

        const timers = [100, 500, 1500].map((ms) =>
            setTimeout(alignWithCoffee, ms)
        );

        window.addEventListener('resize', debouncedResize);

        const observer = new MutationObserver(() => {
            if (document.getElementById('bmc-wbtn')) {
                alignWithCoffee();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', debouncedResize);
            observer.disconnect();
            lastAlignRef.current = '';
        };
    }, [visible]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const useStyles = makeStyles(() => ({
        btn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            outline: 'none',
            padding: 0,
            lineHeight: 1,
            boxShadow: 'none',
            '&:hover $icon': {
                transform: 'translateY(-3px)',
            },
        },
        icon: {
            fontSize: '3rem',
            color: theme.primary,
            transition: 'transform 250ms ease-in-out',
            '@media (max-width: 800px)': {
                fontSize: '3.5rem',
            },
        },
    }));

    const classes = useStyles();

    if (!visible) {
        return null;
    }

    return (
        <div className='backToTop' ref={containerRef}>
            <button
                type='button'
                onClick={scrollToTop}
                className={classes.btn}
                aria-label='Back to top'
            >
                <IoIosArrowUp className={classes.icon} />
            </button>
        </div>
    );
}

export default BackToTop;
