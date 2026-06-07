/**
 * Generate file-icons.json from @iconify-json/vscode-icons.
 *
 * Reads icon data from the vscode-icons Iconify package and outputs a JSON
 * file used by the rehype-file-tree plugin. The `file-type-*` variants
 * provide clean per-file-type icons (file shape + language symbol, no
 * background box), matching Vuepress Plume's visual style.
 *
 * To swap icon sets, change the `iconSet` import and update
 * EXT_ICON_MAP / NAME_ICON_MAP accordingly.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Icon set ──────────────────────────────────────────────────────
// Swap this import to change the icon source.
const iconSetModule = await import("@iconify-json/vscode-icons");
const iconSet = iconSetModule.default || iconSetModule;

const { icons: iconCollection, width: defaultWidth = 32, height: defaultHeight = 32 } = iconSet;
const iconData = iconCollection.icons;

/**
 * Extract the SVG body for an icon name.
 * Returns { body, width, height }.
 */
function getIcon(name) {
	const icon = iconData[name];
	if (!icon) return null;
	return {
		body: icon.body,
		width: icon.width || defaultWidth,
		height: icon.height || defaultHeight,
	};
}

// ── File extension → vscode-icons name mapping ─────────────────────

const EXT_ICON_MAP = {
	// Code languages
	ts: "file-type-typescript",
	tsx: "file-type-typescript",
	js: "file-type-js-official",
	jsx: "file-type-js-official",
	mjs: "file-type-js-official",
	cjs: "file-type-js-official",
	py: "file-type-python",
	rs: "file-type-rust",
	go: "file-type-go",
	java: "file-type-java",
	rb: "file-type-ruby",
	php: "file-type-php",
	swift: "file-type-swift",
	kt: "file-type-kotlin",
	scala: "file-type-scala",
	c: "file-type-c",
	cpp: "file-type-cpp",
	h: "file-type-c",
	hpp: "file-type-cpp",
	cs: "file-type-csharp",
	dart: "file-type-dartlang",
	lua: "file-type-lua",
	r: "file-type-r",
	zig: "file-type-rust",
	sql: "file-type-sql",
	sh: "file-type-shell",
	bash: "file-type-shell",
	ex: "file-type-elixir",
	exs: "file-type-elixir",
	hs: "file-type-haskell",
	elm: "file-type-elm2",
	clj: "file-type-clojurescript",
	erl: "file-type-erlang2",
	coffee: "file-type-coffeescript",

	// Web / markup
	vue: "file-type-vue",
	svelte: "file-type-svelte",
	astro: "file-type-astro",
	html: "file-type-html",
	htm: "file-type-html",
	css: "file-type-css",
	scss: "file-type-sass",
	sass: "file-type-sass",
	less: "file-type-less",
	styl: "file-type-css",
	md: "file-type-markdown",
	mdx: "file-type-markdown",
	txt: "file-type-markdown",
	xml: "file-type-html",
	graphql: "file-type-graphql",
	prisma: "file-type-prisma",

	// Config / data
	json: "file-type-json",
	jsonc: "file-type-json",
	yaml: "file-type-yaml-official",
	yml: "file-type-yaml-official",
	toml: "file-type-toml",
	conf: "file-type-config",
	ini: "file-type-config",
	cfg: "file-type-config",
	env: "file-type-dotenv",

	// Image
	png: "file-type-image",
	jpg: "file-type-image",
	jpeg: "file-type-image",
	gif: "file-type-image",
	svg: "file-type-svg",
	webp: "file-type-image",
	ico: "file-type-image",
	avif: "file-type-image",
	bmp: "file-type-image",
	tiff: "file-type-image",

	// Font
	woff: "file-type-font",
	woff2: "file-type-font",
	ttf: "file-type-font",
	otf: "file-type-font",

	// Archive
	zip: "file-type-zip",
	tar: "file-type-zip",
	gz: "file-type-zip",

	// Doc / data
	csv: "file-type-json",
	xlsx: "file-type-excel",
	pdf: "file-type-pdf2",
	doc: "file-type-word",
	docx: "file-type-word",
	ppt: "file-type-powerpoint",
	pptx: "file-type-powerpoint",

	// Lock / git
	lock: "file-type-git",
	gitignore: "file-type-git",
};

