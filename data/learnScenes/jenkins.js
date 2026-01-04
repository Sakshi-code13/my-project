// /data/learnScenes/jenkins.js
export const jenkinsLearnScenes = [
  {
    id: 1,
    title: "The Awakening of Jenkins",
    dialogues: [
      { text: "🌩️ The Automation Castle hums with energy...", voice: "intro.mp3" },
      { text: "Greetings, Engineer! I am Jenkins — your automation ally.", voice: "purpose.mp3" },
      { text: "In this realm, I help you automate builds, tests, and deployments.", voice: "explain_cicd.mp3" },
      { text: "Each build you trigger is a spell of automation flowing through code.", voice: "purpose.mp3" }
    ],
    quiz: {
      question: "What does CI/CD stand for?",
      options: [
        "Continuous Improvement and Development",
        "Continuous Integration and Continuous Deployment",
        "Code Implementation and Debugging"
      ],
      correct: "Continuous Integration and Continuous Deployment"
    },
    outro: {
      text: "Well done, Engineer. Prepare for your first mission — Jenkins Core awaits.",
      voice: "outro.mp3"
    }
  },

  {
    id: 2,
    title: "Forging the Core: Installation & Your First Job",
    dialogues: [
      { text: "Welcome back, Developer. You’ve awakened Jenkins... but now, you must build him.", voice: "install_intro.mp3" },
      { text: "To install me, you’ll need Java first — the lifeblood that powers my automation circuits.", voice: "install_java.mp3" },
      { text: "Then, summon me with the command: java -jar jenkins.war — and I’ll come alive at port eight thousand eighty.", voice: "install_run.mp3" },
      { text: "The browser opens... a secret key awaits... and once entered — behold, the Jenkins dashboard!", voice: "install_dashboard.mp3" },
      { text: "From here, your journey begins — create your first job. Click 'New Item', give it a name, and select 'Freestyle project'.", voice: "install_job.mp3" },
      { text: "Each job is a spell — define what it builds, where, and when. The more precise, the more powerful.", voice: "install_freestyle.mp3" },
      { text: "You can link a Git repository, add shell commands, and trigger builds automatically.", voice: "install_git.mp3" },
      { text: "Try your first run — watch as the console logs pulse with energy. That’s automation, live and breathing.", voice: "install_build.mp3" }
    ],
    quiz: {
      question: "Which command brings Jenkins to life?",
      quizVoice: "install_quiz.mp3",
      options: [
        "jenkins --start",
        "java -jar jenkins.war",
        "run jenkins.sh"
      ],
      correct: "java -jar jenkins.war",
      correctVoice: "install_correct.mp3",
      wrongVoice: "install_wrong.mp3"
    },
    keyConcepts: [
      { term: "Java Requirement", meaning: "Jenkins runs on Java — install JDK 11 or higher." },
      { term: "Jenkins WAR File", meaning: "A standalone web app that launches Jenkins with `java -jar jenkins.war`." },
      { term: "Initial Admin Password", meaning: "A temporary key Jenkins generates for first-time login." },
      { term: "Freestyle Project", meaning: "A simple build job type to execute scripts, commands, or code pipelines." }
    ],
    outro: {
      text: "Well done, developer. Jenkins is now operational — your automation core is complete.",
      voice: "install_success.mp3",
      next: "reactor_instructions.mp3"
    }
  },

  {
  id: 3,
  title: "The Master–Agent System",
  dialogues: [
    {
      text: "Jenkins has grown, Developer. One node can no longer bear all automation loads.",
      voice: "master_agent_intro.mp3",
    },
    {
      text: "Enter the Master–Agent System. The master — orchestrator of all tasks. Agents — your tireless workers.",
      voice: "master_agent_roles.mp3",
    },
    {
      text: "Each agent connects to the master — via SSH, JNLP, or cloud integrations.",
      voice: "master_agent_connection.mp3",
    },
    {
      text: "They take jobs, execute builds, and return results. The master commands — agents perform.",
      voice: "master_agent_function.mp3",
    },
    {
      text: "Distribute your builds wisely, Engineer. This is how Jenkins achieves true scalability.",
      voice: "master_agent_scaling.mp3",
    },
  ],

  quiz: {
    question: "What is the main role of a Jenkins agent?",
    quizVoice: "master_agent_quiz.mp3",
    options: [
      "To manage Jenkins plugins and UI",
      "To execute build tasks sent by the master",
      "To store Jenkins configuration files"
    ],
    correct: "To execute build tasks sent by the master",
    correctVoice: "master_agent_correct.mp3",
    wrongVoice: "master_agent_wrong.mp3"
  },

  keyConcepts: [
    { term: "Master Node", meaning: "Controls Jenkins operations — schedules builds, manages configurations, and distributes jobs." },
    { term: "Agent Node", meaning: "A machine connected to Jenkins Master that executes build tasks." },
    { term: "Executor", meaning: "A processing slot on an agent — each executor can run one job at a time." },
    { term: "Distributed Build", meaning: "Splitting workloads across multiple nodes to speed up automation." }
  ],

  outro: {
    text: "Well done, Engineer. The Jenkins network awakens — ready for distributed automation.",
    voice: "master_agent_success.mp3",
  },
}, 
{
  id: 4,
  title: "The Trigger Maze: Freestyle Jobs & Build Triggers",
  dialogues: [
    {
      text: "Welcome back, Engineer. You now command the Jenkins Automation Hall.",
      voice: "trigger_intro.mp3"
    },
    {
      text: "Each console here represents a Freestyle Job — your first true automated task.",
      voice: "trigger_job_intro.mp3"
    },
    {
      text: "A job defines what to build, where to fetch code from, and how to execute it.",
      voice: "trigger_define.mp3"
    },
    {
      text: "You can trigger builds manually, or automate them through SCM polling or scheduled runs.",
      voice: "trigger_methods.mp3"
    },
    {
      text: "For instance — polling SCM every five minutes ensures Jenkins detects new commits automatically.",
      voice: "trigger_polling.mp3"
    },
    {
      text: "You can even chain jobs together — one success can awaken another. That’s how pipelines are born.",
      voice: "trigger_chain.mp3"
    }
  ],

  quiz: {
    question: "Which Jenkins trigger automatically detects Git changes?",
    quizVoice:"trigger_quiz.mp3",
    options: [
      "Manual Build",
      "Poll SCM",
      "Build Periodically"
    ],
    correct: "Poll SCM",
    correctVoice: "trigger_correct.mp3",
    wrongVoice: "trigger_wrong.mp3"
  },

  keyConcepts: [
    {
      term: "Freestyle Job",
      meaning: "A basic Jenkins job that can run any build, script, or automation task."
    },
    {
      term: "SCM Polling",
      meaning: "Jenkins checks your repository at intervals for code changes."
    },
    {
      term: "Build Triggers",
      meaning: "Rules that determine when Jenkins should start a build."
    },
    {
      term: "Post-build Action",
      meaning: "Steps that occur after the job succeeds or fails."
    }
  ],

  outro: {
    text: "Excellent! You’ve mastered the Freestyle Matrix. Next, we’ll step into the Code Assembly Room — where Jenkinsfiles breathe life into automation.",
    voice: "trigger_success.mp3"
  }
},
{
  id: 5,
  title: "The Code Assembly Room: Pipelines as Code (Jenkinsfile)",
  dialogues: [
    {
      text: "In Jenkins, automation can be defined as code — meet the Jenkinsfile.",
      voice: "jenkins_pipeline_intro.mp3",
    },
    {
      text: "Declarative pipelines use structured stages, agents, and steps.",
      voice: "jenkins_declarative.mp3",
    },
    {
      text: "Scripted pipelines offer freedom through Groovy — but require mastery.",
      voice: "jenkins_scripted.mp3",
    },
  ],

  quiz: {
    question: "Which of these represents a Declarative pipeline syntax?",
    quizVoice: "jenkins_quiz_pipeline.mp3",
    options: [
      'node { echo "Build" }',
      'pipeline { agent any; stages { stage("Build") { steps { echo "Building..." } } } }',
      'def buildJob = "MyBuildJob"',
      'script { echo "Run build" }',
    ],
    correct: 'pipeline { agent any; stages { stage("Build") { steps { echo "Building..." } } } }',
  },

  outro: {
    text: "Well done. You now understand how Jenkins pipelines are written as code.",
  },
}, 
{
  id: 6,
  title: "Plugins & Customization",
  dialogues: [
    {
      text: "Plugins are the DNA of Jenkins — they extend its abilities beyond the core.",
      voice: "jenkins_plugins_intro.mp3"
    },
    {
      text: "You can install plugins for source control, notifications, testing, and deployment.",
      
    },
    {
      text: "For example — Git, Slack, and Docker integrations are all made possible through plugins.",
      voice: "jenkins_plugins_examples.mp3"
    },
    {
      text: "But beware — too many plugins can slow Jenkins down. Manage them wisely.",
      voice: "jenkins_plugins_caution.mp3"
    }
  ],
  quiz: {
    question: "Which Jenkins plugin enables integration with Git repositories?",
    options: ["JUnit", "Git Plugin", "Slack Notifier", "Pipeline Utility Steps"],
    correct: "Git Plugin",
    quizVoice: "jenkins_quiz_plugins.mp3",
    correctVoice: "jenkins_correct.mp3",
    wrongVoice: "trigger_wrong.mp3"
  },
  outro: {
    text: "Excellent work! You now understand how Jenkins gains its superpowers through plugins.",
    voice: "jenkins_plugins_outro.mp3"
  }
}, 
{
  id: 7,
  title: "The Vault of Secrets",
  dialogues: [
    {
      text: "Welcome to Jenkins’ Vault — where automation’s most sensitive credentials are guarded.",
      voice: "jenkins_vault_intro.mp3",
    },
    {
      text: "Jenkins Credentials store protects secrets like passwords, SSH keys, and tokens.",
      voice: "jenkins_credentials_types.mp3",
    },
    {
      text: "To use them securely, Jenkins masks them inside pipeline code with the withCredentials block.",
      voice: "jenkins_vault_use.mp3",
    },
    {
      text: "Let’s see how it looks in action.",
    },
  ],
  codeExample: `pipeline {
  agent any
  environment {
    API_KEY = credentials('my-secret-api-key')
  }
  stages {
    stage('Secure Access') {
      steps {
        withCredentials([string(credentialsId: 'api-key', variable: 'KEY')]) {
          sh 'curl -H "Authorization: $KEY" https://api.example.com'
        }
      }
    }
  }
}`,
  quiz: {
    question: "Which method securely accesses credentials in Jenkins pipelines?",
    options: [
      "Directly echoing environment variables",
      "Storing API keys in plain text",
      "Using the withCredentials block",
      "Embedding passwords in Groovy scripts",
    ],
    correct: "Using the withCredentials block",
    quizVoice: "jenkins_vault_quiz.mp3",
    correctVoice: "jenkins_vault_correct.mp3",
    wrongVoice: "jenkins_vault_wrong.mp3",
  },
  outro: {
    text: "Well done. You now control Jenkins’ most protected vault — guard it well.",
    voice: "jenkins_vault_outro.mp3",
  },
},

{
  id: 8,
  title: "The Debugging Arena: Testing & Reports in Jenkins",
  dialogues: [
    {
      text: "Welcome to the Debugging Arena — where every build faces its trial.",
      voice: "jenkins_testing_intro.mp3"
    },
    {
      text: "JUnit helps Jenkins visualize test results and highlight failed cases automatically.",
      voice: "jenkins_junit.mp3"
    },
    {
      text: "TestNG brings data-driven and grouped testing power — ideal for complex CI workflows.",
      voice: "jenkins_testng.mp3"
    },
    {
      text: "Artifacts keep your reports and screenshots safe — Jenkins archives them for later review.",
      voice: "jenkins_artifacts.mp3"
    }
  ],
  quiz: {
    quizVoice: "jenkins_quiz_testing.mp3",
    question: "Which command lets Jenkins parse and visualize test results?",
    options: [
      "archiveArtifacts 'reports/*.xml'",
      "publishHTML 'report.html'",
      "junit 'reports/*.xml'",
      "input 'Enter test results'"
    ],
    correct: "junit 'reports/*.xml'",
    correctVoice: "trigger2_correct_cron.mp3",
    wrongVoice: "trigger2_wrong.mp3"
  },
  outro: {
    text: "Excellent! Tests passed — reports archived. The Debugging Arena declares you victorious.",
    voice: "jenkins_outro_testing.mp3"
  }
},
// data/learnScenes/jenkins.js (append this)
{
  id: 9,
  title: "The Deployment Deck",
  dialogues: [
    {
      text: "Deployment is where automation meets responsibility. Jenkins now commands your delivery flow.",
      voice: "jenkins_deploy_intro.mp3",
    },
    {
      text: "First stop: Build. Artifacts are produced, tested, and verified.",
      voice: "jenkins_deploy_build.mp3",
    },
    {
      text: "Next, Jenkins deploys to Staging — a safe environment that mirrors Production.",
      voice: "jenkins_deploy_staging.mp3",
    },
    {
      text: "After approvals, Jenkins promotes the same artifact to Production — no manual rebuilds.",
      voice: "jenkins_deploy_prod.mp3",
    },
    {
      text: "If errors occur, automated rollback scripts restore stability instantly.",
      voice: "jenkins_deploy_rollback.mp3",
    },
  ],
  quiz: {
    question:
      "Build 142 passed staging but shows performance drops in Production. What should Jenkins do?",
    options: [
      "Force deploy to Production anyway",
      "Rollback to last stable build",
      "Rebuild from source manually",
    ],
    correct: "Rollback to last stable build",
    quizVoice: "jenkins_quiz_deploy.mp3",
    correctVoice: "jenkins_correct_deploy.mp3",
    wrongVoice: "jenkins_wrong_deploy.mp3",
  },
  outro: {
    text: "Mission ready: The Deployment Deck awaits your command.",
    voice: "jenkins_deploy_outro.mp3",
  },
}



];
