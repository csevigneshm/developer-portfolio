import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IoChatbubbleEllipses, IoClose, IoRefresh, IoSend } from 'react-icons/io5';

import { ThemeContext } from '../../contexts/ThemeContext';
import { vroChatData } from '../../data/vroChatData';
import './VroChat.css';

const WELCOME_MESSAGE = {
    id: 'welcome',
    sender: 'bot',
    text: "Hey, I'm Vro — Vignesh's portfolio buddy. Ask me about his skills, experience, projects, education, or anything on his resume.",
};

const CLOSE_ANIMATION_MS = 200;

const createMessage = (sender, text) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    sender,
    text,
});

const loadHistory = () => {
    try {
        const saved = localStorage.getItem(vroChatData.storageKey);
        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
};

const saveHistory = (messages) => {
    const history = messages.filter((message) => message.id !== 'welcome');
    localStorage.setItem(vroChatData.storageKey, JSON.stringify(history));
};

function VroChat() {
    const { theme } = useContext(ThemeContext);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const history = loadHistory();
        return history.length ? [WELCOME_MESSAGE, ...history] : [WELCOME_MESSAGE];
    });
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const launcherRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        const syncWidgets = () => {
            const bmc = document.getElementById('bmc-wbtn');
            const container = containerRef.current;
            const launcher = launcherRef.current;

            if (!bmc) {
                return;
            }

            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const margin = isMobile ? '12px' : '18px';

            bmc.style.setProperty('left', margin, 'important');
            bmc.style.setProperty('right', 'auto', 'important');
            bmc.style.setProperty('bottom', margin, 'important');

            const bmcPopup = bmc.nextElementSibling;
            if (bmcPopup) {
                bmcPopup.style.setProperty('left', margin, 'important');
                bmcPopup.style.setProperty('right', 'auto', 'important');
            }

            const rect = bmc.getBoundingClientRect();
            if (!rect.width || !launcher || !container) {
                return;
            }

            const size = Math.round(Math.max(rect.width, rect.height));
            const iconSize = Math.max(22, Math.round(size * 0.42));

            launcher.style.width = `${size}px`;
            launcher.style.height = `${size}px`;
            container.style.setProperty('--launcher-size', `${size}px`);
            container.style.setProperty('--launcher-icon-size', `${iconSize}px`);
        };

        syncWidgets();

        const timers = [100, 500, 1500, 3000].map((ms) =>
            setTimeout(syncWidgets, ms)
        );

        const observer = new MutationObserver(syncWidgets);
        observer.observe(document.body, { childList: true, subtree: true });
        window.addEventListener('resize', syncWidgets);

        return () => {
            timers.forEach(clearTimeout);
            observer.disconnect();
            window.removeEventListener('resize', syncWidgets);
        };
    }, []);

    useEffect(() => {
        if (!isOpen && !isClosing) {
            return undefined;
        }

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, isClosing]);

    const openChat = () => {
        setIsClosing(false);
        setIsOpen(true);
    };

    const closeChat = () => {
        if (isClosing) {
            return;
        }

        setIsClosing(true);
        window.setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
        }, CLOSE_ANIMATION_MS);
    };

    const toggleChat = () => {
        if (isOpen) {
            closeChat();
            return;
        }

        openChat();
    };

    const refreshChat = () => {
        localStorage.removeItem(vroChatData.storageKey);
        setMessages([WELCOME_MESSAGE]);
        setInputValue('');
        setIsLoading(false);
    };

    const sendMessage = async () => {
        const question = inputValue.trim();

        if (!question || isLoading) {
            return;
        }

        const userMessage = createMessage('user', question);
        const nextMessages = [...messages, userMessage];

        setMessages(nextMessages);
        setInputValue('');
        setIsLoading(true);
        saveHistory(nextMessages);

        try {
            const { data } = await axios.post(vroChatData.apiUrl, { question });
            const botMessage = createMessage('bot', data.answer);
            const updatedMessages = [...nextMessages, botMessage];

            setMessages(updatedMessages);
            saveHistory(updatedMessages);
        } catch (error) {
            const errorText =
                error.response?.data?.detail ||
                'Sorry, Vro could not get an answer right now. Please try again.';

            const errorMessage = createMessage('bot', errorText);
            const updatedMessages = [...nextMessages, errorMessage];

            setMessages(updatedMessages);
            saveHistory(updatedMessages);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    const isPanelVisible = isOpen || isClosing;
    const showLauncherClose = isOpen && !isClosing;

    return (
        <div
            className={`vro-chat${isOpen ? ' vro-chat--open' : ''}${
                isClosing ? ' vro-chat--closing' : ''
            }`}
            ref={containerRef}
        >
            {isPanelVisible && (
                <button
                    type="button"
                    className="vro-chat__backdrop"
                    onClick={closeChat}
                    aria-label="Close chat overlay"
                />
            )}

            {isPanelVisible && (
                <div
                    className="vro-chat__panel"
                    style={{
                        backgroundColor: theme.secondary,
                        color: theme.tertiary,
                    }}
                >
                    <div
                        className="vro-chat__header"
                        style={{ backgroundColor: theme.primary, color: '#fff' }}
                    >
                        <div className="vro-chat__header-info">
                            <div
                                className="vro-chat__avatar"
                                style={{ backgroundColor: theme.primary600 }}
                            >
                                V
                            </div>
                            <div className="vro-chat__title-wrap">
                                <h3 className="vro-chat__title">Chat with Vro</h3>
                                <p className="vro-chat__subtitle">About Vignesh</p>
                            </div>
                        </div>

                        <div className="vro-chat__header-actions">
                            <button
                                type="button"
                                className="vro-chat__icon-btn"
                                onClick={refreshChat}
                                aria-label="Refresh chat"
                                title="Refresh chat"
                                disabled={isLoading}
                            >
                                <IoRefresh />
                            </button>
                            <button
                                type="button"
                                className="vro-chat__icon-btn vro-chat__icon-btn--close"
                                onClick={closeChat}
                                aria-label="Close chat"
                                title="Close chat"
                            >
                                <IoClose />
                            </button>
                        </div>
                    </div>

                    <div className="vro-chat__messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`vro-chat__message ${
                                    message.sender === 'bot'
                                        ? 'vro-chat__message--bot'
                                        : 'vro-chat__message--user'
                                }`}
                                style={{
                                    backgroundColor:
                                        message.sender === 'bot'
                                            ? theme.secondary70
                                            : theme.primary30,
                                    color: theme.tertiary,
                                }}
                            >
                                <span className="vro-chat__message-label">
                                    {message.sender === 'bot' ? 'Vro' : 'You'}
                                </span>
                                {message.text}
                            </div>
                        ))}

                        {isLoading && (
                            <div
                                className="vro-chat__message vro-chat__message--bot vro-chat__typing"
                                style={{
                                    backgroundColor: theme.secondary70,
                                    color: theme.tertiary,
                                }}
                            >
                                <span className="vro-chat__message-label">Vro</span>
                                Thinking...
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="vro-chat__footer">
                        <div
                            className="vro-chat__input-wrap"
                            style={{
                                backgroundColor: theme.secondary70,
                                color: theme.tertiary,
                            }}
                        >
                            <input
                                type="text"
                                className="vro-chat__input"
                                placeholder="Ask Vro about Vignesh..."
                                value={inputValue}
                                onChange={(event) => setInputValue(event.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                style={{ color: theme.tertiary }}
                            />
                            <button
                                type="button"
                                className="vro-chat__send-btn"
                                style={{
                                    backgroundColor: theme.primary,
                                    opacity: !inputValue.trim() || isLoading ? 0.65 : 1,
                                    cursor:
                                        !inputValue.trim() || isLoading
                                            ? 'not-allowed'
                                            : 'pointer',
                                }}
                                aria-label="Send message"
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                            >
                                <IoSend />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                type="button"
                className="vro-chat__launcher"
                ref={launcherRef}
                onClick={toggleChat}
                aria-label={showLauncherClose ? 'Close Vro chat' : 'Open Vro chat'}
                title={showLauncherClose ? 'Close Vro chat' : 'Chat with Vro'}
                style={{ backgroundColor: theme.primary }}
            >
                {showLauncherClose ? (
                    <IoClose className="vro-chat__launcher-icon" />
                ) : (
                    <>
                        <IoChatbubbleEllipses className="vro-chat__launcher-icon" />
                        <span className="vro-chat__launcher-badge">Vro</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default VroChat;