// ── Specific filename → vscode-icons name mapping ─────────────────

const NAME_ICON_MAP = {
	"readme.md": "file-type-markdown",
	"license": "file-type-markdown",
	".gitignore": "file-type-git",
	".gitattributes": "file-type-git",
	".env": "file-type-dotenv",
	".env.local": "file-type-dotenv",
	".env.production": "file-type-dotenv",
	"dockerfile": "file-type-docker",
	"docker-compose.yml": "file-type-docker",
	"makefile": "file-type-shell",
	"package.json": "file-type-npm",
	"pnpm-lock.yaml": "file-type-npm",
	"yarn.lock": "file-type-yarn",
	"package-lock.json": "file-type-npm",
	"tsconfig.json": "file-type-tsconfig",
	"astro.config.mjs": "file-type-astro",
	"vite.config.ts": "file-type-vite",
	"tailwind.config.ts": "file-type-tailwind",
	"next.config.js": "file-type-vite",
	".eslintrc": "file-type-eslint",
	".prettierrc": "file-type-prettier",
	"cargo.toml": "file-type-cargo",
	"go.mod": "file-type-go",
	"requirements.txt": "file-type-python",
	"pipfile": "file-type-python",
	"gemfile": "file-type-ruby",
	"composer.json": "file-type-php",
};

// ── Folder icons (from vscode-icons) ──────────────────────────────

