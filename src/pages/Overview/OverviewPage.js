import React, { useContext } from 'react';
import SeoHelmet from '../../components/Seo/SeoHelmet';
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiOutlinePrinter } from 'react-icons/ai';
import { FiMail, FiPhone } from 'react-icons/fi';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

import { ThemeContext } from '../../contexts/ThemeContext';
import { headerData } from '../../data/headerData';
import { aboutData } from '../../data/aboutData';
import { skillsData } from '../../data/skillsData';
import { experienceData } from '../../data/experienceData';
import { educationData } from '../../data/educationData';
import { projectsData } from '../../data/projectsData';
import { contactsData } from '../../data/contactsData';
import { socialsData } from '../../data/socialsData';

import './OverviewPage.css';

function SkillTags({ skills, theme }) {
    return (
        <div className="overview-skills">
            {skills.map((skill) => (
                <span
                    key={skill}
                    className="overview-skill-tag"
                    style={{ backgroundColor: theme.primary400, color: theme.tertiary }}
                >
                    {skill}
                </span>
            ))}
        </div>
    );
}

function OverviewPage() {
    const { theme } = useContext(ThemeContext);

    const handlePrint = () => window.print();

    return (
        <div className="overviewPage" style={{ backgroundColor: theme.secondary }}>
            <SeoHelmet title="Resume Preview | vignesh-dev.in" noindex />

            <div className="overviewPage-toolbar no-print">
                <Link to="/" className="overviewPage-home" style={{ backgroundColor: theme.primary, color: theme.secondary }}>
                    <AiOutlineHome />
                </Link>
                <span className="overviewPage-label" style={{ color: theme.tertiary80 }}>
                    Recruiter overview
                </span>
                <button
                    type="button"
                    className="overviewPage-print"
                    onClick={handlePrint}
                    style={{ backgroundColor: theme.primary, color: theme.secondary }}
                >
                    <AiOutlinePrinter />
                    <span>Print / Save PDF</span>
                </button>
            </div>

            <div className="overviewPage-content">
                <header className="overview-header" style={{ borderColor: theme.primary }}>
                    <img src={headerData.image} alt={headerData.name} className="overview-photo" />
                    <div className="overview-header-text">
                        <h1 style={{ color: theme.primary }}>{headerData.name}</h1>
                        <p className="overview-title" style={{ color: theme.tertiary }}>{headerData.title}</p>
                        <p className="overview-meta" style={{ color: theme.tertiary80 }}>
                            4+ Years Experience · Chennai, Tamil Nadu, India · Open to relocation
                        </p>
                        <p className="overview-summary" style={{ color: theme.tertiary80 }}>
                            {headerData.description}
                        </p>
                        <div className="overview-contact-row">
                            <a href={`mailto:${contactsData.email}`} style={{ color: theme.tertiary }}>
                                <FiMail /> {contactsData.email}
                            </a>
                            <a href={`tel:${contactsData.phone}`} style={{ color: theme.tertiary }}>
                                <FiPhone /> {contactsData.phone}
                            </a>
                            {socialsData.linkedIn && (
                                <a href={socialsData.linkedIn} target="_blank" rel="noreferrer" style={{ color: theme.tertiary }}>
                                    <FaLinkedinIn /> LinkedIn
                                </a>
                            )}
                            {socialsData.github && (
                                <a href={socialsData.github} target="_blank" rel="noreferrer" style={{ color: theme.tertiary }}>
                                    <FaGithub /> GitHub
                                </a>
                            )}
                        </div>
                    </div>
                </header>

                <div className="overview-grid">
                    <section className="overview-section overview-section--full">
                        <h2 style={{ color: theme.primary }}>About</h2>
                        <p style={{ color: theme.tertiary80 }}>
                            {aboutData.description1} {aboutData.description2}
                        </p>
                    </section>

                    <section className="overview-section">
                        <h2 style={{ color: theme.primary }}>Core Skills</h2>
                        <SkillTags skills={skillsData.core} theme={theme} />
                    </section>

                    <section className="overview-section">
                        <h2 style={{ color: theme.primary }}>Tools</h2>
                        <SkillTags skills={skillsData.tools} theme={theme} />
                    </section>

                    {skillsData.familiar?.length > 0 && (
                        <section className="overview-section">
                            <h2 style={{ color: theme.primary }}>Familiar</h2>
                            <p style={{ color: theme.tertiary70, fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                                Known through training — no project experience yet
                            </p>
                            <SkillTags skills={skillsData.familiar} theme={theme} />
                        </section>
                    )}

                    <section className="overview-section overview-section--full">
                        <h2 style={{ color: theme.primary }}>Experience</h2>
                        <div className="overview-list">
                            {experienceData.map((exp) => (
                                <div key={exp.id} className="overview-list-item">
                                    <div className="overview-list-head">
                                        <strong style={{ color: theme.tertiary }}>{exp.jobtitle}</strong>
                                        <span style={{ color: theme.tertiary80 }}>
                                            {exp.startYear} – {exp.endYear}
                                        </span>
                                    </div>
                                    <p className="overview-list-sub" style={{ color: theme.primary }}>
                                        {exp.company} · {exp.place}
                                    </p>
                                    <p style={{ color: theme.tertiary80 }}>{exp.description}</p>
                                    {exp.highlights && (
                                        <ul className="overview-bullets" style={{ color: theme.tertiary80 }}>
                                            {exp.highlights.map((item) => (
                                                <li key={item}>{item}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overview-section">
                        <h2 style={{ color: theme.primary }}>Education</h2>
                        <div className="overview-list">
                            {educationData.map((edu) => (
                                <div key={edu.id} className="overview-list-item">
                                    <div className="overview-list-head">
                                        <strong style={{ color: theme.tertiary }}>{edu.course}</strong>
                                        <span style={{ color: theme.tertiary80 }}>
                                            {edu.startYear ? `${edu.startYear} – ${edu.endYear}` : edu.endYear}
                                        </span>
                                    </div>
                                    <p style={{ color: theme.tertiary80 }}>{edu.institution}</p>
                                    {edu.details && (
                                        <p style={{ color: theme.primary, fontWeight: 600 }}>{edu.details}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="overview-section">
                        <h2 style={{ color: theme.primary }}>Languages</h2>
                        <div className="overview-list">
                            <div className="overview-list-item">
                                <p style={{ color: theme.tertiary80 }}>Tamil — Native</p>
                                <p style={{ color: theme.tertiary80 }}>English — Professional</p>
                            </div>
                        </div>
                    </section>

                    <section className="overview-section overview-section--full">
                        <h2 style={{ color: theme.primary }}>Projects</h2>
                        <div className="overview-list">
                            {projectsData.map((project) => (
                                <div key={project.id} className="overview-list-item">
                                    <div className="overview-list-head">
                                        <strong style={{ color: theme.tertiary }}>{project.projectName}</strong>
                                        <div className="overview-project-links">
                                            {project.demo && (
                                                <a href={project.demo} target="_blank" rel="noreferrer" style={{ color: theme.primary }}>
                                                    Live
                                                </a>
                                            )}
                                            {project.code && (
                                                <a href={project.code} target="_blank" rel="noreferrer" style={{ color: theme.primary }}>
                                                    Code
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="overview-project-tags">
                                        {project.tags.map((tag) => (
                                            <span key={tag} style={{ color: theme.primary }}>{tag}</span>
                                        ))}
                                    </div>
                                    <p style={{ color: theme.tertiary80 }}>{project.projectDesc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {headerData.resumePdf && (
                    <footer className="overview-footer no-print">
                        <a
                            href={headerData.resumePdf}
                            download="resume"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: theme.primary }}
                        >
                            Download resume (PDF)
                        </a>
                    </footer>
                )}
            </div>
        </div>
    );
}

export default OverviewPage;
