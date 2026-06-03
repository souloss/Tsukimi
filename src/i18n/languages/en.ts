import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	[Key.archive]: "Archive",
	[Key.search]: "Search",
	[Key.other]: "Other",

	// Navigation bar titles
	[Key.navLinks]: "Links",
	[Key.navMy]: "My",
	[Key.navAbout]: "About",
	[Key.navOthers]: "Others",
	[Key.navContent]: "Content",
	[Key.navInteraction]: "Interaction",

	[Key.tags]: "Tags",
	[Key.tagAll]: "All",
	[Key.categories]: "Categories",
	[Key.recentPosts]: "Recent Posts",
	[Key.postList]: "Post List",
	[Key.tableOfContents]: "Table of Contents",
	[Key.tocEmpty]: "No table of contents",

	// Announcement
	[Key.announcement]: "Announcement",
	[Key.announcementClose]: "Close",

	[Key.comments]: "Comments",
	[Key.friends]: "Friends",
	[Key.friendsTitle]: "Friends",
	[Key.friendsDescription]: "Discover more great websites",
	[Key.friendsSubtitle]: "Discover more great websites",
	[Key.friendsSearchPlaceholder]: "Search friend's name or description...",
	[Key.friendsFilterAll]: "All",
	[Key.friendsNoResults]: "No matching friends found",
	[Key.friendsVisit]: "Visit",
	[Key.friendsCopyLink]: "Copy Link",
	[Key.friendsCopySuccess]: "Copied",
	[Key.friendsTags]: "Tags",
	[Key.untitled]: "Untitled",
	[Key.uncategorized]: "Uncategorized",
	[Key.noTags]: "No Tags",

	[Key.wordCount]: "word",
	[Key.wordsCount]: "words",
	[Key.minuteCount]: "minute",
	[Key.minutesCount]: "minutes",
	[Key.postCount]: "post",
	[Key.postsCount]: "posts",

	[Key.themeColor]: "Theme Color",

	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",
	[Key.systemMode]: "System",

	[Key.more]: "More",

	[Key.author]: "Author",
	[Key.publishedAt]: "Published at",
	[Key.license]: "License",
	[Key.anime]: "Anime",
	[Key.talking]: "Moments",

	// Anime Page
	[Key.animeTitle]: "My Anime List",
	[Key.animeSubtitle]: "Record my anime journey",
	[Key.animeStatusWatching]: "Watching",
	[Key.animeStatusCompleted]: "Completed",
	[Key.animeStatusPlanned]: "Planned",
	[Key.animeStatusOnHold]: "On Hold",
	[Key.animeStatusDropped]: "Dropped",
	[Key.animeFilterAll]: "All",
	[Key.animeYear]: "Year",
	[Key.animeStudio]: "Studio",
	[Key.animeEmpty]: "No anime data available",
	[Key.animeEmptyBangumi]:
		"Please check Bangumi configuration or network connection",
	[Key.animeEmptyBilibili]:
		"Please check Bilibili configuration or network connection",
	[Key.animeEmptyLocal]:
		"Please add anime information in src/data/anime.ts file",
	[Key.animeConfigBilibili]:
		"Please set your Bilibili vmid in the src/config.ts file",
	[Key.animeConfigBangumi]:
		"Please set your Bangumi userId in the src/config.ts file",

	// Diary Page
	[Key.talkingSubtitle]: "Share life, anytime, anywhere",
	[Key.talkingNoResults]: "No matching moments",
	[Key.talkingCount]: "moments",

	[Key.talkingTips]: "Only show the latest 30 moments",
	[Key.talkingMinutesAgo]: "minutes ago",
	[Key.talkingHoursAgo]: "hours ago",
	[Key.talkingDaysAgo]: "days ago",

	// 404 Page
	[Key.notFound]: "404",
	[Key.notFoundTitle]: "Page Not Found",
	[Key.notFoundDescription]:
		"Sorry, the page you visited does not exist or has been moved.",
	[Key.backToHome]: "Back to Home",

	// Music Player
	[Key.musicPlayer]: "Music Player",
	[Key.musicPlayerShow]: "Show Music Player",
	[Key.musicPlayerHide]: "Hide Music Player",
	[Key.musicPlayerExpand]: "Expand Music Player",
	[Key.musicPlayerCollapse]: "Collapse Music Player",
	[Key.musicPlayerPause]: "Pause",
	[Key.musicPlayerPlay]: "Play",
	[Key.musicPlayerPrevious]: "Previous",
	[Key.musicPlayerNext]: "Next",
	[Key.musicPlayerShuffle]: "Shuffle",
	[Key.musicPlayerRepeat]: "Repeat All",
	[Key.musicPlayerRepeatOne]: "Repeat One",
	[Key.musicPlayerVolume]: "Volume Control",
	[Key.musicPlayerProgress]: "Playback Progress",
	[Key.musicPlayerCover]: "Cover",
	[Key.musicPlayerPlaylist]: "Playlist",
	[Key.musicPlayerLoading]: "Loading...",
	[Key.musicPlayerErrorPlaylist]: "Failed to fetch playlist",
	[Key.musicPlayerErrorSong]: "Failed to load current song, trying next",
	[Key.musicPlayerErrorEmpty]: "No available songs in playlist",
	[Key.unknownSong]: "Unknown Song",
	[Key.unknownArtist]: "Unknown Artist",

	// Albums Page
	[Key.albums]: "Albums",
	[Key.albumsSubtitle]: "Record beautiful moments in life",
	[Key.albumsEmpty]: "No content",
	[Key.albumsEmptyDesc]:
		"No albums have been created yet. Go add some beautiful memories!",
	[Key.albumsBackToList]: "Back to Albums",

	// Devices Page
	[Key.devices]: "My Devices",
	[Key.devicesSubtitle]: "Here are the devices I use in my daily life",
	[Key.devicesViewDetails]: "View Details",
	[Key.albumsPhotoCount]: "photo",
	[Key.albumsPhotosCount]: "photos",
	[Key.albumsFilterAll]: "All",
	[Key.albumsNoResults]: "No matching albums",

	// Projects Page
	[Key.projects]: "Projects",
	[Key.projectsSubtitle]: "My development project portfolio",
	[Key.projectsAll]: "All",
	[Key.projectsWeb]: "Web Applications",
	[Key.projectsMobile]: "Mobile Applications",
	[Key.projectsDesktop]: "Desktop Applications",
	[Key.projectsOther]: "Other",
	[Key.projectTechStack]: "Tech Stack",
	[Key.projectLiveDemo]: "Live Demo",
	[Key.projectSourceCode]: "Source Code",
	[Key.projectDescription]: "Project Description",
	[Key.projectStatus]: "Status",
	[Key.projectStatusCompleted]: "Completed",
	[Key.projectStatusInProgress]: "In Progress",
	[Key.projectStatusPlanned]: "Planned",
	[Key.projectsTotal]: "Total Projects",
	[Key.projectsCompleted]: "Completed",
	[Key.projectsInProgress]: "In Progress",
	[Key.projectsTechStack]: "Tech Stack Statistics",
	[Key.projectsFeatured]: "Featured Projects",
	[Key.projectsPlanned]: "Planned",
	[Key.projectsDemo]: "Live Demo",
	[Key.projectsSource]: "Source Code",
	[Key.projectsVisit]: "Visit Project",
	[Key.projectsGitHub]: "GitHub",

	// RSS Page
	[Key.rss]: "RSS Feed",
	[Key.rssDescription]: "Subscribe to get latest updates",
	[Key.rssSubtitle]:
		"Subscribe via RSS to get the latest articles and updates immediately",
	[Key.rssLink]: "RSS Link",
	[Key.rssCopyToReader]: "Copy link to your RSS reader",
	[Key.rssCopyLink]: "Copy",
	[Key.rssLatestPosts]: "Latest Posts",
	[Key.rssWhatIsRSS]: "What is RSS?",
	[Key.rssWhatIsRSSDescription]:
		"RSS (Really Simple Syndication) is a standard format for publishing frequently updated content. With RSS, you can:",
	[Key.rssBenefit1]:
		"Get latest website content in time without manually visiting",
	[Key.rssBenefit2]: "Manage subscriptions to multiple websites in one place",
	[Key.rssBenefit3]: "Avoid missing important updates and articles",
	[Key.rssBenefit4]: "Enjoy an ad-free, clean reading experience",
	[Key.rssHowToUse]:
		"It is recommended to use Feedly, Inoreader or other RSS readers to subscribe to this site.",
	[Key.rssCopied]: "RSS link copied to clipboard!",
	[Key.rssCopyFailed]: "Copy failed, please copy the link manually",

	// Atom Page
	[Key.atom]: "Atom Feed",
	[Key.atomDescription]: "Subscribe to get latest updates",
	[Key.atomSubtitle]:
		"Subscribe via Atom to get the latest articles and updates immediately",
	[Key.atomLink]: "Atom Link",
	[Key.atomCopyToReader]: "Copy link to your Atom reader",
	[Key.atomCopyLink]: "Copy",
	[Key.atomLatestPosts]: "Latest Posts",
	[Key.atomWhatIsAtom]: "What is Atom?",
	[Key.atomWhatIsAtomDescription]:
		"Atom (Atom Syndication Format) is an XML-based standard for describing feeds and their items. With Atom, you can:",
	[Key.atomBenefit1]:
		"Get latest website content in time without manually visiting",
	[Key.atomBenefit2]: "Manage subscriptions to multiple websites in one place",
	[Key.atomBenefit3]: "Avoid missing important updates and articles",
	[Key.atomBenefit4]: "Enjoy an ad-free, clean reading experience",
	[Key.atomHowToUse]:
		"It is recommended to use Feedly, Inoreader or other Atom readers to subscribe to this site.",
	[Key.atomCopied]: "Atom link copied to clipboard!",
	[Key.atomCopyFailed]: "Copy failed, please copy the link manually",

	// Wallpaper mode
	[Key.wallpaperBanner]: "Banner Mode",
	[Key.wallpaperFullscreen]: "Fullscreen Mode",
	[Key.wallpaperNone]: "Hide Wallpaper",

	// Skills Page
	[Key.skills]: "Skills",
	[Key.skillsSubtitle]: "My technical skills and expertise",
	[Key.skillsFrontend]: "Frontend Development",
	[Key.skillsBackend]: "Backend Development",
	[Key.skillsDatabase]: "Database",
	[Key.skillsTools]: "Development Tools",
	[Key.skillsOther]: "Other Skills",
	[Key.skillLevel]: "Proficiency",
	[Key.skillLevelBeginner]: "Beginner",
	[Key.skillLevelIntermediate]: "Intermediate",
	[Key.skillLevelAdvanced]: "Advanced",
	[Key.skillLevelExpert]: "Expert",
	[Key.skillExperience]: "Experience",
	[Key.skillYears]: "years",
	[Key.skillMonths]: "months",
	[Key.skillsTotal]: "Total Skills",
	[Key.skillsExpert]: "Expert Level",
	[Key.skillsAdvanced]: "Advanced",
	[Key.skillsIntermediate]: "Intermediate",
	[Key.skillsBeginner]: "Beginner",
	[Key.skillsAdvancedTitle]: "Professional Skills",
	[Key.skillsProjects]: "Related Projects",
	[Key.skillsDistribution]: "Skill Distribution",
	[Key.skillsByLevel]: "By Level",
	[Key.skillsByCategory]: "By Category",
	[Key.noData]: "No data",

	// Timeline Page
	[Key.timeline]: "Timeline",
	[Key.timelineSubtitle]: "My growth journey and important milestones",
	[Key.timelineEducation]: "Education",
	[Key.timelineWork]: "Work Experience",
	[Key.timelineProject]: "Project Experience",
	[Key.timelineAchievement]: "Achievements",
	[Key.timelinePresent]: "Present",
	[Key.timelineLocation]: "Location",
	[Key.timelineDescription]: "Detailed Description",
	[Key.timelineMonths]: "months",
	[Key.timelineYears]: "years",
	[Key.timelineTotal]: "Total",
	[Key.timelineProjects]: "Projects",
	[Key.timelineExperience]: "Work Experience",
	[Key.timelineCurrent]: "Current Status",
	[Key.timelineHistory]: "History",
	[Key.timelineAchievements]: "Achievements",
	[Key.timelineStartDate]: "Start Date",
	[Key.timelineDuration]: "Duration",

	// Password Protection
	[Key.passwordProtected]: "Password Protected",
	[Key.passwordProtectedTitle]: "This content is password protected",
	[Key.passwordProtectedDescription]:
		"Please enter the password to view the protected content",
	[Key.postEncrypted]: "Encrypted",
	[Key.postEncryptedMessage]: "This post is encrypted",
	[Key.passwordPlaceholder]: "Enter password",
	[Key.passwordUnlock]: "Unlock",
	[Key.passwordUnlocking]: "Unlocking...",
	[Key.passwordIncorrect]: "Incorrect password, please try again",
	[Key.passwordDecryptError]:
		"Decryption failed, please check if the password is correct",
	[Key.passwordRequired]: "Please enter the password",
	[Key.passwordVerifying]: "Verifying...",
	[Key.passwordDecryptFailed]: "Decryption failed, please check the password",
	[Key.passwordDecryptRetry]: "Decryption failed, please try again",
	[Key.passwordUnlockButton]: "Unlock",
	[Key.copyFailed]: "Copy failed:",
	[Key.syntaxHighlightFailed]: "Syntax highlighting failed:",
	[Key.autoSyntaxHighlightFailed]: "Automatic syntax highlighting also failed:",
	[Key.decryptionError]: "An error occurred during decryption:",
	[Key.passwordHint]: "Hint",

	// Last Modified Time Card
	[Key.lastModifiedPrefix]: "Time since last edit: ",
	[Key.lastModifiedOutdated]: "Some information may be outdated",
	[Key.year]: "y",
	[Key.month]: "m",
	[Key.day]: "d",
	[Key.hour]: "h",
	[Key.minute]: "min",
	[Key.second]: "s",

	// Site Stats
	[Key.siteStats]: "Site Statistics",
	[Key.siteStatsPostCount]: "Posts",
	[Key.siteStatsCategoryCount]: "Categories",
	[Key.siteStatsTagCount]: "Tags",
	[Key.siteStatsTotalWords]: "Total Words",
	[Key.siteStatsRunningDays]: "Running Days",
	[Key.siteStatsLastUpdate]: "Last Activity",
	[Key.siteStatsDaysAgo]: "{days} days ago",
	[Key.siteStatsDays]: "{days} days",

	// Calendar Component
	[Key.calendarSunday]: "Sun",
	[Key.calendarMonday]: "Mon",
	[Key.calendarTuesday]: "Tue",
	[Key.calendarWednesday]: "Wed",
	[Key.calendarThursday]: "Thu",
	[Key.calendarFriday]: "Fri",
	[Key.calendarSaturday]: "Sat",
	[Key.calendarJanuary]: "Jan",
	[Key.calendarFebruary]: "Feb",
	[Key.calendarMarch]: "Mar",
	[Key.calendarApril]: "Apr",
	[Key.calendarMay]: "May",
	[Key.calendarJune]: "Jun",
	[Key.calendarJuly]: "Jul",
	[Key.calendarAugust]: "Aug",
	[Key.calendarSeptember]: "Sep",
	[Key.calendarOctober]: "Oct",
	[Key.calendarNovember]: "Nov",
	[Key.calendarDecember]: "Dec",

	// Share Functionality
	[Key.shareArticle]: "Share",
	[Key.generatingPoster]: "Generating poster...",
	[Key.copied]: "Copied",
	[Key.copyLink]: "Copy Link",
	[Key.savePoster]: "Save Poster",
	[Key.scanToRead]: "Source",
	[Key.shareOnSocial]: "Share",
	[Key.shareOnSocialDescription]:
		"If this article helped you, please share it with others!",
	[Key.shareCopy]: "Copy Link",
	[Key.shareOnX]: "X",
	[Key.shareOnTelegram]: "Telegram",
	[Key.shareOnWeibo]: "Weibo",

	// Profile Stats
	[Key.profileStatsLoading]: "Loading stats...",
	[Key.profileStatsPageViews]: "Page views",
	[Key.profileStatsVisits]: "Visits",
	[Key.profileStatsUnavailable]: "Stats unavailable",

	// Page Views Stats
	[Key.pageViewsLoading]: "Loading stats...",
	[Key.pageViewsUnavailable]: "Stats unavailable",

	// Umami Analytics Stats
	[Key.umamiStats]: "Analytics",
	[Key.umamiStatsPageViews]: "Page Views",
	[Key.umamiStatsVisits]: "Visits",
	[Key.umamiStatsVisitors]: "Visitors",

	// Layout Switch Button
	[Key.switchToGridMode]: "Switch to Grid Mode",
	[Key.switchToListMode]: "Switch to List Mode",

	// Series
	[Key.series]: "Series",
	[Key.seriesNav]: "Series Navigation",
	[Key.prevInSeries]: "Previous in series",
	[Key.nextInSeries]: "Next in series",
	[Key.allSeries]: "All Series",
	[Key.seriesCount]: "series",
	[Key.seriesTotalPosts]: "posts in series",
	[Key.seriesLatestUpdate]: "Latest update",
	[Key.seriesNoSeries]: "No series yet",
	[Key.seriesArticlesShort]: "articles",
	[Key.seriesMoreArticles]: "more articles",
	[Key.seriesDesc]: "Posts in the {name} series",

	// Repost
	[Key.reposts]: "Reposts",
	[Key.allReposts]: "All Reposts",
	[Key.repostFrom]: "Repost from",
	[Key.originalArticle]: "Original article",
	[Key.repostNotice]:
		"This is a repost. The original content belongs to the original author.",
	[Key.repostOriginalSite]: "Original site",
	[Key.repostLicense]: "License",

	// Copyright / License
	[Key.copyrightNotice]: "Copyright Notice",
	[Key.copyrightLicense]: "License",
	[Key.copyrightAuthor]: "Author",
	[Key.copyrightPublishedAt]: "Published",
	[Key.copyrightLink]: "Link",
	[Key.copyOgImage]: "Copy share image",

	// Message Board
	[Key.messageBoard]: "Message Board",
	[Key.messageBoardDesc]: "Leave your thoughts and feedback here",

	// Friends Circle
	[Key.friendsCircle]: "Friends Circle",
	[Key.friendsCircleSubtitle]: "Discover latest updates from friends' blogs",
	[Key.friendsCircleEmpty]: "No updates yet",
	[Key.friendsCircleAgo]: "ago",
	[Key.friendsCircleDay]: "day",
	[Key.friendsCircleHour]: "hour",
	[Key.friendsCircleMinute]: "minute",
	[Key.friendsCircleLoading]: "Loading...",
	[Key.friendsCircleError]: "Failed to fetch data",

	// Related Posts & Random Posts
	[Key.relatedPosts]: "Related Posts",
	[Key.randomPosts]: "Random Posts",
	[Key.smartRecommend]: "Smart",
	[Key.randomRecommend]: "Random",

	// Tags Cloud & Categories Page
	[Key.tagsPage]: "Tags",
	[Key.tagsPageSubtitle]: "Browse all tags",
	[Key.categoriesPage]: "Categories",
	[Key.categoriesPageSubtitle]: "Browse all categories",
	[Key.tagSearchPlaceholder]: "Search tags...",
	[Key.categorySearchPlaceholder]: "Search categories...",
	[Key.totalTags]: "total tags",
	[Key.totalCategories]: "total categories",
	[Key.viewAll]: "View All",
	[Key.postsInTag]: "posts",
	[Key.postsInCategory]: "posts",

	// Archive page filter
	[Key.filtering]: "Filtering",
	[Key.clearFilter]: "Clear filter",

	// Docs
	[Key.docs]: "Docs",
	[Key.docsSearchPlaceholder]: "Search docs...",
	[Key.docsTableOfContents]: "Table of Contents",
	[Key.docsFallbackNotice]:
		"This page is not available in the selected language. Showing the default language version.",
	[Key.docsToggleSidebar]: "Toggle sidebar",
	[Key.docsPrevPage]: "Previous",
	[Key.docsNextPage]: "Next",
	[Key.docsLastUpdated]: "Last updated",
	[Key.docsWordCount]: "words",
	[Key.docsReadingTime]: "Reading time",

	// ========================================
	// New: Translations for features migrated from Firefly
	// ========================================

	// Settings Panel
	[Key.settings]: "Settings",
	[Key.settingsTitle]: "Display Settings",
	[Key.settingsTheme]: "Theme",
	[Key.settingsWallpaper]: "Wallpaper",
	[Key.settingsEffects]: "Effects",
	[Key.settingsPostLayout]: "Post Layout",
	[Key.settingsFont]: "Font",
	[Key.themeHue]: "Theme Hue",
	[Key.themeMode]: "Theme Mode",
	[Key.wallpaperMode]: "Wallpaper Mode",
	[Key.wallpaperOverlay]: "Overlay Mode",
	[Key.wallpaperSettings]: "Wallpaper Settings",
	[Key.wallpaperWaves]: "Wave Effect",
	[Key.wallpaperGradient]: "Gradient Overlay",
	[Key.wallpaperCarousel]: "Carousel",
	[Key.wallpaperBannerTitle]: "Banner Title",
	[Key.wallpaperPosition]: "Wallpaper Position",
	[Key.effectsSakura]: "Sakura Effect",
	[Key.postListLayoutList]: "List Mode",
	[Key.postListLayoutGrid]: "Grid Mode",
	[Key.fontSelector]: "Font Selector",
	[Key.fontSystem]: "System Default",
	[Key.fontLiterata]: "Literata",
	[Key.fontLxgw]: "LXGW WenKai",
	[Key.font2D]: "Anime",
	[Key.stickyNavbar]: "Sticky Navbar",

	// Wallpaper mode buttons
	[Key.wallpaperBannerMode]: "Banner Mode",
	[Key.wallpaperFullscreenMode]: "Fullscreen Mode",
	[Key.wallpaperOverlayMode]: "Overlay Mode",
	[Key.wallpaperNoneMode]: "No Wallpaper",

	// Overlay settings
	[Key.overlayOpacity]: "Opacity",
	[Key.overlayBlur]: "Blur",
	[Key.overlayCardOpacity]: "Card Opacity",
	[Key.overlaySettings]: "Overlay Settings",

	// Wallpaper effects
	[Key.wavesAnimation]: "Wave Animation",
	[Key.gradientTransition]: "Gradient Transition",
	[Key.wallpaperTitle]: "Wallpaper Title",

	// Effects settings
	[Key.effectsSettings]: "Effects Settings",
	[Key.sakuraEffect]: "Sakura Effect",

	// Post list layout
	[Key.postListLayout]: "Post List Layout",

	// Sponsor Page
	[Key.sponsor]: "Sponsor",
	[Key.sponsorTitle]: "Support & Sponsor",
	[Key.sponsorDescription]:
		"If this project has helped you, consider supporting me to keep creating",
	[Key.sponsorMessage]: "Your support is my greatest motivation!",
	[Key.sponsorSupportAndShare]: "Support & Share",
	[Key.sponsorSupport]: "Support the Author",
	[Key.sponsorAlipay]: "Alipay",
	[Key.sponsorWechat]: "WeChat Pay",
	[Key.sponsorQRCode]: "QR Code",
	[Key.sponsorScanToPay]: "Scan to Pay",
	[Key.sponsorGoTo]: "Go to Support",
	[Key.sponsorEmpty]: "No sponsors yet",
	[Key.sponsorList]: "Sponsor List",
	[Key.sponsorThanks]: "Thanks to all sponsors for your support!",
	[Key.sponsorAmount]: "Amount",
	[Key.sponsorDate]: "Date",
	[Key.sponsorNoSponsors]: "No sponsors yet",
	[Key.sponsorApplyInfo]: "Become a Sponsor",
	[Key.sponsorButton]: "Support & Share",
	[Key.sponsorButtonText]:
		"If this article helped you, consider supporting the author or sharing it",

	// Guestbook
	[Key.guestbook]: "Guestbook",
	[Key.guestbookTitle]: "Guestbook",
	[Key.guestbookSubtitle]: "Leave your thoughts and feedback here",
	[Key.guestbookMessage]: "Write a message...",
	[Key.guestbookLeaveMessage]: "Leave a Message",
	[Key.guestbookYourName]: "Your name",
	[Key.guestbookYourEmail]: "Your email (not public)",
	[Key.guestbookYourMessage]: "Your message",
	[Key.guestbookSubmit]: "Submit",
	[Key.guestbookSubmitting]: "Submitting...",
	[Key.guestbookSubmitSuccess]: "Message submitted successfully!",
	[Key.guestbookSubmitError]: "Failed to submit message, please try again",
	[Key.guestbookMessages]: "All Messages",
	[Key.guestbookNoMessages]: "No messages yet, be the first to say something!",
	[Key.guestbookReplied]: "Replied",
	[Key.guestbookReply]: "Reply",
	[Key.guestbookCommentHint]: "Leave a message...",
	[Key.commentNotConfigured]: "Comment system is not configured",
	[Key.commentNotConfiguredHint]:
		"The comment system has not been enabled in the configuration file. Visitors will be able to leave messages once it is enabled.",

	// Support & Share (at the bottom of articles)
	[Key.supportAndShare]: "Support & Share",
	[Key.supportAuthor]: "Support the Author",

	// Navigation
	[Key.navGuestbook]: "Guestbook",
	[Key.navSponsor]: "Sponsor",
	[Key.navGitHub]: "GitHub",
	[Key.navBilibili]: "Bilibili",
};