const FOLDER_ICON_MAP = {
	// src
	src: "folder-type-src",
	source: "folder-type-src",
	sources: "folder-type-src",
	__src__: "folder-type-src",

	// api
	api: "folder-type-api",
	".api": "folder-type-api",
	apis: "folder-type-api",
	".apis": "folder-type-api",

	// app
	app: "folder-type-app",
	apps: "folder-type-app",
	".app": "folder-type-app",
	application: "folder-type-app",
	applications: "folder-type-app",

	// asset
	assets: "folder-type-asset",
	".assets": "folder-type-asset",

	// audio
	audio: "folder-type-audio",
	".audio": "folder-type-audio",
	audios: "folder-type-audio",
	".audios": "folder-type-audio",
	sound: "folder-type-audio",
	".sound": "folder-type-audio",
	sounds: "folder-type-audio",
	".sounds": "folder-type-audio",

	// binary
	bin: "folder-type-binary",
	".bin": "folder-type-binary",

	// cli
	cli: "folder-type-cli",
	cmd: "folder-type-cli",
	command: "folder-type-cli",
	commands: "folder-type-cli",
	commandline: "folder-type-cli",
	console: "folder-type-cli",

	// client
	client: "folder-type-client",
	clients: "folder-type-client",

	// common
	common: "folder-type-common",

	// component
	component: "folder-type-component",
	components: "folder-type-component",
	".components": "folder-type-component",
	gui: "folder-type-component",
	"src-ui": "folder-type-component",
	ui: "folder-type-component",
	widgets: "folder-type-component",

	// config
	conf: "folder-type-config",
	".conf": "folder-type-config",
	config: "folder-type-config",
	".config": "folder-type-config",
	configs: "folder-type-config",
	".configs": "folder-type-config",
	configuration: "folder-type-config",
	".configuration": "folder-type-config",
	configurations: "folder-type-config",
	".configurations": "folder-type-config",
	setting: "folder-type-config",
	".setting": "folder-type-config",
	settings: "folder-type-config",
	".settings": "folder-type-config",
	ini: "folder-type-config",
	".ini": "folder-type-config",
	initializers: "folder-type-config",
	".initializers": "folder-type-config",

	// controller
	controller: "folder-type-controller",
	controllers: "folder-type-controller",
	".controllers": "folder-type-controller",
	__controller__: "folder-type-controller",
	__controllers__: "folder-type-controller",
	handler: "folder-type-controller",
	handlers: "folder-type-controller",
	".handler": "folder-type-controller",
	".handlers": "folder-type-controller",
	__handler__: "folder-type-controller",
	__handlers__: "folder-type-controller",

	// coverage
	coverage: "folder-type-coverage",

	// css
	css: "folder-type-css",
	_css: "folder-type-css",

	// data / db
	db: "folder-type-db",
	database: "folder-type-db",
	sql: "folder-type-db",
	data: "folder-type-db",
	repo: "folder-type-db",
	repository: "folder-type-db",
	repositories: "folder-type-db",
	store: "folder-type-db",
	stores: "folder-type-db",

	// dist
	dist: "folder-type-dist",
	".dist": "folder-type-dist",
	dists: "folder-type-dist",
	out: "folder-type-dist",
	outs: "folder-type-dist",
	export: "folder-type-dist",
	exports: "folder-type-dist",
	build: "folder-type-dist",
	".build": "folder-type-dist",
	builds: "folder-type-dist",
	release: "folder-type-dist",
	releases: "folder-type-dist",
	target: "folder-type-dist",
	targets: "folder-type-dist",

	// docker
	docker: "folder-type-docker",
	".docker": "folder-type-docker",

	// docs
	docs: "folder-type-docs",
	doc: "folder-type-docs",
	document: "folder-type-docs",
	documents: "folder-type-docs",

	// fonts
	fonts: "folder-type-fonts",
	font: "folder-type-fonts",
	fnt: "folder-type-fonts",
	webfonts: "folder-type-fonts",

	// git
	".git": "folder-type-git",
	submodules: "folder-type-git",
	".submodules": "folder-type-git",

	// github
	".github": "folder-type-github",

	// gitlab
	".gitlab": "folder-type-gitlab",

	// graphql
	graphql: "folder-type-graphql",

	// helper
	helper: "folder-type-helper",
	".helper": "folder-type-helper",
	helpers: "folder-type-helper",
	".helpers": "folder-type-helper",

	// hook
	hook: "folder-type-hook",
	".hook": "folder-type-hook",
	hooks: "folder-type-hook",
	".hooks": "folder-type-hook",

	// husky
	".husky": "folder-type-husky",

	// images
	images: "folder-type-images",
	image: "folder-type-images",
	".img": "folder-type-images",
	img: "folder-type-images",
	".imgs": "folder-type-images",
	imgs: "folder-type-images",
	icons: "folder-type-images",
	icon: "folder-type-images",
	ico: "folder-type-images",
	screenshot: "folder-type-images",
	screenshots: "folder-type-images",
	svg: "folder-type-images",
	texture: "folder-type-images",
	textures: "folder-type-images",
	".fig": "folder-type-images",
	".figs": "folder-type-images",

	// include
	include: "folder-type-include",
	includes: "folder-type-include",
	incl: "folder-type-include",
	inc: "folder-type-include",
	".include": "folder-type-include",
	".includes": "folder-type-include",
	".incl": "folder-type-include",
	".inc": "folder-type-include",
	_include: "folder-type-include",
	_includes: "folder-type-include",
	_incl: "folder-type-include",
	_inc: "folder-type-include",

	// interfaces
	interface: "folder-type-interfaces",
	interfaces: "folder-type-interfaces",

	// js
	js: "folder-type-js",

	// json
	json: "folder-type-json",

	// library
	lib: "folder-type-library",
	libs: "folder-type-library",
	".lib": "folder-type-library",
	".libs": "folder-type-library",
	__lib__: "folder-type-library",
	__libs__: "folder-type-library",
	library: "folder-type-library",
	libraries: "folder-type-library",

	// locale / i18n
	lang: "folder-type-locale",
	language: "folder-type-locale",
	languages: "folder-type-locale",
	locale: "folder-type-locale",
	locales: "folder-type-locale",
	_locale: "folder-type-locale",
	_locales: "folder-type-locale",
	internationalization: "folder-type-locale",
	globalization: "folder-type-locale",
	localization: "folder-type-locale",
	i18n: "folder-type-locale",
	g11n: "folder-type-locale",
	l10n: "folder-type-locale",

	// log
	log: "folder-type-log",
	logs: "folder-type-log",

	// middleware
	middleware: "folder-type-middleware",
	middlewares: "folder-type-middleware",

	// mock
	mocks: "folder-type-mock",
	".mocks": "folder-type-mock",
	__mocks__: "folder-type-mock",

	// model
	model: "folder-type-model",
	".model": "folder-type-model",
	models: "folder-type-model",
	".models": "folder-type-model",
	entities: "folder-type-model",
	".entities": "folder-type-model",

	// module
	modules: "folder-type-module",

	// node
	node_modules: "folder-type-node",

	// notification / event
	notification: "folder-type-notification",
	notifications: "folder-type-notification",
	event: "folder-type-notification",
	events: "folder-type-notification",

	// package
	package: "folder-type-package",
	packages: "folder-type-package",
	".package": "folder-type-package",
	".packages": "folder-type-package",
	pkg: "folder-type-package",

	// plugin
	plugin: "folder-type-plugin",
	".plugin": "folder-type-plugin",
	plugins: "folder-type-plugin",
	".plugins": "folder-type-plugin",
	extension: "folder-type-plugin",
	".extension": "folder-type-plugin",
	extensions: "folder-type-plugin",
	".extensions": "folder-type-plugin",

	// private
	private: "folder-type-private",
	".private": "folder-type-private",

	// public
	public: "folder-type-public",
	".public": "folder-type-public",

	// route
	route: "folder-type-route",
	routes: "folder-type-route",
	_route: "folder-type-route",
	_routes: "folder-type-route",
	router: "folder-type-route",
	routers: "folder-type-route",

	// sass
	sass: "folder-type-sass",
	scss: "folder-type-sass",
	_sass: "folder-type-sass",
	_scss: "folder-type-sass",

	// script
	script: "folder-type-script",
	scripts: "folder-type-script",

	// server
	server: "folder-type-server",

	// services
	service: "folder-type-services",
	services: "folder-type-services",

	// shared
	share: "folder-type-shared",
	shared: "folder-type-shared",
	".share": "folder-type-shared",
	".shared": "folder-type-shared",
	__shared__: "folder-type-shared",
	__share__: "folder-type-shared",

	// style
	style: "folder-type-style",
	styles: "folder-type-style",

	// test
	tests: "folder-type-test",
	".tests": "folder-type-test",
	test: "folder-type-test",
	".test": "folder-type-test",
	__tests__: "folder-type-test",
	__test__: "folder-type-test",
	spec: "folder-type-test",
	".spec": "folder-type-test",
	specs: "folder-type-test",
	".specs": "folder-type-test",
	integration: "folder-type-test",

	// temp
	temp: "folder-type-temp",
	".temp": "folder-type-temp",
	tmp: "folder-type-temp",
	".tmp": "folder-type-temp",

	// template
	template: "folder-type-template",
	".template": "folder-type-template",
	templates: "folder-type-template",
	".templates": "folder-type-template",

	// theme
	theme: "folder-type-theme",
	themes: "folder-type-theme",

	// tools
	tool: "folder-type-tools",
	tools: "folder-type-tools",
	".tools": "folder-type-tools",
	util: "folder-type-tools",
	utils: "folder-type-tools",
	utilities: "folder-type-tools",
	tooling: "folder-type-tools",

	// typescript / types
	typescript: "folder-type-typescript",
	ts: "folder-type-typescript",
	types: "folder-type-typings",
	typings: "folder-type-typings",
	"@types": "folder-type-typings",

	// view / pages
	view: "folder-type-view",
	views: "folder-type-view",
	pages: "folder-type-view",
	page: "folder-type-view",
	html: "folder-type-view",
	layout: "folder-type-view",
	layouts: "folder-type-view",
	_view: "folder-type-view",
	_views: "folder-type-view",
	_layout: "folder-type-view",
	_layouts: "folder-type-view",
	_page: "folder-type-view",
	_pages: "folder-type-view",

	// wasm
	wasm: "folder-type-wasm",
	WASM: "folder-type-wasm",
	webassembly: "folder-type-wasm",
	WebAssembly: "folder-type-wasm",
	wit: "folder-type-wasm",

	// www
	".web": "folder-type-www",
	www: "folder-type-www",
	wwwroot: "folder-type-www",
	web: "folder-type-www",

	// ── Framework / platform specific ──

	// android
	android: "folder-type-android",

	// angular
	".angular": "folder-type-angular",

	// astro
	".astro": "folder-type-astro",

	// aws
	aws: "folder-type-aws",
	".aws": "folder-type-aws",

	// azure
	azure: "folder-type-azure",
	".azure": "folder-type-azure",

	// azurepipelines
	"azure-pipelines": "folder-type-azurepipelines",
	".azure-pipelines": "folder-type-azurepipelines",
	".azuredevops": "folder-type-azurepipelines",
	".vsts": "folder-type-azurepipelines",

	// bloc
	blocs: "folder-type-bloc",
	bloc: "folder-type-bloc",

	// changesets
	".changeset": "folder-type-changesets",

	// circleci
	".circleci": "folder-type-circleci",

	// claude
	".claude": "folder-type-claude",

	// cloudflare
	".cloudflare": "folder-type-cloudflare",
	cloudflare: "folder-type-cloudflare",

	// cmake
	".cmake": "folder-type-cmake",
	cmake: "folder-type-cmake",

	// cubit
	cubits: "folder-type-cubit",
	cubit: "folder-type-cubit",

	// cursor
	".cursor": "folder-type-cursor",

	// cypress
	cypress: "folder-type-cypress",

	// dapr
	".dapr": "folder-type-dapr",
	dapr: "folder-type-dapr",

	// dart
	dart: "folder-type-dart",
	".dart_tool": "folder-type-dart",

	// datadog
	datadog: "folder-type-datadog",
	".datadog": "folder-type-datadog",

	// dependabot
	".dependabot": "folder-type-dependabot",

	// devcontainer
	".devcontainer": "folder-type-devcontainer",

	// e2e
	e2e: "folder-type-e2e",

	// elasticbeanstalk
	".elasticbeanstalk": "folder-type-elasticbeanstalk",
	".ebextensions": "folder-type-elasticbeanstalk",

	// electron
	electron: "folder-type-electron",

	// expo
	".expo": "folder-type-expo",
	".expo-shared": "folder-type-expo",

	// favicon
	favicon: "folder-type-favicon",
	favicons: "folder-type-favicon",

	// flow
	flow: "folder-type-flow",
	"flow-typed": "folder-type-flow",

	// flutter
	flutter: "folder-type-flutter",
	Flutter: "folder-type-flutter",

	// frontcommerce
	".front-commerce": "folder-type-frontcommerce",

	// gcp
	gcp: "folder-type-gcp",
	".gcp": "folder-type-gcp",

	// gemini
	".gemini": "folder-type-gemini",

	// godot
	godot: "folder-type-godot",
	".godot": "folder-type-godot",

	// gradle
	gradle: "folder-type-gradle",
	".gradle": "folder-type-gradle",

	// grunt
	grunt: "folder-type-grunt",

	// gulp
	gulp: "folder-type-gulp",

	// haxelib
	".haxelib": "folder-type-haxelib",
	haxe_libraries: "folder-type-haxelib",

	// histoire
	".histoire": "folder-type-histoire",

	// idea
	".idea": "folder-type-idea",

	// ios
	ios: "folder-type-ios",

	// junie
	".junie": "folder-type-junie",

	// kotlin
	kotlin: "folder-type-kotlin",
	Kotlin: "folder-type-kotlin",
	".kotlin": "folder-type-kotlin",

	// kubernetes
	kubernetes: "folder-type-kubernetes",
	k8s: "folder-type-kubernetes",
	kube: "folder-type-kubernetes",
	kuber: "folder-type-kubernetes",
	".kubernetes": "folder-type-kubernetes",
	".k8s": "folder-type-kubernetes",
	".kube": "folder-type-kubernetes",
	".kuber": "folder-type-kubernetes",

	// less
	less: "folder-type-less",
	_less: "folder-type-less",

	// linux
	linux: "folder-type-linux",

	// macos
	macos: "folder-type-macos",
	darwin: "folder-type-macos",

	// mariadb
	mariadb: "folder-type-mariadb",
	maria: "folder-type-mariadb",

	// maven
	".mvn": "folder-type-maven",

	// meteor
	".meteor": "folder-type-meteor",

	// minecraft
	".minecraft": "folder-type-minecraft",

	// minikube
	minikube: "folder-type-minikube",
	minik8s: "folder-type-minikube",
	minikuber: "folder-type-minikube",

	// mjml
	mjml: "folder-type-mjml",
	".mjml": "folder-type-mjml",

	// mojo
	mojo: "folder-type-mojo",

	// mongodb
	mongodb: "folder-type-mongodb",
	mongo: "folder-type-mongodb",

	// mypy
	".mypy_cache": "folder-type-mypy",

	// mysql
	mysqldb: "folder-type-mysql",
	mysql: "folder-type-mysql",

	// netlify
	netlify: "folder-type-netlify",

	// next
	".next": "folder-type-next",

	// nginx
	nginx: "folder-type-nginx",
	"conf.d": "folder-type-nginx",

	// nix
	".niv": "folder-type-nix",
	".nix": "folder-type-nix",
	nix: "folder-type-nix",
	niv: "folder-type-nix",

	// nuxt
	nuxt: "folder-type-nuxt",
	".nuxt": "folder-type-nuxt",

	// nuget
	".nuget": "folder-type-nuget",

	// php
	php: "folder-type-php",

	// platformio
	".pio": "folder-type-platformio",
	".pioenvs": "folder-type-platformio",

	// prisma
	prisma: "folder-type-prisma",

	// pytest
	".pytest_cache": "folder-type-pytest",

	// python
	".venv": "folder-type-python",
	".virtualenv": "folder-type-python",
	__pycache__: "folder-type-python",

	// ravendb
	ravendb: "folder-type-ravendb",

	// redis
	redis: "folder-type-redis",

	// redux
	redux: "folder-type-redux",

	// seedkit
	seedkit: "folder-type-seedkit",
	".seedkit": "folder-type-seedkit",

	// snaplet
	".snaplet": "folder-type-snaplet",

	// spin
	".spin": "folder-type-spin",

	// sso
	sso: "folder-type-sso",

	// story
	story: "folder-type-story",
	stories: "folder-type-story",
	__stories__: "folder-type-story",
	".storybook": "folder-type-story",

	// supabase
	supabase: "folder-type-supabase",

	// svelte
	svelte: "folder-type-svelte",
	".svelte-kit": "folder-type-svelte",

	// swagger
	swagger: "folder-type-swagger",

	// tauri
	"src-tauri": "folder-type-tauri",

	// travis
	".travis": "folder-type-travis",

	// trunk
	".trunk": "folder-type-trunk",

	// turbo
	".turbo": "folder-type-turbo",

	// vagrant
	vagrant: "folder-type-vagrant",
	".vagrant": "folder-type-vagrant",

	// vercel
	".vercel": "folder-type-vercel",

	// video
	video: "folder-type-video",
	".video": "folder-type-video",
	videos: "folder-type-video",
	".videos": "folder-type-video",

	// vitepress
	".vitepress": "folder-type-vitepress",

	// vscode
	".vscode": "folder-type-vscode",
	vscode: "folder-type-vscode",
	".vscode-test": "folder-type-vscode-test",

	// webpack
	webpack: "folder-type-webpack",
	".webpack": "folder-type-webpack",

	// windows
	windows: "folder-type-windows",
	win32: "folder-type-windows",

	// windsurf
	".windsurf": "folder-type-windsurf",

	// yarn
	".yarn": "folder-type-yarn",

	// zed
	".zed": "folder-type-zed",

	// ── Less common / niche ──

	// apache
	apache: "folder-type-apache",
	apache2: "folder-type-apache",
	httpd: "folder-type-apache",

	// arangodb
	arangodb: "folder-type-arangodb",
	arango: "folder-type-arangodb",

	// aurelia
	aurelia_project: "folder-type-aurelia",

	// bower
	bower_components: "folder-type-bower",

	// buildkite
	".buildkite": "folder-type-buildkite",

	// cake
	cake: "folder-type-cake",
	".cake": "folder-type-cake",

	// cargo
	cargo: "folder-type-cargo",
	".cargo": "folder-type-cargo",
	crates: "folder-type-cargo",

	// certificate
	certificates: "folder-type-certificate",
	".certificates": "folder-type-certificate",
	certs: "folder-type-certificate",

	// chef
	chef: "folder-type-chef",
	".chef": "folder-type-chef",

	// composer
	composer: "folder-type-composer",
	".composer": "folder-type-composer",

	// debian
	debian: "folder-type-debian",
	deb: "folder-type-debian",

	// memcached
	memcached: "folder-type-memcached",
	".memcached": "folder-type-memcached",

	// mediawiki
	mediawiki: "folder-type-mediawiki",

	// notebooks
	notebooks: "folder-type-notebooks",
	notebook: "folder-type-notebooks",

	// paket
	".paket": "folder-type-paket",
};

