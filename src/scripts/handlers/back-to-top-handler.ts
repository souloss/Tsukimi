/**
 * 返回顶部处理器
 * 管理返回顶部按钮和滚动监听
 */

import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	SCROLL_CONFIG,
	SWUP_SELECTORS,
} from "../core/swup-config";
import { ScrollHandler } from "./scroll-handler";

/**
 * 返回顶部处理器类
 * 负责返回顶部按钮的显示/隐藏和滚动位置监听
 */
export class BackToTopHandler {
	private backToTopBtn: HTMLElement | null = null;
	private navbar: HTMLElement | null = null;
	private bannerEnabled: boolean;
	private scrollHandler: () => void;

	constructor(bannerEnabled: boolean) {
		this.bannerEnabled = bannerEnabled;
		this.scrollHandler = ScrollHandler.throttle(
			this.handleScroll.bind(this),
			SCROLL_CONFIG.throttleInterval,
		);
	}

	/**
	 * 初始化返回顶部处理器
	 */
	init(): void {
		this.cacheElements();
		this.bindEvents();
	}

	/**
	 * 缓存 DOM 元素
	 */
	private cacheElements(): void {
		this.backToTopBtn = document.getElementById(
			SWUP_SELECTORS.backToTopBtn.slice(1),
		);
		this.navbar = document.getElementById(
			SWUP_SELECTORS.navbarWrapper.slice(1),
		);
	}

	/**
	 * 绑定事件监听
	 */
	private bindEvents(): void {
		// 使用 passive 事件监听器提升滚动性能
		window.addEventListener("scroll", this.scrollHandler, {
			passive: true,
		});
		window.addEventListener("resize", this.handleResize.bind(this), {
			passive: true,
		});
	}

	/**
	 * 处理滚动事件
	 */
	private handleScroll(): void {
		const scrollTop = document.documentElement.scrollTop;
		const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

		// 计算返回顶部按钮显示阈值
		const showBackToTopThreshold = this.calculateShowThreshold(scrollTop);

		// 批量处理 DOM 操作
		requestAnimationFrame(() => {
			this.updateBackToTopButton(scrollTop, showBackToTopThreshold);
			this.updateNavbarVisibility(scrollTop);
			this.updatePageOverlayScroll(scrollTop);
		});
	}

	/**
	 * 计算返回顶部按钮显示阈值
	 */
	private calculateShowThreshold(scrollTop: number): number {
		const contentWrapper = document.getElementById(
			SWUP_SELECTORS.contentWrapper.slice(1),
		);
		let threshold =
			window.innerHeight * (BANNER_HEIGHT / 100) +
			SCROLL_CONFIG.backToTopOffset;

		if (contentWrapper) {
			const rect = contentWrapper.getBoundingClientRect();
			const absoluteTop = rect.top + scrollTop;
			threshold = absoluteTop + window.innerHeight / 4;
		}

		return threshold;
	}

	/**
	 * 更新返回顶部按钮可见性
	 */
	private updateBackToTopButton(scrollTop: number, threshold: number): void {
		if (!this.backToTopBtn) {
			return;
		}

		if (scrollTop > threshold) {
			this.backToTopBtn.classList.remove("hide");
		} else {
			this.backToTopBtn.classList.add("hide");
		}
	}


	/**
	 * 更新 Navbar 可见性
	 */
	private updateNavbarVisibility(scrollTop: number): void {
		if (!this.bannerEnabled || !this.navbar) {
			return;
		}

		// Sticky navbar 模式下不隐藏导航栏
		if (document.body.classList.contains("sticky-navbar")) {
			this.navbar.classList.remove("navbar-hidden");
			return;
		}

		const isHome =
			document.body.classList.contains("lg:is-home") &&
			window.innerWidth >= 1280;
		const currentBannerHeight = isHome ? BANNER_HEIGHT_HOME : BANNER_HEIGHT;

		const threshold =
			window.innerHeight * (currentBannerHeight / 100) -
			SCROLL_CONFIG.navbarHideOffset;

		if (scrollTop >= threshold) {
			this.navbar.classList.add("navbar-hidden");
		} else {
			this.navbar.classList.remove("navbar-hidden");
		}
	}

	/**
	 * 页面标题覆盖层随滚动淡出
	 */
	private updatePageOverlayScroll(scrollTop: number): void {
		const pageOverlay = document.getElementById("banner-page-overlay");
		if (!pageOverlay) {
			return;
		}

		// 首页不处理
		const isHome = document.body.classList.contains("lg:is-home");
		if (isHome) {
			return;
		}

		const bannerHeight =
			document.getElementById("wallpaper-wrapper")?.offsetHeight || 400;
		const fadeRatio = Math.max(0, 1 - scrollTop / (bannerHeight * 0.5));
		pageOverlay.style.opacity = String(fadeRatio);
		pageOverlay.style.transform = `translateY(${scrollTop * 0.15}px)`;
	}

	/**
	 * 处理窗口大小变化
	 */
	private handleResize(): void {
		// 计算 --banner-height-extend
		// 需要是 4 的倍数以避免模糊文本
		let offset = Math.floor(
			window.innerHeight * (30 / 100), // BANNER_HEIGHT_EXTEND
		);
		offset = offset - (offset % 4);
		document.documentElement.style.setProperty(
			"--banner-height-extend",
			`${offset}px`,
		);
	}

	/**
	 * 销毁处理器
	 */
	destroy(): void {
		window.removeEventListener("scroll", this.scrollHandler);
		window.removeEventListener("resize", this.handleResize.bind(this));
		this.backToTopBtn = null;
		this.navbar = null;
	}

	/**
	 * 更新 Banner 启用状态
	 */
	setBannerEnabled(enabled: boolean): void {
		this.bannerEnabled = enabled;
	}
}

// 创建全局实例
let globalBackToTopHandler: BackToTopHandler | null = null;

/**
 * 获取全局返回顶部处理器实例
 */
export function getBackToTopHandler(bannerEnabled: boolean): BackToTopHandler {
	if (!globalBackToTopHandler) {
		globalBackToTopHandler = new BackToTopHandler(bannerEnabled);
	}
	return globalBackToTopHandler;
}

/**
 * 初始化返回顶部处理器（便捷函数）
 */
export function initBackToTopHandler(bannerEnabled: boolean): void {
	const handler = getBackToTopHandler(bannerEnabled);
	handler.init();
}
