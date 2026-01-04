// data/worldMissions.js
export const worlds = {
  jenkins: [
    {
      id: 1,
      title: "Build Your First CI Pipeline",
      description:
        "Install Jenkins and set up your first automated build job. Learn the basics of CI.",
      xp: 100,
      locked: false,
      completed: false,
    },
    {
      id: 2,
      title: "Automate Testing with Jenkinsfile",
      description:
        "Create a Jenkinsfile to define build and test stages. Explore pipeline scripting.",
      xp: 200,
      locked: true,
      completed: false,
    },
    {
      id: 3,
      title: "Integrate Git with Jenkins",
      description:
        "Link your Git repo to Jenkins to auto-trigger builds on commits.",
      xp: 300,
      locked: true,
      completed: false,
    },
  ],
  docker: [
    {
      id: 1,
      title: "Build and Run Containers",
      description:
        "Learn the basics of Docker — build images, run containers, and explore Docker Hub.",
      xp: 100,
      locked: false,
      completed: false,
    },
    {
      id: 2,
      title: "Docker Compose",
      description:
        "Combine multiple containers using Docker Compose for multi-service apps.",
      xp: 200,
      locked: true,
      completed: false,
    },
  ],
};
