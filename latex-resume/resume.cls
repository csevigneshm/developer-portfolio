\LoadClass[12pt]{extreport}

\usepackage{ifthen}
\usepackage[english]{babel}

% Modern Font
\usepackage[T1]{fontenc}
\usepackage[default]{sourcesanspro}



\usepackage{geometry}
\usepackage{array}
\usepackage{enumitem}
\usepackage{hyperref}
\usepackage{xltabular}
\usepackage{graphicx}
\usepackage{outlines}

% Prevent word breaking
\usepackage[none]{hyphenat}
\sloppy

\setlist[itemize]{leftmargin=*}
\linespread{1.10}

\geometry{
    a4paper,
    left=0.5in,
    top=0.4in,
    right=0.5in,
    bottom=0.4in
}

\newcommand\clink[1]{{\usefont{T1}{lmtt}{m}{n} #1 }}

\pagenumbering{gobble}

\newenvironment{csection}[2]{
    \vspace{0.2cm}
    \textbf{\large #1}
    \vspace{0.1cm}
    \hrule
    \vspace{0.1cm}
    {#2}
}{}

\newenvironment{frcontent}[4]{
    {
        \textbf{#1} \leavevmode\newline
        {\footnotesize
            \ifthenelse{\equal{#2}{}}{}{{#2 \leavevmode\newline}}
            \ifthenelse{\equal{#3}{}}{}{{#3 \leavevmode\newline}}
            \ifthenelse{\equal{#4}{}}{}{{\textit{#4}}}
        }
    }
}{}

\hypersetup{
    colorlinks=true,
    urlcolor=black,
    linkcolor=black,
    pdfborder={0 0 0}
}