// /data/progression.js

export const progression = {
  jenkins: [
    { id: 1, learn: "/learn/jenkins/1", mission: "/mission/jenkins/1", learnXp: 50, missionXp: 100 },
    { id: 2, learn: "/learn/jenkins/2", mission: "/mission/jenkins/2", learnXp: 60, missionXp: 120 },
    { id: 3, learn: "/learn/jenkins/3", mission: "/mission/jenkins/3", learnXp: 70, missionXp: 130 },
    { id: 4, learn: "/learn/jenkins/4", mission: "/mission/jenkins/4", learnXp: 80, missionXp: 140 },
    { id: 5, learn: "/learn/jenkins/5", mission: "/mission/jenkins/5", learnXp: 90, missionXp: 150 },
    { id: 6, learn: "/learn/jenkins/6", mission: "/mission/jenkins/6", learnXp: 100, missionXp: 160 },
    { id: 7, learn: "/learn/jenkins/7", mission: "/mission/jenkins/7", learnXp: 110, missionXp: 170 },
    { id: 8, learn: "/learn/jenkins/8", mission: "/mission/jenkins/8", learnXp: 120, missionXp: 180 },
    { id: 9, learn: "/learn/jenkins/9", mission: "/mission/jenkins/9", learnXp: 130, missionXp: 190 },
    { id: 10, learn: "/learn/jenkins/10", mission: "/mission/jenkins/10", learnXp: 140, missionXp: 200 },
    { id: 11, learn: "/learn/jenkins/11", mission: "/mission/jenkins/11", learnXp: 150, missionXp: 210 },
    { id: 12, learn: "/learn/jenkins/12", mission: "/mission/jenkins/12", learnXp: 160, missionXp: 220 },
  ],
};

export const totalParts = 12;

// ✅ Get XP rewards dynamically from the table
export function getLearnXp(topic, part) {
  const t = progression[topic];
  if (!t) return 0;
  return t.find((p) => p.id === part)?.learnXp || 0;
}

export function getMissionXp(topic, part) {
  const t = progression[topic];
  if (!t) return 0;
  return t.find((p) => p.id === part)?.missionXp || 0;
}

// ✅ Correctly redirect to *this part’s* mission after a Learn
export function getNextAfterLearn(topic, part) {
  if (topic === "jenkins") {
    return `/mission/${topic}/${part}`;
  }
  return "/";
}


// ✅ Correctly redirect to *next part’s* Learn after a Mission
export function getNextAfterMission(topic, part) {
  const t = progression[topic];
  if (!t) return `/world?character=${topic}`;
  const next = t.find((p) => p.id === part + 1);
  return next?.learn || `/world?character=${topic}`;
}
