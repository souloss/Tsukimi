<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { onMount } from "svelte";

const { sortedPosts = [] }: { sortedPosts?: Post[] } = $props();

interface Post {
	id: string;
	url?: string;
	data: {
		title: string;
		tags: string[];
		category?: string;
		published: Date;
		alias?: string;
		permalink?: string;
	};
}

interface Group {
	year: number;
	posts: Post[];
}

let groups: Group[] = $state([]);

function formatDate(date: Date) {
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");
	return `${month}-${day}`;
}

function formatTag(tagList: string[]) {
	return tagList.map((t) => `#${t}`).join(" ");
}

function filterAndGroupPosts(
	posts: Post[],
	filterTags: string[],
	filterCategories: string[],
	filterUncategorized: string | null,
): Group[] {
	let filteredPosts = posts;

	if (filterTags.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				Array.isArray(post.data.tags) &&
				post.data.tags.some((tag) => filterTags.includes(tag)),
		);
	}

	if (filterCategories.length > 0) {
		filteredPosts = filteredPosts.filter(
			(post) =>
				post.data.category && filterCategories.includes(post.data.category),
		);
	}

	if (filterUncategorized) {
		filteredPosts = filteredPosts.filter((post) => !post.data.category);
	}

	filteredPosts = filteredPosts
		.slice()
		.sort((a, b) => b.data.published.getTime() - a.data.published.getTime());

	const grouped = filteredPosts.reduce(
		(acc, post) => {
			const year = post.data.published.getFullYear();
			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(post);
			return acc;
		},
		{} as Record<number, Post[]>,
	);

	const groupedPostsArray = Object.keys(grouped).map((yearStr) => ({
		year: Number.parseInt(yearStr, 10),
		posts: grouped[Number.parseInt(yearStr, 10)],
	}));

	groupedPostsArray.sort((a, b) => b.year - a.year);

	return groupedPostsArray;
}

onMount(() => {
	// Read URL filter params
	let fTags: string[] = [];
	let fCats: string[] = [];
	let fUncat: string | null = null;

	const params = new URLSearchParams(window.location.search);
	fTags = params.has("tag") ? params.getAll("tag") : [];
	fCats = params.has("category") ? params.getAll("category") : [];
	fUncat = params.get("uncategorized");

	if (fTags.length > 0 || fCats.length > 0 || fUncat) {
		groups = filterAndGroupPosts(sortedPosts, fTags, fCats, fUncat);
	} else {
		groups = filterAndGroupPosts(sortedPosts, [], [], null);
	}

	// After Svelte renders, collapse all years except the latest via DOM
	// Use requestAnimationFrame to ensure DOM is ready
	requestAnimationFrame(() => {
		const yearHeaders = document.querySelectorAll("[data-year]");
		yearHeaders.forEach((el, i) => {
			if (i > 0) {
				// Not the latest year — collapse
				el.classList.add("year-collapsed");
			}
		});
	});
});

function handleYearClick(e: MouseEvent) {
	const button = (e.currentTarget as HTMLElement).closest("[data-year]");
	if (!button) return;
	button.classList.toggle("year-collapsed");

	// Animate the arrow
	const arrow = button.querySelector(".archive-arrow") as HTMLElement | null;
	if (arrow) {
		const isCollapsed = button.classList.contains("year-collapsed");
		arrow.style.transform = isCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
	}
}
</script>

<div class="card-base px-8 py-6">
	{#if groups.length === 0}
		<div class="text-center py-16 text-black/40 dark:text-white/40">
			{i18n(I18nKey.noData)}
		</div>
	{:else}
		{#each groups as group}
			<div data-year={group.year}>
				<button
					class="flex flex-row w-full items-center h-[3.75rem] cursor-pointer rounded-lg
					       hover:bg-[var(--btn-plain-bg-hover)] transition-colors group/yr"
					onclick={handleYearClick}
				>
					<div
						class="w-[15%] md:w-[10%] transition text-2xl font-bold text-right text-75
						            group-hover/yr:text-[var(--primary)]"
					>
						{group.year}
					</div>
					<div class="w-[15%] md:w-[10%]">
						<div
								class="h-3 w-3 bg-none rounded-full outline outline-[var(--primary)] mx-auto
	                  -outline-offset-[2px] z-50 outline-3"
						></div>
					</div>
					<div
						class="w-[70%] md:w-[80%] transition text-left text-50 flex items-center gap-2
						            group-hover/yr:text-[var(--primary)]"
					>
						{group.posts.length}
						{i18n(
							group.posts.length === 1
								? I18nKey.postCount
								: I18nKey.postsCount,
						)}
						<span class="archive-arrow">
							<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
								<path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
					</div>
				</button>

				<div class="archive-year-posts">
					{#each group.posts as post}
						<a
							href={post.url || `/posts/${post.id}/`}
							aria-label={post.data.title}
							class="group btn-plain !block h-10 w-full rounded-lg hover:text-[initial]"
						>
							<div
								class="flex flex-row justify-start items-center h-full"
							>
								<!-- date -->
								<div
									class="w-[15%] md:w-[10%] transition text-sm text-right text-50"
								>
									{formatDate(post.data.published)}
								</div>

								<!-- dot and line -->
								<div
									class="w-[15%] md:w-[10%] relative dash-line h-full flex items-center"
								>
									<div
										class="transition-all mx-auto w-1 h-1 rounded group-hover:h-5
		                       bg-[oklch(0.5_0.05_var(--hue))] group-hover:bg-[var(--primary)]
		                       outline outline-4 z-50
		                       outline-[var(--card-bg)]
		                       group-hover:outline-[var(--btn-plain-bg-hover)]
		                       group-active:outline-[var(--btn-plain-bg-active)]"
									></div>
								</div>

								<!-- post title -->
								<div
									class="w-[70%] md:max-w-[65%] md:w-[65%] text-left font-bold
			                     group-hover:translate-x-1 transition-all group-hover:text-[var(--primary)]
			                     text-75 pr-8 whitespace-nowrap overflow-ellipsis overflow-hidden"
								>
									{post.data.title}
								</div>

								<!-- tag list -->
								<div
									class="hidden md:block md:w-[15%] text-left text-sm transition
			                     whitespace-nowrap overflow-ellipsis overflow-hidden text-30"
								>
									{formatTag(post.data.tags)}
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.archive-arrow {
		display: inline-flex;
		transition: transform 0.2s ease;
	}

	/* DOM-based collapse: all posts always in DOM, hidden via CSS */
	:global(.year-collapsed) .archive-arrow {
		transform: rotate(-90deg);
	}

	:global(.year-collapsed) .archive-year-posts {
		display: none;
	}
</style>