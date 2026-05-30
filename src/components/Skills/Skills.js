import React, { useContext } from 'react';

import './Skills.css';

import { ThemeContext } from '../../contexts/ThemeContext';
import { skillsData } from '../../data/skillsData';
import { skillsImage } from '../../utils/skillsImage';

function SkillGrid({ title, subtitle, skills, theme, skillBoxStyle, muted = false }) {
    if (!skills.length) return null;

    return (
        <div className="skills-category">
            <h3 style={{ color: theme.tertiary80 }}>{title}</h3>
            {subtitle && (
                <p className="skills-category-sub" style={{ color: theme.tertiary70 }}>
                    {subtitle}
                </p>
            )}
            <div className="skills-grid">
                {skills.map((skill) => (
                    <div
                        className={`skill--box ${muted ? 'skill--box-muted' : ''}`}
                        key={skill}
                        style={skillBoxStyle}
                    >
                        <img
                            src={skillsImage(skill) || skillsImage('Javascript')}
                            alt={skill}
                        />
                        <h4 style={{ color: theme.tertiary }}>{skill}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}

function Skills() {
    const { theme } = useContext(ThemeContext);

    const skillBoxStyle = {
        backgroundColor: theme.secondary,
        boxShadow: `0px 0px 30px ${theme.primary30}`,
    };

    return (
        <div className="skills" id="skills" style={{ backgroundColor: theme.secondary }}>
            <div className="skillsHeader">
                <h2 style={{ color: theme.primary }}>Skills</h2>
                <p style={{ color: theme.tertiary80 }}>Core technologies and tools I work with</p>
            </div>
            <div className="skillsContainer">
                <SkillGrid
                    title="Core Skills"
                    skills={skillsData.core}
                    theme={theme}
                    skillBoxStyle={skillBoxStyle}
                />
                <SkillGrid
                    title="Tools"
                    skills={skillsData.tools}
                    theme={theme}
                    skillBoxStyle={skillBoxStyle}
                />
                {skillsData.familiar?.length > 0 && (
                    <SkillGrid
                        title="Familiar Technologies"
                        subtitle="Known through training — no hands-on project experience yet"
                        skills={skillsData.familiar}
                        theme={theme}
                        skillBoxStyle={{
                            ...skillBoxStyle,
                            opacity: 0.88,
                        }}
                        muted
                    />
                )}
            </div>
        </div>
    );
}

export default Skills;
