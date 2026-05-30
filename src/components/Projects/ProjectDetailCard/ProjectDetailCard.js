import React from 'react';
import { FaPlay, FaCode } from 'react-icons/fa';

import placeholder from '../../../assets/png/placeholder.png';
import './ProjectDetailCard.css';

function ProjectDetailCard({
    name,
    desc,
    highlights = [],
    tags,
    code,
    demo,
    image,
    imageZoomOut = false,
    imageLightBg = false,
    theme,
}) {
    const thumbClass = [
        imageLightBg ? 'projectDetailCard-thumb--lightBg' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const imgClass = imageZoomOut ? 'projectDetailCard-thumbImg--zoomOut' : '';

    return (
        <article
            className="projectDetailCard projectDetailCard--open"
            style={{
                backgroundColor: theme.primary50,
                borderColor: theme.primary,
            }}
        >
            <div className="projectDetailCard-header">
                <div
                    className={`projectDetailCard-thumb ${thumbClass}`.trim()}
                    style={{ borderColor: theme.primary50 }}
                >
                    <img
                        src={image || placeholder}
                        alt={name}
                        className={imgClass}
                    />
                </div>

                <div className="projectDetailCard-summary">
                    <h2 style={{ color: theme.tertiary }}>{name}</h2>
                    <div className="projectDetailCard-tags">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                style={{
                                    color: theme.secondary,
                                    backgroundColor: theme.primary,
                                }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="projectDetailCard-desc" style={{ color: theme.tertiary80 }}>
                        {desc}
                    </p>
                </div>
            </div>

            <div
                className="projectDetailCard-body"
                style={{ borderTopColor: theme.primary50 }}
            >
                <div className="projectDetailCard-bodyInner">
                    <h3 style={{ color: theme.primary }}>What I did</h3>
                    <ul style={{ color: theme.tertiary80 }}>
                        {highlights.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>

                    <div className="projectDetailCard-actions">
                        {demo ? (
                            <a
                                href={demo}
                                target="_blank"
                                rel="noreferrer"
                                className="projectDetailCard-btn projectDetailCard-btn--primary"
                                style={{ backgroundColor: theme.primary, color: theme.secondary }}
                            >
                                <FaPlay /> Live Site
                            </a>
                        ) : (
                            <span
                                className="projectDetailCard-btn projectDetailCard-btn--muted"
                                style={{ color: theme.tertiary70 }}
                            >
                                Site confidential
                            </span>
                        )}
                        {code && (
                            <a
                                href={code}
                                target="_blank"
                                rel="noreferrer"
                                className="projectDetailCard-btn projectDetailCard-btn--outline"
                                style={{ color: theme.primary, borderColor: theme.primary }}
                            >
                                <FaCode /> Source Code
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default ProjectDetailCard;
