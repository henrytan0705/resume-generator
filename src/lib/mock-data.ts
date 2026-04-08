import { LinkedInProfile } from "../types/profile";

export const mockProfile: LinkedInProfile = {
  id: "profile-123",
  name: "Alex Doe",
  headline: "Senior Full Stack Engineer | Next.js & React Expert",
  summary:
    "An experienced software engineer with a strong background in architecting large-scale React and Next.js applications. Passionate about performant web architectures and building scalable technical solutions.",
  profilePictureBase64:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADeSURBVGhD7c8xAQAgDAAx/C/tATawhwQn12T1v+7Z7rP/wAARgAEiAANEAAaIAAwQARggAjBABCABIiACIoAAiIAIiAACIAIiIAIgwAIiYAEIsIAIWAACLCACOYAAcoAAcoAASoAAKkAACkAADkAAAQAAASAAAQGAABCAhABAQgEBAAQgIYAAEIACAigAAigAARwAAQkAAREAAA0gAEUAAU4AAUYAASkAAQEAASEAAQEAAZcAAXkAAVkAAT0AAXEAARcAAUwAAQwAASAABIgADBAxGAAzEAAyAAAyoPfr/kQ0yqJv3+UAAAAASUVORK5CYII=",
  experiences: [
    {
      id: "exp1",
      company: "TechNova Solutions",
      title: "Senior Full Stack Engineer",
      startDate: "2023-01-01",
      endDate: "Present",
      description:
        "Led a team of 5 engineers to re-architect the legacy monolith into Next.js distributed services. Improved web vitals by 40%. Implemented an advanced output pipeline generating dynamic PDFs for user profiles.",
      location: "San Francisco, CA",
    },
    {
      id: "exp2",
      company: "CloudScale Inc.",
      title: "Full Stack Developer",
      startDate: "2020-05-01",
      endDate: "2022-12-31",
      description:
        "Developed scalable REST APIs and serverless workflows on AWS. Integrated real-time features using WebSockets and managed complex state with Redux across various React frontends.",
      location: "Remote",
    },
    {
      id: "exp3",
      company: "Career Break",
      title: "Sabbatical / Open Source Contributor",
      startDate: "2019-11-01",
      endDate: "2020-04-30",
      description:
        "Took time off to travel and contribute to open-source projects including Next.js and Tailwind CSS documentation. Built several small projects to understand edge-routing concepts.",
    },
    {
      id: "exp4",
      company: "NovaStream",
      title: "Software Engineer II",
      startDate: "2018-02-01",
      endDate: "2019-10-31",
      description:
        "Worked on backend microservices handling high-volume transaction data in Node.js. Optimized database queries using PostgreSQL resulting in 25% faster average response times.",
      location: "New York, NY",
    },
    {
      id: "exp5",
      company: "Stellar Startup",
      title: "Frontend Developer",
      startDate: "2016-08-01",
      endDate: "2018-01-31",
      description:
        "Created an internal dashboard leveraging React. Built reusable charting components and integrated third-party payment gateways for subscription processing.",
      location: "Austin, TX",
    },
    {
      id: "exp6",
      company: "WebWorks Agency",
      title: "Junior Web Developer",
      startDate: "2015-06-01",
      endDate: "2016-07-31",
      description:
        "Developed interactive websites for small business clients using standard web technologies. Handled cross-browser compatibility and responsive design issues.",
      location: "Miami, FL",
    },
  ],
  educations: [
    {
      id: "edu1",
      institution: "State University",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2011-09-01",
      endDate: "2015-05-30",
    },
  ],
  skills: [
    { id: "mock-skill-0", name: "React.js" },
    { id: "mock-skill-1", name: "Next.js" },
    { id: "mock-skill-2", name: "TypeScript" },
    { id: "mock-skill-3", name: "Node.js" },
    { id: "mock-skill-4", name: "PostgreSQL" },
  ],
  certifications: [
    {
      id: "mock-cert-0",
      name: "AWS Certified Solutions Architect",
      authority: "Amazon Web Services",
      startDate: "2023",
      endDate: "2026",
    },
  ],
  projects: [
    {
      id: "mock-proj-0",
      title: "Issue Tracker",
      description:
        "Built an internal bug tracking system utilizing Next.js, Prisma, and Tailwind CSS. Implemented a responsive drag-and-drop Kanban board.",
    },
  ],
};
