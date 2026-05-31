import type { RelatedPostsConfig } from "../types/config";
import { withOverride } from "../utils/config-override";

const defaults: RelatedPostsConfig = {
	enable: true,
	maxCount: 5,

	weights: {
		tagSimilarity: 1.0,
		titleSimilarity: 0.6,
		descriptionSimilarity: 0.4,
		categoryMatch: 0.3,
		freshness: 0.2,
		tagIDF: true,
	},
	freshnessHalfLife: 180,
};

export const relatedPostsConfig = withOverride("relatedPostsConfig", defaults);
