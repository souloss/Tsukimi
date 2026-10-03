import"./disclose-version.DwdwGuwu.js";import{$ as ze,A as k,C as we,F as z,G as b,H as m,I as De,J as ge,K as _e,L as n,M as S,O as W,P as Y,Q as ee,S as ke,T as Ie,U as Z,V as Ve,W as F,X as ie,Z as te,_ as pe,b as He,et as g,g as Re,h as Be,j as ae,l as R,m as A,nt as qe,p as Pe,q as me,t as $,x as B,y as Fe,z as D}from"./client.BLHVEdAV.js";import{t as I}from"./LocalIcon.Gi2SHDVG.js";import{n as J,t as Q}from"./translation.JYFYtCfe.js";import{o as de}from"./config.CgWr9cY3.js";import{t as _}from"./musicPlayerStore.C_NhqncZ.js";import{a as ve,c as Ae,i as Ne,l as Ke,n as Xe,o as je,r as We,s as Ue,t as Ye}from"./SidebarTrackInfo.BB0wAvLn.js";function Oe(o){const e=o-1;return e*e*e+1}function Ce(o){const e=o-1;return e*e*e+1}function ye(o){const e=typeof o=="string"&&o.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[o,"px"]}function ne(o,e,t){return Number.isNaN(e)?"":`${o}: ${t*e}px;`}function Ge(o,{delay:e=0,duration:t=400,easing:s=Ce,x:r=0,y:a=0,opacity:v=0}={}){const u=getComputedStyle(o),p=+u.opacity,i=u.transform==="none"?"":u.transform,c=p*(1-v),[f,y]=ye(r),[w,C]=ye(a);return{delay:e,duration:t,easing:s,css:(l,L)=>`
			transform: ${i} translate(${(1-l)*f}${y}, ${(1-l)*w}${C});
			opacity: ${p-c*L}`}}function Je(o,{delay:e=0,duration:t=400,easing:s=Ce,axis:r="y"}={}){const a=getComputedStyle(o),v=+a.opacity,u=r==="y"?"height":"width",p=parseFloat(a[u]),i=r==="y"?["top","bottom"]:["left","right"],c=i.map(h=>`${h[0].toUpperCase()}${h.slice(1)}`),f=parseFloat(a[`padding${c[0]}`]),y=parseFloat(a[`padding${c[1]}`]),w=parseFloat(a[`margin${c[0]}`]),C=parseFloat(a[`margin${c[1]}`]),l=parseFloat(a[`border${c[0]}Width`]),L=parseFloat(a[`border${c[1]}Width`]);return{delay:e,duration:t,easing:s,css:h=>`overflow: hidden;opacity: ${Math.min(h*20,1)*v};`+ne(u,p,h)+ne(`padding-${i[0]}`,f,h)+ne(`padding-${i[1]}`,y,h)+ne(`margin-${i[0]}`,w,h)+ne(`margin-${i[1]}`,C,h)+ne(`border-${i[0]}-width`,l,h)+ne(`border-${i[1]}-width`,L,h)+`min-${u}: 0`}}var Qe=S('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function Ze(o,e){ee(e,!0);let t=ge(_e(_.getState())),s=ge(!1);function r(E){const q=E;q.detail&&me(t,q.detail,!0)}we(()=>{window.addEventListener("music-sidebar:state",r)}),ke(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",r)});function a(){_.toggle()}function v(){_.prev()}function u(){_.next()}function p(){_.toggleMode()}function i(){me(s,!n(s))}function c(E){_.playIndex(E)}function f(E){_.seek(E)}function y(){_.toggleMute()}function w(E){_.setVolume(E)}var C=Qe(),l=m(C),L=m(l);Ne(L,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}});var h=b(L,2);Ye(h,{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:y,onSetVolume:w}),g(l);var V=b(l,2);Xe(V,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:f});var P=b(V,2);je(P,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:p,onPrev:v,onNext:u,onTogglePlay:a,onTogglePlaylist:i});var d=b(P,2);We(d,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(s)},onClose:i,onPlaySong:c}),g(C),k(o,C),te()}var $e=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),et=S('<div class="text-xs text-30 mt-1"> </div>'),tt=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function be(o,e){ee(e,!0);const t=$(e,"showTime",3,!1),s=$(e,"size",3,"mini");function r(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var a=ae(),v=Z(a),u=i=>{var c=$e(),f=m(c),y=F(f,!0),w=b(f,2),C=F(w,!0);g(c),D(()=>{W(y,e.song.title),W(C,e.song.artist)}),k(i,c)},p=i=>{var c=tt(),f=m(c),y=F(f,!0),w=b(f,2),C=F(w,!0),l=b(w,2),L=h=>{var V=et(),P=F(V);D((d,E)=>W(P,`${d??""} / ${E??""}`),[()=>r(e.currentTime),()=>r(e.duration)]),k(h,V)};B(l,h=>{t()&&h(L)}),g(c),D(()=>{W(y,e.song.title),W(C,e.song.artist)}),k(i,c)};B(v,i=>{s()==="mini"?i(u):i(p,-1)}),k(o,a),te()}var nt=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),it=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),rt=S("<!> <!> <!>",1),at=S("<div><!></div>");function Se(o,e){ee(e,!0);const t=$(e,"size",3,"mini"),s=$(e,"showControls",3,!1),r=$(e,"showPlaylist",3,!1);var a=at(),v=m(a),u=i=>{var c=nt(),f=Z(c);ve(f,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var y=b(f,2),w=m(y);be(w,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),g(y);var C=b(y,2),l=m(C),L=m(l);I(L,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(l);var h=b(l,2),V=m(h);I(V,{icon:"material-symbols:expand-less",class:"text-lg"}),g(h),g(C),D((P,d)=>{R(y,"aria-label",P),R(l,"title",d)},[()=>Q(J.musicPlayerExpand),()=>Q(J.musicPlayerHide)]),z("click",y,function(...P){e.onInfoClick?.apply(this,P)}),z("keydown",y,P=>{(P.key==="Enter"||P.key===" ")&&(P.preventDefault(),e.onInfoClick?.())}),z("click",l,P=>{P.stopPropagation(),e.onHideClick?.()}),z("click",h,P=>{P.stopPropagation(),e.onExpandClick?.()}),k(i,c)},p=i=>{var c=rt(),f=Z(c);ve(f,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var y=b(f,2);be(y,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var w=b(y,2),C=l=>{var L=it(),h=m(L),V=m(h);I(V,{icon:"material-symbols:visibility-off",class:"text-lg"}),g(h);var P=b(h,2);let d;var E=m(P);I(E,{icon:"material-symbols:queue-music",class:"text-lg"}),g(P),g(L),D((q,ue)=>{R(h,"title",q),d=A(P,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,d,{"text-[var(--primary)]":r()}),R(P,"title",ue)},[()=>Q(J.musicPlayerHide),()=>Q(J.musicPlayerPlaylist)]),z("click",h,function(...q){e.onHideClick?.apply(this,q)}),z("click",P,function(...q){e.onPlaylistClick?.apply(this,q)}),k(l,L)};B(w,l=>{s()&&l(C)}),k(i,c)};B(v,i=>{t()==="mini"?i(u):i(p,-1)}),g(a),D(()=>A(a,1,Be(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),k(o,a),te()}Y(["click","keydown"]);var ot=S("<div><!></div>");function lt(o,e){var t=ot();let s;var r=m(t);Se(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),g(t),D(()=>s=A(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-[17.5rem] svelte-g9ac72",null,s,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),k(o,t)}var he=S("<button><!></button>");function xe(o,e){const t=$(e,"repeatMode",3,0),s=$(e,"disabled",3,!1);var r=ae(),a=Z(r),v=p=>{var i=he();let c;var f=m(i);I(f,{icon:"material-symbols:shuffle",class:"text-lg"}),g(i),D(()=>{c=A(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=s()}),z("click",i,function(...y){e.onclick?.apply(this,y)}),k(p,i)},u=p=>{var i=he();let c;var f=m(i),y=l=>{I(l,{icon:"material-symbols:repeat-one",class:"text-lg"})},w=l=>{I(l,{icon:"material-symbols:repeat",class:"text-lg"})},C=l=>{I(l,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};B(f,l=>{t()===1?l(y):t()===2?l(w,1):l(C,-1)}),g(i),D(()=>c=A(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),z("click",i,function(...l){e.onclick?.apply(this,l)}),k(p,i)};B(a,p=>{e.mode==="shuffle"?p(v):p(u,-1)}),k(o,r)}Y(["click"]);var st=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ut(o,e){var t=st(),s=m(t);xe(s,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var r=b(s,2);Ue(r,{get onclick(){return e.onPrevClick},disabled:!1});var a=b(r,2);Ae(a,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var v=b(a,2);Ke(v,{get onclick(){return e.onNextClick},disabled:!1});var u=b(v,2);{let p=ie(()=>e.isRepeating>0);xe(u,{mode:"repeat",get isActive(){return n(p)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}g(t),k(o,t)}var ct=S('<div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"></div></div>');function dt(o,e){ee(e,!0);var t=ct(),s=F(t);D(r=>{R(t,"aria-label",r),R(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),Pe(s,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>Q(J.musicPlayerProgress)]),z("click",t,function(...r){e.onclick?.apply(this,r)}),z("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),k(o,t),te()}Y(["click","keydown"]);var gt=S('<div class="progress-section mb-4"><!></div>');function mt(o,e){var t=gt(),s=m(t);dt(s,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),g(t),k(o,t)}var vt=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function ft(o,e){var t=vt(),s=m(t),r=u=>{I(u,{icon:"material-symbols:volume-off",class:"text-lg"})},a=u=>{I(u,{icon:"material-symbols:volume-down",class:"text-lg"})},v=u=>{I(u,{icon:"material-symbols:volume-up",class:"text-lg"})};B(s,u=>{e.isMuted||e.volume===0?u(r):e.volume<.5?u(a,1):u(v,-1)}),g(t),z("click",t,function(...u){e.onclick?.apply(this,u)}),k(o,t)}Y(["click"]);var yt=S('<div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function bt(o,e){var t=yt(),s=m(t);let r;g(t),Re(t,a=>e.volumeBarRef?.(a)),D(()=>{R(t,"aria-label",e.ariaLabel),R(t,"aria-valuenow",e.volume*100),r=A(s,1,"h-full bg-[var(--primary)] rounded-full transition-all",null,r,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),Pe(s,`width: ${e.volume*100}%`)}),z("pointerdown",t,function(...a){e.onpointerdown?.apply(this,a)}),z("keydown",t,function(...a){e.onkeydown?.apply(this,a)}),k(o,t)}Y(["pointerdown","keydown"]);var ht=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function xt(o,e){var t=ht(),s=m(t);ft(s,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var r=b(s,2);{let v=ie(()=>e.isMuted?0:e.volume);bt(r,{get volume(){return n(v)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var a=b(r,2);Ie(a,()=>e.children??qe),g(t),k(o,t)}var wt=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),_t=S("<div><!> <!> <!> <!></div>");function kt(o,e){ee(e,!0);var t=_t();let s;var r=m(t);Se(r,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var a=b(r,2);mt(a,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var v=b(a,2);ut(v,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var u=b(v,2);{let p=ie(()=>Q(J.musicPlayerVolume));xt(u,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(p)},children:(i,c)=>{var f=wt(),y=m(f);I(y,{icon:"material-symbols:expand-more",class:"text-lg"}),g(f),D(w=>R(f,"title",w),[()=>Q(J.musicPlayerCollapse)]),z("click",f,function(...w){e.onCollapseClick?.apply(this,w)}),k(i,f)},$$slots:{default:!0}})}g(t),D(()=>s=A(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,s,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),k(o,t),te()}Y(["click"]);var pt=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),Pt=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function Ct(o,e){ee(e,!0);const t=$(e,"lazy",3,!0);function s(d){return d.startsWith("http://")||d.startsWith("https://")||d.startsWith("/")?d:`/${d}`}var r=Pt();let a;var v=m(r),u=m(v),p=d=>{I(d,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},i=d=>{I(d,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},c=d=>{var E=pt(),q=F(E,!0);D(()=>W(q,e.index+1)),k(d,E)};B(u,d=>{e.isCurrent&&e.isPlaying?d(p):e.isCurrent?d(i,1):d(c,-1)}),g(v);var f=b(v,2),y=F(f),w=b(f,2),C=m(w);let l;var L=F(C,!0),h=b(C,2);let V;var P=F(h,!0);g(w),g(r),D(d=>{a=A(r,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,a,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),R(r,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),R(y,"src",d),R(y,"alt",e.song.title),R(y,"loading",t()?"lazy":"eager"),l=A(C,1,"font-medium truncate",null,l,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),W(L,e.song.title),V=A(h,1,"text-sm text-[var(--content-meta)] truncate",null,V,{"text-[var(--primary)]":e.isCurrent}),W(P,e.song.artist)},[()=>s(e.song.cover)]),z("click",r,function(...d){e.onclick?.apply(this,d)}),z("keydown",r,d=>{(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),e.onclick())}),k(o,r),te()}Y(["click","keydown"]);var St=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Tt(o,e){ee(e,!0);var t=ae(),s=Z(t),r=a=>{var v=St(),u=m(v),p=m(u),i=F(p,!0),c=b(p,2),f=m(c);I(f,{icon:"material-symbols:close",class:"text-lg"}),g(c),g(u);var y=b(u,2);Fe(y,21,()=>e.playlist,He,(w,C,l)=>{{let L=ie(()=>l===e.currentIndex);Ct(w,{get song(){return n(C)},index:l,get isCurrent(){return n(L)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(l),lazy:l!==0})}}),g(y),g(v),D(w=>W(i,w),[()=>Q(J.musicPlayerPlaylist)]),z("click",c,function(...w){e.onClose?.apply(this,w)}),pe(3,v,()=>Je,()=>({duration:300,axis:"y"})),k(a,v)};B(s,a=>{e.show&&a(r)}),k(o,t),te()}Y(["click"]);var Mt=S('<div class="fixed bottom-20 right-4 z-[60] max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Lt=S('<div class="music-player-fab-anchor fixed z-[55]"><div class="music-player-fab-shell"><!></div></div>'),Et=S("<div><div><!></div> <!> <!> <!></div>"),zt=S(`<!> <!> <style>.music-player-fab-anchor {
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
		}</style>`,1);function At(o,e){ee(e,!0);let t=ge(_e(_.getState()));const s=de.showFloatingPlayer,r=(de.floatingEntryMode??"default")==="fab",a=s&&de.enable;let v;function u(){_.toggle()}function p(){_.prev()}function i(){_.next()}function c(){_.toggleShuffle()}function f(){_.toggleRepeat()}function y(x){_.playIndex(x)}function w(x){const T=x.currentTarget;if(!T)return;const U=T.getBoundingClientRect(),X=(x.clientX-U.left)/U.width;_.setProgress(X)}function C(x){(x.key==="Enter"||x.key===" ")&&(x.preventDefault(),_.setProgress(.5))}function l(){_.toggleMute()}function L(){_.toggleMute()}function h(x){const T=x.currentTarget;if(!T)return;const U=M=>{const N=T.getBoundingClientRect();if(N.width<=0)return;const K=Math.max(0,Math.min(1,(M-N.left)/N.width));_.setVolume(K)};U(x.clientX);const X=x.pointerId;T.setPointerCapture(X);const oe=M=>{M.pointerId===X&&U(M.clientX)},le=()=>{T.removeEventListener("pointermove",oe),T.removeEventListener("pointerup",se),T.removeEventListener("pointercancel",H),T.hasPointerCapture(X)&&T.releasePointerCapture(X)},se=M=>{M.pointerId===X&&(U(M.clientX),le())},H=M=>{M.pointerId===X&&le()};T.addEventListener("pointermove",oe),T.addEventListener("pointerup",se),T.addEventListener("pointercancel",H)}function V(x){const T=x.target;if(!(T?.tagName==="INPUT"||T?.tagName==="TEXTAREA"||T?.contentEditable==="true")){if(x.key==="ArrowLeft"||x.key==="ArrowDown"){x.preventDefault(),_.setVolume(n(t).volume-.05);return}if(x.key==="ArrowRight"||x.key==="ArrowUp"){x.preventDefault(),_.setVolume(n(t).volume+.05);return}(x.key==="Enter"||x.key===" "||x.key==="m"||x.key==="M")&&(x.preventDefault(),l())}}function P(){_.togglePlaylist()}function d(){_.toggleExpanded()}function E(){_.toggleHidden()}function q(){_.hideError()}function ue(x){}function Te(){return _.canSkip()}we(()=>{v=_.subscribe(x=>{me(t,x,!0)}),_.initialize()}),ke(()=>{v&&v(),_.destroy()});var fe=ae();De("keydown",Ve,V);var Me=Z(fe),Le=x=>{var T=zt(),U=Z(T),X=H=>{var M=Mt(),N=m(M),K=m(N);I(K,{icon:"material-symbols:error",class:"text-xl flex-shrink-0"});var O=b(K,2),G=F(O,!0),j=b(O,2),re=m(j);I(re,{icon:"material-symbols:close",class:"text-lg"}),g(j),g(N),g(M),D(()=>W(G,n(t).errorMessage)),z("click",j,q),k(H,M)};B(U,H=>{n(t).showError&&H(X)});var oe=b(U,2),le=H=>{var M=ae(),N=Z(M),K=O=>{var G=Lt(),j=m(G),re=m(j);Ze(re,{}),g(j),g(G),pe(3,j,()=>Ge,()=>({y:16,duration:280,opacity:.12,easing:Oe})),k(O,G)};B(N,O=>{n(t).isExpanded&&O(K)}),k(H,M)},se=H=>{var M=Et();let N;var K=m(M),O=m(K);ve(O,{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:E}),g(K);var G=b(K,2);{let ce=ie(()=>n(t).isExpanded||n(t).isHidden);lt(G,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(ce)},onCoverClick:u,onInfoClick:d,onHideClick:E,onExpandClick:d})}var j=b(G,2);{let ce=ie(Te),Ee=ie(()=>!n(t).isExpanded);kt(j,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(ce)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(Ee)},volumeBarRef:ue,onPlayClick:u,onPrevClick:p,onNextClick:()=>i(),onShuffleClick:c,onRepeatClick:f,onProgressClick:w,onProgressKeyDown:C,onVolumeButtonClick:L,onSliderPointerDown:h,onSliderKeyDown:V,onHideClick:E,onPlaylistClick:P,onCollapseClick:d})}var re=b(j,2);Tt(re,{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:P,onPlaySong:y}),g(M),D(()=>{N=A(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,N,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),A(K,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),k(H,M)};B(oe,H=>{r?H(le):H(se,-1)}),ze(2),k(x,T)};B(Me,x=>{a&&x(Le)}),k(o,fe),te()}Y(["click"]);export{At as default};