// ── SVG Normalization ─────────────────────────────────────────────

/**
 * Store icon body at its native size — no scaling transforms.
 * Each icon entry includes its native viewBox so the renderer
 * can use the correct viewBox per icon (Vuepress approach).
 */
function normalizeIcon(body, iconWidth, iconHeight) {
	return { body, viewBox: `0 0 ${iconWidth} ${iconHeight}` };
}

// ── Main ──────────────────────────────────────────────────────────

const icons = {}; // iconName → { body, viewBox }
const fileMap = {}; // extension or filename → iconName
const folderMap = {}; // folder name → iconName

// Collect all unique icon names needed
const neededIcons = new Set();

for (const icon of Object.values(EXT_ICON_MAP)) {
	neededIcons.add(icon);
}
for (const icon of Object.values(NAME_ICON_MAP)) {
	neededIcons.add(icon);
}
for (const icon of Object.values(FOLDER_ICON_MAP)) {
	neededIcons.add(icon);
	// Also collect opened variant
	neededIcons.add(`${icon}-opened`);
}

// Add folder open/closed defaults
neededIcons.add("default-folder");
neededIcons.add("default-folder-opened");
neededIcons.add("default-file");

// Resolve and normalize icons
for (const name of neededIcons) {
	const icon = getIcon(name);
	if (icon) {
		icons[name] = normalizeIcon(icon.body, icon.width, icon.height);
	} else {
		console.warn(`  [warn] Icon not found in vscode-icons: ${name}`);
	}
}

