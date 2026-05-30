import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AiOutlineHome } from 'react-icons/ai';
import { Fade } from 'react-awesome-reveal';

import './ProjectPage.css';
import ProjectDetailCard from '../../components/Projects/ProjectDetailCard/ProjectDetailCard';
import SeoHelmet from '../../components/Seo/SeoHelmet';
import { ThemeContext } from '../../contexts/ThemeContext';
import { projectsData } from '../../data/projectsData';

function ProjectPage() {
    const [search, setSearch] = useState('');
    const { theme } = useContext(ThemeContext);

    const filteredProjects = projectsData.filter((project) => {
        const content = [
            project.projectName,
            project.projectDesc,
            project.highlights?.join(' '),
            project.tags.join(' '),
        ].join(' ');
        return content.toLowerCase().includes(search.toLowerCase());
    });

    const useStyles = makeStyles((t) => ({
        search: {
            color: theme.tertiary,
            width: '40%',
            height: '2.75rem',
            outline: 'none',
            border: `2px solid ${theme.primary30}`,
            borderRadius: '20px',
            padding: '0.95rem 1rem',
            fontFamily: 'var(--primaryFont)',
            fontWeight: 500,
            fontSize: '0.9rem',
            backgroundColor: theme.primary30,
            '&::placeholder': {
                color: theme.tertiary70,
            },
            [t.breakpoints.down('sm')]: {
                width: '100%',
                maxWidth: '350px',
            },
        },
        home: {
            color: theme.secondary,
            position: 'absolute',
            top: 25,
            left: 25,
            padding: '7px',
            borderRadius: '50%',
            boxSizing: 'content-box',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow:
                theme.type === 'dark'
                    ? '3px 3px 6px #ffffff40, -3px -3px 6px #00000050'
                    : '3px 3px 6px #ffffff40, -3px -3px 6px #00000050',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
                color: theme.tertiary,
                transform: 'scale(1.1)',
            },
            [t.breakpoints.down('sm')]: {
                fontSize: '1.8rem',
            },
        },
    }));

    const classes = useStyles();

    return (
        <div className="projectPage" style={{ backgroundColor: theme.secondary }}>
            <SeoHelmet
                title="Vignesh M | Projects | vignesh-dev.in"
                description="Projects by Vignesh M — Software Engineer. Web apps, GenAI platforms, e-commerce, and full-stack development work."
                path="/projects"
            />
            <div className="projectPage-header" style={{ backgroundColor: theme.primary }}>
                <Link to="/">
                    <AiOutlineHome className={classes.home} />
                </Link>
                <h1 style={{ color: theme.secondary }}>Projects</h1>
            </div>
            <div className="projectPage-container">
                <div className="projectPage-search">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or technology..."
                        className={classes.search}
                    />
                </div>
                <div className="projectPage-list">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project, index) => (
                            <Fade
                                key={project.id}
                                direction={index % 2 === 0 ? 'left' : 'right'}
                                className="projects--reveal"
                            >
                                <ProjectDetailCard
                                    theme={theme}
                                    name={project.projectName}
                                    desc={project.projectDesc}
                                    highlights={project.highlights}
                                    tags={project.tags}
                                    code={project.code}
                                    demo={project.demo}
                                    image={project.image}
                                    imageZoomOut={project.imageZoomOut}
                                    imageLightBg={project.imageLightBg}
                                />
                            </Fade>
                        ))
                    ) : (
                        <p className="projectPage-empty" style={{ color: theme.tertiary80 }}>
                            No projects match your search.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectPage;
