import"./disclose-version.DwdwGuwu.js";import{$ as De,A as k,C as we,F as z,G as y,H as m,I as Ie,J as ge,K as _e,L as n,M as S,O as W,P as G,Q as ee,S as ke,T as Ve,U as Z,V as He,W as F,X as ie,Z as te,_ as pe,b as Re,et as g,g as Be,h as qe,j as ae,l as R,m as A,nt as Fe,p as Pe,q as me,t as $,x as q,y as Ae,z as D}from"./client.BLHVEdAV.js";import{t as I}from"./LocalIcon.Gi2SHDVG.js";import{n as Y,t as O}from"./translation.DX9TqyXn.js";import{o as de}from"./config.BuOFpMPB.js";import{t as _}from"./musicPlayerStore.BF4codw5.js";import{a as ve,c as Ne,i as Ke,l as Xe,n as je,o as We,r as Ue,s as Ye,t as Oe}from"./SidebarTrackInfo.BHEII11B.js";function Ge(o){const e=o-1;return e*e*e+1}function Ce(o){const e=o-1;return e*e*e+1}function ye(o){const e=typeof o=="string"&&o.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[o,"px"]}function ne(o,e,t){return Number.isNaN(e)?"":`${o}: ${t*e}px;`}function Je(o,{delay:e=0,duration:t=400,easing:u=Ce,x:r=0,y:a=0,opacity:b=0}={}){const s=getComputedStyle(o),p=+s.opacity,i=s.transform==="none"?"":s.transform,c=p*(1-b),[v,f]=ye(r),[w,C]=ye(a);return{delay:e,duration:t,easing:u,css:(l,L)=>`
			transform: ${i} translate(${(1-l)*v}${f}, ${(1-l)*w}${C});
			opacity: ${p-c*L}`}}function Qe(o,{delay:e=0,duration:t=400,easing:u=Ce,axis:r="y"}={}){const a=getComputedStyle(o),b=+a.opacity,s=r==="y"?"height":"width",p=parseFloat(a[s]),i=r==="y"?["top","bottom"]:["left","right"],c=i.map(h=>`${h[0].toUpperCase()}${h.slice(1)}`),v=parseFloat(a[`padding${c[0]}`]),f=parseFloat(a[`padding${c[1]}`]),w=parseFloat(a[`margin${c[0]}`]),C=parseFloat(a[`margin${c[1]}`]),l=parseFloat(a[`border${c[0]}Width`]),L=parseFloat(a[`border${c[1]}Width`]);return{delay:e,duration:t,easing:u,css:h=>`overflow: hidden;opacity: ${Math.min(h*20,1)*b};`+ne(s,p,h)+ne(`padding-${i[0]}`,v,h)+ne(`padding-${i[1]}`,f,h)+ne(`margin-${i[0]}`,w,h)+ne(`margin-${i[1]}`,C,h)+ne(`border-${i[0]}-width`,l,h)+ne(`border-${i[1]}-width`,L,h)+`min-${s}: 0`}}var Ze=S('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function $e(o,e){ee(e,!0);let t=ge(_e(_.getState())),u=ge(!1);function r(E){const H=E;H.detail&&me(t,H.detail,!0)}we(()=>{window.addEventListener("music-sidebar:state",r)}),ke(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",r)});function a(){_.toggle()}function b(){_.prev()}function s(){_.next()}function p(){_.toggleMode()}function i(){me(u,!n(u))}function c(E){_.playIndex(E)}function v(E){_.seek(E)}function f(){_.toggleMute()}function w(E){_.setVolume(E)}var C=Ze(),l=m(C),L=m(l);Ke(L,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}});var h=y(L,2);Oe(h,{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:f,onSetVolume:w}),g(l);var V=y(l,2);je(V,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:v});var P=y(V,2);We(P,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:p,onPrev:b,onNext:s,onTogglePlay:a,onTogglePlaylist:i});var d=y(P,2);Ue(d,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(u)},onClose:i,onPlaySong:c}),g(C),k(o,C),te()}var et=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),tt=S('<div class="text-xs text-30 mt-1"> </div>'),nt=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function be(o,e){ee(e,!0);const t=$(e,"showTime",3,!1),u=$(e,"size",3,"mini");function r(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var a=ae(),b=Z(a),s=i=>{var c=et(),v=m(c),f=F(v,!0),w=y(v,2),C=F(w,!0);g(c),D(()=>{W(f,e.song.title),W(C,e.song.artist)}),k(i,c)},p=i=>{var c=nt(),v=m(c),f=F(v,!0),w=y(v,2),C=F(w,!0),l=y(w,2),L=h=>{var V=tt(),P=F(V);D((d,E)=>W(P,`${d??""} / ${E??""}`),[()=>r(e.currentTime),()=>r(e.duration)]),k(h,V)};q(l,h=>{t()&&h(L)}),g(c),D(()=>{W(f,e.song.title),W(C,e.song.artist)}),k(i,c)};q(b,i=>{u()==="mini"?i(s):i(p,-1)}),k(o,a),te()}var it=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),rt=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),at=S("<!> <!> <!>",1),ot=S("<div><!></div>");function Se(o,e){ee(e,!0);const t=$(e,"size",3,"mini"),u=$(e,"showControls",3,!1),r=$(e,"showPlaylist",3,!1);var a=ot(),b=m(a),s=i=>{var c=it(),v=Z(c);ve(v,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var f=y(v,2),w=m(f);be(w,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),g(f);var C=y(f,2),l=m(C),L=m(l);I(L,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(l);var h=y(l,2),V=m(h);I(V,{icon:"material-symbols:expand-less",class:"text-lg"}),g(h),g(C),D((P,d)=>{R(f,"aria-label",P),R(l,"title",d)},[()=>O(Y.musicPlayerExpand),()=>O(Y.musicPlayerHide)]),z("click",f,function(...P){e.onInfoClick?.apply(this,P)}),z("keydown",f,P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),e.onInfoClick?.())}),z("click",l,P=>{P.stopPropagation(),e.onHideClick?.()}),z("click",h,P=>{P.stopPropagation(),e.onExpandClick?.()}),k(i,c)},p=i=>{var c=at(),v=Z(c);ve(v,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var f=y(v,2);be(f,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var w=y(f,2),C=l=>{var L=rt(),h=m(L),V=m(h);I(V,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(h);var P=y(h,2);let d;var E=m(P);I(E,{icon:"material-symbols:queue-music",class:"text-lg"}),g(P),g(L),D((H,ue)=>{R(h,"title",H),d=A(P,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,d,{"text-[var(--primary)]":r()}),R(P,"title",ue)},[()=>O(Y.musicPlayerHide),()=>O(Y.musicPlayerPlaylist)]),z("click",h,function(...H){e.onHideClick?.apply(this,H)}),z("click",P,function(...H){e.onPlaylistClick?.apply(this,H)}),k(l,L)};q(w,l=>{u()&&l(C)}),k(i,c)};q(b,i=>{t()==="mini"?i(s):i(p,-1)}),g(a),D(()=>A(a,1,qe(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),k(o,a),te()}G(["click","keydown"]);var lt=S("<div><!></div>");function st(o,e){var t=lt();let u;var r=m(t);Se(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),g(t),D(()=>u=A(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,u,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),k(o,t)}var he=S("<button><!></button>");function xe(o,e){const t=$(e,"repeatMode",3,0),u=$(e,"disabled",3,!1);var r=ae(),a=Z(r),b=p=>{var i=he();let c;var v=m(i);I(v,{icon:"material-symbols:shuffle",class:"text-lg"}),g(i),D(()=>{c=A(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=u()}),z("click",i,function(...f){e.onclick?.apply(this,f)}),k(p,i)},s=p=>{var i=he();let c;var v=m(i),f=l=>{I(l,{icon:"material-symbols:repeat-one",class:"text-lg"})},w=l=>{I(l,{icon:"material-symbols:repeat",class:"text-lg"})},C=l=>{I(l,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};q(v,l=>{t()===1?l(f):t()===2?l(w,1):l(C,-1)}),g(i),D(()=>c=A(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),z("click",i,function(...l){e.onclick?.apply(this,l)}),k(p,i)};q(a,p=>{e.mode==="shuffle"?p(b):p(s,-1)}),k(o,r)}G(["click"]);var ut=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ct(o,e){var t=ut(),u=m(t);xe(u,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var r=y(u,2);Ye(r,{get onclick(){return e.onPrevClick},disabled:!1});var a=y(r,2);Ne(a,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var b=y(a,2);Xe(b,{get onclick(){return e.onNextClick},disabled:!1});var s=y(b,2);{let p=ie(()=>e.isRepeating>0);xe(s,{mode:"repeat",get isActive(){return n(p)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}g(t),k(o,t)}var dt=S('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function gt(o,e){ee(e,!0);var t=dt(),u=F(t);D(r=>{R(t,"aria-label",r),R(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),Pe(u,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>O(Y.musicPlayerProgress)]),z("click",t,function(...r){e.onclick?.apply(this,r)}),z("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),k(o,t),te()}G(["click","keydown"]);var mt=S('<div class="progress-section mb-4"><!></div>');function vt(o,e){var t=mt(),u=m(t);gt(u,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),g(t),k(o,t)}var ft=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function yt(o,e){var t=ft(),u=m(t),r=s=>{I(s,{icon:"material-symbols:volume-off",class:"text-lg"})},a=s=>{I(s,{icon:"material-symbols:volume-down",class:"text-lg"})},b=s=>{I(s,{icon:"material-symbols:volume-up",class:"text-lg"})};q(u,s=>{e.isMuted||e.volume===0?s(r):e.volume<.5?s(a,1):s(b,-1)}),g(t),z("click",t,function(...s){e.onclick?.apply(this,s)}),k(o,t)}G(["click"]);var bt=S('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function ht(o,e){var t=bt(),u=m(t);let r;g(t),Be(t,a=>e.volumeBarRef?.(a)),D(()=>{R(t,"aria-label",e.ariaLabel),R(t,"aria-valuenow",e.volume*100),r=A(u,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,r,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),Pe(u,`width: ${e.volume*100}%`)}),z("pointerdown",t,function(...a){e.onpointerdown?.apply(this,a)}),z("keydown",t,function(...a){e.onkeydown?.apply(this,a)}),k(o,t)}G(["pointerdown","keydown"]);var xt=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function wt(o,e){var t=xt(),u=m(t);yt(u,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var r=y(u,2);{let b=ie(()=>e.isMuted?0:e.volume);ht(r,{get volume(){return n(b)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var a=y(r,2);Ve(a,()=>e.children??Fe),g(t),k(o,t)}var _t=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),kt=S("<div><!> <!> <!> <!></div>");function pt(o,e){ee(e,!0);var t=kt();let u;var r=m(t);Se(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var a=y(r,2);vt(a,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var b=y(a,2);ct(b,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var s=y(b,2);{let p=ie(()=>O(Y.musicPlayerVolume));wt(s,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(p)},children:(i,c)=>{var v=_t(),f=m(v);I(f,{icon:"material-symbols:expand-more",class:"text-lg"}),g(v),D(w=>R(v,"title",w),[()=>O(Y.musicPlayerCollapse)]),z("click",v,function(...w){e.onCollapseClick?.apply(this,w)}),k(i,v)},$$slots:{default:!0}})}g(t),D(()=>u=A(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,u,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),k(o,t),te()}G(["click"]);var Pt=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ct=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function St(o,e){ee(e,!0);const t=$(e,"lazy",3,!0);function u(d){return d.startsWith("http://")||d.startsWith("https://")||d.startsWith("/")?d:`/${d}`}var r=Ct();let a;var b=m(r),s=m(b),p=d=>{I(d,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=d=>{I(d,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},c=d=>{var E=Pt(),H=F(E,!0);D(()=>W(H,e.index+1)),k(d,E)};q(s,d=>{e.isCurrent&&e.isPlaying?d(p):e.isCurrent?d(i,1):d(c,-1)}),g(b);var v=y(b,2),f=F(v),w=y(v,2),C=m(w);let l;var L=F(C,!0),h=y(C,2);let V;var P=F(h,!0);g(w),g(r),D(d=>{a=A(r,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,a,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),R(r,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),R(f,"src",d),R(f,"alt",e.song.title),R(f,"loading",t()?"lazy":"eager"),l=A(C,1,"font-medium truncate",null,l,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),W(L,e.song.title),V=A(h,1,"text-sm text-[var(--content-meta)] truncate",null,V,{"text-[var(--primary)]":e.isCurrent}),W(P,e.song.artist)},[()=>u(e.song.cover)]),z("click",r,function(...d){e.onclick?.apply(this,d)}),z("keydown",r,d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),e.onclick())}),k(o,r),te()}G(["click","keydown"]);var Tt=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Mt(o,e){ee(e,!0);var t=ae(),u=Z(t),r=a=>{var b=Tt(),s=m(b),p=m(s),i=F(p,!0),c=y(p,2),v=m(c);I(v,{icon:"material-symbols:close",class:"text-lg"}),g(c),g(s);var f=y(s,2);Ae(f,21,()=>e.playlist,Re,(w,C,l)=>{{let L=ie(()=>l===e.currentIndex);St(w,{get song(){return n(C)},index:l,get isCurrent(){return n(L)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(l),lazy:l!==0})}}),g(f),g(b),D(w=>W(i,w),[()=>O(Y.musicPlayerPlaylist)]),z("click",c,function(...w){e.onClose?.apply(this,w)}),pe(3,b,()=>Qe,()=>({duration:300,axis:"y"})),k(a,b)};q(u,a=>{e.show&&a(r)}),k(o,t),te()}G(["click"]);var Lt=S('<div class="fixed bottom-20 right-4 z-[60] max-w-sm" role="alert" aria-live="assertive"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button type="button" class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Et=S('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),zt=S("<div><div><!></div> <!> <!> <!></div>"),Dt=S(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (max-width: 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (max-width: 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function Nt(o,e){ee(e,!0);let t=ge(_e(_.getState()));const u=de.showFloatingPlayer,r=(de.floatingEntryMode??"default")==="fab",a=u&&de.enable,b=O(Y.announcementClose);let s;function p(){_.toggle()}function i(){_.prev()}function c(){_.next()}function v(){_.toggleShuffle()}function f(){_.toggleRepeat()}function w(x){_.playIndex(x)}function C(x){const T=x.currentTarget;if(!T)return;const U=T.getBoundingClientRect(),j=(x.clientX-U.left)/U.width;_.setProgress(j)}function l(x){(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),_.setProgress(.5))}function L(){_.toggleMute()}function h(){_.toggleMute()}function V(x){const T=x.currentTarget;if(!T)return;const U=M=>{const N=T.getBoundingClientRect();if(N.width<=0)return;const K=Math.max(0,Math.min(1,(M-N.left)/N.width));_.setVolume(K)};U(x.clientX);const j=x.pointerId;T.setPointerCapture(j);const oe=M=>{M.pointerId===j&&U(M.clientX)},le=()=>{T.removeEventListener("pointermove",oe),T.removeEventListener("pointerup",se),T.removeEventListener("pointercancel",B),T.hasPointerCapture(j)&&T.releasePointerCapture(j)},se=M=>{M.pointerId===j&&(U(M.clientX),le())},B=M=>{M.pointerId===j&&le()};T.addEventListener("pointermove",oe),T.addEventListener("pointerup",se),T.addEventListener("pointercancel",B)}function P(x){const T=x.target;if(!(T?.tagName==="INPUT"||T?.tagName==="TEXTAREA"||T?.contentEditable==="true")){if(x.key==="ArrowLeft"||x.key==="ArrowDown"){x.preventDefault(),_.setVolume(n(t).volume-.05);return}if(x.key==="ArrowRight"||x.key==="ArrowUp"){x.preventDefault(),_.setVolume(n(t).volume+.05);return}(x.key==="Enter"||x.key===" "||x.key==="m"||x.key==="M")&&(x.preventDefault(),L())}}function d(){_.togglePlaylist()}function E(){_.toggleExpanded()}function H(){_.toggleHidden()}function ue(){_.hideError()}function Te(x){}function Me(){return _.canSkip()}we(()=>{s=_.subscribe(x=>{me(t,x,!0)}),_.initialize()}),ke(()=>{s&&s(),_.destroy()});var fe=ae();Ie("keydown",He,P);var Le=Z(fe),Ee=x=>{var T=Dt(),U=Z(T),j=B=>{var M=Lt(),N=m(M),K=m(N);I(K,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var J=y(K,2),Q=F(J,!0),X=y(J,2),re=m(X);I(re,{icon:"material-symbols:close",class:"text-lg"}),g(X),g(N),g(M),D(()=>{W(Q,n(t).errorMessage),R(X,"aria-label",b)}),z("click",X,ue),k(B,M)};q(U,B=>{n(t).showError&&B(j)});var oe=y(U,2),le=B=>{var M=ae(),N=Z(M),K=J=>{var Q=Et(),X=m(Q),re=m(X);$e(re,{}),g(X),g(Q),pe(3,X,()=>Je,()=>({y:16,duration:280,opacity:.12,easing:Ge})),k(J,Q)};q(N,J=>{n(t).isExpanded&&J(K)}),k(B,M)},se=B=>{var M=zt();let N;var K=m(M),J=m(K);ve(J,{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:H}),g(K);var Q=y(K,2);{let ce=ie(()=>n(t).isExpanded||n(t).isHidden);st(Q,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(ce)},onCoverClick:p,onInfoClick:E,onHideClick:H,onExpandClick:E})}var X=y(Q,2);{let ce=ie(Me),ze=ie(()=>!n(t).isExpanded);pt(X,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(ce)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(ze)},volumeBarRef:Te,onPlayClick:p,onPrevClick:i,onNextClick:()=>c(),onShuffleClick:v,onRepeatClick:f,onProgressClick:C,onProgressKeyDown:l,onVolumeButtonClick:h,onSliderPointerDown:V,onSliderKeyDown:P,onHideClick:H,onPlaylistClick:d,onCollapseClick:E})}var re=y(X,2);Mt(re,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:d,onPlaySong:w}),g(M),D(()=>{N=A(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,N,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),A(K,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),k(B,M)};q(oe,B=>{r?B(le):B(se,-1)}),De(2),k(x,T)};q(Le,x=>{a&&x(Ee)}),k(o,fe),te()}G(["click"]);export{Nt as default};