// Build file map from extensions
for (const [ext, iconName] of Object.entries(EXT_ICON_MAP)) {
	fileMap[ext] = iconName;
}

// Build file map from specific names
for (const [name, iconName] of Object.entries(NAME_ICON_MAP)) {
	fileMap[name] = iconName;
}

// Build folder map
for (const [name, iconName] of Object.entries(FOLDER_ICON_MAP)) {
	folderMap[name] = iconName;
}

// Derive folderOpenMap: closed icon name → opened icon name
const folderOpenMap = {};
for (const iconName of new Set(Object.values(FOLDER_ICON_MAP))) {
	const openedName = `${iconName}-opened`;
	if (icons[openedName]) {
		folderOpenMap[iconName] = openedName;
	}
}

// Chevron arrow (custom, 16x16 viewBox)
const chevronSvg = '<path fill="currentColor" d="m5.157 13.069l4.611-4.685a.546.546 0 0 0 0-.768L5.158 2.93a.55.55 0 0 1 0-.771a.53.53 0 0 1 .759 0l4.61 4.684a1.65 1.65 0 0 1 0 2.312l-4.61 4.684a.53.53 0 0 1-.76 0a.55.55 0 0 1 0-.771"/>';

// Ellipsis (custom, 16x16 viewBox)
const ellipsisSvg =
	'<circle fill="#94a3b8" cx="4" cy="8" r="1.5"/><circle fill="#94a3b8" cx="8" cy="8" r="1.5"/><circle fill="#94a3b8" cx="12" cy="8" r="1.5"/>';

