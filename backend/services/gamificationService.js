const User = require("../models/User");
const Notification = require("../models/Notification");
const Achievement = require("../models/Achievement");

const BADGE_TEMPLATES = {
  FIRST_NOTE: {
    title: "Note Scholar",
    description: "Created your first study note!",
    badgeIcon: "🧠",
  },
  FIRST_GOAL: {
    title: "Goal Getter",
    description: "Completed your first study goal!",
    badgeIcon: "🎯",
  },
  FIRST_FOCUS: {
    title: "Deep Focus",
    description: "Completed your first focus session!",
    badgeIcon: "⚡",
  },
  FIRST_RESOURCE: {
    title: "Vault Contributor",
    description: "Uploaded your first learning resource!",
    badgeIcon: "📁",
  },
  CENTURY_XP: {
    title: "Centurion Scholar",
    description: "Reached over 100 XP points!",
    badgeIcon: "💯",
  },
  SUPER_STREAK: {
    title: "Streak Warrior",
    description: "Maintained a consistent learning streak!",
    badgeIcon: "🔥",
  },
};

const awardXP = async (userId, amount, reason) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Accumulate XP
    user.xp += amount;
    const oldLevel = user.level;
    const newLevel = Math.floor(user.xp / 100) + 1;

    let notificationsToCreate = [];

    // Add XP gain notification
    notificationsToCreate.push(
      new Notification({
        user: userId,
        message: `Earned +${amount} XP for: ${reason}!`,
      })
    );

    // Level up check
    if (newLevel > oldLevel) {
      user.level = newLevel;
      notificationsToCreate.push(
        new Notification({
          user: userId,
          message: `🎉 Level Up! You reached Level ${newLevel}! Keep pushing!`,
        })
      );
    }

    // Unlocking badges checks
    const currentBadges = user.badges || [];

    // Note Scholar
    if (reason === "Creating a Note" && !currentBadges.includes("Note Scholar")) {
      user.badges.push("Note Scholar");
      await unlockAchievement(userId, BADGE_TEMPLATES.FIRST_NOTE, notificationsToCreate);
    }

    // Goal Getter
    if (reason === "Completing a Goal" && !currentBadges.includes("Goal Getter")) {
      user.badges.push("Goal Getter");
      await unlockAchievement(userId, BADGE_TEMPLATES.FIRST_GOAL, notificationsToCreate);
    }

    // Deep Focus
    if (reason === "Completing a Focus Session" && !currentBadges.includes("Deep Focus")) {
      user.badges.push("Deep Focus");
      await unlockAchievement(userId, BADGE_TEMPLATES.FIRST_FOCUS, notificationsToCreate);
    }

    // Vault Contributor
    if (reason === "Uploading a Resource" && !currentBadges.includes("Vault Contributor")) {
      user.badges.push("Vault Contributor");
      await unlockAchievement(userId, BADGE_TEMPLATES.FIRST_RESOURCE, notificationsToCreate);
    }

    // Centurion Scholar
    if (user.xp >= 100 && !currentBadges.includes("Centurion Scholar")) {
      user.badges.push("Centurion Scholar");
      await unlockAchievement(userId, BADGE_TEMPLATES.CENTURY_XP, notificationsToCreate);
    }

    // Streak Warrior
    if (user.streak >= 3 && !currentBadges.includes("Streak Warrior")) {
      user.badges.push("Streak Warrior");
      await unlockAchievement(userId, BADGE_TEMPLATES.SUPER_STREAK, notificationsToCreate);
    }

    // Save notifications and User
    await user.save();
    if (notificationsToCreate.length > 0) {
      await Notification.insertMany(notificationsToCreate);
    }

    return user;
  } catch (error) {
    console.error("Error in gamification service awardXP:", error.message);
  }
};

const unlockAchievement = async (userId, badge, notificationsList) => {
  try {
    const newAchievement = new Achievement({
      user: userId,
      title: badge.title,
      description: badge.description,
      badgeIcon: badge.badgeIcon,
    });
    await newAchievement.save();
    notificationsList.push(
      new Notification({
        user: userId,
        message: `🏆 Badge Unlocked: ${badge.badgeIcon} ${badge.title} - ${badge.description}`,
      })
    );
  } catch (err) {
    console.error("Error unlocking achievement:", err.message);
  }
};

module.exports = {
  awardXP,
  BADGE_TEMPLATES,
};