const DEFAULT_ICON = "default-file";
if (!icons[DEFAULT_ICON]) {
	icons[DEFAULT_ICON] = {
		body: '<path fill="#c5c5c5" d="M20.414 2H5v28h22V8.586ZM7 28V4h12v6h6v18Z"/>',
		viewBox: "0 0 32 32",
	};
}

const DEFAULT_FOLDER = "default-folder";
const DEFAULT_FOLDER_OPEN = "default-folder-opened";

const output = {
	icons,
	fileMap,
	folderMap,
	folderOpenMap,
	defaultFile: DEFAULT_ICON,
	defaultFolder: DEFAULT_FOLDER,
	defaultFolderOpen: DEFAULT_FOLDER_OPEN,
	chevron: { body: chevronSvg, viewBox: "0 0 16 16" },
	ellipsis: { body: ellipsisSvg, viewBox: "0 0 16 16" },
	defaultIcon: DEFAULT_ICON,
};

const outPath = join(__dirname, "..", "src", "plugins", "file-icons.json");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(output, null, "\t") + "\n");

// ── Client-side data files (placed in src/plugins/ alongside file-icons.json,
// safe from content-sync symlinks that replace src/data/) ─────────────────

const folderMapOutput = {
	folderMap,
	folderOpenMap,
	defaultFolder: DEFAULT_FOLDER,
	defaultFolderOpen: DEFAULT_FOLDER_OPEN,
};

const folderMapPath = join(__dirname, "..", "src", "plugins", "folder-map.json");
writeFileSync(folderMapPath, JSON.stringify(folderMapOutput, null, "\t") + "\n");

const folderOpenIconsOutput = {};
for (const [, openedName] of Object.entries(folderOpenMap)) {
	if (icons[openedName]) {
		folderOpenIconsOutput[openedName] = icons[openedName];
	}
}
// Include default opened folder icon
if (icons[DEFAULT_FOLDER_OPEN]) {
	folderOpenIconsOutput[DEFAULT_FOLDER_OPEN] = icons[DEFAULT_FOLDER_OPEN];
}

const folderOpenIconsPath = join(
	__dirname,
	"..",
	"src",
	"plugins",
	"folder-open-icons.json",
);
writeFileSync(
	folderOpenIconsPath,
	JSON.stringify(folderOpenIconsOutput, null, "\t") + "\n",
);

console.log(
	`Generated ${Object.keys(icons).length} icons, ${Object.keys(fileMap).length} file mappings, ${Object.keys(folderMap).length} folder mappings, ${Object.keys(folderOpenMap).length} folder-open mappings`,
);
console.log(`Output: ${outPath}`);
console.log(`Client data: ${folderMapPath}, ${folderOpenIconsPath}`);